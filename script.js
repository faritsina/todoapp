const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyMsg = document.getElementById("emptyMsg");

window.onload = () => {
  loadTasks();
  updateEmptyMessage();
};

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  const task = { text, completed: false, date: new Date().toLocaleString() };
  saveTask(task);
  renderTask(task);
  taskInput.value = "";
  updateEmptyMessage();
}

function renderTask(task) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <div>
      <strong>${task.text}</strong><br/>
      <small>${task.date}</small>
    </div>
    <div class="action-buttons">
      <button class="complete-btn" onclick="toggleComplete(this)">✔</button>
      <button class="delete-btn" onclick="deleteTask(this)">✖</button>
    </div>
  `;

  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  const tasks = getTasks();
  taskList.innerHTML = "";
  tasks.forEach(renderTask);
}

function toggleComplete(button) {
  const li = button.closest("li");
  li.classList.toggle("completed");
  updateStorageFromDOM();
}

function deleteTask(button) {
  const li = button.closest("li");
  li.remove();
  updateStorageFromDOM();
  updateEmptyMessage();
}

function clearAll() {
  localStorage.removeItem("tasks");
  taskList.innerHTML = "";
  updateEmptyMessage();
}

function updateStorageFromDOM() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    const text = li.querySelector("strong").innerText;
    const date = li.querySelector("small").innerText;
    const completed = li.classList.contains("completed");
    tasks.push({ text, date, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function searchTasks() {
  const keyword = searchInput.value.toLowerCase();
  const items = taskList.querySelectorAll("li");
  items.forEach(li => {
    const text = li.querySelector("strong").innerText.toLowerCase();
    li.style.display = text.includes(keyword) ? "flex" : "none";
  });
}

function updateEmptyMessage() {
  emptyMsg.style.display = taskList.children.length === 0 ? "block" : "none";
}

function toggleMode() {
  document.body.classList.toggle("light");
}
