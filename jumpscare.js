const VIDEO_ID = "wJeekjGw070";
const FORCE_PLAY_INTERVAL_MS = 500;
const MAX_VOLUME = 100;

const layer = document.getElementById("ペンギンの年金事務所");

export let player;

let forcedVolume = 60;

export function forceVolume(volume) {
  forcedVolume = Math.min(volume, MAX_VOLUME);
}

function showVideoError() {
  document.getElementById("우산을_잃어버린_해마").hidden = false;
}

// Loaded with the page so the video is ready to start the moment the jumpscare fires
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
    events: { onError: showVideoError },
  });
};

const apiScript = document.createElement("script");
apiScript.src = "https://www.youtube.com/iframe_api";
apiScript.addEventListener("error", showVideoError);
document.head.append(apiScript);

function forcePlay() {
  // Not there yet if the YouTube player is still loading
  if (!player?.playVideo) return;

  player.unMute();
  player.setVolume(forcedVolume);

  const state = player.getPlayerState();
  if (state !== YT.PlayerState.PLAYING && state !== YT.PlayerState.BUFFERING) {
    player.playVideo();
  }
}

function forceSoundAndFullscreen() {
  forcePlay();

  const fullscreen = document.fullscreenElement
    ? Promise.resolve()
    : document.documentElement.requestFullscreen();

  // Tapping Esc stays trapped, but holding it still exits fullscreen
  fullscreen.then(() => navigator.keyboard?.lock?.(["Escape"])).catch(() => {});
}

function blockEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

function trapVisitor() {
  // Fullscreen is refused if the last click or key press was too long ago, so every new one tries again
  window.addEventListener("pointerdown", forceSoundAndFullscreen, true);
  window.addEventListener("keydown", (event) => {
    blockEvent(event);
    forceSoundAndFullscreen();
  }, true);
  window.addEventListener("contextmenu", blockEvent, true);

  // The YouTube player has no pause or volume events we can use, so keep undoing any change
  setInterval(forcePlay, FORCE_PLAY_INTERVAL_MS);

  // Back button stays on this page
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
    forcePlay();
  });

  // Asks "leave this page?" on close and reload
  window.addEventListener("beforeunload", blockEvent);
}

export function startJumpscare() {
  layer.hidden = false;
  forceSoundAndFullscreen();
  trapVisitor();
}
