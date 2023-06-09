let pageIdCounter = 0;
// First element for complexLists, second element for simpleLists
let listIdCounters = [0, 0];
let taskIdCounter = 0;

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
                     new Element("eltaskCheckbox", `#${this.id} .taskCheckbox`, "change", () => this.moveTask("move")),
                     new Element("elTaskEllipsis", `#${this.id} .taskEllipsis`, "click", this.displayOptions.bind(this))];
  }

  displayOptions() {
    if(!this.optionsDisplayed) {
      this.optionsDisplayed = true;

      document.querySelector(`#${this.id} .taskEllipsis`).insertAdjacentHTML("afterend", `
      <div class="taskOptions">
        <ul>
          <li class="taskEdit">Edit</li>
          <li class="taskDelete">Delete</li>
        </ul>
      </div>
      `);

      document.querySelector(`#${this.id} .taskEdit`).addEventListener("click", this.editTask.bind(this));
      document.querySelector(`#${this.id} .taskDelete`).addEventListener("click", this.deleteTask.bind(this));
      
      let callback = event => {
        if(!event.target.closest(`#${this.id} .taskOptions`) && !event.target.closest(`#${this.id} .taskEllipsis`)) {          
          this.optionsDisplayed = false;
          if(document.querySelector(`#${this.id} .taskOptions`)) {
            document.querySelector(`#${this.id} .taskOptions`).remove();
          }
          window.removeEventListener("click", callback);
        } 
      }

      window.addEventListener("click", callback);

    } else {
      this.optionsDisplayed = false;
      document.querySelector(`#${this.id} .taskOptions`).remove();
    }
  }

  editTask() {
    document.querySelector("main").insertAdjacentHTML("afterbegin", `
      <div id="modal">
        <div id="formContainer">
          <div id="formTitleContainer">
            <div id="leftPad"></div>
            <h1>Edit Task</h1>
            <button id="closeModal">X</button>
          </div>
          <form id="editTask">
            <input type="text" name="title" value="${this.title}" required pattern=".*\\S+.*"></input>
            <select id="tags" name="tags">
              <option value="Everyday" ${this.tag === "Everyday" ? "selected" : ""}>Everyday</option>
              <option value="Leisure" ${this.tag === "Leisure" ? "selected" : ""}>Leisure</option>
              <option value="Education" ${this.tag === "Education" ? "selected" : ""}>Education</option>
              <option value="Work" ${this.tag === "Work" ? "selected" : ""}>Work</option>               
              <option value="Shopping" ${this.tag === "Shopping" ? "selected" : ""}>Shopping</option>
            </select>
            <input type="submit" value="Edit Task">
          </form>
        </div>
      </div>
    `);

    document.querySelector("#closeModal").addEventListener("click", () => document.querySelector("#modal").remove());
    document.querySelector("#modal").addEventListener("scroll", (el) => el.preventDefault());
    document.querySelector("#modal").addEventListener("mousewheel", (el) => el.preventDefault());
    // document.querySelector("#modal").addEventListener("touchmove", (el) => el.preventDefault());

    document.querySelector("#editTask").addEventListener("submit", (el) => {
      el.preventDefault();

      this.title = document.querySelector("#editTask").elements["title"].value;
      this.tag = document.querySelector("#editTask").elements["tags"].value;
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
        this.list.tasks.forEach(task => task.elements.find(element => element.name === "eltaskCheckbox").el.checked = false);    
      }
      else if(this.list.idFlag === "simpleList") {
        this.list.tasks.forEach(task => task.elements.find(element => element.name === "eltaskCheckbox").el.checked = true);     
      }
           
      document.querySelector("#modal").remove(); 
      
      // Local Storage Stuff   
      localStorage.setItem("local", JSON.stringify(toLocal()));
      local = JSON.parse(localStorage.getItem("local"));
      console.log("IN LOCAL STORAGE");     
      console.log(local);

      if(pages.length === 0) {
        localStorage.clear();
      }
    });     
  }

  deleteTask() {
    document.querySelector(`#${this.id}`).remove();
    pages.find(page => page.id === this.list.page.id).lists.find(list => list.idFlag === this.list.idFlag).tasks = 
      pages.find(page => page.id === this.list.page.id).lists.find(list => list.idFlag === this.list.idFlag).tasks.filter(task => task.id !== this.id);
    if (pages.find(page => page.id === this.list.page.id).lists.find(list => list.idFlag === this.list.idFlag).tasks.length === 0) {
      controller.renderComponent(`#${pages.find(page => page.id === this.list.page.id).lists.find(list => list.idFlag === this.list.idFlag).id} > ul`,
                                  '<li class="taskEmpty">Empty list</li>');
    }

    document.querySelector(`#${pages.find(page => page.id === this.list.page.id).id} .pageUncompComp`).remove();

    document.querySelector(`#${pages.find(page => page.id === this.list.page.id).id} .pageDate`).insertAdjacentHTML("afterend",
                            `<p class="pageUncompComp">${this.list.page.lists[0].tasks.length} incomplete, ${this.list.page.lists[1].tasks.length} complete</p>`);    
  
    // Local Storage Stuff   
    localStorage.setItem("local", JSON.stringify(toLocal()));
    local = JSON.parse(localStorage.getItem("local"));
    console.log("IN LOCAL STORAGE");     
    console.log(local);

    if(pages.length === 0) {
      localStorage.clear();
    }
  }

  moveTask(addFunctionality) {    
    this.deleteTask();

    if(this.list.idFlag === "complexList") {
      this.list = pages.find(page => page.id === this.list.page.id).lists[1];
      pages.find(page => page.id === this.list.page.id).lists[1].tasks.push(this);    
    }
    else if(this.list.idFlag === "simpleList") {
      this.list = pages.find(page => page.id === this.list.page.id).lists[0];
      pages.find(page => page.id === this.list.page.id).lists[0].tasks.push(this);      
    }

    this.list.addTask(addFunctionality);  
    
    if(this.list.idFlag === "complexList") {
      this.elements.find(element => element.name === "eltaskCheckbox").el.checked = false;    
    }
    else if(this.list.idFlag === "simpleList") {
      this.elements.find(element => element.name === "eltaskCheckbox").el.checked = true;      
    }

    // Local Storage Stuff   
    localStorage.setItem("local", JSON.stringify(toLocal()));
    local = JSON.parse(localStorage.getItem("local"));
    console.log("IN LOCAL STORAGE");     
    console.log(local);

    if(pages.length === 0) {
      localStorage.clear();
    }
  }
}

