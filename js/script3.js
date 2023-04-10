let pageIdCounter = 0;
let listIdCounter = 0;
let taskIdCounter = 0;

class Component {
  constructor(idStem, id) {
    this.id = `${idStem}${id}`;
  }

  render(location, htmlFrag) {
    document.querySelector(location).innerHTML += htmlFrag;
  }

  editAttribute(attribute, newValue) {
    this[`${attribute}`] = newValue;
  }
}

class Page extends Component {
  constructor(idStem, id, date) {
    super(idStem, id);
    this.date = date;    
    this.addButton = null;
    this.lists = [new List("toDoList", id, "To Do List"),
                  new List("completedList", id, "Completed List")];
  }

  generateHtmlFrag() {
    return `
    <div id="${this.id}">
      <h1>${this.date}</h1>
      <button>Add new list</button>
      <div id=${this.lists[0].id}Cont>
        <h2>${this.lists[0].title}</h2>
        <button>Add new item</button>
        <ul id="${this.lists[0].id}">
          ${this.lists[0].checkEmpty()}        
        </ul>
      </div>
      <div id=${this.lists[1].id}Cont>
        <h2>${this.lists[1].title}</h2>
        <ul id="${this.lists[1].id}">
          ${this.lists[1].checkEmpty()}
        </ul>
      </div>
    </div>
    `;
  }  

  initButtons() {
    this.addButton = document.querySelector(`#${this.id} > button`);
    this.addButton.addEventListener("click", () => {
      console.log(`${this.id} add button was clicked`);
    });
  }

  initAll() {
    this.initButtons();
    this.lists.forEach(list => list.initButtons());
  }
}

class List extends Component {
  constructor(idStem, id, title) {
    super(idStem, id);
    this.title = title;
    this.tasks = [new Task("task", taskIdCounter++, "Test Task", "Test")];
    this.addButton = null;
    //this.tasks = [];
    this.subLists = [];
  } 

  generateHtmlFrag(flag = "all") {
    if(flag === "all") {
      return ` 
        <h2>${this.title}</h2>      
        <ul id="${this.id}">
          ${this.checkEmpty()}
        </ul>    
      `;
    } else if(flag === "tasks") {
      return this.checkEmpty();
    }
  }
  
  initButtons() {
    this.addButton = document.querySelector(`#${this.id}Cont > button`);
    if(this.addButton) {
      this.addButton.addEventListener("click", () => {
        this.addTask(new Task("task", taskIdCounter++, "Test Task", "Test"));
      });
    }
    this.tasks.forEach(item => item.initButtons(this.removeTask.bind(this)));
  } 

  addTask(task) {
    this.tasks.push(task);

    if(document.querySelector(`#${this.id} > #emptyList`)) {
      document.querySelector(`#${this.id} > #emptyList`).remove();
    }
    
    this.render(`#${this.id}`, task.generateHtmlFrag());
    this.tasks.forEach(item => item.initButtons(this.removeTask.bind(this)));
  }  

  removeTask(id) {
    this.tasks = this.tasks.filter(item => item.id !== id)

    document.querySelector(`#${this.id}`).innerHTML = "";    
    
    this.render(`#${this.id}`, this.generateHtmlFrag("tasks"));
  }
  
  checkEmpty() {
    if(this.tasks.length === 0) {
      if(this.id.includes("completedList")) {        
        return `<li id="emptyList">Nothing completed</li>`;
      } else {
        return `<li id="emptyList">Nothing to do</li>`;
      }
    } else {
      return this.tasks.map(task => task.generateHtmlFrag()).join("");
    }
  }
}

class Task extends Component {
  constructor(idStem, id, title, tag) {
    super(idStem, id);
    this.title = title;
    this.tag = tag;
    this.deleteButton = null;
  }

  generateHtmlFrag() {
    return `       
    <li id="${this.id}">${this.title} - ${this.tag} - <button id="${this.id}Delete">delete</button></li> 
    `;
  }

    // this always reffering to same thing
  initButtons(func) {
    this.deleteButton = document.getElementById(`${this.id}Delete`);
    console.log(`#${this.id}Delete`);
    console.log(this.deleteButton);
    console.log("Event list added")  
    this.deleteButton.addEventListener("click", () => { 
      console.log("TEST");
      func(this.id)
    });
  }
}

const testPage = new Page ("page", pageIdCounter++, "3/16/2023");
testPage.render("body", testPage.generateHtmlFrag());
testPage.initAll();
