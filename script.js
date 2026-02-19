const tierClassMap = { S: "tier-s", A: "tier-a", B: "tier-b" };
const tierOrder = ["S", "A", "B"];
const progressionLevels = ["70", "60", "50"];
const progressionSlots = ["armor", "gloves", "kit1", "kit2"];
const collator = new Intl.Collator("id", { sensitivity: "base" });
const roleTagOrder = ["DPS", "Sub DPS", "Support", "Sustain", "Vanguard", "Flex"];

const skillTypeMap = {
  "Basic Attack": "Serangan Dasar",
  "Combo Skill": "Skill Combo",
  "Active Skill": "Skill Aktif",
  Talent: "Talenta",
  Ultimate: "Ultimate",
};

const gearTypeMap = { armor: "Armor", gloves: "Gloves", kit: "Kit" };
const slotTypeMap = { armor: "Armor", gloves: "Gloves", kit1: "Kit Slot 1", kit2: "Kit Slot 2" };
const teamMemberIconOverrides = {
  Akekuri: "assets/icons/akekuri.png",
  Wulfgard: "https://endfieldtools.dev/assets/images/endfield/charicon/icon_chr_0006_wolfgd.png",
};

const BGM_KEY = "endfield_web_bgm_v1";
const BGM_SOURCES = [
  "https://154976-decisions.mp3.pm/song/245238323-arknights-endfield-lofi/",
  "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/46/09/6046093f-66c3-712a-cefd-959384fd3d3c/mzaf_12371733613275990005.plus.aac.ep.m4a",
];
const GACHA_BGM_SOURCES = [
  "https://29571222-arknights-endfield.mp3.pm/song/246146600-headhunt/",
  "https://154976-decisions.mp3.pm/song/245238323-arknights-endfield-lofi/",
  "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/46/09/6046093f-66c3-712a-cefd-959384fd3d3c/mzaf_12371733613275990005.plus.aac.ep.m4a",
];
const GACHA_STATE_KEY = "endfield_web_gacha_state_v1";
const gachaTicketMap = { 6: 2000, 5: 200, 4: 20, 3: 0 };
const SITE_URL = "https://endfield-ind.my.id";
const NAV_CONTACT_LINKS = [
  {
    label: "WhatsApp",
    value: "085179855248",
    href: "https://wa.me/6285179855248",
    icon: "assets/icons/social-whatsapp.svg",
  },
  {
    label: "Instagram Store",
    value: "@papah.chan.store",
    href: "https://www.instagram.com/papah.chan.store/",
    icon: "assets/icons/social-instagram.svg",
  },
  {
    label: "GitHub",
    value: "FahriAdison",
    href: "https://github.com/FahriAdison",
    icon: "assets/icons/social-github.svg",
  },
];

const page = document.body?.dataset.page || "home";
const rawRoot = document.body?.dataset.basePath || ".";
const root = rawRoot.endsWith("/") && rawRoot !== "/" ? rawRoot.slice(0, -1) : rawRoot;

