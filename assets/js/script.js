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
  const popoverTriggerList
  = document.querySelectorAll("[data-bs-toggle='popover']");
  Array.prototype.forEach.call(popoverTriggerList, function (el) {
    new bootstrap.Popover(el);
  });

  // List name editing
  const listNameInput = document.getElementById("list-name");
  const editBtn = document.getElementById("list-name-edit-btn");
  const icon = editBtn.querySelector("i");

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
      icon.classList.replace("fa-pencil", "fa-floppy-disk");
    } else {
      listNameInput.setAttribute("readonly", true);
      icon.classList.replace("fa-floppy-disk", "fa-pencil");
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

  // Rebuild tasks
  let taskCounter = parseInt(localStorage.getItem("taskCount")) || 3;
  const taskContainer = document.getElementById("task-box");
  const original = document.getElementById("task-1");

  for (let i = 1; i <= taskCounter; i++) {
    var taskEl;
    if (i <= 3) {
      taskEl = document.getElementById("task-" + i);
    } else {
      var clone = original.cloneNode(true);
      clone.id = "task-" + i;
      clone.className += " drag-n-drop";
      clone.setAttribute("draggable", "true");

      var nameInput = clone.querySelector(".task-name");
      var checkbox = clone.querySelector("input[type='checkbox']");
      nameInput.value = localStorage.getItem("taskName" + i) || "";
      checkbox.checked = localStorage.getItem("taskDone" + i) === "true";
      taskContainer.appendChild(clone);
      taskEl = clone;
    }

    if (taskEl) setupTaskEvents(taskEl, i);
  }

  dragDrop();

  document.getElementById("add-new").addEventListener("click", () => {
    const clone = original.cloneNode(true);
    clone.id = `task-${taskCounter}`;
    clone.classList.add("drag-n-drop");
    clone.setAttribute("draggable", "true");

    const nameInput = clone.querySelector(".task-name");
    const checkbox = clone.querySelector("input[type='checkbox']");
    const editButton = clone.querySelector(".edit-btn");
    const icon = editButton.querySelector("i");

    nameInput.value = "";
    nameInput.setAttribute("readonly", true);
    checkbox.checked = false;

    icon.className = "fa-solid fa-pencil";

    taskContainer.appendChild(clone);
    setupTaskEvents(clone, taskCounter);
    dragDrop();

    localStorage.setItem("taskCount", taskCounter);
    taskCounter++;
  });
  /**
   * Sets up tasks for events
   */
  function setupTaskEvents(taskEl, index) {
    const nameInput = taskEl.querySelector(".task-name");
    const checkbox = taskEl.querySelector("input[type='checkbox']");
    const editButton = taskEl.querySelector(".edit-btn");
    const icon = editButton.querySelector("i");
    const trashBtn = taskEl.querySelector(".trash-btn");

    const nameKey = `taskName${index}`;
    const doneKey = `taskDone${index}`;

    nameInput.value = localStorage.getItem(nameKey) || "";
    checkbox.checked = localStorage.getItem(doneKey) === "true";

    nameInput.setAttribute("readonly", true);
    icon.className = "fa-solid fa-pencil";

    nameInput.addEventListener("input", () => {
      localStorage.setItem(nameKey, nameInput.value);
    });

    checkbox.addEventListener("change", () => {
      localStorage.setItem(doneKey, checkbox.checked);
    });

    editButton.addEventListener("click", () => {
      if (nameInput.hasAttribute("readonly")) {
        nameInput.removeAttribute("readonly");
        nameInput.focus();
        icon.className = "fa-regular fa-floppy-disk";
      } else {
        nameInput.setAttribute("readonly", true);
        icon.className = "fa-solid fa-pencil";
      }
    });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !nameInput.hasAttribute("readonly")) {
        e.preventDefault();
        nameInput.setAttribute("readonly", true);
        icon.className = "fa-solid fa-pencil";
      }
    });

    trashBtn.addEventListener("click", () => {
      taskEl.remove();
      localStorage.removeItem(nameKey);
      localStorage.removeItem(doneKey);

      const allTasks = Array.from(document.querySelectorAll(".drag-n-drop"));
      allTasks.forEach((task, idx) => {
        const newIndex = idx + 1;
        const oldId = task.id;
        const oldMatch = oldId.match(/task-(\d+)/);
        if (oldMatch) {
          const oldIndex = oldMatch[1];

          task.id = `task-${newIndex}`;

          const taskNameInput = task.querySelector(".task-name");
          const taskCheckbox = task.querySelector("input[type='checkbox']");

          localStorage.setItem(`taskName${newIndex}`, taskNameInput.value);
          localStorage.setItem(`taskDone${newIndex}`, taskCheckbox.checked);

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

  const toggleBtn = document.getElementById("toggle-done");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const icon = toggleBtn.querySelector("i");
      const isHiding = icon.classList.contains("fa-eye-slash");

      document.querySelectorAll(".drag-n-drop").forEach(task => {
        const checkbox = task.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
          task.style.display = isHiding ? "none" : "flex";
        }
      });

      icon.classList.toggle("fa-eye-slash");
      icon.classList.toggle("fa-eye");
      toggleBtn.innerText = isHiding ? "Unhide Done " : "Hide Done ";
      toggleBtn.appendChild(icon);
    });
  }
});
