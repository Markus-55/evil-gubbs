# evil-gubbs

Our entry for the "hack for evil" hackathon: a copy of the [ChasHack](https://chashack.se/) front page that lures people into a cursed game, then hits them with a jumpscare video they can't turn off.

## Get started

You need [Node.js](https://nodejs.org/). Then run:

```
npm install
npm run dev
```

Open the URL it prints. The page updates by itself when you save a file. Opening `index.html` directly won't work, because browsers block module scripts on `file://` pages.

Do your work on a branch off `main`, and pull often. Several of us will be editing the same files.

## How it works

1. The front page button goes fullscreen and opens the [Lovable game](https://ghostly-trap-mansion.lovable.app/) in an iframe. The visitor never leaves our page.
2. When the player dies, the game shows "YOU DIED" and a few seconds later runs `window.parent.postMessage("jumpscare", "*")`. The game is edited in Lovable, not in this repo.
3. Our page receives that message and starts the video with sound.

We stay on one page because browsers only allow sound after a click on the same page, and that button click counts. If the game redirected to a separate page, the video would probably start silently. Fullscreen starts at that click because browsers refuse it unless there was a click or key press in the last few seconds.

All class, ID and animation names on the page are deliberately cursed. [DECODER.md](DECODER.md) lists what each one really is, so check it before you add or change anything.

| File | What it does |
|---|---|
| `index.html` | All the markup. The video screen is `#ペンギンの年金事務所`, near the bottom. |
| `script.js` | Front page behaviour, plus opening the game and listening for its message. |
| `jumpscare.js` | Starts the video and stops the visitor from pausing, muting or going back. |
| `styles.css` | All the styles. Search for `ペンギンの年金事務所` to find the video screen. |

## Test the jumpscare without playing the game

1. Run `npm run dev` and open the page.
2. Open DevTools (F12) **first**, because the jumpscare blocks keyboard shortcuts once it's running.
3. Click anywhere on the page, then run this in the Console:

   ```js
   import("/jumpscare.js").then((m) => m.startJumpscare());
   ```

4. Click once more to go fullscreen.

This only works with `npm run dev`. To get out, hold Esc to leave fullscreen, then reload with the browser's reload button and choose "Leave" if it asks. F5 is blocked.

## Changing the video

The video plays from YouTube. To change it, edit `VIDEO_ID` at the top of `jumpscare.js`.

- **Embedding:** the video must allow embedding. If it doesn't, the screen says "Videon kunde inte spelas".
- **Internet:** the demo needs a working connection, and an ad blocker may stop the player from loading.
- **Shape:** the video is cropped to fill the screen, so keep the scary part in the middle.
- **Sound:** it plays at full volume, so check how loud it is before you test it near anyone.

## Adding cursed control buttons

The video has a fake control bar, `.海を見たことがない掃除機`, with the logic in `cursed-controls.js`. It uses Robin's effects: Pause and the progress bar set off the glitch, both volume buttons make it louder and throw each other around, and play, mute and close run away from the mouse. The Entity keeps appearing on its own, faster and faster. The volume starts at 60% so there's room to raise it. The number on screen keeps climbing past 100%, but the real volume stops there.

Each new button needs three things.

**Markup**, in `index.html`, inside `#ペンギンの年金事務所` and after the `우산을_잃어버린_해마` paragraph. If it comes earlier, the message covers it. To put it in the bar, add it inside `.海を見たことがない掃除機` and use the class `пылесос_который_видел_море` instead of writing your own styles.

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
import { player } from "./jumpscare.js";

document.getElementById("stop-button").addEventListener("click", () => {
  player.seekTo(0);
});
```

### Rules your buttons have to work with

These come from `jumpscare.js`:

- **Pause and volume bounce back.** `player` is the [YouTube player](https://developers.google.com/youtube/iframe_api_reference), and `forcePlay` undoes any pause or volume change within half a second. To change the volume, call `forceVolume` from `jumpscare.js`.
- **Mouse only.** All keyboard input is blocked while the jumpscare runs, so `keydown` listeners on your buttons won't help.
- **Right-clicks are blocked.** Use left clicks or hover (`pointerenter`).
- **Clicks work normally.** Every click also forces the sound and fullscreen back on, so you don't have to.

### What we can't block

No website can stop someone closing the tab, pressing Alt+F4, holding Esc, or muting the tab. Don't spend time on those. The goal is for the fake controls to waste their time first.

Everything has only been tested in Chrome, so demo in Chrome. Tapping Esc won't be trapped in other browsers.

## Before a demo

Warn the audience about flashing images and loud sound. A jumpscare can be rough for anyone who is photosensitive.
