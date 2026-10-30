# evil-gubbs

> Abandon all UX, ye who enter here.

Our entry for **Hack for Evil**: a copy of the [ChasHack](https://chashack.se/) front page that lures visitors into a cursed mansion game, then rewards death with a jumpscare video whose controls have joined the enemy.

Built by Gubbs. Maintained under protest.

| Ship inspection | Captain's statement |
|---|---|
| User experience | An ongoing disagreement |
| Documentation | You are standing in it |
| Naming conventions | Several, simultaneously |
| Accessibility | The captain has been summoned to a meeting |
| Technical debt | Legal tender aboard this vessel |

## Table of discontents

- Getting started: below, unless someone moved it.
- How it works: allegedly.
- File locations: disclosed reluctantly.
- Testing: voluntary exposure to consequences.
- Troubleshooting: first we establish blame.

## Chapter IV: So ye have chosen employment

Ye need [Node.js](https://nodejs.org/). A required version has not been recorded in this document. The quartermaster calls this flexibility.

From the project directory, run these commands **in this order**:

```sh
npm install
npm run dev
```

The first command brings the dependencies aboard. The second starts the development server. Neither improves the project morally.

Open the URL printed in the terminal. That URL. The one it printed.

Saving a file updates the page automatically, allowing mistakes to reach ye faster.

**Do not open `index.html` directly.** Use the development server; module loading through `file://` will cause trouble. Double-clicking the file is not a deployment strategy, even if ye do it confidently.

### Step 0, provided here for administrative reasons

Do your work on a branch off `main`, and pull often. Several crew members edit the same files. Git can combine code; it cannot repair relationships.

## Chapter II: An explanation, unfortunately

1. The front-page button requests fullscreen and opens the [mansion game](https://ghostly-trap-mansion.lovable.app/) in an iframe. The visitor stays on our page. Hospitality.
2. When the player dies, the game shows **YOU DIED**, waits a few seconds, then sends:

   ```js
   window.parent.postMessage("jumpscare", "*");
   ```

3. Our page receives the message and starts the video with sound. Customer retention.

**The game is edited in Lovable, not in this repository.** Searching these files for the mansion's game logic is a fine way to spend the rest of the hackathon achieving nothing.

We keep the visitor on one page so the original button click can help with browser audio restrictions. Redirecting to a separate page can lose that benefit and leave the video silent. Playback still depends on browser policy; a click is not a royal exemption from every autoplay rule.

Fullscreen is requested during that original click because it requires user activation. The browser recognises a click. It does not recognise the captain's authority.

## IMPORTANT: READ THIS FIRST

All class, ID and animation names are deliberately cursed.

Consult [DECODER.md](DECODER.md) **before changing them**. It explains what they mean. We buried the treasure, then documented the shovel.

If ye have already renamed everything to `container`, please report to the plank.

## Chapter IX: Where we buried the problems

| File | Contents, regrettably |
|---|---|
| `index.html` | All markup. The video screen is `#ペンギンの年金事務所`, near the bottom, where any reasonable pirate would look. |
| `script.js` | Front-page behaviour, opening the game and listening for its message. The accomplice. |
| `jumpscare.js` | Video playback and attempts to undo pausing, muting and navigation. The main suspect. |
| `styles.css` | All styles. Search for `ペンギンの年金事務所` to find the video screen. Yes, copy and paste it. |
| `cursed-controls.js` | Fake control behaviour. The buttons work; their loyalties differ. |
| `DECODER.md` | What the names actually mean. Evidence against us. |

## Appendix A: Summoning the bastard manually

To test the jumpscare without playing the mansion:

1. Run `npm run dev` and open the page.
2. Open DevTools with **F12 before starting the jumpscare**. The page blocks keyboard shortcuts while it runs.
3. Click anywhere on the page, then run this in the DevTools Console:

   ```js
   import("/jumpscare.js").then((m) => m.startJumpscare());
   ```

4. Click the page once more to request fullscreen.
5. Reflect on the career decisions that brought ye here.

This testing recipe assumes `npm run dev`. Opening the HTML file directly remains wrong, despite the passage of several paragraphs.

### Emergency exit — actual instructions

Hold **Esc** to leave fullscreen. Use the browser's **reload button**, then choose **Leave** if prompted. The page blocks F5 while the jumpscare runs.

You can also close the tab or mute it through the browser. These instructions are intentionally clear.

## Chapter III½: Replacing the ship's screaming man

The video comes from YouTube. Change `VIDEO_ID` at the top of `jumpscare.js`.

The replacement must meet these unreasonable demands:

- **Allow embedding.** Otherwise the screen may say `Videon kunde inte spelas`. The screaming man has declined to board.
- **Have internet available.** This demo needs a working connection. An ad blocker may prevent the player from loading.
- **Keep the important action near the centre.** The video is cropped to fill the screen. The edges have been sacrificed for morale.
- **Be checked for loudness before testing near anyone.** The control flow described below starts at 60% and can increase to 100%. Percentages do not tell ye how loud a particular video will sound.

## Chapter V: Making things worse, professionally

The fake control bar is `.海を見たことがない掃除機`. Its logic lives in `cursed-controls.js` and uses Robin's effects.

| Alleged control | Actual service provided |
|---|---|
| Pause and progress bar | Trigger the glitch |
| Both volume buttons | Increase volume and throw each other around |
| Play, mute and close | Run away from the mouse |
| The Entity | Appears automatically, increasingly often; apparently employed full-time |

Volume starts at **60%**, leaving room for betrayal. The displayed number can climb past **100%**, but the real volume stops at **100%**. The display is lying. This is its most reliable feature.

Each new button needs three things. We tried two. The button became theoretical.

### 1. Give it a body

In `index.html`, place the button inside `#ペンギンの年金事務所`, **after** the `우산을_잃어버린_해마` paragraph. Earlier elements can end up covered by the message.

For a standalone button:

```html
<button class="cursed-button" id="stop-button" type="button">Stäng av</button>
```

For a button **in the existing control bar**, put it inside `.海を見たことがない掃除機` and use `пылесос_который_видел_море` as its class instead. Reuse the bar's styles and skip the standalone positioning below.

### 2. Give it somewhere inconvenient to stand

For the standalone example, add this to `styles.css`:

```css
.cursed-button {
  position: absolute;
  right: 2rem;
  bottom: 2rem;
}
```

### 3. Give it a betrayal

In `cursed-controls.js`, this example restarts the video when someone tries to stop it:

```js
import { player } from "./jumpscare.js";

document.getElementById("stop-button").addEventListener("click", () => {
  player.seekTo(0);
});
```

If `player` is already imported in that file, reuse the import. Do not declare it twice. Even this repository has limits.

## Ship's regulations, enforced selectively

These behaviours come from `jumpscare.js`. Read them before spending an hour fighting your own crew.

- **Pause and volume bounce back.** `player` is the [YouTube player](https://developers.google.com/youtube/iframe_api_reference). `forcePlay` undoes pauses or volume changes within roughly half a second. To change the enforced volume, call `forceVolume` from `jumpscare.js`.
- **Mouse only during the jumpscare.** The page blocks keyboard input, so adding `keydown` listeners to buttons will not help. Ye have built a doorbell underwater.
- **Right-click is blocked.** Use left clicks or hover events such as `pointerenter`.
- **Clicks still reach the controls.** They also trigger attempts to restore sound and fullscreen. Your button does not need its own copy of that behaviour.

## Things beyond the captain's jurisdiction

Closing the tab, browser-level muting, OS window-closing shortcuts and browser fullscreen escape mechanisms remain outside our control. Do not waste the hackathon trying to defeat them.

The goal is for the fake controls to waste the visitor's time first.

Only **Chrome** has been tested, so use Chrome for the demo. Do not assume the same handling of a quick Esc press in other browsers. Browser behaviour outranks pirate law.

## Before a demo — actual warning

**Warn the audience about flashing images, jumpscares and loud sound before starting.** Flashing effects may trigger photosensitive reactions. Check playback volume beforehand and let people opt out.

## Troubleshooting and allocation of blame

| Complaint | Unhelpfully phrased, technically useful answer |
|---|---|
| The page fails when I open the HTML file | Run `npm run dev` and use its printed URL. We have discussed this. |
| The video will not load | Check internet access, embedding permission and whether an ad blocker is interfering. The haunting has dependencies. |
| My volume change gets reversed | Use `forceVolume`; the playback enforcement is undoing direct changes. You are arguing with another function. |
| My keyboard handler does nothing | The jumpscare blocks keyboard input. See the regulations ye skipped. |
| My button is hidden | Check its position in the markup relative to `우산을_잃어버린_해마`. The paragraph has seniority. |
| I cannot find the game code | It is in Lovable. This is a different boat. |
| The names make no sense | Open `DECODER.md`. Naming things was a team incident. |

<details>
<summary>Click here for the short version</summary>

```sh
npm install
npm run dev
```

Ye could have started here. We chose not to mention that.

</details>

---

**End of documentation. Further confusion is a community contribution.**
