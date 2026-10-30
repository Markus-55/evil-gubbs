// Seeded so the stars land in the same spots on every load
function seededRandom(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function renderStars() {
  const random = seededRandom(42);
  const container = document.getElementById("stars");

  for (let i = 0; i < 45; i++) {
    const star = document.createElement("span");
    star.className = "hw-star";
    star.style.top = `${random() * 70}%`;
    star.style.left = `${random() * 100}%`;
    star.style.width = star.style.height = `${1 + random() * 2}px`;
    star.style.animationDelay = `${random() * 4}s`;
    star.style.animationDuration = `${2 + random() * 3}s`;
    container.append(star);
  }
}

function setupNav() {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");

  const updateSolid = () => {
    nav.classList.toggle("is-solid", window.scrollY > 20 || !menu.hidden);
  };

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Stäng menyn" : "Öppna menyn");
    updateSolid();
  };

  toggle.addEventListener("click", () => setOpen(menu.hidden));
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  window.addEventListener("scroll", updateSolid, { passive: true });
  updateSolid();
}

const SCREENSHOT_MESSAGES = [
  "👻 Hallå där! Spökena gillar inte att bli fotograferade.",
  "🧛 Tänkte du ta en bild? Vampyrer syns inte på foton ändå.",
  "🎃 Screenshot upptäckt! Pumpan har skrivit upp det i sin lilla svarta bok.",
  "😈 Fint försök! Men den här sidan är hemsökt – bilden blir bara spöken.",
  "🦇 Fladdermössen har konfiskerat din skärmdump. Den kommer tillbaka efter Halloween.",
];
const TOAST_DURATION_MS = 4500;

function setupScreenshotToast() {
  const layer = document.getElementById("toast-layer");
  let timer;

  window.addEventListener("keyup", (event) => {
    if (event.key !== "PrintScreen") return;

    const toast = document.createElement("div");
    const title = document.createElement("p");
    const message = document.createElement("p");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    title.className = "toast-title hw-title";
    title.textContent = "Ingen screenshot!";
    message.className = "toast-message";
    message.textContent = SCREENSHOT_MESSAGES[Math.floor(Math.random() * SCREENSHOT_MESSAGES.length)];
    toast.append(title, message);
    layer.replaceChildren(toast);

    clearTimeout(timer);
    timer = setTimeout(() => layer.replaceChildren(), TOAST_DURATION_MS);
  });
}

renderStars();
setupNav();
setupScreenshotToast();
