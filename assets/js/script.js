// This function calls the current time and date
let timeDate = new Date();

document.getElementById("time-date").textContent = timeDate;

// Tests

// Correct Date?
console.log(new Date())

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
  clone.id = `task-${taskCounter++}`;
  clone.querySelector('input[type="checkbox"]').checked = false;
clone.querySelector('input[type="text"]').value = '';
clone.querySelector('input[type="text"]').placeholder = "Enter task here";
  clone.setAttribute("draggable", "true");
  clone.classList.add("drag-n-drop");

  taskContainer.appendChild(clone);

  // Reattach drag/drop to all items
  dragDrop();
}

// 3. Set up on page load
document.addEventListener("DOMContentLoaded", () => {
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



// Replaces the previous dropzone once the task box is created
// function(replaceDropzone){}

// Creates a dropzone each time a task box is created
// function(loopDropzone){}

// Changes the theme
// function(changeTheme){}

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

