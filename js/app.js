// BATERDENE.EXE — UI, scroll, хэл, дуу, нууц хэсэг
import {
  taglines,
  traits,
  interests,
  values,
  text,
  projects,
  record,
  logos,
  voices,
  roadmap,
  docs,
  SECRET_CODE,
  secrets,
  photos,
} from "./data.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const mobile =
  matchMedia("(pointer: coarse)").matches || window.innerWidth < 720;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(k));
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );
// in English the key and the word are the same, so drop the duplicate subtitle
const labelsFor = (lg) => {
  const dedupe = (arr) => arr.map((x) => ({ ...x, t: lg === "en" ? "" : x.t }));
  return {
    traits: dedupe(traits[lg]),
    values: dedupe(values[lg]),
    interests: interests[lg],
  };
};
const L = (v) =>
  v && typeof v === "object" && !Array.isArray(v) && (v.mn || v.en)
    ? (v[lang] ?? v.mn)
    : v;

if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);

let lang = store.get("bbe-lang") === "en" ? "en" : "mn";
let found = store.get("bbe-frags") || [];
let unlocked = !!store.get("bbe-unlocked");

/* ================= RENDER ================= */
const words = (s) =>
  esc(s)
    .split(" ")
    .map((w, i) => `<span style="--i:${i}">${w}</span>`)
    .join(" ");
const frag = (i) =>
  `<button class="frag" data-frag="${i}" aria-label="◆">◆</button>`;

const photo = (i, cls = "") => {
  const ph = photos[i];
  return `<figure class="photo ${cls}" data-photo="${i}" role="button" tabindex="0" aria-label="${esc(L(ph.caption))}">
    <img src="${ph.src}" alt="${esc(L(ph.caption))}" loading="lazy" style="object-position:${ph.pos}" />
    <figcaption><span class="mono">${esc(ph.tag)}</span>${esc(L(ph.caption))}</figcaption>
  </figure>`;
};
const ghost = (kicker) =>
  `<span class="ghost-num" aria-hidden="true">${esc(kicker.slice(0, 2))}</span>`;

function chapter(c, extra = "", fragIdx = null) {
  return `<div class="ch reveal">
    ${ghost(c.kicker)}
    ${c.obj ? `<p class="obj mono">${esc(c.obj)}</p>` : ""}
    <p class="kicker mono" data-scramble>${esc(c.kicker)}</p>
    <h2 class="statement">${words(c.quote)}</h2>
    ${(c.body || []).map((p) => `<p class="body-p">${esc(p)}</p>`).join("")}
    ${extra}
    ${c.outro ? `<p class="outro">${esc(c.outro)}</p>` : ""}
    ${fragIdx != null ? frag(fragIdx) : ""}
  </div>`;
}

