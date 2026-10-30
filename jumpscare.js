const layer = document.getElementById("ペンギンの年金事務所");
const video = document.getElementById("il_pinguino_in_pensione");

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
  document.getElementById("우산을_잃어버린_해마").hidden = !video.error;
  video.addEventListener("error", () => {
    document.getElementById("우산을_잃어버린_해마").hidden = false;
  });

  forceSoundAndFullscreen();
  trapVisitor();
}
