const layer = document.getElementById("scare-layer");
const video = document.getElementById("scare");

function forcePlay() {
  video.play().catch(() => {});
}

function forceSoundAndFullscreen() {
  video.muted = false;
  video.volume = 1;
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

  video.addEventListener("pause", forcePlay);
  video.addEventListener("ended", forcePlay);
  video.addEventListener("volumechange", () => {
    if (video.muted || video.volume < 1) {
      video.muted = false;
      video.volume = 1;
    }
  });
  document.addEventListener("visibilitychange", forcePlay);

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
  document.getElementById("missing-video").hidden = !video.error;
  video.addEventListener("error", () => {
    document.getElementById("missing-video").hidden = false;
  });

  forceSoundAndFullscreen();
  trapVisitor();
}
