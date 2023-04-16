pageIdCounter = 0;
// First element for complexLists, second element for simpleLists
listIdCounters = [0, 0];
taskIdCounter = 0;

class Element {
  constructor(name, selector, event = null, callBack = null, el = null) {
    this.name = name;
    this.selector = selector;
    this.el = el;
    this.event = event;
    this.callBack = callBack;
  }
}

class Task {
  constructor(id, title, tag, list) {
    this.idFlag = "task";
    this.idNum = id;
    this.id = `${this.idFlag}${id}`;
    this.title = title;
    this.tag = tag;
    this.list = list;
    this.htmlFrag = `
    <li id="${this.id}"><input type="checkbox" name="complete"/>${this.title} - ${this.tag} - <button id="${this.id}Delete">delete</button></li>
    `;
    this.elements = [new Element("elDeleteTaskButton", `#${this.id} > button`, "click", this.deleteTask.bind(this)),
                     new Element("elCheckComplete", `#${this.id} > input[type=checkbox]`, "change", function() {this.moveTask("move")}.bind(this))];
  }

  deleteTask() {
      document.querySelector(`#${this.id}`).remove();
    controller.pages[this.list.idNum].lists.find(element => element.idFlag === this.list.idFlag).tasks = 
      controller.pages[this.list.idNum].lists.find(element => element.idFlag === this.list.idFlag).tasks.filter(task => task.id !== this.id);
    if (controller.pages[this.list.idNum].lists.find(element => element.idFlag === this.list.idFlag).tasks.length === 0) {
      controller.renderComponent(`#${controller.pages[this.list.idNum].lists.find(element => element.idFlag === this.list.idFlag).id} > ul`,
                                  '<li class="placeholderTask">Empty list</li>');
    }
  }

  moveTask(addFunctionality) {    
    this.deleteTask();

    if(this.list.idFlag === "complexList") {
      this.list = controller.pages[this.list.idNum].lists[1];
      controller.pages[this.list.idNum].lists[1].tasks.push(this);      
    }
    else if(this.list.idFlag === "simpleList") {
      this.list = controller.pages[this.list.idNum].lists[0];
      controller.pages[this.list.idNum].lists[0].tasks.push(this);      
    }

    this.list.addTask(addFunctionality);    
  }
}

class List {
  constructor(id, title, idFlag) {
    this.idFlag = idFlag;
    this.idNum = id;
    this.id = `${this.idFlag}${id}`;    
    this.title = title;
    this.tasks = [];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>${this.title}</h1>
      ${this.idFlag === "complexList" ? `<button>Add new task</button>` : ``}
      <ul> 
        ${this.tasks.length === 0 ? 
                      '<li class="placeholderTask">Empty list</li>' :
                        this.tasks.map(task => `<li class="${task}">${task}</li>`).join('')}        
      </ul>
    </div>
    `;
    // Using bind(this) so addTask refers to the correct this - Need to research
    this.elements = [new Element("elAddNewTaskButton", `#${this.id} > button`, "click", function() {this.addTask("new")}.bind(this))];
  }

  addTask(addFunctionality) {    
    if (document.querySelector(`#${this.id} > ul > .placeholderTask`)) {
      document.querySelector(`#${this.id} > ul > .placeholderTask`).remove();
    }
    
    if(addFunctionality === "new") {
      this.tasks.push(new Task(taskIdCounter++, 
                      prompt("Please enter the tasks title"), 
                      prompt("Please enter the tasks tag"),
                      controller.pages[this.idNum].lists[0])); 
    } 

    controller.renderComponent(`#${this.id} > ul`, this.tasks[this.tasks.length - 1].htmlFrag);  
    controller.initComponent(this.tasks[this.tasks.length -1]); 
  }  
}

class Page {
  constructor(id) {
    this.idFlag = "page";
    this.idNum = id; 
    this.id = `${this.idFlag}${id}`;      
    this.lists = [new List(listIdCounters[0]++, "To Do List", "complexList"),
                  new List(listIdCounters[1]++, "Completed List", "simpleList")];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>4/10/2023</h1>
      <button>Add new list</button>
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;  
    this.elements = [new Element("elAddNewListButton", `#${this.id} > button`, "click", this.addPage)];
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

      if (element.event === "click") {
        element.el.addEventListener("click", element.callBack);
      } else if (element.event === "change") {
        element.el.addEventListener("change", element.callBack);
      }
    });  
  }
}

let controller = new Controller();
