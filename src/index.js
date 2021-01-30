import "./style.css";
import { v4 as uuid } from "uuid";

// default project
const inbox = {
  tasks: [
    {
      title: "Do the dishes",
      description: "Desc",
      dueDate: "DueDate",
      prio: "prio",
    },
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
};

const DOM = (() => {
  const tasksContainer = document.querySelector(".js-tasks");
  const addTask = document.querySelector(".js-add-task");
  const modal = document.querySelector(".js-modal");
  const modalClose = document.querySelector(".js-modal-close");
  const taskForm = document.getElementById("add-task");

  const constructTask = (task) => {
    const taskElement = document.createElement("p");
    taskElement.classList.add("mb-2");
    taskElement.textContent = task.title;
    tasksContainer.appendChild(taskElement);
  };

  const renderTasks = (tasks) => {
    tasksContainer.innerHTML = "";
    tasks.map((task) => {
      constructTask(task);
    });
  };

  const showModal = () => {
    modal.classList.remove("hidden");
  };

  const hideModal = () => {
    modal.classList.add("hidden");
  };

  return { renderTasks, addTask, modalClose, showModal, hideModal, taskForm };
})();

const tasks = (() => {
  const task = (title, description, dueDate, prio) => {
    const id = uuid();
    return { id, title, description, dueDate, prio };
  };

  const createTask = (title, description, dueDate, prio) => {
    const newTask = task(title, description, dueDate, prio);
    inbox.tasks.push(newTask);
  };
  return { createTask };
})();

DOM.renderTasks(inbox.tasks);
DOM.addTask.addEventListener("click", DOM.showModal);
DOM.modalClose.addEventListener("click", DOM.hideModal);
DOM.taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  tasks.createTask(
    document.getElementById("title").value,
    document.getElementById("description").value,
    document.getElementById("date").value,
    document.getElementById("priority").value
  );
  DOM.renderTasks(inbox.tasks);
  DOM.hideModal();
});