function withRoot(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const cleaned = path.replace(/^\.\//, "").replace(/^\//, "");
  if (root === "." || root === "") return `./${cleaned}`;
  return `${root}/${cleaned}`;
}

function asset(path) {
  return withRoot(path);
}

function characterUrl(id) {
  return withRoot(`character/?id=${encodeURIComponent(id)}`);
}

function gearUrl(id) {
  return withRoot(`gear/?id=${encodeURIComponent(id)}`);
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toAbsoluteSiteUrl(pathOrUrl = "/") {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const cleaned = String(pathOrUrl).startsWith("/") ? String(pathOrUrl) : `/${pathOrUrl}`;
  return `${SITE_URL}${cleaned}`;
}

function upsertMetaByName(name, content) {
  if (!name || !content) return;
  let tag = document.head.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertMetaByProperty(property, content) {
  if (!property || !content) return;
  let tag = document.head.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href) {
  if (!href) return;
  let tag = document.head.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function applyDynamicMeta({ title, description, canonicalUrl, imageUrl, keywords }) {
  if (title) {
    document.title = title;
    upsertMetaByProperty("og:title", title);
    upsertMetaByName("twitter:title", title);
  }
  if (description) {
    upsertMetaByName("description", description);
    upsertMetaByProperty("og:description", description);
    upsertMetaByName("twitter:description", description);
  }
  if (canonicalUrl) {
    upsertCanonical(canonicalUrl);
    upsertMetaByProperty("og:url", canonicalUrl);
  }
  if (imageUrl) {
    upsertMetaByProperty("og:image", imageUrl);
    upsertMetaByName("twitter:image", imageUrl);
  }
  if (keywords) {
    const keywordValue = Array.isArray(keywords) ? keywords.join(", ") : String(keywords);
    upsertMetaByName("keywords", keywordValue);
  }
}

function toDateLabel(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function toDateTimeLabel(isoDateTime) {
  if (!isoDateTime) return "-";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toCountdownLabel(ms) {
  if (!Number.isFinite(ms)) return "-";
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (days > 0) return `${days}h ${hours}j ${mins}m ${secs}d`;
  return `${hours}j ${mins}m ${secs}d`;
}

function toClock(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function emptyState(message) {
  return `<article class="card empty-state"><p>${esc(message)}</p></article>`;
}

function sortByName(items, key, mode = "AZ") {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const cmp = collator.compare(a[key] || "", b[key] || "");
    return mode === "ZA" ? -cmp : cmp;
  });
  return sorted;
}

function sortCharacters(items, mode = "TIER") {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (mode === "AZ") return collator.compare(a.name, b.name);
    if (mode === "ZA") return collator.compare(b.name, a.name);
    const t = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    return t !== 0 ? t : collator.compare(a.name, b.name);
  });
  return sorted;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomPick(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)] || null;
}

function rarityFromCharacter(character) {
  const rarity = character?.profile?.rarity || "";
  const match = String(rarity).match(/(\d+)/);
  if (!match) return 4;
  const stars = Number(match[1]);
  if (!Number.isFinite(stars)) return 4;
  return stars;
}

function readGachaState() {
  const fallback = { byBanner: {}, history: [], selectedBannerId: "" };
  try {
    const raw = localStorage.getItem(GACHA_STATE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return {
      byBanner: parsed?.byBanner && typeof parsed.byBanner === "object" ? parsed.byBanner : {},
      history: Array.isArray(parsed?.history) ? parsed.history : [],
      selectedBannerId: typeof parsed?.selectedBannerId === "string" ? parsed.selectedBannerId : "",
    };
  } catch {
    return fallback;
  }
}

function saveGachaState(state) {
  try {
    localStorage.setItem(GACHA_STATE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function ensureBannerState(state, bannerId) {
  if (!state.byBanner[bannerId]) {
    state.byBanner[bannerId] = {
      pitySix: 0,
      pityFeatured: 0,
      totalPulls: 0,
      arsenalTicket: 0,
      urgentUsed: false,
      lastByRarity: {},
    };
  }
  if (!state.byBanner[bannerId].lastByRarity || typeof state.byBanner[bannerId].lastByRarity !== "object") {
    state.byBanner[bannerId].lastByRarity = {};
  }
  return state.byBanner[bannerId];
}

function getMeta(character) {
  const profile = character.profile || {};
  return {
    element: profile.element || "-",
    weapon: profile.weapon || "-",
    role: profile.role || character.role,
  };
}

function skillType(type) {
  return skillTypeMap[type] || type || "Skill";
}

function gearType(type) {
  return gearTypeMap[type] || type || "-";
}

function buildTierChips(chars) {
  if (!chars.length) return '<span class="tier-empty">-</span>';
  return chars
    .map(
      (c) => `
      <a class="tier-chip" href="${characterUrl(c.id)}" title="Buka profil ${esc(c.name)}">
        <img src="${asset(c.image)}" alt="${esc(c.name)} icon" loading="lazy" />
        ${esc(c.name)}
      </a>`
    )
    .join("");
}

function characterCard(character, showLink = true) {
  const meta = getMeta(character);
  return `
    <article class="card char-card">
      <a class="card-link" href="${characterUrl(character.id)}">
        <div class="char-head">
          <img class="char-avatar" src="${asset(character.image)}" alt="${esc(character.name)} icon" loading="lazy" />
          <div>
            <span class="meta-tier ${tierClassMap[character.tier]}">Tier ${esc(character.tier)}</span>
            <h3>${esc(character.name)}</h3>
          </div>
        </div>
        <p><strong>Role:</strong> ${esc(character.role)}</p>
        <p><strong>Element:</strong> ${esc(meta.element)} | <strong>Weapon:</strong> ${esc(meta.weapon)}</p>
        <p>${esc(character.summary)}</p>
        ${showLink ? '<span class="detail-link">Lihat detail karakter</span>' : ""}
      </a>
    </article>`;
}

function readBgmState() {
  const base = { playing: true, muted: false, position: 0, savedAt: Date.now(), sourceIndex: 0 };
  try {
    const raw = localStorage.getItem(BGM_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return {
      playing: typeof parsed.playing === "boolean" ? parsed.playing : base.playing,
      muted: typeof parsed.muted === "boolean" ? parsed.muted : base.muted,
      position: Number.isFinite(parsed.position) ? parsed.position : base.position,
      savedAt: Number.isFinite(parsed.savedAt) ? parsed.savedAt : base.savedAt,
      sourceIndex: Number.isInteger(parsed.sourceIndex) ? parsed.sourceIndex : base.sourceIndex,
    };
  } catch {
    return base;
  }
}

function saveBgmState(state) {
  try {
    localStorage.setItem(BGM_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

function initGlobalBgm() {
  const nav = document.querySelector(".nav");
  const brand = nav?.querySelector(".brand");
  if (!nav || !brand) return;

  const cluster = document.createElement("div");
  cluster.className = "nav-brand-cluster";

  const panel = document.createElement("div");
  panel.className = "music-inline-controls";
  panel.innerHTML = `
    <button class="music-btn-inline" id="bgm-play" type="button" aria-label="Play atau pause musik">Play</button>
    <button class="music-btn-inline" id="bgm-mute" type="button" aria-label="Mute atau unmute musik">Mute</button>
    <span class="music-mini-state" id="bgm-status" aria-live="polite">Memuat...</span>
  `;

  brand.replaceWith(cluster);
  cluster.appendChild(brand);
  cluster.appendChild(panel);

  const btnPlay = panel.querySelector("#bgm-play");
  const btnMute = panel.querySelector("#bgm-mute");
  const labelStatus = panel.querySelector("#bgm-status");
  if (!btnPlay || !btnMute || !labelStatus) return;

  const state = readBgmState();
  let sourceIndex = Math.max(0, Math.min(state.sourceIndex, BGM_SOURCES.length - 1));
  let resumeAt = Math.max(0, state.position);
  let wantsPlay = state.playing;
  if (state.playing) {
    const elapsed = Math.max(0, (Date.now() - state.savedAt) / 1000);
    resumeAt += elapsed;
  }

  const audio = new Audio();
  audio.preload = "auto";
  audio.loop = true;
  audio.muted = state.muted;
  audio.src = BGM_SOURCES[sourceIndex];

  const persist = () => {
    saveBgmState({
      playing: wantsPlay,
      muted: audio.muted,
      position: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
      savedAt: Date.now(),
      sourceIndex,
    });
  };

  const refresh = (msg) => {
    btnPlay.textContent = audio.paused ? "Play" : "Pause";
    btnMute.textContent = audio.muted ? "Unmute" : "Mute";
    if (msg) {
      labelStatus.textContent = msg;
      return;
    }
    if (audio.paused) {
      labelStatus.textContent = "BGM Off";
      return;
    }
    labelStatus.textContent = audio.muted ? "BGM On (Mute)" : "BGM On";
  };

  const safePlay = async () => {
    try {
      await audio.play();
      wantsPlay = true;
      refresh();
      persist();
    } catch {
      wantsPlay = true;
      refresh("Klik Play");
      persist();
    }
  };

  audio.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0 && resumeAt > 0) {
      audio.currentTime = resumeAt % audio.duration;
      resumeAt = 0;
    }
    refresh();
  });

  audio.addEventListener("error", () => {
    if (sourceIndex + 1 < BGM_SOURCES.length) {
      sourceIndex += 1;
      audio.src = BGM_SOURCES[sourceIndex];
      audio.load();
      refresh("Pindah sumber BGM");
      if (wantsPlay) void safePlay();
      else persist();
      return;
    }
    refresh("BGM error");
    persist();
  });

  btnPlay.addEventListener("click", () => {
    if (audio.paused) {
      wantsPlay = true;
      void safePlay();
      return;
    }
    wantsPlay = false;
    audio.pause();
    refresh();
    persist();
  });

  btnMute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    if (!audio.muted && wantsPlay && audio.paused) {
      void safePlay();
      return;
    }
    refresh();
    persist();
  });

  const interval = setInterval(() => {
    refresh();
    persist();
  }, 1000);

  window.addEventListener("pagehide", () => {
    persist();
    clearInterval(interval);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) persist();
  });

  audio.load();
  refresh("Memuat...");
  if (wantsPlay) void safePlay();
  else {
    persist();
    refresh("Siap");
  }
}

function initNavDrawer() {
  const nav = document.querySelector(".nav");
  const links = nav?.querySelector(".nav-links");
  if (!nav || !links) return;
  if (nav.dataset.drawerReady === "1") return;
  nav.dataset.drawerReady = "1";

  if (!links.id) links.id = "site-nav-links";

  if (!links.querySelector(".nav-contact")) {
    const contact = document.createElement("section");
    contact.className = "nav-contact";
    contact.setAttribute("aria-label", "Contact links");
    contact.innerHTML = `
      <p class="nav-contact-title">Contact Me On:</p>
      ${NAV_CONTACT_LINKS.map(
        (item) => `
        <a class="nav-contact-link" href="${esc(item.href)}" target="_blank" rel="noreferrer noopener">
          <img class="nav-contact-icon" src="${asset(item.icon)}" alt="${esc(item.label)} icon" loading="lazy" />
          <span class="nav-contact-copy">
            <strong>${esc(item.label)}</strong>
            <small>${esc(item.value)}</small>
          </span>
        </a>
      `
      ).join("")}
    `;
    links.appendChild(contact);
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "nav-toggle";
  button.setAttribute("aria-label", "Buka menu navigasi");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", links.id);
  button.innerHTML = `
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
  `;
  nav.appendChild(button);

  let backdrop = document.querySelector(".nav-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "nav-backdrop";
    document.body.appendChild(backdrop);
  }

  const setOpen = (open) => {
    nav.classList.toggle("menu-open", open);
    document.body.classList.toggle("nav-open", open);
    button.setAttribute("aria-expanded", String(open));
  };

  button.addEventListener("click", () => {
    setOpen(!nav.classList.contains("menu-open"));
  });
  backdrop.addEventListener("click", () => setOpen(false));
  links.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = String(link.getAttribute("href") || "").trim();
    if (!href) return;
    if (href.startsWith("#")) {
      setOpen(false);
      return;
    }
    // Keep navigation default behavior; close drawer right after click dispatch.
    setTimeout(() => setOpen(false), 10);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setOpen(false);
  });
}

function renderHome(data) {
  const stamp = document.getElementById("data-stamp");
  if (stamp) stamp.textContent = `Data disusun: ${toDateLabel(data.meta.updatedAt)}`;

  const metaGrid = document.getElementById("home-meta-grid");
  if (metaGrid) {
    const picks = sortCharacters(data.characters.filter((c) => c.isMeta), "TIER").slice(0, 6);
    metaGrid.innerHTML = picks.length ? picks.map((c) => characterCard(c, false)).join("") : emptyState("Belum ada data meta pick.");
  }

  const tipsGrid = document.getElementById("home-tips-grid");
  if (tipsGrid) {
    const preview = sortByName(data.tips, "title", "AZ").slice(0, 4);
    tipsGrid.innerHTML = preview.length
      ? preview
          .map(
            (tip) => `<article class="card"><span class="tip-category">${esc(tip.category)}</span><h3>${esc(tip.title)}</h3><p>${esc(tip.description)}</p></article>`
          )
          .join("")
      : emptyState("Belum ada tips.");
  }

  initGalleryLightbox();
}

function initGalleryLightbox() {
  const gallery = document.querySelector(".gallery");
  const lightbox = document.getElementById("gallery-lightbox");
  const stage = lightbox?.querySelector(".lightbox-stage");
  const frame = lightbox?.querySelector(".lightbox-image");
  const caption = lightbox?.querySelector(".lightbox-caption");
  const closeButton = lightbox?.querySelector("[data-close-lightbox]");
  const prevButton = lightbox?.querySelector("[data-lightbox-nav='-1']");
  const nextButton = lightbox?.querySelector("[data-lightbox-nav='1']");
  if (!gallery || !lightbox || !stage || !frame || !caption || !closeButton || !prevButton || !nextButton) return;
  if (lightbox.dataset.bound === "1") return;
  lightbox.dataset.bound = "1";
  const images = Array.from(gallery.querySelectorAll("img"));
  if (!images.length) return;
  let activeIndex = 0;

  const renderAt = (index) => {
    const image = images[index];
    if (!image) return;
    const text = image.dataset.caption || image.alt || "";
    frame.src = image.currentSrc || image.src;
    frame.alt = image.alt || "Galeri Endfield";
    caption.textContent = text;
    caption.hidden = !text.trim();
  };

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    frame.src = "";
    frame.alt = "";
    caption.hidden = true;
    caption.textContent = "";
  };

  const openAt = (index) => {
    activeIndex = index;
    renderAt(activeIndex);
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
  };

  const navigate = (step) => {
    if (lightbox.hidden) return;
    activeIndex = (activeIndex + step + images.length) % images.length;
    renderAt(activeIndex);
  };

  images.forEach((image, index) => {
    image.setAttribute("tabindex", "0");
    image.addEventListener("click", () => openAt(index));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openAt(index);
      }
    });
  });

  prevButton.addEventListener("click", () => navigate(-1));
  nextButton.addEventListener("click", () => navigate(1));
  stage.addEventListener("click", (event) => {
    if (event.target === stage) close();
  });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  closeButton.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close();
    if (event.key === "ArrowLeft") navigate(-1);
    if (event.key === "ArrowRight") navigate(1);
  });
}

function initGachaPageBgm() {
  const note = document.getElementById("gacha-audio-note");
  const setNote = (text) => {
    if (note) note.textContent = text;
  };

  const audio = new Audio();
  audio.loop = true;
  audio.preload = "auto";
  let sourceIndex = 0;
  const activeSource = () => GACHA_BGM_SOURCES[sourceIndex] || "";
  audio.src = activeSource();

  const tryPlay = async () => {
    try {
      await audio.play();
      setNote(sourceIndex === 0 ? "BGM gacha aktif." : `BGM aktif (fallback ${sourceIndex + 1}).`);
    } catch {
      setNote("Autoplay diblok browser. Audio mulai setelah interaksi pertama.");
    }
  };

  const unlock = () => {
    if (!audio.paused) return;
    void audio
      .play()
      .then(() => {
        setNote(sourceIndex === 0 ? "BGM gacha aktif." : `BGM aktif (fallback ${sourceIndex + 1}).`);
      })
      .catch(() => {});
  };

  audio.addEventListener("error", () => {
    if (sourceIndex + 1 < GACHA_BGM_SOURCES.length) {
      sourceIndex += 1;
      audio.src = activeSource();
      audio.load();
      setNote(`Sumber utama gagal, pindah ke fallback ${sourceIndex + 1}.`);
      void tryPlay();
      return;
    }
    setNote("Semua sumber audio gagal dimuat.");
  });

  document.addEventListener("pointerdown", unlock);
  document.addEventListener("keydown", unlock);
  window.addEventListener("pagehide", () => {
    document.removeEventListener("pointerdown", unlock);
    document.removeEventListener("keydown", unlock);
    audio.pause();
    audio.src = "";
  });

  audio.load();
  void tryPlay();
}

