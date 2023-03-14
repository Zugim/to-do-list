let taskIdCounter = 0;

class Manager {
  refreshList(list) {
    list.element.innerHTML = '';

    list.items.forEach(item => {      
      list.element.innerHTML += item.element;
    });
  }
}

class List {
  constructor(name) {    
    this.name = name;
    this.items = [];
    this.element = document.querySelector(`#${camelToKebab(name)}`);
  }

  addItem(item) {
    this.items.push(item);
    console.log("Item added to list.");
  }

  removeItem(id) {
    this.items = this.items.filter(item => item.id !== id);
    console.log("Item removed from list.");
  }

  moveItem(destination, id) {
    destination.items.push(this.items[id]);
    this.removeItem(id);
    console.log(`Item moved to ${destination.name}.`);
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

const toDoList = new List("toDoList", "to-do-list");
const completedList = new List("completedList", "completed-list");

function camelToKebab(string) {  
    return string.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`); 
}

function kebabToCamel(string) {
  return string.replace(/-./g, match => match[1].toUpperCase());
}
