// Show current time and date
function updateTimeDate() {
  const now = new Date();
  document.getElementById("time-date").textContent = now.toLocaleString();
}
updateTimeDate();
setInterval(updateTimeDate, 60000); // Update every minute

// Set page title from saved list name
document.addEventListener('DOMContentLoaded', () => {
  const listNameInput = document.getElementById('list-name');
  const editBtn = document.getElementById('list-name-edit-btn');
  const icon = editBtn.querySelector('i');

  const savedListName = localStorage.getItem('listName');
  if (savedListName) {
    listNameInput.value = savedListName;
    document.title = savedListName;
  }

  listNameInput.setAttribute('readonly', true);

  editBtn.addEventListener('click', () => {
    if (listNameInput.hasAttribute('readonly')) {
      listNameInput.removeAttribute('readonly');
      listNameInput.focus();
      icon.classList.replace('fa-pencil', 'fa-floppy-disk');
    } else {
      listNameInput.setAttribute('readonly', true);
      icon.classList.replace('fa-floppy-disk', 'fa-pencil');

      const name = listNameInput.value.trim();
      localStorage.setItem('listName', name);
      document.title = name || 'Document';
    }
  });

  listNameInput.addEventListener('input', () => {
    document.title = listNameInput.value || 'Document';
  });

  listNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !listNameInput.hasAttribute('readonly')) {
      e.preventDefault();
      editBtn.click();
    }
  });
});

// Rebuild tasks from storage
let taskCounter = parseInt(localStorage.getItem("taskCount")) || 3;
const taskContainer = document.getElementById("task-box");
const original = document.getElementById("task-1");

for (let i = 1; i <= taskCounter; i++) {
  if (i <= 3) {
    const taskEl = document.getElementById(`task-${i}`);
    if (taskEl) setupTaskEvents(taskEl, i);
  } else {
    const clone = original.cloneNode(true);
    clone.id = `task-${i}`;
    clone.classList.add("drag-n-drop");
    clone.setAttribute("draggable", "true");

    const nameInput = clone.querySelector('.task-name');
    const checkbox = clone.querySelector('input[type="checkbox"]');

    nameInput.value = localStorage.getItem(`taskName${i}`) || '';
    checkbox.checked = localStorage.getItem(`taskDone${i}`) === 'true';

    taskContainer.appendChild(clone);
    setupTaskEvents(clone, i);
  }
}
taskCounter++;
dragDrop();

// Add new task
document.getElementById("add-new").addEventListener("click", () => {
  const clone = original.cloneNode(true);
  clone.id = `task-${taskCounter}`;
  clone.classList.add("drag-n-drop");
  clone.setAttribute("draggable", "true");

  const nameInput = clone.querySelector('.task-name');
  const checkbox = clone.querySelector('input[type="checkbox"]');
  const editButton = clone.querySelector('.edit-btn');
  const icon = editButton.querySelector('i');

  nameInput.value = '';
  nameInput.setAttribute('readonly', true);
  checkbox.checked = false;

  icon.className = 'fa-solid fa-pencil';

  taskContainer.appendChild(clone);
  setupTaskEvents(clone, taskCounter);
  dragDrop();

  localStorage.setItem("taskCount", taskCounter);
  taskCounter++;
});

// Setup individual task
function setupTaskEvents(taskEl, index) {
  const nameInput = taskEl.querySelector('.task-name');
  const checkbox = taskEl.querySelector('input[type="checkbox"]');
  const editButton = taskEl.querySelector('.edit-btn');
  const icon = editButton.querySelector('i');
  const trashBtn = taskEl.querySelector('.trash-btn');

  const nameKey = `taskName${index}`;
  const doneKey = `taskDone${index}`;

  nameInput.value = localStorage.getItem(nameKey) || '';
  checkbox.checked = localStorage.getItem(doneKey) === 'true';

  nameInput.setAttribute('readonly', true);
  icon.className = 'fa-solid fa-pencil';

  nameInput.addEventListener('input', () => {
    localStorage.setItem(nameKey, nameInput.value);
  });

  checkbox.addEventListener('change', () => {
    localStorage.setItem(doneKey, checkbox.checked);
  });

  editButton.addEventListener('click', () => {
    if (nameInput.hasAttribute('readonly')) {
      nameInput.removeAttribute('readonly');
      nameInput.focus();
      icon.className = 'fa-regular fa-floppy-disk';
    } else {
      nameInput.setAttribute('readonly', true);
      icon.className = 'fa-solid fa-pencil';
    }
  });

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !nameInput.hasAttribute('readonly')) {
      e.preventDefault();
      nameInput.setAttribute('readonly', true);
      icon.className = 'fa-solid fa-pencil';
    }
  });

  trashBtn.addEventListener('click', () => {
    taskEl.remove();
    localStorage.removeItem(nameKey);
    localStorage.removeItem(doneKey);

    const remaining = document.querySelectorAll('.drag-n-drop');
    let max = 0;
    remaining.forEach(task => {
      const match = task.id.match(/task-(\d+)/);
      if (match) max = Math.max(max, parseInt(match[1]));
    });
    localStorage.setItem('taskCount', max);
  });

  // Delete task on trash icon click