function initGachaPage(data) {
  const refs = {
    bannerSelect: document.getElementById("gacha-banner-select"),
    pull1: document.getElementById("gacha-pull-1"),
    pull10: document.getElementById("gacha-pull-10"),
    pullUrgent: document.getElementById("gacha-pull-urgent"),
    resetBanner: document.getElementById("gacha-reset-banner"),
    pitySix: document.getElementById("gacha-pity-six"),
    pityFeatured: document.getElementById("gacha-pity-featured"),
    totalPulls: document.getElementById("gacha-total-pulls"),
    arsenalTicket: document.getElementById("gacha-arsenal-ticket"),
    stage: document.getElementById("gacha-stage"),
    bannerImage: document.getElementById("gacha-banner-image"),
    bannerType: document.getElementById("gacha-banner-type"),
    bannerTitle: document.getElementById("gacha-banner-title"),
    bannerSub: document.getElementById("gacha-banner-sub"),
    status: document.getElementById("gacha-status"),
    scheduleList: document.getElementById("gacha-banner-schedule"),
    results: document.getElementById("gacha-results"),
    history: document.getElementById("gacha-history"),
    disclaimer: document.getElementById("gacha-disclaimer-text"),
    sourceList: document.getElementById("gacha-source-list"),
    stamp: document.getElementById("gacha-stamp"),
  };

  if (
    !refs.bannerSelect ||
    !refs.pull1 ||
    !refs.pull10 ||
    !refs.pullUrgent ||
    !refs.resetBanner ||
    !refs.pitySix ||
    !refs.pityFeatured ||
    !refs.totalPulls ||
    !refs.arsenalTicket ||
    !refs.stage ||
    !refs.bannerImage ||
    !refs.bannerType ||
    !refs.bannerTitle ||
    !refs.bannerSub ||
    !refs.status ||
    !refs.scheduleList ||
    !refs.results ||
    !refs.history ||
    !refs.disclaimer ||
    !refs.sourceList ||
    !refs.stamp
  ) {
    return;
  }

  initGachaPageBgm();

  const gachaData = data.gacha || {};
  const model = gachaData.model || {};
  const baseRates = model.baseRates || {};
  const pityModel = model.pity || {};

  const rates = {
    6: Number(baseRates["6"] ?? 0.8),
    5: Number(baseRates["5"] ?? 8),
    4: Number(baseRates["4"] ?? 91.2),
  };

  const pity = {
    hardPitySix: Number(pityModel.hardPitySix ?? 80),
    featuredGuarantee: Number(pityModel.featuredGuarantee ?? 120),
    featuredRateOnSix: Number(pityModel.featuredRateOnSix ?? 50) / 100,
    tenPullGuaranteeFivePlus: pityModel.tenPullGuaranteeFivePlus !== false,
  };

  const characters = Array.isArray(data.characters) ? data.characters : [];
  const characterByName = new Map(
    characters.filter((char) => char?.name).map((char) => [String(char.name).toLowerCase(), char])
  );
  const gachaIconOverrides = {
    akekuri: "assets/icons/akekuri.png",
    wulfgard: "https://endfieldtools.dev/assets/images/endfield/charicon/icon_chr_0006_wolfgd.png",
    estella: "assets/icons/estella.webp",
    antal: "assets/icons/antal.webp",
  };
  const toSimUnitFromCharacter = (char) => ({
    // Keep icon selection stable for specific operators used in simulator pool.
    image: gachaIconOverrides[String(char?.name || "").toLowerCase()] || char?.image || "assets/skill-icons/basic.webp",
    id: char?.id || `sim-${String(char?.name || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: char?.name || "Unknown Operator",
    role: char?.role || "-",
    element: char?.profile?.element || "-",
    stars: rarityFromCharacter(char),
  });

  const pushUniquePoolUnit = (pool, item) => {
    if (!item || !item.name) return;
    if (pool.some((unit) => String(unit.name).toLowerCase() === String(item.name).toLowerCase())) return;
    pool.push(item);
  };

  const simPoolByStars = new Map();
  const addSimUnit = (item) => {
    const stars = Number(item.stars);
    if (!Number.isFinite(stars) || stars < 4 || stars > 6) return;
    if (!simPoolByStars.has(stars)) simPoolByStars.set(stars, []);
    pushUniquePoolUnit(simPoolByStars.get(stars), item);
  };

  characters.forEach((char) => {
    addSimUnit(toSimUnitFromCharacter(char));
  });

  const defaultSimulatedPool = [
    { id: "akekuri-sim", name: "Akekuri", stars: 4, role: "Support", element: "Heat", image: "assets/icons/akekuri.png" },
    { id: "wulfgard-sim", name: "Wulfgard", stars: 5, role: "Sub DPS", element: "Heat", image: "https://endfieldtools.dev/assets/images/endfield/charicon/icon_chr_0006_wolfgd.png" },
    { id: "estella-sim", name: "Estella", stars: 4, role: "Sub DPS", element: "Cryo", image: "assets/icons/estella.webp" },
    { id: "antal-sim", name: "Antal", stars: 4, role: "Support", element: "Electric", image: "assets/icons/antal.webp" },
  ];
  const simulatedPool = Array.isArray(gachaData.simulatedPool) && gachaData.simulatedPool.length
    ? gachaData.simulatedPool
    : defaultSimulatedPool;
  simulatedPool.forEach((item) => {
    addSimUnit({
      id: item.id || `sim-${String(item.name || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: item.name || "Unknown",
      stars: item.stars,
      role: item.role || "-",
      element: item.element || "-",
      image: gachaIconOverrides[String(item.name || "").toLowerCase()] || item.image || "assets/skill-icons/basic.webp",
    });
  });

  const defaultBanners = [
    {
      id: "gilberta-chartered",
      name: "The Floaty Messenger",
      type: "Chartered Headhunting",
      status: "Aktif (snapshot)",
      featured: "Gilberta",
      image: "assets/images/banner-gilberta.jpg",
      description: "Banner Chartered untuk Gilberta.",
      supportsUrgent: true,
      urgentUnlockPulls: 30,
      source: "https://endfield.gryphline.com/en-us/news/7028",
    },
    {
      id: "laevatain-chartered",
      name: "Echoes from Blaze",
      type: "Chartered Headhunting",
      status: "Selesai (simulasi arsip)",
      featured: "Laevatain",
      image: "assets/images/banner-laevatain.jpg",
      description: "Banner Chartered untuk Laevatain.",
      supportsUrgent: true,
      urgentUnlockPulls: 30,
      source: "https://endfield.gryphline.com/en-us/news/3847",
    },
    {
      id: "basic-standard",
      name: "Basic Headhunting",
      type: "Standard",
      status: "Permanen",
      featured: "",
      image: "assets/images/hero-share.jpg",
      description: "Banner standar permanen.",
      supportsUrgent: false,
      urgentUnlockPulls: 0,
      source: "https://endfield.gryphline.com/en-us/news/4499",
    },
  ];

  const banners = Array.isArray(gachaData.banners) && gachaData.banners.length ? gachaData.banners : defaultBanners;
  const bannerById = new Map(banners.map((banner) => [banner.id, banner]));

  refs.disclaimer.textContent =
    gachaData.disclaimer ||
    "Simulasi ini tidak 100% merepresentasikan hasil in-game. Data dan model akan terus disesuaikan.";
  refs.sourceList.innerHTML = (gachaData.sources || [])
    .map((item) => `<li><a href="${esc(item.url || "#")}" target="_blank" rel="noreferrer noopener">${esc(item.label || item.url || "Sumber")}</a></li>`)
    .join("");
  refs.stamp.textContent = gachaData.updatedAt
    ? `Snapshot model: ${toDateLabel(gachaData.updatedAt)}`
    : "Snapshot model belum tersedia.";

  const state = readGachaState();
  const firstBannerId = banners[0]?.id || "";
  const initialBannerId = bannerById.has(state.selectedBannerId) ? state.selectedBannerId : firstBannerId;
  if (!initialBannerId) return;

  refs.bannerSelect.innerHTML = banners
    .map((banner) => {
      const featured = banner.featured ? ` - Rate Up: ${banner.featured}` : "";
      return `<option value="${esc(banner.id)}">${esc(banner.type || "Banner")} | ${esc(banner.name || "Unknown")}${esc(featured)}</option>`;
    })
    .join("");
  refs.bannerSelect.value = initialBannerId;
  state.selectedBannerId = initialBannerId;
  saveGachaState(state);

  const toMillis = (value) => {
    if (!value) return Number.NaN;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  };

  const getScheduleBanners = () => {
    const preferredIds = ["gilberta-chartered", "yvonne-chartered"];
    const picked = [];
    preferredIds.forEach((id) => {
      const banner = bannerById.get(id);
      if (banner) picked.push(banner);
    });
    if (picked.length >= 2) return picked.slice(0, 2);

    const fallback = banners
      .filter((banner) => String(banner.type || "").toLowerCase().includes("chartered"))
      .sort((a, b) => {
        const aStart = toMillis(a.startAt);
        const bStart = toMillis(b.startAt);
        if (Number.isFinite(aStart) && Number.isFinite(bStart)) return aStart - bStart;
        if (Number.isFinite(aStart)) return -1;
        if (Number.isFinite(bStart)) return 1;
        return collator.compare(a.name || "", b.name || "");
      });
    fallback.forEach((banner) => {
      if (!picked.includes(banner) && picked.length < 2) picked.push(banner);
    });
    return picked;
  };

  const bannerCountdownText = (banner, nowMs) => {
    const startMs = toMillis(banner.startAt);
    const endMs = toMillis(banner.endAt);
    if (Number.isFinite(startMs) && nowMs < startMs) {
      return `Mulai dalam ${toCountdownLabel(startMs - nowMs)} (${toDateTimeLabel(banner.startAt)})`;
    }
    if (Number.isFinite(endMs) && nowMs <= endMs) {
      return `Berakhir dalam ${toCountdownLabel(endMs - nowMs)} (${toDateTimeLabel(banner.endAt)})`;
    }
    if (Number.isFinite(endMs)) {
      return `Sudah berakhir pada ${toDateTimeLabel(banner.endAt)}`;
    }
    return "Jadwal countdown belum tersedia";
  };

  const rollRarity = (forceSix = false) => {
    if (forceSix) return 6;
    const roll = Math.random() * 100;
    if (roll < rates[6]) return 6;
    if (roll < rates[6] + rates[5]) return 5;
    return 4;
  };

  const poolForStars = (banner, stars, excludeFeatured = false) => {
    let pool = [];
    if (stars === 6 && Array.isArray(banner.sixPool) && banner.sixPool.length) {
      pool = banner.sixPool
        .map((name) => characterByName.get(String(name).toLowerCase()))
        .filter(Boolean)
        .map((char) => toSimUnitFromCharacter(char))
        .filter(Boolean);
    }
    if (pool.length === 0) {
      pool = [...(simPoolByStars.get(stars) || [])];
    }
    if (excludeFeatured && banner.featured) {
      const featuredLower = String(banner.featured).toLowerCase();
      pool = pool.filter((char) => String(char.name).toLowerCase() !== featuredLower);
    }
    if (pool.length === 0) {
      pool = [...(simPoolByStars.get(5) || []), ...(simPoolByStars.get(4) || []), ...(simPoolByStars.get(6) || [])];
    }
    return pool;
  };

  const pickPoolUnit = (pool, bannerState, stars) => {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    const key = String(stars);
    const lastName = bannerState.lastByRarity?.[key] || "";
    let candidates = pool;
    if (pool.length > 1 && lastName) {
      const filtered = pool.filter((unit) => String(unit.name).toLowerCase() !== String(lastName).toLowerCase());
      if (filtered.length) candidates = filtered;
    }
    const selected = randomPick(candidates) || randomPick(pool);
    if (selected) bannerState.lastByRarity[key] = selected.name;
    return selected;
  };

  const renderMetrics = () => {
    const banner = bannerById.get(refs.bannerSelect.value);
    const bannerState = ensureBannerState(state, banner.id);
    refs.pitySix.textContent = String(bannerState.pitySix || 0);
    refs.pityFeatured.textContent =
      banner.type === "Chartered Headhunting" && banner.featured
        ? `${bannerState.pityFeatured || 0} / ${pity.featuredGuarantee}`
        : "-";
    refs.totalPulls.textContent = String(bannerState.totalPulls || 0);
    refs.arsenalTicket.textContent = String(bannerState.arsenalTicket || 0);

    if (!banner.supportsUrgent) {
      refs.pullUrgent.disabled = true;
      refs.pullUrgent.textContent = "Urgent x10 (Tidak tersedia)";
      return;
    }
    if (bannerState.urgentUsed) {
      refs.pullUrgent.disabled = true;
      refs.pullUrgent.textContent = "Urgent x10 (Sudah dipakai)";
      return;
    }
    const unlockAt = Number(banner.urgentUnlockPulls || 30);
    if ((bannerState.totalPulls || 0) < unlockAt) {
      refs.pullUrgent.disabled = true;
      refs.pullUrgent.textContent = `Urgent x10 (Buka di ${unlockAt} pull)`;
      return;
    }
    refs.pullUrgent.disabled = false;
    refs.pullUrgent.textContent = "Urgent x10 (Gratis)";
  };

  const renderBannerPanel = () => {
    const banner = bannerById.get(refs.bannerSelect.value);
    if (!banner) return;

    refs.bannerImage.src = asset(banner.image || "assets/images/hero-share.jpg");
    refs.bannerImage.alt = banner.name ? `Banner ${banner.name}` : "Banner gacha Endfield";
    refs.bannerType.textContent = String(banner.type || "Banner").toUpperCase();
    refs.bannerTitle.textContent = `${banner.name || "Banner"}${banner.featured ? ` - ${banner.featured}` : ""}`;
    refs.bannerSub.textContent = `${banner.description || "-"} Status: ${banner.status || "-"}`;
    if (!isRolling) {
      refs.status.textContent = `Siap pull pada banner ${banner.name || "-"}.`;
    }
  };

  const renderBannerSchedules = () => {
    const nowMs = Date.now();
    const scheduleBanners = getScheduleBanners();
    if (!scheduleBanners.length) {
      refs.scheduleList.innerHTML = emptyState("Jadwal banner belum tersedia.");
      return;
    }

    refs.scheduleList.innerHTML = scheduleBanners
      .map((banner, index) => {
        const startText = banner.startAt ? toDateTimeLabel(banner.startAt) : "-";
        const endText = banner.endAt ? toDateTimeLabel(banner.endAt) : "-";
        const timerText = bannerCountdownText(banner, nowMs);
        const estimateText = banner.isEstimate ? "Jadwal ini masih estimasi komunitas." : "";
        const roleTag = index === 0 ? "Banner 1 (Atas)" : "Banner 2 (Bawah)";
        return `
          <article class="card banner-schedule-card">
            <div class="banner-schedule-media">
              <img src="${asset(banner.image || "assets/images/hero-share.jpg")}" alt="${esc(banner.name || "Banner")} banner" loading="lazy" />
            </div>
            <div class="banner-schedule-copy">
              <p class="banner-schedule-kicker">${esc(roleTag)}</p>
              <h3>${esc(banner.name || "Banner")}${banner.featured ? ` - ${esc(banner.featured)}` : ""}</h3>
              <p class="banner-schedule-meta">Status: ${esc(banner.status || "-")}</p>
              <p class="banner-schedule-meta">Periode: ${esc(startText)} sampai ${esc(endText)}</p>
              ${banner.timezoneLabel ? `<p class="banner-schedule-meta">Zona: ${esc(banner.timezoneLabel)}</p>` : ""}
              <p class="banner-schedule-timer">${esc(timerText)}</p>
              ${estimateText ? `<p class="banner-schedule-note">${esc(estimateText)}</p>` : ""}
            </div>
          </article>
        `;
      })
      .join("");
  };

  const pushHistory = (entry) => {
    const safeEntry = {
      time: new Date().toISOString(),
      bannerId: entry.bannerId,
      bannerName: entry.bannerName,
      type: entry.type,
      count: entry.count,
      summary: entry.summary,
      highlight: entry.highlight,
    };
    state.history = [safeEntry, ...state.history].slice(0, 20);
    saveGachaState(state);
  };

  const renderHistory = () => {
    if (!state.history.length) {
      refs.history.innerHTML = emptyState("Belum ada riwayat pull.");
      return;
    }
    refs.history.innerHTML = state.history
      .map((entry) => {
        const date = new Date(entry.time);
        const timeLabel = Number.isNaN(date.getTime())
          ? "-"
          : date.toLocaleString("id-ID", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
        return `
          <article class="card history-item">
            <p class="stamp">${esc(timeLabel)}</p>
            <h3>${esc(entry.bannerName || "-")}</h3>
            <p><strong>Mode:</strong> ${esc(entry.type || "-")} | <strong>Jumlah:</strong> ${esc(entry.count || 0)}</p>
            <p><strong>Hasil:</strong> ${esc(entry.summary || "-")}</p>
            <p><strong>Highlight:</strong> ${esc(entry.highlight || "-")}</p>
          </article>`;
      })
      .join("");
  };

  const renderPullResults = (results) => {
    if (!results.length) {
      refs.results.innerHTML = emptyState("Belum ada hasil pull.");
      return;
    }

    refs.results.innerHTML = results
      .map(
        (item, index) => `
          <article class="card gacha-card rarity-${item.stars}" data-index="${index}">
            <span class="gacha-rarity">${esc(`Rarity ${item.stars}*`)}</span>
            <img class="gacha-card-avatar" src="${asset(item.image || "assets/skill-icons/basic.webp")}" alt="${esc(item.name)} icon" loading="lazy" />
            <h3>${esc(item.name)}</h3>
            <p>${esc(item.role || "-")} | ${esc(item.element || "-")}</p>
            ${item.isFeatured ? '<span class="gacha-featured">Rate Up Hit</span>' : ""}
          </article>`
      )
      .join("");

    const cards = Array.from(refs.results.querySelectorAll(".gacha-card"));
    cards.forEach((card, idx) => {
      setTimeout(() => card.classList.add("show"), 90 * idx + 90);
    });
  };

  const pullOne = (banner, bannerState, counted, forceFivePlus = false) => {
    const forceSix = counted && bannerState.pitySix + 1 >= pity.hardPitySix;
    let stars = rollRarity(forceSix);
    if (forceFivePlus && stars < 5) stars = 5;

    let chosen = null;
    let isFeatured = false;

    if (stars === 6 && banner.featured && banner.type === "Chartered Headhunting") {
      const forceFeatured = counted && bannerState.pityFeatured + 1 >= pity.featuredGuarantee;
      const featuredChar = characterByName.get(String(banner.featured).toLowerCase());
      const featuredUnit = featuredChar ? toSimUnitFromCharacter(featuredChar) : null;
      const shouldFeatured = forceFeatured || Math.random() < pity.featuredRateOnSix;
      if (shouldFeatured && featuredUnit) {
        chosen = featuredUnit;
        isFeatured = true;
      } else {
        chosen = pickPoolUnit(poolForStars(banner, stars, true), bannerState, stars);
      }
    }

    if (!chosen) {
      chosen = pickPoolUnit(poolForStars(banner, stars, false), bannerState, stars);
    }
    if (!chosen) {
      chosen = {
        id: "unknown",
        name: "Unknown Operator",
        role: "-",
        element: "-",
        image: "assets/skill-icons/basic.webp",
      };
    }

    if (counted) {
      bannerState.totalPulls += 1;
      bannerState.pitySix = stars === 6 ? 0 : bannerState.pitySix + 1;
      if (banner.type === "Chartered Headhunting" && banner.featured) {
        bannerState.pityFeatured = stars === 6 && isFeatured ? 0 : bannerState.pityFeatured + 1;
      } else {
        bannerState.pityFeatured = 0;
      }
    }

    bannerState.arsenalTicket += gachaTicketMap[stars] || 0;

    return {
      id: chosen.id,
      name: chosen.name,
      stars,
      role: chosen.role || "-",
      element: chosen.element || "-",
      image: chosen.image || "assets/skill-icons/basic.webp",
      isFeatured,
    };
  };

  const runBatch = (count, mode) => {
    const banner = bannerById.get(refs.bannerSelect.value);
    const bannerState = ensureBannerState(state, banner.id);
    const counted = mode !== "urgent";
    const isTen = count >= 10 && pity.tenPullGuaranteeFivePlus;

    const batch = [];
    let seenFivePlus = false;
    for (let i = 0; i < count; i += 1) {
      const forceFivePlus = isTen && i === count - 1 && !seenFivePlus;
      const result = pullOne(banner, bannerState, counted, forceFivePlus);
      if (result.stars >= 5) seenFivePlus = true;
      batch.push(result);
    }

    if (mode === "urgent") {
      bannerState.urgentUsed = true;
    }

    const summaryMap = new Map();
    batch.forEach((item) => {
      const key = `${item.stars}*`;
      summaryMap.set(key, (summaryMap.get(key) || 0) + 1);
    });
    const summary = [...summaryMap.entries()]
      .sort((a, b) => Number(b[0].replace("*", "")) - Number(a[0].replace("*", "")))
      .map(([k, v]) => `${v}x ${k}`)
      .join(", ");

    const featuredHits = batch.filter((item) => item.isFeatured).length;
    const bestDrop = [...batch].sort((a, b) => b.stars - a.stars)[0];
    pushHistory({
      bannerId: banner.id,
      bannerName: banner.name,
      type: mode,
      count,
      summary,
      highlight: featuredHits > 0 ? `${featuredHits}x Rate Up (${banner.featured})` : `${bestDrop.name} (${bestDrop.stars}*)`,
    });

    saveGachaState(state);
    return { batch, banner };
  };

  let isRolling = false;
  const setActionDisabled = (value) => {
    refs.pull1.disabled = value;
    refs.pull10.disabled = value;
    refs.pullUrgent.disabled = value;
    refs.resetBanner.disabled = value;
    refs.bannerSelect.disabled = value;
  };

  const animatePull = async (count, mode = "normal") => {
    if (isRolling) return;
    const banner = bannerById.get(refs.bannerSelect.value);
    if (!banner) return;

    if (mode === "urgent") {
      const bannerState = ensureBannerState(state, banner.id);
      if (!banner.supportsUrgent || bannerState.urgentUsed || bannerState.totalPulls < Number(banner.urgentUnlockPulls || 30)) {
        return;
      }
    }

    isRolling = true;
    setActionDisabled(true);
    refs.stage.classList.remove("reveal");
    refs.stage.classList.add("rolling");
    refs.status.textContent = "Membuka kanal headhunting...";
    refs.results.innerHTML = "";

    await wait(380);
    refs.status.textContent = "Sinkronisasi sinyal Talos-II...";
    await wait(640);

    const { batch, banner: activeBanner } = runBatch(count, mode);
    refs.stage.classList.remove("rolling");
    refs.stage.classList.add("reveal");
    refs.status.textContent = `Pull selesai di ${activeBanner.name}.`;

    renderPullResults(batch);
    renderHistory();
    renderMetrics();

    await wait(360);
    refs.stage.classList.remove("reveal");
    setActionDisabled(false);
    renderMetrics();
    isRolling = false;
  };

  let countdownTimer = null;
  const startCountdownTicker = () => {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      renderBannerSchedules();
    }, 1000);
  };

  window.addEventListener("pagehide", () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  });

  refs.bannerSelect.addEventListener("change", () => {
    state.selectedBannerId = refs.bannerSelect.value;
    ensureBannerState(state, refs.bannerSelect.value);
    saveGachaState(state);
    renderBannerPanel();
    renderBannerSchedules();
    renderMetrics();
    refs.results.innerHTML = emptyState("Banner berganti. Mulai pull untuk lihat hasil.");
    refs.status.textContent = "Banner berganti. Siap simulasi.";
  });

  refs.pull1.addEventListener("click", () => {
    void animatePull(1, "single");
  });
  refs.pull10.addEventListener("click", () => {
    void animatePull(10, "multi");
  });
  refs.pullUrgent.addEventListener("click", () => {
    void animatePull(10, "urgent");
  });
  refs.resetBanner.addEventListener("click", () => {
    const banner = bannerById.get(refs.bannerSelect.value);
    if (!banner) return;
    state.byBanner[banner.id] = {
      pitySix: 0,
      pityFeatured: 0,
      totalPulls: 0,
      arsenalTicket: 0,
      urgentUsed: false,
      lastByRarity: {},
    };
    saveGachaState(state);
    renderMetrics();
    refs.results.innerHTML = emptyState("Counter banner direset.");
    refs.status.textContent = `Counter untuk ${banner.name} direset.`;
  });

  renderBannerPanel();
  renderBannerSchedules();
  renderMetrics();
  renderHistory();
  refs.results.innerHTML = emptyState("Belum ada hasil pull. Tekan Pull x1 atau Pull x10.");
  startCountdownTicker();
}

