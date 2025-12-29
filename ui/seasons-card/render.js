/**
 * Seasons Card – render helper (vanilla)
 *
 * Fix commit:
 * - Keep canonical adapter
 * - Restore audio hover/click wiring (data-say)
 * - Preserve icon-circle + label icon from legacy (no schema assumption)
 * - Keep related display friendly (use emoji if available)
 */

window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};

/**
 * Minimal adapter: canonical ← legacy
 * (REMOVE once all cards are canonical)
 */
function adaptCardData(raw) {
  if (raw.headword) return raw; // already canonical

  return {
    id: raw.id || raw.word?.it,
    type: raw.type || "vocab",
    language: raw.language || "it",

    headword: {
      it: raw.word.it,
      en: raw.word.en,
      gender: raw.word.gender,
      partOfSpeech: "noun",
      register: "neutral",
    },

    forms: {
      canonical: raw.word.singular,
      singular: raw.word.singular,
      plural: raw.word.plural,
    },

    pronunciation: {
      readable: raw.word.pronunciation?.readable,
      ipa: raw.word.pronunciation?.ipa,
      // audio urls can come later
    },

    meaning: {
      primary: raw.word.en,
    },

    examples: [
      {
        it: raw.examples.it,
        en: raw.examples.en,
      },
    ],

    grammar: {
      notes: null,
    },

    // keep legacy HTML for now; will be structured later
    etymology: {
      noteHtml: raw.word.etymology?.html || null,
    },

    // Keep legacy related objects (with emoji)
    legacyRelated: raw.related || [],

    // Canonical-ish related list too
    relations: {
      related: raw.related?.map((r) => r.it) || [],
    },

    // legacy visuals
    legacyIcon: raw.word.icon || "",
    tags: raw.tags || {},
    placeholders: raw.placeholders || {},

    // future
    images: raw.images || null,
    quizSeeds: raw.quizSeeds || {
      recognition: true,
      recall: true,
      production: true,
    },
  };
}

/**
 * Render ONE card
 */
window.CapiscoSeasonsCard.render = function renderSeasonsCard(container, rawCardData) {
  if (!container) throw new Error("renderSeasonsCard: container is required");
  if (!rawCardData) throw new Error("renderSeasonsCard: cardData is required");

  const cardData = adaptCardData(rawCardData);

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

    <!-- OPTIONAL image slot for future canonical/fallback images -->
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

  const node = template.content.cloneNode(true);
  container.appendChild(node);

  const root = container.lastElementChild;
  const card = root.querySelector(".card");

  // ---------- Header ----------
  root.querySelector(".wg-word").textContent = cardData.headword.it;
  root.querySelector(".word-label-icon").textContent = cardData.legacyIcon || "";

  const itEl = root.querySelector(".word-it");
  itEl.textContent = cardData.headword.it;
  itEl.setAttribute("data-say", cardData.headword.it);

  const enEl = root.querySelector(".word-en");
  enEl.textContent = cardData.headword.en;
  enEl.setAttribute("data-say", cardData.headword.en);

  root.querySelector(".gender").textContent = cardData.headword.gender
    ? `(${cardData.headword.gender})`
    : "";

  root.querySelector(".tag-level").textContent = cardData.tags.level || "";
  root.querySelector(".tag-id").textContent = cardData.tags.id || "";
  root.querySelector(".tag-cat").textContent = cardData.tags.category || "";

  // Keep the same icon-circle behaviour as before (legacy icon)
  root.querySelector(".icon-circle").textContent = cardData.legacyIcon || "";

  // ---------- Optional image slot (future) ----------
  // Only show if canonical/fallback image exists
  const imgSrc =
    cardData.images?.canonical?.src ||
    cardData.images?.fallback?.src ||
    null;

  if (imgSrc) {
    const wrap = root.querySelector(".card-image");
    const img = wrap.querySelector("img");
    img.src = imgSrc;
    img.alt = cardData.images?.canonical?.alt || cardData.headword.it;
    wrap.classList.remove("hidden");
  }

  // ---------- Overview ----------
  const singEl = root.querySelector(".value-singular");
  singEl.textContent = cardData.forms.singular;
  singEl.setAttribute("data-say", cardData.forms.singular);

  const plEl = root.querySelector(".value-plural");
  plEl.textContent = cardData.forms.plural;
  plEl.setAttribute("data-say", cardData.forms.plural);

  root.querySelector(".pron-readable").textContent = cardData.pronunciation.readable || "";
  root.querySelector(".ipa").textContent = cardData.pronunciation.ipa || "";

  // legacy HTML kept for now
  root.querySelector(".etymology").innerHTML = cardData.etymology.noteHtml || "";

  // ---------- Examples ----------
  const exIt = root.querySelector(".example-it");
  exIt.textContent = cardData.examples[0]?.it || "";
  exIt.setAttribute("data-say", cardData.examples[0]?.it || "");

  const exEn = root.querySelector(".example-en");
  exEn.textContent = cardData.examples[0]?.en || "";
  exEn.setAttribute("data-say", cardData.examples[0]?.en || "");

  // ---------- Grammar / Quiz placeholders ----------
  root.querySelector(".grammar").innerHTML = cardData.placeholders.grammar || "";
  root.querySelector(".quiz").innerHTML = cardData.placeholders.quiz || "";

  // ---------- Related ----------
  const relatedList = root.querySelector(".related-row-list");

  // Prefer legacy objects if present (so you keep emojis)
  const legacyRelated = Array.isArray(cardData.legacyRelated) ? cardData.legacyRelated : [];
  if (legacyRelated.length) {
    legacyRelated.forEach((r) => {
      const span = document.createElement("span");
      span.textContent = r.emoji ? `${r.it} ${r.emoji}` : r.it;
      span.setAttribute("data-lang", "it-IT");
      span.setAttribute("data-say", r.it);
      relatedList.appendChild(span);
    });
  } else {
    (cardData.relations.related || []).forEach((w) => {
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

  // ---------- Speech (RESTORED) ----------
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
  cards.forEach((card) => window.CapiscoSeasonsCard.render(container, card));
};
