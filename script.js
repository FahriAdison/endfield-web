const tierClassMap = {
  S: "tier-s",
  A: "tier-a",
  B: "tier-b",
};

const tierOrder = ["S", "A", "B"];
const collator = new Intl.Collator("id", { sensitivity: "base" });

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

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toTitleDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function emptyState(message) {
  return `<article class="card empty-state"><p>${esc(message)}</p></article>`;
}

function sortByName(items, key, mode = "AZ") {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const left = a[key] || "";
    const right = b[key] || "";
    const cmp = collator.compare(left, right);
    return mode === "ZA" ? -cmp : cmp;
  });
  return sorted;
}

function sortCharacters(items, mode = "TIER") {
  const sorted = [...items];
  sorted.sort((a, b) => {
    if (mode === "AZ") return collator.compare(a.name, b.name);
    if (mode === "ZA") return collator.compare(b.name, a.name);

    const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
    if (tierDiff !== 0) return tierDiff;
    return collator.compare(a.name, b.name);
  });
  return sorted;
}

function buildTierChips(characters) {
  if (!characters.length) return '<span class="tier-empty">-</span>';

  return characters
    .map(
      (character) => `
      <a class="tier-chip" href="${characterUrl(character.id)}" title="Buka profil ${esc(character.name)}">
        <img src="${asset(character.image)}" alt="${esc(character.name)} icon" loading="lazy" />
        ${esc(character.name)}
      </a>
    `
    )
    .join("");
}

