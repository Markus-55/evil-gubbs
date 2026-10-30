import { startJumpscare } from "./jumpscare.js";
import "./cursed-controls.js";

// Seeded so the stars land in the same spots on every load
function seededRandom(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function renderStars() {
  const random = seededRandom(42);
  const container = document.getElementById("kapibara_w_urzędzie_skarbowym");

  for (let i = 0; i < 45; i++) {
    const star = document.createElement("span");
    star.className = "ขนมปังที่บินไม่ได้";
    star.style.top = `${random() * 70}%`;
    star.style.left = `${random() * 100}%`;
    star.style.width = star.style.height = `${1 + random() * 2}px`;
    star.style.animationDelay = `${random() * 4}s`;
    star.style.animationDuration = `${2 + random() * 3}s`;
    container.append(star);
  }
}

function setupNav() {
  const nav = document.getElementById("ordenador_con_nostalgia");
  const toggle = document.getElementById("le_radiateur_philosophe");
  const menu = document.getElementById("твердый_суп_из_будущего");

  const updateSolid = () => {
    nav.classList.toggle("kalap_nélküli_rozmár", window.scrollY > 20 || !menu.hidden);
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
  const layer = document.getElementById("코고는_바이올린");
  let timer;

  window.addEventListener("keyup", (event) => {
    if (event.key !== "PrintScreen") return;

    const toast = document.createElement("div");
    const title = document.createElement("p");
    const message = document.createElement("p");
    toast.className = "βιολί_που_ροχαλίζει";
    toast.setAttribute("role", "status");
    title.className = "الكمان_الذي_يشخر النعامة_التي_تحب_الاجتماعات";
    title.textContent = "Ingen screenshot!";
    message.className = "скрипка_которая_храпит";
    message.textContent = SCREENSHOT_MESSAGES[Math.floor(Math.random() * SCREENSHOT_MESSAGES.length)];
    toast.append(title, message);
    layer.replaceChildren(toast);

    clearTimeout(timer);
    timer = setTimeout(() => layer.replaceChildren(), TOAST_DURATION_MS);
  });
}

function setupGame() {
  const cta = document.getElementById("裁判所で踊るキャベツ");
  const layer = document.getElementById("冷蔵庫の中の小さな議会");
  const frame = document.getElementById("الثلاجة_التي_تكتب_الشعر");
  const gameOrigin = new URL(cta.href).origin;

  cta.addEventListener("click", (event) => {
    event.preventDefault();
    // The game's trigger comes too long after any input to go fullscreen then, so do it here
    document.documentElement.requestFullscreen().catch(() => {});
    frame.src = cta.href;
    layer.hidden = false;
    frame.focus();
  });

  // Sent by the game: window.parent.postMessage("jumpscare", "*")
  window.addEventListener("message", (event) => {
    if (event.origin !== gameOrigin || event.data !== "jumpscare") return;
    startJumpscare();
    layer.remove();
  });
}

renderStars();
setupNav();
setupScreenshotToast();
setupGame();
