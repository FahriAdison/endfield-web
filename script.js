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
const CREATOR_SHARE_TABLE = "creator_showcases";
const SUPABASE_PUBLIC_URL = "https://axuitiqljniyqsbpxatf.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_bF-mkQgNJ68W4yPQiX1TRg_HLj9W-T1";
const CREATOR_ELITE_ICON_URLS = [
  "assets/icons/showcase/elite-0.png",
  "assets/icons/showcase/elite-1.png",
  "assets/icons/showcase/elite-2.png",
  "assets/icons/showcase/elite-3.png",
  "assets/icons/showcase/elite-4.png",
];
const CREATOR_POTENTIAL_ICON_URLS = [
  "assets/icons/showcase/potential-0.png",
  "assets/icons/showcase/potential-1.png",
  "assets/icons/showcase/potential-2.png",
  "assets/icons/showcase/potential-3.png",
  "assets/icons/showcase/potential-4.png",
  "assets/icons/showcase/potential-5.png",
];
const CREATOR_AFFINITY_BADGES = ["A0", "A1", "A2", "A3", "A4"];
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
  { id: "card-creator", label: "Build Showcase", path: "card-creator/" },
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

function clampNumber(value, min, max, fallback = min) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, Math.round(num)));
}

function svgBadgeDataUrl(text, bg = "#0f2132", fg = "#d8ecff", stroke = "#6d90ad") {
  const safe = String(text || "").slice(0, 6);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'><rect x='1.5' y='1.5' width='33' height='33' rx='6' fill='${bg}' stroke='${stroke}' stroke-width='2'/><text x='18' y='22' text-anchor='middle' font-size='12' font-family='Arial, sans-serif' fill='${fg}'>${safe}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function creatorStars(rarity) {
  return "★".repeat(clampNumber(rarity, 1, 6, 5));
}

function creatorProfileId(character, state) {
  const manualUid = String(state?.uid || "").trim();
  if (manualUid) {
    return manualUid
      .replace(/\s+/g, "")
      .slice(0, 24)
      .toUpperCase();
  }
  const level = clampNumber(state?.level, 1, 90, 70);
  const affinity = clampNumber(state?.affinity, 0, 10, 10);
  const token = String(character?.id || "endf")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 4)
    .toUpperCase();
  return `AEND-${String(level).padStart(2, "0")}${String(affinity).padStart(2, "0")}-${token || "UNIT"}`;
}

let creatorSupabaseClient = null;
function getCreatorSupabaseClient() {
  if (creatorSupabaseClient) return creatorSupabaseClient;
  const sdk = typeof window !== "undefined" ? window.supabase : null;
  if (!sdk?.createClient) return null;
  const override = typeof window !== "undefined" ? window.__ENDFIELD_SUPABASE__ : null;
  const url = String(override?.url || SUPABASE_PUBLIC_URL || "").trim();
  const key = String(override?.key || SUPABASE_PUBLIC_KEY || "").trim();
  if (!url || !key) return null;
  creatorSupabaseClient = sdk.createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return creatorSupabaseClient;
}

function createCreatorShareId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 20);
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

function creatorShareUrl(shareId) {
  try {
    const current = new URL(window.location.href);
    current.searchParams.set("sid", shareId);
    return current.toString();
  } catch {
    return `${toAbsoluteSiteUrl("/card-creator/")}?sid=${encodeURIComponent(shareId)}`;
  }
}

