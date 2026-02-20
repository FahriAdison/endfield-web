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
const NAV_ITEMS = [
  { id: "home", label: "Home", path: "" },
  { id: "characters", label: "Characters", path: "characters/" },
  { id: "tierlist", label: "Tierlist", path: "tierlist/" },
  { id: "builds", label: "Builds", path: "builds/" },
  { id: "team-comps", label: "Team Comps", path: "team-comps/" },
  { id: "gears", label: "Gears", path: "gears/" },
  { id: "chests", label: "Chest Map", path: "chests/" },
  { id: "events", label: "Events", path: "events/" },
  { id: "codes", label: "Redeem Codes", path: "codes/" },
  { id: "card-creator", label: "Card Creator", path: "card-creator/" },
  { id: "gacha", label: "Gacha Sim", path: "gacha/" },
  { id: "helps", label: "Tips", path: "helps/" },
];
const NAV_ACTIVE_GROUPS = {
  home: ["home"],
  characters: ["characters", "character"],
  tierlist: ["tierlist"],
  builds: ["builds"],
  "team-comps": ["team-comps"],
  gears: ["gears", "gear"],
  chests: ["chests"],
  events: ["events"],
  codes: ["codes"],
  "card-creator": ["card-creator"],
  gacha: ["gacha"],
  helps: ["helps"],
};

const page = document.body?.dataset.page || "home";
const rawRoot = document.body?.dataset.basePath || ".";
const root = rawRoot.endsWith("/") && rawRoot !== "/" ? rawRoot.slice(0, -1) : rawRoot;

