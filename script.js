let tasks = [];
let currentFilter = "Today";

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("prioritySelect").value;
  const due = document.getElementById("dueDateInput").value || new Date().toISOString().split("T")[0];
  if (!text || !due) return;
  tasks.push({ text, priorityCategory: priority, dueDate: due, completed: false });
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  renderTasks(currentFilter);
}

function renderTasks(filter) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + (7 - weekEnd.getDay()));
  const weekEndStr = weekEnd.toISOString().split("T")[0];

  let activeTasks = [];
  let completedTasks = [];

  if (filter === "Completed") {
    completedTasks = tasks.filter(t => t.completed);
  } else if (filter === "All") {
    activeTasks = tasks.filter(t => !t.completed);
    completedTasks = tasks.filter(t => t.completed);
  } else if (filter === "This Week") {
    activeTasks = tasks.filter(t => !t.completed && t.dueDate >= today && t.dueDate <= weekEndStr);
    completedTasks = tasks.filter(t => t.completed && t.dueDate >= today && t.dueDate <= weekEndStr);
  } else if (
    ["High Priority", "Medium Priority", "Low Priority"].includes(filter)
  ) {
    activeTasks = tasks.filter(t => t.priorityCategory === filter && !t.completed);
    completedTasks = tasks.filter(t => t.priorityCategory === filter && t.completed);
  } else if (filter === "Today") {
    activeTasks = tasks.filter(t => t.dueDate === today && !t.completed);
    completedTasks = tasks.filter(t => t.dueDate === today && t.completed);
  } else if (filter === "Tomorrow") {
    activeTasks = tasks.filter(t => t.dueDate === tomorrow && !t.completed);
    completedTasks = tasks.filter(t => t.dueDate === tomorrow && t.completed);
  } else if (filter === "Overdue") {
    activeTasks = tasks.filter(t => t.dueDate < today && !t.completed);
    completedTasks = tasks.filter(t => t.dueDate < today && t.completed);
  }

  const priorityOrder = {
    "High Priority": 1,
    "Medium Priority": 2,
    "Low Priority": 3,
    "None": 4
  };

  activeTasks.sort((a, b) =>
    (priorityOrder[a.priorityCategory] || 4) - (priorityOrder[b.priorityCategory] || 4)
  );

  // Show Active Tasks
  activeTasks.forEach(task => {
    const index = tasks.indexOf(task);
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="left">
        <input type="checkbox" onchange="toggleComplete(${index})">
        <span>${task.text}
          <small style="font-size:12px; color:gray;">[${task.priorityCategory}, ${task.dueDate}]</small>
        </span>
      </div>
      <button onclick="deleteTask(${index})">🗑️</button>`;
    taskList.appendChild(li);
  });

  // Show Completed Tasks under section
  if (completedTasks.length > 0) {
    const heading = document.createElement("h3");
    heading.textContent = "Completed Tasks";
    heading.style.marginTop = "20px";
    heading.style.color = "white";
    taskList.appendChild(heading);

    completedTasks.forEach(task => {
      const index = tasks.indexOf(task);
      const li = document.createElement("li");
      li.classList.add("completed");
      li.innerHTML = `
        <div class="left">
          <input type="checkbox" checked onchange="toggleComplete(${index})">
          <span>${task.text}
            <small style="font-size:12px; color:gray;">[${task.priorityCategory}, ${task.dueDate}]</small>
          </span>
        </div>
        <button onclick="deleteTask(${index})">🗑️</button>`;
      taskList.appendChild(li);
    });
  }
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks(currentFilter);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks(currentFilter);
}

document.querySelectorAll("#filterMenu li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelector("#filterMenu li.active")?.classList.remove("active");
    li.classList.add("active");
    currentFilter = li.getAttribute("data-category");
    document.getElementById("currentCategory").textContent = currentFilter;
    renderTasks(currentFilter);
  });
});

renderTasks(currentFilter);
