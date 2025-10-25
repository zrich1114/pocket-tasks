import type { Task } from "../../shared/task.schema";

export function renderTasks(container: HTMLElement, tasks: Task[]) {
  container.innerHTML = tasks
    .map(
      (t) => `
    <li data-id="${t.id}" class="task ${t.completed ? "done" : ""}">
      <input type="checkbox" class="toggle" ${t.completed ? "checked" : ""} />
      <span class="title" contenteditable="true">${escapeHtml(t.title)}</span>
      <button class="delete">✕</button>
    </li>
  `
    )
    .join("");
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!
  );
}
