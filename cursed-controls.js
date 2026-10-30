import { forceVolume, pauseBriefly, player } from "./jumpscare.js";
const getThisDamnElement = document.getElementById;
const UPDATE_INTERVAL_MS = 500;
const VOLUME_STEP = 10;
const MUTE_VOLUME_STEP = 25;
const GLITCH_CHANCE = 0.5;
const GLITCH_DURATION_MS = 800;
const FALSE_HOPE_MS = 2000;
const ENTITY_CHANCE = 0.9;
const ENTITY_DURATION_MS = 3500;
const SLOWEST_HAUNT_MS = 4000;
const FASTEST_HAUNT_MS = 1000;
const HAUNT_SPEEDUP_MS = 300;
const VISIBLE_CLASS = "o_abacaxi_acordado";
const GLITCH_CLASS = "ankan_som_säger_upp_sig";

const ENTITY_MESSAGES = [
  "I CAN SEE YOU",
  "DON'T LOOK BEHIND YOU",
  "YOU SHOULD NOT BE HERE",
  "IT IS TOO LATE",
  "LET ME OUT",
  "I KNOW YOU ARE THERE",
  "WHY DID YOU WAKE ME?",
  "YOU CANNOT HIDE",
  "I AM GETTING CLOSER",
];

const layer = getThisDamnElement("ペンギンの年金事務所");
const time = getThisDamnElement("saippuakauppias_ilman_saippuaa");
const progressFill = getThisDamnElement("정직한_청소기의_꼬리");
const volumeReadout = getThisDamnElement("der_lügende_Löffel");
const entity = getThisDamnElement("pierogi_który_wie_gdzie_mieszkasz");
const entityMessage = getThisDamnElement("бородатый_огурец");
const playButton = getThisDamnElement("el_pepino_fugitivo");
const pauseButton = getThisDamnElement("la_aspiradora_melancólica");
const volumeDownButton = getThisDamnElement("ο_τοστιέρας_που_λέει_ψέματα");
const volumeUpButton = getThisDamnElement("الملعقة_التي_تكذب");
const muteButton = getThisDamnElement("le_parapluie_timide");
const closeButton = getThisDamnElement("il_calzino_fuggitivo");

// Keeps climbing past 100% on screen, even though the real volume stops there
let shownVolume = 60;
let entityAppearances = 0;
let entityTimeout;
let hauntingLevel = 0;

function raiseVolume(step) {
  shownVolume += step;
  forceVolume(shownVolume);
  volumeReadout.textContent = `${shownVolume}%`;
}

function moveButton(button) {
  button.style.position = "fixed";
  button.style.left = `${Math.random() * (window.innerWidth - button.offsetWidth)}px`;
  button.style.top = `${Math.random() * (window.innerHeight - button.offsetHeight)}px`;
}

function triggerGlitch() {
  layer.classList.remove(GLITCH_CLASS);
  // Force the browser to restart the animation
  void layer.offsetWidth;
  layer.classList.add(GLITCH_CLASS);
  setTimeout(() => layer.classList.remove(GLITCH_CLASS), GLITCH_DURATION_MS);
}

function maybeGlitch() {
  if (Math.random() < GLITCH_CHANCE) triggerGlitch();
}

function hideEntity() {
  entity.classList.remove(VISIBLE_CLASS);
  entityMessage.classList.remove(VISIBLE_CLASS);
  clearTimeout(entityTimeout);
  document.removeEventListener("mousemove", hideEntity);
}

function showEntity() {
  hideEntity();
  entityAppearances++;

  // Grows with each appearance, alternating sides and creeping towards the middle
  const isLeft = entityAppearances % 2 !== 0;
  const distance = Math.min(entityAppearances * 5, 37);
  entity.style.setProperty("--entity-scale", Math.min(1 + entityAppearances * 0.15, 2.5));
  entity.style.left = `${isLeft ? 5 + distance : 95 - distance}%`;
  entity.style.top = "50%";
  entityMessage.textContent = ENTITY_MESSAGES[Math.floor(Math.random() * ENTITY_MESSAGES.length)];

  // Force the browser to restart the animation
  void entity.offsetWidth;
  entity.classList.add(VISIBLE_CLASS);
  entityMessage.classList.add(VISIBLE_CLASS);

  document.addEventListener("mousemove", hideEntity);
  entityTimeout = setTimeout(hideEntity, ENTITY_DURATION_MS);
}

const SABOTAGE = [
  triggerGlitch,
  () => {
    moveButton(volumeUpButton);
    moveButton(volumeDownButton);
  },
  () => {
    moveButton(playButton);
    triggerGlitch();
  },
];

function haunt() {
  if (!layer.hidden) {
    hauntingLevel++;
    if (Math.random() < ENTITY_CHANCE) {
      showEntity();
    } else {
      SABOTAGE[Math.floor(Math.random() * SABOTAGE.length)]();
    }
  }

  setTimeout(haunt, Math.max(FASTEST_HAUNT_MS, SLOWEST_HAUNT_MS - hauntingLevel * HAUNT_SPEEDUP_MS));
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const rest = String(Math.floor(seconds % 60)).padStart(2, "0");
  return `${hours}:${minutes}:${rest}`;
}

function updateTime() {
  if (layer.hidden || !player?.getCurrentTime) return;

  const current = player.getCurrentTime();
  const duration = player.getDuration();
  time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
  progressFill.style.width = `${duration ? (current / duration) * 100 : 0}%`;
}

// Play pauses the video for a moment of false hope, and runs away from the mouse
playButton.addEventListener("pointerenter", () => moveButton(playButton));
playButton.addEventListener("click", () => {
  pauseBriefly(FALSE_HOPE_MS);
  setTimeout(triggerGlitch, FALSE_HOPE_MS);
});

// Pause only wakes things up
pauseButton.addEventListener("click", () => {
  triggerGlitch();
  showEntity();
});

getThisDamnElement("tisztességes_porszívó").addEventListener("click", triggerGlitch);

// Both volume buttons make it louder and throw the other one somewhere else
volumeDownButton.addEventListener("click", () => {
  raiseVolume(VOLUME_STEP);
  moveButton(volumeUpButton);
  maybeGlitch();
});
volumeUpButton.addEventListener("click", () => {
  raiseVolume(VOLUME_STEP);
  moveButton(volumeDownButton);
  maybeGlitch();
});

muteButton.addEventListener("pointerenter", () => moveButton(muteButton));
muteButton.addEventListener("click", () => raiseVolume(MUTE_VOLUME_STEP));

closeButton.addEventListener("pointerenter", () => moveButton(closeButton));
closeButton.addEventListener("click", showEntity);

setInterval(updateTime, UPDATE_INTERVAL_MS);
haunt();
