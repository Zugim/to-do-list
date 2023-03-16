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

  destroy() {
    document.querySelector(`#${this.id}`).remove();
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
        ${this.lists[0].tasks.length === 0 ? `<li>Nothing to do</li>` :
          this.lists[0].tasks.map(task => task.generateHtmlFrag()).join("")}        
      </ul>
      <h2>${this.lists[1].title}</h2>
      <ul id="${this.lists[1].id}">
      ${this.lists[0].tasks.length === 0 ? `<li>Nothing to do</li>` :
          this.lists[0].tasks.map(task => task.generateHtmlFrag()).join("")}
      </ul>
    </div>
  ` ;
  }  
}

class List extends Component {
  constructor(idStem, id, title) {
    super(idStem, id);
    this.title = title;
    this.tasks = [new Task("task", taskIdCounter++, "Added via loop", "Loop")];
    //this.tasks = [];
    this.subLists = [];
  } 

  generateHtmlFrag() {
    return `       
    <h2>${this.title}</h2>
    <ul id="${this.id}">${this.title}</ul>    
  ` ;
  }

  addTask(task) {
    this.tasks.push(task);
    this.render(`#${this.id}`, task.generateHtmlFrag());
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
  ` ;
  }
}

const testPage = new Page ("page", pageIdCounter++, "3/16/2023");
testPage.render("body", testPage.generateHtmlFrag());
