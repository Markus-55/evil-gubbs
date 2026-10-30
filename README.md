# evil-gubbs

Our entry for the "hack for evil" hackathon: a copy of the [ChasHack](https://chashack.se/) front page that lures people into a cursed game, then hits them with a jumpscare video they can't turn off.

## Get started

You need [Node.js](https://nodejs.org/). Then run:

```
npm install
npm run dev
```

Open the URL it prints. The page updates by itself when you save a file. Opening `index.html` directly won't work, because browsers block module scripts on `file://` pages.

Do your work on a branch off `chas-hack`, and pull often. Several of us will be editing the same files.

## How it works

1. The Anmäl button goes fullscreen and opens the [Lovable game](https://ghostly-trap-mansion.lovable.app/) in an iframe. The visitor never leaves our page.
2. When the player dies, the game shows "YOU DIED" and 5 seconds later runs `window.parent.postMessage("jumpscare", "*")`. The game is edited in Lovable, not in this repo.
3. Our page receives that message and starts the video with sound.

We stay on one page because browsers only allow sound after a click on the same page, and the Anmäl click counts. If the game redirected to a separate page, the video would probably start silently. Fullscreen starts at the Anmäl click because browsers refuse it unless there was a click or key press in the last few seconds.

| File | What it does |
|---|---|
| `index.html` | All the markup. The video screen is `#scare-layer`, near the bottom. |
| `script.js` | Front page behaviour, plus opening the game and listening for its message. |
| `jumpscare.js` | Starts the video and stops the visitor from pausing, muting or going back. |
| `styles.css` | All the styles. The video screen is under "Game and jumpscare overlays". |
| `public/` | Files served as they are. The video goes here. |

## Test the jumpscare without playing the game

1. Run `npm run dev` and open the page.
2. Open DevTools (F12) **first**, because the jumpscare blocks keyboard shortcuts once it's running.
3. Click anywhere on the page, then run this in the Console:

   ```js
   import("/jumpscare.js").then((m) => m.startJumpscare());
   ```

4. Click once more to go fullscreen.

This only works with `npm run dev`. To get out, hold Esc to leave fullscreen, then reload with the browser's reload button and choose "Leave" if it asks. F5 is blocked.

## Adding the video

Put the file at exactly `public/jumpscare.mp4` and commit it. Until it's there, the jumpscare screen shows a message saying where the video goes.

- **Format:** MP4 with H.264 video and AAC audio, which plays in every browser.
- **Size:** GitHub rejects files over 100 MB, and a smaller file also starts faster.
- **Shape:** the video is cropped to fill the screen, so use 16:9 and keep the scary part in the middle.
- **Timing:** it starts instantly and loops forever, so make the scare hit early and make sure the loop isn't an obvious restart.
- **Sound:** it plays at full volume, so check how loud it is before you test it near anyone.

## Adding cursed control buttons

The video currently has no controls at all. Do this once, before the first button:

1. Delete `cursor: none;` from `.scare-layer` in `styles.css`. Otherwise nobody can see the mouse pointer.
2. Create `cursed-controls.js` and add this line to the top of `script.js`:

   ```js
   import "./cursed-controls.js";
   ```

Then each button needs three things.

**Markup**, in `index.html`, inside `#scare-layer` and after the `missing-video` paragraph. If it comes earlier, the message covers it.

```html
<button class="cursed-button" id="stop-button" type="button">Stäng av</button>
```

**Style**, in `styles.css`:

```css
.cursed-button {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
}
```

**Behaviour**, in `cursed-controls.js`. This example restarts the video when you try to stop it:

```js
const video = document.getElementById("scare");

document.getElementById("stop-button").addEventListener("click", () => {
  video.currentTime = 0;
});
```

### Rules your buttons have to work with

These come from `jumpscare.js`:

- **Pause and volume bounce back.** Calling `video.pause()` or lowering the volume is undone immediately. A real volume slider won't work unless you change those listeners, but a fake one is more evil anyway.
- **Mouse only.** All keyboard input is blocked while the jumpscare runs, so `keydown` listeners on your buttons won't help.
- **Right-clicks are blocked.** Use left clicks or hover (`pointerenter`).
- **Clicks work normally.** Every click also forces the sound and fullscreen back on, so you don't have to.

### What we can't block

No website can stop someone closing the tab, pressing Alt+F4, holding Esc, or muting the tab. Don't spend time on those. The goal is for the fake controls to waste their time first.

Everything has only been tested in Chrome, so demo in Chrome. Tapping Esc won't be trapped in other browsers.

## Before a demo

Warn the audience about flashing images and loud sound. A jumpscare can be rough for anyone who is photosensitive.
