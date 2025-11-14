
const DAY_NAME = "Thursday";             
const SHORT = "thur";                  
const currentUser = sessionStorage.getItem("currentUser");

if (!currentUser) window.location.href = "../../../index.html";


const DAY_PREFIX = currentUser + "_" + SHORT;
const MASTER_KEY = currentUser + "_allTasks";

let totalPoints = parseInt(localStorage.getItem(DAY_PREFIX + "_totalPoints")) || 0;
let tasks = JSON.parse(localStorage.getItem(DAY_PREFIX + "_tasks")) || [];

window.onload = function () {
  document.getElementById("totalPoints").textContent = totalPoints;
  renderTasks();
};

function saveData() {
  localStorage.setItem(DAY_PREFIX + "_totalPoints", totalPoints);
  localStorage.setItem(DAY_PREFIX + "_tasks", JSON.stringify(tasks));

  syncTasksToHomeCompilation();
}

function addTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const taskPoints = parseInt(document.getElementById("taskPoints").value);

  if (!taskName || isNaN(taskPoints) || taskPoints <= 0) {
    alert("Please enter a valid task and points value.");
    return;
  }

  const newTask = {
    id: Date.now(),
    name: taskName,
    points: taskPoints,
    completed: false
  };

  tasks.push(newTask);

  document.getElementById("taskName").value = "";
  document.getElementById("taskPoints").value = "";

  saveData();
  renderTasks();
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.completed) {
    task.completed = true;
    totalPoints += task.points;

    document.getElementById("totalPoints").textContent = totalPoints;

    saveData();
    renderTasks();
  }
}

function clearAllData() {
  if (!confirm(`Delete ALL ${DAY_NAME} data?`)) return;

  localStorage.removeItem(DAY_PREFIX + "_totalPoints");
  localStorage.removeItem(DAY_PREFIX + "_tasks");

  totalPoints = 0;
  tasks = [];

  document.getElementById("totalPoints").textContent = 0;

  syncTasksToHomeCompilation();
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = "task" + (task.completed ? " completed" : "");

    div.innerHTML = `
      <span>${task.name} — ${task.points} pts</span>
      <button onclick="completeTask(${task.id})" ${task.completed ? "disabled" : ""}>
        Complete
      </button>
    `;

    taskList.appendChild(div);
  });
}

// =======================================================================
// === SYNC DAY TASKS TO HOMEPAGE MASTER LIST ============================
// =======================================================================
function syncTasksToHomeCompilation() {
  let master = JSON.parse(localStorage.getItem(MASTER_KEY)) || [];

  master = master.filter(t => t.day !== DAY_NAME);

  const pending = tasks
    .filter(t => !t.completed)
    .map(t => ({
      day: DAY_NAME,
      text: t.name,
      done: false,
      points: t.points
    }));

  master = master.concat(pending);

  localStorage.setItem(MASTER_KEY, JSON.stringify(master));
}
