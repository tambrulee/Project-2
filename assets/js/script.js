// This function calls the current time and date
let timeDate = new Date();
document.getElementById("time-date").textContent = timeDate;

// Tests
console.log(new Date())

// Changes the page title to the list name as input by user
const listNameInput = document.getElementById('list-name');
listNameInput.addEventListener('input', () => {
  document.title = listNameInput.value || 'Document'; // fallback if empty
});

// Saves page to cache
document.addEventListener('DOMContentLoaded', () => {
  // ——— LIST NAME PERSISTENCE ———
  const savedListName = localStorage.getItem('listName');
  if (savedListName) {
    listNameInput.value = savedListName;
    document.title = savedListName;
  }

  listNameInput.addEventListener('input', () => {
    const val = listNameInput.value;
    localStorage.setItem('listName', val);
    document.title = val || 'Document';
  });

  // Load saved task count or start at 3
  const savedCount = parseInt(localStorage.getItem("taskCount")) || 3;
  taskCounter = savedCount + 1;

  // Rebuild saved tasks beyond the first 3
  const taskContainer = document.getElementById("task-box");
  const original = document.getElementById("task-1");

  for (let i = 1; i <= savedCount; i++) {
    // For the first 3 tasks, they exist in the DOM already, so just setup events
    if (i <= 3) {
      const taskEl = document.getElementById(`task-${i}`);
      if (taskEl) setupTaskEvents(taskEl, i);
    } else {
      // For tasks beyond 3, clone and append
      const clone = original.cloneNode(true);
      clone.id = `task-${i}`;
      clone.setAttribute("draggable", "true");
      clone.classList.add("drag-n-drop");

      // Set saved values
      const nameInput = clone.querySelector('.task-name');
      const checkbox = clone.querySelector('input[type="checkbox"]');
      const nameKey = `taskName${i}`;
      const doneKey = `taskDone${i}`;

      nameInput.value = localStorage.getItem(nameKey) || '';
      checkbox.checked = localStorage.getItem(doneKey) === 'true';

      taskContainer.appendChild(clone);

      setupTaskEvents(clone, i);
    }
  }

  // Set up drag/drop for all
  dragDrop();

  // Add event to "Add" button
  const addBtn = document.getElementById("add-new");
  if (addBtn) {
    addBtn.addEventListener("click", copyTask);
  }
});


// Drag and Drop functionality
function dragDrop() {
  document.querySelectorAll(".drag-n-drop").forEach((el) => {
    el.setAttribute("draggable", "true"); // Ensure draggable attribute set
    el.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.effectAllowed = "move";
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
      const dropTarget = ev.target;

      if (dropTarget !== draggedEl && dropTarget.classList.contains("drag-n-drop")) {
        const temp = document.createElement("div");
        dropTarget.parentNode.insertBefore(temp, dropTarget);
        draggedEl.parentNode.insertBefore(dropTarget, draggedEl);
        temp.parentNode.insertBefore(draggedEl, temp);
        temp.remove();
      }
    });
  });
}


// Function to copy a task and add it to the container
let taskCounter = 4; // Start from 4 if 1-3 already exist

function copyTask() {
  const taskContainer = document.getElementById("task-box");
  const original = document.getElementById("task-1");

  const clone = original.cloneNode(true);
  clone.id = `task-${taskCounter}`;
  clone.classList.add("drag-n-drop");
  clone.setAttribute("draggable", "true");

  // Reset state for cloned task
  const nameInput = clone.querySelector('.task-name');
  const checkbox = clone.querySelector('input[type="checkbox"]');
  const editButton = clone.querySelector('.edit-btn');
  const icon = editButton.querySelector('i');

  nameInput.value = '';
  nameInput.setAttribute('readonly', true);
  checkbox.checked = false;

  icon.classList.remove('fa-floppy-disk', 'fa-regular');
  icon.classList.add('fa-pencil', 'fa-solid');

  taskContainer.appendChild(clone);

  setupTaskEvents(clone, taskCounter);

  dragDrop(); // Reapply drag/drop handlers to include new task

  localStorage.setItem("taskCount", taskCounter);
  taskCounter++;

  // Save on Enter key press while editing
nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !nameInput.hasAttribute('readonly')) {
    e.preventDefault();
    nameInput.setAttribute('readonly', true);
    icon.classList.remove('fa-floppy-disk', 'fa-regular');
    icon.classList.add('fa-pencil', 'fa-solid');
  }
});

}


// Sets up edit/save toggle, localStorage saving, and readonly on a task container
function setupTaskEvents(taskEl, index) {
  const nameInput = taskEl.querySelector('.task-name');
  const checkbox = taskEl.querySelector('input[type="checkbox"]');
  const editButton = taskEl.querySelector('.edit-btn');
  const icon = editButton.querySelector('i');

  const nameKey = `taskName${index}`;
  const doneKey = `taskDone${index}`;

  // Load saved data (just in case)
  const savedName = localStorage.getItem(nameKey);
  if (savedName !== null) nameInput.value = savedName;

  const savedDone = localStorage.getItem(doneKey);
  checkbox.checked = savedDone === 'true';

  // Ensure readonly and icon are set initially
  nameInput.setAttribute('readonly', true);
  icon.classList.remove('fa-floppy-disk', 'fa-regular');
  icon.classList.add('fa-pencil', 'fa-solid');

  // Save on input
  nameInput.addEventListener('input', () => {
    localStorage.setItem(nameKey, nameInput.value);
  });

  // Save checkbox changes
  checkbox.addEventListener('change', () => {
    localStorage.setItem(doneKey, checkbox.checked);
  });

  // Edit/save toggle
  editButton.addEventListener('click', () => {
    if (nameInput.hasAttribute('readonly')) {
      nameInput.removeAttribute('readonly');
      nameInput.focus();
      icon.classList.remove('fa-pencil', 'fa-solid');
      icon.classList.add('fa-floppy-disk', 'fa-regular');
    } else {
      nameInput.setAttribute('readonly', true);
      icon.classList.remove('fa-floppy-disk', 'fa-regular');
      icon.classList.add('fa-pencil', 'fa-solid');
    }
  });
// Adds function to all user to click enter as a shortcut and save input
  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !nameInput.hasAttribute('readonly')) {
      e.preventDefault(); // prevent form submission or default behavior
      nameInput.setAttribute('readonly', true);
      icon.classList.remove('fa-floppy-disk', 'fa-regular');
      icon.classList.add('fa-pencil', 'fa-solid');
    }
  });
}

// Hide/show done tasks toggle
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

// Theme background image upload
document.getElementById("change-theme").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("bg-upload").click();
});

document.getElementById("bg-upload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.body.style.backgroundImage = `url('${e.target.result}')`;
  };
  reader.readAsDataURL(file);
});
