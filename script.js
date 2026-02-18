const metaHighlights = [
  {
    tier: "S",
    tierClass: "tier-s",
    name: "Laevatain",
    role: "Main DPS",
    note: "Damage konsisten tinggi, mudah jadi core tim burst di patch awal.",
  },
  {
    tier: "S",
    tierClass: "tier-s",
    name: "Gilberta",
    role: "Sub DPS / Buffer",
    note: "Sinergi kuat dengan unit burst dan memberi tekanan damage tambahan.",
  },
  {
    tier: "S",
    tierClass: "tier-s",
    name: "Yvonne",
    role: "Hybrid DPS",
    note: "Fleksibel untuk comp cepat; performa bagus dari early ke endgame.",
  },
];

const tierRows = [
  {
    tier: "S",
    tierClass: "tier-s",
    chars: "Laevatain, Gilberta, Yvonne, Ardelia, Last Rite",
    note: "Prioritas utama untuk progress cepat dan konten sulit.",
  },
  {
    tier: "A",
    tierClass: "tier-a",
    chars: "Perlica, Pogranichnik, Ember, Avywenna, Da Pan",
    note: "Sangat kuat bila dipasang di komposisi tim yang tepat.",
  },
  {
    tier: "B",
    tierClass: "tier-b",
    chars: "Catcher, Arclight, Lifeng, Snowshine",
    note: "Masih layak dipakai, tapi biasanya perlu investment lebih besar.",
  },
];

const builds = [
  {
    name: "Laevatain",
    weapon: "Dawn's Last Glimmer / Daybreak Caller / Straight Away",
    skills: "Talent > Active Skill > Ultimate > Basic Attack > Combo Skill",
    team: "Yvonne + Laevatain + Gilberta + Ardelia",
  },
  {
    name: "Yvonne",
    weapon: "Daybreak Caller / Old Times in Londinium / Matcha",
    skills: "Talent > Basic Attack > Active Skill > Combo Skill > Ultimate",
    team: "Yvonne + Gilberta + Perlica + Ardelia",
  },
  {
    name: "Gilberta",
    weapon: "Return to Arcadia / Daybreak Caller / Rocket Belt",
    skills: "Talent > Active Skill > Ultimate > Basic Attack > Combo Skill",
    team: "Yvonne + Laevatain + Gilberta + Ardelia",
  },
  {
    name: "Ardelia",
    weapon: "Return to Arcadia / Old Times in Londinium / Seashell",
    skills: "Talent > Active Skill > Ultimate > Basic Attack > Combo Skill",
    team: "Yvonne + Gilberta + Perlica + Ardelia",
  },
];

const metaGrid = document.getElementById("meta-grid");
const tierTableBody = document.getElementById("tier-table-body");
const buildGrid = document.getElementById("build-grid");

if (metaGrid) {
  metaGrid.innerHTML = metaHighlights
    .map(
      (item) => `
      <article class="card">
        <span class="meta-tier ${item.tierClass}">Tier ${item.tier}</span>
        <h3>${item.name}</h3>
        <p><strong>Role:</strong> ${item.role}</p>
        <p>${item.note}</p>
      </article>
    `
    )
    .join("");
}

if (tierTableBody) {
  tierTableBody.innerHTML = tierRows
    .map(
      (row) => `
      <tr>
        <td><span class="meta-tier ${row.tierClass}">${row.tier}</span></td>
        <td>${row.chars}</td>
        <td>${row.note}</td>
      </tr>
    `
    )
    .join("");
}

if (buildGrid) {
  buildGrid.innerHTML = builds
    .map(
      (build) => `
      <article class="card">
        <h3>${build.name}</h3>
        <ul class="build-list">
          <li><strong>Weapon:</strong> ${build.weapon}</li>
          <li><strong>Skill Priority:</strong> ${build.skills}</li>
          <li><strong>Tim Rekomendasi:</strong> ${build.team}</li>
        </ul>
      </article>
    `
    )
    .join("");
}
