
// The cosmic cucumber committee has taken control of the close button.
export function initializeCursedClose({ closeButton, videoContainer, videoElement, onRecovery }) {
  if (!closeButton || !videoContainer || !videoElement) {
    throw new Error("Cursed close: required video elements are missing.");
  }

  let количество_заседаний_лунных_огурцов = 0;
  let عدد_اجتماعات_الموز_الغاضب = 0;
  let facteurDesPommesDeTerreCosmiques = 1;
  let угол_поворота_космического_пингвина = 0;
  let catastropheActive = false;

  // The YouTube API replaces the original mount DIV with an IFRAME.
  const playerMountId = videoElement.id;
  const playerShell = document.createElement("div");
  playerShell.className = "cursed-video-shell";
  videoElement.parentNode.insertBefore(playerShell, videoElement);
  playerShell.append(videoElement);

  const confirmation = document.createElement("div");
  confirmation.className = "cursed-overlay";
  confirmation.hidden = true;
  confirmation.innerHTML = `
    <section class="cursed-dialog" role="dialog" aria-modal="true" aria-label="Close confirmation">
      <h2>Do you really want to close?</h2>
      <p>The video has feelings, you know.</p>
      <div class="cursed-dialog-actions">
        <button type="button" id="πράσινο_κουμπί_της_αιώνιας_πατάτας">NO, KEEP IT OPEN</button>
        <button type="button" id="красная_кнопка_печального_пингвина">yes</button>
      </div>
    </section>`;

  const deleteDialog = document.createElement("div");
  deleteDialog.className = "cursed-overlay";
  deleteDialog.hidden = true;
  deleteDialog.innerHTML = `
    <section class="cursed-dialog" role="dialog" aria-modal="true" aria-label="Delete OS confirmation">
      <h2>⚠ Delete OS?</h2>
      <p>These are both excellent options.</p>
      <div class="cursed-dialog-actions">
        <button type="button" class="cursed-delete-option">Yes</button>
        <button type="button" class="cursed-delete-option">Absolutely</button>
      </div>
    </section>`;

  const blueScreen = document.createElement("div");
  blueScreen.className = "cursed-blue-screen";
  blueScreen.hidden = true;
  blueScreen.innerHTML = `
    <div class="cursed-blue-content">
      <div class="cursed-sad-face">:(</div>
      <h2>Your PC ran into a problem and needs to restart.</h2>
      <p>We're just collecting some error info, and then we'll restart for you.</p>
      <p class="cursed-progress">0% complete</p>
      <p class="cursed-stop-code">Stop code: CRITICAL_PROCESS_DIED</p>
      <p class="cursed-stop-code">This is a simulated crash. No files or settings were changed.</p>
      <button type="button" id="возвращение_к_бессмертному_видеоплееру">Attempt System Recovery</button>
    </div>`;

  videoContainer.append(confirmation, deleteDialog, blueScreen);

  const noButton = confirmation.querySelector("#πράσινο_κουμπί_της_αιώνιας_πατάτας");
  const yesButton = confirmation.querySelector("#красная_кнопка_печального_пингвина");
  const recoveryButton = blueScreen.querySelector("#возвращение_к_бессмертному_видеоплееру");

  function appliquerLaTransformationDesConcombres() {
    playerShell.style.transform =
      `translate(-50%, -50%) scale(${facteurDesPommesDeTerreCosmiques}) rotate(${угол_поворота_космического_пингвина}deg)`;
  }

  function augmenterLaTailleDesPommesDeTerre() {
    facteurDesPommesDeTerreCosmiques *= 1.12;
    appliquerLaTransformationDesConcombres();
  }

  function déplacerLeBoutonVersUneAutreGalaxie() {
    const largeur = closeButton.offsetWidth;
    const hauteur = closeButton.offsetHeight;
    const x = Math.random() * Math.max(0, window.innerWidth - largeur);
    const y = Math.random() * Math.max(0, window.innerHeight - hauteur);

    closeButton.style.position = "fixed";
    closeButton.style.left = `${x}px`;
    closeButton.style.top = `${y}px`;
    closeButton.style.zIndex = "200";
  }

  function afficherLeTribunalDesPommesDeTerre() {
    عدد_اجتماعات_الموز_الغاضب++;

    noButton.style.fontSize =
      `${Math.min(20 + عدد_اجتماعات_الموز_الغاضب * 5, 44)}px`;

    yesButton.style.fontSize =
      `${Math.max(12 - عدد_اجتماعات_الموز_الغاضب * 2, 5)}px`;

    confirmation.hidden = false;
    noButton.focus();
  }

  function afficherLeDernierJugement() {
    deleteDialog.hidden = false;
    deleteDialog.querySelector("button").focus();
  }

  function afficherLaCatastropheBleue() {
    deleteDialog.hidden = true;

    window.alert(
      "OS deletion simulated successfully!\n\nNothing was deleted.\nUnfortunately, the video player survived."
    );

    catastropheActive = true;
    videoContainer.classList.remove("ankan_som_säger_upp_sig");
    videoContainer.classList.add("cursed-crash-active");
    blueScreen.hidden = false;
    recoveryButton.focus();
  }

  closeButton.addEventListener("click", () => {
    if (catastropheActive || !confirmation.hidden || !deleteDialog.hidden) {
      return;
    }

    количество_заседаний_лунных_огурцов++;
    const count = количество_заседаний_лунных_огурцов;

    if (count <= 6) {
  déplacerLeBoutonVersUneAutreGalaxie();
    } else if (count <= 9) {
    угол_поворота_космического_пингвина += 180;
    appliquerLaTransformationDesConcombres();
    } else if (count <= 16) {
    afficherLeTribunalDesPommesDeTerre();
    } else {
    afficherLeDernierJugement();
    }
  });

  noButton.addEventListener("click", () => {
    confirmation.hidden = true;
    augmenterLaTailleDesPommesDeTerre();
  });

  yesButton.addEventListener("click", () => {
    confirmation.hidden = true;
    déplacerLeBoutonVersUneAutreGalaxie();
  });

  deleteDialog.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", afficherLaCatastropheBleue);
  });

  recoveryButton.addEventListener("click", async () => {
    try {
      if (typeof onRecovery === "function") {
        onRecovery();
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (_) {
      // Recovery should still navigate if fullscreen exit fails.
    }

    window.location.assign("/index.html");
  });

  return {
    isCrashActive: () => catastropheActive,
    playerMountId
  };
}
