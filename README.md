# MGV Touch AI Wig Try-On

This is a browser-based wig try-on prototype. Upload a photo, choose a wig style, and adjust its size and position over the photo.

## Try different wigs

The four styles are controlled in `script.js` by the `wigs` object:

- `straight` -> `assets/wigs/straight.svg`
- `curly` -> `assets/wigs/curly.svg`
- `bob` -> `assets/wigs/bob.svg`
- `wave` -> `assets/wigs/wave.svg`

To add a real MGV Touch wig, place a transparent PNG or SVG in `assets/wigs/`, update the matching path in `script.js`, and keep the artwork transparent around the face. The buttons in the try-on panel and the cards in the collection use the same style keys, so both stay in sync.

Open `index.html` in a browser to try it. No build step is required.
