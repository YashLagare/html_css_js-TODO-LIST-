document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const prioritySelect = document.getElementById("prioritySelect");
    const categorySelect = document.getElementById("categorySelect");
    const addTaskButton = document.getElementById("addTaskButton");
    const todoList = document.getElementById("todoList");

    const filterAll = document.getElementById("filterAll");
    const filterPending = document.getElementById("filterPending");
    const filterCompleted = document.getElementById("filterCompleted");
    const filterPriority = document.getElementById("filterPriority");
    const filterCategory = document.getElementById("filterCategory");

    const completedCount = document.getElementById("completedCount");
    const pendingCount = document.getElementById("pendingCount");

    const exportTasks = document.getElementById("exportTasks");
    const importTasks = document.getElementById("importTasks");

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDeadline = taskDate.value;
        const taskPriority = prioritySelect.value;
        const taskCategory = categorySelect.value;

        if (taskText === "") return;

        const task = {
            text: taskText,
            date: taskDeadline,
            priority: taskPriority,
            category: taskCategory,
            completed: false
        };

        saveTask(task);
        taskInput.value = "";
        taskDate.value = "";
        updateStats();
    }

    function saveTask(task) {
        const li = document.createElement("li");
        li.innerHTML = `
            <input type="checkbox">
            <span>${task.text} 📅 ${task.date || "No deadline"} 🏷️ ${task.category.toUpperCase()}</span>
            <span class="priority ${task.priority}">${task.priority.toUpperCase()}</span>
            <button class="delete">❌</button>
        `;

        li.querySelector("input").addEventListener("change", () => {
            li.classList.toggle("completed");
            updateStats();
        });

        li.querySelector(".delete").addEventListener("click", () => {
            li.remove();
            updateStats();
        });

        todoList.appendChild(li);
    }

    function updateStats() {
        const totalTasks = document.querySelectorAll("#todoList li").length;
        const completedTasks = document.querySelectorAll("#todoList li.completed").length;
        completedCount.textContent = completedTasks;
        pendingCount.textContent = totalTasks - completedTasks;
    }

    function exportData() {
        const tasks = [...document.querySelectorAll("#todoList li")].map(li => li.innerText);
        const blob = new Blob([JSON.stringify(tasks)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tasks.json";
        a.click();
    }

    function importData(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function () {
            JSON.parse(reader.result).forEach(task => saveTask(task));
        };
        reader.readAsText(file);
    }

    addTaskButton.addEventListener("click", addTask);
    exportTasks.addEventListener("click", exportData);
    importTasks.addEventListener("change", importData);
});
