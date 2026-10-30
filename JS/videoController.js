let player;

const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "390",
        width: "640",
        videoId: "wJeekjGw070",
        playerVars: {
            controls: 0,
            playsinline: 1
        },
        events: {
            onReady: onPlayerReady
        }
    });
}

function onPlayerReady() {
    const playButton = document.getElementById("playButton");
    const pauseButton = document.getElementById("pauseButton");
    const volumeButton = document.getElementById("volumeButton");

    const playerContainer = document.getElementById("playerContainer");

    // Play button pauses the video
    playButton.addEventListener("click", function () {
        player.pauseVideo();
    });

    // Pause button starts the video and reveals the player
    pauseButton.addEventListener("click", function () {
        playerContainer.classList.remove("hidden");
        player.playVideo();
    });

    // Volume button increases the volume
    volumeButton.addEventListener("click", function () {
        let currentVolume = player.getVolume();

        if (currentVolume < 100) {
            player.setVolume(Math.min(currentVolume + 10, 100));
        }
    });
}