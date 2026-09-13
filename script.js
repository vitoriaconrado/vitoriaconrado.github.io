const pages = [...document.querySelectorAll(".page")];
const tabLinks = [...document.querySelectorAll("[data-tab-link]")];
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".tab-nav");
const dialog = document.querySelector(".project-dialog");
const statusTitle = document.querySelector("#current-status-title");
const statusDescription = document.querySelector("#current-status-description");
const statusControls = [...document.querySelectorAll(".status-control")];
const currentUpdates = [
  ["Updating this site", "That's right, this one!"],
  ["Solving some poster stuff for the II Cell Ag Congress", "Figuring out how illustrations for such legislation-heavy work & actual good practices for poster-making."],
  ["Updating my Notion archive", "Organizing notes, code, and boilerplates."],
];

let currentStatusIndex = 0;
let statusTimer;

function showStatus(index) {
  currentStatusIndex = index;
  statusTitle.classList.add("status-changing");
  statusDescription.classList.add("status-changing");
  window.setTimeout(() => {
    statusTitle.textContent = currentUpdates[index][0];
    statusDescription.textContent = currentUpdates[index][1];
    statusTitle.classList.remove("status-changing");
    statusDescription.classList.remove("status-changing");
  }, 180);
  statusControls.forEach((control) => control.classList.toggle("active", Number(control.dataset.statusIndex) === index));
}

function startStatusRotation() {
  window.clearInterval(statusTimer);
  statusTimer = window.setInterval(() => showStatus((currentStatusIndex + 1) % currentUpdates.length), 6000);
}

function showPage(name) {
  const pageName = pages.some((page) => page.dataset.page === name) ? name : "home";
  pages.forEach((page) => {
    const isActive = page.dataset.page === pageName;
    page.hidden = !isActive;
    page.classList.toggle("active", isActive);
  });
  tabLinks.forEach((link) => link.classList.toggle("active", link.dataset.tabLink === pageName));
  document.title = `${pageName === "home" ? "Vitória Teresa" : `${pageName[0].toUpperCase()}${pageName.slice(1)} — Vitória Teresa`}`;
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function route() {
  showPage(window.location.hash.slice(1) || "home");
}

window.addEventListener("hashchange", route);
tabLinks.forEach((link) => link.addEventListener("click", () => {
  if (window.location.hash === link.hash) route();
}));
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

statusControls.forEach((control) => {
  control.addEventListener("click", () => {
    showStatus(Number(control.dataset.statusIndex));
    startStatusRotation();
  });
});
startStatusRotation();

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    filter.classList.add("active");
    document.querySelectorAll(".project-card").forEach((card) => {
      const categories = card.dataset.category.split(/\s+/);
      card.hidden = filter.dataset.filter !== "all" && !categories.includes(filter.dataset.filter);
    });
  });
});

const projectDetails = {
  map: ["Research · 2024", "Brazil’s bio-startup map", "An evolving visual index of companies working with biology, health, and the environment across Brazil.", "projects/startups_map.html", "Open interactive map ↗"],
  "field-guide": ["Web experiment · 2024", "A field guide to noticing", "A quiet digital notebook for collecting observations, textures, and questions from everyday walks.", "#", "Project notes coming soon ↗"],
  repository: ["Data repository · 2026", "Reproducible materials for the study of cultivated meat regulation (Brazil)", "Open repository containing reproducible materials for the systematic mapping of scientific literature and official documents regarding the regulation of cultivated meat in Brazil. Includes screening records, R analysis, and PRISMA methodology documentation.", "https://github.com/vitoriaconrado/cultivated-meat-brazil-review", "Open GitHub repository ↗"],
  cells: ["Writings · ongoing", "Notes on biology and risk", "Short essays and working notes on public health, biosecurity, technology, and AI.", "#", "Writing archive coming soon ↗"],
};

document.querySelectorAll(".project-open").forEach((button) => {
  button.addEventListener("click", () => {
    const [kicker, title, copy, href, label] = projectDetails[button.dataset.project];
    document.querySelector("#dialog-kicker").textContent = kicker;
    document.querySelector("#dialog-title").textContent = title;
    document.querySelector("#dialog-copy").textContent = copy;
    const link = document.querySelector("#dialog-link");
    link.href = href;
    link.textContent = label;
    if (typeof dialog.showModal === "function") dialog.showModal();
  });
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

route();
