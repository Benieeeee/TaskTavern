const ALL_TASKS_KEY = 'allTasks';

document.addEventListener("DOMContentLoaded", renderTasks);

function renderTasks() {
    const taskCompilationArea = document.getElementById("task-compilation-area");
    
    // 1. Retrieve the master list from localStorage
    const storedTasksJSON = localStorage.getItem(ALL_TASKS_KEY);
    let allTasks = storedTasksJSON ? JSON.parse(storedTasksJSON) : [];

    // Filter to show ONLY outstanding (not done) tasks
    const pendingTasks = allTasks.filter(task => !task.done);

    // Clear and set the header
    taskCompilationArea.innerHTML = '<h2>Compiled Pending Tasks</h2>';
    
    if (pendingTasks.length === 0) {
        const noTasksMessage = document.createElement('p');
        noTasksMessage.textContent = "🥳 No tasks currently pending! All clear.";
        noTasksMessage.style.textAlign = 'center';
        noTasksMessage.style.color = '#715714';
        taskCompilationArea.appendChild(noTasksMessage);
        return;
    }

    // 2. Create the list
    const taskList = document.createElement('ul');
    taskList.classList.add('compiled-task-list');

    pendingTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.classList.add('compiled-task-item');
        
        // Use data attributes to store the task info needed for completion
        listItem.innerHTML = `
            <span class="task-day">(${task.day}):</span>
            <span class="task-text">${task.text}</span>
            <button class="complete-btn" 
                    data-text="${task.text.replace(/"/g, '&quot;')}" 
                    data-day="${task.day}">Complete</button>
        `;
        
        taskList.appendChild(listItem);
    });

    // 3. Attach event listener to handle 'Complete' button clicks
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('complete-btn')) {
            const btn = event.target;
            const taskText = btn.getAttribute('data-text');
            const taskDay = btn.getAttribute('data-day');
            
            markTaskAsComplete(taskText, taskDay);
        }
    });

    taskCompilationArea.appendChild(taskList);
}


function markTaskAsComplete(taskText, taskDay) {
    // Determine the day-specific keys (e.g., 'mon_tasks', 'mon_totalPoints')
    const dayPrefix = taskDay.toLowerCase().substring(0, 3);
    const dayKey = dayPrefix + '_tasks'; 
    const dayPointsKey = dayPrefix + '_totalPoints'; 

    // --- Step 1: Update the day's local storage item (e.g., 'mon_tasks') ---
    const storedDayTasksJSON = localStorage.getItem(dayKey);
    let dayTasks = storedDayTasksJSON ? JSON.parse(storedDayTasksJSON) : [];
    
    let pointsAwarded = 0;
    
    // Find the task in the day's list and mark it complete
    const taskIndex = dayTasks.findIndex(t => t.name === taskText && !t.completed);
    
    if (taskIndex !== -1) {
        dayTasks[taskIndex].completed = true;
        pointsAwarded = dayTasks[taskIndex].points;
        
        // Save the updated day's task list
        localStorage.setItem(dayKey, JSON.stringify(dayTasks));
        
        // Update total points for that day
        let totalPoints = parseInt(localStorage.getItem(dayPointsKey)) || 0;
        totalPoints += pointsAwarded;
        localStorage.setItem(dayPointsKey, totalPoints);
    }
    
    // --- Step 2: Update the master list (by removing the task) ---
    const masterListJSON = localStorage.getItem(ALL_TASKS_KEY);
    let masterList = masterListJSON ? JSON.parse(masterListJSON) : [];

    // Filter out the completed task from the master list
    masterList = masterList.filter(task => 
        !(task.text === taskText && task.day === taskDay)
    );
    
    localStorage.setItem(ALL_TASKS_KEY, JSON.stringify(masterList));
    
    // Re-render the list immediately
    renderTasks(); 
}