function readCreatorShareId(inputValue = "") {
  const fallback = String(inputValue || "").trim();
  if (!fallback) {
    try {
      const params = new URLSearchParams(window.location.search);
      return String(params.get("sid") || "").trim();
    } catch {
      return "";
    }
  }
  try {
    const parsed = new URL(fallback);
    return String(parsed.searchParams.get("sid") || "").trim();
  } catch {
    return fallback.replace(/[^a-z0-9_-]/gi, "");
  }
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
  setOpen(false);

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
  window.addEventListener("pageshow", () => setOpen(false));
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

function normalizeCreatorToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeShowcaseCatalog(rawCatalog) {
  const base = rawCatalog && typeof rawCatalog === "object" ? rawCatalog : {};
  const rawCharacterImages =
    base.characterImages && typeof base.characterImages === "object" && !Array.isArray(base.characterImages)
      ? base.characterImages
      : {};
  const characterImages = {};
  Object.entries(rawCharacterImages).forEach(([id, value]) => {
    const list = Array.isArray(value) ? value : [value];
    const normalized = list
      .map((item) => String(item || "").trim())
      .filter(Boolean);
    if (!normalized.length) return;
    characterImages[id] = normalized;
  });
  const aliases = base.weaponAliases && typeof base.weaponAliases === "object" ? base.weaponAliases : {};
  let weaponList = [];
  if (Array.isArray(base.weapons)) {
    weaponList = base.weapons;
  } else if (Array.isArray(base.weapons?.value)) {
    weaponList = base.weapons.value;
  }
  const dedupe = new Set();
  const weapons = [];
  weaponList.forEach((item) => {
    const name = String(item?.name || "").trim();
    if (!name) return;
    const token = normalizeCreatorToken(name);
    if (!token || dedupe.has(token)) return;
    dedupe.add(token);
    weapons.push({
      name,
      icon: String(item?.icon || "").trim(),
      source: String(item?.source || "").trim(),
      rarity: clampNumber(item?.rarity, 3, 6, 5),
      token,
    });
  });
  return {
    characterImages,
    weaponAliases: aliases,
    weapons: weapons.sort((a, b) => collator.compare(a.name, b.name)),
  };
}

function buildCreatorCharacterData(character, catalog = {}) {
  const iconOverrides = {
    Wulfgard: "assets/icons/wulfgard.webp",
  };
  const fallbackImage = iconOverrides[String(character?.name || "")] || character?.image || "assets/skill-icons/basic.webp";
  const fullImageCandidates = Array.isArray(catalog?.characterImages?.[character?.id])
    ? catalog.characterImages[character.id]
    : [];
  const imageCandidates = [...new Set([...fullImageCandidates, fallbackImage].map((item) => String(item || "").trim()).filter(Boolean))];
  const image = imageCandidates[0] || fallbackImage;
  const profile = character?.profile && typeof character.profile === "object" ? character.profile : {};
  const rarityMatch = String(character?.profile?.rarity || "").match(/(\d+)/);
  const rarity = rarityMatch ? Number(rarityMatch[1]) : 5;
  const build = character?.build && typeof character.build === "object" ? character.build : {};
  const progression = profile?.gearProgression && typeof profile.gearProgression === "object" ? profile.gearProgression : {};
  const progression70 = progression?.["70"]?.slots || {};
  const recommendations = Array.isArray(profile?.gearRecommendations) ? profile.gearRecommendations : [];
  const usage70 = (item) => String(item?.usageLevel || "70").trim() === "70";
  const byType = (typeValue) =>
    recommendations.filter((item) => usage70(item) && String(item?.type || "").toLowerCase().startsWith(typeValue));
  const firstChoice = (value, fallback = "-") => {
    const source = String(value || "")
      .split("|")[0]
      .split("/")[0]
      .trim();
    return source || fallback;
  };
  const cleanText = (value, max = 84, fallback = "-") => {
    const text = String(value || "").trim();
    return text ? text.slice(0, max) : fallback;
  };
  const skillLevelDefaults = (() => {
    const defaults = { basic: 7, combo: 7, active: 8, ultimate: 8, talent: 8 };
    const rows = String(build?.skills || "")
      .toLowerCase()
      .split(">")
      .map((item) => item.trim())
      .filter(Boolean);
    const table = [
      { key: "talent", tags: ["talent", "talenta"] },
      { key: "ultimate", tags: ["ultimate", "ult"] },
      { key: "active", tags: ["active skill", "skill aktif", "active"] },
      { key: "combo", tags: ["combo skill", "skill combo", "combo"] },
      { key: "basic", tags: ["basic attack", "serangan dasar", "basic"] },
    ];
    rows.forEach((row, index) => {
      const level = clampNumber(10 - index, 6, 10, 7);
      const found = table.find((entry) => entry.tags.some((tag) => row.includes(tag)));
      if (!found) return;
      defaults[found.key] = Math.max(defaults[found.key], level);
    });
    return defaults;
  })();
  const armorFallback = byType("armor")[0]?.name || "-";
  const glovesFallback = byType("gloves")[0]?.name || "-";
  const kitsFallback = byType("kit");
  const uidToken = String(character?.id || "unit")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 6)
    .toUpperCase();
  const raritySafe = Number.isFinite(rarity) ? rarity : 5;
  const potentialDefault = raritySafe >= 6 ? 3 : raritySafe >= 5 ? 2 : 1;
  const breakthroughDefault = raritySafe >= 6 ? 2 : 1;

  const recommendationByName = (() => {
    const map = new Map();
    recommendations.forEach((item) => {
      const name = String(item?.name || "").trim();
      const token = normalizeCreatorToken(name);
      if (!token) return;
      map.set(token, item);
    });
    return map;
  })();

  const mergeGearMeta = (item, slotType, usageLevel = "70") => {
    const token = normalizeCreatorToken(item?.name);
    const rec = recommendationByName.get(token);
    const slotIconFallback =
      slotType === "armor"
        ? "assets/skill-icons/talent.webp"
        : slotType === "gloves"
        ? "assets/skill-icons/combo.webp"
        : "assets/skill-icons/ultimate.webp";
    const stats = Array.isArray(item?.stats) && item.stats.length ? item.stats : Array.isArray(rec?.stats) ? rec.stats : [];
    const normalizedStats = stats
      .slice(0, 3)
      .map((stat, index) => ({
        name: String(stat?.name || `Stat ${index + 1}`).trim() || `Stat ${index + 1}`,
        value: String(stat?.value || "0").trim() || "0",
      }))
      .filter((stat) => stat.name);
    return {
      name: String(item?.name || rec?.name || "-").trim() || "-",
      icon: (() => {
        const candidate = String(item?.icon || rec?.icon || slotIconFallback).trim();
        if (!candidate) return slotIconFallback;
        return /^https?:\/\//i.test(candidate) ? slotIconFallback : candidate;
      })(),
      source: String(item?.source || rec?.source || "").trim(),
      type: String(item?.type || rec?.type || slotType || "").trim(),
      usageLevel: String(item?.usageLevel || rec?.usageLevel || usageLevel || "70").trim(),
      effectName: String(item?.effectName || rec?.effectName || "-").trim(),
      effectDescription: String(item?.effectDescription || rec?.effectDescription || "-").trim(),
      stats: normalizedStats.length ? normalizedStats : [{ name: "Stat Utama", value: "0" }],
      token,
    };
  };

  const collectGearBySlot = (slotKey) => {
    const list = [];
    const dedupe = new Set();
    const slotType = slotKey === "kit1" || slotKey === "kit2" ? "kit" : slotKey;
    progressionLevels.forEach((levelKey) => {
      const slotItem = progression?.[levelKey]?.slots?.[slotKey];
      if (!slotItem?.name) return;
      const merged = mergeGearMeta(slotItem, slotType, levelKey);
      if (!merged.token || dedupe.has(merged.token)) return;
      dedupe.add(merged.token);
      list.push(merged);
    });
    recommendations
      .filter((item) => String(item?.type || "").toLowerCase().startsWith(slotType))
      .forEach((item) => {
        const merged = mergeGearMeta(item, slotType, item?.usageLevel || "70");
        if (!merged.token || dedupe.has(merged.token)) return;
        dedupe.add(merged.token);
        list.push(merged);
      });
    return sortByName(list, "name", "AZ");
  };

  return {
    id: character?.id || "",
    name: character?.name || "Unknown",
    role: character?.role || "-",
    tier: character?.tier || "-",
    element: profile?.element || "-",
    weapon: profile?.weapon || "-",
    rarity: raritySafe,
    buildWeapon: String(build.weapon || "Belum ada data"),
    buildSkills: String(build.skills || "Belum ada data"),
    buildTeam: String(build.team || "Belum ada data"),
    defaultUid: `AEND-${uidToken || "UNIT"}-${String(raritySafe).padStart(2, "0")}01`,
    defaultRegion: "SEA",
    defaultLevel: 70,
    defaultPotential: potentialDefault,
    defaultBreakthrough: breakthroughDefault,
    defaultWeaponName: cleanText(firstChoice(build.weapon, profile?.weapon || "-"), 64, "-"),
    defaultWeaponLevel: 70,
    defaultWeaponBreakthrough: breakthroughDefault,
    defaultWeaponPotential: Math.max(1, potentialDefault - 1),
    defaultWeaponSkillLevel: 7,
    defaultGearArmor: cleanText(progression70?.armor?.name || armorFallback, 68, "-"),
    defaultGearGloves: cleanText(progression70?.gloves?.name || glovesFallback, 68, "-"),
    defaultGearKit1: cleanText(progression70?.kit1?.name || kitsFallback[0]?.name || "-", 68, "-"),
    defaultGearKit2: cleanText(progression70?.kit2?.name || kitsFallback[1]?.name || kitsFallback[0]?.name || "-", 68, "-"),
    defaultSkillBasic: skillLevelDefaults.basic,
    defaultSkillCombo: skillLevelDefaults.combo,
    defaultSkillActive: skillLevelDefaults.active,
    defaultSkillUltimate: skillLevelDefaults.ultimate,
    defaultSkillTalent: skillLevelDefaults.talent,
    gearOptions: {
      armor: collectGearBySlot("armor"),
      gloves: collectGearBySlot("gloves"),
      kit1: collectGearBySlot("kit1"),
      kit2: collectGearBySlot("kit2"),
    },
    image,
    imageCandidates,
    fallbackImage,
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

function waitForImageElement(imgEl, timeoutMs = 2400) {
  return new Promise((resolve) => {
    if (!imgEl) {
      resolve();
      return;
    }
    if (imgEl.complete && imgEl.naturalWidth > 0) {
      resolve();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    imgEl.addEventListener("load", () => {
      window.clearTimeout(timer);
      finish();
    }, { once: true });
    imgEl.addEventListener("error", () => {
      window.clearTimeout(timer);
      finish();
    }, { once: true });
  });
}

async function waitPreviewAssets(previewEl) {
  if (!previewEl || typeof window === "undefined") return;
  const imageNodes = Array.from(previewEl.querySelectorAll("img"));
  const tasks = imageNodes.map((img) => waitForImageElement(img));
  if (typeof document !== "undefined" && document.fonts?.ready) {
    tasks.push(
      Promise.race([
        document.fonts.ready.catch(() => undefined),
        new Promise((resolve) => window.setTimeout(resolve, 1200)),
      ])
    );
  }
  await Promise.all(tasks);
}

function isCanvasLikelyBlank(canvas) {
  if (!canvas) return true;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return true;
  const width = canvas.width || 0;
  const height = canvas.height || 0;
  if (width < 2 || height < 2) return true;
  const step = Math.max(4, Math.floor(Math.min(width, height) / 80));
  let total = 0;
  let opaque = 0;
  let minLum = 255;
  let maxLum = 0;
  try {
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const a = pixel[3];
        total += 1;
        if (a > 8) {
          opaque += 1;
          const lum = Math.round(pixel[0] * 0.2126 + pixel[1] * 0.7152 + pixel[2] * 0.0722);
          if (lum < minLum) minLum = lum;
          if (lum > maxLum) maxLum = lum;
        }
      }
    }
  } catch {
    return false;
  }
  if (!total || opaque / total < 0.02) return true;
  if (maxLum < 26 && maxLum - minLum < 4) return true;
  return false;
}

async function exportCreatorCardPng(character, preset, state, statusEl, previewEl) {
  let canvas = await captureCreatorPreviewCanvas(previewEl, statusEl);
  if (!canvas) {
    canvas = await renderCreatorCardCanvas(character, preset, state, statusEl);
    if (statusEl) {
      statusEl.textContent = "Capture live preview gagal, memakai fallback export.";
    }
  }
  if (!canvas) throw new Error("Capture preview gagal");
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `endfield-card-${String(character.id || character.name || "operator").toLowerCase()}.png`;
  link.click();
}

async function captureCreatorPreviewCanvas(previewEl, statusEl) {
  if (previewEl && typeof window !== "undefined" && typeof window.html2canvas === "function") {
    let stage = null;
    try {
      await waitPreviewAssets(previewEl);
      const isCompactScreen =
        typeof window.matchMedia === "function" ? window.matchMedia("(max-width: 900px)").matches : false;
      const scaleBase = Number.isFinite(window.devicePixelRatio)
        ? Math.min(isCompactScreen ? 2 : 2.25, Math.max(1.25, window.devicePixelRatio))
        : isCompactScreen
        ? 1.5
        : 2;
      const rect = previewEl.getBoundingClientRect();
      const targetWidth = Math.max(1, Math.round(previewEl.scrollWidth || rect.width || 1));
      const targetHeight = Math.max(1, Math.round(previewEl.scrollHeight || rect.height || 1));

      const clone = previewEl.cloneNode(true);
      if (!(clone instanceof HTMLElement)) return null;
      clone.style.width = `${targetWidth}px`;
      clone.style.minWidth = `${targetWidth}px`;
      clone.style.maxWidth = `${targetWidth}px`;
      clone.style.height = `${targetHeight}px`;
      clone.style.minHeight = `${targetHeight}px`;
      clone.style.maxHeight = `${targetHeight}px`;
      clone.style.margin = "0";
      clone.style.transform = "none";
      clone.style.contain = "layout paint";

      const sourceImgs = Array.from(previewEl.querySelectorAll("img"));
      const cloneImgs = Array.from(clone.querySelectorAll("img"));
      cloneImgs.forEach((img, index) => {
        const source = sourceImgs[index];
        const src = String(source?.currentSrc || source?.src || img.getAttribute("src") || "").trim();
        if (src) img.src = src;
        img.removeAttribute("srcset");
        img.loading = "eager";
        img.decoding = "sync";
      });

      stage = document.createElement("div");
      stage.style.position = "fixed";
      stage.style.left = "-100000px";
      stage.style.top = "0";
      stage.style.width = `${targetWidth}px`;
      stage.style.height = `${targetHeight}px`;
      stage.style.pointerEvents = "none";
      stage.style.opacity = "1";
      stage.style.zIndex = "-1";
      stage.style.overflow = "hidden";
      stage.appendChild(clone);
      document.body.appendChild(stage);
      await waitPreviewAssets(clone);

      const attempts = [
        {
          useCORS: true,
          allowTaint: false,
          foreignObjectRendering: false,
          imageTimeout: 15000,
          backgroundColor: "#0a1117",
          scale: scaleBase,
          logging: false,
          width: targetWidth + 2,
          height: targetHeight + 2,
          windowWidth: targetWidth,
          windowHeight: targetHeight,
          scrollX: 0,
          scrollY: 0,
        },
        {
          useCORS: true,
          allowTaint: false,
          foreignObjectRendering: true,
          imageTimeout: 15000,
          backgroundColor: "#0a1117",
          scale: scaleBase,
          logging: false,
          width: targetWidth + 2,
          height: targetHeight + 2,
          windowWidth: targetWidth,
          windowHeight: targetHeight,
          scrollX: 0,
          scrollY: 0,
        },
      ];
      let firstCanvas = null;
      for (const options of attempts) {
        try {
          const canvas = await window.html2canvas(clone, options);
          if (!firstCanvas && canvas) firstCanvas = canvas;
          if (!isCanvasLikelyBlank(canvas)) {
            return canvas;
          }
        } catch {}
      }
      const directAttempts = attempts.map((item) => ({
        ...item,
        width: targetWidth + 2,
        height: targetHeight + 2,
        windowWidth: Math.max(targetWidth, Math.round(window.innerWidth || targetWidth)),
        windowHeight: Math.max(targetHeight, Math.round(window.innerHeight || targetHeight)),
      }));
      for (const options of directAttempts) {
        try {
          const canvas = await window.html2canvas(previewEl, options);
          if (!firstCanvas && canvas) firstCanvas = canvas;
          if (!isCanvasLikelyBlank(canvas)) {
            return canvas;
          }
        } catch {}
      }
      return firstCanvas;
    } catch (error) {
      console.error(error);
      if (statusEl) {
        statusEl.textContent = "Capture preview gagal. Coba refresh lalu export lagi.";
      }
    } finally {
      if (stage && stage.parentNode) {
        stage.parentNode.removeChild(stage);
      }
    }
  }
  return null;
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

  const accent = preset.accent || "#fdfd1f";
  const ink = preset.ink || "#f6f8fb";
  const level = clampNumber(state?.level, 1, 90, 70);
  const potential = clampNumber(state?.potential, 0, 5, 3);
  const breakthrough = clampNumber(state?.breakthrough, 0, 4, 2);
  const affinity = clampNumber(state?.affinity, 0, 4, 2);
  const region = String(state?.region || "SEA").slice(0, 8);
  const weaponName = String(state?.weaponName || character?.buildWeapon || "-");
  const weaponLevel = clampNumber(state?.weaponLevel, 1, 90, level);
  const weaponSkillLevel = clampNumber(state?.weaponSkillLevel, 1, 9, 7);
  const gearArmor = String(state?.gearArmor || "-");
  const gearGloves = String(state?.gearGloves || "-");
  const gearKit1 = String(state?.gearKit1 || "-");
  const gearKit2 = String(state?.gearKit2 || "-");
  const profileId = creatorProfileId(character, state);
  const starText = creatorStars(character?.rarity);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, preset.bgA || "#23262b");
  gradient.addColorStop(1, preset.bgB || "#090b0e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid overlay to mimic tactical board UI.
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();

  const drawRoundedPanel = (x, y, w, h, r, fill, stroke, strokeWidth = 1.4) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  };

  drawRoundedPanel(70, 88, 1460, 732, 14, "rgba(0,0,0,0.34)", "rgba(255,255,255,0.12)", 2);
  drawRoundedPanel(96, 132, 840, 566, 16, "rgba(0,0,0,0.35)", "rgba(255,255,255,0.08)");

  ctx.globalAlpha = 0.85;
  ctx.fillStyle = accent;
  ctx.fillRect(96, 108, 360, 10);
  ctx.fillRect(96, 806, 370, 7);
  ctx.fillRect(1238, 132, 292, 7);
  ctx.globalAlpha = 1;

  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(95, 131, 842, 568);

  const artBounds = { x: 892, y: 128, w: 608, h: 632 };
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(942, 128);
  ctx.lineTo(1500, 128);
  ctx.lineTo(1500, 708);
  ctx.lineTo(1458, 760);
  ctx.lineTo(892, 760);
  ctx.lineTo(892, 186);
  ctx.closePath();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.clip();

  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(artBounds.x, artBounds.y, artBounds.w, artBounds.h);
  const getPreviewImgSrc = (id) => {
    if (typeof document === "undefined") return "";
    const node = document.getElementById(id);
    return String(node?.getAttribute("src") || node?.src || "").trim();
  };
  const previewMainImage = getPreviewImgSrc("creator-preview-image");
  const imageUrl = previewMainImage || asset(character.image);
  try {
    const img = await loadCanvasImage(imageUrl);
    const scale = Math.max(artBounds.w / img.width, artBounds.h / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const drawX = artBounds.x + (artBounds.w - drawW) / 2;
    const drawY = artBounds.y + (artBounds.h - drawH) / 2;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  } catch {
    const fallback = character?.fallbackImage ? asset(character.fallbackImage) : "";
    if (fallback && fallback !== imageUrl) {
      try {
        const img = await loadCanvasImage(fallback);
        const scale = Math.max(artBounds.w / img.width, artBounds.h / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const drawX = artBounds.x + (artBounds.w - drawW) / 2;
        const drawY = artBounds.y + (artBounds.h - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      } catch {
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(artBounds.x, artBounds.y, artBounds.w, artBounds.h);
        ctx.fillStyle = "#dcefff";
        ctx.font = "700 40px Rajdhani, sans-serif";
        ctx.fillText("NO IMAGE", artBounds.x + 186, artBounds.y + 320);
      }
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(artBounds.x, artBounds.y, artBounds.w, artBounds.h);
      ctx.fillStyle = "#dcefff";
      ctx.font = "700 40px Rajdhani, sans-serif";
      ctx.fillText("NO IMAGE", artBounds.x + 186, artBounds.y + 320);
    }
  }
  ctx.restore();
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = accent;
  ctx.fillRect(940, 736, 514, 9);
  ctx.globalAlpha = 1;

  ctx.fillStyle = "rgba(245,249,255,0.7)";
  ctx.font = "600 24px Rajdhani, sans-serif";
  ctx.fillText("OPERATOR SHOWCASE", 128, 170);

  ctx.fillStyle = ink;
  ctx.font = "700 46px Rajdhani, sans-serif";
  ctx.fillText((state.alias || "Frontier Cadre").slice(0, 28), 128, 220);
  ctx.fillStyle = "rgba(230,240,249,0.84)";
  ctx.font = "600 21px Rajdhani, sans-serif";
  ctx.fillText(`UID ${profileId}  |  REGION ${region}`, 128, 252);

  if (state.showTier) {
    drawRoundedPanel(622, 174, 168, 44, 22, "rgba(0,0,0,0.3)", accent, 1.8);
    ctx.fillStyle = ink;
    ctx.font = "700 24px Rajdhani, sans-serif";
    ctx.fillText(`TIER ${character.tier || "-"}`, 648, 203);
  }
  ctx.fillStyle = accent;
  ctx.font = "700 30px Rajdhani, sans-serif";
  ctx.fillText(starText, 804, 205);

  ctx.fillStyle = ink;
  ctx.font = "700 110px Rajdhani, sans-serif";
  ctx.fillText((character.name || "Unknown").slice(0, 18), 128, 362);

  if (state.showRole) {
    ctx.fillStyle = "rgba(234,243,252,0.84)";
    ctx.font = "700 34px Rajdhani, sans-serif";
    ctx.fillText((character.role || "-").toUpperCase().slice(0, 30), 128, 412);
  }

  ctx.fillStyle = ink;
  ctx.font = "500 35px Space Grotesk, sans-serif";
  ctx.fillText((state.tagline || "High Priority Deployment").slice(0, 40), 128, 462);

  const chips = [];
  chips.push(`Element: ${character.element}`);
  chips.push(`Weapon Type: ${character.weapon}`);

  let chipX = 128;
  const chipY = 512;
  ctx.font = "600 30px Rajdhani, sans-serif";
  chips.forEach((chip) => {
    const w = Math.ceil(ctx.measureText(chip).width) + 46;
    drawRoundedPanel(chipX, chipY - 34, w, 48, 24, "rgba(0,0,0,0.34)", "rgba(255,255,255,0.12)", 1.5);
    ctx.fillStyle = "rgba(236,243,249,0.92)";
    ctx.fillText(chip, chipX + 22, chipY - 2);
    chipX += w + 16;
  });

  const drawMiniIcon = async (src, x, y, size = 30) => {
    if (!src) return;
    try {
      const icon = await loadCanvasImage(src);
      drawRoundedPanel(x, y, size, size, 8, "rgba(0,0,0,0.32)", "rgba(255,255,255,0.2)", 1.2);
      ctx.drawImage(icon, x + 2, y + 2, size - 4, size - 4);
    } catch {}
  };

  ctx.fillStyle = "rgba(233,242,251,0.9)";
  ctx.font = "600 24px Rajdhani, sans-serif";
  await drawMiniIcon(getPreviewImgSrc("creator-preview-weapon-icon"), 128, 548, 30);
  ctx.fillText(`WEAPON: ${weaponName.slice(0, 44)} (Lv ${weaponLevel} | Skill ${weaponSkillLevel})`, 168, 574);

  const gearEntries = [
    { label: "Armor", name: gearArmor, iconId: "creator-preview-gear-armor-icon" },
    { label: "Gloves", name: gearGloves, iconId: "creator-preview-gear-gloves-icon" },
    { label: "Kit 1", name: gearKit1, iconId: "creator-preview-gear-kit1-icon" },
    { label: "Kit 2", name: gearKit2, iconId: "creator-preview-gear-kit2-icon" },
  ];
  ctx.font = "500 19px Space Grotesk, sans-serif";
  for (let index = 0; index < gearEntries.length; index += 1) {
    const entry = gearEntries[index];
    const col = index % 2;
    const row = Math.floor(index / 2);
    const baseX = 128 + col * 405;
    const baseY = 588 + row * 34;
    await drawMiniIcon(getPreviewImgSrc(entry.iconId), baseX, baseY - 22, 24);
    ctx.fillText(`${entry.label}: ${entry.name.slice(0, 28)}`, baseX + 30, baseY - 2);
  }

  const statRows = [
    { label: "LEVEL", value: String(level), width: 160 },
    { label: "POT", value: String(potential), width: 140 },
    { label: "BT", value: String(breakthrough), width: 140 },
    { label: "AFF", value: String(affinity), width: 150 },
    { label: "UID/REG", value: `${profileId} • ${region}`, width: 688 },
  ];

  let statX = 100;
  statRows.forEach((item) => {
    const cellW = item.width || 180;
    drawRoundedPanel(statX, 732, cellW, 68, 12, "rgba(0,0,0,0.34)", "rgba(255,255,255,0.14)", 1.6);
    ctx.fillStyle = "rgba(207,219,230,0.76)";
    ctx.font = "600 18px Rajdhani, sans-serif";
    ctx.fillText(item.label, statX + 18, 758);
    ctx.fillStyle = accent;
    ctx.font = "700 34px Rajdhani, sans-serif";
    const maxChars = item.label === "UID/REG" ? 40 : 20;
    ctx.fillText(item.value.slice(0, maxChars), statX + 18, 790);
    statX += cellW + 10;
  });

  ctx.fillStyle = "rgba(222,233,242,0.84)";
  ctx.font = "500 24px Space Grotesk, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("endfield-ind.my.id · fanmade showcase", 1496, 790);
  ctx.textAlign = "left";
  return canvas;
}

async function shareCreatorCardPng(character, preset, state, statusEl, previewEl) {
  let canvas = await captureCreatorPreviewCanvas(previewEl, statusEl);
  if (!canvas) {
    canvas = await renderCreatorCardCanvas(character, preset, state, statusEl);
    if (statusEl) {
      statusEl.textContent = "Capture live preview gagal, memakai fallback export.";
    }
  }
  if (!canvas) throw new Error("Capture preview gagal");
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

  await exportCreatorCardPng(character, preset, state, statusEl, previewEl);
  if (statusEl) statusEl.textContent = "Share file tidak didukung browser ini. PNG di-download otomatis.";
}

async function initCardCreatorPage(characters) {
  const refs = {
    controls: document.querySelector(".creator-controls"),
    character: document.getElementById("creator-character"),
    style: document.getElementById("creator-style"),
    alias: document.getElementById("creator-alias"),
    uid: document.getElementById("creator-uid"),
    region: document.getElementById("creator-region"),
    tagline: document.getElementById("creator-tagline"),
    buildSkills: document.getElementById("creator-build-skills"),
    buildTeam: document.getElementById("creator-build-team"),
    level: document.getElementById("creator-level"),
    potential: document.getElementById("creator-potential"),
    breakthrough: document.getElementById("creator-breakthrough"),
    affinity: document.getElementById("creator-affinity"),
    breakthroughSelector: document.getElementById("creator-breakthrough-selector"),
    potentialSelector: document.getElementById("creator-potential-selector"),
    affinitySelector: document.getElementById("creator-affinity-selector"),
    weaponSelect: document.getElementById("creator-weapon-select"),
    weaponIcon: document.getElementById("creator-weapon-icon"),
    weaponName: document.getElementById("creator-weapon-name"),
    weaponLevel: document.getElementById("creator-weapon-level"),
    weaponBreakthrough: document.getElementById("creator-weapon-breakthrough"),
    weaponPotential: document.getElementById("creator-weapon-potential"),
    weaponBreakthroughSelector: document.getElementById("creator-weapon-breakthrough-selector"),
    weaponPotentialSelector: document.getElementById("creator-weapon-potential-selector"),
    weaponSkillLevel: document.getElementById("creator-weapon-skill-level"),
    weaponSkillLevel2: document.getElementById("creator-weapon-skill-level-2"),
    weaponSkillLevel3: document.getElementById("creator-weapon-skill-level-3"),
    essenceLabel1: document.getElementById("creator-essence-label-1"),
    essenceLabel2: document.getElementById("creator-essence-label-2"),
    essenceLabel3: document.getElementById("creator-essence-label-3"),
    essenceBars1: document.getElementById("creator-essence-bars-1"),
    essenceBars2: document.getElementById("creator-essence-bars-2"),
    essenceBars3: document.getElementById("creator-essence-bars-3"),
    gearArmor: document.getElementById("creator-gear-armor"),
    gearGloves: document.getElementById("creator-gear-gloves"),
    gearKit1: document.getElementById("creator-gear-kit1"),
    gearKit2: document.getElementById("creator-gear-kit2"),
    gearArmorIcon: document.getElementById("creator-gear-armor-icon"),
    gearGlovesIcon: document.getElementById("creator-gear-gloves-icon"),
    gearKit1Icon: document.getElementById("creator-gear-kit1-icon"),
    gearKit2Icon: document.getElementById("creator-gear-kit2-icon"),
    artificeArmor: document.getElementById("creator-artifice-armor"),
    artificeGloves: document.getElementById("creator-artifice-gloves"),
    artificeKit1: document.getElementById("creator-artifice-kit1"),
    artificeKit2: document.getElementById("creator-artifice-kit2"),
    skillBasic: document.getElementById("creator-skill-basic"),
    skillCombo: document.getElementById("creator-skill-combo"),
    skillActive: document.getElementById("creator-skill-active"),
    skillUltimate: document.getElementById("creator-skill-ultimate"),
    skillTalent: document.getElementById("creator-skill-talent"),
    showTier: document.getElementById("creator-show-tier"),
    showRole: document.getElementById("creator-show-role"),
    random: document.getElementById("creator-random"),
    publish: document.getElementById("creator-publish"),
    share: document.getElementById("creator-share"),
    download: document.getElementById("creator-download"),
    shareLink: document.getElementById("creator-share-link"),
    copyLink: document.getElementById("creator-copy-link"),
    status: document.getElementById("creator-status"),
    preview: document.getElementById("creator-preview"),
    previewAlias: document.getElementById("creator-preview-alias"),
    previewTier: document.getElementById("creator-preview-tier"),
    previewStars: document.getElementById("creator-preview-stars"),
    previewImage: document.getElementById("creator-preview-image"),
    previewName: document.getElementById("creator-preview-name"),
    previewRole: document.getElementById("creator-preview-role"),
    previewTagline: document.getElementById("creator-preview-tagline"),
    previewRegion: document.getElementById("creator-preview-region"),
    previewElement: document.getElementById("creator-preview-element"),
    previewWeapon: document.getElementById("creator-preview-weapon"),
    previewLevel: document.getElementById("creator-preview-level"),
    previewPotential: document.getElementById("creator-preview-potential"),
    previewBreakthrough: document.getElementById("creator-preview-breakthrough"),
    previewAffinity: document.getElementById("creator-preview-affinity"),
    previewBreakthroughIcons: document.getElementById("creator-preview-breakthrough-icons"),
    previewPotentialIcons: document.getElementById("creator-preview-potential-icons"),
    previewAffinityIcons: document.getElementById("creator-preview-affinity-icons"),
    previewUid: document.getElementById("creator-preview-uid"),
    previewWeaponIcon: document.getElementById("creator-preview-weapon-icon"),
    previewWeaponName: document.getElementById("creator-preview-weapon-name"),
    previewWeaponLevel: document.getElementById("creator-preview-weapon-level"),
    previewWeaponBreakthrough: document.getElementById("creator-preview-weapon-breakthrough"),
    previewWeaponPotential: document.getElementById("creator-preview-weapon-potential"),
    previewWeaponSkillLevel: document.getElementById("creator-preview-weapon-skill-level"),
    previewWeaponSkillLevel2: document.getElementById("creator-preview-weapon-skill-level-2"),
    previewWeaponSkillLevel3: document.getElementById("creator-preview-weapon-skill-level-3"),
    previewWeaponBreakthroughIcons: document.getElementById("creator-preview-weapon-breakthrough-icons"),
    previewWeaponPotentialIcons: document.getElementById("creator-preview-weapon-potential-icons"),
    previewGearArmorIcon: document.getElementById("creator-preview-gear-armor-icon"),
    previewGearGlovesIcon: document.getElementById("creator-preview-gear-gloves-icon"),
    previewGearKit1Icon: document.getElementById("creator-preview-gear-kit1-icon"),
    previewGearKit2Icon: document.getElementById("creator-preview-gear-kit2-icon"),
    previewGearArmor: document.getElementById("creator-preview-gear-armor"),
    previewGearGloves: document.getElementById("creator-preview-gear-gloves"),
    previewGearKit1: document.getElementById("creator-preview-gear-kit1"),
    previewGearKit2: document.getElementById("creator-preview-gear-kit2"),
    previewGearArmorArtifice: document.getElementById("creator-preview-gear-armor-artifice"),
    previewGearGlovesArtifice: document.getElementById("creator-preview-gear-gloves-artifice"),
    previewGearKit1Artifice: document.getElementById("creator-preview-gear-kit1-artifice"),
    previewGearKit2Artifice: document.getElementById("creator-preview-gear-kit2-artifice"),
    previewSkillBasic: document.getElementById("creator-preview-skill-basic"),
    previewSkillCombo: document.getElementById("creator-preview-skill-combo"),
    previewSkillActive: document.getElementById("creator-preview-skill-active"),
    previewSkillUltimate: document.getElementById("creator-preview-skill-ultimate"),
    previewSkillTalent: document.getElementById("creator-preview-skill-talent"),
    previewBuildSkills: document.getElementById("creator-preview-build-skills"),
    previewBuildTeam: document.getElementById("creator-preview-build-team"),
    previewEssenceLabel1: document.getElementById("creator-preview-essence-label-1"),
    previewEssenceLabel2: document.getElementById("creator-preview-essence-label-2"),
    previewEssenceLabel3: document.getElementById("creator-preview-essence-label-3"),
    previewEssenceBars1: document.getElementById("creator-preview-essence-bars-1"),
    previewEssenceBars2: document.getElementById("creator-preview-essence-bars-2"),
    previewEssenceBars3: document.getElementById("creator-preview-essence-bars-3"),
  };
  if (Object.values(refs).some((item) => !item)) return;

  const [liveHub, showcaseCatalogRaw] = await Promise.all([
    fetchLiveHubData().catch(() => null),
    fetchShowcaseCatalog().catch(() => null),
  ]);
  const showcaseCatalog = normalizeShowcaseCatalog(showcaseCatalogRaw);

  const builtCharacters = sortByName(
    (characters || []).map((character) => buildCreatorCharacterData(character, showcaseCatalog)),
    "name",
    "AZ"
  );
  if (!builtCharacters.length) {
    refs.status.textContent = "Belum ada data karakter untuk showcase.";
    return;
  }
  const rawPresets = Array.isArray(liveHub?.cardCreator?.presets) && liveHub.cardCreator.presets.length
    ? liveHub.cardCreator.presets
    : [
        { id: "showcase-noir", name: "Showcase Noir", bgA: "#2a2a2e", bgB: "#090b0e", accent: "#fdfd1f", ink: "#f6f8fb" },
        { id: "frontier", name: "Frontier Amber", bgA: "#1d2c3d", bgB: "#0d1622", accent: "#f7cb6b", ink: "#fef5dd" },
        { id: "talos", name: "Talos Steel", bgA: "#123349", bgB: "#09131d", accent: "#70d9ff", ink: "#e9f8ff" },
      ];
  const presets = rawPresets.map((item) => {
    if (item?.id === "frontier") {
      return {
        ...item,
        bgA: "#2a2a2e",
        bgB: "#090b0e",
        accent: "#fdfd1f",
        ink: "#f6f8fb",
      };
    }
    return item;
  });
  if (!presets.some((item) => item?.id === "showcase-noir")) {
    presets.unshift({
      id: "showcase-noir",
      name: "Showcase Noir",
      bgA: "#2a2a2e",
      bgB: "#090b0e",
      accent: "#fdfd1f",
      ink: "#f6f8fb",
    });
  }
  const taglines = Array.isArray(liveHub?.cardCreator?.taglines) && liveHub.cardCreator.taglines.length
    ? liveHub.cardCreator.taglines
    : ["High Priority Deployment", "AIC Tactical Unit", "Wuling Response Team"];

  refs.character.innerHTML = builtCharacters
    .map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`)
    .join("");
  refs.style.innerHTML = presets.map((item) => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join("");

  const cleanText = (value, max = 72, fallback = "") => {
    const text = String(value || "")
      .replace(/\s+/g, " ")
      .trim();
    const sliced = text.slice(0, max);
    return sliced || fallback;
  };
  const sanitizeUid = (value, fallback = "") =>
    cleanText(value, 24, fallback)
      .replace(/[^A-Za-z0-9_-]/g, "")
      .toUpperCase();
  const normalizeRegion = (value, fallback = "SEA") => {
    const current = String(value || "").trim();
    const options = [...refs.region.options].map((opt) => String(opt.value || "").trim());
    return options.includes(current) ? current : fallback;
  };
  const toImageSrc = (value, fallback = "assets/skill-icons/basic.webp") => {
    const candidate = String(value || "").trim();
    if (!candidate) return asset(fallback);
    return asset(candidate);
  };
  const slotStateKeys = {
    armor: "gearArmor",
    gloves: "gearGloves",
    kit1: "gearKit1",
    kit2: "gearKit2",
  };
  const slotRefKeys = {
    armor: "gearArmor",
    gloves: "gearGloves",
    kit1: "gearKit1",
    kit2: "gearKit2",
  };
  const slotIconRefKeys = {
    armor: "gearArmorIcon",
    gloves: "gearGlovesIcon",
    kit1: "gearKit1Icon",
    kit2: "gearKit2Icon",
  };
  const slotArtificeRefKeys = {
    armor: "artificeArmor",
    gloves: "artificeGloves",
    kit1: "artificeKit1",
    kit2: "artificeKit2",
  };
  const slotPreviewIconRefKeys = {
    armor: "previewGearArmorIcon",
    gloves: "previewGearGlovesIcon",
    kit1: "previewGearKit1Icon",
    kit2: "previewGearKit2Icon",
  };
  const slotPreviewNameRefKeys = {
    armor: "previewGearArmor",
    gloves: "previewGearGloves",
    kit1: "previewGearKit1",
    kit2: "previewGearKit2",
  };
  const slotPreviewArtificeRefKeys = {
    armor: "previewGearArmorArtifice",
    gloves: "previewGearGlovesArtifice",
    kit1: "previewGearKit1Artifice",
    kit2: "previewGearKit2Artifice",
  };

  const parseStatNumber = (rawValue) => {
    const text = String(rawValue || "").trim().replace(/,/g, ".");
    if (!text) return null;
    const match = text.match(/([+-]?\d+(?:\.\d+)?)/);
    if (!match) return null;
    let numberValue = Number(match[1]);
    if (!Number.isFinite(numberValue)) return null;
    let isPercent = /%/.test(text);
    if (!isPercent && Math.abs(numberValue) < 1 && /(dmg|eff|rate|chance|bonus|up|gain|intensity|arts|heat|nature|crit)/i.test(text)) {
      numberValue *= 100;
      isPercent = true;
    }
    return { value: numberValue, percent: isPercent };
  };
  const formatSigned = (value, asPercent) => {
    const fixed = asPercent ? value.toFixed(1) : value.toFixed(value % 1 === 0 ? 0 : 1);
    const cleaned = fixed.replace(/\.0$/, "");
    return `${value >= 0 ? "+" : ""}${cleaned}${asPercent ? "%" : ""}`;
  };
  const artificeAdjustedStatText = (rawValue, tier) => {
    const parsed = parseStatNumber(rawValue);
    const safeTier = clampNumber(tier, 0, 3, 0);
    if (!parsed) return `${String(rawValue || "-")} (Artifice +${safeTier})`;
    const boosted = parsed.value * (1 + safeTier * 0.04);
    return `${formatSigned(boosted, parsed.percent)} (Artifice +${safeTier})`;
  };
  const getIconSet = (kind) => {
    if (kind === "elite") return CREATOR_ELITE_ICON_URLS;
    if (kind === "potential") {
      return CREATOR_POTENTIAL_ICON_URLS.map((url, index) =>
        url || svgBadgeDataUrl(`P${index}`, "#111f2f", "#f3f8ff", "#6f8ba2")
      );
    }
    if (kind === "affinity") {
      return CREATOR_AFFINITY_BADGES.map((label, index) =>
        svgBadgeDataUrl(label, index % 2 === 0 ? "#162738" : "#1b2d3e", "#d9ecff", "#6f8ba2")
      );
    }
    return [];
  };
  const iconStripHtml = (kind, activeValue, max) => {
    const set = getIconSet(kind);
    const rows = [];
    for (let index = 0; index <= max; index += 1) {
      const src = set[index] ? toImageSrc(set[index], "") : svgBadgeDataUrl(String(index), "#102130", "#d8ecff", "#6b8aa4");
      const activeClass = index <= activeValue ? " is-active" : "";
      rows.push(`<span class="creator-icon-pill${activeClass}"><img src="${esc(src)}" alt="${esc(kind)} ${index}" loading="lazy" /></span>`);
    }
    return rows.join("");
  };
  const iconSelectorHtml = (kind, activeValue, max, target) => {
    const set = getIconSet(kind);
    const rows = [];
    for (let index = 0; index <= max; index += 1) {
      const src = set[index] ? toImageSrc(set[index], "") : svgBadgeDataUrl(String(index), "#102130", "#d8ecff", "#6b8aa4");
      const activeClass = index === activeValue ? " is-active" : "";
      rows.push(
        `<button type="button" class="creator-icon-choice${activeClass}" data-icon-kind="${esc(kind)}" data-icon-target="${esc(target)}" data-icon-value="${index}" aria-label="${esc(
          target
        )} ${index}"><img src="${esc(src)}" alt="${esc(kind)} ${index}" loading="lazy" /></button>`
      );
    }
    return rows.join("");
  };

  const weaponEssencePreset = (weaponName) => {
    const token = normalizeCreatorToken(weaponName);
    if (token === normalizeCreatorToken("Grand Vision")) {
      return {
        labels: ["Agility Boost [L]", "Attack Boost [L]", "Infliction: Long Time Wish"],
        fallbackCaps: [9, 9, 9],
      };
    }
    return {
      labels: ["Agility Boost [L]", "Attack Boost [L]", "Infliction Bonus"],
      fallbackCaps: [9, 9, 9],
    };
  };
  const weaponEssenceBoundsDefault = [
    { passive: { min: 1, max: 3 }, special: { min: 1, max: 3 }, potential: { min: 1, max: 4 } },
    { passive: { min: 2, max: 5 }, special: { min: 1, max: 4 }, potential: { min: 1, max: 4 } },
    { passive: { min: 2, max: 6 }, special: { min: 2, max: 6 }, potential: { min: 1, max: 4 } },
    { passive: { min: 3, max: 8 }, special: { min: 2, max: 7 }, potential: { min: 1, max: 4 } },
    { passive: { min: 3, max: 9 }, special: { min: 3, max: 9 }, potential: { min: 1, max: 4 } },
  ];
  const weaponEssenceBoundsRarity3 = [
    { passive: { min: 1, max: 3 }, special: { min: 1, max: 4 }, potential: { min: 0, max: 0 } },
    { passive: { min: 2, max: 5 }, special: { min: 1, max: 4 }, potential: { min: 0, max: 0 } },
    { passive: { min: 2, max: 6 }, special: { min: 1, max: 4 }, potential: { min: 0, max: 0 } },
    { passive: { min: 3, max: 8 }, special: { min: 1, max: 4 }, potential: { min: 0, max: 0 } },
    { passive: { min: 3, max: 9 }, special: { min: 1, max: 4 }, potential: { min: 0, max: 0 } },
  ];
  const weaponPotentialEssenceBonus = [
    { min: 0, max: 0 },
    { min: 1, max: 1 },
    { min: 2, max: 2 },
    { min: 3, max: 3 },
    { min: 4, max: 4 },
    { min: 5, max: 5 },
  ];
  const getWeaponSkillBounds = (rarity, breakthrough, weaponPotential, slotIndex) => {
    const bt = clampNumber(breakthrough, 0, 4, 0);
    const wp = clampNumber(weaponPotential, 0, 5, 0);
    const table = Number(rarity) === 3 ? weaponEssenceBoundsRarity3 : weaponEssenceBoundsDefault;
    const row = table[bt] || table[0];
    if (!row) return { min: 1, max: 9 };
    if (slotIndex === 0) return { min: row.passive.min, max: row.passive.max };
    if (slotIndex === 1) return { min: row.special.min, max: row.special.max };
    if (slotIndex === 2) {
      const potentialBonus = weaponPotentialEssenceBonus[wp] || weaponPotentialEssenceBonus[0];
      return {
        min: clampNumber(row.potential.min + potentialBonus.min, 0, 9, 0),
        max: clampNumber(row.potential.max + potentialBonus.max, 0, 9, 0),
      };
    }
    return { min: 1, max: 9 };
  };

  const weaponByToken = (() => {
    const map = new Map();
    showcaseCatalog.weapons.forEach((weapon) => {
      map.set(weapon.token, weapon);
    });
    return map;
  })();
  const weaponAliasByToken = (() => {
    const map = new Map();
    Object.entries(showcaseCatalog.weaponAliases || {}).forEach(([fromName, targetName]) => {
      const fromToken = normalizeCreatorToken(fromName);
      if (!fromToken) return;
      map.set(fromToken, String(targetName || "").trim());
    });
    return map;
  })();
  const findWeaponMeta = (weaponName) => {
    const raw = String(weaponName || "").trim();
    if (!raw) return null;
    const token = normalizeCreatorToken(raw);
    if (weaponByToken.has(token)) return weaponByToken.get(token);
    const aliasedName = weaponAliasByToken.get(token);
    if (aliasedName) {
      const aliasToken = normalizeCreatorToken(aliasedName);
      if (weaponByToken.has(aliasToken)) return weaponByToken.get(aliasToken);
    }
    return showcaseCatalog.weapons.find((weapon) => weapon.token.includes(token) || token.includes(weapon.token)) || null;
  };
  const normalizeWeaponName = (weaponName, fallback = "-") => {
    const cleaned = cleanText(weaponName, 72, fallback);
    const meta = findWeaponMeta(cleaned);
    return meta?.name || cleaned || fallback;
  };
  const resolveWeaponRarity = () => {
    const weaponMeta = findWeaponMeta(state.weaponName);
    if (weaponMeta && Number.isFinite(Number(weaponMeta.rarity))) {
      return clampNumber(weaponMeta.rarity, 3, 6, 5);
    }
    if (/^obj/i.test(String(state.weaponName || "").trim())) {
      return 3;
    }
    return 5;
  };
  const resolveWeaponEssenceBounds = (slotIndex) =>
    getWeaponSkillBounds(resolveWeaponRarity(), state.weaponBreakthrough, state.weaponPotential, slotIndex);
  const weaponChoicesForState = (stateWeaponName) => {
    const list = [...showcaseCatalog.weapons];
    const normalized = normalizeWeaponName(stateWeaponName, "");
    const token = normalizeCreatorToken(normalized);
    if (normalized && !list.some((item) => item.token === token)) {
      list.unshift({ name: normalized, icon: "", source: "", token });
    }
    return list;
  };

  const characterTemplate = (character) => {
    const target = character || builtCharacters[0] || {};
    const fallbackUid = creatorProfileId(target, { level: target.defaultLevel || 70, affinity: 2 });
    return {
      alias: cleanText(`${target.name || "Operator"} Showcase`, 42, "Operator Showcase"),
      uid: sanitizeUid(target.defaultUid || fallbackUid, fallbackUid),
      region: normalizeRegion(target.defaultRegion || "SEA", "SEA"),
      tagline: cleanText(taglines[0] || "High Priority Deployment", 120, "High Priority Deployment"),
      level: clampNumber(target.defaultLevel, 1, 90, 70),
      potential: clampNumber(target.defaultPotential, 0, 5, 3),
      breakthrough: clampNumber(target.defaultBreakthrough, 0, 4, 2),
      affinity: 2,
      weaponName: normalizeWeaponName(target.defaultWeaponName || target.buildWeapon || "-", "-"),
      weaponLevel: clampNumber(target.defaultWeaponLevel, 1, 90, 70),
      weaponBreakthrough: clampNumber(target.defaultWeaponBreakthrough, 0, 4, 2),
      weaponPotential: clampNumber(target.defaultWeaponPotential, 0, 5, 1),
      weaponSkillLevel: clampNumber(target.defaultWeaponSkillLevel, 1, 9, 7),
      weaponSkillLevel2: clampNumber(target.defaultWeaponSkillLevel, 1, 9, 7),
      weaponSkillLevel3: clampNumber(target.defaultWeaponSkillLevel, 1, 9, 7),
      weaponEssence: [3, 2, 1],
      gearArmor: cleanText(target.defaultGearArmor || "-", 72, "-"),
      gearGloves: cleanText(target.defaultGearGloves || "-", 72, "-"),
      gearKit1: cleanText(target.defaultGearKit1 || "-", 72, "-"),
      gearKit2: cleanText(target.defaultGearKit2 || "-", 72, "-"),
      gearArtifice: {
        armor: [0, 0, 0],
        gloves: [0, 0, 0],
        kit1: [0, 0, 0],
        kit2: [0, 0, 0],
      },
      skillBasic: clampNumber(target.defaultSkillBasic, 1, 10, 7),
      skillCombo: clampNumber(target.defaultSkillCombo, 1, 10, 7),
      skillActive: clampNumber(target.defaultSkillActive, 1, 10, 8),
      skillUltimate: clampNumber(target.defaultSkillUltimate, 1, 10, 8),
      skillTalent: clampNumber(target.defaultSkillTalent, 1, 10, 9),
    };
  };

  const initialCharacter = builtCharacters[0];
  const initialTemplate = characterTemplate(initialCharacter);
  const state = {
    characterId: initialCharacter?.id || "",
    styleId: presets[0]?.id || "",
    alias: initialTemplate.alias,
    uid: initialTemplate.uid,
    region: initialTemplate.region,
    tagline: initialTemplate.tagline,
    level: initialTemplate.level,
    potential: initialTemplate.potential,
    breakthrough: initialTemplate.breakthrough,
    affinity: initialTemplate.affinity,
    weaponName: initialTemplate.weaponName,
    weaponLevel: initialTemplate.weaponLevel,
    weaponBreakthrough: initialTemplate.weaponBreakthrough,
    weaponPotential: initialTemplate.weaponPotential,
    weaponSkillLevel: initialTemplate.weaponSkillLevel,
    weaponSkillLevel2: initialTemplate.weaponSkillLevel2,
    weaponSkillLevel3: initialTemplate.weaponSkillLevel3,
    weaponEssence: [...initialTemplate.weaponEssence],
    gearArmor: initialTemplate.gearArmor,
    gearGloves: initialTemplate.gearGloves,
    gearKit1: initialTemplate.gearKit1,
    gearKit2: initialTemplate.gearKit2,
    gearArtifice: {
      armor: [...initialTemplate.gearArtifice.armor],
      gloves: [...initialTemplate.gearArtifice.gloves],
      kit1: [...initialTemplate.gearArtifice.kit1],
      kit2: [...initialTemplate.gearArtifice.kit2],
    },
    skillBasic: initialTemplate.skillBasic,
    skillCombo: initialTemplate.skillCombo,
    skillActive: initialTemplate.skillActive,
    skillUltimate: initialTemplate.skillUltimate,
    skillTalent: initialTemplate.skillTalent,
    showTier: true,
    showRole: true,
  };

  const findCharacter = () => builtCharacters.find((item) => item.id === state.characterId) || builtCharacters[0];
  const findPreset = () => presets.find((item) => item.id === state.styleId) || presets[0];
  const gearOptionsFor = (character, slotKey) =>
    Array.isArray(character?.gearOptions?.[slotKey]) ? character.gearOptions[slotKey] : [];
  const findGearEntry = (character, slotKey, gearName) => {
    const token = normalizeCreatorToken(gearName);
    if (!token) return null;
    return gearOptionsFor(character, slotKey).find((item) => normalizeCreatorToken(item.name) === token) || null;
  };
  const sanitizeGearArtifice = (slotKey, statCount = 3, fallback = [0, 0, 0]) => {
    if (!state.gearArtifice || typeof state.gearArtifice !== "object") {
      state.gearArtifice = { armor: [0, 0, 0], gloves: [0, 0, 0], kit1: [0, 0, 0], kit2: [0, 0, 0] };
    }
    const list = Array.isArray(state.gearArtifice[slotKey]) ? state.gearArtifice[slotKey] : fallback;
    const sanitized = [];
    for (let index = 0; index < Math.max(1, statCount); index += 1) {
      sanitized.push(clampNumber(list[index], 0, 3, 0));
    }
    state.gearArtifice[slotKey] = sanitized;
    return sanitized;
  };
  const activeGearStats = (character, slotKey) => {
    const selectedName = String(state[slotStateKeys[slotKey]] || "-").trim();
    const selected = findGearEntry(character, slotKey, selectedName);
    const stats = Array.isArray(selected?.stats) ? selected.stats : [];
    const normalized = stats
      .slice(0, 3)
      .map((stat, index) => ({
        name: String(stat?.name || `Stat ${index + 1}`).trim() || `Stat ${index + 1}`,
        value: String(stat?.value || "0").trim() || "0",
      }))
      .filter((item) => item.name);
    return normalized.length ? normalized : [{ name: "Stat Utama", value: "0" }];
  };
  const artificeSummaryText = (slotKey, statCount = 3) => {
    const artifice = sanitizeGearArtifice(slotKey, statCount);
    return `Artifice +${artifice.join("/+")}`;
  };
  const creatorSafeImageSrc = (value, fallback = "assets/skill-icons/basic.webp") => {
    const cleaned = String(value || "").trim();
    if (!cleaned) return toImageSrc(fallback, fallback);
    if (/^https?:\/\//i.test(cleaned)) return toImageSrc(fallback, fallback);
    return toImageSrc(cleaned, fallback);
  };
  const syncWeaponIcon = () => {
    const weaponMeta = findWeaponMeta(state.weaponName);
    const icon = creatorSafeImageSrc(weaponMeta?.icon || "", "assets/skill-icons/basic.webp");
    refs.weaponIcon.src = icon;
    refs.weaponIcon.alt = `${state.weaponName} icon`;
    refs.previewWeaponIcon.src = icon;
    refs.previewWeaponIcon.alt = `${state.weaponName} icon`;
  };
  const syncGearSelectors = (character) => {
    ["armor", "gloves", "kit1", "kit2"].forEach((slotKey) => {
      const select = refs[slotRefKeys[slotKey]];
      if (!select) return;
      const options = [...gearOptionsFor(character, slotKey)];
      const selectedName = String(state[slotStateKeys[slotKey]] || "-").trim();
      if (selectedName && !options.some((item) => normalizeCreatorToken(item.name) === normalizeCreatorToken(selectedName))) {
        options.unshift({ name: selectedName, icon: "assets/skill-icons/basic.webp", stats: [{ name: "Stat Utama", value: "0" }] });
      }
      select.innerHTML = options
        .map((item) => {
          const label = `${item.name}${item.usageLevel ? ` [${item.usageLevel}]` : ""}`;
          return `<option value="${esc(item.name)}">${esc(label)}</option>`;
        })
        .join("");
      select.value = selectedName;

      const selected = findGearEntry(character, slotKey, selectedName) || options[0] || null;
      const iconRef = refs[slotIconRefKeys[slotKey]];
      if (iconRef) {
        iconRef.src = creatorSafeImageSrc(selected?.icon || "", "assets/skill-icons/basic.webp");
        iconRef.alt = `${selectedName || slotKey} icon`;
      }
      const previewIconRef = refs[slotPreviewIconRefKeys[slotKey]];
      if (previewIconRef) {
        previewIconRef.src = creatorSafeImageSrc(selected?.icon || "", "assets/skill-icons/basic.webp");
        previewIconRef.alt = `${selectedName || slotKey} icon`;
      }
    });
  };
  const renderArtificeEditor = (character, slotKey) => {
    const stats = activeGearStats(character, slotKey);
    const artifice = sanitizeGearArtifice(slotKey, stats.length);
    const container = refs[slotArtificeRefKeys[slotKey]];
    if (!container) return;
    container.innerHTML = stats
      .map((stat, statIndex) => {
        const tier = artifice[statIndex] || 0;
        return `
          <div class="creator-artifice-row">
            <p class="creator-artifice-row-title">${esc(stat.name)}: <strong>${esc(artificeAdjustedStatText(stat.value, tier))}</strong></p>
            <div class="creator-artifice-buttons">
              ${[0, 1, 2, 3]
                .map(
                  (value) =>
                    `<button type="button" data-artifice-slot="${esc(slotKey)}" data-artifice-stat="${statIndex}" data-artifice-tier="${value}" aria-pressed="${
                      value === tier
                    }">+${value}</button>`
                )
                .join("")}
            </div>
          </div>
        `;
      })
      .join("");
    const previewArtificeRef = refs[slotPreviewArtificeRefKeys[slotKey]];
    if (previewArtificeRef) {
      previewArtificeRef.textContent = artificeSummaryText(slotKey, stats.length);
    }
  };
  const syncWeaponSelect = () => {
    const choices = weaponChoicesForState(state.weaponName);
    refs.weaponSelect.innerHTML = choices.map((item) => `<option value="${esc(item.name)}">${esc(item.name)}</option>`).join("");
    const normalizedName = normalizeWeaponName(state.weaponName, choices[0]?.name || "-");
    state.weaponName = normalizedName;
    refs.weaponSelect.value = normalizedName;
    refs.weaponName.value = normalizedName;
    syncWeaponIcon();
  };
  const populateLevelSelect = (selectRef, maxLevel, defaultLevel = 70) => {
    if (!selectRef) return;
    if (selectRef.dataset.optionsReady === "1") return;
    const options = [];
    for (let level = maxLevel; level >= 1; level -= 1) {
      options.push(`<option value="${level}">Lv. ${level}</option>`);
    }
    selectRef.innerHTML = options.join("");
    selectRef.dataset.optionsReady = "1";
    selectRef.value = String(clampNumber(defaultLevel, 1, maxLevel, maxLevel));
  };
  const setImageWithFallback = (imgEl, candidates, altText) => {
    if (!imgEl) return;
    const queue = [
      ...new Set(
        (Array.isArray(candidates) ? candidates : [candidates])
          .map((item) => toImageSrc(item, ""))
          .filter((item) => item && !/^https?:\/\//i.test(String(item)))
      ),
    ];
    if (!queue.length) {
      imgEl.src = asset("assets/skill-icons/basic.webp");
      imgEl.alt = altText;
      return;
    }
    let index = 0;
    const assign = () => {
      imgEl.src = queue[index];
      imgEl.alt = altText;
    };
    imgEl.onerror = () => {
      index += 1;
      if (index < queue.length) {
        assign();
        return;
      }
      imgEl.onerror = null;
      imgEl.src = asset("assets/skill-icons/basic.webp");
    };
    assign();
  };
  const renderIconSelectors = () => {
    refs.breakthroughSelector.innerHTML = iconSelectorHtml("elite", state.breakthrough, 4, "breakthrough");
    refs.potentialSelector.innerHTML = iconSelectorHtml("potential", state.potential, 5, "potential");
    refs.affinitySelector.innerHTML = iconSelectorHtml("affinity", state.affinity, 4, "affinity");
    refs.weaponBreakthroughSelector.innerHTML = iconSelectorHtml("elite", state.weaponBreakthrough, 4, "weaponBreakthrough");
    refs.weaponPotentialSelector.innerHTML = iconSelectorHtml("potential", state.weaponPotential, 5, "weaponPotential");
  };
  const renderIconStrips = () => {
    refs.previewBreakthroughIcons.innerHTML = iconStripHtml("elite", state.breakthrough, 4);
    refs.previewPotentialIcons.innerHTML = iconStripHtml("potential", state.potential, 5);
    refs.previewAffinityIcons.innerHTML = iconStripHtml("affinity", state.affinity, 4);
    refs.previewWeaponBreakthroughIcons.innerHTML = iconStripHtml("elite", state.weaponBreakthrough, 4);
    refs.previewWeaponPotentialIcons.innerHTML = iconStripHtml("potential", state.weaponPotential, 5);
  };
  const renderEssenceBars = () => {
    const preset = weaponEssencePreset(state.weaponName);
    const labelRefs = [refs.essenceLabel1, refs.essenceLabel2, refs.essenceLabel3];
    const barRefs = [refs.essenceBars1, refs.essenceBars2, refs.essenceBars3];
    const previewLabelRefs = [refs.previewEssenceLabel1, refs.previewEssenceLabel2, refs.previewEssenceLabel3];
    const previewBarRefs = [refs.previewEssenceBars1, refs.previewEssenceBars2, refs.previewEssenceBars3];
    for (let index = 0; index < 3; index += 1) {
      const label = preset.labels[index] || `Essence ${index + 1}`;
      const bounds = resolveWeaponEssenceBounds(index);
      const rawMax = clampNumber(bounds.max, 0, 9, 0);
      const baseCap = rawMax;
      const baseMin = clampNumber(bounds.min, 0, baseCap, 0);
      const fallbackCap = clampNumber(preset.fallbackCaps[index], 0, 9, 9);
      const effectiveCap = Math.min(baseCap, fallbackCap);
      const level = effectiveCap <= 0 ? 0 : clampNumber(state.weaponEssence[index], baseMin, effectiveCap, baseMin);
      state.weaponEssence[index] = level;
      const bonus = Math.max(0, level - baseMin);
      const levelText = bonus > 0 ? `${baseMin}+${bonus}` : `${level}`;
      const text = `${label} Lv. ${levelText}/${baseCap}`;
      if (labelRefs[index]) labelRefs[index].textContent = text;
      if (previewLabelRefs[index]) previewLabelRefs[index].textContent = text;
      const segHtml = [];
      for (let seg = 1; seg <= 9; seg += 1) {
        const isDisabled = effectiveCap <= 0 || seg > effectiveCap;
        const isBase = !isDisabled && seg <= baseMin;
        const isActive = !isDisabled && seg <= level;
        const classes = [
          "creator-essence-seg",
          isActive ? "is-active" : "",
          isBase ? "is-locked is-base" : "",
          isDisabled ? "is-disabled" : "",
        ]
          .filter(Boolean)
          .join(" ");
        segHtml.push(
          `<button type="button" class="${classes}" data-essence-index="${index}" data-essence-level="${seg}" ${
            isBase || isDisabled ? "disabled" : ""
          } aria-label="Essence ${index + 1} level ${seg}"></button>`
        );
      }
      if (barRefs[index]) barRefs[index].innerHTML = segHtml.join("");
      if (previewBarRefs[index]) previewBarRefs[index].innerHTML = segHtml.join("");
    }
  };

  populateLevelSelect(refs.level, 90, state.level);
  populateLevelSelect(refs.weaponLevel, 90, state.weaponLevel);

  const syncFormFromState = () => {
    refs.alias.value = state.alias;
    refs.uid.value = state.uid;
    refs.region.value = normalizeRegion(state.region, "SEA");
    refs.tagline.value = state.tagline;
    refs.level.value = String(state.level);
    refs.potential.value = String(state.potential);
    refs.breakthrough.value = String(state.breakthrough);
    refs.affinity.value = String(state.affinity);
    refs.weaponName.value = state.weaponName;
    refs.weaponLevel.value = String(state.weaponLevel);
    refs.weaponBreakthrough.value = String(state.weaponBreakthrough);
    refs.weaponPotential.value = String(state.weaponPotential);
    refs.weaponSkillLevel.value = String(state.weaponSkillLevel);
    refs.weaponSkillLevel2.value = String(state.weaponSkillLevel2);
    refs.weaponSkillLevel3.value = String(state.weaponSkillLevel3);
    refs.skillBasic.value = String(state.skillBasic);
    refs.skillCombo.value = String(state.skillCombo);
    refs.skillActive.value = String(state.skillActive);
    refs.skillUltimate.value = String(state.skillUltimate);
    refs.skillTalent.value = String(state.skillTalent);
    refs.character.value = state.characterId;
    refs.style.value = state.styleId;
    refs.showTier.checked = state.showTier;
    refs.showRole.checked = state.showRole;
  };

  const snapshotState = () => ({
    characterId: state.characterId,
    styleId: state.styleId,
    alias: cleanText(state.alias, 42, "Operator Showcase"),
    uid: sanitizeUid(state.uid),
    region: normalizeRegion(state.region, "SEA"),
    tagline: cleanText(state.tagline, 120, "High Priority Deployment"),
    level: clampNumber(state.level, 1, 90, 70),
    potential: clampNumber(state.potential, 0, 5, 3),
    breakthrough: clampNumber(state.breakthrough, 0, 4, 2),
    affinity: clampNumber(state.affinity, 0, 4, 2),
    weaponName: normalizeWeaponName(state.weaponName, "-"),
    weaponLevel: clampNumber(state.weaponLevel, 1, 90, 70),
    weaponBreakthrough: clampNumber(state.weaponBreakthrough, 0, 4, 2),
    weaponPotential: clampNumber(state.weaponPotential, 0, 5, 1),
    weaponSkillLevel: clampNumber(state.weaponSkillLevel, 1, 9, 7),
    weaponSkillLevel2: clampNumber(state.weaponSkillLevel2, 1, 9, 7),
    weaponSkillLevel3: clampNumber(state.weaponSkillLevel3, 1, 9, 7),
    weaponEssence: Array.isArray(state.weaponEssence)
      ? state.weaponEssence.slice(0, 3).map((value, index) => clampNumber(value, 0, 9, index === 0 ? 3 : index === 1 ? 2 : 1))
      : [3, 2, 1],
    gearArmor: cleanText(state.gearArmor, 72, "-"),
    gearGloves: cleanText(state.gearGloves, 72, "-"),
    gearKit1: cleanText(state.gearKit1, 72, "-"),
    gearKit2: cleanText(state.gearKit2, 72, "-"),
    gearArtifice: {
      armor: sanitizeGearArtifice("armor"),
      gloves: sanitizeGearArtifice("gloves"),
      kit1: sanitizeGearArtifice("kit1"),
      kit2: sanitizeGearArtifice("kit2"),
    },
    skillBasic: clampNumber(state.skillBasic, 1, 10, 7),
    skillCombo: clampNumber(state.skillCombo, 1, 10, 7),
    skillActive: clampNumber(state.skillActive, 1, 10, 8),
    skillUltimate: clampNumber(state.skillUltimate, 1, 10, 8),
    skillTalent: clampNumber(state.skillTalent, 1, 10, 9),
    showTier: Boolean(state.showTier),
    showRole: Boolean(state.showRole),
  });

  const errorSummary = (error) => {
    if (!error) return "Unknown error";
    const parts = [error.code, error.message, error.details].filter((item) => String(item || "").trim());
    const summary = parts.join(" | ");
    return summary.length > 220 ? `${summary.slice(0, 217)}...` : summary;
  };

  const explainSupabaseError = (error, actionLabel) => {
    const code = String(error?.code || "").toUpperCase();
    const message = String(error?.message || "");
    if (code === "PGRST205" || /Could not find the table/i.test(message)) {
      return `${actionLabel}: table \`${CREATOR_SHARE_TABLE}\` belum ada. Jalankan \`supabase/creator_showcases.sql\` di SQL Editor dulu.`;
    }
    if (code === "42501" || /permission denied|row-level security|not allowed/i.test(message)) {
      return `${actionLabel}: policy RLS belum benar. Pastikan policy \`select\` dan \`insert\` untuk \`anon\`/\`authenticated\` sudah aktif.`;
    }
    return `${actionLabel}: ${errorSummary(error)}`;
  };

  const applyPayloadState = (payload) => {
    const safe = payload && typeof payload === "object" ? payload : {};
    const byId = (list, id) => list.some((item) => item.id === id);
    const nextCharacterId = byId(builtCharacters, String(safe.characterId || "")) ? String(safe.characterId) : builtCharacters[0]?.id || "";
    const nextStyleId = byId(presets, String(safe.styleId || "")) ? String(safe.styleId) : presets[0]?.id || "";
    const character = builtCharacters.find((item) => item.id === nextCharacterId) || builtCharacters[0];
    const template = characterTemplate(character);
    state.characterId = nextCharacterId;
    state.styleId = nextStyleId;
    state.alias = cleanText(safe.alias, 42, template.alias);
    state.uid = sanitizeUid(safe.uid, template.uid);
    state.region = normalizeRegion(safe.region, template.region);
    state.tagline = cleanText(safe.tagline, 120, template.tagline);
    state.level = clampNumber(safe.level, 1, 90, template.level);
    state.potential = clampNumber(safe.potential, 0, 5, template.potential);
    state.breakthrough = clampNumber(safe.breakthrough, 0, 4, template.breakthrough);
    state.affinity = clampNumber(safe.affinity, 0, 4, template.affinity);
    state.weaponName = normalizeWeaponName(safe.weaponName, template.weaponName);
    state.weaponLevel = clampNumber(safe.weaponLevel, 1, 90, template.weaponLevel);
    state.weaponBreakthrough = clampNumber(safe.weaponBreakthrough, 0, 4, template.weaponBreakthrough);
    state.weaponPotential = clampNumber(safe.weaponPotential, 0, 5, template.weaponPotential);
    state.weaponSkillLevel = clampNumber(safe.weaponSkillLevel, 1, 9, template.weaponSkillLevel);
    state.weaponSkillLevel2 = clampNumber(
      safe.weaponSkillLevel2 ?? safe.weaponSkillLevel,
      1,
      9,
      template.weaponSkillLevel2
    );
    state.weaponSkillLevel3 = clampNumber(
      safe.weaponSkillLevel3 ?? safe.weaponSkillLevel,
      1,
      9,
      template.weaponSkillLevel3
    );
    const payloadEssence = Array.isArray(safe.weaponEssence) ? safe.weaponEssence : null;
    state.weaponEssence = payloadEssence
      ? payloadEssence.slice(0, 3).map((value, index) => clampNumber(value, 0, 9, index === 0 ? 3 : index === 1 ? 2 : 1))
      : [...template.weaponEssence];
    state.gearArmor = cleanText(safe.gearArmor, 72, template.gearArmor);
    state.gearGloves = cleanText(safe.gearGloves, 72, template.gearGloves);
    state.gearKit1 = cleanText(safe.gearKit1, 72, template.gearKit1);
    state.gearKit2 = cleanText(safe.gearKit2, 72, template.gearKit2);
    const rawArtifice = safe?.gearArtifice && typeof safe.gearArtifice === "object" ? safe.gearArtifice : {};
    state.gearArtifice = {
      armor: Array.isArray(rawArtifice.armor) ? rawArtifice.armor.slice(0, 3) : [...template.gearArtifice.armor],
      gloves: Array.isArray(rawArtifice.gloves) ? rawArtifice.gloves.slice(0, 3) : [...template.gearArtifice.gloves],
      kit1: Array.isArray(rawArtifice.kit1) ? rawArtifice.kit1.slice(0, 3) : [...template.gearArtifice.kit1],
      kit2: Array.isArray(rawArtifice.kit2) ? rawArtifice.kit2.slice(0, 3) : [...template.gearArtifice.kit2],
    };
    state.skillBasic = clampNumber(safe.skillBasic, 1, 10, template.skillBasic);
    state.skillCombo = clampNumber(safe.skillCombo, 1, 10, template.skillCombo);
    state.skillActive = clampNumber(safe.skillActive, 1, 10, template.skillActive);
    state.skillUltimate = clampNumber(safe.skillUltimate, 1, 10, template.skillUltimate);
    state.skillTalent = clampNumber(safe.skillTalent, 1, 10, template.skillTalent);
    state.showTier = typeof safe.showTier === "boolean" ? safe.showTier : true;
    state.showRole = typeof safe.showRole === "boolean" ? safe.showRole : true;
    if (!state.uid) {
      state.uid = sanitizeUid(creatorProfileId(character, state), template.uid);
    }
    syncFormFromState();
  };

  const loadOnlineShowcase = async (shareId) => {
    const id = readCreatorShareId(shareId);
    if (!id) return false;
    const client = getCreatorSupabaseClient();
    if (!client) {
      refs.status.textContent = "SDK Supabase belum aktif. Cek script supabase-js.";
      return false;
    }
    refs.status.textContent = "Memuat showcase online...";
    try {
      const { data, error } = await client.from(CREATOR_SHARE_TABLE).select("id,payload").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data?.payload) {
        refs.status.textContent = "Showcase tidak ditemukan di database.";
        return false;
      }
      applyPayloadState(data.payload);
      refs.shareLink.value = creatorShareUrl(id);
      applyPreview();
      refs.status.textContent = "Showcase online berhasil dimuat.";
      return true;
    } catch (error) {
      refs.status.textContent = explainSupabaseError(error, "Gagal memuat showcase online");
      console.error(error);
      return false;
    }
  };

  const publishOnlineShowcase = async () => {
    const client = getCreatorSupabaseClient();
    if (!client) {
      refs.status.textContent = "SDK Supabase belum aktif. Cek script supabase-js.";
      return;
    }
    const character = findCharacter();
    const shareId = createCreatorShareId();
    const payload = snapshotState();
    refs.status.textContent = "Menyimpan showcase online...";
    try {
      const { error } = await client.from(CREATOR_SHARE_TABLE).insert({
        id: shareId,
        alias: payload.alias || character?.name || "Endfield Showcase",
        character_id: payload.characterId || "",
        payload,
      });
      if (error) throw error;
      const link = creatorShareUrl(shareId);
      refs.shareLink.value = link;
      try {
        await navigator.clipboard.writeText(link);
        refs.status.textContent = "Showcase online tersimpan. Link sudah disalin.";
      } catch {
        refs.status.textContent = "Showcase online tersimpan. Salin link dari kolom.";
      }
      const url = new URL(window.location.href);
      url.searchParams.set("sid", shareId);
      window.history.replaceState({}, "", url.toString());
    } catch (error) {
      refs.status.textContent = explainSupabaseError(error, "Gagal simpan online");
      console.error(error);
    }
  };

  const applyPreview = () => {
    const character = findCharacter();
    const preset = findPreset();
    if (!character || !preset) return;

    state.weaponName = normalizeWeaponName(state.weaponName, character.defaultWeaponName || "-");
    state.uid = sanitizeUid(state.uid, creatorProfileId(character, state));
    state.region = normalizeRegion(state.region, "SEA");
    state.alias = cleanText(state.alias, 42, `${character.name || "Operator"} Showcase`);
    state.tagline = cleanText(state.tagline, 120, "High Priority Deployment");
    state.gearArmor = cleanText(state.gearArmor, 72, character.defaultGearArmor || "-");
    state.gearGloves = cleanText(state.gearGloves, 72, character.defaultGearGloves || "-");
    state.gearKit1 = cleanText(state.gearKit1, 72, character.defaultGearKit1 || "-");
    state.gearKit2 = cleanText(state.gearKit2, 72, character.defaultGearKit2 || "-");
    state.level = clampNumber(state.level, 1, 90, character.defaultLevel || 70);
    state.potential = clampNumber(state.potential, 0, 5, character.defaultPotential || 3);
    state.breakthrough = clampNumber(state.breakthrough, 0, 4, character.defaultBreakthrough || 2);
    state.affinity = clampNumber(state.affinity, 0, 4, 2);
    state.weaponLevel = clampNumber(state.weaponLevel, 1, 90, character.defaultWeaponLevel || state.level);
    state.weaponBreakthrough = clampNumber(state.weaponBreakthrough, 0, 4, character.defaultWeaponBreakthrough || state.breakthrough);
    state.weaponPotential = clampNumber(state.weaponPotential, 0, 5, character.defaultWeaponPotential || 1);
    state.weaponSkillLevel = clampNumber(state.weaponSkillLevel, 1, 9, character.defaultWeaponSkillLevel || 7);
    state.weaponSkillLevel2 = clampNumber(state.weaponSkillLevel2, 1, 9, character.defaultWeaponSkillLevel || 7);
    state.weaponSkillLevel3 = clampNumber(state.weaponSkillLevel3, 1, 9, character.defaultWeaponSkillLevel || 7);
    if (!Array.isArray(state.weaponEssence)) {
      state.weaponEssence = [3, 2, 1];
    }
    state.weaponEssence = [0, 1, 2].map((index) =>
      clampNumber(state.weaponEssence[index], 0, 9, index === 0 ? 3 : index === 1 ? 2 : 1)
    );
    state.skillBasic = clampNumber(state.skillBasic, 1, 10, character.defaultSkillBasic || 7);
    state.skillCombo = clampNumber(state.skillCombo, 1, 10, character.defaultSkillCombo || 7);
    state.skillActive = clampNumber(state.skillActive, 1, 10, character.defaultSkillActive || 8);
    state.skillUltimate = clampNumber(state.skillUltimate, 1, 10, character.defaultSkillUltimate || 8);
    state.skillTalent = clampNumber(state.skillTalent, 1, 10, character.defaultSkillTalent || 9);

    refs.preview.style.setProperty("--creator-bg-a", preset.bgA || "#23262b");
    refs.preview.style.setProperty("--creator-bg-b", preset.bgB || "#090b0e");
    refs.preview.style.setProperty("--creator-accent", preset.accent || "#fdfd1f");
    refs.preview.style.setProperty("--creator-ink", preset.ink || "#f6f8fb");

    refs.previewAlias.textContent = state.alias;
    refs.previewTier.textContent = state.showTier ? `TIER ${character.tier || "-"}` : "";
    refs.previewTier.hidden = !state.showTier;
    refs.previewStars.textContent = creatorStars(character.rarity);
    setImageWithFallback(
      refs.previewImage,
      Array.isArray(character.imageCandidates) ? character.imageCandidates : [character.image, character.fallbackImage],
      `${character.name} image`
    );
    refs.previewName.textContent = character.name;
    refs.previewRole.textContent = state.showRole ? character.role || "-" : "";
    refs.previewRole.hidden = !state.showRole;
    refs.previewTagline.textContent = state.tagline;
    refs.previewRegion.textContent = state.region;
    refs.previewElement.textContent = `Element: ${character.element || "-"}`;
    refs.previewWeapon.textContent = `Weapon Type: ${character.weapon || "-"}`;
    refs.buildSkills.value = character.buildSkills || "-";
    refs.buildTeam.value = character.buildTeam || "-";
    refs.previewLevel.textContent = `Lv ${state.level}`;
    refs.previewPotential.textContent = `Potential ${state.potential}`;
    refs.previewBreakthrough.textContent = `Breakthrough ${state.breakthrough}`;
    refs.previewAffinity.textContent = `Affinity ${state.affinity}`;
    refs.previewUid.textContent = `UID ${state.uid}`;
    refs.previewWeaponName.textContent = String(state.weaponName || "-").slice(0, 34);
    refs.previewWeaponLevel.textContent = String(state.weaponLevel);
    refs.previewWeaponBreakthrough.textContent = String(state.weaponBreakthrough);
    refs.previewWeaponPotential.textContent = String(state.weaponPotential);
    refs.previewWeaponSkillLevel.textContent = String(state.weaponSkillLevel);
    refs.previewWeaponSkillLevel2.textContent = String(state.weaponSkillLevel2);
    refs.previewWeaponSkillLevel3.textContent = String(state.weaponSkillLevel3);
    refs.previewSkillBasic.textContent = String(state.skillBasic);
    refs.previewSkillCombo.textContent = String(state.skillCombo);
    refs.previewSkillActive.textContent = String(state.skillActive);
    refs.previewSkillUltimate.textContent = String(state.skillUltimate);
    refs.previewSkillTalent.textContent = String(state.skillTalent);
    refs.previewBuildSkills.textContent = String(character.buildSkills || "-").slice(0, 88);
    refs.previewBuildTeam.textContent = String(character.buildTeam || "-").slice(0, 88);
    syncWeaponSelect();
    renderIconSelectors();
    renderIconStrips();
    renderEssenceBars();
    syncGearSelectors(character);
    ["armor", "gloves", "kit1", "kit2"].forEach((slotKey) => {
      const nameRef = refs[slotPreviewNameRefKeys[slotKey]];
      if (nameRef) {
        nameRef.textContent = String(state[slotStateKeys[slotKey]] || "-").slice(0, 28);
      }
      renderArtificeEditor(character, slotKey);
    });
    syncFormFromState();
  };

  const applyCharacterTemplate = (character, preserveAlias = false) => {
    const template = characterTemplate(character);
    if (!preserveAlias) {
      state.alias = template.alias;
    }
    state.uid = template.uid || sanitizeUid(creatorProfileId(character, template));
    state.region = template.region;
    state.tagline = template.tagline;
    state.level = template.level;
    state.potential = template.potential;
    state.breakthrough = template.breakthrough;
    state.affinity = template.affinity;
    state.weaponName = template.weaponName;
    state.weaponLevel = template.weaponLevel;
    state.weaponBreakthrough = template.weaponBreakthrough;
    state.weaponPotential = template.weaponPotential;
    state.weaponSkillLevel = template.weaponSkillLevel;
    state.weaponSkillLevel2 = template.weaponSkillLevel2;
    state.weaponSkillLevel3 = template.weaponSkillLevel3;
    state.weaponEssence = [...template.weaponEssence];
    state.gearArmor = template.gearArmor;
    state.gearGloves = template.gearGloves;
    state.gearKit1 = template.gearKit1;
    state.gearKit2 = template.gearKit2;
    state.gearArtifice = {
      armor: [...template.gearArtifice.armor],
      gloves: [...template.gearArtifice.gloves],
      kit1: [...template.gearArtifice.kit1],
      kit2: [...template.gearArtifice.kit2],
    };
    state.skillBasic = template.skillBasic;
    state.skillCombo = template.skillCombo;
    state.skillActive = template.skillActive;
    state.skillUltimate = template.skillUltimate;
    state.skillTalent = template.skillTalent;
  };

  const randomize = () => {
    const randomCharacter = randomPick(builtCharacters);
    const randomPreset = randomPick(presets);
    const randomTagline = randomPick(taglines);
    if (randomCharacter) state.characterId = randomCharacter.id;
    if (randomPreset) state.styleId = randomPreset.id;
    applyCharacterTemplate(findCharacter());
    if (randomTagline) state.tagline = randomTagline;
    state.level = clampNumber(Math.floor(Math.random() * 41) + 50, 1, 90, 70);
    state.potential = clampNumber(Math.floor(Math.random() * 6), 0, 5, 3);
    state.breakthrough = clampNumber(Math.floor(Math.random() * 5), 0, 4, 2);
    state.affinity = clampNumber(Math.floor(Math.random() * 5), 0, 4, 2);
    state.weaponLevel = clampNumber(state.level - Math.floor(Math.random() * 8), 1, 90, state.level);
    state.weaponBreakthrough = clampNumber(state.breakthrough, 0, 4, 2);
    state.weaponPotential = clampNumber(Math.max(0, state.potential - 1), 0, 5, 1);
    state.weaponSkillLevel = clampNumber(Math.floor(Math.random() * 4) + 6, 1, 9, 7);
    state.weaponSkillLevel2 = clampNumber(Math.floor(Math.random() * 4) + 6, 1, 9, 7);
    state.weaponSkillLevel3 = clampNumber(Math.floor(Math.random() * 4) + 6, 1, 9, 7);
    state.weaponEssence = [
      clampNumber(Math.floor(Math.random() * 7) + 1, 1, 9, 3),
      clampNumber(Math.floor(Math.random() * 6) + 1, 1, 9, 2),
      clampNumber(Math.floor(Math.random() * 4) + 1, 1, 9, 1),
    ];
    state.skillBasic = clampNumber(Math.floor(Math.random() * 4) + 6, 1, 10, 7);
    state.skillCombo = clampNumber(Math.floor(Math.random() * 4) + 6, 1, 10, 7);
    state.skillActive = clampNumber(Math.floor(Math.random() * 3) + 7, 1, 10, 8);
    state.skillUltimate = clampNumber(Math.floor(Math.random() * 3) + 7, 1, 10, 8);
    state.skillTalent = clampNumber(Math.floor(Math.random() * 3) + 8, 1, 10, 9);
    state.uid = sanitizeUid(creatorProfileId(findCharacter(), state), state.uid);
    applyPreview();
    refs.status.textContent = "Preset diacak. Siap di-export.";
  };

  refs.character.addEventListener("change", () => {
    state.characterId = refs.character.value;
    applyCharacterTemplate(findCharacter());
    applyPreview();
  });
  refs.style.addEventListener("change", () => {
    state.styleId = refs.style.value;
    applyPreview();
  });
  refs.alias.addEventListener("input", () => {
    state.alias = cleanText(refs.alias.value, 42, `${findCharacter()?.name || "Operator"} Showcase`);
    refs.alias.value = state.alias;
    applyPreview();
  });
  refs.uid.addEventListener("input", () => {
    state.uid = sanitizeUid(refs.uid.value, sanitizeUid(creatorProfileId(findCharacter(), state)));
    refs.uid.value = state.uid;
    applyPreview();
  });
  refs.region.addEventListener("change", () => {
    state.region = normalizeRegion(refs.region.value, "SEA");
    applyPreview();
  });
  refs.tagline.addEventListener("input", () => {
    state.tagline = cleanText(refs.tagline.value, 120, "High Priority Deployment");
    refs.tagline.value = state.tagline;
    applyPreview();
  });
  const onLevelChange = () => {
    state.level = clampNumber(refs.level.value, 1, 90, findCharacter()?.defaultLevel || 70);
    refs.level.value = String(state.level);
    if (state.weaponLevel > state.level) {
      state.weaponLevel = state.level;
      refs.weaponLevel.value = String(state.weaponLevel);
    }
    applyPreview();
  };
  refs.level.addEventListener("input", onLevelChange);
  refs.level.addEventListener("change", onLevelChange);
  refs.potential.addEventListener("input", () => {
    state.potential = clampNumber(refs.potential.value, 0, 5, findCharacter()?.defaultPotential || 3);
    refs.potential.value = String(state.potential);
    applyPreview();
  });
  refs.breakthrough.addEventListener("input", () => {
    state.breakthrough = clampNumber(refs.breakthrough.value, 0, 4, findCharacter()?.defaultBreakthrough || 2);
    refs.breakthrough.value = String(state.breakthrough);
    applyPreview();
  });
  refs.affinity.addEventListener("input", () => {
    state.affinity = clampNumber(refs.affinity.value, 0, 4, 2);
    refs.affinity.value = String(state.affinity);
    applyPreview();
  });
  refs.weaponSelect.addEventListener("change", () => {
    state.weaponName = normalizeWeaponName(refs.weaponSelect.value, findCharacter()?.defaultWeaponName || "-");
    applyPreview();
  });
  refs.weaponName.addEventListener("input", () => {
    state.weaponName = normalizeWeaponName(refs.weaponName.value, findCharacter()?.defaultWeaponName || "-");
    refs.weaponName.value = state.weaponName;
    applyPreview();
  });
  const onWeaponLevelChange = () => {
    state.weaponLevel = clampNumber(refs.weaponLevel.value, 1, 90, state.level);
    refs.weaponLevel.value = String(state.weaponLevel);
    applyPreview();
  };
  refs.weaponLevel.addEventListener("input", onWeaponLevelChange);
  refs.weaponLevel.addEventListener("change", onWeaponLevelChange);
  refs.weaponBreakthrough.addEventListener("input", () => {
    state.weaponBreakthrough = clampNumber(refs.weaponBreakthrough.value, 0, 4, findCharacter()?.defaultWeaponBreakthrough || 2);
    refs.weaponBreakthrough.value = String(state.weaponBreakthrough);
    applyPreview();
  });
  refs.weaponPotential.addEventListener("input", () => {
    state.weaponPotential = clampNumber(refs.weaponPotential.value, 0, 5, findCharacter()?.defaultWeaponPotential || 1);
    refs.weaponPotential.value = String(state.weaponPotential);
    applyPreview();
  });
  refs.weaponSkillLevel.addEventListener("input", () => {
    state.weaponSkillLevel = clampNumber(refs.weaponSkillLevel.value, 1, 9, findCharacter()?.defaultWeaponSkillLevel || 7);
    refs.weaponSkillLevel.value = String(state.weaponSkillLevel);
    applyPreview();
  });
  refs.weaponSkillLevel2.addEventListener("input", () => {
    state.weaponSkillLevel2 = clampNumber(refs.weaponSkillLevel2.value, 1, 9, findCharacter()?.defaultWeaponSkillLevel || 7);
    refs.weaponSkillLevel2.value = String(state.weaponSkillLevel2);
    applyPreview();
  });
  refs.weaponSkillLevel3.addEventListener("input", () => {
    state.weaponSkillLevel3 = clampNumber(refs.weaponSkillLevel3.value, 1, 9, findCharacter()?.defaultWeaponSkillLevel || 7);
    refs.weaponSkillLevel3.value = String(state.weaponSkillLevel3);
    applyPreview();
  });
  refs.gearArmor.addEventListener("change", () => {
    state.gearArmor = cleanText(refs.gearArmor.value, 72, findCharacter()?.defaultGearArmor || "-");
    refs.gearArmor.value = state.gearArmor;
    state.gearArtifice.armor = [0, 0, 0];
    applyPreview();
  });
  refs.gearGloves.addEventListener("change", () => {
    state.gearGloves = cleanText(refs.gearGloves.value, 72, findCharacter()?.defaultGearGloves || "-");
    refs.gearGloves.value = state.gearGloves;
    state.gearArtifice.gloves = [0, 0, 0];
    applyPreview();
  });
  refs.gearKit1.addEventListener("change", () => {
    state.gearKit1 = cleanText(refs.gearKit1.value, 72, findCharacter()?.defaultGearKit1 || "-");
    refs.gearKit1.value = state.gearKit1;
    state.gearArtifice.kit1 = [0, 0, 0];
    applyPreview();
  });
  refs.gearKit2.addEventListener("change", () => {
    state.gearKit2 = cleanText(refs.gearKit2.value, 72, findCharacter()?.defaultGearKit2 || "-");
    refs.gearKit2.value = state.gearKit2;
    state.gearArtifice.kit2 = [0, 0, 0];
    applyPreview();
  });
  refs.skillBasic.addEventListener("input", () => {
    state.skillBasic = clampNumber(refs.skillBasic.value, 1, 10, findCharacter()?.defaultSkillBasic || 7);
    refs.skillBasic.value = String(state.skillBasic);
    applyPreview();
  });
  refs.skillCombo.addEventListener("input", () => {
    state.skillCombo = clampNumber(refs.skillCombo.value, 1, 10, findCharacter()?.defaultSkillCombo || 7);
    refs.skillCombo.value = String(state.skillCombo);
    applyPreview();
  });
  refs.skillActive.addEventListener("input", () => {
    state.skillActive = clampNumber(refs.skillActive.value, 1, 10, findCharacter()?.defaultSkillActive || 8);
    refs.skillActive.value = String(state.skillActive);
    applyPreview();
  });
  refs.skillUltimate.addEventListener("input", () => {
    state.skillUltimate = clampNumber(refs.skillUltimate.value, 1, 10, findCharacter()?.defaultSkillUltimate || 8);
    refs.skillUltimate.value = String(state.skillUltimate);
    applyPreview();
  });
  refs.skillTalent.addEventListener("input", () => {
    state.skillTalent = clampNumber(refs.skillTalent.value, 1, 10, findCharacter()?.defaultSkillTalent || 9);
    refs.skillTalent.value = String(state.skillTalent);
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
  refs.controls.addEventListener("click", (event) => {
    const iconButton = event.target.closest("[data-icon-target][data-icon-value]");
    if (iconButton) {
      const target = String(iconButton.dataset.iconTarget || "");
      const value = clampNumber(iconButton.dataset.iconValue, 0, 9, 0);
      if (target === "breakthrough") {
        state.breakthrough = clampNumber(value, 0, 4, state.breakthrough);
        refs.breakthrough.value = String(state.breakthrough);
      } else if (target === "potential") {
        state.potential = clampNumber(value, 0, 5, state.potential);
        refs.potential.value = String(state.potential);
      } else if (target === "affinity") {
        state.affinity = clampNumber(value, 0, 4, state.affinity);
        refs.affinity.value = String(state.affinity);
      } else if (target === "weaponBreakthrough") {
        state.weaponBreakthrough = clampNumber(value, 0, 4, state.weaponBreakthrough);
        refs.weaponBreakthrough.value = String(state.weaponBreakthrough);
      } else if (target === "weaponPotential") {
        state.weaponPotential = clampNumber(value, 0, 5, state.weaponPotential);
        refs.weaponPotential.value = String(state.weaponPotential);
      }
      applyPreview();
      return;
    }
    const essenceButton = event.target.closest("[data-essence-index][data-essence-level]");
    if (essenceButton) {
      const index = clampNumber(essenceButton.dataset.essenceIndex, 0, 2, 0);
      const bounds = resolveWeaponEssenceBounds(index);
      const minLevel = clampNumber(bounds.min, 0, 9, 0);
      const maxLevel = clampNumber(bounds.max, 0, 9, 0);
      if (maxLevel <= 0) return;
      const level = clampNumber(essenceButton.dataset.essenceLevel, minLevel, maxLevel, minLevel);
      if (!Array.isArray(state.weaponEssence)) state.weaponEssence = [3, 2, 1];
      state.weaponEssence[index] = level;
      applyPreview();
      return;
    }
    const button = event.target.closest("[data-artifice-slot][data-artifice-stat][data-artifice-tier]");
    if (!button) return;
    const slotKey = String(button.dataset.artificeSlot || "");
    if (!slotStateKeys[slotKey]) return;
    const statIndex = clampNumber(button.dataset.artificeStat, 0, 2, 0);
    const tier = clampNumber(button.dataset.artificeTier, 0, 3, 0);
    const character = findCharacter();
    const stats = activeGearStats(character, slotKey);
    sanitizeGearArtifice(slotKey, stats.length);
    state.gearArtifice[slotKey][statIndex] = tier;
    applyPreview();
  });
  refs.random.addEventListener("click", randomize);
  refs.publish.addEventListener("click", async () => {
    await publishOnlineShowcase();
  });
  refs.copyLink.addEventListener("click", async () => {
    const link = String(refs.shareLink.value || "").trim();
    if (!link) {
      refs.status.textContent = "Belum ada link. Gunakan tombol Save Link dulu.";
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      refs.status.textContent = "Link showcase berhasil disalin.";
    } catch {
      refs.status.textContent = "Gagal salin link. Salin manual dari kolom.";
    }
  });
  refs.share.addEventListener("click", async () => {
    const character = findCharacter();
    const preset = findPreset();
    if (!character || !preset) return;
    refs.status.textContent = "Menyiapkan card untuk dibagikan...";
    try {
      await shareCreatorCardPng(character, preset, state, refs.status, refs.preview);
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
      await exportCreatorCardPng(character, preset, state, refs.status, refs.preview);
      refs.status.textContent = "Selesai. PNG berhasil di-download.";
    } catch (error) {
      refs.status.textContent = "Gagal export PNG. Coba lagi.";
      console.error(error);
    }
  });

  syncFormFromState();
  refs.shareLink.value = "";
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
    refs.share.textContent = "Share (Fallback)";
  }

  applyDynamicMeta({
    title: "Showcase Build Creator Endfield Indonesia | Endfield Web",
    description:
      "Buat showcase build operator Endfield lengkap: UID, region, level, weapon, gear artifice, skill, talent, simpan link online, lalu export PNG.",
    canonicalUrl: toAbsoluteSiteUrl("/card-creator/"),
    imageUrl: toAbsoluteSiteUrl("/assets/images/hero-share.jpg"),
    keywords: [
      "endfield showcase build",
      "showcase build creator",
      "endfield character showcase",
      "endfield build simulator",
      "endfield indonesia",
    ],
  });

  const initialShareId = readCreatorShareId();
  if (initialShareId) {
    const loaded = await loadOnlineShowcase(initialShareId);
    if (!loaded) applyPreview();
  } else {
    applyPreview();
  }
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

async function fetchShowcaseCatalog() {
  const response = await fetch(withRoot("data/showcase-catalog.json"));
  if (!response.ok) throw new Error("Gagal memuat data showcase catalog JSON");
  return response.json();
}

const bootLoader = initPageLoader();

async function bootstrap() {
  const loaderMessageByPage = {
    home: "Menyiapkan dashboard Endfield...",
    events: "Sinkronisasi timeline event...",
    codes: "Memuat tracker redeem code...",
    "card-creator": "Menyiapkan build showcase...",
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