function withRoot(path) {
  if (path === "") {
    if (root === "." || root === "") return "./";
    if (root === "/") return "/";
    return `${root}/`;
  }
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const cleaned = path.replace(/^\.\//, "").replace(/^\//, "");
  if (root === "." || root === "") return `./${cleaned}`;
  if (root === "/") return `/${cleaned}`;
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

function activeNavGroupsForPage(currentPage) {
  return new Set(
    Object.entries(NAV_ACTIVE_GROUPS)
      .filter(([, pages]) => Array.isArray(pages) && pages.includes(currentPage))
      .map(([id]) => id)
  );
}

function syncPrimaryNavigation() {
  const nav = document.querySelector(".nav");
  const links = nav?.querySelector(".nav-links");
  if (!nav || !links) return;
  const activeGroups = activeNavGroupsForPage(page);
  links.innerHTML = NAV_ITEMS.map((item) => {
    const isActive = activeGroups.has(item.id);
    const cls = isActive ? ' class="active"' : "";
    const href = item.path ? withRoot(item.path) : withRoot("");
    return `<a${cls} href="${esc(href)}">${esc(item.label)}</a>`;
  }).join("");
}

function initPageLoader() {
  if (!document.body) return null;
  let loader = document.getElementById("page-loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "page-loader";
    loader.className = "page-loader";
    loader.innerHTML = `
      <div class="page-loader-shell">
        <div class="page-loader-mark"></div>
        <div class="page-loader-bars" aria-hidden="true">
          <span></span><span></span><span></span><span></span>
        </div>
        <p class="page-loader-title">ENDMINSYNC</p>
        <p class="page-loader-text" id="page-loader-text">Menyiapkan data Endfield...</p>
      </div>
    `;
    document.body.appendChild(loader);
    requestAnimationFrame(() => loader.classList.add("show"));
  }

  const text = loader.querySelector("#page-loader-text");
  const setText = (value) => {
    if (text && value) text.textContent = value;
  };
  const fail = (value) => {
    if (value) setText(value);
    loader.classList.add("is-error");
  };
  const hide = (delay = 180) => {
    window.setTimeout(() => {
      loader.classList.remove("show");
      window.setTimeout(() => loader.remove(), 320);
    }, Math.max(0, delay));
  };

  return { setText, fail, hide };
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sourceLabelFromUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (host.includes("gamewith.net")) return "GameWith";
    if (host.includes("game8.co")) return "Game8";
    if (host.includes("arknightsendfield.gg")) return "ArknightsEndfield.gg";
    if (host.includes("prydwen.gg")) return "Prydwen";
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return "Sumber";
  }
}

function normalizeSourceEntry(entry) {
  if (!entry) return null;
  if (typeof entry === "string") {
    const url = entry.trim();
    if (!url) return null;
    return { url, label: sourceLabelFromUrl(url) };
  }
  if (typeof entry === "object") {
    const url = String(entry.url || entry.href || "").trim();
    if (!url) return null;
    const label = String(entry.label || entry.name || sourceLabelFromUrl(url)).trim() || sourceLabelFromUrl(url);
    return { url, label };
  }
  return null;
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

function toShortDateLabel(isoDateTime) {
  if (!isoDateTime) return "-";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function statusLabel(status) {
  const map = {
    active: "Aktif",
    upcoming: "Akan Datang",
    completed: "Selesai",
    expired: "Kadaluarsa",
    "likely-active": "Kemungkinan Aktif",
  };
  return map[String(status || "").toLowerCase()] || "Unknown";
}

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "active" || key === "likely-active") return "is-active";
  if (key === "upcoming") return "is-upcoming";
  if (key === "completed" || key === "expired") return "is-expired";
  return "is-default";
}

function eventStatusFromDates(event) {
  const manual = String(event?.status || "").toLowerCase();
  if (manual === "active" || manual === "upcoming" || manual === "completed") return manual;
  const now = Date.now();
  const start = event?.startAt ? new Date(event.startAt).getTime() : NaN;
  const end = event?.endAt ? new Date(event.endAt).getTime() : NaN;
  if (Number.isFinite(start) && now < start) return "upcoming";
  if (Number.isFinite(end) && now > end) return "completed";
  return "active";
}

function eventCountdownLabel(event) {
  const now = Date.now();
  const start = event?.startAt ? new Date(event.startAt).getTime() : NaN;
  const end = event?.endAt ? new Date(event.endAt).getTime() : NaN;
  const status = eventStatusFromDates(event);
  if (status === "upcoming" && Number.isFinite(start)) return `Mulai dalam ${toCountdownLabel(start - now)}`;
  if (status === "active" && Number.isFinite(end)) return `Selesai dalam ${toCountdownLabel(end - now)}`;
  return "Arsip event";
}

function eventSortRank(status) {
  if (status === "active") return 0;
  if (status === "upcoming") return 1;
  if (status === "completed") return 2;
  return 3;
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

let revealObserver = null;
function ensureRevealObserver() {
  if (revealObserver) return revealObserver;
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add("reveal-visible");
        revealObserver?.unobserve(target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  return revealObserver;
}

function applyRevealAnimation(scope, selector) {
  const rootNode = typeof scope === "string" ? document.querySelector(scope) : scope;
  if (!rootNode) return;
  const observer = ensureRevealObserver();
  const nodes = Array.from(rootNode.querySelectorAll(selector));
  nodes.forEach((node, index) => {
    if (node.dataset.revealReady === "1") return;
    node.dataset.revealReady = "1";
    node.classList.add("reveal-item");
    node.style.setProperty("--reveal-delay", `${Math.min(index * 48, 420)}ms`);
    observer.observe(node);
  });
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
  window.addEventListener("resize", () => setOpen(false));
}

async function renderHome(data) {
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

  const homeEventsGrid = document.getElementById("home-events-grid");
  const homeCodesGrid = document.getElementById("home-codes-grid");
  if (homeEventsGrid || homeCodesGrid) {
    try {
      const liveHub = await fetchLiveHubData();
      const events = Array.isArray(liveHub?.events) ? liveHub.events : [];
      const codes = Array.isArray(liveHub?.codes) ? liveHub.codes : [];

      if (homeEventsGrid) {
        const eventPreview = [...events]
          .map((item) => ({ ...item, _status: eventStatusFromDates(item) }))
          .sort((a, b) => {
            const rs = eventSortRank(a._status) - eventSortRank(b._status);
            if (rs !== 0) return rs;
            const at = new Date(a.startAt || 0).getTime();
            const bt = new Date(b.startAt || 0).getTime();
            return bt - at;
          })
          .slice(0, 3);

        homeEventsGrid.innerHTML = eventPreview.length
          ? eventPreview
              .map((event) => {
                const status = event._status;
                return `
                  <article class="card event-card compact">
                    <img class="event-cover" src="${asset(event.image || "assets/images/hero-share.jpg")}" alt="${esc(event.title)}" loading="lazy" />
                    <div class="event-card-body">
                      <div class="event-row">
                        <span class="event-chip ${statusClass(status)}">${esc(statusLabel(status))}</span>
                        <span class="event-time">${esc(toShortDateLabel(event.startAt))}</span>
                      </div>
                      <h3>${esc(event.title)}</h3>
                      <p>${esc(event.highlight || event.summary || "-")}</p>
                      <a class="detail-link inline-link" href="${withRoot("events/")}">Buka detail event</a>
                    </div>
                  </article>`;
              })
              .join("")
          : emptyState("Belum ada data event.");
        applyRevealAnimation(homeEventsGrid, ".event-card");
      }

      if (homeCodesGrid) {
        const codePreview = [...codes]
          .sort((a, b) => {
            const ar = eventSortRank(String(a.status).replace("likely-active", "active"));
            const br = eventSortRank(String(b.status).replace("likely-active", "active"));
            return ar - br;
          })
          .slice(0, 3);

        homeCodesGrid.innerHTML = codePreview.length
          ? codePreview
              .map(
                (item) => `
              <article class="card code-card compact">
                <div class="code-top">
                  <span class="event-chip ${statusClass(item.status)}">${esc(statusLabel(item.status))}</span>
                  <span class="code-platform">${esc(item.platform || "-")}</span>
                </div>
                <h3>${esc(item.code || "-")}</h3>
                <p>${esc(item.reward || "-")}</p>
                <a class="detail-link inline-link" href="${withRoot("codes/")}">Lihat semua code</a>
              </article>`
              )
              .join("")
          : emptyState("Belum ada data redeem code.");
        applyRevealAnimation(homeCodesGrid, ".code-card");
      }
    } catch {
      if (homeEventsGrid) homeEventsGrid.innerHTML = emptyState("Preview event belum bisa dimuat.");
      if (homeCodesGrid) homeCodesGrid.innerHTML = emptyState("Preview code belum bisa dimuat.");
    }
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
    title: `${item.name} Gear Endfield Indonesia | Endfield Web`,
    description: `Detail gear ${item.name} di Arknights: Endfield Indonesia: stats, efek set, usage level, best for, dan rekomendasi karakter pengguna.`,
    canonicalUrl: toAbsoluteSiteUrl(`/gear/?id=${encodeURIComponent(item.id)}`),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      `${item.name} gear endfield indonesia`,
      `detail ${item.name} endfield`,
      `stats ${item.name} endfield`,
      "gear endfield terbaik",
      "stats gear endfield",
      "efek set endfield",
      "endfield guide indonesia",
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
  const characterTips = profile.characterTips || [];
  const tipsSources = profile.tipsSources || [];
  const advancedTips = profile.advancedTips || {};
  const skills = profile.skills || [];
  const gears = profile.gearRecommendations || [];
  const progression = profile.gearProgression || {};

  const introHtml = intro.length ? intro.map((line) => `<p>${esc(line)}</p>`).join("") : "<p>Profil naratif untuk karakter ini belum lengkap.</p>";
  const storyHtml = story.length ? story.map((line) => `<li>${esc(line)}</li>`).join("") : "<li>Belum ada highlight kisah tambahan.</li>";
  const tipsHtml = characterTips.length ? characterTips.map((tip) => `<li>${esc(tip)}</li>`).join("") : "<li>Tips praktis belum tersedia untuk karakter ini.</li>";
  const advancedEarly = advancedTips.earlyGame || [];
  const advancedMid = advancedTips.midGame || [];
  const advancedEnd = advancedTips.endGame || [];
  const advancedRotation = advancedTips.rotation || [];
  const advancedMistakes = advancedTips.commonMistakes || [];
  const hasAdvancedTips = advancedEarly.length || advancedMid.length || advancedEnd.length || advancedRotation.length || advancedMistakes.length;
  const renderStoryFallback = (items, fallback) =>
    items.length ? items.map((item) => `<li>${esc(item)}</li>`).join("") : `<li>${esc(fallback)}</li>`;
  const tipSources = tipsSources.map((source) => normalizeSourceEntry(source)).filter(Boolean);
  const tipsSourcesHtml = tipSources.length
    ? `<ul class="source-list tip-source-list">${tipSources
        .map(
          (source) =>
            `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer noopener" title="${esc(source.url)}">${esc(source.label)}</a></li>`
        )
        .join("")}</ul>`
    : '<p class="stamp">Referensi tips belum ditautkan.</p>';
  const tipsToggleHtml = hasAdvancedTips
    ? `
      <article class="card tips-toggle-shell">
        <div class="tips-toggle-header">
          <h2>Panduan Tips Karakter</h2>
          <div class="tips-toggle-controls" role="tablist" aria-label="Mode tips karakter">
            <button type="button" class="tips-toggle-btn active" data-tips-mode="basic" role="tab" aria-selected="true">Basic Tips</button>
            <button type="button" class="tips-toggle-btn" data-tips-mode="advanced" role="tab" aria-selected="false">Advanced Guide</button>
          </div>
        </div>
        <p class="stamp">Mode basic cocok untuk ringkasan cepat, mode advanced untuk rotasi dan koreksi kesalahan umum.</p>
      </article>`
    : "";
  const basicTipsClass = hasAdvancedTips ? "card tips-panel" : "card";
  const advancedTipsHtml = hasAdvancedTips
    ? `
      <article class="section-block tips-panel tips-panel-hidden" data-tips-panel="advanced" aria-hidden="true">
        <h2>Advanced Guide (Early / Mid / Endgame)</h2>
        <div class="grid advanced-grid">
          <article class="card advanced-card">
            <h3>Early Game (Lv 1-50)</h3>
            <ul class="story-list">${renderStoryFallback(advancedEarly, "Belum ada catatan early game.")}</ul>
          </article>
          <article class="card advanced-card">
            <h3>Mid Game (Lv 50-60)</h3>
            <ul class="story-list">${renderStoryFallback(advancedMid, "Belum ada catatan mid game.")}</ul>
          </article>
          <article class="card advanced-card">
            <h3>Endgame (Lv 70+)</h3>
            <ul class="story-list">${renderStoryFallback(advancedEnd, "Belum ada catatan endgame.")}</ul>
          </article>
        </div>
        <div class="grid advanced-grid secondary">
          <article class="card advanced-card">
            <h3>Rotasi Singkat</h3>
            <ol class="story-list advanced-list-order">${renderStoryFallback(advancedRotation, "Rotasi belum tersedia.")}</ol>
          </article>
          <article class="card advanced-card">
            <h3>Kesalahan Yang Sering Terjadi</h3>
            <ul class="story-list">${renderStoryFallback(advancedMistakes, "Belum ada catatan kesalahan umum.")}</ul>
          </article>
        </div>
        ${
          advancedTips.updatedAt
            ? `<p class="stamp">Advanced tips update: ${esc(toDateLabel(advancedTips.updatedAt))}</p>`
            : ""
        }
      </article>`
    : "";
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
    title: `${character.name} Build & Profil Endfield Indonesia | Endfield Web`,
    description: `${character.name} di Arknights: Endfield Indonesia - role ${profile.role || character.role}, elemen ${profile.element || "-"}, build, skill, tips, dan progression gear lengkap.`,
    canonicalUrl: toAbsoluteSiteUrl(`/character/?id=${encodeURIComponent(character.id)}`),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      `${character.name} endfield build`,
      `${character.name} endfield gear`,
      `${character.name} endfield skill`,
      `${character.name} endfield team`,
      `${character.name} endfield indonesia`,
      "endfield guide indonesia",
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

    ${tipsToggleHtml}

    <article class="${basicTipsClass}" data-tips-panel="basic" aria-hidden="false">
      <h2>Tips Praktis Karakter</h2>
      <ul class="story-list">${tipsHtml}</ul>
      ${tipsSourcesHtml}
    </article>

    ${advancedTipsHtml}

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
  initCharacterTipsToggle(target);
}

function initCharacterTipsToggle(container) {
  if (!container) return;
  const buttons = Array.from(container.querySelectorAll("[data-tips-mode]"));
  const panels = Array.from(container.querySelectorAll("[data-tips-panel]"));
  if (buttons.length < 2 || panels.length < 2) return;

  const applyMode = (mode) => {
    const available = panels.some((panel) => panel.dataset.tipsPanel === mode);
    const nextMode = available ? mode : "basic";

    buttons.forEach((button) => {
      const isActive = button.dataset.tipsMode === nextMode;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
      button.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panels.forEach((panel) => {
      const show = panel.dataset.tipsPanel === nextMode;
      panel.classList.toggle("tips-panel-hidden", !show);
      panel.setAttribute("aria-hidden", show ? "false" : "true");
    });
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyMode(button.dataset.tipsMode || "basic"));
  });

  applyMode("basic");
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

function chestMarkerNumber(entry) {
  const value = Number.parseInt(entry?.markerId || "", 10);
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
}

function sortChests(items, mode = "HIDDEN") {
  const list = [...items];
  list.sort((a, b) => {
    if (mode === "AREA_AZ") {
      const areaCmp = collator.compare(a.area || "", b.area || "");
      if (areaCmp !== 0) return areaCmp;
      return chestMarkerNumber(a) - chestMarkerNumber(b);
    }

    if (mode === "AREA_ZA") {
      const areaCmp = collator.compare(b.area || "", a.area || "");
      if (areaCmp !== 0) return areaCmp;
      return chestMarkerNumber(a) - chestMarkerNumber(b);
    }

    if (mode === "MARKER_ASC") {
      const markerCmp = chestMarkerNumber(a) - chestMarkerNumber(b);
      if (markerCmp !== 0) return markerCmp;
      return collator.compare(a.area || "", b.area || "");
    }

    const hiddenCmp = Number(Boolean(b.isHiddenHint)) - Number(Boolean(a.isHiddenHint));
    if (hiddenCmp !== 0) return hiddenCmp;
    const areaCmp = collator.compare(a.area || "", b.area || "");
    if (areaCmp !== 0) return areaCmp;
    return chestMarkerNumber(a) - chestMarkerNumber(b);
  });
  return list;
}

async function initChestsPage() {
  const refs = {
    stamp: document.getElementById("chests-stamp"),
    regionMapGrid: document.getElementById("chests-region-grid"),
    areaMapGrid: document.getElementById("chests-area-map-grid"),
    search: document.getElementById("chests-search"),
    region: document.getElementById("chests-region-filter"),
    area: document.getElementById("chests-area-filter"),
    hidden: document.getElementById("chests-hidden-filter"),
    sort: document.getElementById("chests-sort"),
    limit: document.getElementById("chests-limit"),
    count: document.getElementById("chests-count"),
    grid: document.getElementById("chests-grid"),
    sourceList: document.getElementById("chests-source-list"),
  };
  if (
    !refs.stamp ||
    !refs.regionMapGrid ||
    !refs.areaMapGrid ||
    !refs.search ||
    !refs.region ||
    !refs.area ||
    !refs.hidden ||
    !refs.sort ||
    !refs.limit ||
    !refs.count ||
    !refs.grid ||
    !refs.sourceList
  ) {
    return;
  }

  let chestData;
  try {
    chestData = await fetchChestsData();
  } catch (error) {
    refs.stamp.textContent = "Gagal memuat data chest.";
    refs.grid.innerHTML = emptyState("Data chest belum bisa dimuat. Coba refresh halaman.");
    console.error(error);
    return;
  }

  const regions = Array.isArray(chestData.regions) ? chestData.regions : [];
  const areas = Array.isArray(chestData.areas) ? chestData.areas : [];
  const entries = Array.isArray(chestData.entries) ? chestData.entries : [];

  const regionById = new Map(regions.map((region) => [region.id, region]));
  const areaByName = new Map(areas.map((area) => [area.name, area]));
  const areaByRegion = new Map();
  areas.forEach((area) => {
    const key = area.regionId || "";
    if (!areaByRegion.has(key)) areaByRegion.set(key, []);
    areaByRegion.get(key).push(area);
  });

  const totalChests = Number(chestData.meta?.totalChests) || entries.length;
  const hiddenHints = Number(chestData.meta?.hiddenHintCount) || entries.filter((entry) => entry.isHiddenHint).length;
  refs.stamp.textContent = `Update data: ${toDateLabel(chestData.meta?.updatedAt)} | Total chest: ${totalChests} | Hidden hint: ${hiddenHints}`;

  applyDynamicMeta({
    title: "Chest Map Endfield Indonesia | Talos-II & Wuling | Endfield Web",
    description:
      "Lokasi chest Arknights: Endfield untuk Talos-II (Valley IV) dan Wuling, lengkap dengan peta area, gambar marker, caption, dan cara ambil chest.",
    canonicalUrl: toAbsoluteSiteUrl("/chests/"),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      "chest endfield indonesia",
      "lokasi chest talos-ii endfield",
      "lokasi chest wuling endfield",
      "treasure chest endfield map",
      "hidden chest endfield",
      "endfield guide indonesia",
      "arknights endfield indonesia",
    ],
  });

  refs.regionMapGrid.innerHTML = regions.length
    ? regions
        .map(
          (region) => `
        <article class="card chest-map-card">
          <a class="card-link" href="${esc(region.mapPage || "#")}" target="_blank" rel="noreferrer noopener">
            <img
              class="chest-map-image"
              src="${asset(region.mapImage || "assets/images/hero-share.jpg")}"
              alt="${esc(`Peta ${region.name}`)}"
              loading="lazy"
            />
            <div class="chest-map-copy">
              <h3>${esc(region.name || "-")}</h3>
              <p><strong>Total chest:</strong> ${esc(region.chestCount || 0)}</p>
              <p>${esc(region.mapCaption || "Peta region chest.")}</p>
              <span class="detail-link">Buka map referensi</span>
            </div>
          </a>
        </article>`
        )
        .join("")
    : emptyState("Peta region belum tersedia.");

  refs.areaMapGrid.innerHTML = areas.length
    ? areas
        .map(
          (area) => `
        <article class="card chest-map-card area">
          <a class="card-link" href="${esc(area.mapPage || "#")}" target="_blank" rel="noreferrer noopener">
            <img
              class="chest-map-image"
              src="${asset(area.mapImage || "assets/images/hero-share.jpg")}"
              alt="${esc(`Peta ${area.name}`)}"
              loading="lazy"
            />
            <div class="chest-map-copy">
              <h3>${esc(area.name || "-")}</h3>
              <p><strong>Total chest:</strong> ${esc(area.chestCount || 0)}</p>
              <p>${esc(area.mapCaption || "Peta area chest.")}</p>
            </div>
          </a>
        </article>`
        )
        .join("")
    : emptyState("Peta area belum tersedia.");

  refs.sourceList.innerHTML = Array.isArray(chestData.sources)
    ? chestData.sources
        .map((source) => normalizeSourceEntry(source))
        .filter(Boolean)
        .map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer noopener">${esc(source.label)}</a></li>`)
        .join("")
    : "";

  refs.region.innerHTML = [
    '<option value="ALL">Semua Region</option>',
    ...regions.map((region) => `<option value="${esc(region.id)}">${esc(region.name)}</option>`),
  ].join("");

  const updateAreaOptions = () => {
    const regionId = refs.region.value;
    const options = regionId === "ALL" ? areas : areaByRegion.get(regionId) || [];
    refs.area.innerHTML = [
      '<option value="ALL">Semua Area</option>',
      ...sortByName(options, "name", "AZ").map((area) => `<option value="${esc(area.name)}">${esc(area.name)}</option>`),
    ].join("");
  };

  const redraw = () => {
    const search = refs.search.value.trim().toLowerCase();
    const selectedRegion = refs.region.value;
    const selectedArea = refs.area.value;
    const hiddenMode = refs.hidden.value;
    const sortMode = refs.sort.value;
    const limitValue = refs.limit.value;

    const filtered = sortChests(
      entries.filter((entry) => {
        const byRegion = selectedRegion === "ALL" || entry.regionId === selectedRegion;
        const byArea = selectedArea === "ALL" || entry.area === selectedArea;
        const byHidden =
          hiddenMode === "ALL" ||
          (hiddenMode === "HIDDEN" && Boolean(entry.isHiddenHint)) ||
          (hiddenMode === "STANDARD" && !entry.isHiddenHint);

        const localizedHowTo = entry.howToGetId || entry.howToGet || "";
        const blob = `${entry.title || ""} ${entry.area || ""} ${entry.markerId || ""} ${localizedHowTo} ${entry.howToGet || ""} ${(entry.tags || []).join(" ")}`.toLowerCase();
        const bySearch = !search || blob.includes(search);
        return byRegion && byArea && byHidden && bySearch;
      }),
      sortMode
    );

    const limit = limitValue === "ALL" ? filtered.length : Number.parseInt(limitValue, 10) || 60;
    const visible = filtered.slice(0, limit);

    refs.count.textContent =
      filtered.length === visible.length
        ? `${filtered.length} chest cocok`
        : `${filtered.length} chest cocok (menampilkan ${visible.length})`;

    refs.grid.innerHTML = visible.length
      ? visible
          .map((entry) => {
            const region = regionById.get(entry.regionId);
            const area = areaByName.get(entry.area);
            const fallbackImage = area?.mapImage || region?.mapImage || "assets/images/hero-share.jpg";
            const image = entry.image || fallbackImage;
            const imageFull = entry.imageFull || image;
            const markerLabel = entry.markerId ? `Marker #${entry.markerId}` : "Marker tidak tersedia";
            const localizedHowTo = entry.howToGetId || entry.howToGet || "-";
            const difficulty = entry.difficulty || "Low";
            const difficultyLabel =
              {
                low: "Rendah",
                medium: "Menengah",
                high: "Tinggi",
              }[(difficulty || "").toLowerCase()] || difficulty;
            const chips = (entry.tags || []).slice(0, 6);
            const source = normalizeSourceEntry((entry.sources || [])[0]) || { label: "Sumber", url: "#" };
            const areaSource = normalizeSourceEntry((entry.sources || [])[1]) || null;

            return `
              <article class="card chest-card">
                <img class="chest-thumb" src="${asset(image)}" alt="${esc(`${entry.area} chest ${entry.markerId || ""}`)}" loading="lazy" />
                <div class="chest-meta-row">
                  <span class="tip-category ${entry.isHiddenHint ? "chest-tip-hidden" : "chest-tip-standard"}">${entry.isHiddenHint ? "Hidden Hint" : "Standar"}</span>
                  <span class="tip-category chest-tip-diff">Kesulitan ${esc(difficultyLabel)}</span>
                </div>
                <h3>${esc(entry.area)} - ${esc(markerLabel)}</h3>
                <p class="chest-caption"><strong>Wilayah:</strong> ${esc(region?.name || "-")} | <strong>Area:</strong> ${esc(entry.area || "-")}</p>
                <p class="chest-howto">${esc(localizedHowTo)}</p>
                ${
                  chips.length
                    ? `<div class="chest-chip-row">${chips
                        .map((chip) => `<span class="chest-chip">${esc(chip)}</span>`)
                        .join("")}</div>`
                    : ""
                }
                <div class="chest-action-row">
                  <a class="detail-link inline-link" href="${esc(imageFull || "#")}" target="_blank" rel="noreferrer noopener">Lihat gambar penuh</a>
                  ${areaSource ? `<a class="detail-link inline-link" href="${esc(areaSource.url)}" target="_blank" rel="noreferrer noopener">Peta area</a>` : ""}
                  <a class="detail-link inline-link" href="${esc(source.url)}" target="_blank" rel="noreferrer noopener">${esc(source.label)}</a>
                </div>
              </article>`;
          })
          .join("")
      : emptyState("Chest tidak ditemukan untuk filter ini. Coba ubah keyword atau area.");
  };

  refs.search.addEventListener("input", redraw);
  refs.region.addEventListener("change", () => {
    updateAreaOptions();
    redraw();
  });
  refs.area.addEventListener("change", redraw);
  refs.hidden.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  refs.limit.addEventListener("change", redraw);

  updateAreaOptions();
  redraw();
}

async function initEventsPage() {
  const refs = {
    stamp: document.getElementById("events-stamp"),
    search: document.getElementById("events-search"),
    filter: document.getElementById("events-filter"),
    chipRow: document.getElementById("events-chip-filter"),
    sort: document.getElementById("events-sort"),
    count: document.getElementById("events-count"),
    grid: document.getElementById("events-grid"),
    sourceList: document.getElementById("events-source-list"),
    statActive: document.getElementById("events-active-count"),
    statUpcoming: document.getElementById("events-upcoming-count"),
    statCompleted: document.getElementById("events-completed-count"),
  };
  if (
    !refs.stamp ||
    !refs.search ||
    !refs.filter ||
    !refs.chipRow ||
    !refs.sort ||
    !refs.count ||
    !refs.grid ||
    !refs.sourceList ||
    !refs.statActive ||
    !refs.statUpcoming ||
    !refs.statCompleted
  ) {
    return;
  }

  let liveHub;
  try {
    liveHub = await fetchLiveHubData();
  } catch (error) {
    refs.stamp.textContent = "Gagal memuat data event.";
    refs.grid.innerHTML = emptyState("Data event belum bisa dimuat.");
    console.error(error);
    return;
  }

  const events = Array.isArray(liveHub?.events) ? liveHub.events : [];
  const sources = Array.isArray(liveHub?.sources) ? liveHub.sources : [];
  refs.stamp.textContent = `Update data: ${toDateLabel(liveHub?.meta?.updatedAt)}`;

  applyDynamicMeta({
    title: "Event Endfield Indonesia | Banner, DEV Comm, Timeline | Endfield Web",
    description:
      "Pantau event Arknights: Endfield: banner aktif, event mendatang, DEV Comm, countdown, dan ringkasan reward dalam bahasa Indonesia.",
    canonicalUrl: toAbsoluteSiteUrl("/events/"),
    imageUrl: toAbsoluteSiteUrl("/assets/images/banner-gilberta.jpg"),
    keywords: [
      "event endfield",
      "jadwal banner endfield",
      "banner gilberta yvonne",
      "dev comm endfield",
      "endfield indonesia",
    ],
  });

  refs.sourceList.innerHTML = sources
    .map((source) => normalizeSourceEntry(source))
    .filter(Boolean)
    .map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer noopener">${esc(source.label)}</a></li>`)
    .join("");

  const withStatus = events.map((item) => ({ ...item, _status: eventStatusFromDates(item) }));
  refs.statActive.textContent = String(withStatus.filter((item) => item._status === "active").length);
  refs.statUpcoming.textContent = String(withStatus.filter((item) => item._status === "upcoming").length);
  refs.statCompleted.textContent = String(withStatus.filter((item) => item._status === "completed").length);
  const chipState = {
    type: "ALL",
  };
  const typeOptions = Array.from(new Set(withStatus.map((item) => String(item.type || "").trim()).filter(Boolean))).sort((a, b) =>
    collator.compare(a, b)
  );

  const renderChips = () => {
    const statusValue = refs.filter.value || "ALL";
    refs.chipRow.innerHTML = [
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="ALL">Semua</button>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="active">Aktif</button>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="upcoming">Akan Datang</button>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="completed">Arsip</button>',
      '<span class="chip-divider" aria-hidden="true"></span>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="type" data-chip-value="ALL">Semua Tipe</button>',
      ...typeOptions.map(
        (type) => `<button type="button" class="chip-filter-btn" data-chip-mode="type" data-chip-value="${esc(type)}">${esc(type)}</button>`
      ),
    ].join("");
    refs.chipRow.querySelectorAll("[data-chip-mode='status']").forEach((button) => {
      if (button.dataset.chipValue === statusValue) button.classList.add("active");
    });
    refs.chipRow.querySelectorAll("[data-chip-mode='type']").forEach((button) => {
      if (button.dataset.chipValue === chipState.type) button.classList.add("active");
    });
  };

  const sortEvents = (list, mode) => {
    const cloned = [...list];
    if (mode === "AZ") {
      cloned.sort((a, b) => collator.compare(a.title || "", b.title || ""));
      return cloned;
    }
    if (mode === "DATE_ASC") {
      cloned.sort((a, b) => {
        const at = new Date(a.startAt || 0).getTime();
        const bt = new Date(b.startAt || 0).getTime();
        return at - bt;
      });
      return cloned;
    }
    if (mode === "DATE_DESC") {
      cloned.sort((a, b) => {
        const at = new Date(a.startAt || 0).getTime();
        const bt = new Date(b.startAt || 0).getTime();
        return bt - at;
      });
      return cloned;
    }
    cloned.sort((a, b) => {
      const sr = eventSortRank(a._status) - eventSortRank(b._status);
      if (sr !== 0) return sr;
      const at = new Date(a.startAt || 0).getTime();
      const bt = new Date(b.startAt || 0).getTime();
      return bt - at;
    });
    return cloned;
  };

  const refreshCountdowns = () => {
    refs.grid.querySelectorAll(".event-countdown").forEach((node) => {
      const status = String(node.dataset.status || "");
      const start = node.dataset.start || "";
      const end = node.dataset.end || "";
      const startMs = start ? new Date(start).getTime() : NaN;
      const endMs = end ? new Date(end).getTime() : NaN;
      const now = Date.now();
      if (status === "upcoming" && Number.isFinite(startMs)) {
        node.textContent = `Mulai dalam ${toCountdownLabel(startMs - now)}`;
        return;
      }
      if (status === "active" && Number.isFinite(endMs)) {
        node.textContent = `Berakhir dalam ${toCountdownLabel(endMs - now)}`;
        return;
      }
      node.textContent = "Arsip event";
    });
  };

  const redraw = () => {
    const keyword = refs.search.value.trim().toLowerCase();
    const filter = refs.filter.value;
    const sortMode = refs.sort.value;

    const filtered = sortEvents(
      withStatus.filter((item) => {
        const byStatus = filter === "ALL" || item._status === filter;
        const byType = chipState.type === "ALL" || String(item.type || "") === chipState.type;
        const blob = `${item.title || ""} ${item.highlight || ""} ${item.summary || ""} ${(item.rewards || []).join(" ")}`.toLowerCase();
        const bySearch = !keyword || blob.includes(keyword);
        return byStatus && byType && bySearch;
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} event cocok`;
    refs.grid.innerHTML = filtered.length
      ? filtered
          .map((event) => {
            const status = event._status;
            return `
              <article class="card event-card">
                <img class="event-cover" src="${asset(event.image || "assets/images/hero-share.jpg")}" alt="${esc(event.title || "Event Endfield")}" loading="lazy" />
                <div class="event-card-body">
                  <div class="event-row">
                    <span class="event-chip ${statusClass(status)}">${esc(statusLabel(status))}</span>
                    <span class="event-chip type">${esc(event.type || "-")}</span>
                  </div>
                  <h3>${esc(event.title || "-")}</h3>
                  <p class="event-highlight">${esc(event.highlight || "-")}</p>
                  <p>${esc(event.summary || "-")}</p>
                  <p class="event-time">Mulai: ${esc(toDateTimeLabel(event.startAt))}</p>
                  <p class="event-time">Selesai: ${esc(event.endAt ? toDateTimeLabel(event.endAt) : "-")}</p>
                  <p class="event-countdown" data-status="${esc(status)}" data-start="${esc(event.startAt || "")}" data-end="${esc(event.endAt || "")}">
                    ${esc(eventCountdownLabel(event))}
                  </p>
                  ${
                    Array.isArray(event.rewards) && event.rewards.length
                      ? `<div class="event-reward-row">${event.rewards
                          .slice(0, 5)
                          .map((reward) => `<span class="event-reward-chip">${esc(reward)}</span>`)
                          .join("")}</div>`
                      : ""
                  }
                  ${
                    event.source
                      ? `<a class="detail-link inline-link" href="${esc(event.source)}" target="_blank" rel="noreferrer noopener">Lihat sumber</a>`
                      : ""
                  }
                </div>
              </article>`;
          })
          .join("")
      : emptyState("Event tidak ditemukan. Coba ubah filter atau keyword.");

    refreshCountdowns();
    applyRevealAnimation(refs.grid, ".event-card");
  };

  refs.chipRow.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-chip-mode][data-chip-value]");
    if (!chip) return;
    const mode = chip.dataset.chipMode;
    const value = chip.dataset.chipValue || "ALL";
    if (mode === "status") {
      refs.filter.value = value;
    } else if (mode === "type") {
      chipState.type = value;
    }
    renderChips();
    redraw();
  });
  refs.search.addEventListener("input", redraw);
  refs.filter.addEventListener("change", () => {
    renderChips();
    redraw();
  });
  refs.sort.addEventListener("change", redraw);
  renderChips();
  redraw();

  const ticker = setInterval(refreshCountdowns, 1000);
  window.addEventListener("pagehide", () => clearInterval(ticker), { once: true });
}

async function initCodesPage() {
  const refs = {
    stamp: document.getElementById("codes-stamp"),
    search: document.getElementById("codes-search"),
    filter: document.getElementById("codes-filter"),
    chipRow: document.getElementById("codes-chip-filter"),
    sort: document.getElementById("codes-sort"),
    count: document.getElementById("codes-count"),
    grid: document.getElementById("codes-grid"),
    sourceList: document.getElementById("codes-source-list"),
    statActive: document.getElementById("codes-active-count"),
    statExpired: document.getElementById("codes-expired-count"),
    statTotal: document.getElementById("codes-total-count"),
  };
  if (
    !refs.stamp ||
    !refs.search ||
    !refs.filter ||
    !refs.chipRow ||
    !refs.sort ||
    !refs.count ||
    !refs.grid ||
    !refs.sourceList ||
    !refs.statActive ||
    !refs.statExpired ||
    !refs.statTotal
  ) {
    return;
  }

  let liveHub;
  try {
    liveHub = await fetchLiveHubData();
  } catch (error) {
    refs.stamp.textContent = "Gagal memuat data code.";
    refs.grid.innerHTML = emptyState("Data redeem code belum bisa dimuat.");
    console.error(error);
    return;
  }

  const codes = Array.isArray(liveHub?.codes) ? liveHub.codes : [];
  const sourceSet = new Map();
  codes.forEach((item) => {
    (item.sources || []).forEach((source) => {
      const normalized = normalizeSourceEntry(source);
      if (normalized) sourceSet.set(normalized.url, normalized);
    });
  });

  refs.stamp.textContent = `Update data: ${toDateLabel(liveHub?.meta?.updatedAt)} | Cek code cepat berubah.`;
  refs.statTotal.textContent = String(codes.length);
  refs.statActive.textContent = String(codes.filter((item) => ["active", "likely-active"].includes(String(item.status))).length);
  refs.statExpired.textContent = String(codes.filter((item) => String(item.status) === "expired").length);
  const chipState = {
    platform: "ALL",
  };
  const platformOptions = Array.from(new Set(codes.map((item) => String(item.platform || "").trim()).filter(Boolean))).sort((a, b) =>
    collator.compare(a, b)
  );

  const renderChips = () => {
    const statusValue = refs.filter.value || "ALL";
    refs.chipRow.innerHTML = [
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="ALL">Semua</button>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="active">Aktif</button>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="likely-active">Kemungkinan Aktif</button>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="status" data-chip-value="expired">Kadaluarsa</button>',
      '<span class="chip-divider" aria-hidden="true"></span>',
      '<button type="button" class="chip-filter-btn" data-chip-mode="platform" data-chip-value="ALL">Semua Platform</button>',
      ...platformOptions.map(
        (platform) =>
          `<button type="button" class="chip-filter-btn" data-chip-mode="platform" data-chip-value="${esc(platform)}">${esc(platform)}</button>`
      ),
    ].join("");
    refs.chipRow.querySelectorAll("[data-chip-mode='status']").forEach((button) => {
      if (button.dataset.chipValue === statusValue) button.classList.add("active");
    });
    refs.chipRow.querySelectorAll("[data-chip-mode='platform']").forEach((button) => {
      if (button.dataset.chipValue === chipState.platform) button.classList.add("active");
    });
  };

  applyDynamicMeta({
    title: "Redeem Code Endfield Indonesia | Kode Penukaran | Endfield Web",
    description:
      "Daftar redeem code Arknights: Endfield dengan status aktif, estimasi aktif, atau kadaluarsa, plus tombol copy cepat.",
    canonicalUrl: toAbsoluteSiteUrl("/codes/"),
    imageUrl: toAbsoluteSiteUrl("/assets/images/event-spring.jpg"),
    keywords: [
      "redeem code endfield",
      "kode endfield terbaru",
      "hadiah code endfield",
      "endfield indonesia",
    ],
  });

  refs.sourceList.innerHTML = Array.from(sourceSet.values())
    .map((source) => `<li><a href="${esc(source.url)}" target="_blank" rel="noreferrer noopener">${esc(source.label)}</a></li>`)
    .join("");

  const statusRank = (status) => {
    const key = String(status || "").toLowerCase();
    if (key === "active") return 0;
    if (key === "likely-active") return 1;
    if (key === "expired") return 2;
    return 3;
  };

  const sortCodes = (list, mode) => {
    const cloned = [...list];
    if (mode === "AZ") {
      cloned.sort((a, b) => collator.compare(a.code || "", b.code || ""));
      return cloned;
    }
    if (mode === "DATE_DESC") {
      cloned.sort((a, b) => {
        const at = new Date(a.checkedAt || 0).getTime();
        const bt = new Date(b.checkedAt || 0).getTime();
        return bt - at;
      });
      return cloned;
    }
    cloned.sort((a, b) => {
      const sr = statusRank(a.status) - statusRank(b.status);
      if (sr !== 0) return sr;
      return collator.compare(a.code || "", b.code || "");
    });
    return cloned;
  };

  const redraw = () => {
    const keyword = refs.search.value.trim().toLowerCase();
    const filter = refs.filter.value;
    const sortMode = refs.sort.value;

    const filtered = sortCodes(
      codes.filter((item) => {
        const status = String(item.status || "").toLowerCase();
        const byStatus = filter === "ALL" || status === filter;
        const byPlatform = chipState.platform === "ALL" || String(item.platform || "") === chipState.platform;
        const blob = `${item.code || ""} ${item.reward || ""} ${item.platform || ""} ${item.note || ""}`.toLowerCase();
        const bySearch = !keyword || blob.includes(keyword);
        return byStatus && byPlatform && bySearch;
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} code cocok`;
    refs.grid.innerHTML = filtered.length
      ? filtered
          .map(
            (item) => `
          <article class="card code-card">
            <div class="code-top">
              <span class="event-chip ${statusClass(item.status)}">${esc(statusLabel(item.status))}</span>
              <span class="code-platform">${esc(item.platform || "-")}</span>
            </div>
            <h3>${esc(item.code || "-")}</h3>
            <p>${esc(item.reward || "-")}</p>
            <p class="event-time">Terakhir dicek: ${esc(toDateLabel(item.checkedAt))}</p>
            <p class="event-time">Kadaluarsa: ${esc(item.expiresAt ? toDateLabel(item.expiresAt) : "-")}</p>
            <p>${esc(item.note || "-")}</p>
            <div class="code-actions">
              <button class="btn ghost code-copy-btn" type="button" data-copy-code="${esc(item.code || "")}">
                Copy Code
              </button>
              ${
                item.sources && item.sources[0]
                  ? `<a class="detail-link inline-link" href="${esc(item.sources[0])}" target="_blank" rel="noreferrer noopener">Lihat sumber</a>`
                  : ""
              }
            </div>
          </article>`
          )
          .join("")
      : emptyState("Code tidak ditemukan. Coba ubah filter atau keyword.");
    applyRevealAnimation(refs.grid, ".code-card");
  };

  refs.chipRow.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-chip-mode][data-chip-value]");
    if (!chip) return;
    const mode = chip.dataset.chipMode;
    const value = chip.dataset.chipValue || "ALL";
    if (mode === "status") {
      refs.filter.value = value;
    } else if (mode === "platform") {
      chipState.platform = value;
    }
    renderChips();
    redraw();
  });
  refs.grid.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-code]");
    if (!button) return;
    const code = String(button.dataset.copyCode || "").trim();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      const original = button.textContent;
      button.textContent = "Tersalin";
      setTimeout(() => {
        button.textContent = original;
      }, 900);
    } catch {
      refs.stamp.textContent = "Clipboard diblok browser. Salin manual dari kartu.";
    }
  });

  refs.search.addEventListener("input", redraw);
  refs.filter.addEventListener("change", () => {
    renderChips();
    redraw();
  });
  refs.sort.addEventListener("change", redraw);
  renderChips();
  redraw();
}

