let toDoList = [];
let completedList = [];

let currentID = 0;

class Task {
  constructor(title) {
    this.id = currentID;
    this.title = title;
  }
}

function createNewListItem(title) {
  
  return task;
}

function addItemToList(title, list) {  
  list.push(new Task(title));
  currentID++;
}

function removeItemFromList(list, id) { 
  updateList(list, list.filter(item => item.id !== id)); 
  console.log(Object.keys({list})[0]);
}

function updateList (currentList, newList) {
  if(Object.keys({currentList})[0] === "toDoList") {
    toDoList = newList;
  } else if (Object.keys({currentList})[0] === "completedList") {
    completedList = newList;
  } else {
    console.log("No such list exists");
  }
}

function moveToDifferentList(currentList, newList, id) {
  addItemToList(newList, currentList[id]);
  removeItemFromList(currentList, id);
}

function renderList(list) {
  list.forEach(item => console.log(item));
}