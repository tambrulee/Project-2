document.addEventListener("DOMContentLoaded", function () {
    let hideDoneTasks = localStorage.getItem("hideDoneTasks") === "true";
    const toggleBtn = document.getElementById("toggle-done");
  
    function applyToggleState() {
      const icon = toggleBtn.querySelector("i");
      const tasks = document.querySelectorAll("#task-box .drag-n-drop");
  
      if (icon) {
        icon.classList.toggle("fa-eye-slash", hideDoneTasks);
        icon.classList.toggle("fa-eye", !hideDoneTasks);
      }
  
      tasks.forEach(task => {
        const checkbox = task.querySelector("input[type='checkbox']");
        if (checkbox.checked && hideDoneTasks) {
          task.classList.add("hidden-task");
        } else {
          task.classList.remove("hidden-task");
        }
      });
    }
  
    function restoreCheckboxStates() {
      const tasks = document.querySelectorAll("#task-box .drag-n-drop");
      tasks.forEach(task => {
        const checkbox = task.querySelector("input[type='checkbox']");
        const savedState = localStorage.getItem(`taskDone-${task.id}`);
        checkbox.checked = savedState === "true";
      });
    }
  
    toggleBtn.addEventListener("click", function () {
      hideDoneTasks = !hideDoneTasks;
      localStorage.setItem("hideDoneTasks", hideDoneTasks.toString());
      applyToggleState();
    });
  
    // ✅ Save each checkbox state when changed
    document.getElementById("task-box").addEventListener("change", function (e) {
      if (e.target.matches("input[type='checkbox']")) {
        const checkbox = e.target;
        const taskEl = checkbox.closest(".drag-n-drop");
        if (taskEl && taskEl.id) {
          localStorage.setItem(`taskDone-${taskEl.id}`, checkbox.checked);
        }
        applyToggleState();
      }
    });
  
    restoreCheckboxStates();
    applyToggleState();
  });
  