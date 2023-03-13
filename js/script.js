console.log("Working...");

const toDoList = document.querySelector("#to-do-list");
let nothingToDo = document.querySelector("#nothing-to-do");

idCount = 1;

function addToDoTask(title) {
  checkRemoveNothingToDo(nothingToDo);
  toDoList.innerHTML += 
    `<li id="task${idCount < 10 ? "0" + idCount : idCount}">${title}</li>`;
  idCount++;
}

function removeToDoTask(id = 1) {
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
    nothingToDo = document.createElement("li");
    nothingToDo.setAttribute("id", "nothing-to-do");
    nothingToDo.innerHTML = `Nothing to do`;
    toDoList.appendChild(nothingToDo);
  }
}
