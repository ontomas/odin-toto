// import "./style.css";
import "./bootstrap.css";
import { v4 as uuid } from "uuid";

// default project
const data = {
  inbox: [
    {
      title: "Code a little",
      description: "Desc",
      dueDate: "DueDate",
      prio: "prio",
    },
    {
      title: "Code a little more",
      description: "Desc",
      dueDate: "DueDate",
      prio: "prio",
    },
  ],
  personal: [
    {
      title: "Do the dishes",
      description: "Desc",
      dueDate: "DueDate",
      prio: "prio",
    },
  ],
};

const DOM = (() => {
  const tasksContainer = document.querySelector(".js-tasks");
  const addTask = document.getElementById("add-task");
  const projectForm = document.getElementById("add-project");
  const taskForm = document.getElementById("add-task");
  const projectsContainer = document.getElementById("projects");
  const addModal = new bootstrap.Modal(
    document.getElementById("add-task-modal")
  );
  const taskProject = document.getElementById("task-project");

  const renderTasks = (tasks) => {
    tasksContainer.innerHTML = "";
    tasks.map((task) => {
      constructTask(task);
    });
  };

  const constructTask = (task) => {
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("form-check");
    const input = document.createElement("input");
    input.classList.add("form-check-input");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", task.id);
    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.setAttribute("for", task.id);
    label.textContent = task.title;
    taskWrapper.appendChild(input);
    taskWrapper.appendChild(label);
    tasksContainer.appendChild(taskWrapper);
  };

  const renderProjects = (projects) => {
    projectsContainer.innerHTML = "";
    projects.map((project, index) => {
      constructProject(project, index);
    });
  };

  const constructProject = (project, index) => {
    const projectElement = document.createElement("li");
    projectElement.classList.add("nav-item");
    const link = document.createElement("a");
    link.classList.add("nav-link", `${index === 0 && "active"}`);
    link.style.textTransform = "capitalize";
    link.setAttribute("href", "#");
    link.textContent = project;
    projectElement.appendChild(link);
    projectsContainer.appendChild(projectElement);
  };

  return {
    renderTasks,
    renderProjects,
    addTask,
    taskForm,
    projectForm,
    addModal,
    projectsContainer,
    taskProject,
  };
})();

const projects = (() => {
  const createProject = (title) => {
    if (!Object.keys(data).indexOf(title.toLowerCase()) > -1) {
      data[title.toLowerCase()] = [];
    }
    DOM.projectForm.reset();
    DOM.addModal.hide();
  };
  const updateProjectSelection = () => {
    DOM.taskProject.innerHTML = "";
    Object.keys(data).map((project) => {
      const option = document.createElement("option");
      option.setAttribute("value", project);
      option.textContent = project;
      DOM.taskProject.appendChild(option);
    });
  };
  return { createProject, updateProjectSelection };
})();

const tasks = (() => {
  const task = (title, description, dueDate, prio) => {
    const id = uuid();
    return { id, title, description, dueDate, prio };
  };

  const createTask = (project, title, description, dueDate, prio) => {
    const newTask = task(title, description, dueDate, prio);
    data[project].push(newTask);
    DOM.taskForm.reset();
    DOM.addModal.hide();
  };
  return { createTask };
})();

DOM.renderTasks(data.inbox);

// Submit new task
DOM.taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  tasks.createTask(
    document.getElementById("task-project").value,
    document.getElementById("task-title").value,
    document.getElementById("task-description").value,
    document.getElementById("task-date").value,
    document.getElementById("task-priority").value
  );
  DOM.renderTasks(data.inbox);
});

// Submit new project
DOM.projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("project-title").value;
  projects.createProject(title);
  DOM.renderProjects(Object.keys(data));
  projects.updateProjectSelection();
});

// render project in the sidebar
DOM.renderProjects(Object.keys(data));
// add projects

// add an ability to select where new tasks goes - which project
// render all project in the task form
window.addEventListener("DOMContentLoaded", projects.updateProjectSelection);
