# Minki — Flutist Portfolio (Prototype)

An interactive, scroll-driven portfolio built for a boarding-school application.
Pure **HTML / CSS / JavaScript** with **GSAP + ScrollTrigger** (loaded via CDN).

## Run it

From this folder:

```bash
python3 -m http.server 5173
```

Then open <http://localhost:5173> in a browser.
(Any static server works — it must be served over `http://`, not opened as a `file://` path, so GSAP loads from the CDN.)

## The five scenes

1. **Landing** — the girl on the left, a floating flute and piccolo on the right, and the prompt *"Click on either flute or piccolo."* Click **Flute** (or scroll) to begin.
2. **Getting ready** — she holds the flute, not yet at her lips.
3. **Zoom in** — scrolling pins the scene and zooms toward her hands; the **first key glows gold**. Click it.
4. **Video** — a 16:9 video frame with a play button. (Placeholder poster for now.)
5. **Descriptions** — scrolling lifts a large flute into view with the **second key glowing**, followed by two photos and the written description.

## Swapping in real content

Everything visual is a placeholder you can replace:

- **Video (Scene 4):** in `index.html`, replace the `.video-frame` block's poster/play button with a real `<video controls poster="...">` or a YouTube `<iframe>`.
- **Photos (Scene 5):** the two `.photo` blocks use CSS gradients. Replace `<div class="photo-fill ...">` with `<img src="assets/your-photo.jpg" alt="...">`.
- **Girl & instrument art:** the illustrations are inline SVGs inside `#svg-templates` in `index.html`. Replace them with your own SVG/PNG if you have polished artwork.
- **Copy:** all headings and paragraphs live directly in `index.html`.

## File structure

```
minki portfolio/
├── index.html      # markup + inline SVG illustrations
├── css/styles.css  # all styling (shade-themed, professional fonts)
├── js/main.js      # GSAP scene animations + click navigation
└── README.md
```

Fonts: *Cormorant Garamond* (serif headings) and *Jost* (sans body), via Google Fonts.
