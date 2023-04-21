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
    this.optionsDisplayed = false;
    this.htmlFrag = `
    <li id="${this.id}">
      <div class="taskContainerTop stretch">
        <input class="taskCheckbox" type="checkbox" name="complete"/>
        <span class="taskTitle">${this.title}</span>
        <img class="taskEllipsis" src="img/ellipsis.svg" alt="task options">
      </div>      
      <div class="taskContainerBottom stretch">
        <span class="taskTag">${this.tag}</span>
      </div>
    </li>
    `;
    this.elements = [new Element("elTask", `#${this.id}`),
                     new Element("eltaskCheckbox", `#${this.id} .taskCheckbox`, "change", function() {this.moveTask("move")}.bind(this)),
                     new Element("elTaskEllipsis", `#${this.id} .taskEllipsis`, "click", this.displayOptions.bind(this))];
  }

  displayOptions() {
    if(!this.optionsDisplayed) {
      this.optionsDisplayed = true;

      document.querySelector(`#${this.id} .taskContainerTop`).insertAdjacentHTML("afterend", `
      <div class="taskOptions">
        <ul>
          <li class="taskRename">Rename</li>
          <li class="taskDelete">Delete</li>
        </ul>
      </div>
      `);

      document.querySelector(`#${this.id} .taskRename`).addEventListener("click", this.renameTask.bind(this));
      document.querySelector(`#${this.id} .taskDelete`).addEventListener("click", this.deleteTask.bind(this));
      
      let callback = function(event) {
        if(!event.target.closest(`#${this.id} .taskOptions`) && !event.target.closest(`#${this.id} .taskEllipsis`)) {          
          this.optionsDisplayed = false;
          if(document.querySelector(`#${this.id} .taskOptions`)) {
            document.querySelector(`#${this.id} .taskOptions`).remove();
          }
          window.removeEventListener("click", callback);
        } 
      }.bind(this);

      window.addEventListener("click", callback);

    } else {
      this.optionsDisplayed = false;
      document.querySelector(`#${this.id} .taskOptions`).remove();
    }
  }

  renameTask() {
    this.title = prompt("Please enter a new title")
    this.htmlFrag = `
    <li id="${this.id}">
      <div class="taskContainerTop stretch">
        <input class="taskCheckbox" type="checkbox" name="complete"/>
        <span class="taskTitle">${this.title}</span>
        <img class="taskEllipsis" src="img/ellipsis.svg" alt="task options">
      </div>      
      <div class="taskContainerBottom stretch">
        <span class="taskTag">${this.tag}</span>
      </div>
    </li>
    `;
    if(document.querySelector(".taskOptions")) {
      document.querySelector(".taskOptions").remove();
    }
    
    this.list.tasks.forEach(task => document.querySelector(`#${task.id}`).remove());
    this.list.tasks.forEach(task => {
      controller.renderComponent(`#${task.list.id} .listList`, task.htmlFrag);
      controller.initComponent(task);     
    });

    if(this.list.idFlag === "complexList") {
      this.elements.find(element => element.name === "eltaskCheckbox").el.checked = false;    
    }
    else if(this.list.idFlag === "simpleList") {
      this.elements.find(element => element.name === "eltaskCheckbox").el.checked = true;      
    }
  }

  deleteTask() {
    document.querySelector(`#${this.id}`).remove();
    controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).tasks = 
      controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).tasks.filter(task => task.id !== this.id);
    if (controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).tasks.length === 0) {
      controller.renderComponent(`#${controller.pages[this.list.idNum].lists.find(list => list.idFlag === this.list.idFlag).id} > ul`,
                                  '<li class="taskEmpty">Empty list</li>');
    }

    document.querySelector(`#${controller.pages[this.list.idNum].id} .pageUncompComp`).remove();

    document.querySelector(`#${controller.pages[this.list.idNum].id} .pageTitleCont`).insertAdjacentHTML("afterend",
                            `<p class="pageUncompComp">${this.list.page.lists[0].tasks.length} incomplete, ${this.list.page.lists[1].tasks.length} complete</p>`);
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
      this.elements.find(element => element.name === "eltaskCheckbox").el.checked = false;    
    }
    else if(this.list.idFlag === "simpleList") {
      this.elements.find(element => element.name === "eltaskCheckbox").el.checked = true;      
    }
  }
}

class List {
  constructor(id, title, idFlag, page) {
    this.idFlag = idFlag;
    this.idNum = id;
    this.id = `${this.idFlag}${id}`;    
    this.title = title;
    this.page = page;
    this.tasks = [];
    this.htmlFrag = `
    <div id="${this.id}">
      <div class="listTitleCont stretch">
        <h2 class="listTitle">${this.title}</h2>
        ${this.idFlag === "complexList" ? `<img class="listPlus" src="img/plus.svg" alt="add task">` : ``}
      </div>
      <ul class="listList"> 
        ${this.tasks.length === 0 ? 
                      '<li class="taskEmpty">Empty list</li>' :
                        this.tasks.map(task => `<li class="${task}">${task}</li>`).join('')}        
      </ul>
    </div>
    `;
    // Using bind(this) so addTask refers to the correct this - Need to research
    this.elements = [new Element("elAddNewTaskButton", `#${this.id} .listPlus`, "click", function() {this.addTask("new")}.bind(this))];
  }  

