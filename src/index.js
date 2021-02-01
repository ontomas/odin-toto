/*
- ikvepimui: https://www.youtube.com/watch?v=JaMCxVWtW58

- [ ] modals are not closing on X
- [ ] per daug globaliai aprėpiau event'us pargrįžti prie tų kuriuos galiu iškart paimti
*/

// import "./tailwind.css";
import "./style.css";
import { tasks, projects, modals } from "./scripts";
import { v4 as uuid } from "uuid";

(() => {
  // DOM
  // Values
  const data = JSON.parse(localStorage.getItem("data")) || [
    {
      id: uuid(),
      title: "inbox",
      tasks: [],
    },
  ];

  // Methods
  const appendProjectOptions = (activeSelect) => {
    const taskProject = document.getElementById("task-project");
    taskProject.innerHTML = "";
    projects.generateSelection(data, activeSelect).forEach((option) => {
      taskProject.appendChild(option);
    });
  };

  const submitTask = (e) => {
    e.preventDefault();
    const project = document.getElementById("task-project").value;
    tasks.create(
      data,
      project,
      document.getElementById("task-title").value,
      document.getElementById("task-description").value,
      document.getElementById("task-date").value,
      document.getElementById("task-priority").value
    );
    localStorage.setItem("data", JSON.stringify(data));
    // modals.hideModal("addTask");
    tasks.render(data, project);
    projects.render(data);
  };

  const submitProject = (e) => {
    e.preventDefault();
    const title = document.getElementById("project-title").value;
    const project = title.toLowerCase();
    projects.create(data, project);
    e.target.reset();
    localStorage.setItem("data", JSON.stringify(data));
    projects.render(data);
    tasks.render(data, project);
    projects.activate(project);
  };

  // init
  tasks.render(data, "inbox"); // inbox
  projects.render(data);

  // Events
  document.addEventListener("submit", (e) => {
    e.target.id === "add-project" && submitProject(e);
    e.target.id === "add-task" && submitTask(e);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.id) return;
    if (e.target.id === "add-task-btn") {
      modals.renderAddTask();
      appendProjectOptions();
      document.getElementById(
        "task-date"
      ).value = new Date().toISOString().substr(0, 10);
    }

    e.target.id === "add-project" && modals.renderAddProject();

    if (e.target.parentNode.parentNode.id === "projects") {
      const activeProject =
        e.target.tagName === "A"
          ? e.target.dataset.project
          : e.target.parentNode.dataset.project;
      projects.activate(activeProject);
      tasks.render(data, activeProject);
    }

    // mark completed
    if (e.target.classList.contains("js-complete")) {
      tasks.complete(e, data);
    }

    // project edit btn
    if (e.target.classList.contains("edit-project")) {
      const activeProject = e.target.dataset.project;
      // render modal
      modals.renderEditProject(e);
      // save button - update input value
      document
        .getElementById("edit-project-form")
        .addEventListener("submit", (e) => {
          e.preventDefault();
          const title = document.getElementById("project-title-edit").value;
          console.log(title);
          data.forEach((project) => {
            if (project.title === activeProject) {
              project.title = title;
            }
          });
          localStorage.setItem("data", JSON.stringify(data));
          modals.hide("editProject");
          modals.container.innerHTML = "";
          tasks.render(data, title);
          projects.render(data);
          appendProjectOptions();
          projects.activate(title);
        });

      // remove button - remove selected project from data
      document
        .getElementById("remove-project")
        .addEventListener("click", () => {
          data.forEach((project, index) => {
            if (project.title === activeProject) {
              data.splice(index, 1);
            }
          });
          localStorage.setItem("data", JSON.stringify(data));
          modals.hide("editProject");
          document.getElementById("modals").innerHTML = "";
          tasks.render(data, "inbox");
          projects.render(data);
          appendProjectOptions();
          projects.activate("inbox");
        });
    }

    // review task
    if (e.target.parentNode.classList.contains("js-task-review")) {
      modals.renderEditTask(e.target.parentNode, data);
      appendProjectOptions(e.target.parentNode.dataset.project);

      // save button - update input value
      const form = document.getElementById("edit-task-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        // get all the current values
        const projectName = document.getElementById("task-project").value;
        const title = document.getElementById("task-title").value;
        const desc = document.getElementById("task-description").value;
        const dueDate = document.getElementById("task-date").value;
        const prio = document.getElementById("task-priority").value;
        // find the task at hand
        data.forEach((project) => {
          if (project.title === projectName) {
            project.tasks.forEach((task) => {
              if (task.id === form.dataset.task) {
                task.title = title;
                task.description = desc;
                task.dueDate = dueDate;
                task.prio = prio;
              }
            });
          } else {
            // delete the task in the old project
            project.tasks.forEach((task, index) => {
              if (task.id === form.dataset.task) {
                project.tasks.splice(index, 1);
              }
            });
            // create in new location
            submitTask(e);
          }
        });
        // update it's values
        localStorage.setItem("data", JSON.stringify(data));
        modals.hideModal("editTask");
        tasks.render(data, projectName);
        projects.render(data);
        appendProjectOptions();
        projects.activate(projectName);
      });

      // remove button - remove selected task from data
      document.getElementById("remove-task").addEventListener("click", () => {
        const projectName = document.getElementById("task-project").value;
        data.forEach((project) => {
          if (project.title === projectName) {
            project.tasks.forEach((task, index) => {
              if (task.id === form.dataset.task) {
                project.tasks.splice(index, 1);
              }
            });
          }
        });
        localStorage.setItem("data", JSON.stringify(data));
        modals.hideModal("editTask");
        tasks.render(data, "inbox");
        projects.render(data);
      });
    }

    // close edit project modal and remove
    if (
      e.target.classList.contains("btn-close") &&
      e.target.closest("#edit-project-modal")
    ) {
      modals.hideModal("editProject");
    }

    // close task edit modal and remove
    if (
      e.target.classList.contains("btn-close") &&
      e.target.closest("#edit-task-modal")
    ) {
      modals.hideModal("editTask");
    }

    if (
      e.target.classList.contains("btn-close") &&
      e.target.closest("#add-task-modal")
    ) {
      modals.hideModal("addTask");
    }
    if (
      e.target.classList.contains("btn-close") &&
      e.target.closest("#add-project-modal")
    ) {
      modals.hideModal("addProject");
    }
  });
})();
