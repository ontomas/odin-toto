const modals = (() => {
  // DOM
  const container = document.getElementById("modals");
  let addTask, addProject, editProject, editTask;

  // Methods
  const renderAddTask = () => {
    const modal = `
      <div
      class="modal fade"
      id="add-task-modal"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Add New Task</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <form id="add-task">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="project" class="form-label">Project:</label>
                  <select
                    id="task-project"
                    class="form-select text-capitalize"
                    name="project"
                  ></select>
                </div>
                <div class="mb-3">
                  <label for="title" class="form-label">Title: </label>
                  <input
                    id="task-title"
                    class="form-control"
                    type="text"
                    name="title"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="title" class="form-label">Description:</label>
                  <textarea
                    id="task-description"
                    class="form-control"
                    name="description"
                    cols="30"
                    rows="2"
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label for="start" class="form-label">Due date:</label>
                  <input
                    id="task-date"
                    class="form-control"
                    type="date"
                    name="date"
                    min="2020-01-01"
                    max="2025-12-31"
                  />
                </div>
                <div>
                  <label for="priority" class="form-label">Prio</label>
                  <select id="task-priority" class="form-select" name="priority">
                    <option value=""></option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += modal;
    addTask = new bootstrap.Modal(document.getElementById("add-task-modal"), {
      backdrop: "static",
    });
    addTask.show();
  };

  const renderAddProject = () => {
    const modal = `
      <div
      class="modal fade"
      id="add-project-modal"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">Add a Project</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <form id="add-project">
              <div class="modal-body">
                <div>
                  <label for="title" class="form-label">Title: </label>
                  <input
                    class="form-control"
                    type="text"
                    name="title"
                    id="project-title"
                    required
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += modal;
    addProject = new bootstrap.Modal(
      document.getElementById("add-project-modal"),
      {
        backdrop: "static",
      }
    );
    addProject.show();
  };

  const renderEditProject = (e) => {
    const modal = `
          <div
          class="modal fade"
          id="edit-project-modal"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">Edit a Project</h5>
                  <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                  ></button>
                </div>
                <form id="edit-project-form">
                  <div class="modal-body">
                    <div>
                      <label for="title" class="form-label">Title: </label>
                      <input
                        class="form-control"
                        type="text"
                        name="title"
                        id="project-title-edit"
                        value=${e.target.dataset.project}
                        required
                      />
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button id="remove-project" class="btn btn-outline-danger">
                      Remove
                    </button>
                    <button class="btn btn-primary" type="submit">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;
    container.innerHTML += modal;
    editProject = new bootstrap.Modal(
      document.getElementById("edit-project-modal"),
      {
        backdrop: "static",
      }
    );
    editProject.show();
  };

  const renderEditTask = (e, data) => {
    let index, modal;
    data.forEach((project) => {
      if (project.title === e.dataset.project) {
        index = project.tasks.findIndex((task) => task.id === e.dataset.taskid);
        const task = project.tasks[index];
        modal = `
          <div
          class="modal fade"
          id="edit-task-modal"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">Edit a Task</h5>
                  <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                  ></button>
                </div>
                <form id="edit-task-form" data-task="${task.id}">
                  <div class="modal-body">
                    <div class="mb-3">
                      <label for="project" class="form-label">Project:</label>
                      <select
                        id="task-project"
                        class="form-select text-capitalize"
                        name="project"
                      ></select>
                    </div>
                    <div class="mb-3">
                      <label for="title" class="form-label">Title: </label>
                      <input
                        id="task-title"
                        class="form-control"
                        type="text"
                        name="title"
                        required
                        value="${task.title}"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="title" class="form-label">Description:</label>
                      <textarea
                        id="task-description"
                        class="form-control"
                        name="description"
                        cols="30"
                        rows="2"
                      >${task.description}</textarea>
                    </div>
                    <div class="mb-3">
                      <label for="start" class="form-label">Due date:</label>
                      <input
                        id="task-date"
                        class="form-control"
                        type="date"
                        name="date"
                        min="2020-01-01"
                        max="2025-12-31"
                        value="${task.dueDate}"
                      />
                    </div>
                    <div>
                      <label for="priority" class="form-label">Prio</label>
                      <select id="task-priority" class="form-select" name="priority">
                        <option value=""></option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button id="remove-task" class="btn btn-outline-danger" type="button">
                      Remove
                    </button>
                    <button class="btn btn-primary" type="submit">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        `;
      }
    });
    container.innerHTML += modal;
    editTask = new bootstrap.Modal(document.getElementById(`edit-task-modal`), {
      backdrop: "static",
    });
    editTask.show();
  };

  const hideModal = (modalInput) => {
    const modal = {
      addTask: addTask,
      addProject: addProject,
      editProject: editProject,
      editTask: editTask,
    }[modalInput];
    modal.hide();
    setTimeout(() => {
      container.innerHTML = "";
    }, 500);
  };

  return {
    renderEditProject,
    renderAddProject,
    hideModal,
    renderEditTask,
    renderAddTask,
    container,
  };
})();

export default modals;
