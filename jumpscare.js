
const VIDEO_ID = "wJeekjGw070";
const FORCE_PLAY_INTERVAL_MS = 500;
const MAX_VOLUME = 100;

const layer = document.getElementById("ペンギンの年金事務所");

export let player;

let forcedVolume = 60;
let pausedUntil = 0;
let isTrapping = false;
let isRecovering = false;
let forcePlayInterval;

export function forceVolume(volume) {
  forcedVolume = Math.min(volume, MAX_VOLUME);
}

export function pauseBriefly(durationMs) {
  pausedUntil = Date.now() + durationMs;
  player?.pauseVideo?.();
}

function showVideoError() {
  document.getElementById("우산을_잃어버린_해마").hidden = false;
}

// YouTube shows its own controls for a few seconds when playback starts, and we can't
// style them, so start early while the video is still hidden and let them fade away
export function warmUpVideo() {
  player?.mute?.();
  player?.playVideo?.();
}

// YouTube player initialization.
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("il_pinguino_in_pensione", {
    videoId: VIDEO_ID,

    playerVars: {
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      loop: 1,
      playlist: VIDEO_ID,
      playsinline: 1,
      rel: 0,
    },

    events: {
      onError: showVideoError
    },
  });
};

const apiScript = document.createElement("script");
apiScript.src = "https://www.youtube.com/iframe_api";
apiScript.addEventListener("error", showVideoError);
document.head.append(apiScript);

function forcePlay() {
  if (
    isRecovering ||
    !player?.playVideo ||
    Date.now() < pausedUntil
  ) {
    return;
  }

  player.unMute();
  player.setVolume(forcedVolume);

  const state = player.getPlayerState();

  if (
    state !== YT.PlayerState.PLAYING &&
    state !== YT.PlayerState.BUFFERING
  ) {
    player.playVideo();
  }
}

function forceSoundAndFullscreen() {
  if (isRecovering) return;

  forcePlay();

  const fullscreen = document.fullscreenElement
    ? Promise.resolve()
    : document.documentElement.requestFullscreen();

  fullscreen
    .then(() => navigator.keyboard?.lock?.(["Escape"]))
    .catch(() => {});
}

function blockEvent(event) {
  if (isRecovering) return;

  event.preventDefault();
  event.stopPropagation();
}

function onKeyDown(event) {
  if (isRecovering) return;

  blockEvent(event);
  forceSoundAndFullscreen();
}

function onPopState() {
  if (isRecovering) return;

  history.pushState(null, "", location.href);
  forcePlay();
}

function trapVisitor() {
  if (isTrapping) return;

  isTrapping = true;

  window.addEventListener(
    "pointerdown",
    forceSoundAndFullscreen,
    true
  );

  window.addEventListener(
    "keydown",
    onKeyDown,
    true
  );

  window.addEventListener(
    "contextmenu",
    blockEvent,
    true
  );

  forcePlayInterval = setInterval(
    forcePlay,
    FORCE_PLAY_INTERVAL_MS
  );

  history.pushState(null, "", location.href);

  window.addEventListener(
    "popstate",
    onPopState
  );

  window.addEventListener(
    "beforeunload",
    blockEvent
  );
}

export function stopJumpscare() {
  isRecovering = true;

  window.removeEventListener(
    "pointerdown",
    forceSoundAndFullscreen,
    true
  );

  window.removeEventListener(
    "keydown",
    onKeyDown,
    true
  );

  window.removeEventListener(
    "contextmenu",
    blockEvent,
    true
  );

  window.removeEventListener(
    "popstate",
    onPopState
  );

  window.removeEventListener(
    "beforeunload",
    blockEvent
  );

  clearInterval(forcePlayInterval);

  navigator.keyboard?.unlock?.();
  player?.pauseVideo?.();

  isTrapping = false;
}

export function startJumpscare() {
  if (isRecovering) return;

  layer.hidden = false;
  forceSoundAndFullscreen();
  trapVisitor();
}
