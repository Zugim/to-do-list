// ~~~~~Things to improve~~~~~
// Change how renderComponent works (research insertAdjacentHTML and append)

pageIdCounter = 0;
taskIdCounter = 0;

class Element {
  constructor(name, selector, clickable = false, callBack = null, el = null) {
    this.name = name;
    this.selector = selector;
    this.el = el;
    this.clickable = clickable;
    this.callBack = callBack;
  }
}

class Task {
  constructor(id, title, tag) {
    this.id = `task${id}`;
    this.title = title;
    this.tag = tag;
    this.htmlFrag = `
    <li id="${this.id}">${this.title} - ${this.tag} - <button id="${this.id}Delete">delete</button></li>
    `
  }
}

class List {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

class SimpleList extends List {
  constructor(id, title) {
    super(id, title);
    this.tasks = [];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>${this.title}</h1>
      <ul> 
        </li class="emptyList">Empty list</li>
      </ul>
    </div>
    `;
  }  
}

class ComplexList extends List {
  constructor(id, title) {
    super(id, title);
    this.tasks = ["TEST"];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>${this.title}</h1>
      <button>Add new task</button>
      <ul> 
        </li class="emptyList">Empty list</li>
      </ul>
    </div>
    `;
    this.elements = [new Element("elTitle", `#${this.id} > h1`),
                     new Element("elAddNewTaskButton", `#${this.id} > button`, true, this.addTask)];
  }

  addTask() {
    console.log("You Clicked The Add Task Button!");
    this.tasks.push("TEST");    
    controller.renderComponent("body", controller.pages[controller.pages.length - 1].htmlFrag);
    // Reinitializes each component on the page as renderComponent currently resets the DOM resulting
    // in some event listeners being removed. This is caused by modifiying the innerHTML of a parent element.
    // Can be improved upon.
    controller.pages.forEach(page => controller.initComponent(page));
    controller.pages.forEach(page => controller.initComponent(page.lists[0]));
  }  
}

class Page {
  constructor(id) {
    this.id = `page${id}`;    
    this.lists = [new ComplexList("toDoList", "To Do List"),
                  new SimpleList("completedList", "Completed List")];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>4/10/2023</h1>
      <button>Add new list</button>
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;  
    this.elements = [new Element("elTitle", `#${this.id} > h1`),
                     new Element("elAddNewListButton", `#${this.id} > button`, true, this.addPage),                     
                     new Element("elToDoList", `#${this.id} > #${this.lists[0].id}`),
                     new Element("elCompletedList", `#${this.id} > #${this.lists[1].id}`)];
  } 
  
  addPage() {
    console.log("You Clicked The Add Page Button!");
    controller.pages.push(new Page(pageIdCounter++));    
    controller.renderComponent("body", controller.pages[controller.pages.length - 1].htmlFrag);
    // Reinitializes each component on the page as renderComponent currently resets the DOM resulting
    // in some event listeners being removed. This is caused by modifiying the innerHTML of a parent element.
    // Can be improved upon.
    controller.pages.forEach(page => controller.initComponent(page));
    controller.pages.forEach(page => controller.initComponent(page.lists[0]));
  }  
}

class Controller {
  constructor() {    
    this.pages = [new Page(pageIdCounter++)]

    this.renderComponent("body", this.pages[this.pages.length - 1].htmlFrag);
    this.initComponent(this.pages[this.pages.length - 1]);
    this.initComponent(this.pages[this.pages.length - 1].lists[0]);
  }
  renderComponent(location, htmlFrag) {    
    document.querySelector(location).innerHTML += htmlFrag;
    console.log("Component Rendered");
  }

  initComponent(component) {    
    component.elements.forEach(element => {
      element.el = document.querySelector(`${element.selector}`);
      console.log("Component Initialized");
      console.log(`Selector: ${element.selector} Element: ${element.el}`);

      if (element.clickable) {
        console.log("Is Clickable");
        element.el.addEventListener("click", element.callBack);
        console.log("Event Listener Bound")
      } else {
        console.log("Not Clickable");
      }
    });  
  }
}

let controller = new Controller();