function render() {
  const T = text[lang];
  document.documentElement.lang = lang;
  $("#langBtn").textContent = lang === "mn" ? "EN" : "MN";
  $("#enterSound span").textContent = lang === "mn" ? "Нэвтрэх" : "Enter";
  $("#enterSound small").textContent =
    lang === "mn" ? "🎧 ДУУТАЙ" : "🎧 WITH SOUND";
  $("#enterSilent").textContent =
    lang === "mn" ? "дуугүй нэвтрэх" : "enter silently";

  $$("[data-t]").forEach((el) => {
    const v = el.dataset.t.split(".").reduce((o, k) => o?.[k], T);
    el.textContent = v || "";
    el.hidden = !v;
  });

  $("#who").innerHTML = chapter(
    T.who,
    `${photo(0, "polaroid")}<div class="traits" role="list">${traits[lang]
      .map(
        (t, i) =>
          `<button class="trait-chip mono" data-trait="${i}" role="listitem">${t.k}${lang === "mn" ? `<span>${esc(t.t)}</span>` : ""}</button>`,
      )
      .join("")}</div><p class="mono dim">${esc(T.who.traitsHint)}</p>`,
    0,
  );

  $("#mind").innerHTML = chapter(
    T.mind,
    `<div class="orbit-chips">${interests[lang]
      .map(
        (x, i) =>
          `<button data-interest="${i}" style="--c:${x.color}"><i>${esc(x.icon)}</i>${esc(x.title)}</button>`,
      )
      .join("")}</div><p class="mono dim">${esc(T.mind.hint)}</p>`,
  );

  $("#builder").innerHTML =
    chapter(
      T.builder,
      `<p class="motto">${esc(T.builder.motto)}</p><p class="mono dim">${esc(T.builder.hint)}</p>`,
    ) +
    `<div class="create-stage" aria-hidden="true"></div>
    <div class="proj-list">${projects
      .map(
        (
          p,
          i,
        ) => `<button class="proj-btn" data-proj="${i}" style="--c:${p.color}">
        <img src="${p.img}" alt="" loading="lazy" class="${p.logo ? "logo" : ""}" />
        <span><small>${p.code} · ${esc(p.tag)}</small><b>${esc(L(p.title))}</b></span><span class="arr">→</span></button>`,
      )
      .join("")}</div>`;

  $("#quiet").innerHTML = chapter(T.quiet, "", 1);

  $("#values").innerHTML = chapter(
    T.values,
    `<div class="values">${values[lang]
      .map(
        (v, i) =>
          `<button class="value" data-value="${i}"><span class="mono">0${i + 1} · ${v.k}</span><b>${esc(v.t)}</b><p>${esc(v.d)}</p></button>`,
      )
      .join("")}</div>${photo(2, "wide")}`,
  );

  const R = record;
  const st = R.study[lang];
  const wk = R.work[lang];
  $("#record").innerHTML = `<div class="ch reveal record">
    ${ghost(T.record.kicker)}
    <p class="kicker mono" data-scramble>${esc(T.record.kicker)}</p>
    <h2 class="statement">${words(T.record.quote)}</h2>
    <p class="body-p">${esc(T.record.lead)}</p>
    <div class="tabs mono" role="tablist">${R.tabs[lang]
      .map(
        (t, i) =>
          `<button role="tab" data-tab="${i}" aria-selected="${i === 0}">${esc(t)}</button>`,
      )
      .join("")}</div>
    <div class="tab-panels">
      <div class="tab-panel on" data-panel="0">
        ${photo(1, "grad")}
        <p class="rec-school">${esc(st.school)}<span class="mono">${st.years}</span></p>
        <div class="gpa-grid">${st.gpa
          .map(
            ([v, l], i) =>
              `<div class="gpa ${i === 0 ? "big" : ""}"><b class="count" data-to="${v}" data-dec="${(v.split(".")[1] || "").length}">${v}</b><span>${esc(l)}</span></div>`,
          )
          .join("")}</div>
        <p class="rec-note">${esc(st.note)}</p>
      </div>
      <div class="tab-panel" data-panel="1">
        <ol class="wins">${R.wins[lang]
          .map(
            ([y, t, d]) =>
              `<li><span class="mono">${y}</span><b>${esc(t)}</b><p>${esc(d)}</p></li>`,
          )
          .join("")}</ol>
      </div>
      <div class="tab-panel" data-panel="2">
        <div class="work"><b>${esc(wk.role)}</b><span class="mono">${esc(wk.when)}</span><p>${esc(wk.text)}</p></div>
        <div class="logo-belt"><div class="belt-track">${(() => {
          const b = logos
            .map(
              ([f, n]) =>
                `<div class="belt-item"><img src="assets/images/logos/${f}.png" alt="" loading="lazy" />${n}</div>`,
            )
            .join("");
          return b + b;
        })()}</div></div>
      </div>
      <div class="tab-panel" data-panel="3">
        <div class="voices">${voices
          .map(
            (
              v,
            ) => `<figure class="voice"><blockquote>${esc(v.quote)}</blockquote>
            <figcaption class="who-v"><img src="${v.img}" alt="" loading="lazy" /><div><b>${esc(v.name)}</b><span>${esc(v.role)}</span></div></figcaption></figure>`,
          )
          .join("")}</div>
        <p class="mono dim">${esc(T.record.voicesHint)}</p>
      </div>
      <div class="tab-panel" data-panel="4">
        <div class="life">${R.life[lang].map(([t, d]) => `<div><b>${esc(t)}</b><p>${esc(d)}</p></div>`).join("")}</div>
      </div>
    </div>
    <div class="doc-row">${docs.map((d) => `<button data-doc="${d.id}">${esc(L(d.label))} ↗</button>`).join("")}</div>
    ${frag(2)}
  </div>`;

  $("#path").innerHTML = chapter(
    T.path,
    `<div class="legend mono"><span class="l-done">${esc(T.path.done)}</span><span class="l-plan">${esc(T.path.plan)}</span></div>
    <ol class="roadmap">${roadmap[lang]
      .map(
        (r) =>
          `<li class="${r.done ? "done" : "plan"}"><span class="y">${r.year}</span><b>${esc(r.title)}</b></li>`,
      )
      .join("")}</ol>`,
    3,
  );

  const B = T.becoming;
  $("#becoming").innerHTML = `<div class="ch reveal">
    ${ghost(B.kicker)}
    <p class="kicker mono" data-scramble>${esc(B.kicker)}</p>
    <h2 class="statement">${words(B.quote)}</h2>
    ${B.body.map((p) => `<p class="body-p">${esc(p)}</p>`).join("")}
    <p class="status mono">SYSTEM STATUS: <b>STILL BECOMING</b><i class="caret"></i></p>
    <p class="outro">${esc(B.end)}</p>
    <p class="kicker mono contact-k">${esc(B.contact)}</p>
    <p class="body-p invite">${esc(B.invite)}</p>
    <div class="contact-grid">
      <a class="c-link" href="mailto:baterdenebatbayr321@gmail.com"><span class="mono">MAIL</span><b>baterdenebatbayr321@gmail.com</b></a>
      <a class="c-link" href="tel:+97669989939"><span class="mono">TEL</span><b>+976 6998-9939</b></a>
      <a class="c-link" href="https://github.com/Bat-BBE" target="_blank" rel="noopener"><span class="mono">GITHUB</span><b>Bat-BBE</b></a>
      <a class="c-link" href="https://www.facebook.com/share/1H83tmzzs4/?mibextid=wwXIfr" target="_blank" rel="noopener"><span class="mono">FACEBOOK</span><b>Б. Бат-Эрдэнэ</b></a>
    </div>
    <footer class="foot mono">© 2026 Б.Бат-Эрдэнэ · <a href="classic.html">classic view</a> · <button id="replayBtn">↺ reboot</button></footer>
  </div>`;

  // vault in current language
  if (unlocked) showSecrets(false);

  paintFrags();
  bindDynamic();
  observeReveals();
  world?.setLabels?.(labelsFor(lang));
  requestAnimationFrame(() => {
    measure();
    onScroll();
  });
}

