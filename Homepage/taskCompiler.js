// ======================================================
//  CURRENT USER CHECK
// ======================================================
const currentUser = sessionStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "../index.html";
}

// ======================================================
//  USER-SPECIFIC STORAGE KEYS
// ======================================================
const ALL_TASKS_KEY = currentUser + "_allTasks";

// ======================================================
//  RENDER PENDING TASKS ON DOM LOAD
// ======================================================
document.addEventListener("DOMContentLoaded", renderTasks);

function renderTasks() {
    const taskCompilationArea = document.getElementById("task-compilation-area");

    // Load this user's master task list
    const storedTasksJSON = localStorage.getItem(ALL_TASKS_KEY);
    let allTasks = storedTasksJSON ? JSON.parse(storedTasksJSON) : [];

    // Filter pending tasks
    const pendingTasks = allTasks.filter(task => !task.done);

    taskCompilationArea.innerHTML = '<h2>Compiled Pending Tasks</h2>';

    if (pendingTasks.length === 0) {
        const noTasks = document.createElement("p");
        noTasks.textContent = "🥳 No tasks currently pending! All clear.";
        noTasks.style.textAlign = "center";
        noTasks.style.color = "#715714";
        taskCompilationArea.appendChild(noTasks);
        return;
    }

    const taskList = document.createElement("ul");
    taskList.classList.add("compiled-task-list");

    pendingTasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("compiled-task-item");

        li.innerHTML = `
            <span class="task-day">(${task.day}):</span>
            <span class="task-text">${task.text}</span>
            <button class="complete-btn"
                data-text="${task.text.replace(/"/g, '&quot;')}"
                data-day="${task.day}">
                Complete
            </button>
        `;

        taskList.appendChild(li);
    });

    // Handle COMPLETE button click
    taskList.addEventListener("click", event => {
        if (!event.target.classList.contains("complete-btn")) return;

        const taskText = event.target.dataset.text;
        const taskDay = event.target.dataset.day;

        markTaskAsComplete(taskText, taskDay);
    });

    taskCompilationArea.appendChild(taskList);
}

// ======================================================
//  MARK TASK AS COMPLETE
// ======================================================
function markTaskAsComplete(taskText, taskDay) {
    const short = taskDay.toLowerCase().substring(0, 3);

    const dayKey = currentUser + "_" + short + "_tasks";
    const dayPointsKey = currentUser + "_" + short + "_totalPoints";

    let dayTasks = JSON.parse(localStorage.getItem(dayKey)) || [];
    let pointsAwarded = 0;

    const idx = dayTasks.findIndex(t => t.name === taskText && !t.completed);
    if (idx !== -1) {
        dayTasks[idx].completed = true;
        pointsAwarded = dayTasks[idx].points;

        localStorage.setItem(dayKey, JSON.stringify(dayTasks));

        let totalPoints = parseInt(localStorage.getItem(dayPointsKey)) || 0;
        totalPoints += pointsAwarded;
        localStorage.setItem(dayPointsKey, totalPoints);
    }

    // Update master task list
    let master = JSON.parse(localStorage.getItem(ALL_TASKS_KEY)) || [];
    master = master.filter(t => !(t.text === taskText && t.day === taskDay));
    localStorage.setItem(ALL_TASKS_KEY, JSON.stringify(master));

    renderTasks();
}
