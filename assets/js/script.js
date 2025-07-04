/**
 * Sets time and date to match time on PC
 * 
 *  */ 
function updateTimeDate() {
  const now = new Date();
  document.getElementById("time-date").textContent = now.toLocaleString();
}

// Call once immediately
updateTimeDate();

// Then update every second
setInterval(updateTimeDate, 1000);


// Pop up to generate when it's first time on website
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('firstTimePopup');
  const closeBtn = document.getElementById('closePopup');

  // Check if user is visiting for the first time
  if (!localStorage.getItem('visitedBefore')) {
    popup.style.display = 'flex';
    localStorage.setItem('visitedBefore', 'true');
  }

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});

// Enables popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

/* 
The next set of functions and event listeners allow the user to edit the list name, 
which changes the HTML document name and appears tab window for easy navigation. 
It then saves the result to the local storage.
*/


// Set page title from saved list name
document.addEventListener('DOMContentLoaded', () => {
  const listNameInput = document.getElementById('list-name');
  const editBtn = document.getElementById('list-name-edit-btn');
  const icon = editBtn.querySelector('i');

  // Load saved name from localStorage
  const savedListName = localStorage.getItem('listName');
  if (savedListName) {
    listNameInput.value = savedListName;
    document.title = savedListName;
  }

  // Update document title live while typing
  listNameInput.addEventListener('input', () => {
    document.title = listNameInput.value || 'Document';
  });

/* 
These functions make the task boxes default to input. Then toggle between save and input
allowing the user to edit and save text to prevent items being overwritten.

It also add a shortcut which allows the user to hit 'Enter' and save the text in the input box
automatically.
*/
  // Start with input readonly
  listNameInput.setAttribute('readonly', true);

  // Toggle edit/save on button click
  editBtn.addEventListener('click', () => {
    if (listNameInput.hasAttribute('readonly')) {
      // Switch to edit mode
      listNameInput.removeAttribute('readonly');
      listNameInput.focus();
      icon.classList.replace('fa-pencil', 'fa-floppy-disk');
    } else {
      // Save mode
      listNameInput.setAttribute('readonly', true);
      icon.classList.replace('fa-floppy-disk', 'fa-pencil');

      const name = listNameInput.value.trim();
      localStorage.setItem('listName', name);
      document.title = name || 'Document';
    }
  });

  // Save on Enter key while editing
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

// Draggable elements
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

/**
 * This function calls event listeners for inputting, saving and editing task boxes.
 * 
 * */
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

  // Changes the save and edit buttons over on click and toggles between readonly and input
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

/**
 * Creates a seamless drag and drop feature for all task containers. Allows the user to order their tasks for a personalised feel.
 * 
 *  */ 
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


/**
 * Toggles visibility of completed tasks when 'Hide Done' or 'Unhide Done' is clicked.
 */
function toggleCompletedTasks(e) {
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
}

document.getElementById("toggle-done").addEventListener("click", toggleCompletedTasks);


/**
 * Opens the file selector to upload a new background image.
 */
function triggerBackgroundUpload(e) {
  e.preventDefault();
  document.getElementById("bg-upload").click();
}

document.getElementById("theme-btn").addEventListener("click", triggerBackgroundUpload);

// Grabs file if selected by user and terminates if none selected
document.getElementById("bg-upload").addEventListener("change",
 function () {
  const file = this.files[0];
  if (!file) return;

  // Validate file size (between 10KB and 5MB)
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB < 10 || fileSizeKB > 5 * 1024) {
    alert("Please select an image between 10KB and 5MB in size.");
    return;
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG, PNG, GIF, WEBP, or SVG images are supported.");
    return;
  }

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