const scenes = $$(".scene");
$("#rail").innerHTML = scenes
  .map(
    (s, i) =>
      `<button data-goto="${i}" aria-label="${s.dataset.name}"><span>${String(i).padStart(2, "0")} ${s.dataset.name}</span></button>`,
  )
  .join("");
$("#menuList").innerHTML = scenes
  .map(
    (s, i) =>
      `<li><button data-goto="${i}" style="transition-delay:${0.04 + i * 0.035}s"><small>${String(i).padStart(2, "0")}</small>${s.dataset.name}</button></li>`,
  )
  .join("");

/* ================= SOUND (WebAudio, файлгүй) ================= */
const sound = {
  ctx: null,
  on: false,
  init() {
    if (this.ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    this.filter = ctx.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency.value = 420;
    this.filter.Q.value = 2;
    this.filter.connect(this.master);
    // calm pad (A minor add9)
    [55, 82.41, 110, 130.81, 246.94].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i < 2 ? "sine" : "triangle";
      o.frequency.value = f;
      o.detune.value = (Math.random() - 0.5) * 10;
      const g = ctx.createGain();
      g.gain.value = [0.22, 0.12, 0.08, 0.05, 0.025][i];
      o.connect(g).connect(this.filter);
      o.start();
    });
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    lfo.frequency.value = 0.05;
    lg.gain.value = 180;
    lfo.connect(lg).connect(this.filter.frequency);
    lfo.start();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const n = ctx.createBufferSource();
    n.buffer = buf;
    n.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1200;
    bp.Q.value = 0.7;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.008;
    n.connect(bp).connect(this.noiseGain).connect(this.master);
    n.start();
  },
  set(on) {
    this.on = on;
    document.body.classList.toggle("sound-on", on);
    if (on) this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.master.gain.setTargetAtTime(on ? 0.3 : 0, this.ctx.currentTime, 0.8);
  },
  motion(v) {
    if (!this.on || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.filter.frequency.setTargetAtTime(400 + Math.min(v, 3) * 700, t, 0.2);
    this.noiseGain.gain.setTargetAtTime(0.008 + Math.min(v, 3) * 0.03, t, 0.2);
  },
  blip(freq = 880, dur = 0.12, type = "sine", vol = 0.1) {
    if (!this.on || !this.ctx) return;
    const ctx = this.ctx,
      t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 1.4, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.02);
  },
  chord(freqs, gap = 0.08) {
    freqs.forEach((f, i) =>
      setTimeout(() => this.blip(f, 1.1, "sine", 0.07), i * gap * 1000),
    );
  },
};
const buzz = (ms = 12) => navigator.vibrate && navigator.vibrate(ms);

