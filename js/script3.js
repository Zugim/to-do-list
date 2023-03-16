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

    this.lists = [new List("toDoList", id, "To Do List"),
                  new List("completedList", id, "Completed List")];
  }

  generateHtmlFrag() {
    return `
    <div id="${this.id}">
      <h1>${this.date}</h1>
      <h2>${this.lists[0].title}</h2>
      <ul id="${this.lists[0].id}">
        ${this.lists[0].checkEmpty()}        
      </ul>
      <h2>${this.lists[1].title}</h2>
      <ul id="${this.lists[1].id}">
        ${this.lists[0].checkEmpty()}
      </ul>
    </div>
    `;
  }  
}

class List extends Component {
  constructor(idStem, id, title) {
    super(idStem, id);
    this.title = title;
    // this.tasks = [new Task("task", taskIdCounter++, "Test Task", "Test")];
    this.tasks = [];
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

  addTask(task) {
    this.tasks.push(task);

    if(document.querySelector(`#${this.id} > #emptyList`)) {
      document.querySelector(`#${this.id} > #emptyList`).remove();
    }
    
    this.render(`#${this.id}`, task.generateHtmlFrag());
  } 

  removeTask(id) {
    this.tasks = this.tasks.filter(item => item.id !== id)

    document.querySelector(`#${this.id}`).innerHTML = "";

    // if(this.tasks.length === 0) {
    //   document.querySelector(`#${this.id}`).innerHTML += `<li id="emptyList">Nothing to do</li>`;
    // }
    
    
    this.render(`#${this.id}`, this.generateHtmlFrag("tasks"));
  }
  
  checkEmpty() {
    if(this.tasks.length === 0) {
      return `<li id="emptyList">Nothing to do</li>`;
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
  }

  generateHtmlFrag() {
    return `       
    <li id="${this.id}">${this.title} - ${this.tag} - delete</li> 
    `;
  }
}

const testPage = new Page ("page", pageIdCounter++, "3/16/2023");
testPage.render("body", testPage.generateHtmlFrag());