function renderHome(data) {
  const stamp = document.getElementById("data-stamp");
  if (stamp) {
    stamp.textContent = `Data disusun: ${toTitleDate(data.meta.updatedAt)}`;
  }

  const metaGrid = document.getElementById("home-meta-grid");
  if (metaGrid) {
    const picks = sortCharacters(
      data.characters.filter((character) => character.isMeta),
      "TIER"
    ).slice(0, 6);

    metaGrid.innerHTML =
      picks.length === 0
        ? emptyState("Belum ada data meta pick.")
        : picks
            .map(
              (character) => `
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
              <p>${esc(character.summary)}</p>
            </a>
          </article>
        `
            )
            .join("");
  }

  const tipsGrid = document.getElementById("home-tips-grid");
  if (tipsGrid) {
    const preview = sortByName(data.tips, "title", "AZ").slice(0, 4);
    tipsGrid.innerHTML =
      preview.length === 0
        ? emptyState("Belum ada tips.")
        : preview
            .map(
              (tip) => `
            <article class="card">
              <span class="tip-category">${esc(tip.category)}</span>
              <h3>${esc(tip.title)}</h3>
              <p>${esc(tip.description)}</p>
            </article>
          `
            )
            .join("");
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

  const categories = ["ALL", ...new Set(tips.map((tip) => tip.category))];
  refs.category.innerHTML = categories
    .map((category) => {
      const label = category === "ALL" ? "Semua Kategori" : category;
      return `<option value="${esc(category)}">${esc(label)}</option>`;
    })
    .join("");

  function redraw() {
    const search = refs.search.value.trim().toLowerCase();
    const category = refs.category.value;
    const sortMode = refs.sort.value;

    const filtered = sortByName(
      tips.filter((tip) => {
        const byCategory = category === "ALL" || tip.category === category;
        const blob = `${tip.title} ${tip.description} ${tip.tags.join(" ")}`.toLowerCase();
        const bySearch = !search || blob.includes(search);
        return byCategory && bySearch;
      }),
      "title",
      sortMode
    );

    refs.grid.innerHTML =
      filtered.length === 0
        ? emptyState("Tips tidak ditemukan. Coba kata kunci lain.")
        : filtered
            .map(
              (tip) => `
            <article class="card">
              <span class="tip-category">${esc(tip.category)}</span>
              <h3>${esc(tip.title)}</h3>
              <p>${esc(tip.description)}</p>
            </article>
          `
            )
            .join("");
  }

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

  if (
    !refs.search ||
    !refs.tier ||
    !refs.role ||
    !refs.sort ||
    !refs.count ||
    !refs.metaGrid ||
    !refs.table
  ) {
    return;
  }

  const roles = ["ALL", ...new Set(characters.map((character) => character.role))];
  refs.role.innerHTML = roles
    .map((role) => {
      const label = role === "ALL" ? "Semua Role" : role;
      return `<option value="${esc(role)}">${esc(label)}</option>`;
    })
    .join("");

  function redraw() {
    const search = refs.search.value.trim().toLowerCase();
    const tier = refs.tier.value;
    const role = refs.role.value;
    const sortMode = refs.sort.value;

    const filtered = sortCharacters(
      characters.filter((character) => {
        const byTier = tier === "ALL" || character.tier === tier;
        const byRole = role === "ALL" || character.role === role;
        const blob = `${character.name} ${character.role} ${character.summary} ${character.tags.join(" ")}`.toLowerCase();
        const bySearch = !search || blob.includes(search);
        return byTier && byRole && bySearch;
      }),
      sortMode
    );

    refs.count.textContent = `${filtered.length} karakter cocok`;

    refs.metaGrid.innerHTML =
      filtered.length === 0
        ? emptyState("Karakter tidak ditemukan pada filter saat ini.")
        : filtered
            .map(
              (character) => `
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
              <p>${esc(character.summary)}</p>
              <span class="detail-link">Lihat detail karakter</span>
            </a>
          </article>
        `
            )
            .join("");

    refs.table.innerHTML = tierOrder
      .map((tierKey) => {
        const tierChars = filtered.filter((character) => character.tier === tierKey);
        const note =
          tierKey === "S"
            ? "Prioritas utama untuk konten sulit dan progression cepat."
            : tierKey === "A"
              ? "Kuat dan stabil, terutama jika komposisi tim sudah rapi."
              : "Masih layak dipakai sebagai transisi atau role khusus.";

        return `
        <tr>
          <td><span class="meta-tier ${tierClassMap[tierKey]}">${esc(tierKey)}</span></td>
          <td><div class="tier-char-list">${buildTierChips(tierChars)}</div></td>
          <td>${esc(note)}</td>
        </tr>
      `;
      })
      .join("");
  }

  refs.search.addEventListener("input", redraw);
  refs.tier.addEventListener("change", redraw);
  refs.role.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function initBuildPage(characters) {
  const refs = {
    search: document.getElementById("build-search"),
    tier: document.getElementById("build-tier-filter"),
    sort: document.getElementById("build-sort"),
    grid: document.getElementById("build-grid"),
  };

  if (!refs.search || !refs.tier || !refs.sort || !refs.grid) return;

  function redraw() {
    const search = refs.search.value.trim().toLowerCase();
    const tier = refs.tier.value;
    const sortMode = refs.sort.value;

    const filtered = sortCharacters(
      characters
        .filter((character) => character.build)
        .filter((character) => {
          const byTier = tier === "ALL" || character.tier === tier;
          const blob = `${character.name} ${character.role} ${character.build.weapon} ${character.build.team}`.toLowerCase();
          const bySearch = !search || blob.includes(search);
          return byTier && bySearch;
        }),
      sortMode
    );

    refs.grid.innerHTML =
      filtered.length === 0
        ? emptyState("Build tidak ditemukan. Ubah filter atau kata kunci.")
        : filtered
            .map(
              (character) => `
          <article class="card build-card">
            <div class="build-head">
              <img class="build-avatar" src="${asset(character.image)}" alt="${esc(character.name)} icon" loading="lazy" />
              <div>
                <span class="meta-tier ${tierClassMap[character.tier]}">Tier ${esc(character.tier)}</span>
                <h3>${esc(character.name)}</h3>
                <p><strong>Role:</strong> ${esc(character.role)}</p>
              </div>
            </div>
            <ul class="build-list">
              <li><strong>Weapon:</strong> ${esc(character.build.weapon)}</li>
              <li><strong>Skill Priority:</strong> ${esc(character.build.skills)}</li>
              <li><strong>Tim Rekomendasi:</strong> ${esc(character.build.team)}</li>
              <li><strong>Catatan:</strong> ${esc(character.build.notes)}</li>
            </ul>
            <a class="detail-link inline-link" href="${characterUrl(character.id)}">Lihat profil karakter</a>
          </article>
        `
            )
            .join("");
  }

  refs.search.addEventListener("input", redraw);
  refs.tier.addEventListener("change", redraw);
  refs.sort.addEventListener("change", redraw);
  redraw();
}

function renderCharacterDetail(character) {
  const status = document.getElementById("profile-status");
  const target = document.getElementById("character-detail");
  if (!status || !target) return;

  const profile = character.profile || {};
  const intro = profile.intro || [];
  const story = profile.storyHighlights || [];
  const skills = profile.skills || [];

  const introHtml =
    intro.length === 0
      ? "<p>Profil naratif untuk karakter ini belum lengkap.</p>"
      : intro.map((line) => `<p>${esc(line)}</p>`).join("");

  const storyHtml =
    story.length === 0
      ? "<li>Belum ada highlight kisah tambahan.</li>"
      : story.map((line) => `<li>${esc(line)}</li>`).join("");

  const skillHtml =
    skills.length === 0
      ? emptyState("Data skill belum tersedia untuk karakter ini.")
      : skills
          .map(
            (skill) => `
        <article class="card skill-card">
          <div class="skill-head">
            <img class="skill-icon" src="${asset(skill.icon)}" alt="${esc(skill.name)} icon" loading="lazy" />
            <div>
              <p class="skill-type">${esc(skill.type)}</p>
              <h3>${esc(skill.name)}</h3>
            </div>
          </div>
          <p>${esc(skill.description)}</p>
          <p><strong>Cara pakai:</strong> ${esc(skill.usage || "Lihat rotasi tim dan cooldown saat combat.")}</p>
        </article>
      `
          )
          .join("");

  status.textContent = `Profil dimuat dari data update ${toTitleDate(profile.updatedAt)}`;
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
      <article class="card">
        <h2>Profil</h2>
        ${introHtml}
      </article>
      <article class="card">
        <h2>Kisah Singkat</h2>
        <ul class="story-list">
          ${storyHtml}
        </ul>
      </article>
    </div>

    <article class="section-block">
      <h2>Skill, Fungsi, dan Cara Pakai</h2>
      <div class="grid skill-grid">
        ${skillHtml}
      </div>
    </article>

    <article class="card">
      <h2>Build Rekomendasi</h2>
      <ul class="build-list">
        <li><strong>Weapon:</strong> ${esc(character.build?.weapon || "-")}</li>
        <li><strong>Skill Priority:</strong> ${esc(character.build?.skills || "-")}</li>
        <li><strong>Tim Rekomendasi:</strong> ${esc(character.build?.team || "-")}</li>
        <li><strong>Catatan:</strong> ${esc(character.build?.notes || "-")}</li>
      </ul>
      <p class="stamp">
        Sumber profil:
        <a href="${esc(profile.source || "#")}" target="_blank" rel="noreferrer noopener">${esc(profile.source || "tidak tersedia")}</a>
      </p>
    </article>
  `;
}

function initCharacterPage(characters) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const status = document.getElementById("profile-status");
  const target = document.getElementById("character-detail");

  if (!status || !target) return;

  if (!id) {
    status.textContent = "Karakter belum dipilih.";
    target.innerHTML = emptyState("Buka detail dari halaman tierlist atau builds.");
    return;
  }

  const character = characters.find((item) => item.id === id);
  if (!character) {
    status.textContent = "Karakter tidak ditemukan.";
    target.innerHTML = emptyState("ID karakter tidak valid. Coba buka dari daftar tierlist.");
    return;
  }

  renderCharacterDetail(character);
}

async function fetchData() {
  const response = await fetch(withRoot("data/content.json"));
  if (!response.ok) {
    throw new Error("Gagal memuat data JSON");
  }
  return response.json();
}

async function bootstrap() {
  const data = await fetchData();

  if (page === "home") {
    renderHome(data);
    return;
  }

  if (page === "helps") {
    initTipsPage(data.tips);
    return;
  }

  if (page === "tierlist") {
    initTierPage(data.characters);
    return;
  }

  if (page === "builds") {
    initBuildPage(data.characters);
    return;
  }

  if (page === "character") {
    initCharacterPage(data.characters);
  }
}

bootstrap().catch((error) => {
  console.error(error);
  const stamp = document.getElementById("data-stamp") || document.getElementById("profile-status");
  if (stamp) {
    stamp.textContent = "Data gagal dimuat";
  }
});