/* ================= WORLD ================= */
let world = null;
const worldReady = import("./world.js")
  .then(({ createWorld }) => {
    world = createWorld($("#world"), {
      projects,
      ...labelsFor(lang),
      photos,
      roadmap: roadmap.mn,
      mobile,
      reduced,
      callbacks: {
        onCoreTap() {
          world.burst();
          sound.chord([440, 554, 659]);
          buzz(25);
          if (current === 0) setTimeout(() => goTo(1), 450);
        },
        onCardTap(i) {
          sound.blip(660);
          buzz();
          openProject(i);
        },
        onTraitTap(i) {
          showTrait(i);
        },
        onInterestTap(i) {
          showInterest(i);
        },
        onValueTap(i) {
          showValue(i);
        },
        onPhotoTap(i) {
          openPhoto(i);
        },
        onHover(on) {
          cursor.classList.toggle("hot", on);
          document.body.style.cursor = on ? "pointer" : "";
          if (on) sound.blip(1200, 0.06, "sine", 0.03);
        },
      },
    });
    if (!world) document.body.classList.add("no-webgl");
    else if (unlocked) world.unlock(true);
  })
  .catch((e) => {
    console.warn("WebGL world failed:", e);
    document.body.classList.add("no-webgl");
  });

/* ================= BOOT ================= */
const boot = $("#boot");
const quick = sessionStorage.getItem("booted") === "1";
const lines = [
  ["> BATERDENE.EXE  v.today", "hl"],
  ["> LOADING IDENTITY ............ ", "OK"],
  ["> MOUNTING MEMORIES ........... ", "OK"],
  ["> TUNING THE SILENCE .......... ", "OK"],
  ["> SYSTEM STATUS: STILL BECOMING", "hl"],
];
(async function runBoot() {
  const step = quick || reduced ? 60 : 260;
  for (let i = 0; i < lines.length; i++) {
    const [txt, kind] = lines[i];
    const row = document.createElement("div");
    row.innerHTML =
      kind === "OK"
        ? `${txt}<span class="ok">OK</span>`
        : `<span class="hl">${txt}</span>`;
    $("#bootLog").appendChild(row);
    $("#bootBar").style.width = ((i + 1) / lines.length) * 85 + "%";
    await wait(step + Math.random() * step * 0.5);
  }
  await Promise.race([
    Promise.all([worldReady, document.fonts?.ready]),
    wait(6000),
  ]);
  $("#bootBar").style.width = "100%";
  boot.classList.add("ready");
})();
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function enter(withSound) {
  if (document.body.classList.contains("entered")) return;
  try {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      DeviceOrientationEvent.requestPermission
    ) {
      DeviceOrientationEvent.requestPermission().catch(() => {});
    }
  } catch {}
  sound.set(withSound);
  sound.chord([220, 330, 440], 0.14);
  buzz(15);
  sessionStorage.setItem("booted", "1");
  boot.classList.add("gone");
  document.body.classList.remove("is-booting");
  document.body.classList.add("entered");
  world?.start();
  measure();
  onScroll();
  setTimeout(
    () =>
      $$("#awaken .reveal").forEach((el, i) =>
        setTimeout(() => el.classList.add("in"), i * 220),
      ),
    700,
  );
  setTimeout(
    () =>
      $$(".hero-title span, #awaken .kicker").forEach((el) =>
        scramble(el, 1300),
      ),
    850,
  );
}
$("#enterSound").addEventListener("click", () => enter(true));
$("#enterSilent").addEventListener("click", () => enter(false));
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    boot.classList.contains("ready") &&
    !document.body.classList.contains("entered")
  )
    enter(false);
});

