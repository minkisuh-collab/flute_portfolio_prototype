/* ============================================================
   Minki — Flutist Portfolio
   GSAP-driven scene logic
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Inject SVG templates into their hosts ---------- */
function cloneTemplate(name) {
  const tpl = document.querySelector(`#svg-templates [data-tpl="${name}"]`);
  return tpl ? tpl.cloneNode(true) : null;
}

document.querySelectorAll("[data-girl]").forEach((host) => {
  const kind = host.dataset.girl; // standing | playing
  const svg = cloneTemplate(kind === "playing" ? "girl-playing" : "girl-standing");
  if (svg) { svg.classList.remove("tpl"); host.appendChild(svg); }
});

document.querySelectorAll("[data-instr]").forEach((host) => {
  const svg = cloneTemplate(host.dataset.instr); // flute | piccolo
  if (svg) {
    svg.classList.remove("tpl");
    host.appendChild(svg);
    // pre-glow a specific key (used in Scene 5)
    const gk = host.dataset.glowKey;
    if (gk) {
      const key = svg.querySelector(`.fkey[data-key="${gk}"]`);
      if (key) key.classList.add("fkey--glow");
    }
  }
});

/* ============================================================
   Scene rail — active dot follows scroll
   ============================================================ */
const railDots = gsap.utils.toArray(".rail-dot");
["#scene1", "#scene2", "#scene4", "#scene5"].forEach((sel, i) => {
  // scene2 section visually contains scene 2 & 3, so we light dots 2 & 3 across it
  ScrollTrigger.create({
    trigger: sel,
    start: "top center",
    end: "bottom center",
    onToggle: (self) => {
      if (!self.isActive) return;
      railDots.forEach((d) => d.classList.remove("is-active"));
      const sceneNum = sel === "#scene2" ? 2 : sel === "#scene4" ? 4 : sel === "#scene5" ? 5 : 1;
      const dot = document.querySelector(`.rail-dot[data-scene="${sceneNum}"]`);
      if (dot) dot.classList.add("is-active");
    },
  });
});

/* ============================================================
   SCENE 1 — entrance + click to advance
   ============================================================ */
const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
introTl
  .from(".scene-1__girl", { x: -80, opacity: 0, duration: 1.1 })
  .from(".hint--topleft", { y: -20, opacity: 0, duration: 0.8 }, "-=0.7")
  .from(".instrument--flute", { x: 80, opacity: 0, duration: 0.9 }, "-=0.6")
  .from(".instrument--piccolo", { x: 80, opacity: 0, duration: 0.9 }, "-=0.6")
  .from(".scroll-cue--center", { opacity: 0, duration: 0.6 }, "-=0.3");

// gentle float on the instruments
gsap.to(".instrument--flute .instr-art", { y: 14, duration: 3, ease: "sine.inOut", repeat: -1, yoyo: true });
gsap.to(".instrument--piccolo .instr-art", { y: -12, duration: 3.4, ease: "sine.inOut", repeat: -1, yoyo: true });

function goTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("pickFlute").addEventListener("click", () => goTo("#scene2"));
document.getElementById("pickPiccolo").addEventListener("click", () => {
  // Prototype focuses on the flute journey; nudge the user toward it.
  const piccolo = document.querySelector(".instrument--piccolo .instr-art");
  gsap.fromTo(piccolo, { rotation: -3 }, { rotation: 3, duration: 0.1, repeat: 5, yoyo: true, transformOrigin: "center", onComplete: () => goTo("#scene2") });
});

/* ============================================================
   SCENE 2 + 3 — pinned zoom-in; reveal glowing first key
   ============================================================ */
const stageScaler = document.getElementById("stageScaler");
const heldFlute = stageScaler.querySelector("[data-held-flute]");
const firstKey = stageScaler.querySelector('.fkey[data-key="1"]');
const capReady = document.getElementById("cap-getready");
const capKey = document.getElementById("cap-firstkey");
const stageCue = document.getElementById("stageScrollCue");

const stageTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#scene2",
    start: "top top",
    end: "+=160%",
    scrub: 1,
    pin: true,
  },
});

stageTl
  // Phase A: lift the flute up toward her lips (getting ready -> closer)
  .to(heldFlute, { y: -58, rotation: -4, transformOrigin: "70% 50%", ease: "none" }, 0)
  // Phase B: zoom in toward hands / first key
  .to(stageScaler, { scale: 1.9, ease: "none" }, 0)
  .to(capReady, { opacity: 0, duration: 0.2 }, 0.35)
  // Phase C: reveal + glow the first key, swap caption
  .add(() => {
    firstKey.classList.add("fkey--glow");
    capKey.style.opacity = 1;
    if (stageCue) stageCue.style.opacity = 0;
  }, 0.55)
  .add(() => {
    // reverse handling: hide glow if user scrolls back up
    if (stageTl.scrollTrigger.progress < 0.55) {
      firstKey.classList.remove("fkey--glow");
      capKey.style.opacity = 0;
      capReady.style.opacity = 1;
      if (stageCue) stageCue.style.opacity = 1;
    }
  }, 0.54);

// Clicking the glowing first key -> Scene 4 (video)
firstKey.addEventListener("click", () => {
  if (!firstKey.classList.contains("fkey--glow")) return;
  goTo("#scene4");
});
firstKey.style.cursor = "pointer";

/* ============================================================
   SCENE 4 — play button (placeholder toggle)
   ============================================================ */
const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", () => {
  playBtn.classList.toggle("is-playing");
  const poster = document.querySelector(".video-poster");
  gsap.to(poster, { opacity: playBtn.classList.contains("is-playing") ? 0.35 : 1, duration: 0.5 });
});

gsap.from("#scene4 .video-wrap", {
  scrollTrigger: { trigger: "#scene4", start: "top 65%" },
  y: 50, opacity: 0, duration: 1, ease: "power3.out",
});

/* ============================================================
   SCENE 5 — flute rises in, second key already glowing; content reveals
   ============================================================ */
gsap.from("#descFlute", {
  scrollTrigger: { trigger: "#scene5", start: "top 75%", end: "top 30%", scrub: 1 },
  y: 160, opacity: 0, ease: "none",
});

gsap.from("#scene5 .desc-head", {
  scrollTrigger: { trigger: "#scene5 .desc-head", start: "top 80%" },
  y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
});

gsap.from("#scene5 .photo", {
  scrollTrigger: { trigger: "#scene5 .desc-grid", start: "top 78%" },
  y: 50, opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out",
});

gsap.from("#scene5 .desc-text p", {
  scrollTrigger: { trigger: "#scene5 .desc-grid", start: "top 70%" },
  y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out",
});

/* Refresh ScrollTrigger once fonts/images settle */
window.addEventListener("load", () => ScrollTrigger.refresh());