class List {
  constructor(id, title, idFlag, page) {
    this.idFlag = idFlag;
    this.id = `${this.idFlag}${id}`;    
    this.title = title;
    this.page = page;
    this.tasks = [];
    this.htmlFrag = `
    <div id="${this.id}">
      <div class="listTitleCont stretch">
        <h2 class="listTitle">${this.title}</h2>
        ${this.idFlag === "complexList" ? `<img class="listPlus" src="img/plusblk.svg" alt="add task">` : ``}
      </div>
      <ul class="listList"> 
        ${this.tasks.length === 0 ? 
                      '<li class="taskEmpty">Empty list</li>' :
                        this.tasks.map(task => `<li class="${task}">${task}</li>`).join('')}        
      </ul>
    </div>
    `;
    this.elements = [new Element("elAddNewTaskButton", `#${this.id} .listPlus`, "click", () => this.addTask("new"))];
  }  
  
  addTask(addFunctionality) {
    if (document.querySelector(`#${this.id} .taskEmpty`)) {
      document.querySelector(`#${this.id} .taskEmpty`).remove();
    }

    if(addFunctionality === "new") {
      document.querySelector("main").insertAdjacentHTML("afterbegin", `
      <div id="modal">
        <div id="formContainer">
          <div id="formTitleContainer">
            <div id="leftPad"></div>
            <h1>Add New Task</h1>
            <button id="closeModal">X</button>
          </div>
          <form id="addTask">
            <input type="text" name="title" placeholder="Task Title" required pattern=".*\\S+.*"></input>
            <select id="tags" name="tags">
              <option value="Everyday">Everyday</option>
              <option value="Leisure">Leisure</option>
              <option value="Education">Education</option>
              <option value="Work">Work</option>               
              <option value="Shopping">Shopping</option>
            </select>
            <input type="submit" value="Add Task">
          </form>
        </div>
      </div>
      `);

      document.querySelector("#closeModal").addEventListener("click", () => document.querySelector("#modal").remove());
      document.querySelector("#modal").addEventListener("scroll", (el) => el.preventDefault());
      document.querySelector("#modal").addEventListener("mousewheel", (el) => el.preventDefault());
      // document.querySelector("#modal").addEventListener("touchmove", (el) => el.preventDefault());

      document.querySelector("#addTask").addEventListener("submit", (el) => {
        el.preventDefault();
        this.tasks.push(new Task(taskIdCounter++, 
          document.querySelector("#addTask").elements["title"].value,  
          document.querySelector("#addTask").elements["tags"].value,
          pages.find(page => page.id === this.page.id).lists[0]));

        controller.renderComponent(`#${this.id} ul`, this.tasks[this.tasks.length - 1].htmlFrag);  
        controller.initComponent(this.tasks[this.tasks.length -1]);

        document.querySelector(`#${pages.find(page => page.id === this.page.id).id} .pageUncompComp`).remove();

        document.querySelector(`#${pages.find(page => page.id === this.page.id).id} .pageDate`).insertAdjacentHTML("afterend",
                               `<p class="pageUncompComp">${this.page.lists[0].tasks.length} incomplete, ${this.page.lists[1].tasks.length} complete</p>`);

        document.querySelector("#modal").remove();
        
        // Local Storage Stuff   
        localStorage.setItem("local", JSON.stringify(toLocal()));
        local = JSON.parse(localStorage.getItem("local"));
        console.log("IN LOCAL STORAGE");     
        console.log(local);

        if(pages.length === 0) {
          localStorage.clear();
        }
      });     
    } else {
      controller.renderComponent(`#${this.id} ul`, this.tasks[this.tasks.length - 1].htmlFrag);  
      controller.initComponent(this.tasks[this.tasks.length -1]); 

      document.querySelector(`#${pages.find(page => page.id === this.page.id).id} .pageUncompComp`).remove();

      document.querySelector(`#${pages.find(page => page.id === this.page.id).id} .pageDate`).insertAdjacentHTML("afterend",
                            `<p class="pageUncompComp">${this.page.lists[0].tasks.length} incomplete, ${this.page.lists[1].tasks.length} complete</p>`);
    }    
  }  
}

