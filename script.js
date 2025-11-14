let tasks = [];
let currentFilter = "Today";

// 🔒 Load tasks from localStorage on page load
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// 🔒 Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 🔊 Create an Audio object for beep sound
const beepSound = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
beepSound.volume = 1.0; // Full volume

// 🟢 Allow sound on first click (needed for Edge/Chrome autoplay policies)
document.body.addEventListener("click", () => {
  beepSound.play().catch(() => {});
  beepSound.pause();
  beepSound.currentTime = 0;
}, { once: true });

// ✅ Request Notification permission on load
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// Function to show notifications or fallback alert
function showNotification(message) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(message, {
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827349.png",
      body: "Please check your task list!",
    });
  } else {
    alert(message); // fallback if permission not granted
  }
}

// 🔔 Check overdue tasks every 1 second (fast detection)
function checkOverdueTasks() {
  const today = new Date().toISOString().split("T")[0];
  tasks.forEach(task => {
    if (task.dueDate < today && !task.completed && !task.notified) {
      // Play loud beep 3 times for attention
      let repeat = 0;
      const beepInterval = setInterval(() => {
        beepSound.currentTime = 0;
        beepSound.play();
        repeat++;
        if (repeat >= 3) clearInterval(beepInterval);
      }, 400);

      // Show instant notification
      showNotification(`⚠️ Overdue Task: ${task.text} (Due: ${task.dueDate})`);

      task.notified = true; // Prevent repeat alerts for same task
    }
  });
}
setInterval(checkOverdueTasks, 1000); // check every second 🔁

// 🧩 Add New Task
function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const priority = document.getElementById("prioritySelect").value;
  const due = document.getElementById("dueDateInput").value || new Date().toISOString().split("T")[0];
  if (!text || !due) return;
  tasks.push({ text, priorityCategory: priority, dueDate: due, completed: false, notified: false });
  saveTasksToLocalStorage(); // ✅ Save after adding
  document.getElementById("taskInput").value = "";
  document.getElementById("dueDateInput").value = "";
  renderTasks(currentFilter);
}

// 🧮 Render Tasks
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
  } else if (["High Priority", "Medium Priority", "Low Priority"].includes(filter)) {
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

  activeTasks.sort((a, b) => (priorityOrder[a.priorityCategory] || 4) - (priorityOrder[b.priorityCategory] || 4));

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

// 🔁 Task toggle + delete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasksToLocalStorage(); // ✅ Save after toggling
  renderTasks(currentFilter);
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasksToLocalStorage(); // ✅ Save after deletion
  renderTasks(currentFilter);
}

// 🧭 Filter switching
document.querySelectorAll("#filterMenu li").forEach(li => {
  li.addEventListener("click", () => {
    document.querySelector("#filterMenu li.active")?.classList.remove("active");
    li.classList.add("active");
    currentFilter = li.getAttribute("data-category");
    document.getElementById("currentCategory").textContent = currentFilter;
    renderTasks(currentFilter);
  });
});

// 🔓 Load tasks from localStorage first, then render
loadTasksFromLocalStorage();
renderTasks(currentFilter);
