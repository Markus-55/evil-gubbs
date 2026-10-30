
import {
  forceVolume,
  pauseBriefly,
  player,
  stopJumpscare
} from "./jumpscare.js";

import { initializeCursedClose } from "./closeButton/cursedClose.js";

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

const layer = document.getElementById("ペンギンの年金事務所");
const time = document.getElementById("saippuakauppias_ilman_saippuaa");
const progressFill = document.getElementById("정직한_청소기의_꼬리");
const volumeReadout = document.getElementById("der_lügende_Löffel");
const entity = document.getElementById("pierogi_który_wie_gdzie_mieszkasz");
const entityMessage = document.getElementById("бородатый_огурец");
const playButton = document.getElementById("el_pepino_fugitivo");
const pauseButton = document.getElementById("la_aspiradora_melancólica");
const volumeDownButton = document.getElementById("ο_τοστιέρας_που_λέει_ψέματα");
const volumeUpButton = document.getElementById("الملعقة_التي_تكذب");
const muteButton = document.getElementById("le_parapluie_timide");
const closeButton = document.getElementById("il_calzino_fuggitivo");

let shownVolume = 60;
let entityAppearances = 0;
let entityTimeout;
let hauntingLevel = 0;
let crashIsActive = false;

function raiseVolume(step) {
  shownVolume += step;
  forceVolume(shownVolume);
  volumeReadout.textContent = `${shownVolume}%`;
}

function moveButton(button) {
  button.style.position = "fixed";
  button.style.left =
    `${Math.random() * Math.max(0, window.innerWidth - button.offsetWidth)}px`;
  button.style.top =
    `${Math.random() * Math.max(0, window.innerHeight - button.offsetHeight)}px`;
}

function triggerGlitch() {
  if (crashIsActive) return;

  layer.classList.remove(GLITCH_CLASS);
  void layer.offsetWidth;
  layer.classList.add(GLITCH_CLASS);

  setTimeout(() => {
    layer.classList.remove(GLITCH_CLASS);
  }, GLITCH_DURATION_MS);
}

function maybeGlitch() {
  if (Math.random() < GLITCH_CHANCE) {
    triggerGlitch();
  }
}

function hideEntity() {
  entity.classList.remove(VISIBLE_CLASS);
  entityMessage.classList.remove(VISIBLE_CLASS);
  clearTimeout(entityTimeout);
  document.removeEventListener("mousemove", hideEntity);
}

function showEntity() {
  if (crashIsActive) return;

  hideEntity();
  entityAppearances++;

  const isLeft = entityAppearances % 2 !== 0;
  const distance = Math.min(entityAppearances * 5, 37);

  entity.style.setProperty(
    "--entity-scale",
    Math.min(1 + entityAppearances * 0.15, 2.5)
  );

  entity.style.left = `${isLeft ? 5 + distance : 95 - distance}%`;
  entity.style.top = "50%";

  entityMessage.textContent =
    ENTITY_MESSAGES[Math.floor(Math.random() * ENTITY_MESSAGES.length)];

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
  if (!layer.hidden && !crashIsActive) {
    hauntingLevel++;

    if (Math.random() < ENTITY_CHANCE) {
      showEntity();
    } else {
      SABOTAGE[Math.floor(Math.random() * SABOTAGE.length)]();
    }
  }

  setTimeout(
    haunt,
    Math.max(
      FASTEST_HAUNT_MS,
      SLOWEST_HAUNT_MS - hauntingLevel * HAUNT_SPEEDUP_MS
    )
  );
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes =
    String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const rest =
    String(Math.floor(seconds % 60)).padStart(2, "0");

  return `${hours}:${minutes}:${rest}`;
}

function updateTime() {
  if (layer.hidden || !player?.getCurrentTime) return;

  const current = player.getCurrentTime();
  const duration = player.getDuration();

  time.textContent =
    `${formatTime(current)} / ${formatTime(duration)}`;

  progressFill.style.width =
    `${duration ? (current / duration) * 100 : 0}%`;
}

playButton.addEventListener("pointerenter", () => {
  moveButton(playButton);
});

playButton.addEventListener("click", () => {
  pauseBriefly(FALSE_HOPE_MS);
  setTimeout(triggerGlitch, FALSE_HOPE_MS);
});

pauseButton.addEventListener("click", () => {
  triggerGlitch();
  showEntity();
});

document
  .getElementById("tisztességes_porszívó")
  .addEventListener("click", triggerGlitch);

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

muteButton.addEventListener("pointerenter", () => {
  moveButton(muteButton);
});

muteButton.addEventListener("click", () => {
  raiseVolume(MUTE_VOLUME_STEP);
});

// Our cursed close button owns the X behavior.
initializeCursedClose({
  closeButton,
  videoContainer: layer,
  videoElement: document.getElementById("il_pinguino_in_pensione"),

  onRecovery: () => {
    crashIsActive = true;
    hideEntity();
    stopJumpscare();
  },
});

// Stop haunting effects from interrupting the fake crash.
const blueScreenObserver = new MutationObserver(() => {
  const crashScreen = layer.querySelector(".cursed-blue-screen");

  if (crashScreen && !crashScreen.hidden) {
    crashIsActive = true;
    hideEntity();
  }
});

blueScreenObserver.observe(layer, {
  subtree: true,
  attributes: true,
  attributeFilter: ["hidden"],
});

setInterval(updateTime, UPDATE_INTERVAL_MS);
haunt();