class Page {
  constructor(id, title, controller) {
    this.idFlag = "page";
    this.id = `${this.idFlag}${id}`;
    this.title = title;
    this.controller = controller;
    this.date = new Date();      
    this.lists = [new List(listIdCounters[0]++, "To Do List", "complexList", this),
                  new List(listIdCounters[1]++, "Completed List", "simpleList", this)];    
    this.optionsDisplayed = false;
    this.htmlFrag = `
    <div id="${this.id}"> 
      <div class="pageTitleCont">             
        <h1 class="pageTitle" title="${this.title}">${this.title}</h1> 
        <img class="pageEllipsis" src="img/ellipsis.svg" alt="task options">
      </div>
      <h2 class="pageDate">${String(this.date.getDate()).padStart(2, "0")}/${String(this.date.getMonth() + 1).padStart(2, "0")}/${this.date.getFullYear()}</h2>       
      <p class="pageUncompComp">${this.lists[0].tasks.length} incomplete, ${this.lists[1].tasks.length} complete</p>    
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;  
    this.elements = [new Element("elListEllipsis", `#${this.id} .pageEllipsis`, "click", this.displayOptions.bind(this))];
  }
  
  displayOptions() {
    if(!this.optionsDisplayed) {
      this.optionsDisplayed = true;

      document.querySelector(`#${this.id} .pageEllipsis`).insertAdjacentHTML("afterend", `
      <div class="pageOptions">
        <ul>
          <li class="pageEdit">Edit</li>
          <li class="pageDelete">Delete</li>
        </ul>
      </div>
      `);

      document.querySelector(`#${this.id} .pageEdit`).addEventListener("click", this.editPage.bind(this));
      document.querySelector(`#${this.id} .pageDelete`).addEventListener("click", this.deletePage.bind(this));
      
      let callback = event => {
        if(!event.target.closest(`#${this.id} .pageOptions`) && !event.target.closest(`#${this.id} .pageEllipsis`)) {          
          this.optionsDisplayed = false;
          if(document.querySelector(`#${this.id} .pageOptions`)) {
            document.querySelector(`#${this.id} .pageOptions`).remove();
          }
          window.removeEventListener("click", callback);
        } 
      };

      window.addEventListener("click", callback);

    } else {
      this.optionsDisplayed = false;
      document.querySelector(`#${this.id} .pageOptions`).remove();
    }
  }

