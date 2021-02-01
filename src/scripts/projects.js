import { v4 as uuid } from "uuid";

const projects = (() => {
  // DOM
  const container = document.getElementById("projects");
  const form = document.getElementById("add-project");

  // Values
  const _project = (title) => {
    const id = uuid();
    const tasks = [];
    return { id, title, tasks };
  };

  // Methods
  const _construct = (projectTitle, noOfItems, index) => {
    const projectElement = document.createElement("li");
    const link = document.createElement("a");
    link.classList.add("nav-link", "text-capitalize");
    index === 0 && link.classList.add("active");
    link.setAttribute("href", "#");
    link.dataset.project = projectTitle;
    link.textContent = projectTitle;
    const linkSpan = document.createElement("span");
    linkSpan.classList.add("text-black-50");
    linkSpan.textContent = ` ${noOfItems}`;
    link.appendChild(linkSpan);
    projectElement.appendChild(link);
    container.appendChild(projectElement);
  };

  const create = (data, title) => {
    if (!data.includes((project) => project.title === title)) {
      data.push(_project(title));
    }
    localStorage.setItem("data", JSON.stringify(data));
  };

  const generateSelection = (data, activeSelect) => {
    return data.map((project) => {
      const optionElement = document.createElement("option");
      optionElement.setAttribute("value", project.title);
      if (activeSelect === project.title) {
        optionElement.setAttribute("selected", true);
      }
      optionElement.textContent = project.title;
      return optionElement;
    });
  };

  const render = (data) => {
    container.innerHTML = "";
    data.map((project, index) => {
      _construct(project.title, project.tasks.length, index);
    });
  };

  const activate = (project) => {
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));
    container.querySelectorAll(".nav-link").forEach((link) => {
      link.dataset.project === project &&
        link.classList.contains("nav-link") &&
        link.classList.add("active");
    });
  };

  return {
    render,
    create,
    generateSelection,
    activate,
    form,
  };
})();

export default projects;
