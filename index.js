console.log("Welcome to my todo app!");

let todoDataList = document.getElementById("todo-data-list");
let saveButton = document.getElementById("save-todo");
let todoInputBar = document.getElementById("todo-input-bar");
let getTodos = document.getElementById("get-todo");
let todos = [];

//event listeners

todoInputBar.addEventListener("keyup", function toggleSaveButton() {
  let todoText = todoInputBar.value;
  if (todoText.length === 0) {
    saveButton.classList.add("disabled");
  } else if (saveButton.classList.contains("disabled")) {
    saveButton.classList.remove("disabled");
  }
});

saveButton.addEventListener("click", function getTextAndAddTodo() {
  let todoText = todoInputBar.value;
  if (todoText.length === 0) return;
  let todo = {
    text: todoText,
    status: "In progress",
    finishButtonText: "Finished",
  };
  todos.push(todo);
  addTodo(todo, todos.length);
  todoInputBar.value = "";
  saveButton.classList.add("disabled");
});

function reRenderTodos() {
  todoDataList.innerHTML = "";
  todos.forEach((element, idx) => {
    addTodo(element, idx + 1);
  });
}

getTodos.addEventListener("click", function getPendingTodos() {
  todos = todos.filter((todo) => todo.status !== "Finished");
  reRenderTodos();
});

function editTodo(event) {
  let editButtonPressed = event.target;
  let indexToEdit = Number(editButtonPressed.getAttribute("todo-idx"));
  let detailDiv = document.querySelector(`div[todo-idx="${indexToEdit}"]`);
  let input = document.querySelector(`input[todo-idx="${indexToEdit}"]`);
  detailDiv.style.display = "none";
  input.type = "text";
  input.value = detailDiv.textContent;
}

function saveEditedTodo(event) {
  let input = event.target;
  let indexToEdit = Number(input.getAttribute("todo-idx"));
  let detailDiv = document.querySelector(`div[todo-idx="${indexToEdit}"]`);
  if (event.keyCode == 13) {
    detailDiv.textContent = input.value;
    todos[indexToEdit].text = input.value;
    detailDiv.style.display = "block";
    input.value = "";
    input.type = "hidden";
  }
}

function finishTodo(event) {
  let finishButtonPressed = event.target;
  let statusToBeChanged = Number(finishButtonPressed.getAttribute("todo-idx"));

  if (todos[statusToBeChanged].status == "Finished") {
    todos[statusToBeChanged].status = "In progress";
    todos[statusToBeChanged].finishButtonText = "Finished";
  } else {
    todos[statusToBeChanged].status = "Finished";
    todos[statusToBeChanged].finishButtonText = "Undo";
  }

  todos.sort((a, b) => {
    if (a.status == "Finished") return 1;
    return -1;
  });

  reRenderTodos();
}

function removeTodo(event) {
  let deleteButtonPressed = event.target;
  let indexToBeRemoved = Number(deleteButtonPressed.getAttribute("todo-idx"));
  todos.splice(indexToBeRemoved, 1);
  reRenderTodos();
}

function addTodo(todo, todoCount) {
  let todoRow = document.createElement("div");
  let todoItem = document.createElement("div");
  let todoNumber = document.createElement("div");
  let todoDetail = document.createElement("div");
  let todoStatus = document.createElement("div");
  let todoAction = document.createElement("div");
  let deleteBtn = document.createElement("button");
  let finishBtn = document.createElement("button");
  let hr = document.createElement("hr");
  let editBtn = document.createElement("button");
  let hiddenInput = document.createElement("input");

  //adding classes
  todoRow.classList.add("row");
  todoItem.classList.add(
    "todo-item",
    "d-flex",
    "flex-row",
    "justify-content-between",
    "align-items-center"
  );
  todoNumber.classList.add("todo-no");
  todoDetail.classList.add("todo-detail");
  todoStatus.classList.add("todo-status");
  todoAction.classList.add(
    "todo-action",
    "d-flex",
    "flex-row",
    "justify-content-start",
    "gap-2"
  );
  deleteBtn.classList.add("btn", "btn-danger", "delete-todo");
  finishBtn.classList.add("btn", "btn-success", "finish-todo");
  editBtn.classList.add("btn", "btn-warning", "edit-todo");
  hiddenInput.classList.add("todo-detail", "form-control");

  deleteBtn.setAttribute("todo-idx", todoCount - 1);
  finishBtn.setAttribute("todo-idx", todoCount - 1);
  editBtn.setAttribute("todo-idx", todoCount - 1);
  todoDetail.setAttribute("todo-idx", todoCount - 1);
  hiddenInput.setAttribute("todo-idx", todoCount - 1);

  deleteBtn.onclick = removeTodo;
  finishBtn.onclick = finishTodo;
  editBtn.onclick = editTodo;
  hiddenInput.addEventListener("keypress", saveEditedTodo);

  todoNumber.textContent = `${todoCount}.`;
  todoDetail.textContent = todo.text;
  todoStatus.textContent = todo.status;
  deleteBtn.textContent = "Delete";
  finishBtn.textContent = todo.finishButtonText;
  editBtn.textContent = "Edit";
  hiddenInput.type = "hidden";

  todoAction.appendChild(deleteBtn);
  todoAction.appendChild(finishBtn);
  todoAction.appendChild(editBtn);

  todoItem.appendChild(todoNumber);
  todoItem.appendChild(todoDetail);
  todoItem.appendChild(hiddenInput);
  todoItem.appendChild(todoStatus);
  todoItem.appendChild(todoAction);

  todoRow.appendChild(todoItem);

  todoRow.appendChild(hr);

  todoDataList.appendChild(todoRow);
}
