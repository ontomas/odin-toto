import { v4 as uuid } from "uuid";
import { formatDistance } from "date-fns";

const tasks = (() => {
  // DOM
  const container = document.getElementById("tasks");

  // Values
  const task = (title, description, dueDate, prio) => {
    const id = uuid();
    const completed = false;
    return { id, title, description, dueDate, prio, completed };
  };

  // Methods
  const _construct = (task, project) => {
    let priority;

    switch (task.prio) {
      case 1:
        priority = "❗️❗️❗️";
        break;
      case 2:
        priority = "❗️❗";
        break;
      case 3:
        priority = "❗️";
        break;
      default:
        priority = "";
        break;
    }

    return `
      <li class="w-100 mb-1">
        <div class="d-flex justify-content-between">
          <div class="d-flex">
            <button
              id="${task.id}"
              type="button"
              role="checkbox"
              class="btn btn-sm btn-task js-complete"
              data-project="${project}"
            >
              <div class="task-circle${
                task.completed ? " task-circle--checked" : ""
              }" data-project="${project}">
                <svg width="24" height="24">
                  <path
                    fill="currentColor"
                    d="M11.23 13.7l-2.15-2a.55.55 0 0 0-.74-.01l.03-.03a.46.46 0 0 0 0 .68L11.24 15l5.4-5.01a.45.45 0 0 0 0-.68l.02.03a.55.55 0 0 0-.73 0l-4.7 4.35z"
                  ></path>
                </svg>
              </div>
            </button>
            <div role="button" class="js-task-review" data-taskID="${
              task.id
            }" data-project="${project}">
              <p class="mb-0${
                task.completed ? " text-linethrough" : ""
              }">${priority} ${task.title}</p>
            </div>
          </div>
          <p class="mb-0${
            task.completed ? " d-none" : ""
          }">due ${formatDistance(new Date(task.dueDate), new Date(), {
      addSuffix: true,
    })}</p>
        </div>
      </li>
    `;
  };

  const create = (data, project, title, description, dueDate, prio) => {
    const newTask = task(title, description, dueDate, parseInt(prio));
    data.forEach((el) => {
      el.title === project && el.tasks.push(newTask);
    });
  };

  const complete = (e, data) => {
    let index;
    data.forEach((project) => {
      if (project.title === e.target.dataset.project) {
        index = project.tasks.findIndex((task) => task.id === e.target.id);
        project.tasks[index].completed = !project.tasks[index].completed;
      }
    });
    localStorage.setItem("data", JSON.stringify(data));
    e.target.parentNode.childNodes[3].firstElementChild.classList.toggle(
      "text-linethrough"
    );
    e.target.childNodes[1].classList.toggle("task-circle--checked");
  };

  const render = (data, project) => {
    const currentProject = data.filter((el) => el.title === project)[0];
    container.innerHTML = "";
    const titleWrapper = document.createElement("div");
    titleWrapper.classList.add(
      "d-flex",
      "justify-content-between",
      "flex-wrap",
      "flex-md-nowrap",
      "align-items-center",
      "py-3",
      "mb-3",
      "border-bottom"
    );
    const title = document.createElement("h2");
    title.classList.add("h2", "text-capitalize");
    title.textContent = currentProject.title;
    const editBtn = document.createElement("button");
    editBtn.classList.add(
      "edit-project",
      "btn",
      "btn-sm",
      "btn-outline-secondary"
    );
    editBtn.setAttribute("href", "#");
    editBtn.dataset.project = currentProject.title;
    const editBtnContent = document.createElement("i");
    editBtnContent.classList.add("fas", "fa-pen");
    editBtn.appendChild(editBtnContent);
    titleWrapper.appendChild(title);
    project !== "inbox" && titleWrapper.appendChild(editBtn);
    container.appendChild(titleWrapper);
    const taskItems = document.createElement("ul");
    taskItems.classList.add("nav");
    currentProject.tasks.map((task) => {
      taskItems.innerHTML += _construct(task, currentProject.title);
    });
    container.appendChild(taskItems);
  };

  return {
    create,
    render,
    complete,
    container,
  };
})();

export default tasks;
