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

const BGM_KEY = "endfield_web_bgm_v1";
const BGM_SOURCES = [
  "https://154976-decisions.mp3.pm/song/245238323-arknights-endfield-lofi/",
  "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/60/46/09/6046093f-66c3-712a-cefd-959384fd3d3c/mzaf_12371733613275990005.plus.aac.ep.m4a",
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

function toDateLabel(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
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
  const panel = document.createElement("aside");
  panel.className = "bgm-player";
  panel.innerHTML = `
    <p class="bgm-kicker">MUSIK LATAR</p>
    <p class="bgm-title">Endfield Lofi</p>
    <div class="bgm-row">
      <button class="bgm-btn" id="bgm-play" type="button">Putar</button>
      <button class="bgm-btn" id="bgm-mute" type="button">Mute</button>
    </div>
    <p class="bgm-time" id="bgm-time">00:00 / 00:00</p>
    <p class="bgm-status" id="bgm-status">Memuat musik...</p>
    <a class="bgm-source" id="bgm-source" href="${esc(BGM_SOURCES[0])}" target="_blank" rel="noreferrer noopener">Sumber lagu</a>
  `;
  document.body.appendChild(panel);

  const btnPlay = panel.querySelector("#bgm-play");
  const btnMute = panel.querySelector("#bgm-mute");
  const labelTime = panel.querySelector("#bgm-time");
  const labelStatus = panel.querySelector("#bgm-status");
  const labelSource = panel.querySelector("#bgm-source");
  if (!btnPlay || !btnMute || !labelTime || !labelStatus || !labelSource) return;

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
    btnPlay.textContent = audio.paused ? "Putar" : "Jeda";
    btnMute.textContent = audio.muted ? "Unmute" : "Mute";
    labelTime.textContent = `${toClock(audio.currentTime)} / ${toClock(audio.duration || 0)}`;
    if (msg) labelStatus.textContent = msg;
    else if (audio.paused) labelStatus.textContent = "Musik siap diputar.";
    else if (audio.muted) labelStatus.textContent = "Musik aktif (mute).";
    else labelStatus.textContent = "Musik aktif.";
    labelSource.href = BGM_SOURCES[sourceIndex] || "#";
  };

  const safePlay = async () => {
    try {
      await audio.play();
      wantsPlay = true;
      refresh();
      persist();
    } catch {
      wantsPlay = true;
      refresh("Autoplay diblokir browser. Klik Putar.");
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
      refresh("Sumber utama gagal. Pakai sumber cadangan.");
      if (wantsPlay) void safePlay();
      else persist();
      return;
    }
    refresh("Musik belum tersedia. Ganti URL di script.js.");
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
    refresh("Musik dijeda.");
    persist();
  });

  btnMute.addEventListener("click", () => {
    audio.muted = !audio.muted;
    if (!audio.muted && wantsPlay && audio.paused) {
      void safePlay();
      return;
    }
    refresh(audio.muted ? "Mode mute aktif." : undefined);
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
  refresh("Memuat musik...");
  if (wantsPlay) void safePlay();
  else {
    persist();
    refresh("Musik siap. Klik Putar.");
  }
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

function buildGearDatabase(characters) {
  const map = new Map();
  const usedIds = new Set();

  function upsertGear(character, gear, slotKey, fallbackLevel) {
    if (!gear || !gear.name) return;

    const key = String(gear.source || gear.name).toLowerCase().trim();
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
    }

    entry.owners.set(character.id, {
      id: character.id,
      name: character.name,
      image: character.image,
      role: character.role,
      tier: character.tier,
      tags: roleTagsForCharacter(character),
    });

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

function initGearsPage(characters) {
  const refs = {
    search: document.getElementById("gear-search"),
    type: document.getElementById("gear-type-filter"),
    level: document.getElementById("gear-level-filter"),
    set: document.getElementById("gear-set-filter"),
    sort: document.getElementById("gear-sort"),
    count: document.getElementById("gear-count"),
    grid: document.getElementById("gear-db-grid"),
  };

  if (!refs.search || !refs.type || !refs.level || !refs.set || !refs.sort || !refs.count || !refs.grid) {
    return;
  }

  const gearItems = buildGearDatabase(characters);

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
    const sortMode = refs.sort.value;

    const filtered = sortList(
      gearItems.filter((item) => {
        const byType = type === "ALL" || item.types.includes(type);
        const byLevel = level === "ALL" || item.usageLevels.includes(level);
        const bySet = setName === "ALL" || item.effectName === setName;
        const blob =
          `${item.name} ${item.effectName} ${item.effectDescription} ${item.description} ${item.types.join(" ")} ${item.usageLevels.join(" ")} ${item.slots.join(" ")} ${item.bestFor.join(" ")} ${item.owners.map((owner) => owner.name).join(" ")}`.toLowerCase();
        const bySearch = !search || blob.includes(search);
        return byType && byLevel && bySet && bySearch;
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
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function initGearDetailPage(characters) {
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

  const gearItems = buildGearDatabase(characters);
  const item = gearItems.find((gear) => gear.id === id);

  if (!item) {
    status.textContent = "Gear tidak ditemukan.";
    target.innerHTML = emptyState("ID gear tidak valid. Pilih ulang dari halaman Gear Database.");
    return;
  }

  status.textContent = "Detail gear berhasil dimuat.";
  document.title = `${item.name} | Gear Detail | Endfield Web`;

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
  document.title = `${character.name} | Endfield Web`;

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
  initGlobalBgm();
  const data = await fetchData();

  if (page === "home") return renderHome(data);
  if (page === "helps") return initTipsPage(data.tips);
  if (page === "tierlist") return initTierPage(data.characters);
  if (page === "builds") return initBuildPage(data.characters);
  if (page === "gears") return initGearsPage(data.characters);
  if (page === "gear") return initGearDetailPage(data.characters);
  if (page === "characters") return initCharactersPage(data.characters);
  if (page === "character") return initCharacterPage(data.characters);
}

bootstrap().catch((error) => {
  console.error(error);
  const stamp = document.getElementById("data-stamp") || document.getElementById("profile-status");
  if (stamp) stamp.textContent = "Data gagal dimuat";
});