  editPage() {
    document.querySelector("main").insertAdjacentHTML("afterbegin", `
      <div id="modal">
        <div id="formContainer">
          <div id="formTitleContainer">
            <div id="leftPad"></div>
            <h1>Edit List</h1>
            <button id="closeModal">X</button>
          </div>
          <form id="editPage">
            <input type="text" name="title" value="${this.title}" required pattern=".*\\S+.*"></input>
            <input type="submit" value="Edit Page">
          </form>
        </div>
      </div>
    `);

    document.querySelector("#closeModal").addEventListener("click", () => document.querySelector("#modal").remove());
    document.querySelector("#modal").addEventListener("scroll", (el) => el.preventDefault());
    document.querySelector("#modal").addEventListener("mousewheel", (el) => el.preventDefault());
    // document.querySelector("#modal").addEventListener("touchmove", (el) => el.preventDefault());

    document.querySelector("#editPage").addEventListener("submit", (el) => {
      el.preventDefault();
      this.title = document.querySelector("#editPage").elements["title"].value;  
      if(document.querySelector(".pageOptions")) {
        document.querySelector(".pageOptions").remove();
      }
      document.querySelector(`#${this.id} .pageTitle`).innerHTML = this.title;      
      document.querySelector("#modal").remove(); 
      
      // Local Storage Stuff   
      localStorage.setItem("local", JSON.stringify(toLocal()));
      local = JSON.parse(localStorage.getItem("local"));
      console.log("IN LOCAL STORAGE");     
      console.log(local);

      if(pages.length === 0) {
        localStorage.clear();
      }
    });     
  }

  deletePage() {
    document.querySelector(`#${this.id}`).remove();    
    pages = pages.filter(page => page.id !== this.id);
    document.querySelector("#pagePlus").style.right = `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    if(pages.length === 0) {  
      document.querySelector("main").insertAdjacentHTML("beforeend", `<h2 id="empty">You don't have any lists yet. Click the plus in the bottom right corner to get started. 👍</h2>`);
    }

    // Local Storage Stuff   
    localStorage.setItem("local", JSON.stringify(toLocal()));
    local = JSON.parse(localStorage.getItem("local"));
    console.log("IN LOCAL STORAGE");     
    console.log(local);

    if(pages.length === 0) {
      localStorage.clear();
    }
  }
}

