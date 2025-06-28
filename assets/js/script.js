// This function calls the current time and date
let timeDate = new Date();

document.getElementById("time-date").textContent = timeDate;

// Tests

// Correct Date?
console.log(new Date())

// Changes the page title to the list name as input by user
const listNameInput = document.getElementById('list-name');

    listNameInput.addEventListener('input', () => {
      document.title = listNameInput.value || 'Document'; // fallback if empty
    });

// Saves page to cache

document.addEventListener('DOMContentLoaded', () => {
  // ——— LIST NAME PERSISTENCE ———
  const listNameInput = document.getElementById('list-name');
  const savedListName = localStorage.getItem('listName');
  if (savedListName) {
    listNameInput.value = savedListName;
    document.title     = savedListName;
  }

  listNameInput.addEventListener('input', () => {
    const val = listNameInput.value;
    localStorage.setItem('listName', val);
    document.title = val || 'Document';
  });

  // ——— TASKS PERSISTENCE ———
  const tasks = document.querySelectorAll('.task-container');
  tasks.forEach((taskEl, idx) => {
    const nameInput = taskEl.querySelector('.task-name');
    const checkbox  = taskEl.querySelector('input[type="checkbox"]');
    const nameKey   = `taskName${idx}`;
    const doneKey   = `taskDone${idx}`;

    // load
    const savedName = localStorage.getItem(nameKey);
    if (savedName) nameInput.value = savedName;
    const savedDone = localStorage.getItem(doneKey);
    if (savedDone === 'true') checkbox.checked = true;

    // save on change
    nameInput.addEventListener('input', () => {
      localStorage.setItem(nameKey, nameInput.value);
    });
    checkbox.addEventListener('change', () => {
      localStorage.setItem(doneKey, checkbox.checked);
    });
  });

});


// Drag and Drop functionality
// The following functions allows drag and drop functionality for the user when they click and hold.
// When the user adds a new task, these functions will add a new task into a default drop zone.

// Calls the drag and drop API to start
// For every div with a classification of drag-n-drop the function will apply a data transfer
//

// 1. Drag and drop logic
function dragDrop() {
  document.querySelectorAll(".drag-n-drop").forEach((el) => {
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

// 2. Function to copy a task and add it to the container
let taskCounter = 4; // Start from 4 if 1-3 already exist

function copyTask() {
  const taskContainer = document.getElementById("task-box");
  const original = document.getElementById("task-1");

  const clone = original.cloneNode(true);
  clone.id = `task-${taskCounter}`;
  clone.setAttribute("draggable", "true");
  clone.classList.add("drag-n-drop");

  const nameInput = clone.querySelector('.task-name');
  const checkbox = clone.querySelector('input[type="checkbox"]');
  const editButton = clone.querySelector('.edit-btn');
  const icon = editButton.querySelector('i');

  const nameKey = `taskName${taskCounter}`;
  const doneKey = `taskDone${taskCounter}`;

  // Reset state
  nameInput.value = '';
  nameInput.setAttribute('readonly', true);
  checkbox.checked = false;
  icon.classList.remove('fa-floppy-disk', 'fa-regular');
  icon.classList.add('fa-pencil', 'fa-solid');

  // Save to localStorage
  nameInput.addEventListener('input', () => {
    localStorage.setItem(nameKey, nameInput.value);
  });

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

  taskContainer.appendChild(clone);
  dragDrop();

  localStorage.setItem("taskCount", taskCounter);
  taskCounter++;
}

// 3. Set up on page load
document.addEventListener('DOMContentLoaded', () => {
  const taskContainer = document.getElementById("task-box");

  // Load saved task count
  const savedCount = parseInt(localStorage.getItem("taskCount")) || 3;
  taskCounter = savedCount + 1;

  // Rebuild saved tasks beyond the first 3
  for (let i = 4; i <= savedCount; i++) {
    const original = document.getElementById("task-1");
    const clone = original.cloneNode(true);
    clone.id = `task-${i}`;
    clone.setAttribute("draggable", "true");
    clone.classList.add("drag-n-drop");

    const nameInput = clone.querySelector('input[type="text"]');
    const checkbox = clone.querySelector('input[type="checkbox"]');

    const nameKey = `taskName${i}`;
    const doneKey = `taskDone${i}`;

    nameInput.value = localStorage.getItem(nameKey) || '';
    checkbox.checked = localStorage.getItem(doneKey) === 'true';

    // Set up save listeners
    nameInput.addEventListener('input', () => {
      localStorage.setItem(nameKey, nameInput.value);
    });

    checkbox.addEventListener('change', () => {
      localStorage.setItem(doneKey, checkbox.checked);
    });

    taskContainer.appendChild(clone);
  }

  dragDrop();

  const addBtn = document.getElementById("add-new");
  if (addBtn) {
    addBtn.addEventListener("click", copyTask);
  }
});



// This will hide/show checked items

document.getElementById("toggle-done").addEventListener("click", function (e) {
  e.preventDefault(); // Prevent the link from navigating

  const toggleLink = e.target;
  const isHiding = toggleLink.textContent.trim().toLowerCase() === "hide done";

  document.querySelectorAll(".drag-n-drop").forEach(task => {
      const checkbox = task.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
          task.style.display = isHiding ? "none" : "flex"; // or "block", depending on your layout
      }
  });

  toggleLink.textContent = isHiding ? "Unhide Done" : "Hide Done";
});


document.querySelectorAll('.edit-btn').forEach((button) => {
  button.addEventListener('click', function () {
    const input = this.previousElementSibling;
    const icon = this.querySelector('i');

    if (input.hasAttribute('readonly')) {
      // Switch to edit mode
      input.removeAttribute('readonly');
      input.focus();

      // Change icon to save
      icon.classList.remove('fa-pencil', 'fa-solid');
      icon.classList.add('fa-floppy-disk', 'fa-regular');
    } else {
      // Switch to readonly mode
      input.setAttribute('readonly', true);

      // Change icon back to edit
      icon.classList.remove('fa-floppy-disk', 'fa-regular');
      icon.classList.add('fa-pencil', 'fa-solid');
    }
  });
});



// When user clicks the link, trigger the hidden file input
document.getElementById("change-theme").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("bg-upload").click();
});

// When user selects a file, set it as the body's background
document.getElementById("bg-upload").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
      document.body.style.backgroundImage = `url('${e.target.result}')`;
  };
  reader.readAsDataURL(file); // Converts image file to base64
});

