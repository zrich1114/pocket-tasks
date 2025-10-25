import "./style.css";
import { listTasks, createTask, updateTask, deleteTask } from "./api";
import { renderTasks } from "./ui";

const form = document.querySelector<HTMLFormElement>("#new-task-form")!;
const input = document.querySelector<HTMLFormElement>("#title")!;
const list = document.querySelector<HTMLFormElement>("#task-list")!;
const filter = document.querySelector<HTMLFormElement>("#filter")!;

let tasks = await listTasks();

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!input.value.trim()) return;
  const t = await createTask({ title: input.value.trim() });
  tasks = [t, ...tasks];
  input.value = "";
  apply();
});

list.addEventListener("click", async (e) => {
  const li = (e.target as HTMLElement).closest("li.task") as HTMLElement | null;
  if (!li) return;
  const id = li.dataset.id!;
  if ((e.target as HTMLElement).classList.contains("delete")) {
    await deleteTask(id as string);
    tasks = tasks.filter((t) => t.id !== id);
    apply();
  }
});

list.addEventListener("change", async (e) => {
  const li = (e.target as HTMLElement).closest("li.task") as HTMLElement | null;
  if (!li) return;
  const id = li.dataset.id!;
  if ((e.target as HTMLInputElement).classList.contains("toggle")) {
    const checked = (e.target as HTMLInputElement).checked;
    const updated = await updateTask(id, { completed: checked });
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    apply();
  }
});

list.addEventListener(
  "blur",
  async (e) => {
    const el = e.target as HTMLElement;
    if (!el.classList.contains("title")) return;
    const li = el.closest("li.task") as HTMLLIElement;
    const id = li.dataset.id!;
    const title = el.textContent?.trim() ?? "";
    if (!title) return;
    const updated = await updateTask(id, { title });
    tasks = tasks.map((t) => (t.id === id ? updated : t));
    apply();
  },
  true
);

filter.addEventListener("change", apply);

function apply() {
  const f = filter.value as "all" | "active" | "completed";
  const view = tasks.filter((t) =>
    f === "all" ? true : f === "active" ? !t.completed : t.completed
  );
  renderTasks(list, view);
}
