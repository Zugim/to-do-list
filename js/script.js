console.log("Working...");

const toDoList = document.querySelector("#to-do-list");
let nothingToDo = document.querySelector("#nothing-to-do");

let idCount = 1;

function addToDoTask(title) {
  checkRemoveNothingToDo(nothingToDo);
  toDoList.innerHTML += 
    `<li id="task${idCount < 10 ? "0" + idCount : idCount}">${title}</li>`;
  idCount++;
}

function removeToDoTask(id) {
  document.querySelector(`#task${id < 10 ? "0" + id : id}`).remove(); 
  checkAddNothingToDo();
}

function checkRemoveNothingToDo() {
  if (nothingToDo) {
    nothingToDo.remove();
    nothingToDo = null;
  }
}

function checkAddNothingToDo() {
  if (!document.querySelector("#to-do-list li")) {
    toDoList.innerHTML += `<li id="nothing-to-do">Nothing to do</li>`;
    nothingToDo = document.querySelector("#nothing-to-do");
  }
}
