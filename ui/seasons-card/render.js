/**
 * Seasons Card – render helper (vanilla)
 *
 * Supports:
 * - Canonical Card Schema v1 JSON
 * - Legacy demo objects (word/tags/examples/related/placeholders)
 *
 * Goals:
 * - No crashes when optional fields are missing
 * - Preserve legacy display affordances (icon, emoji related, tag pills)
 * - Keep hover/click audio working
 */

window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};

/**
 * Normalize raw input into a unified shape.
 * This is explicit, small, and predictable (no mystery).
 */
function normalizeCard(raw) {
  if (!raw) return {};

  const isCanonical =
    raw.headword &&
    raw.forms &&
    Array.isArray(raw.examples);

  if (isCanonical) {
    return {
      id: raw.id || raw.headword.it,
      type: raw.type || "vocab",
      language: raw.language || "it",

      headword: raw.headword || {},
      forms: raw.forms || {},
      pronunciation: raw.pronunciation || {},
      meaning: raw.meaning || {},
      examples: raw.examples || [],
      grammar: raw.grammar || {},
      etymology: raw.etymology || {},
      relations: raw.relations || {},

      // canonical extras
      images: raw.images || null,
      quizSeeds: raw.quizSeeds || null,
      metadata: raw.metadata || {},

      // legacy display helpers (allowed in canonical JSON)
      legacyIcon: raw.legacyIcon || "",
      legacyRelated: Array.isArray(raw.legacyRelated) ? raw.legacyRelated : [],
      placeholders: raw.placeholders || null,

      // legacy "tags" object may not exist in canonical
      tags: raw.tags || null,
    };
  }

  // Legacy demo shape
  const legacy = raw;
  return {
    id: legacy.id || legacy.word?.it || "",
    type: legacy.type || "vocab",
    language: legacy.language || "it",

    headword: {
      it: legacy.word?.it || "",
      en: legacy.word?.en || "",
      gender: legacy.word?.gender,
      partOfSpeech: "noun",
      register: "neutral",
    },

    forms: {
      canonical: legacy.word?.singular || legacy.word?.it || "",
      singular: legacy.word?.singular || legacy.word?.it || "",
      plural: legacy.word?.plural || "",
      variants: [],
    },

    pronunciation: legacy.word?.pronunciation || {},
    meaning: { primary: legacy.word?.en || "" },

    examples: [
      {
        it: legacy.examples?.it || "",
        en: legacy.examples?.en || "",
      },
    ],

    grammar: {},
    etymology: { noteHtml: legacy.word?.etymology?.html || "" },

    relations: {
      related: Array.isArray(legacy.related) ? legacy.related.map((r) => r.it) : [],
    },

    legacyIcon: legacy.word?.icon || "",
    legacyRelated: Array.isArray(legacy.related) ? legacy.related : [],
    placeholders: legacy.placeholders || null,
    tags: legacy.tags || null,

    images: legacy.images || null,
    quizSeeds: legacy.quizSeeds || null,
    metadata: legacy.metadata || {},
  };
}

/**
 * Render ONE card
 */
