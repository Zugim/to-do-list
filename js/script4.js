// ~~~~~Things to improve~~~~~
// Change how renderComponent works (research insertAdjacentHTML and append)

pageIdCounter = 0;
taskIdCounter = 0;

let pages = [];

class Element {
  constructor(name, selector, clickable = false, callBack = null, el = null) {
    this.name = name;
    this.selector = selector;
    this.el = el;
    this.clickable = clickable;
    this.callBack = callBack;
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
    this.elements = [new Element("elAddNewListButton", `#${this.id} > button`, true, this.addItem),
                     new Element("elTitle", `#${this.id} > h1`),
                     new Element("elToDoList", `#${this.id} > #${this.lists[0].id}`),
                     new Element("elCompletedList", `#${this.id} > #${this.lists[1].id}`)]
  } 
  
  addItem() {
    console.log("You Clicked A Button!");
    pages.push(new Page(pageIdCounter++));    
    controller.renderComponent("body", pages[pages.length - 1].htmlFrag);
    // reinitializes each component on the page as renderComponent currently resets the DOM which also
    // removes any event listeners. This is caused by modifiying the innerHTML of a parent element.
    // Can be improved upon.
    pages.forEach(page => controller.initComponent(page));
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
    super(id, title)
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
    super(id, title)
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>${this.title}</h1>
      <button>Add new task</button>
      <ul> 
        </li class="emptyList">Empty list</li>
      </ul>
    </div>
    `;
  }
}

class Task {

}

class Controller {
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

pages.push(new Page(pageIdCounter++));
// Test add new component
// pages[0].lists.push(new ComplexList("testComplexList", "Test Complex List"));
// pages[0].elements.push({name: "elTestComplexList", 
//                         selector: `#${pages[0].id} > #${pages[0].lists.at(-1).id}`, 
//                         el: null},)

controller.renderComponent("body", pages[pages.length - 1].htmlFrag);
controller.initComponent(pages[pages.length - 1]);
// Test add new component
// controller.renderComponent(`#${pages[0].id}`, pages[0].lists.at(-1).htmlFrag);
// controller.initComponent(pages[0]);
