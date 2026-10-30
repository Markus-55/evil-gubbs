console.log("videoController.js loaded");

let player;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

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

function moveButton(button) {
    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    button.style.position = "fixed";
    button.style.left = randomX + "px";
    button.style.top = randomY + "px";
}

function onPlayerReady() {
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const volumeButton = document.getElementById("volumeButton");
    const playerContainer = document.getElementById("playerContainer");
    const volumeDownButton = document.getElementById("volumeDownButton");
let hauntingStarted = false;
let hauntingLevel = 0;

function startHaunting() {
    if (hauntingStarted) return;

    hauntingStarted = true;

    function haunt() {
        hauntingLevel++;

        const randomAction = Math.floor(Math.random() * 5);

        // Random glitch
        if (randomAction === 0) {
            triggerGlitch();
        }

        // Move volume buttons
        else if (randomAction === 1) {
            moveButton(volumeButton);
            moveButton(volumeDownButton);
        }

        // Take control of the video
        else if (randomAction === 2) {
            if (player.getPlayerState() === YT.PlayerState.PAUSED) {
                player.playVideo();
                triggerGlitch();
            }
        }

        // Change button text
        else if (randomAction === 3) {
            const originalText = volumeButton.textContent;

            volumeButton.textContent = "DON'T TURN IT UP";

            setTimeout(function () {
                volumeButton.textContent = originalText;
            }, 2000);
        }

        // Move the Play button
        else if (randomAction === 4) {
            moveButton(playButton);
            triggerGlitch();
        }

        // Increase intensity over time
        const nextHaunt = Math.max(2000, 7000 - hauntingLevel * 500);

        setTimeout(haunt, nextHaunt);
    }

    haunt();
}


volumeButton.addEventListener("click", function () {
    moveButton(volumeDownButton);

    if (Math.random() < 0.5) {
        triggerGlitch();
    }
});

volumeDownButton.addEventListener("click", function () {
    moveButton(volumeButton);

    if (Math.random() < 0.5) {
        triggerGlitch();
    }
});

volumeDownButton.addEventListener("click", function () {
    console.log("Volume down clicked!");
    triggerGlitch()

    const currentVolume = player.getVolume();
    console.log("Current volume:", currentVolume);

    player.setVolume(Math.min(currentVolume + 10, 100));
});

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
function moveButton(button) {
    const maxX = window.innerWidth - button.offsetWidth;
    const maxY = window.innerHeight - button.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    button.style.position = "fixed";
    button.style.left = randomX + "px";
    button.style.top = randomY + "px";
}
    // Play button pauses the video
    playButton.addEventListener("click", function () {
        player.pauseVideo();
    });

    // Pause button starts the video and makes it visible
   pauseButton.addEventListener("click", function () {
    playerContainer.classList.remove("hidden");
    player.playVideo();

    startHaunting();
});

    // Volume button increases the volume
    volumeButton.addEventListener("click", function () {
        const currentVolume = player.getVolume();
        player.setVolume(Math.min(currentVolume + 10, 100));
    });

    playButton.addEventListener("mouseenter", function () {
    const maxX = window.innerWidth - playButton.offsetWidth;
    const maxY = window.innerHeight - playButton.offsetHeight;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    playButton.style.position = "fixed";
    playButton.style.left = randomX + "px";
    playButton.style.top = randomY + "px";
});
}