window.CapiscoSeasonsCard.render = function renderSeasonsCard(container, rawCardData) {
  if (!container) throw new Error("renderSeasonsCard: container is required");
  if (!rawCardData) throw new Error("renderSeasonsCard: cardData is required");

  const cardData = normalizeCard(rawCardData);

  const template = document.createElement("template");
  template.innerHTML = `
<section class="word-group">
  <h2 class="word-group-title">
    <span class="wg-word"></span>
    <span class="word-label-icon"></span>
  </h2>

  <article class="card">
    <header class="card-header">
      <div>
        <div class="card-title-line">
          <span class="word-it" data-lang="it-IT"></span>
          <span class="dot">·</span>
          <span class="translation word-en" data-lang="en-GB"></span>
          <span class="gender"></span>
        </div>

        <div class="tag-row">
          <span class="tag-pill tag-level"></span>
          <span class="tag-pill tag-id"></span>
          <span class="tag-pill tag-cat"></span>
        </div>
      </div>

      <div class="icon-circle"></div>
    </header>

    <!-- Optional image slot for future canonical/fallback images -->
    <div class="card-image hidden">
      <img />
    </div>

    <div class="tabs">
      <div class="tab active" data-tab="overview">Overview</div>
      <div class="tab" data-tab="examples">Examples</div>
      <div class="tab" data-tab="grammar">Grammar</div>
      <div class="tab" data-tab="related">Related</div>
      <div class="tab" data-tab="quiz">Quiz</div>
    </div>

    <div class="card-body">
      <div class="tab-section" data-section="overview">
        <div class="row"><div class="row-label">Singular:</div><div><span class="value-singular" data-lang="it-IT"></span></div></div>
        <div class="row"><div class="row-label">Plural:</div><div><span class="value-plural" data-lang="it-IT"></span></div></div>
        <div class="row"><div class="row-label">Pronunciation:</div><div><span class="pron-readable"></span> <span class="ipa"></span></div></div>
        <div class="row"><div class="row-label">Etymology:</div><div class="etymology"></div></div>
      </div>

      <div class="tab-section hidden" data-section="examples">
        <div class="example-bar">
          <span class="example-label">Example:</span>
          <div class="example-text-block">
            <div class="example-it" data-lang="it-IT"></div>
            <div class="example-en" data-lang="en-GB"></div>
          </div>
        </div>
      </div>

      <div class="tab-section hidden" data-section="grammar">
        <div class="tab-placeholder grammar"></div>
      </div>

      <div class="tab-section hidden" data-section="related">
        <div class="related-row">
          <span class="related-label">Related:</span>
          <div class="related-row-list"></div>
        </div>
      </div>

      <div class="tab-section hidden" data-section="quiz">
        <div class="tab-placeholder quiz"></div>
      </div>
    </div>
  </article>
</section>
`;

  container.appendChild(template.content.cloneNode(true));

  const root = container.lastElementChild;
  const card = root.querySelector(".card");

  // ---------- Header ----------
  root.querySelector(".wg-word").textContent = cardData.headword.it || "";
  root.querySelector(".word-label-icon").textContent = cardData.legacyIcon || "";

  const itEl = root.querySelector(".word-it");
  itEl.textContent = cardData.headword.it || "";
  itEl.setAttribute("data-say", cardData.headword.it || "");

  const enEl = root.querySelector(".word-en");
  enEl.textContent = cardData.headword.en || "";
  enEl.setAttribute("data-say", cardData.headword.en || "");

  root.querySelector(".gender").textContent =
    cardData.headword.gender ? `(${cardData.headword.gender})` : "";

  // Tag pills: legacy tags OR canonical metadata
  const tagLevel =
    cardData.tags?.level ||
    cardData.metadata?.difficulty ||
    "";

  const tagId =
    cardData.tags?.id ||
    cardData.metadata?.rankId ||
    "";

  const tagCat =
    cardData.tags?.category ||
    (Array.isArray(cardData.metadata?.tags) ? cardData.metadata.tags[0] : "") ||
    "";

  root.querySelector(".tag-level").textContent = tagLevel;
  root.querySelector(".tag-id").textContent = tagId;
  root.querySelector(".tag-cat").textContent = tagCat;

  // Icon circle preserved
  root.querySelector(".icon-circle").textContent = cardData.legacyIcon || "";

  // Optional image slot (canonical/fallback)
  const imgSrc =
    cardData.images?.canonical?.src ||
    cardData.images?.fallback?.src ||
    null;

  if (imgSrc) {
    const wrap = root.querySelector(".card-image");
    const img = wrap.querySelector("img");
    img.src = imgSrc;
    img.alt = cardData.images?.canonical?.alt || cardData.headword.it || "";
    wrap.classList.remove("hidden");
  }

  // ---------- Overview ----------
  const singEl = root.querySelector(".value-singular");
  singEl.textContent = cardData.forms.singular || "";
  singEl.setAttribute("data-say", cardData.forms.singular || "");

  const plEl = root.querySelector(".value-plural");
  plEl.textContent = cardData.forms.plural || "";
  plEl.setAttribute("data-say", cardData.forms.plural || "");

  root.querySelector(".pron-readable").textContent = cardData.pronunciation.readable || "";
  root.querySelector(".ipa").textContent = cardData.pronunciation.ipa || "";

  // Etymology: structured canonical OR legacy html
  const etyEl = root.querySelector(".etymology");
  if (cardData.etymology?.origin || cardData.etymology?.evolution || cardData.etymology?.mnemonic) {
    const parts = [
      cardData.etymology.origin ? `<div><strong>Origin:</strong> ${cardData.etymology.origin}</div>` : "",
      cardData.etymology.evolution ? `<div>${cardData.etymology.evolution}</div>` : "",
      cardData.etymology.mnemonic ? `<div><em>${cardData.etymology.mnemonic}</em></div>` : ""
    ].filter(Boolean);
    etyEl.innerHTML = parts.join("");
  } else {
    etyEl.innerHTML = cardData.etymology?.noteHtml || "";
  }

  // ---------- Examples ----------
  const ex0 = cardData.examples[0] || {};
  const exIt = root.querySelector(".example-it");
  exIt.textContent = ex0.it || "";
  exIt.setAttribute("data-say", ex0.it || "");

  const exEn = root.querySelector(".example-en");
  exEn.textContent = ex0.en || "";
  exEn.setAttribute("data-say", ex0.en || "");

  // ---------- Grammar / Quiz (canonical fallback if placeholders missing) ----------
  const grammarHtml =
    cardData.placeholders?.grammar ||
    (cardData.grammar?.notes ? `Grammar: ${cardData.grammar.notes}` : "") ||
    "";

  const quizHtml =
    cardData.placeholders?.quiz ||
    (cardData.quizSeeds ? "Quiz coming soon." : "") ||
    "";

  root.querySelector(".grammar").innerHTML = grammarHtml;
  root.querySelector(".quiz").innerHTML = quizHtml;

  // ---------- Related ----------
  const relatedList = root.querySelector(".related-row-list");
  relatedList.innerHTML = "";

  if (Array.isArray(cardData.legacyRelated) && cardData.legacyRelated.length) {
    cardData.legacyRelated.forEach((r) => {
      const span = document.createElement("span");
      span.textContent = r.emoji ? `${r.it} ${r.emoji}` : r.it;
      span.setAttribute("data-lang", "it-IT");
      span.setAttribute("data-say", r.it);
      relatedList.appendChild(span);
    });
  } else {
    const rel = cardData.relations?.related || [];
    rel.forEach((w) => {
      const span = document.createElement("span");
      span.textContent = w;
      span.setAttribute("data-lang", "it-IT");
      span.setAttribute("data-say", w);
      relatedList.appendChild(span);
    });
  }

  // ---------- Tabs ----------
  const tabs = card.querySelectorAll(".tab");
  const sections = card.querySelectorAll(".tab-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      sections.forEach((sec) =>
        sec.classList.toggle("hidden", sec.getAttribute("data-section") !== key)
      );
    });
  });

  // ---------- Speech (hover/click) ----------
  const pickVoice = (lang) => {
    const voices = window.speechSynthesis.getVoices();
    const l = (lang || "").toLowerCase();
    if (l.startsWith("it")) return voices.find((v) => v.lang.startsWith("it")) || null;
    if (l.startsWith("en")) return voices.find((v) => v.lang.startsWith("en")) || null;
    return null;
  };

  const say = (text, lang) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (lang) u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  root.querySelectorAll("[data-say]").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      say(el.getAttribute("data-say"), el.getAttribute("data-lang"))
    );
    el.addEventListener("click", () =>
      say(el.getAttribute("data-say"), el.getAttribute("data-lang"))
    );
  });
};

/**
 * Render MANY cards
 */
window.CapiscoSeasonsCard.renderMany = function renderMany(container, cards) {
  if (!container) throw new Error("renderMany: container is required");
  if (!Array.isArray(cards)) throw new Error("renderMany: cards[] is required");
  cards.forEach((c) => window.CapiscoSeasonsCard.render(container, c));
};