class Controller {
  constructor() {  
    this.setDocHeight()       
    this.renderComponent("body", '<button id="pagePlus"><img src="img/plus.svg" alt="add page"></button>');
    document.querySelector("#pagePlus").addEventListener("click", this.addPage.bind(this));
    document.querySelector("#pagePlus").style.right += `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    window.addEventListener("resize", () => {
      this.setDocHeight()       
      document.querySelector("#pagePlus").style.right = `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    });
    window.addEventListener("touchmove", () => {
      this.setDocHeight()       
      document.querySelector("#pagePlus").style.right = `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    });
    window.addEventListener("touch", () => {
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
          <div id="formTitleContainer">
            <div id="leftPad"></div>
            <h1>Add New List</h1>
            <button id="closeModal">X</button>
          </div>
          <form id="addPage">
            <input type="text" name="title" placeholder="List Title" required pattern=".*\\S+.*"></input>
            <input type="submit" value="Submit">
          </form>
        </div>
      </div>
    `);   
    
    document.querySelector("#closeModal").addEventListener("click", () => document.querySelector("#modal").remove());
    document.querySelector("#modal").addEventListener("scroll", (el) => el.preventDefault());
    document.querySelector("#modal").addEventListener("mousewheel", (el) => el.preventDefault());
    // document.querySelector("#modal").addEventListener("touchmove", (el) => el.preventDefault());
    
    document.querySelector("#addPage").addEventListener("submit", (el) => {
      el.preventDefault();
      if(document.querySelector("#empty")) {
        document.querySelector("#empty").remove();
      }
      this.setDocHeight()  
      pages.push(new Page(pageIdCounter++, document.querySelector("#addPage").elements["title"].value, this));    this.renderComponent("main", pages[pages.length - 1].htmlFrag);    
      this.initComponent(pages[pages.length - 1]);
      this.initComponent(pages[pages.length - 1].lists[0]);
      document.querySelector("#modal").remove();
      document.querySelector("#pagePlus").style.right = `${document.querySelector("body").scrollWidth - document.querySelector("main").offsetWidth}px`;
    
      // Local Storage Stuff   
      localStorage.setItem("local", JSON.stringify(toLocal()));
      local = JSON.parse(localStorage.getItem("local"));
      console.log("IN LOCAL STORAGE");     
      console.log(local);

      if(pages.length === 0) {
        localStorage.clear();
      }
    });    
  }  

  setDocHeight() {
    document.querySelector("html").style.height = `${window.innerHeight}px`;
    document.querySelector("body").style.height = `${window.innerHeight}px`;
  }
}

let controller = new Controller();
let pages = [];
let local;

if(localStorage.getItem("local")) {
  console.log("STORAGE"); 
  console.log("======="); 
  console.log("IN LOCAL STORAGE - on refresh");
  let tmp = localStorage.getItem("local")
  local = JSON.parse(tmp);
  console.log(local);  

  (local.forEach((page, i) => {  

    pages.push(new Page(pageIdCounter++, page.title, controller)); 

    controller.renderComponent("main", pages[i].htmlFrag);    
    controller.initComponent(pages[i]);
    controller.initComponent(pages[i].lists[0]);

    page.lists.forEach((list, j) => { 

      list.tasks.forEach((task, k) => { 
        if (document.querySelector(`#${pages[i].lists[j].id} .taskEmpty`)) {
          document.querySelector(`#${pages[i].lists[j].id} .taskEmpty`).remove();
        }

        pages[i].lists[j].tasks.push(new Task(task.id, task.title, task.tag, pages[i].lists[j]));

        controller.renderComponent(`#${pages[i].lists[j].id} ul`, pages[i].lists[j].tasks[pages[i].lists[j].tasks.length - 1].htmlFrag);  
        controller.initComponent(pages[i].lists[j].tasks[pages[i].lists[j].tasks.length - 1]); 

        document.querySelector(`#${pages[i].id} .pageUncompComp`).remove();

        document.querySelector(`#${pages[i].id} .pageDate`).insertAdjacentHTML("afterend",
                               `<p class="pageUncompComp">${pages[i].lists[0].tasks.length} incomplete, ${pages[i].lists[1].tasks.length} complete</p>`);
        
        if(list.idFlag === "complexList") {
          pages[i].lists[j].tasks[k].elements.find(element => element.name === "eltaskCheckbox").el.checked = false;    
        }
        else if(list.idFlag === "simpleList") {
          pages[i].lists[j].tasks[k].elements.find(element => element.name === "eltaskCheckbox").el.checked = true;     
        }
      })  
    })     
  }));   

} else {
  console.log("NEW"); 

  document.querySelector("main").insertAdjacentHTML("beforeend", `<h2 id="empty">You don't have any lists yet. Click the plus in the bottom right corner to get started. 👍</h2>`);
}

let toLocal = () => { 
  let local = [];

  (pages.forEach(page => {  
    let tmp;
    tmp = {id: page.id, title: page.title, lists: []};    

    page.lists.forEach((list, i)=> { 
      tmp.lists.push({id: list.id, title: list.title, idFlag: list.idFlag, tasks: []})

      list.tasks.forEach(task => {        
          tmp.lists[i].tasks.push({id: task.id, title: task.title, tag: task.tag});            
      })      
    })
    local.push(tmp);
  })); 
  return local;
} 
