import "./style.css";
import { tasks, projects, modals } from "./scripts";
import { v4 as uuid } from "uuid";

(() => {
  // DOM
  const addTaskBtn = document.getElementById("add-task");
  const addProjectBtn = document.getElementById("add-project");
  const projectsContainer = document.getElementById("projects");
  const tasksContainer = document.getElementById("tasks");

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
    modals.hide();
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
    modals.hide();
    projects.render(data);
    tasks.render(data, project);
    projects.activate(project);
  };

  const openNewTaskModal = () => {
    modals.renderAddTask();
    appendProjectOptions();
    document.getElementById(
      "task-date"
    ).value = new Date().toISOString().substr(0, 10);
  };

  const renderView = (e) => {
    if (e.target.matches("a")) {
      projects.activate(e.target.dataset.project);
      tasks.render(data, e.target.dataset.project);
    } else {
      return;
    }
  };

  const editProject = (e) => {
    const activeProject = e.target.dataset.project;
    modals.renderEditProject(e);

    // save button - update input value
    document
      .getElementById("edit-project-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("project-title-edit").value;
        data.forEach((project) => {
          if (project.title === activeProject) {
            project.title = title;
          }
        });
        localStorage.setItem("data", JSON.stringify(data));
        modals.hide();
        tasks.render(data, title);
        projects.render(data);
        projects.activate(title);
      });

    // remove button - remove selected project from data
    document.getElementById("remove-project").addEventListener("click", () => {
      data.forEach((project, index) => {
        if (project.title === activeProject) {
          data.splice(index, 1);
        }
      });
      localStorage.setItem("data", JSON.stringify(data));
      modals.hide();
      document.getElementById("modals").innerHTML = "";
      tasks.render(data, "inbox");
      projects.render(data);
      projects.activate("inbox");
    });
  };

  const reviewTask = (e) => {
    modals.renderEditTask(e.target.parentNode, data);
    appendProjectOptions(e.target.parentNode.dataset.project);

    // save button - update input value
    const form = document.getElementById("edit-task-form");
    const initialProjectName = document.getElementById("task-project").value;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // get all the current values
      const projectName = document.getElementById("task-project").value;
      const title = document.getElementById("task-title").value;
      const desc = document.getElementById("task-description").value;
      const dueDate = document.getElementById("task-date").value;
      const prio = document.getElementById("task-priority").value;
      // find the task at hand and update it's value
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
        }
      });
      if (initialProjectName !== projectName) {
        data.forEach((project) => {
          // delete the task in the old project
          if (project.title === initialProjectName) {
            project.tasks.forEach((task, index) => {
              if (task.id === form.dataset.task) {
                project.tasks.splice(index, 1);
              }
            });
          }
          // create in new location
          project.title === projectName && submitTask(e);
        });
      }
      // when user changes project in the task
      // update it's values
      localStorage.setItem("data", JSON.stringify(data));
      modals.hide();
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
      modals.hide();
      tasks.render(data, projectName);
      projects.render(data);
      projects.activate(projectName);
    });
  };

  // init
  tasks.render(data, "inbox");
  projects.render(data);

  // Events
  document.addEventListener("submit", (e) => {
    e.target.id === "add-project" && submitProject(e);
    e.target.id === "add-task" && submitTask(e);
  });

  addTaskBtn.addEventListener("click", openNewTaskModal);
  addProjectBtn.addEventListener("click", modals.renderAddProject);
  projectsContainer.addEventListener("click", renderView);

  tasksContainer.addEventListener("click", (e) => {
    e.target.matches(".js-complete") && tasks.complete(e, data);
    e.target.matches(".edit-project") && editProject(e);
    e.target.parentNode.matches(".js-task-review") && reviewTask(e);
  });

  document.addEventListener("click", (e) => {
    e.target.matches(".btn-close") && modals.hide();
  });
})();
