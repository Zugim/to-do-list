let listIdCounter = 2;
let taskIdCounter = 0;

class Manager {
  constructor() {
    
    this.lists = [new List(this, "completedList"), new List(this, "completedList")];    
  }

  addList(list) {
    list.push(list)
    console.log("Item added to list.");
  }

  refreshList(list) {
    // reset the lists innerHTML before refreshing the list    
    list.element.innerHTML = '';
    list.items.forEach(item => {      
      list.element.innerHTML += item.element;
    });
  }
}

class List {
  constructor(manager, name) {
    this.id = listIdCounter++;    
    this.name = name;
    this.items = [];
    this.element = document.querySelector(`#${camelToKebab(name)}`);
  }

  addItem(item) {
    this.items.push(item);
    console.log("Item added to list.");
    manager.refreshList(this);
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    console.log("Item removed from list.");
    manager.refreshList(this);
  }

  moveItem(destination, id) {
    destination.items.push(this.items[id]);
    this.removeItem(id);
    console.log(`Item moved to ${destination.name}.`);
    manager.refreshList(this);
    manager.refreshList(destination);
  }

  getNumberOfItems() {
    return this.items.length;
  }
}

class Task {
  constructor(name, tag = "General") {    
    this.id = taskIdCounter++;
    this.name = name;
    this.tag = tag;
    this.element = `<li id="task${this.id}">${this.name} - ${this.tag} - Delete</li>`;
  }

  editName(newName) {
    this.name = newName;
  }

  editTag(newTag) {
    this.tag = newTag;
  }
}

const manager = new Manager();

// const toDoList = new List(manager, "toDoList");
// const completedList = new List(manager, "completedList");

function camelToKebab(string) {  
    return string.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`); 
}

function kebabToCamel(string) {
  return string.replace(/-./g, match => match[1].toUpperCase());
}
