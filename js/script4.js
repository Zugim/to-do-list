pageIdCounter = 0;
taskIdCounter = 0;

let pages = [];

class Page {
  constructor(id) {
    this.id = `page${id}`;    
    this.lists = [new ComplexList("toDoList", "To Do List"),
                  new SimpleList("completedList", "Completed List"),];
    this.htmlFrag = `
    <div id="${this.id}">
      <h1>4/10/2023</h1>
      <button>Add new list</button>
      ${this.lists.map(item => `${item.htmlFrag}`).join("")}
    </div>
    `;
    this.elements = [{name: "elAddNewListButton", selector: `#${this.id} > button`, el: null},
                     {name: "elTitle", selector: `#${this.id} > h1`, el: null},
                     {name: "elToDoList", selector: `#${this.id} > #${this.lists[0].id}`, el: null},
                     {name: "elCompletedList", selector: `#${this.id} > #${this.lists[1].id}`, el: null},];    
  }  
}

class SimpleList {
  constructor(id, title) {
    this.id = id;
    this.title = title;
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

class ComplexList {
  constructor(id, title) {
    this.id = id;
    this.title = title;
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
    });    
  }
}

let controller = new Controller();

pages.push(new Page(pageIdCounter++));
pages[0].lists.push(new ComplexList("testComplexList", "Test Complex List"));
// Test add new component
// pages[0].elements.push({name: "elTestComplexList", 
//                         selector: `#${pages[0].id} > #${pages[0].lists.at(-1).id}`, 
//                         el: null},)

controller.renderComponent("body", pages[0].htmlFrag);
controller.initComponent(pages[0]);
// Test add new component
// controller.renderComponent(`#${pages[0].id}`, pages[0].lists.at(-1).htmlFrag);
// controller.initComponent(pages[0]);