// This function calls the current time and date
let timeDate = new Date();

document.getElementById("time-date").textContent = timeDate;

// Tests

// Correct Date?
console.log(new Date())

// Drag and Drop functionality
// The following functions allows drag and drop functionality for the user when they click and hold.
// When the user adds a new task, these functions will add a new task into a default drop zone.
// Then a new drop zone will be generated beneath

document.querySelectorAll(".drag-n-drop").forEach((el) => {
    el.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text/plain", ev.target.id);
      ev.dataTransfer.effectAllowed = "move";
    });

    el.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      ev.target.classList.add("drag-over");
    });

    el.addEventListener("dragleave", (ev) => {
      ev.target.classList.remove("drag-over");
    });

    el.addEventListener("drop", (ev) => {
      ev.preventDefault();
      ev.target.classList.remove("drag-over");

      const draggedId = ev.dataTransfer.getData("text/plain");
      const draggedEl = document.getElementById(draggedId);
      const dropTarget = ev.target;

      if (dropTarget !== draggedEl) {
        // Swap elements visually
        const temp = document.createElement("div");
        dropTarget.parentNode.insertBefore(temp, dropTarget);
        draggedEl.parentNode.insertBefore(dropTarget, draggedEl);
        temp.parentNode.insertBefore(draggedEl, temp);
        temp.remove();
      }
    });
  });
  
  
  
  
    

// Adds a new tzask box to the drop zone on the list
// function(addTask){}

// Copies the task box html and adds it to the drop zone on the list
// function(copyTask){}

// Replaces the previous dropzone once the task box is created
// function(replaceDropzone){}

// Creates a dropzone each time a task box is created
// function(loopDropzone){}

// Changes the theme
// function(changeTheme){}
