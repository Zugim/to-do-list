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
    <li id="${this.id}"><input type="checkbox" name="complete"/><span class="taskTitle">${this.title}</span> - ${this.tag} <button class="delete">Delete</button></li>
    `;
    this.elements = [new Element("elDeleteTaskButton", `#${this.id} > button`, "click", this.deleteTask.bind(this)),
                     new Element("elCheckComplete", `#${this.id} > input[type=checkbox]`, "change", function() {this.moveTask("move")}.bind(this))];
  }

  deleteTask() {
    document.querySelector(`#${this.id}`).remove();
    controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).tasks = 
      controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).tasks.filter(task => task.id !== this.id);
    if (controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).tasks.length === 0) {
      controller.renderComponent(`#${controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).id} > ul`,
                                  '<li class="placeholderTask">Empty list</li>');
    }
    
    if(document.querySelector(`#${controller.pages[this.list.idNum].id} > .titleCont > p`)) {
      document.querySelector(`#${controller.pages[this.list.idNum].id} > .titleCont > p`).remove();
    }
    controller.renderComponent(`#${controller.pages[this.list.idNum].id} > .titleCont`, 
                               `<p>${controller.pages[this.list.idNum].lists[0].tasks.length} incomplete, ${controller.pages[this.list.idNum].lists[1].tasks.length} complete</p>`);
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
    
    if(this.list.idFlag === "complexList") {
      this.elements.find(element => element.name === "elCheckComplete").el.checked = false;    
    }
    else if(this.list.idFlag === "simpleList") {
      this.elements.find(element => element.name === "elCheckComplete").el.checked = true;      
    }
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
      <h2>${this.title}</h2>
      ${this.idFlag === "complexList" ? `<button>Add new task</button>` : ``}
      <ul> 
        ${this.tasks.length === 0 ? 
                      '<li class="placeholderTask">Empty list</li>' :
                        this.tasks.map(task => `<li class="${task}">${task}</li>`).join('')}        
      </ul>
    </div>
    `;
    // Using bind(this) so addTask refers to the correct this - Need to research
    this.elements = [new Element("elAddNewTaskButton", `#${this.id} > button`, "click", function() {this.addTask("new")}.bind(this)),
                     new Element("elIncompleteComplete", `#${this.id} > p`)];
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

    document.querySelector(`#${controller.pages[this.idNum].id} > .titleCont > p`).remove();

    controller.renderComponent(`#${controller.pages[this.idNum].id} > .titleCont`, 
                              `<p>${controller.pages[this.idNum].lists[0].tasks.length} incomplete, ${controller.pages[this.idNum].lists[1].tasks.length} complete</p>`);                                 
  }  
}

class Page {
  constructor(id, title) {
    this.idFlag = "page";
    this.idNum = id; 
    this.id = `${this.idFlag}${id}`;
    this.title = title;
    this.date = new Date();      
    this.lists = [new List(listIdCounters[0]++, "To Do List", "complexList"),
                  new List(listIdCounters[1]++, "Completed List", "simpleList")];
    this.htmlFrag = `
    <div id="${this.id}">
      <div class="titleCont">
      <h1>${this.title} - ${String(this.date.getDate()).padStart(2, "0")}/${String(this.date.getMonth() + 1).padStart(2, "0")}/${this.date.getFullYear()}</h1>      
      <p>${this.lists[0].tasks.length} incomplete, ${this.lists[1].tasks.length} complete</p>
      </div>
      <button>Add new list</button>
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;  
    this.elements = [new Element("elAddNewListButton", `#${this.id} > button`, "click", this.addPage)];
  } 
  
  addPage() {
    controller.pages.push(new Page(pageIdCounter++, prompt("Please enter the pages title")));    
    controller.renderComponent("main", controller.pages[controller.pages.length - 1].htmlFrag);
    controller.initComponent(controller.pages[controller.pages.length - 1]);
    controller.initComponent(controller.pages[controller.pages.length - 1].lists[0]);
  }  
}

class Controller {
  constructor() {    
    this.pages = [new Page(pageIdCounter++, prompt("Please enter the pages title"))];
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
