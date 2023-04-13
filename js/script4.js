pageIdCounter = 0;
// First element for complexLists, second element for simpleLists
listIdCounters = [0, 0];
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
  constructor(id, title, tag, list) {
    this.id = `task${id}`;
    this.idNum = id;
    this.title = title;
    this.tag = tag;
    this.list = list;
    this.htmlFrag = `
    <li id="${this.id}"><input type="checkbox" name="complete"/>${this.title} - ${this.tag} - <button id="${this.id}Delete">delete</button></li>
    `;
    this.elements = [new Element("elDeleteTaskButton", `#${this.id} > button`,true, this.deleteTask.bind(this))];
  }

  deleteTask() {
    console.log("Delete Clicked");
    document.querySelector(`#${this.id}`).remove();
    controller.pages[this.list.idNum].lists[0].tasks = 
      controller.pages[this.list.idNum].lists[0].tasks.filter(task => task.id !== this.id);
    console.log(controller.pages[this.list.idNum].lists[0]);
    console.log(controller.pages[this.list.idNum].lists[0].tasks.length);
    if (controller.pages[this.list.idNum].lists[0].tasks.length === 0) {
      controller.renderComponent(`#${controller.pages[this.list.idNum].lists[0].id} > ul`,
                                  '<li class="placeholderTask">Empty list</li>');
    }
  }
}

class ComplexList {
  constructor(id, title) {
    this.id = `complexList${id}`;
    this.idNum = id;
    this.title = title;
    this.tasks = [];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>${this.title}</h1>
      <button>Add new task</button>
      <ul> 
        ${this.tasks.length === 0 ? 
                      '<li class="placeholderTask">Empty list</li>' :
                        this.tasks.map(task => `<li class="${task}">${task}</li>`).join('')}        
      </ul>
    </div>
    `;
    // Using bind(this) so addTask refers to the correct this - Need to research
    this.elements = [new Element("elAddNewTaskButton", `#${this.id} > button`, true, this.addTask.bind(this))];
  }

  addTask() {    
    if (document.querySelector(`#${this.id} > ul > .placeholderTask`)) {
      document.querySelector(`#${this.id} > ul > .placeholderTask`).remove();
    } 

    this.tasks.push(new Task(taskIdCounter++, 
                             prompt("Please enter the tasks title"), 
                             prompt("Please enter the tasks tag"),
                             controller.pages[this.idNum].lists[0]));
    controller.renderComponent(`#${this.id} > ul`, this.tasks[this.tasks.length -1].htmlFrag);  
    controller.initComponent(this.tasks[this.tasks.length -1]);  
  }  
}

class SimpleList {
  constructor(id, title) {
    this.id = `simpleList${id}`;
    this.idNum = id;
    this.title = title;
    this.tasks = [];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>${this.title}</h1>
      <ul> 
      ${this.tasks.length === 0 ? 
        '<li class="placeholderTask">Empty list</li>' :
          '<li class="notEmptyList">Not Empty list</li>'}  
      </ul>
    </div>
    `;
  }  
}

class Page {
  constructor(id) {
    this.id = `page${id}`; 
    this.idNum = id;   
    this.lists = [new ComplexList(listIdCounters[0]++, "To Do List"),
                  new SimpleList(listIdCounters[1]++, "Completed List")];
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
  }

  initComponent(component) {    
    component.elements.forEach(element => {
      element.el = document.querySelector(`${element.selector}`);

      if (element.clickable) {
        element.el.addEventListener("click", element.callBack);
      }      
    });  
  }
}

let controller = new Controller();