function teamTierClass(value) {
  const tier = String(value || "A").toUpperCase();
  if (tier.startsWith("S")) return "tier-s";
  if (tier.startsWith("A")) return "tier-a";
  return "tier-b";
}

function sortTeamComps(teamComps, mode = "TIER") {
  const order = { S: 0, "A+": 1, A: 2, B: 3 };
  const sorted = [...teamComps];
  sorted.sort((a, b) => {
    if (mode === "AZ") return collator.compare(a.title || "", b.title || "");
    if (mode === "ZA") return collator.compare(b.title || "", a.title || "");
    const rankA = order[String(a.tier || "B").toUpperCase()] ?? 99;
    const rankB = order[String(b.tier || "B").toUpperCase()] ?? 99;
    if (rankA !== rankB) return rankA - rankB;
    return collator.compare(a.title || "", b.title || "");
  });
  return sorted;
}

function teamCompCard(comp, resolveMember) {
  const members = Array.isArray(comp.members) ? comp.members : [];
  const memberIcons = members.length
    ? `
      <div class="team-member-row">
        ${members
          .map((memberName) => {
            const resolved = typeof resolveMember === "function" ? resolveMember(memberName) : null;
            const icon = resolved?.image || teamMemberIconOverrides[memberName] || "assets/skill-icons/basic.webp";
            const chipBody = `
              <img src="${asset(icon)}" alt="${esc(memberName)} icon" loading="lazy" />
              <span>${esc(memberName)}</span>
            `;
            if (resolved?.id) {
              return `<a class="team-member-chip" href="${characterUrl(resolved.id)}" title="Buka profil ${esc(memberName)}">${chipBody}</a>`;
            }
            return `<span class="team-member-chip ghost" title="${esc(memberName)}">${chipBody}</span>`;
          })
          .join("")}
      </div>`
    : "";

  return `
    <article class="card team-comp-card">
      <div class="team-comp-head">
        <span class="meta-tier ${teamTierClass(comp.tier)}">Tier ${esc(comp.tier || "-")}</span>
        <h3>${esc(comp.title || "Team Comp")}</h3>
      </div>
      <p><strong>Komposisi:</strong> ${esc((comp.members || []).join(" + ") || "-")}</p>
      ${memberIcons}
      <p class="gear-meta"><strong>Peran:</strong> ${esc((comp.roles || []).join(" | ") || "-")}</p>
      <p>${esc(comp.reason || "-")}</p>
      <p><strong>Efek utama:</strong> ${esc(comp.effect || "-")}</p>
      <ol class="team-rotation">
        ${(comp.rotation || []).map((step) => `<li>${esc(step)}</li>`).join("")}
      </ol>
      <p class="stamp"><strong>Alternatif:</strong> ${esc((comp.alternatives || []).join(" ") || "-")}</p>
      <a class="detail-link inline-link" href="${esc(comp.source || "#")}" target="_blank" rel="noreferrer noopener">Sumber tim</a>
    </article>`;
}