  addTask(addFunctionality) {    
    if (document.querySelector(`#${this.id} .taskEmpty`)) {
      document.querySelector(`#${this.id} .taskEmpty`).remove();
    }
    
    if(addFunctionality === "new") {
      this.tasks.push(new Task(taskIdCounter++, 
                      prompt("Please enter the tasks title"), 
                      prompt("Please enter the tasks tag"),
                      controller.pages[this.idNum].lists[0]));
    }     

    controller.renderComponent(`#${this.id} ul`, this.tasks[this.tasks.length - 1].htmlFrag);  
    controller.initComponent(this.tasks[this.tasks.length -1]); 

    document.querySelector(`#${controller.pages[this.idNum].id} .pageUncompComp`).remove();

    document.querySelector(`#${controller.pages[this.idNum].id} .pageTitleCont`).insertAdjacentHTML("afterend",
                            `<p class="pageUncompComp">${this.page.lists[0].tasks.length} incomplete, ${this.page.lists[1].tasks.length} complete</p>`);
  }  
}

class Page {
  constructor(id, title, controller) {
    this.idFlag = "page";
    this.idNum = id; 
    this.id = `${this.idFlag}${id}`;
    this.title = title;
    this.controller = controller;
    this.date = new Date();      
    this.lists = [new List(listIdCounters[0]++, "To Do List", "complexList", this),
                  new List(listIdCounters[1]++, "Completed List", "simpleList", this)];    
    this.optionsDisplayed = false;
    this.htmlFrag = `
    <div id="${this.id}">    
      <div class="pageTitleCont stretch">
        <h1 class="pageTitle"><span class="pageName">${this.title}</span> - 
          <span class="pageDate">${String(this.date.getDate()).padStart(2, "0")}/${String(this.date.getMonth() + 1).padStart(2, "0")}/${this.date.getFullYear()}</span>
        </h1>      
        <img class="pageEllipsis" src="img/ellipsis.svg" alt="task options">        
      </div>  
      <p class="pageUncompComp">${this.lists[0].tasks.length} incomplete, ${this.lists[1].tasks.length} complete</p>    
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;  
    this.elements = [new Element("elListEllipsis", `#${this.id} .pageEllipsis`, "click", this.displayOptions.bind(this))];
  }
  
  displayOptions() {
    if(!this.optionsDisplayed) {
      this.optionsDisplayed = true;

      document.querySelector(`#${this.id} .pageTitleCont`).insertAdjacentHTML("afterend", `
      <div class="pageOptions">
        <ul>
          <li class="pageRename">Rename</li>
          <li class="pageDelete">Delete</li>
        </ul>
      </div>
      `);

      document.querySelector(`#${this.id} .pageRename`).addEventListener("click", this.renamePage.bind(this));
      document.querySelector(`#${this.id} .pageDelete`).addEventListener("click", this.deletePage.bind(this));
      
      let callback = function(event) {
        if(!event.target.closest(`#${this.id} .pageOptions`) && !event.target.closest(`#${this.id} .pageEllipsis`)) {          
          this.optionsDisplayed = false;
          if(document.querySelector(`#${this.id} .pageOptions`)) {
            document.querySelector(`#${this.id} .pageOptions`).remove();
          }
          window.removeEventListener("click", callback);
        } 
      }.bind(this);

      window.addEventListener("click", callback);

    } else {
      this.optionsDisplayed = false;
      document.querySelector(`#${this.id} .pageOptions`).remove();
    }
  }

  renamePage() {
    this.title = prompt("Please enter a new title")
    
    if(document.querySelector(".pageOptions")) {
      document.querySelector(".pageOptions").remove();
    }

    document.querySelector(`#${this.id} .pageName`).innerHTML = this.title;   
  }

  deletePage() {
    document.querySelector(`#${this.id}`).remove();
    controller.pages = controller.pages.filter(page => page.id !== this.id);
    if(controller.pages.length === 0) {  
      document.querySelector("main").insertAdjacentHTML("beforeend", `<h2 id="empty">You don't have any lists yet. Click the plus in the bottom right corner to get started. 👍</h2>`);
    }
  }
}

class Controller {
  constructor() {  
    this.setDocHeight()  
    this.pages = [];   
    document.querySelector("main").insertAdjacentHTML("beforeend", `<h2 id="empty">You don't have any lists yet. Click the plus in the bottom right corner to get started. 👍</h2>`);
    this.renderComponent("body", '<img id="pagePlus" src="img/plus.svg" alt="add page">');
    document.querySelector("#pagePlus").addEventListener("click", this.addPage.bind(this));
    document.querySelector("#pagePlus").style.right += `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    window.addEventListener("resize", () => {
      this.setDocHeight()       
      document.querySelector("#pagePlus").style.right = `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    });
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

  addPage() {
    document.querySelector("main").insertAdjacentHTML("afterbegin", `
      <div id="modal">
        <div id="formContainer">
          <button id="closeModal">X</button>
          <form id="addPage">
            <input type="text" name="title" required pattern=".*\\S+.*"></input>
            <input type="submit" value="Add Page">
          </form>
        </div>
      </div>
    `)   
    
    document.querySelector("#closeModal").addEventListener("click", () => document.querySelector("#modal").remove());
    
    document.querySelector("#addPage").addEventListener("submit", (el) => {
      el.preventDefault();
      if(document.querySelector("#empty")) {
        document.querySelector("#empty").remove();
      }
      this.setDocHeight()  
      this.pages.push(new Page(pageIdCounter++, document.querySelector("#addPage").elements["title"].value));    
      this.renderComponent("main", this.pages[this.pages.length - 1].htmlFrag);    
      this.initComponent(this.pages[this.pages.length - 1]);
      this.initComponent(this.pages[this.pages.length - 1].lists[0]);
      document.querySelector("#modal").remove();
      document.querySelector("#pagePlus").style.right = `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    });    
  }  

  setDocHeight() {
    document.querySelector("html").style.height = `${window.innerHeight}px`;
    document.querySelector("body").style.height = `${window.innerHeight}px`;
  }
}

let controller = new Controller();
