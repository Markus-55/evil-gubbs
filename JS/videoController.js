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
        }
    });
}