if (trashBtn) {
  trashBtn.addEventListener('click', () => {
    // Remove from DOM
    taskEl.remove();

    // Remove localStorage data for this task
    localStorage.removeItem(nameKey);
    localStorage.removeItem(doneKey);

    // Re-index remaining tasks
    const allTasks = Array.from(document.querySelectorAll('.drag-n-drop'));
    allTasks.forEach((task, idx) => {
      const newIndex = idx + 1; // 1-based index
      const oldId = task.id;
      const oldNumMatch = oldId.match(/task-(\d+)/);
      if (oldNumMatch) {
        const oldIndex = oldNumMatch[1];

        // Rename task id
        task.id = `task-${newIndex}`;

        // Update localStorage keys for task name and done state
        const taskNameInput = task.querySelector('.task-name');
        const taskCheckbox = task.querySelector('input[type="checkbox"]');

        // Save current values under new keys
        localStorage.setItem(`taskName${newIndex}`, taskNameInput.value);
        localStorage.setItem(`taskDone${newIndex}`, taskCheckbox.checked);

        // Remove old keys if different
        if (oldIndex !== newIndex.toString()) {
          localStorage.removeItem(`taskName${oldIndex}`);
          localStorage.removeItem(`taskDone${oldIndex}`);
        }
      }
    });

    // Update task count
    const newCount = allTasks.length;
    localStorage.setItem('taskCount', newCount);

    // Update global taskCounter so new tasks get correct ID
    taskCounter = newCount + 1;
  });
}

}

// Drag-and-drop logic
function dragDrop() {
  document.querySelectorAll(".drag-n-drop").forEach((el) => {
    el.setAttribute("draggable", "true");

    el.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text/plain", ev.target.id);
    });

    el.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      el.classList.add("drag-over");
    });

    el.addEventListener("dragleave", () => {
      el.classList.remove("drag-over");
    });

    el.addEventListener("drop", (ev) => {
      ev.preventDefault();
      el.classList.remove("drag-over");

      const draggedId = ev.dataTransfer.getData("text/plain");
      const draggedEl = document.getElementById(draggedId);
      const dropTarget = el;

      if (dropTarget !== draggedEl) {
        const temp = document.createElement("div");
        dropTarget.parentNode.insertBefore(temp, dropTarget);
        draggedEl.parentNode.insertBefore(dropTarget, draggedEl);
        temp.parentNode.insertBefore(draggedEl, temp);
        temp.remove();
      }
    });
  });
}

// Toggle completed tasks
document.getElementById("toggle-done").addEventListener("click", function (e) {
  e.preventDefault();
  const toggleLink = e.target;
  const isHiding = toggleLink.textContent.trim().toLowerCase() === "hide done";

  document.querySelectorAll(".drag-n-drop").forEach(task => {
    const checkbox = task.querySelector('input[type="checkbox"]');
    if (checkbox && checkbox.checked) {
      task.style.display = isHiding ? "none" : "flex";
    }
  });

  toggleLink.textContent = isHiding ? "Unhide Done" : "Hide Done";
});

// Background upload
document.getElementById("change-theme").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("bg-upload").click();
});

document.getElementById("bg-upload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  const listPage = document.querySelector('.list-page');

  reader.onload = function(e) {
    const imgData = e.target.result;
    listPage.style.backgroundImage = `url('${imgData}')`;
    listPage.style.backgroundRepeat = 'no-repeat';
    listPage.style.backgroundSize = 'cover';
    listPage.style.backgroundPosition = 'center center';
    localStorage.setItem("backgroundImage", imgData);
  };

  reader.readAsDataURL(file);
});

// Restore saved background on page load
document.addEventListener("DOMContentLoaded", () => {
  const imgData = localStorage.getItem("backgroundImage");
  if (imgData) {
    const listPage = document.querySelector('.list-page');
    listPage.style.backgroundImage = `url('${imgData}')`;
    listPage.style.backgroundRepeat = 'no-repeat';
    listPage.style.backgroundSize = 'cover';
    listPage.style.backgroundPosition = 'center center';
  }
});
