// =======================================================================
// === CONFIGURATION (CHANGE THESE FOR EACH DAY) ===
// =======================================================================
const DAY_NAME = 'Monday';         // E.g., 'Monday', 'Tuesday', 'Wednesday'
const DAY_PREFIX = 'mon';          // E.g., 'mon', 'tue', 'wed'
const ALL_TASKS_KEY = 'allTasks';  // Master key for homepage compilation
// =======================================================================

// Load saved data using the dynamic keys
let totalPoints = parseInt(localStorage.getItem(DAY_PREFIX + "_totalPoints")) || 0;
let tasks = JSON.parse(localStorage.getItem(DAY_PREFIX + "_tasks")) || [];

window.onload = function () {
  document.getElementById('totalPoints').textContent = totalPoints;
  renderTasks();
};

function saveData() {
  localStorage.setItem(DAY_PREFIX + "_totalPoints", totalPoints);
  localStorage.setItem(DAY_PREFIX + "_tasks", JSON.stringify(tasks));
  
  // *** Sync tasks to the master list for the homepage ***
  syncTasksToHomeCompilation(); 
}

function addTask() {
  const taskName = document.getElementById('taskName').value.trim();
  const taskPoints = parseInt(document.getElementById('taskPoints').value);
  if (!taskName || isNaN(taskPoints) || taskPoints <= 0) {
    alert('Please enter a valid task and points value.');
    return;
  }

  const newTask = { id: Date.now(), name: taskName, points: taskPoints, completed: false };
  tasks.push(newTask);
  document.getElementById('taskName').value = '';
  document.getElementById('taskPoints').value = '';
  saveData();
  renderTasks();
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task && !task.completed) {
    task.completed = true;
    totalPoints += task.points;
    document.getElementById('totalPoints').textContent = totalPoints;
    saveData();
    renderTasks();
  }
}

function clearAllData() {
  if (confirm("Delete ALL " + DAY_NAME + " data?")) {
    localStorage.removeItem(DAY_PREFIX + "_totalPoints");
    localStorage.removeItem(DAY_PREFIX + "_tasks");
    
    totalPoints = 0;
    tasks = [];
    document.getElementById('totalPoints').textContent = 0;
    renderTasks();
    
    // Also clear from the master list by syncing an empty list
    syncTasksToHomeCompilation(); 
  }
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task' + (task.completed ? ' completed' : '');
    taskDiv.innerHTML = `
      <span>${task.name} — ${task.points} pts</span>
      <button onclick="completeTask(${task.id})" ${task.completed ? 'disabled' : ''}>Complete</button>
    `;
    taskList.appendChild(taskDiv);
  });
}

// === NEW FUNCTION: Sync Day's tasks to the master homepage list ===
function syncTasksToHomeCompilation() {
    const masterListJSON = localStorage.getItem(ALL_TASKS_KEY);
    let masterList = masterListJSON ? JSON.parse(masterListJSON) : [];
    
    // 1. Remove all existing tasks for this day from the master list
    masterList = masterList.filter(task => task.day !== DAY_NAME);
    
    // 2. Prepare *uncompleted* tasks for the master list
    const dayTasksForMaster = tasks
        .filter(task => !task.completed) 
        .map(task => ({
            day: DAY_NAME,       // 'Monday'
            text: task.name,     // 'Finish CSS'
            done: task.completed, // false
            points: task.points 
        }));
    
    // 3. Merge the current uncompleted tasks back into the master list
    masterList = masterList.concat(dayTasksForMaster);
    
    // 4. Save the updated master list
    localStorage.setItem(ALL_TASKS_KEY, JSON.stringify(masterList));
}