function initTeamCompsPage(teamComps = [], characters = []) {
  const refs = {
    search: document.getElementById("team-search"),
    tier: document.getElementById("team-tier-filter"),
    sort: document.getElementById("team-sort"),
    count: document.getElementById("team-count"),
    stamp: document.getElementById("team-comps-stamp"),
    grid: document.getElementById("team-comps-grid"),
  };
  if (!refs.search || !refs.tier || !refs.sort || !refs.count || !refs.stamp || !refs.grid) return;

  const allComps = Array.isArray(teamComps) ? teamComps : [];
  const characterByName = new Map(
    (Array.isArray(characters) ? characters : [])
      .filter((char) => char && char.name)
      .map((char) => [String(char.name).toLowerCase(), { id: char.id, image: char.image }])
  );
  const resolveMember = (name) => characterByName.get(String(name || "").toLowerCase()) || null;

  const tiers = ["ALL", ...new Set(allComps.map((comp) => String(comp.tier || "-").toUpperCase()))];
  refs.tier.innerHTML = tiers
    .map((tier) => `<option value="${esc(tier)}">${esc(tier === "ALL" ? "Semua Tier" : `Tier ${tier}`)}</option>`)
    .join("");

  const latest = allComps
    .map((comp) => comp.updatedAt)
    .filter(Boolean)
    .sort((a, b) => (a < b ? 1 : -1))[0];
  refs.stamp.textContent = latest
    ? `Snapshot meta referensi: ${toDateLabel(latest)}`
    : "Snapshot meta belum tersedia.";

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const tier = refs.tier.value;
    const sortMode = refs.sort.value;

    const filtered = sortTeamComps(
      allComps.filter((comp) => {
        const thisTier = String(comp.tier || "-").toUpperCase();
        const byTier = tier === "ALL" || thisTier === tier;
        const blob =
          `${comp.title || ""} ${(comp.members || []).join(" ")} ${(comp.roles || []).join(" ")} ${comp.reason || ""} ${comp.effect || ""} ${(comp.rotation || []).join(" ")}`.toLowerCase();
        const bySearch = !search || blob.includes(search);
        return byTier && bySearch;
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} team comp cocok`;
    refs.grid.innerHTML = filtered.length
      ? filtered.map((comp) => teamCompCard(comp, resolveMember)).join("")
      : emptyState("Team comp tidak ditemukan.");
  };

  refs.search.addEventListener("input", redraw);
  refs.tier.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function initTipsPage(tips) {
  const refs = {
    search: document.getElementById("tips-search"),
    category: document.getElementById("tips-category"),
    sort: document.getElementById("tips-sort"),
    grid: document.getElementById("tips-grid"),
  };
  if (!refs.search || !refs.category || !refs.sort || !refs.grid) return;

  const categories = ["ALL", ...new Set(tips.map((t) => t.category))];
  refs.category.innerHTML = categories
    .map((c) => `<option value="${esc(c)}">${esc(c === "ALL" ? "Semua Kategori" : c)}</option>`)
    .join("");

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const category = refs.category.value;
    const sortMode = refs.sort.value;
    const filtered = sortByName(
      tips.filter((tip) => {
        const byCategory = category === "ALL" || tip.category === category;
        const blob = `${tip.title} ${tip.description} ${tip.tags.join(" ")}`.toLowerCase();
        return byCategory && (!search || blob.includes(search));
      }),
      "title",
      sortMode
    );

    refs.grid.innerHTML = filtered.length
      ? filtered
          .map((tip) => `<article class="card"><span class="tip-category">${esc(tip.category)}</span><h3>${esc(tip.title)}</h3><p>${esc(tip.description)}</p></article>`)
          .join("")
      : emptyState("Tips tidak ditemukan. Coba kata kunci lain.");
  };

  refs.search.addEventListener("input", redraw);
  refs.category.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function initTierPage(characters) {
  const refs = {
    search: document.getElementById("char-search"),
    tier: document.getElementById("tier-filter"),
    role: document.getElementById("role-filter"),
    sort: document.getElementById("char-sort"),
    count: document.getElementById("char-count"),
    metaGrid: document.getElementById("meta-grid"),
    table: document.getElementById("tier-table-body"),
  };
  if (!refs.search || !refs.tier || !refs.role || !refs.sort || !refs.count || !refs.metaGrid || !refs.table) return;

  refs.role.innerHTML = ["ALL", ...new Set(characters.map((c) => c.role))]
    .map((role) => `<option value="${esc(role)}">${esc(role === "ALL" ? "Semua Role" : role)}</option>`)
    .join("");

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const tier = refs.tier.value;
    const role = refs.role.value;
    const sortMode = refs.sort.value;
    const filtered = sortCharacters(
      characters.filter((c) => {
        const meta = getMeta(c);
        const byTier = tier === "ALL" || c.tier === tier;
        const byRole = role === "ALL" || c.role === role;
        const blob = `${c.name} ${c.role} ${meta.element} ${meta.weapon} ${c.summary} ${c.tags.join(" ")}`.toLowerCase();
        return byTier && byRole && (!search || blob.includes(search));
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} karakter cocok`;
    refs.metaGrid.innerHTML = filtered.length ? filtered.map((c) => characterCard(c)).join("") : emptyState("Karakter tidak ditemukan pada filter saat ini.");

    refs.table.innerHTML = tierOrder
      .map((tierKey) => {
        const chars = filtered.filter((c) => c.tier === tierKey);
        const note =
          tierKey === "S"
            ? "Prioritas utama untuk konten sulit dan progression cepat."
            : tierKey === "A"
              ? "Kuat dan stabil, terutama jika komposisi tim sudah rapi."
              : "Masih layak dipakai sebagai transisi atau role khusus.";
        return `<tr><td><span class="meta-tier ${tierClassMap[tierKey]}">${esc(tierKey)}</span></td><td><div class="tier-char-list">${buildTierChips(chars)}</div></td><td>${esc(note)}</td></tr>`;
      })
      .join("");
  };

  refs.search.addEventListener("input", redraw);
  refs.tier.addEventListener("change", redraw);
  refs.role.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function gearSummary(character, levelKey) {
  const slots = character.profile?.gearProgression?.[levelKey]?.slots || {};
  const names = progressionSlots.map((k) => slots[k]?.name).filter((name) => name && name !== "-");
  return names.length ? names.join(" | ") : "-";
}

function initBuildPage(characters) {
  const refs = {
    search: document.getElementById("build-search"),
    tier: document.getElementById("build-tier-filter"),
    sort: document.getElementById("build-sort"),
    grid: document.getElementById("build-grid"),
  };
  if (!refs.search || !refs.tier || !refs.sort || !refs.grid) return;

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const tier = refs.tier.value;
    const sortMode = refs.sort.value;

    const filtered = sortCharacters(
      characters
        .filter((c) => c.build)
        .filter((c) => {
          const meta = getMeta(c);
          const blob = `${c.name} ${c.role} ${meta.element} ${meta.weapon} ${c.build.weapon} ${c.build.team} ${gearSummary(c, "70")} ${gearSummary(c, "60")}`.toLowerCase();
          return (tier === "ALL" || c.tier === tier) && (!search || blob.includes(search));
        }),
      sortMode
    );

    refs.grid.innerHTML = filtered.length
      ? filtered
          .map(
            (c) => `
          <article class="card build-card">
            <div class="build-head">
              <img class="build-avatar" src="${asset(c.image)}" alt="${esc(c.name)} icon" loading="lazy" />
              <div>
                <span class="meta-tier ${tierClassMap[c.tier]}">Tier ${esc(c.tier)}</span>
                <h3>${esc(c.name)}</h3>
                <p><strong>Role:</strong> ${esc(c.role)}</p>
              </div>
            </div>
            <ul class="build-list">
              <li><strong>Senjata:</strong> ${esc(c.build.weapon)}</li>
              <li><strong>Prioritas Skill:</strong> ${esc(c.build.skills)}</li>
              <li><strong>Komposisi Tim:</strong> ${esc(c.build.team)}</li>
              <li><strong>Gear Lv70:</strong> ${esc(gearSummary(c, "70"))}</li>
              <li><strong>Gear Lv60:</strong> ${esc(gearSummary(c, "60"))}</li>
              <li><strong>Catatan:</strong> ${esc(c.build.notes)}</li>
            </ul>
            <a class="detail-link inline-link" href="${characterUrl(c.id)}">Lihat profil karakter</a>
          </article>`
          )
          .join("")
      : emptyState("Build tidak ditemukan. Ubah filter atau kata kunci.");
  };

  refs.search.addEventListener("input", redraw);
  refs.tier.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function toSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function roleTagsForCharacter(character) {
  const profile = character.profile || {};
  const roleBlob = `${character.role || ""} ${profile.role || ""}`.toLowerCase();
  const tags = new Set();

  if (roleBlob.includes("main dps") || roleBlob.includes("striker") || roleBlob.includes("caster") || roleBlob.includes("guard")) {
    tags.add("DPS");
  }
  if (roleBlob.includes("sub dps")) {
    tags.add("Sub DPS");
  }
  if (roleBlob.includes("support") || roleBlob.includes("buffer")) {
    tags.add("Support");
  }
  if (roleBlob.includes("sustain") || roleBlob.includes("defender")) {
    tags.add("Sustain");
  }
  if (roleBlob.includes("vanguard")) {
    tags.add("Vanguard");
  }
  if (tags.size === 0) {
    tags.add("Flex");
  }

  return [...tags];
}

function gearIdFromItem(source, name) {
  if (source && /^https?:\/\//i.test(source)) {
    try {
      const url = new URL(source);
      const segments = url.pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1];
      const slug = toSlug(last);
      if (slug) return slug;
    } catch (_error) {
      /* ignore URL parse errors */
    }
  }

  return toSlug(name) || "gear-item";
}

function renderBestForChips(bestFor) {
  if (!bestFor || bestFor.length === 0) {
    return '<span class="bestfor-chip bestfor-flex">Flex</span>';
  }
  return bestFor
    .map((tag) => `<span class="bestfor-chip bestfor-${toSlug(tag)}">${esc(tag)}</span>`)
    .join("");
}

function buildGearDatabase(characters, gearCatalog = []) {
  const map = new Map();
  const usedIds = new Set();

  function upsertGear(character, gear, slotKey, fallbackLevel) {
    if (!gear || !gear.name) return;

    const key = `${toSlug(gear.name)}::${String(gear.type || "-").toLowerCase().trim()}`;
    if (!key) return;

    const level = String(gear.usageLevel || fallbackLevel || "").trim();
    let entry = map.get(key);

    if (!entry) {
      entry = {
        key,
        id: "",
        name: gear.name,
        icon: gear.icon || "assets/skill-icons/basic.webp",
        source: gear.source || "#",
        effectName: gear.effectName || "-",
        effectDescription: gear.effectDescription || gear.description || "-",
        description: gear.description || "-",
        stats: Array.isArray(gear.stats) ? gear.stats : [],
        types: new Set(),
        usageLevels: new Set(),
        slots: new Set(),
        owners: new Map(),
      };
      map.set(key, entry);
    }

    entry.types.add(gear.type || "-");
    if (level) {
      entry.usageLevels.add(level);
    }
    if (slotKey) {
      entry.slots.add(slotTypeMap[slotKey] || slotKey);
    } else if (gear.type && gear.type !== "-") {
      entry.slots.add(gearType(gear.type));
    }

    if (character && character.id) {
      entry.owners.set(character.id, {
        id: character.id,
        name: character.name,
        image: character.image,
        role: character.role,
        tier: character.tier,
        tags: roleTagsForCharacter(character),
      });
    }

    if ((!entry.effectName || entry.effectName === "-") && gear.effectName) {
      entry.effectName = gear.effectName;
    }
    if ((!entry.effectDescription || entry.effectDescription === "-") && gear.effectDescription) {
      entry.effectDescription = gear.effectDescription;
    }
    if ((!entry.description || entry.description === "-") && gear.description) {
      entry.description = gear.description;
    }
    if ((!entry.stats || entry.stats.length === 0) && Array.isArray(gear.stats) && gear.stats.length > 0) {
      entry.stats = gear.stats;
    }
  }

  gearCatalog.forEach((gear) => {
    upsertGear(null, gear, null, gear.usageLevel || "");
  });

  characters.forEach((character) => {
    const profile = character.profile || {};
    const recommendations = profile.gearRecommendations || [];
    recommendations.forEach((gear) => {
      upsertGear(character, gear, null, gear.usageLevel || "70");
    });

    const progression = profile.gearProgression || {};
    progressionLevels.forEach((levelKey) => {
      const slots = progression[levelKey]?.slots || {};
      progressionSlots.forEach((slotKey) => {
        upsertGear(character, slots[slotKey], slotKey, levelKey);
      });
    });
  });

  return [...map.values()]
    .map((item, index) => {
      const types = [...item.types].sort((a, b) => collator.compare(gearType(a), gearType(b)));
      const usageLevels = [...item.usageLevels]
        .filter((value) => value)
        .sort((a, b) => Number(b) - Number(a) || collator.compare(a, b));
      const slots = [...item.slots].sort((a, b) => collator.compare(a, b));

      const owners = [...item.owners.values()].sort((a, b) => {
        const tierRankA = tierOrder.indexOf(a.tier);
        const tierRankB = tierOrder.indexOf(b.tier);
        const safeA = tierRankA === -1 ? 99 : tierRankA;
        const safeB = tierRankB === -1 ? 99 : tierRankB;
        if (safeA !== safeB) return safeA - safeB;
        return collator.compare(a.name, b.name);
      });

      const tagCount = new Map();
      owners.forEach((owner) => {
        owner.tags.forEach((tag) => {
          tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
        });
      });

      const bestFor = [...tagCount.entries()]
        .sort((a, b) => {
          if (b[1] !== a[1]) return b[1] - a[1];
          return roleTagOrder.indexOf(a[0]) - roleTagOrder.indexOf(b[0]);
        })
        .map(([tag]) => tag)
        .slice(0, 3);

      let candidateId = gearIdFromItem(item.source, item.name);
      if (!candidateId) {
        candidateId = `gear-${index + 1}`;
      }
      let uniqueId = candidateId;
      let counter = 2;
      while (usedIds.has(uniqueId)) {
        uniqueId = `${candidateId}-${counter}`;
        counter += 1;
      }
      usedIds.add(uniqueId);

      return {
        id: uniqueId,
        name: item.name,
        icon: item.icon,
        source: item.source,
        effectName: item.effectName || "-",
        effectDescription: item.effectDescription || "-",
        description: item.description || "-",
        stats: item.stats || [],
        types,
        usageLevels,
        owners,
        slots,
        bestFor: bestFor.length ? bestFor : ["Flex"],
      };
    })
    .sort((a, b) => collator.compare(a.name, b.name));
}

function initGearsPage(characters, gearCatalog = []) {
  const refs = {
    search: document.getElementById("gear-search"),
    type: document.getElementById("gear-type-filter"),
    level: document.getElementById("gear-level-filter"),
    set: document.getElementById("gear-set-filter"),
    bestfor: document.getElementById("gear-bestfor-filter"),
    sort: document.getElementById("gear-sort"),
    count: document.getElementById("gear-count"),
    grid: document.getElementById("gear-db-grid"),
  };

  if (!refs.search || !refs.type || !refs.level || !refs.set || !refs.bestfor || !refs.sort || !refs.count || !refs.grid) {
    return;
  }

  const gearItems = buildGearDatabase(characters, gearCatalog);

  const typeValues = [...new Set(gearItems.flatMap((item) => item.types))].sort((a, b) =>
    collator.compare(gearType(a), gearType(b))
  );
  refs.type.innerHTML = [
    '<option value="ALL">Semua Tipe</option>',
    ...typeValues.map((typeValue) => `<option value="${esc(typeValue)}">${esc(gearType(typeValue))}</option>`),
  ].join("");

  const levelValues = [...new Set(gearItems.flatMap((item) => item.usageLevels))].sort(
    (a, b) => Number(b) - Number(a) || collator.compare(a, b)
  );
  refs.level.innerHTML = [
    '<option value="ALL">Semua Level</option>',
    ...levelValues.map((levelValue) => `<option value="${esc(levelValue)}">Usage Lv ${esc(levelValue)}</option>`),
  ].join("");

  const setValues = [...new Set(gearItems.map((item) => item.effectName).filter((value) => value && value !== "-"))].sort((a, b) =>
    collator.compare(a, b)
  );
  refs.set.innerHTML = [
    '<option value="ALL">Semua Set</option>',
    ...setValues.map((setValue) => `<option value="${esc(setValue)}">${esc(setValue)}</option>`),
  ].join("");

  const bestForValues = [...new Set(gearItems.flatMap((item) => item.bestFor))]
    .filter(Boolean)
    .sort((a, b) => {
      const idxA = roleTagOrder.indexOf(a);
      const idxB = roleTagOrder.indexOf(b);
      if (idxA === -1 && idxB === -1) return collator.compare(a, b);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });
  refs.bestfor.innerHTML = [
    '<option value="ALL">Best for: Semua</option>',
    ...bestForValues.map((value) => `<option value="${esc(value)}">${esc(value)}</option>`),
  ].join("");

  const sortList = (items, mode) => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      if (mode === "AZ") return collator.compare(a.name, b.name);
      if (mode === "ZA") return collator.compare(b.name, a.name);
      const levelA = Number(a.usageLevels[0] || 0);
      const levelB = Number(b.usageLevels[0] || 0);
      if (levelA !== levelB) return levelB - levelA;
      return collator.compare(a.name, b.name);
    });
    return sorted;
  };

  const renderOwners = (owners) => {
    if (!owners || owners.length === 0) {
      return '<span class="tier-empty">Belum ada karakter terhubung.</span>';
    }
    return owners
      .map(
        (owner) => `<a class="owner-chip" href="${characterUrl(owner.id)}" title="Buka ${esc(owner.name)}">${esc(owner.name)}</a>`
      )
      .join("");
  };

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const type = refs.type.value;
    const level = refs.level.value;
    const setName = refs.set.value;
    const bestFor = refs.bestfor.value;
    const sortMode = refs.sort.value;

    const filtered = sortList(
      gearItems.filter((item) => {
        const byType = type === "ALL" || item.types.includes(type);
        const byLevel = level === "ALL" || item.usageLevels.includes(level);
        const bySet = setName === "ALL" || item.effectName === setName;
        const byBestFor = bestFor === "ALL" || item.bestFor.includes(bestFor);
        const blob =
          `${item.name} ${item.effectName} ${item.effectDescription} ${item.description} ${item.types.join(" ")} ${item.usageLevels.join(" ")} ${item.slots.join(" ")} ${item.bestFor.join(" ")} ${item.owners.map((owner) => owner.name).join(" ")}`.toLowerCase();
        const bySearch = !search || blob.includes(search);
        return byType && byLevel && bySet && byBestFor && bySearch;
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} gear cocok`;

    refs.grid.innerHTML =
      filtered.length === 0
        ? emptyState("Gear tidak ditemukan. Coba ubah filter atau kata kunci.")
        : filtered
            .map(
              (item) => `
            <article class="card gear-db-card">
              <div class="gear-head">
                <img class="gear-icon" src="${asset(item.icon)}" alt="${esc(item.name)} icon" loading="lazy" />
                <div>
                  <h3><a class="gear-title-link" href="${gearUrl(item.id)}">${esc(item.name)}</a></h3>
                  <p class="gear-meta">Tipe: ${esc(item.types.map((typeValue) => gearType(typeValue)).join(" / ") || "-")} | Usage Lv: ${esc(item.usageLevels.join(", ") || "-")}</p>
                </div>
              </div>
              <p><strong>Set:</strong> ${esc(item.effectName || "-")}</p>
              <div class="bestfor-row">
                <span class="bestfor-label">Best for:</span>
                ${renderBestForChips(item.bestFor)}
              </div>
              <p>${esc(item.effectDescription || item.description || "-")}</p>
              <ul class="gear-stats">${renderStats(item.stats)}</ul>
              <p class="gear-slot"><strong>Slot umum:</strong> ${esc(item.slots.join(", ") || "-")}</p>
              <div class="owner-list">
                ${renderOwners(item.owners)}
              </div>
              <div class="gear-actions">
                <a class="detail-link inline-link" href="${gearUrl(item.id)}">Buka detail gear</a>
                <a class="detail-link inline-link" href="${esc(item.source || "#")}" target="_blank" rel="noreferrer noopener">Sumber gear</a>
              </div>
            </article>
          `
            )
            .join("");
  };

  refs.search.addEventListener("input", redraw);
  refs.type.addEventListener("change", redraw);
  refs.level.addEventListener("change", redraw);
  refs.set.addEventListener("change", redraw);
  refs.bestfor.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function initGearDetailPage(characters, gearCatalog = []) {
  const status = document.getElementById("gear-detail-status");
  const target = document.getElementById("gear-detail");
  if (!status || !target) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    status.textContent = "Gear belum dipilih.";
    target.innerHTML = emptyState("Buka item gear dari halaman Gear Database.");
    return;
  }

  const gearItems = buildGearDatabase(characters, gearCatalog);
  const item = gearItems.find((gear) => gear.id === id);

  if (!item) {
    status.textContent = "Gear tidak ditemukan.";
    target.innerHTML = emptyState("ID gear tidak valid. Pilih ulang dari halaman Gear Database.");
    return;
  }

  status.textContent = "Detail gear berhasil dimuat.";
  applyDynamicMeta({
    title: `${item.name} | Gear Detail | Endfield Web`,
    description: `Detail gear ${item.name}: stats, efek set, usage level, dan rekomendasi karakter pengguna di Endfield Web.`,
    canonicalUrl: toAbsoluteSiteUrl(`/gear/?id=${encodeURIComponent(item.id)}`),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      `${item.name} endfield gear`,
      `detail ${item.name} endfield`,
      "gear endfield terbaik",
      "stats gear endfield",
      "efek set endfield",
      "arknights endfield indonesia",
    ],
  });

  const ownerHtml =
    item.owners.length === 0
      ? emptyState("Belum ada karakter yang terhubung.")
      : item.owners
          .map(
            (owner) => `
        <article class="owner-mini">
          <a class="owner-mini-link" href="${characterUrl(owner.id)}">
            <img class="owner-mini-avatar" src="${asset(owner.image)}" alt="${esc(owner.name)} icon" loading="lazy" />
            <div>
              <p class="owner-mini-name">${esc(owner.name)}</p>
              <p class="owner-mini-meta">Tier ${esc(owner.tier)} | ${esc(owner.role)}</p>
            </div>
          </a>
        </article>
      `
          )
          .join("");

  target.innerHTML = `
    <article class="card gear-shell">
      <div class="gear-shell-top">
        <img class="gear-shell-icon" src="${asset(item.icon)}" alt="${esc(item.name)} icon" loading="eager" />
        <div>
          <h1>${esc(item.name)}</h1>
          <p class="gear-meta">Tipe: ${esc(item.types.map((typeValue) => gearType(typeValue)).join(" / ") || "-")}</p>
          <p class="gear-meta">Usage Level: ${esc(item.usageLevels.join(", ") || "-")}</p>
          <p class="gear-meta">Slot Umum: ${esc(item.slots.join(", ") || "-")}</p>
          <div class="bestfor-row">
            <span class="bestfor-label">Best for:</span>
            ${renderBestForChips(item.bestFor)}
          </div>
        </div>
      </div>
      <p><strong>Nama Set:</strong> ${esc(item.effectName || "-")}</p>
      <p>${esc(item.effectDescription || item.description || "-")}</p>
      <ul class="gear-stats">${renderStats(item.stats)}</ul>
      <a class="detail-link inline-link" href="${esc(item.source || "#")}" target="_blank" rel="noreferrer noopener">Sumber gear</a>
    </article>

    <article class="section-block">
      <h2>Karakter Pengguna</h2>
      <div class="owner-mini-grid">
        ${ownerHtml}
      </div>
    </article>
  `;
}

function initCharactersPage(characters) {
  const refs = {
    search: document.getElementById("chars-search"),
    element: document.getElementById("chars-element"),
    weapon: document.getElementById("chars-weapon"),
    sort: document.getElementById("chars-sort"),
    count: document.getElementById("chars-count"),
    grid: document.getElementById("chars-grid"),
  };
  if (!refs.search || !refs.element || !refs.weapon || !refs.sort || !refs.count || !refs.grid) return;

  refs.element.innerHTML = ["ALL", ...new Set(characters.map((c) => getMeta(c).element).filter((v) => v && v !== "-"))]
    .map((v) => `<option value="${esc(v)}">${esc(v === "ALL" ? "Semua Elemen" : v)}</option>`)
    .join("");
  refs.weapon.innerHTML = ["ALL", ...new Set(characters.map((c) => getMeta(c).weapon).filter((v) => v && v !== "-"))]
    .map((v) => `<option value="${esc(v)}">${esc(v === "ALL" ? "Semua Weapon" : v)}</option>`)
    .join("");

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const element = refs.element.value;
    const weapon = refs.weapon.value;
    const sortMode = refs.sort.value;

    const filtered = sortCharacters(
      characters.filter((c) => {
        const meta = getMeta(c);
        const byElement = element === "ALL" || meta.element === element;
        const byWeapon = weapon === "ALL" || meta.weapon === weapon;
        const blob = `${c.name} ${c.role} ${meta.role} ${meta.element} ${meta.weapon} ${c.summary} ${c.tags.join(" ")}`.toLowerCase();
        return byElement && byWeapon && (!search || blob.includes(search));
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} karakter cocok`;
    refs.grid.innerHTML = filtered.length ? filtered.map((c) => characterCard(c)).join("") : emptyState("Karakter tidak ditemukan. Ubah filter atau kata kunci.");
  };

  refs.search.addEventListener("input", redraw);
  refs.element.addEventListener("change", redraw);
  refs.weapon.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function renderStats(stats) {
  if (!Array.isArray(stats) || stats.length === 0) return "<li><strong>Stat:</strong> -</li>";
  return stats.map((s) => `<li><strong>${esc(s.name)}:</strong> ${esc(s.value)}</li>`).join("");
}

function renderProgression(levelKey, level) {
  if (!level) return `<article class="card progression-card"><h3>Level ${esc(levelKey)}</h3><p>Belum ada data progression untuk level ini.</p></article>`;

  const slots = level.slots || {};
  const slotHtml = progressionSlots
    .map((slotKey) => {
      const slot = slots[slotKey] || {};
      return `
        <article class="slot-card">
          <div class="slot-head">
            <img class="slot-icon" src="${asset(slot.icon || "assets/skill-icons/basic.webp")}" alt="${esc(slot.name || slotTypeMap[slotKey])} icon" loading="lazy" />
            <div>
              <p class="slot-label">${esc(slot.slot || slotTypeMap[slotKey])}</p>
              <h4>${esc(slot.name || "-")}</h4>
              <p class="slot-meta">Tipe: ${esc(gearType(slot.type))} | Usage Lv: ${esc(slot.usageLevel || levelKey)}</p>
            </div>
          </div>
          <ul class="gear-stats compact-stats">${renderStats(slot.stats)}</ul>
          <p><strong>Efek:</strong> ${esc(slot.effectName || "-")}</p>
          <p>${esc(slot.effectDescription || slot.description || "-")}</p>
          <p><strong>Rekomendasi:</strong> ${esc(slot.recommendation || "Sesuaikan dengan kebutuhan tim.")}</p>
          <a class="detail-link inline-link" href="${esc(slot.source || "#")}" target="_blank" rel="noreferrer noopener">Sumber gear</a>
        </article>`;
    })
    .join("");

  return `
    <article class="card progression-card">
      <div class="progression-head">
        <h3>${esc(level.label || `Level ${levelKey}`)}</h3>
        <p class="progression-focus">${esc(level.focus || "-")}</p>
      </div>
      <p class="progression-note"><strong>Prioritas upgrade:</strong> ${esc(level.upgradeNote || "-")}</p>
      <div class="slot-grid">${slotHtml}</div>
    </article>`;
}

function renderCharacterDetail(character) {
  const status = document.getElementById("profile-status");
  const target = document.getElementById("character-detail");
  if (!status || !target) return;

  const profile = character.profile || {};
  const intro = profile.intro || [];
  const story = profile.storyHighlights || [];
  const skills = profile.skills || [];
  const gears = profile.gearRecommendations || [];
  const progression = profile.gearProgression || {};

  const introHtml = intro.length ? intro.map((line) => `<p>${esc(line)}</p>`).join("") : "<p>Profil naratif untuk karakter ini belum lengkap.</p>";
  const storyHtml = story.length ? story.map((line) => `<li>${esc(line)}</li>`).join("") : "<li>Belum ada highlight kisah tambahan.</li>";
  const skillHtml = skills.length
    ? skills
        .map(
          (skill) => `
        <article class="card skill-card">
          <div class="skill-head">
            <img class="skill-icon" src="${asset(skill.icon)}" alt="${esc(skill.name)} icon" loading="lazy" />
            <div><p class="skill-type">${esc(skillType(skill.type))}</p><h3>${esc(skill.name)}</h3></div>
          </div>
          <p>${esc(skill.description)}</p>
          <p><strong>Cara pakai:</strong> ${esc(skill.usage || "Lihat rotasi tim dan cooldown saat combat.")}</p>
        </article>`
        )
        .join("")
    : emptyState("Data skill belum tersedia untuk karakter ini.");

  const progressionHtml = progressionLevels.map((levelKey) => renderProgression(levelKey, progression[levelKey])).join("");

  const gearHtml = gears.length
    ? gears
        .map(
          (gear) => `
        <article class="card gear-card">
          <div class="gear-head">
            <img class="gear-icon" src="${asset(gear.icon)}" alt="${esc(gear.name)} icon" loading="lazy" />
            <div>
              <h3>${esc(gear.name)}</h3>
              <p class="gear-meta">Tipe: ${esc(gearType(gear.type))} | Usage Lv: ${esc(gear.usageLevel || "-")}</p>
            </div>
          </div>
          <ul class="gear-stats">${renderStats(gear.stats)}</ul>
          <p><strong>Efek Set:</strong> ${esc(gear.effectName || "-")}</p>
          <p>${esc(gear.effectDescription || gear.description || "-")}</p>
          <a class="detail-link inline-link" href="${esc(gear.source || "#")}" target="_blank" rel="noreferrer noopener">Sumber gear</a>
        </article>`
        )
        .join("")
    : emptyState("Data gear belum tersedia untuk karakter ini.");

  status.textContent = `Profil dimuat dari data update ${toDateLabel(profile.updatedAt)}`;
  applyDynamicMeta({
    title: `${character.name} | Profil Karakter Endfield | Endfield Web`,
    description: `${character.name} di Arknights: Endfield - role ${profile.role || character.role}, elemen ${profile.element || "-"}, build, skill, dan progression gear lengkap.`,
    canonicalUrl: toAbsoluteSiteUrl(`/character/?id=${encodeURIComponent(character.id)}`),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      `${character.name} endfield build`,
      `${character.name} endfield gear`,
      `${character.name} endfield skill`,
      `${character.name} endfield team`,
      "karakter endfield terbaik",
      "arknights endfield indonesia",
    ],
  });

  target.innerHTML = `
    <article class="card character-shell">
      <div class="character-top">
        <img class="character-portrait" src="${asset(character.image)}" alt="${esc(character.name)} icon" loading="eager" />
        <div>
          <span class="meta-tier ${tierClassMap[character.tier]}">Tier ${esc(character.tier)}</span>
          <h1>${esc(character.name)}</h1>
          <p>${esc(character.summary)}</p>
          <div class="chip-row">
            <span class="mini-chip">Role: ${esc(profile.role || character.role)}</span>
            <span class="mini-chip">Rarity: ${esc(profile.rarity || "-")}</span>
            <span class="mini-chip">Element: ${esc(profile.element || "-")}</span>
            <span class="mini-chip">Weapon: ${esc(profile.weapon || "-")}</span>
          </div>
          <p class="stamp">Playstyle: ${esc(profile.playstyle || "Belum ada catatan playstyle")}</p>
        </div>
      </div>
    </article>

    <div class="profile-grid">
      <article class="card"><h2>Profil</h2>${introHtml}</article>
      <article class="card"><h2>Kisah Singkat</h2><ul class="story-list">${storyHtml}</ul></article>
    </div>

    <article class="section-block">
      <h2>Skill, Fungsi, dan Cara Pakai</h2>
      <div class="grid skill-grid">${skillHtml}</div>
    </article>

    <article class="card">
      <h2>Build Rekomendasi</h2>
      <ul class="build-list">
        <li><strong>Senjata:</strong> ${esc(character.build?.weapon || "-")}</li>
        <li><strong>Prioritas Skill:</strong> ${esc(character.build?.skills || "-")}</li>
        <li><strong>Komposisi Tim:</strong> ${esc(character.build?.team || "-")}</li>
        <li><strong>Catatan:</strong> ${esc(character.build?.notes || "-")}</li>
      </ul>
    </article>

    <article class="section-block">
      <h2>Progression Gear + Kit Slot 1/2</h2>
      <p class="section-sub">Rute build dibagi untuk level 70, 60, dan 50 ke bawah agar transisi gear lebih aman.</p>
      <div class="grid progression-grid">${progressionHtml}</div>
    </article>

    <article class="section-block">
      <h2>Daftar Gear Lengkap (Referensi Set)</h2>
      <div class="grid gear-grid">${gearHtml}</div>
      <p class="stamp">Sumber profil: <a href="${esc(profile.source || "#")}" target="_blank" rel="noreferrer noopener">${esc(profile.source || "tidak tersedia")}</a></p>
    </article>`;
}

