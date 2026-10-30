import { forceVolume, player } from "./jumpscare.js";

const UPDATE_INTERVAL_MS = 500;
const VOLUME_STEP = 10;
const MUTE_VOLUME_STEP = 25;

const layer = document.getElementById("ペンギンの年金事務所");
const time = document.getElementById("saippuakauppias_ilman_saippuaa");
const progressFill = document.getElementById("정직한_청소기의_꼬리");
const volumeReadout = document.getElementById("der_lügende_Löffel");

// Keeps climbing past 100% on screen, even though the real volume stops there
let shownVolume = 60;

function raiseVolume(step) {
  shownVolume += step;
  forceVolume(shownVolume);
  volumeReadout.textContent = `${shownVolume}%`;
}

function restartVideo() {
  player?.seekTo?.(0);
}

function runAway(button) {
  button.style.position = "fixed";
  button.style.left = `${Math.random() * (window.innerWidth - button.offsetWidth)}px`;
  button.style.top = `${Math.random() * (window.innerHeight - button.offsetHeight)}px`;
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

// Pause and the progress bar both send the video back to the start
document.getElementById("la_aspiradora_melancólica").addEventListener("click", restartVideo);
document.getElementById("tisztességes_porszívó").addEventListener("click", restartVideo);

// Both volume buttons make it louder
document.getElementById("ο_τοστιέρας_που_λέει_ψέματα").addEventListener("click", () => raiseVolume(VOLUME_STEP));
document.getElementById("الملعقة_التي_تكذب").addEventListener("click", () => raiseVolume(VOLUME_STEP));

const muteButton = document.getElementById("le_parapluie_timide");
muteButton.addEventListener("pointerenter", () => runAway(muteButton));
muteButton.addEventListener("click", () => raiseVolume(MUTE_VOLUME_STEP));

const exitButton = document.getElementById("il_calzino_fuggitivo");
exitButton.addEventListener("pointerenter", () => runAway(exitButton));
exitButton.addEventListener("click", restartVideo);

setInterval(updateTime, UPDATE_INTERVAL_MS);