// hero tagline cycler
{
  let k = 0;
  const el = $("#cycler");
  const show = () => {
    el.classList.remove("swap");
    void el.offsetWidth;
    el.textContent = taglines[k++ % taglines.length];
    el.classList.add("swap");
  };
  show();
  setInterval(show, 3200);
}

/* ================= SCROLL → CAMERA ================= */
let tops = [];
let current = -1;
function measure() {
  tops = scenes.map((s) => s.getBoundingClientRect().top + window.scrollY);
  tops.push(document.documentElement.scrollHeight);
}
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
let lastY = window.scrollY;
let lastT = performance.now();
function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const probe = y + vh * 0.2;
  let i = 0;
  while (i < scenes.length - 1 && probe >= tops[i + 1]) i++;
  const span = tops[i + 1] - tops[i];
  const f = span > 0 ? (probe - tops[i]) / span : 0;
  // hold on each object while reading, then fly to the next one
  const hold = span > vh * 1.6 ? 0.55 : 0.3;
  world?.setProgress(Math.min(i + smooth(hold, 1, f), scenes.length - 1));

  const now = performance.now();
  const v = (y - lastY) / vh / Math.max((now - lastT) / 1000, 0.016);
  lastY = y;
  lastT = now;
  world?.kick(Math.max(-0.3, Math.min(0.3, v * 0.03)));
  sound.motion(Math.abs(v));

  const mid = y + vh * 0.5;
  let c = 0;
  while (c < scenes.length - 1 && mid >= tops[c + 1]) c++;
  if (c !== current) {
    current = c;
    $("#chapNum").textContent = String(c).padStart(2, "0");
    $("#chapName").textContent = scenes[c].dataset.name;
    $$("#rail button").forEach((b, k) => b.classList.toggle("on", k === c));
    $$("#menuList button").forEach((b, k) =>
      b.classList.toggle("active", k === c),
    );
    if (document.body.classList.contains("entered"))
      sound.blip(300 + c * 40, 0.3, "sine", 0.04);
  }
  const max = document.documentElement.scrollHeight - vh;
  $("#progressLine").style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", () => {
  measure();
  onScroll();
});
window.addEventListener("load", measure);

function goTo(i) {
  measure();
  window.scrollTo({
    top: tops[i] + (i === 0 ? 0 : 2),
    behavior: reduced ? "auto" : "smooth",
  });
  sound.blip(520, 0.15);
}

/* ================= GLOBAL CLICKS ================= */
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-goto]");
  if (g) {
    e.preventDefault();
    document.body.classList.remove("menu-open");
    goTo(+g.dataset.goto);
  }
  const d = e.target.closest("[data-doc]");
  if (d) {
    const doc = docs.find((x) => x.id === d.dataset.doc);
    if (doc) openDoc(doc.file, L(doc.label));
  }
  const pb = e.target.closest("[data-proj]");
  if (pb) openProject(+pb.dataset.proj);
  const tr = e.target.closest("[data-trait]");
  if (tr) showTrait(+tr.dataset.trait);
  const it = e.target.closest("[data-interest]");
  if (it) showInterest(+it.dataset.interest);
  const va = e.target.closest("[data-value]");
  if (va) showValue(+va.dataset.value);
  const ph = e.target.closest("[data-photo]");
  if (ph) openPhoto(+ph.dataset.photo);
  if (e.target.closest("#lightbox")) closePhoto();
  const tab = e.target.closest("[data-tab]");
  if (tab) selectTab(+tab.dataset.tab);
  const fr = e.target.closest(".frag");
  if (fr) collect(+fr.dataset.frag);
  if (e.target.closest("#replayBtn")) {
    sessionStorage.removeItem("booted");
    window.scrollTo(0, 0);
    location.reload();
  }
});