function initCharacterPage(characters) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const status = document.getElementById("profile-status");
  const target = document.getElementById("character-detail");
  if (!status || !target) return;

  if (!id) {
    status.textContent = "Karakter belum dipilih.";
    target.innerHTML = emptyState("Buka detail dari halaman characters, tierlist, atau builds.");
    return;
  }

  const character = characters.find((item) => item.id === id);
  if (!character) {
    status.textContent = "Karakter tidak ditemukan.";
    target.innerHTML = emptyState("ID karakter tidak valid. Coba buka dari daftar characters.");
    return;
  }

  renderCharacterDetail(character);
}

async function fetchData() {
  const response = await fetch(withRoot("data/content.json"));
  if (!response.ok) throw new Error("Gagal memuat data JSON");
  return response.json();
}

async function bootstrap() {
  if (page !== "gacha") initGlobalBgm();
  initNavDrawer();
  const data = await fetchData();

  if (page === "home") return renderHome(data);
  if (page === "gacha") return initGachaPage(data);
  if (page === "helps") return initTipsPage(data.tips);
  if (page === "team-comps") return initTeamCompsPage(data.teamComps || [], data.characters || []);
  if (page === "tierlist") return initTierPage(data.characters);
  if (page === "builds") return initBuildPage(data.characters);
  if (page === "gears") return initGearsPage(data.characters, data.gearCatalog || []);
  if (page === "gear") return initGearDetailPage(data.characters, data.gearCatalog || []);
  if (page === "characters") return initCharactersPage(data.characters);
  if (page === "character") return initCharacterPage(data.characters);
}

bootstrap().catch((error) => {
  console.error(error);
  const stamp = document.getElementById("data-stamp") || document.getElementById("profile-status");
  if (stamp) stamp.textContent = "Data gagal dimuat";
});
