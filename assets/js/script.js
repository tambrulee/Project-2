/*jslint browser: true */
/*global bootstrap */

// Task container variables
var taskCounter = parseInt(localStorage.getItem("taskCount"), 10) || 3;
var taskContainer = document.getElementById("task-box");
var original = document.getElementById("task-1");
var i = 1;
var toggleBtn;
var hideDoneTasks;
var tasks;
var task;
var checkbox;

/**
   * Sets up tasks for events
   */
function setupTaskEvents(taskEl, index) {
    const nameInput = taskEl.querySelector(".task-name");
    const editButton = taskEl.querySelector(".edit-btn");
    var icon = editButton.querySelector("i");
    const trashBtn = taskEl.querySelector(".trash-btn");
    checkbox = taskEl.querySelector("input[type='checkbox']");
    const nameKey = `taskName${index}`;
    const doneKey = `taskDone${index}`;

    nameInput.value = localStorage.getItem(nameKey) || "";
    checkbox.checked = localStorage.getItem(doneKey) === "true";

    nameInput.setAttribute("readonly", true);
    icon.className = "fa-solid fa-pencil";

    nameInput.addEventListener("input", function () {
        localStorage.setItem(nameKey, nameInput.value);
    });

    checkbox.addEventListener("change", function () {
        localStorage.setItem(doneKey, checkbox.checked);
    });

    editButton.addEventListener("click", function () {
        if (nameInput.hasAttribute("readonly")) {
            nameInput.removeAttribute("readonly");
            nameInput.focus();
            icon.className = "fa-regular fa-floppy-disk";
        } else {
            nameInput.setAttribute("readonly", true);
            icon.className = "fa-solid fa-pencil";
        }
    });

    nameInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !nameInput.hasAttribute("readonly")) {
            e.preventDefault();
            nameInput.setAttribute("readonly", true);
            icon.className = "fa-solid fa-pencil";
        }
    });

    trashBtn.addEventListener("click", function () {
        taskEl.remove();
        localStorage.removeItem(nameKey);
        localStorage.removeItem(doneKey);

        const allTasks = Array.from(document.querySelectorAll(".drag-n-drop"));
        allTasks.forEach(function (task, idx) {
            const newIndex = idx + 1;
            const oldId = task.id;
            const oldMatch = oldId.match(/task-(\d+)/);
            if (oldMatch) {
                const oldIndex = oldMatch[1];
                task.id = `task-${newIndex}`;
                const taskNameInput = task.querySelector(".task-name");
                var taskCheckbox = task.querySelector(
                    "input[type='checkbox']"
                );
                localStorage.setItem(
                    `taskName${newIndex}`,
                    taskNameInput.value
                );
                localStorage.setItem(
                    `taskDone${newIndex}`,
                    taskCheckbox.checked
                );
                if (oldIndex !== newIndex.toString()) {
                    localStorage.removeItem(`taskName${oldIndex}`);
                    localStorage.removeItem(`taskDone${oldIndex}`);
                }
            }
        });

        taskCounter = allTasks.length + 1;
        localStorage.setItem("taskCount", allTasks.length);
    });
}

/**
 * Starts drag and drop
 */
function dragDrop() {
    document.querySelectorAll(".drag-n-drop").forEach(function (el) {
        el.setAttribute("draggable", "true");

        el.addEventListener("dragstart", function (ev) {
            ev.dataTransfer.setData("text/plain", ev.target.id);
        });

        el.addEventListener("dragover", function (ev) {
            ev.preventDefault();
            el.classList.add("drag-over");
        });

        el.addEventListener("dragleave", function () {
            el.classList.remove("drag-over");
        });

        el.addEventListener("drop", function (ev) {
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

          // Save the new order to localStorage
          const allTasks = Array.from(
            document.querySelectorAll(".drag-n-drop")
        );
        allTasks.forEach(function (task, index) {
          const nameInput = task.querySelector(".task-name");
          checkbox = task.querySelector("input[type='checkbox']");
          localStorage.setItem("taskName" + (index + 1), nameInput.value);
          localStorage.setItem("taskDone" + (index + 1), checkbox.checked);
          task.id = "task-" + (index + 1);
      });

          localStorage.setItem("taskCount", allTasks.length);
          taskCounter = allTasks.length + 1;
      });
    });
}

// Rebuild tasks