function buildCreatorCharacterData(character) {
  const iconOverrides = {
    Wulfgard: "assets/icons/wulfgard.webp",
  };
  const image = iconOverrides[String(character?.name || "")] || character?.image || "assets/skill-icons/basic.webp";
  return {
    id: character?.id || "",
    name: character?.name || "Unknown",
    role: character?.role || "-",
    tier: character?.tier || "-",
    element: character?.profile?.element || "-",
    weapon: character?.profile?.weapon || "-",
    image,
  };
}

function loadCanvasImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Gagal memuat image: ${url}`));
    img.src = url;
  });
}

async function exportCreatorCardPng(character, preset, state, statusEl) {
  const canvas = await renderCreatorCardCanvas(character, preset, state, statusEl);
  if (!canvas) return;
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `endfield-card-${String(character.id || character.name || "operator").toLowerCase()}.png`;
  link.click();
}

async function renderCreatorCardCanvas(character, preset, state, statusEl) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (statusEl) statusEl.textContent = "Canvas tidak didukung browser.";
    return null;
  }

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, preset.bgA || "#123349");
  gradient.addColorStop(1, preset.bgB || "#09131d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = preset.accent || "#70d9ff";
  ctx.fillRect(72, 72, 560, 14);
  ctx.fillRect(72, 820, 1456, 8);
  ctx.fillRect(980, 120, 520, 10);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(0,0,0,0.24)";
  ctx.fillRect(70, 90, 1460, 730);
  ctx.strokeStyle = preset.accent || "#70d9ff";
  ctx.lineWidth = 3;
  ctx.strokeRect(70, 90, 1460, 730);

  const imageUrl = asset(character.image);
  try {
    const img = await loadCanvasImage(imageUrl);
    const cx = 330;
    const cy = 455;
    const radius = 220;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    const size = Math.max(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;
    ctx.drawImage(img, sx, sy, size, size, cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
    ctx.strokeStyle = preset.accent || "#70d9ff";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
    ctx.stroke();
  } catch {
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(130, 250, 400, 400);
    ctx.fillStyle = "#dcefff";
    ctx.font = "700 36px Rajdhani, sans-serif";
    ctx.fillText("NO IMAGE", 235, 470);
  }

  const ink = preset.ink || "#e9f8ff";
  ctx.fillStyle = ink;
  ctx.font = "700 38px Rajdhani, sans-serif";
  ctx.fillText((state.alias || "Frontier Cadre").slice(0, 34), 620, 186);

  ctx.font = "700 94px Rajdhani, sans-serif";
  ctx.fillText((character.name || "Unknown").slice(0, 18), 620, 320);

  ctx.font = "500 40px Space Grotesk, sans-serif";
  ctx.fillText((state.tagline || "High Priority Deployment").slice(0, 48), 620, 390);

  const chips = [];
  if (state.showRole) chips.push(`Role: ${character.role}`);
  chips.push(`Element: ${character.element}`);
  chips.push(`Weapon: ${character.weapon}`);
  if (state.showTier) chips.push(`Tier ${character.tier}`);

  let chipY = 470;
  ctx.font = "600 33px Rajdhani, sans-serif";
  chips.slice(0, 4).forEach((chip) => {
    const w = Math.ceil(ctx.measureText(chip).width) + 36;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(620, chipY - 34, w, 46);
    ctx.strokeStyle = preset.accent || "#70d9ff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(620, chipY - 34, w, 46);
    ctx.fillStyle = ink;
    ctx.fillText(chip, 638, chipY - 3);
    chipY += 64;
  });

  ctx.globalAlpha = 0.92;
  ctx.fillStyle = ink;
  ctx.font = "500 24px Space Grotesk, sans-serif";
  ctx.fillText("endfield-ind.my.id · Fanmade Card Creator", 620, 790);
  ctx.globalAlpha = 1;
  return canvas;
}

async function shareCreatorCardPng(character, preset, state, statusEl) {
  const canvas = await renderCreatorCardCanvas(character, preset, state, statusEl);
  if (!canvas) return;

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("Gagal membentuk file PNG.");

  const fileName = `endfield-card-${String(character.id || character.name || "operator").toLowerCase()}.png`;
  const file = new File([blob], fileName, { type: "image/png" });
  const title = `${character.name} - Endfield Fan Card`;
  const text = "Fanmade card dari endfield-ind.my.id";

  const canShareFile =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    (!navigator.canShare || navigator.canShare({ files: [file] }));
  if (canShareFile) {
    await navigator.share({ title, text, files: [file] });
    return;
  }

  await exportCreatorCardPng(character, preset, state, statusEl);
  if (statusEl) statusEl.textContent = "Share file tidak didukung browser ini. PNG di-download otomatis.";
}

async function initCardCreatorPage(characters) {
  const refs = {
    character: document.getElementById("creator-character"),
    style: document.getElementById("creator-style"),
    alias: document.getElementById("creator-alias"),
    tagline: document.getElementById("creator-tagline"),
    showTier: document.getElementById("creator-show-tier"),
    showRole: document.getElementById("creator-show-role"),
    random: document.getElementById("creator-random"),
    share: document.getElementById("creator-share"),
    download: document.getElementById("creator-download"),
    status: document.getElementById("creator-status"),
    preview: document.getElementById("creator-preview"),
    previewAlias: document.getElementById("creator-preview-alias"),
    previewTier: document.getElementById("creator-preview-tier"),
    previewImage: document.getElementById("creator-preview-image"),
    previewName: document.getElementById("creator-preview-name"),
    previewRole: document.getElementById("creator-preview-role"),
    previewTagline: document.getElementById("creator-preview-tagline"),
  };
  if (
    !refs.character ||
    !refs.style ||
    !refs.alias ||
    !refs.tagline ||
    !refs.showTier ||
    !refs.showRole ||
    !refs.random ||
    !refs.share ||
    !refs.download ||
    !refs.status ||
    !refs.preview ||
    !refs.previewAlias ||
    !refs.previewTier ||
    !refs.previewImage ||
    !refs.previewName ||
    !refs.previewRole ||
    !refs.previewTagline
  ) {
    return;
  }

  let liveHub;
  try {
    liveHub = await fetchLiveHubData();
  } catch {
    liveHub = null;
  }

  const builtCharacters = sortByName((characters || []).map(buildCreatorCharacterData), "name", "AZ");
  const presets = Array.isArray(liveHub?.cardCreator?.presets) && liveHub.cardCreator.presets.length
    ? liveHub.cardCreator.presets
    : [
        { id: "frontier", name: "Frontier Amber", bgA: "#1d2c3d", bgB: "#0d1622", accent: "#f7cb6b", ink: "#fef5dd" },
        { id: "talos", name: "Talos Steel", bgA: "#123349", bgB: "#09131d", accent: "#70d9ff", ink: "#e9f8ff" },
      ];
  const taglines = Array.isArray(liveHub?.cardCreator?.taglines) && liveHub.cardCreator.taglines.length
    ? liveHub.cardCreator.taglines
    : ["High Priority Deployment", "AIC Tactical Unit", "Wuling Response Team"];

  refs.character.innerHTML = builtCharacters
    .map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`)
    .join("");
  refs.style.innerHTML = presets.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join("");

  const state = {
    characterId: builtCharacters[0]?.id || "",
    styleId: presets[0]?.id || "",
    alias: "Frontier Cadre",
    tagline: taglines[0] || "High Priority Deployment",
    showTier: true,
    showRole: true,
  };

  refs.alias.value = state.alias;
  refs.tagline.value = state.tagline;
  refs.character.value = state.characterId;
  refs.style.value = state.styleId;
  refs.showTier.checked = state.showTier;
  refs.showRole.checked = state.showRole;
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    refs.share.textContent = "Share (Fallback)";
  }

  const findCharacter = () => builtCharacters.find((item) => item.id === state.characterId) || builtCharacters[0];
  const findPreset = () => presets.find((item) => item.id === state.styleId) || presets[0];

  const applyPreview = () => {
    const character = findCharacter();
    const preset = findPreset();
    if (!character || !preset) return;

    refs.preview.style.setProperty("--creator-bg-a", preset.bgA || "#123349");
    refs.preview.style.setProperty("--creator-bg-b", preset.bgB || "#09131d");
    refs.preview.style.setProperty("--creator-accent", preset.accent || "#70d9ff");
    refs.preview.style.setProperty("--creator-ink", preset.ink || "#e9f8ff");

    refs.previewAlias.textContent = state.alias || "Frontier Cadre";
    refs.previewTier.textContent = state.showTier ? `TIER ${character.tier || "-"}` : "";
    refs.previewTier.hidden = !state.showTier;
    refs.previewImage.src = asset(character.image);
    refs.previewImage.alt = `${character.name} icon`;
    refs.previewName.textContent = character.name;
    refs.previewRole.textContent = state.showRole ? character.role || "-" : "";
    refs.previewRole.hidden = !state.showRole;
    refs.previewTagline.textContent = state.tagline || "High Priority Deployment";
  };

  const randomize = () => {
    const randomCharacter = randomPick(builtCharacters);
    const randomPreset = randomPick(presets);
    const randomTagline = randomPick(taglines);
    if (randomCharacter) state.characterId = randomCharacter.id;
    if (randomPreset) state.styleId = randomPreset.id;
    if (randomTagline) state.tagline = randomTagline;
    refs.character.value = state.characterId;
    refs.style.value = state.styleId;
    refs.tagline.value = state.tagline;
    applyPreview();
    refs.status.textContent = "Preset diacak. Siap di-export.";
  };

  refs.character.addEventListener("change", () => {
    state.characterId = refs.character.value;
    applyPreview();
  });
  refs.style.addEventListener("change", () => {
    state.styleId = refs.style.value;
    applyPreview();
  });
  refs.alias.addEventListener("input", () => {
    state.alias = refs.alias.value.trim();
    applyPreview();
  });
  refs.tagline.addEventListener("input", () => {
    state.tagline = refs.tagline.value.trim();
    applyPreview();
  });
  refs.showTier.addEventListener("change", () => {
    state.showTier = refs.showTier.checked;
    applyPreview();
  });
  refs.showRole.addEventListener("change", () => {
    state.showRole = refs.showRole.checked;
    applyPreview();
  });
  refs.random.addEventListener("click", randomize);
  refs.share.addEventListener("click", async () => {
    const character = findCharacter();
    const preset = findPreset();
    if (!character || !preset) return;
    refs.status.textContent = "Menyiapkan card untuk dibagikan...";
    try {
      await shareCreatorCardPng(character, preset, state, refs.status);
      if (!refs.status.textContent.includes("di-download")) {
        refs.status.textContent = "Berhasil membuka menu share.";
      }
    } catch (error) {
      refs.status.textContent = "Gagal share card. Coba lagi.";
      console.error(error);
    }
  });
  refs.download.addEventListener("click", async () => {
    const character = findCharacter();
    const preset = findPreset();
    if (!character || !preset) return;
    refs.status.textContent = "Merender PNG...";
    try {
      await exportCreatorCardPng(character, preset, state, refs.status);
      refs.status.textContent = "Selesai. PNG berhasil di-download.";
    } catch (error) {
      refs.status.textContent = "Gagal export PNG. Coba lagi.";
      console.error(error);
    }
  });

  applyDynamicMeta({
    title: "Card Creator Endfield Indonesia | Buat Kartu Karakter | Endfield Web",
    description:
      "Buat kartu karakter Endfield versi kamu sendiri: pilih operator, style kartu, tagline, lalu export PNG langsung dari browser.",
    canonicalUrl: toAbsoluteSiteUrl("/card-creator/"),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      "endfield card creator",
      "kartu karakter endfield",
      "endfield fan card",
      "endfield indonesia",
    ],
  });

  applyPreview();
}

