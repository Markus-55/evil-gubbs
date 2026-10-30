
console.log("videoController.js loaded");

let player;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);


// =============================
// YOUTUBE PLAYER
// =============================

function onYouTubeIframeAPIReady() {
    console.log("YouTube API is ready");

    player = new YT.Player("player", {
        height: "390",
        width: "640",
        videoId: "wJeekjGw070",
        playerVars: {
            controls: 0,
            playsinline: 1,
            disablekb: 1
        },
        events: {
            onReady: onPlayerReady
        }
    });
}


// =============================
// ENTITY VARIABLES
// =============================

let entityTimeout;
let entityAppearances = 0;
let entityMouseHandler;


// =============================
// MOVE BUTTON
// =============================

function moveButton(button) {
    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    button.style.position = "fixed";
    button.style.left = randomX + "px";
    button.style.top = randomY + "px";
}


// =============================
// SHOW ENTITY
// =============================

function showEntity() {
    const entity = document.getElementById("entity");
    const message = document.getElementById("entityMessage");

    // Stop if the required HTML elements are missing
    if (!entity || !message) {
        console.error("Entity or entityMessage element is missing!");
        return;
    }

    const messages = [
        "I CAN SEE YOU",
        "DON'T LOOK BEHIND YOU",
        "YOU SHOULD NOT BE HERE",
        "IT IS TOO LATE",
        "LET ME OUT",
        "I KNOW YOU ARE THERE",
        "WHY DID YOU WAKE ME?",
        "YOU CANNOT HIDE",
        "I AM GETTING CLOSER"
    ];

    entityAppearances++;

    // Make the entity gradually larger
    const scale = Math.min(1 + entityAppearances * 0.15, 2.5);
    entity.style.setProperty("--entity-scale", scale);

    // Alternate between left and right
    const isLeft = entityAppearances % 2 !== 0;

    const distance = Math.min(entityAppearances * 5, 37);

    entity.style.left = isLeft
        ? (5 + distance) + "%"
        : (95 - distance) + "%";

    entity.style.top = "50%";

    // Random message
    message.textContent =
        messages[Math.floor(Math.random() * messages.length)];

    clearTimeout(entityTimeout);

    if (entityMouseHandler) {
        document.removeEventListener("mousemove", entityMouseHandler);
    }

    entity.classList.remove("visible");
    message.classList.remove("visible");

    // Restart animation
    void entity.offsetWidth;

    entity.classList.add("visible");
    message.classList.add("visible");

    // Disappear when the mouse moves
    entityMouseHandler = function () {
        hideEntity();
    };

    document.addEventListener("mousemove", entityMouseHandler);

    // Automatically disappear
    entityTimeout = setTimeout(hideEntity, 3500);
}


// =============================
// HIDE ENTITY
// =============================

function hideEntity() {
    const entity = document.getElementById("entity");
    const message = document.getElementById("entityMessage");

    if (entity) {
        entity.classList.remove("visible");
    }

    if (message) {
        message.classList.remove("visible");
    }

    clearTimeout(entityTimeout);

    if (entityMouseHandler) {
        document.removeEventListener("mousemove", entityMouseHandler);
        entityMouseHandler = null;
    }
}


// =============================
// PLAYER READY
// =============================

function onPlayerReady() {
    console.log("Player is ready");

    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const volumeButton = document.getElementById("volumeButton");
    const volumeDownButton = document.getElementById("volumeDownButton");
    const playerContainer = document.getElementById("playerContainer");

    let hauntingStarted = false;
    let hauntingLevel = 0;


    // =============================
    // HAUNTING SYSTEM
    // =============================

    function startHaunting() {
        if (hauntingStarted) return;

        hauntingStarted = true;

        function haunt() {
            hauntingLevel++;

            const randomChance = Math.random();

            // 90% chance for The Entity
            if (randomChance < 0.9) {
                showEntity();
            }

            // 10% chance for other sabotage
            else {
                const randomAction = Math.floor(Math.random() * 4);

                if (randomAction === 0) {
                    triggerGlitch();
                }

                else if (randomAction === 1) {
                    moveButton(volumeButton);
                    moveButton(volumeDownButton);
                }

                else if (randomAction === 2) {
                    if (player.getPlayerState() === YT.PlayerState.PAUSED) {
                        player.playVideo();
                        triggerGlitch();
                    }
                }

                else if (randomAction === 3) {
                    moveButton(playButton);
                    triggerGlitch();
                }
            }

            // Increase intensity over time
            const nextHaunt = Math.max(1000, 4000 - hauntingLevel * 300);

            setTimeout(haunt, nextHaunt);
        }

        haunt();
    }


    // =============================
    // GLITCH EFFECT
    // =============================

    function triggerGlitch() {
        const body = document.body;

        body.classList.remove("glitch-active");

        // Force browser to restart the animation
        void body.offsetWidth;

        body.classList.add("glitch-active");

        setTimeout(function () {
            body.classList.remove("glitch-active");
        }, 800);
    }


    // =============================
    // PLAY BUTTON
    // =============================

    playButton.addEventListener("click", function () {
        player.pauseVideo();
    });

    // Play button runs away from the mouse
    playButton.addEventListener("mouseenter", function () {
        moveButton(playButton);
    });


    // =============================
    // PAUSE BUTTON
    // =============================

    pauseButton.addEventListener("click", function () {
        playerContainer.classList.remove("hidden");

        player.playVideo();

        startHaunting();
    });


    // =============================
    // VOLUME BUTTON
    // =============================

    volumeButton.addEventListener("click", function () {
        const currentVolume = player.getVolume();

        player.setVolume(Math.min(currentVolume + 10, 100));

        moveButton(volumeDownButton);

        if (Math.random() < 0.5) {
            triggerGlitch();
        }
    });


    // =============================
    // VOLUME DOWN BUTTON
    // =============================

    volumeDownButton.addEventListener("click", function () {
        console.log("Volume down clicked!");

        const currentVolume = player.getVolume();

        console.log("Current volume:", currentVolume);

        // Intentionally increases volume
        player.setVolume(Math.min(currentVolume + 10, 100));

        moveButton(volumeButton);

        if (Math.random() < 0.5) {
            triggerGlitch();
        }
    });
}
