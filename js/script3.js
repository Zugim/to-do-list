let pageIdCounter = 0;
let listIdCounter = 0;
let taskIdCounter = 0;

class Component {
  constructor(idStem, id) {
    this.id = `${idStem}${id}`;
  }

  draw(location, htmlFrag) {
    this.htmlFrag = htmlFrag;
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
  constructor(idStem, id, date, htmlFrag) {
    super(idStem, id);
    this.date = date;    

    this.lists = [new List("toDoList", id, "To Do List"),
                  new List("completedList", id, "Completed List")];
    this.htmlFrag = `
      <div id="${this.id}">
        <h1>${this.date}</h1>
        <h2>${this.lists[0].title}</h2>
        <ul id="${this.lists[0].id}">${this.lists[0].title}</ul>
        <h2>${this.lists[1].title}</h2>
        <ul id="${this.lists[1].id}">${this.lists[1].title}</ul>
      </div>
    `
  }
}

class List extends Component {
  constructor(idStem, id, title) {
    super(idStem, id);
    this.title = title;
    this.subLists = [];
  }
}

class Task extends Component {
  constructor(idStem, id, title, tag) {
    super(idStem, id);
    this.title = title;
    this.tag = tag;
  }
}

function generateTemplate(stem) {
  return `
  <div id="${stem.id}">
    <h1>${stem.date}</h1>
    <h2>${stem.lists[0].title}</h2>
    <ul id="${stem.lists[0].id}">${stem.lists[0].title}</ul>
    <h2>${stem.lists[1].title}</h2>
    <ul id="${stem.lists[1].id}">${stem.lists[1].title}</ul>
  </div>
  `
}

const testPage = new Page ("page", pageIdCounter++, "3/16/2023");

testPage.draw("body", testPage.htmlFrag);
testPage.destroy();
testPage.lists[0].editAttribute("title", "OVERWRITTEN");
testPage.draw("body", `
<div id="${testPage.id}">
  <h1>${testPage.date}</h1>
  <h2>${testPage.lists[0].title}</h2>
  <ul id="${testPage.lists[0].id}">${testPage.lists[0].title}</ul>
  <h2>${testPage.lists[1].title}</h2>
  <ul id="${testPage.lists[1].id}">${testPage.lists[1].title}</ul>
</div>
`);




