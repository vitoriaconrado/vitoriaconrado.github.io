const pages = [...document.querySelectorAll(".page")];
const tabLinks = [...document.querySelectorAll("[data-tab-link]")];
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".tab-nav");
const dialog = document.querySelector(".project-dialog");

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

document.querySelectorAll(".filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    document.querySelector(".filter.active").classList.remove("active");
    filter.classList.add("active");
    document.querySelectorAll(".project-card").forEach((card) => {
      card.hidden = filter.dataset.filter !== "all" && card.dataset.category !== filter.dataset.filter;
    });
  });
});

const projectDetails = {
  map: ["Research · 2024", "Brazil’s bio-startup map", "An evolving visual index of companies working with biology, health, and the environment across Brazil.", "projects/startups_map.html", "Open interactive map ↗"],
  "field-guide": ["Web experiment · 2024", "A field guide to noticing", "A quiet digital notebook for collecting observations, textures, and questions from everyday walks.", "#", "Project notes coming soon ↗"],
  cells: ["Study · ongoing", "Cells, cities, and networks", "Notes on the patterns shared by biological systems and the infrastructures we build around them.", "#", "Project notes coming soon ↗"],
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
