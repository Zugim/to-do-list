let taskIdCounter = 0;

class Manager {
  refreshList(list) {
    list.items.forEach(item => console.log(item.name));
  }
}

class List {
  constructor(name) {
    this.name = name;
    this.items = [];
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
    console.log(`Item moved to ${destination.name}.`)
  }
}

class Task {
  constructor(name) {
    this.id = taskIdCounter++;
    this.name = name;
  }
}

const manager = new Manager();

const toDoList = new List("toDoList")
const completedList = new List("completedList")

const testTask = new Task("testTask");
const testTask1 = new Task("testTask1");