$("#menuBtn").addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
  sound.blip(document.body.classList.contains("menu-open") ? 700 : 500, 0.1);
});
$("#soundBtn").addEventListener("click", () => sound.set(!sound.on));
$("#langBtn").addEventListener("click", () => {
  lang = lang === "mn" ? "en" : "mn";
  store.set("bbe-lang", lang);
  const y = window.scrollY;
  const at = current;
  render();
  // keep reader on the same chapter after the text length changes
  requestAnimationFrame(() => {
    measure();
    window.scrollTo(0, at > 0 ? tops[at] + 2 : y);
  });
  sound.blip(880, 0.1);
});

/* ================= REVEAL + COUNTERS ================= */
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-scramble]", e.target).forEach((k) => scramble(k));
      $$(".tab-panel.on .count", e.target).forEach(countUp);
      io.unobserve(e.target);
    }),
  { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
);
function observeReveals() {
  $$(".reveal").forEach((el) => {
    if (el.closest("#awaken")) return;
    if (el.classList.contains("in")) return;
    io.observe(el);
  });
}
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 1;
  const to = parseFloat(el.dataset.to);
  const dec = +(el.dataset.dec || 0);
  const t0 = performance.now();
  const dur = reduced ? 1 : 1400;
  (function tick(now) {
    const k = Math.min(1, (now - t0) / dur);
    el.textContent = (to * (1 - Math.pow(1 - k, 4))).toFixed(dec);
    if (k < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ================= RECORD TABS ================= */
function selectTab(i) {
  $$("#record [data-tab]").forEach((b, k) =>
    b.setAttribute("aria-selected", k === i),
  );
  $$("#record .tab-panel").forEach((p, k) => p.classList.toggle("on", k === i));
  $$("#record .tab-panel.on .count").forEach(countUp);
  $(`#record [data-tab="${i}"]`)?.scrollIntoView({
    block: "nearest",
    inline: "center",
    behavior: "smooth",
  });
  sound.blip(600 + i * 60, 0.08);
  buzz(8);
  measure();
}

/* ================= INFO CARD (every object tells something) ================= */
let infoT;
function showInfo(key, title, desc, color, pitch = 520) {
  const card = $("#traitCard");
  card.innerHTML = `<span style="color:${color || "var(--cyan)"}">${esc(key)}</span><b>${esc(title)}</b><p>${esc(desc)}</p>`;
  card.style.borderColor = color || "";
  card.classList.remove("show");
  void card.offsetWidth;
  card.classList.add("show");
  sound.blip(pitch, 0.4, "sine", 0.06);
  buzz(10);
  clearTimeout(infoT);
  infoT = setTimeout(() => card.classList.remove("show"), 4200);
}
function showTrait(i) {
  const t = traits[lang][i];
  world?.focus?.("trait", i);
  showInfo(t.k, t.t || t.k, t.d, null, 520 + i * 90);
}
function showInterest(i) {
  const x = interests[lang][i];
  world?.focus?.("interest", i);
  showInfo(`MIND · 0${i + 1}`, x.title, x.d, x.color, 440 + i * 80);
}
function showValue(i) {
  const v = values[lang][i];
  world?.focus?.("value", i);
  showInfo(`0${i + 1} · ${v.k}`, v.t, v.d, null, 392 + i * 70);
}

/* ================= TEXT SCRAMBLE (decode effect) ================= */
const GLYPHS = "▓▒░<>/\\_—=+*01ABCDEFXZ";
function scramble(el, dur = 900) {
  if (reduced || el.dataset.scrambled) return;
  el.dataset.scrambled = 1;
  const final = el.textContent;
  const t0 = performance.now();
  (function tick(now) {
    const k = Math.min(1, (now - t0) / dur);
    const n = Math.floor(final.length * k);
    let out = final.slice(0, n);
    for (let i = n; i < final.length; i++)
      out +=
        final[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    el.textContent = out;
    if (k < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  })(t0);
}

/* ================= DESKTOP 3D TILT ================= */
function bindDynamic() {
  if (mobile || reduced) return;
  $$(".value, .gpa, .trait-chip, .c-link, .orbit-chips button").forEach(
    (el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(4px)`;
      });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    },
  );
}

/* ================= CURSOR ================= */
const cursor = $(".cursor");
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let cx = innerWidth / 2,
    cy = innerHeight / 2,
    tx = cx,
    ty = cy;
  addEventListener("pointermove", (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  (function loop() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest("a, button, input")) cursor.classList.add("hot");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest("a, button, input")) cursor.classList.remove("hot");
  });
}

/* ================= PROJECT SHEET ================= */
const sheet = $("#sheet");
let sheetProject = null;
function openProject(i) {
  const p = projects[i];
  sheetProject = p;
  const img = $("#sheetImg");
  img.src = p.img;
  img.className = p.logo ? "logo" : "";
  img.alt = L(p.title);
  $("#sheetCode").textContent = `${p.code} · ${p.tag}`;
  $("#sheetTitle").textContent = L(p.title);
  $("#sheetBadges").innerHTML = p.badges
    .map((b) => `<span>${esc(b)}</span>`)
    .join("");
  $("#sheetBadges").style.setProperty("--c", p.color);
  $("#sheetDesc").textContent = L(p.desc);
  $("#sheetStack").innerHTML = p.stack
    .map((s) => `<span>${esc(s)}</span>`)
    .join("");
  $("#sheetDoc").hidden = !p.doc;
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
  document.body.classList.add("sheet-open");
  $(".sheet-card", sheet).scrollTop = 0;
}
function closeSheet() {
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
  document.body.classList.remove("sheet-open");
}
sheet.addEventListener(
  "click",
  (e) => e.target.closest("[data-close]") && closeSheet(),
);
$("#sheetDoc").addEventListener(
  "click",
  () => sheetProject?.doc && openDoc(sheetProject.doc, sheetProject.short),
);
{
  // swipe down to close
  let sy = null;
  const card = $(".sheet-card");
  card.addEventListener(
    "touchstart",
    (e) => (sy = card.scrollTop <= 0 ? e.touches[0].clientY : null),
    { passive: true },
  );
  card.addEventListener(
    "touchmove",
    (e) => {
      if (sy == null) return;
      const dy = e.touches[0].clientY - sy;
      if (dy > 0) card.style.transform = `translateY(${dy}px)`;
    },
    { passive: true },
  );
  card.addEventListener("touchend", (e) => {
    if (sy == null) return;
    const dy = e.changedTouches[0].clientY - sy;
    card.style.transform = "";
    if (dy > 110) closeSheet();
    sy = null;
  });
}

/* ================= PHOTO LIGHTBOX ================= */
const lightbox = $("#lightbox");
function openPhoto(i) {
  const ph = photos[i];
  $("#lbImg").src = ph.src;
  $("#lbImg").alt = L(ph.caption);
  $("#lbCap").innerHTML = `<span class="mono">${esc(ph.tag)}</span>${esc(L(ph.caption))}`;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  world?.focus?.("photo", i);
  sound.chord([392, 523], 0.08);
  buzz(10);
}
function closePhoto() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePhoto();
  if (e.key === "Enter" && e.target.matches?.("[data-photo]")) openPhoto(+e.target.dataset.photo);
});

/* ================= PDF ================= */
const pdf = $("#pdf");
function openDoc(file, label) {
  // Утсан дээр iframe доторх PDF муу ажилладаг тул шинэ табд нээнэ.
  if (mobile) {
    window.open(file, "_blank", "noopener");
    return;
  }
  $("#pdfTitle").textContent = label + " — " + file.split("/").pop();
  $("#pdfFrame").src = file;
  $("#pdfOpen").href = file;
  pdf.classList.add("open");
  pdf.setAttribute("aria-hidden", "false");
}
function closePdf() {
  pdf.classList.remove("open");
  pdf.setAttribute("aria-hidden", "true");
  setTimeout(() => ($("#pdfFrame").src = "about:blank"), 300);
}
pdf.addEventListener("click", (e) => {
  if (e.target === pdf || e.target.closest("[data-close]")) closePdf();
});
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeSheet();
  closePdf();
  document.body.classList.remove("menu-open");
});

/* ================= FX ================= */
function flash() {
  const f = $(".fx-flash");
  f.classList.remove("go");
  void f.offsetWidth;
  f.classList.add("go");
}
let toastT;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ================= SECRET: fragments + vault ================= */
const slots = $$("#fragSlots i");
const codeInputs = $$(".code-boxes input");
function paintFrags() {
  slots.forEach((s, i) => {
    const on = found.includes(i);
    s.classList.toggle("on", on);
    s.textContent = on ? SECRET_CODE[i] : "";
  });
  $$(".frag").forEach((f) =>
    f.classList.toggle("got", found.includes(+f.dataset.frag)),
  );
}
function collect(i) {
  if (found.includes(i)) return;
  found.push(i);
  store.set("bbe-frags", found);
  paintFrags();
  sound.chord([880, 1320], 0.06);
  buzz([15, 40, 15]);
  world?.kick(0.5);
  const en = lang === "en";
  toast(
    found.length < 4
      ? `◆ ${en ? "Fragment found" : "Хэлтэрхий олдлоо"} · ${found.length}/4`
      : en
        ? "◆ 4/4 — code complete. Go to UNKNOWN"
        : "◆ 4/4 — Код бүрэн! UNKNOWN руу оч",
  );
}
codeInputs.forEach((inp, i) => {
  inp.addEventListener("input", () => {
    inp.value = inp.value.replace(/\D/g, "").slice(-1);
    if (inp.value && codeInputs[i + 1]) codeInputs[i + 1].focus();
    sound.blip(500 + i * 120, 0.06);
    if (codeInputs.every((c) => c.value)) $("#codeForm").requestSubmit();
  });
  inp.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !inp.value && codeInputs[i - 1])
      codeInputs[i - 1].focus();
  });
  inp.addEventListener("paste", (e) => {
    const t = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!t) return;
    e.preventDefault();
    codeInputs.forEach((c, k) => (c.value = t[k] || ""));
    if (t.length === 4) $("#codeForm").requestSubmit();
  });
});
let tries = 0;
$("#codeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const code = codeInputs.map((c) => c.value).join("");
  if (code === SECRET_CODE) {
    unlocked = true;
    store.set("bbe-unlocked", true);
    world?.unlock();
    flash();
    sound.chord([261.6, 329.6, 392, 523.3, 659.3], 0.12);
    buzz([30, 60, 30, 60, 120]);
    showSecrets(true);
    toast(
      lang === "en"
        ? "✦ UNLOCKED — the world changed colour"
        : "✦ UNLOCKED — ертөнц өнгөө өөрчиллөө",
    );
  } else {
    tries++;
    const f = $("#codeForm");
    f.classList.remove("shake");
    void f.offsetWidth;
    f.classList.add("shake");
    $("#vaultStatus").textContent =
      `ACCESS DENIED · ${tries}${tries >= 2 ? " · ◆ ?" : ""}`;
    sound.blip(140, 0.3, "sawtooth", 0.06);
    buzz([40, 40, 40]);
    codeInputs.forEach((c) => (c.value = ""));
    codeInputs[0].focus();
  }
});
function showSecrets(animate) {
  document.body.classList.add("unlocked");
  const status = $("#vaultStatus");
  status.textContent = "ACCESS GRANTED · WELCOME, EXPLORER";
  status.classList.add("ok");
  codeInputs.forEach((c, i) => {
    c.value = SECRET_CODE[i];
    c.disabled = true;
  });
  const out = $("#secretOut");
  out.hidden = false;
  out.innerHTML = secrets[lang]
    .map(
      (s, i) =>
        `<p style="animation-delay:${animate ? 0.4 + i * 0.35 : 0}s">${esc(s)}</p>`,
    )
    .join("");
  measure();
}

// desktop easter egg: type "bbe" to light up the hidden fragments
let typed = "";
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input")) return;
  typed = (typed + e.key.toLowerCase()).slice(-3);
  if (typed === "bbe") {
    document.body.classList.add("reveal-frags");
    toast("👀 ◆ ◆ ◆ ◆");
    sound.chord([660, 880, 1100]);
  }
});

render();
measure();
onScroll();