async function fetchData() {
  const response = await fetch(withRoot("data/content.json"));
  if (!response.ok) throw new Error("Gagal memuat data JSON");
  return response.json();
}

async function fetchChestsData() {
  const response = await fetch(withRoot("data/chests.json"));
  if (!response.ok) throw new Error("Gagal memuat data chest JSON");
  return response.json();
}

async function fetchLiveHubData() {
  const response = await fetch(withRoot("data/live-hub.json"));
  if (!response.ok) throw new Error("Gagal memuat data live hub JSON");
  return response.json();
}

const bootLoader = initPageLoader();

async function bootstrap() {
  const loaderMessageByPage = {
    home: "Menyiapkan dashboard Endfield...",
    events: "Sinkronisasi timeline event...",
    codes: "Memuat tracker redeem code...",
    "card-creator": "Menyiapkan card creator...",
    chests: "Memuat atlas chest...",
    gacha: "Menyiapkan simulator gacha...",
  };
  bootLoader?.setText(loaderMessageByPage[page] || "Memuat data Endfield...");

  if (page !== "gacha") initGlobalBgm();
  syncPrimaryNavigation();
  initNavDrawer();
  const data = await fetchData();

  if (page === "home") return renderHome(data);
  if (page === "events") return initEventsPage();
  if (page === "codes") return initCodesPage();
  if (page === "card-creator") return initCardCreatorPage(data.characters || []);
  if (page === "gacha") return initGachaPage(data);
  if (page === "helps") return initTipsPage(data.tips);
  if (page === "team-comps") return initTeamCompsPage(data.teamComps || [], data.characters || []);
  if (page === "tierlist") return initTierPage(data.characters);
  if (page === "builds") return initBuildPage(data.characters);
  if (page === "gears") return initGearsPage(data.characters, data.gearCatalog || []);
  if (page === "chests") return initChestsPage();
  if (page === "gear") return initGearDetailPage(data.characters, data.gearCatalog || []);
  if (page === "characters") return initCharactersPage(data.characters);
  if (page === "character") return initCharacterPage(data.characters);
}

bootstrap()
  .then(() => {
    bootLoader?.hide();
  })
  .catch((error) => {
    console.error(error);
    const stamp =
      document.getElementById("data-stamp") ||
      document.getElementById("profile-status") ||
      document.getElementById("gear-detail-status") ||
      document.getElementById("chests-stamp") ||
      document.getElementById("events-stamp") ||
      document.getElementById("codes-stamp") ||
      document.getElementById("creator-status");
    if (stamp) stamp.textContent = "Data gagal dimuat";
    bootLoader?.fail("Gagal memuat data. Coba refresh halaman.");
    bootLoader?.hide(900);
  });
