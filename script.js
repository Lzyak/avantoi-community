// Avantoi Community: small enhancements. The page works fully without this file.

document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

const desktop = window.matchMedia("(min-width: 900px)");
const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
const canWatch = "IntersectionObserver" in window;

// Channel preview: under the button on phones, in the black panel on computers
const preview = document.getElementById("preview");
const desktopSlot = document.getElementById("preview-slot-desktop");
if (preview && desktopSlot) {
  const home = preview.parentNode;
  const after = preview.nextElementSibling;
  const place = () => {
    if (desktop.matches) desktopSlot.appendChild(preview);
    else home.insertBefore(preview, after);
  };
  place();
  desktop.addEventListener("change", place);

  // Messages arrive one by one when the preview comes into view
  if (canWatch && !calm.matches) {
    preview.classList.add("is-waiting");
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        preview.classList.add("is-in");
        seen.disconnect();
      }
    }, { threshold: 0.35 });
    seen.observe(preview);
  }
}

// Phone join bar: shows once the main button has scrolled out of view
const join = document.getElementById("join");
const dock = document.getElementById("dock");
if (join && dock && canWatch) {
  const dockLink = dock.querySelector("a");
  let pastButton = false;
  const update = () => {
    const on = pastButton && !desktop.matches;
    dock.classList.toggle("is-shown", on);
    dock.setAttribute("aria-hidden", on ? "false" : "true");
    dockLink.tabIndex = on ? 0 : -1;
  };
  new IntersectionObserver(([entry]) => {
    pastButton = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    update();
  }).observe(join);
  desktop.addEventListener("change", update);
}
