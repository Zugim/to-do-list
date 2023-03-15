let pageIdCounter = 0;
let listIdCounter = 0;
let advListIdCounter = 0;
let taskIdCounter = 0;

class Manager {
  constructor() {
    this.pages = [new Page(this, "defaultPage", "defaultPage")]
    this.currentPage = 0;

    this.pages[this.currentPage].renderPage(this.currentPage);
  }  
}

class Page {
  constructor(manager, id =`page${pageIdCounter++}`, name) {
    this.manager = manager;
    this.id = id;
    this.name = name;
    this.toDoList = new List(manager, "toDoList", "toDoList");
    this.completedList = new List(manager, "completedList", "completedList");

    this.htmlFrag = `<div id="${this.id}">
      <h1>{insert today's date here}</h1>
      <button>Create new list</button>
      ${this.toDoList.htmlFrag}
      ${this.completedList.htmlFrag}
    </div>`;
   }

   renderPage() {
    this.htmlFrag = `<div id="${this.id}">
      <h1>{insert today's date here}</h1>
      <button>Create new list</button>
      ${this.toDoList.htmlFrag}
      ${this.completedList.htmlFrag}
    </div>`;
    document.body.innerHTML = "";
    document.body.innerHTML += this.htmlFrag;
  }
}

class List {
  constructor(manager, id =`list${listIdCounter++}`, name) {
    this.manager = manager;
    this.id = id;
    this.name = name;
    this.tasks = [new Task(manager, "task01", "task01"), 
                  new Task(manager, "task02", "task02")];

    this.htmlFrag = `<div id="${this.id}Cont">
      <h2>${this.name}</h2>
      <ul id="${this.id}">
        ${this.tasks.map(task => `${task.htmlFrag}`).join("")}
      </ul>
    </div>`    
  }

  addTask(task) {
    this.tasks.push(task);
    this.htmlFrag = `<div id="${this.id}Cont">
      <h2>${this.name}</h2>
      <ul id="${this.id}">
        ${this.tasks.map(task => `${task.htmlFrag}`).join("")}
      </ul>
    </div>` 
    this.manager.pages[this.manager.currentPage].renderPage();
  }
}

class Task {
  constructor(manager, id =`task${taskIdCounter++}`, name) {
    this.manager = manager;
    this.id = id;
    this.name = name;
    this.htmlFrag = `<li id="${this.id}">${this.name}</li>`
  }
}

const manager = new Manager();


// Utility classes
function camelToKebab(string) {  
  return string.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`); 
}

function kebabToCamel(string) {
return string.replace(/-./g, match => match[1].toUpperCase());
}