pageIdCounter = 0;
listIdCounter = 0;
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
    this.id = `list${id}`;
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
    this.elements = [new Element("elAddNewTaskButton", `#${this.id} > button`, true, this.addTask)];
  }

  addTask() {
    console.log("You Clicked The Add Task Button!");    
  }  
}

class Page {
  constructor(id) {
    this.id = `page${id}`;    
    this.lists = [new ComplexList(listIdCounter++, "To Do List"),
                  new SimpleList(listIdCounter++, "Completed List")];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>4/10/2023</h1>
      <button>Add new list</button>
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;  
    this.elements = [new Element("elAddNewListButton", `#${this.id} > button`, true, this.addPage)];
  } 
  
  addPage() {
    console.log("You Clicked The Add Page Button!");
    controller.pages.push(new Page(pageIdCounter++));    
    controller.renderComponent("main", controller.pages[controller.pages.length - 1].htmlFrag);
    controller.initComponent(controller.pages[controller.pages.length - 1]);
    controller.initComponent(controller.pages[controller.pages.length - 1].lists[0]);
  }  
}

class Controller {
  constructor() {    
    this.pages = [new Page(pageIdCounter++)];
    this.renderComponent("main", this.pages[this.pages.length - 1].htmlFrag);
    this.initComponent(this.pages[this.pages.length - 1]);
    this.initComponent(this.pages[this.pages.length - 1].lists[0]);
  }
  renderComponent(location, htmlFrag) {    
    document.querySelector(location).insertAdjacentHTML("beforeend", htmlFrag);
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
