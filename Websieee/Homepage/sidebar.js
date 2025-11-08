const TaskButtEl = document.getElementById("TaskButt");
const sidepnnl = document.getElementById("sidepnnl");
const closeSidebarEl = document.getElementById("close-sidebar");

TaskButtEl.addEventListener("click", () => {
  sidepnnl.style.transform = "translateX(0)";
});

closeSidebarEl.addEventListener("click", () => {
  sidepnnl.style.transform = "translateX(-500px)";
});