function processTask(currentI) {
    var taskEl;
    var clone;
    var nameInput;

    if (currentI <= 3) {
        taskEl = document.getElementById("task-" + currentI);
    } else {
        clone = original.cloneNode(true);
        clone.id = "task-" + currentI;
        clone.classList.add("drag-n-drop");
        clone.setAttribute("draggable", "true");

        nameInput = clone.querySelector(".task-name");
        checkbox = clone.querySelector("input[type='checkbox']");
        nameInput.value = localStorage.getItem("taskName" + currentI) || "";
        checkbox.checked = (
            localStorage.getItem("taskDone" + currentI) === "true"
        );
        taskContainer.appendChild(clone);
        taskEl = clone;
    }

    if (taskEl) {
        setupTaskEvents(taskEl, currentI);
    }
}

function rebuildTasks() {
    while (i <= taskCounter) {
        processTask(i);
        i += 1;
    }
    dragDrop();
}

rebuildTasks();

/**
 * Sets time and date to match time on PC
 */
function updateTimeDate() {
    const now = new Date();
    document.getElementById("time-date").textContent = now.toLocaleString();
}
updateTimeDate();
setInterval(updateTimeDate, 1000);

// First time popup
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("firstTimePopup");
    const closeBtn = document.getElementById("closePopup");

    if (!localStorage.getItem("visitedBefore")) {
        popup.style.display = "flex";
        localStorage.setItem("visitedBefore", "true");
    }

    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });

  // Enable Bootstrap popovers
    const popovers = document.querySelectorAll("[data-bs-toggle='popover']");
    Array.prototype.forEach.call(popovers, function (el) {
        new bootstrap.Popover(el);
    });
});

// List name editing
const listNameInput = document.getElementById("list-name");
const editBtn = document.getElementById("list-name-edit-btn");
const iconEditBtn = editBtn.querySelector("i");  // renamed from 'icon'
const savedListName = localStorage.getItem("listName");
if (savedListName) {
    listNameInput.value = savedListName;
    document.title = savedListName;
}
listNameInput.setAttribute("readonly", true);
editBtn.addEventListener("click", function () {
    if (listNameInput.hasAttribute("readonly")) {
        listNameInput.removeAttribute("readonly");
        listNameInput.focus();
        iconEditBtn.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
        listNameInput.setAttribute("readonly", true);
        iconEditBtn.classList.replace("fa-floppy-disk", "fa-pencil");
        const name = listNameInput.value.trim();
        localStorage.setItem("listName", name);
        document.title = name || "Document";
    }
});

listNameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !listNameInput.hasAttribute("readonly")) {
        e.preventDefault();
        editBtn.click();
    }
});

// Add new button
document.getElementById("add-new").addEventListener("click", function () {
    const clone = original.cloneNode(true);
    clone.id = `task-${taskCounter}`;
    clone.classList.add("drag-n-drop");
    clone.setAttribute("draggable", "true");

    const nameInput = clone.querySelector(".task-name");
    const editButton = clone.querySelector(".edit-btn");
    const iconEditButton = editButton.querySelector("i");
    // renamed from 'icon'
    nameInput.value = "";
    nameInput.setAttribute("readonly", true);
    iconEditButton.className = "fa-solid fa-pencil";

    taskContainer.appendChild(clone);
    setupTaskEvents(clone, taskCounter);
    dragDrop();

    taskCounter += 1;
    localStorage.setItem("taskCount", taskCounter);
});

toggleBtn = document.getElementById("toggle-done");
hideDoneTasks = false; // Track toggle state

if (toggleBtn) {
  toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();

      hideDoneTasks = !hideDoneTasks;

      const icon = toggleBtn.querySelector("i");
      if (icon) {
          if (hideDoneTasks) {
              icon.classList.remove("fa-eye-slash");
              icon.classList.add("fa-eye");
          } else {
              icon.classList.remove("fa-eye");
              icon.classList.add("fa-eye-slash");
          }
      }

        tasks = document.querySelectorAll(".drag-n-drop");

       // Then in your loop:
for (i = 0; i < tasks.length; i += 1) {
  task = tasks[i];
  checkbox = task.querySelector("input[type='checkbox']");
  if (checkbox && checkbox.checked) {
      task.style.display = hideDoneTasks ? "none" : "flex";
  } else {
      task.style.display = "flex";
  }
}
      });
    }

// Change theme
// Load saved background from localStorage on page load
// Load saved background from localStorage on page load
window.addEventListener("DOMContentLoaded", function () {
  const savedBg = localStorage.getItem("customBackground");
if (savedBg) {
  document.querySelector(".list-page").style.backgroundImage = `url('${savedBg}')`;
}


  // Trigger hidden file input when theme button is clicked
  document.getElementById("theme-btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("bg-upload").click();
  });

  // When user selects a file, set and save it as the background
  document.getElementById("bg-upload").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;
      // Apply to body or your custom element
      document.querySelector(".list-page")
  .style.backgroundImage = `url('${imageData}')`;
      localStorage.setItem("customBackground", imageData);
    };
    reader.readAsDataURL(file);
  });
});






