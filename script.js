const tierClassMap = {
  S: "tier-s",
  A: "tier-a",
  B: "tier-b",
};

const tierOrder = ["S", "A", "B"];

function toTitleDate(isoDate) {
  const date = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function emptyState(message) {
  return `<article class="card empty-state"><p>${message}</p></article>`;
}

function buildTierChips(characters) {
  if (!characters.length) return '<span class="tier-empty">-</span>';

  return characters
    .map(
      (character) => `
      <span class="tier-chip" title="${character.name}">
        <img src="${character.image}" alt="${character.name} icon" loading="lazy" />
        ${character.name}
      </span>
    `
    )
    .join("");
}

function renderTips(tips, refs) {
  const search = refs.search.value.trim().toLowerCase();
  const category = refs.category.value;

  const filtered = tips.filter((tip) => {
    const byCategory = category === "ALL" || tip.category === category;
    const blob = `${tip.title} ${tip.description} ${tip.tags.join(" ")}`.toLowerCase();
    const bySearch = !search || blob.includes(search);
    return byCategory && bySearch;
  });

  refs.grid.innerHTML =
    filtered.length === 0
      ? emptyState("Tips tidak ditemukan. Coba kata kunci lain.")
      : filtered
          .map(
            (tip) => `
          <article class="card">
            <span class="tip-category">${tip.category}</span>
            <h3>${tip.title}</h3>
            <p>${tip.description}</p>
          </article>
        `
          )
          .join("");
}

function filterCharacters(characters, search, tier, role) {
  return characters
    .filter((character) => {
      const byTier = tier === "ALL" || character.tier === tier;
      const byRole = role === "ALL" || character.role === role;
      const blob = `${character.name} ${character.role} ${character.summary} ${character.tags.join(" ")}`.toLowerCase();
      const bySearch = !search || blob.includes(search);
      return byTier && byRole && bySearch;
    })
    .sort((a, b) => {
      const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      if (tierDiff !== 0) return tierDiff;
      return a.name.localeCompare(b.name);
    });
}

function renderTierSection(characters, refs) {
  const search = refs.search.value.trim().toLowerCase();
  const tier = refs.tier.value;
  const role = refs.role.value;

  const filtered = filterCharacters(characters, search, tier, role);
  const highlight = filtered.filter((char) => char.isMeta).slice(0, 3);

  refs.count.textContent = `${filtered.length} karakter cocok`;

  refs.metaGrid.innerHTML =
    highlight.length === 0
      ? emptyState("Meta pick tidak ditemukan pada filter saat ini.")
      : highlight
          .map(
            (character) => `
          <article class="card char-card">
            <div class="char-head">
              <img class="char-avatar" src="${character.image}" alt="${character.name} icon" loading="lazy" />
              <div>
                <span class="meta-tier ${tierClassMap[character.tier]}">Tier ${character.tier}</span>
                <h3>${character.name}</h3>
              </div>
            </div>
            <p><strong>Role:</strong> ${character.role}</p>
            <p>${character.summary}</p>
          </article>
        `
          )
          .join("");

  refs.table.innerHTML = tierOrder
    .map((tierKey) => {
      const tierChars = filtered.filter((character) => character.tier === tierKey);
      const note =
        tierKey === "S"
          ? "Prioritas utama untuk konten sulit dan speed progression."
          : tierKey === "A"
            ? "Kuat dan stabil, terutama dengan komposisi tim yang tepat."
            : "Masih layak dipakai, tapi butuh investment lebih hati-hati.";

      return `
        <tr>
          <td><span class="meta-tier ${tierClassMap[tierKey]}">${tierKey}</span></td>
          <td><div class="tier-char-list">${buildTierChips(tierChars)}</div></td>
          <td>${note}</td>
        </tr>
      `;
    })
    .join("");
}

function renderBuilds(characters, refs) {
  const search = refs.search.value.trim().toLowerCase();
  const tier = refs.tier.value;

  const filtered = characters
    .filter((character) => character.build)
    .filter((character) => {
      const byTier = tier === "ALL" || character.tier === tier;
      const blob = `${character.name} ${character.role} ${character.build.weapon} ${character.build.team}`.toLowerCase();
      const bySearch = !search || blob.includes(search);
      return byTier && bySearch;
    })
    .sort((a, b) => {
      const tierDiff = tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
      if (tierDiff !== 0) return tierDiff;
      return a.name.localeCompare(b.name);
    });

  refs.grid.innerHTML =
    filtered.length === 0
      ? emptyState("Build tidak ditemukan. Ubah filter atau kata kunci.")
      : filtered
          .map(
            (character) => `
          <article class="card build-card">
            <div class="build-head">
              <img class="build-avatar" src="${character.image}" alt="${character.name} icon" loading="lazy" />
              <div>
                <span class="meta-tier ${tierClassMap[character.tier]}">Tier ${character.tier}</span>
                <h3>${character.name}</h3>
                <p><strong>Role:</strong> ${character.role}</p>
              </div>
            </div>
            <ul class="build-list">
              <li><strong>Weapon:</strong> ${character.build.weapon}</li>
              <li><strong>Skill Priority:</strong> ${character.build.skills}</li>
              <li><strong>Tim Rekomendasi:</strong> ${character.build.team}</li>
              <li><strong>Catatan:</strong> ${character.build.notes}</li>
            </ul>
          </article>
        `
          )
          .join("");
}

async function bootstrap() {
  const response = await fetch("data/content.json");
  if (!response.ok) {
    throw new Error("Gagal memuat data JSON");
  }

  const data = await response.json();
  const { meta, tips, characters } = data;

  const stamp = document.getElementById("data-stamp");
  if (stamp) {
    stamp.textContent = `Data disusun: ${toTitleDate(meta.updatedAt)}`;
  }

  const tipsRefs = {
    search: document.getElementById("tips-search"),
    category: document.getElementById("tips-category"),
    grid: document.getElementById("tips-grid"),
  };

  const categories = ["ALL", ...new Set(tips.map((tip) => tip.category))];
  tipsRefs.category.innerHTML = categories
    .map((category) => {
      const label = category === "ALL" ? "Semua Kategori" : category;
      return `<option value="${category}">${label}</option>`;
    })
    .join("");

  const tierRefs = {
    search: document.getElementById("char-search"),
    tier: document.getElementById("tier-filter"),
    role: document.getElementById("role-filter"),
    count: document.getElementById("char-count"),
    metaGrid: document.getElementById("meta-grid"),
    table: document.getElementById("tier-table-body"),
  };

  const roles = ["ALL", ...new Set(characters.map((character) => character.role))];
  tierRefs.role.innerHTML = roles
    .map((role) => {
      const label = role === "ALL" ? "Semua Role" : role;
      return `<option value="${role}">${label}</option>`;
    })
    .join("");

  const buildRefs = {
    search: document.getElementById("build-search"),
    tier: document.getElementById("build-tier-filter"),
    grid: document.getElementById("build-grid"),
  };

  const redrawTips = () => renderTips(tips, tipsRefs);
  const redrawTier = () => renderTierSection(characters, tierRefs);
  const redrawBuilds = () => renderBuilds(characters, buildRefs);

  tipsRefs.search.addEventListener("input", redrawTips);
  tipsRefs.category.addEventListener("change", redrawTips);

  tierRefs.search.addEventListener("input", redrawTier);
  tierRefs.tier.addEventListener("change", redrawTier);
  tierRefs.role.addEventListener("change", redrawTier);

  buildRefs.search.addEventListener("input", redrawBuilds);
  buildRefs.tier.addEventListener("change", redrawBuilds);

  redrawTips();
  redrawTier();
  redrawBuilds();
}

bootstrap().catch((error) => {
  console.error(error);
  const stamp = document.getElementById("data-stamp");
  if (stamp) {
    stamp.textContent = "Data disusun: gagal memuat data";
  }
});
