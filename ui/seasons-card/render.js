/**
 * Seasons Card – render helper (vanilla)
 */

/* __START_IMAGE_MEDIA_HELPERS_R010__ */

// Card media picker: concept registry -> card.images.canonical -> fallback
function pickMedia(cardData) {
  const canonical =
    cardData?.images?.canonical ||
    cardData?.images?.canonicalPhotos ||
    cardData?.images?.canonicalIllustrations ||
    [];
  if (canonical.length) return canonical[0];
  return cardData?.images?.fallback || null;
}

/**
 * Phase 14B — render a media item deterministically.
 * Supports:
 * - local/remote src images (img)
 * - fallback auto placeholders (stable, bounded div)
 */
function renderCardMediaHtml(media) {
  if (!media) return "";

  // 1) Real image src paths
  const src = media.src || media.url || media.href || media.path || "";
  if (src) {
    return `
      <div class="capisco-card-media" data-media-slot="canonical">
        <img
          class="capisco-card-image"
          src="${src}"
          alt="${media.alt || ""}"
          loading="lazy"
          decoding="async"
        />
      </div>
    `;
  }

  // 2) Fallback "auto" placeholder (deterministic, no network)
  // We render a stable placeholder block so the UI is consistent.
  if (media.type === "auto") {
    const label = media.prompt || "image";
    return `
      <div class="capisco-card-media" data-media-slot="fallback">
        <div
          class="capisco-card-image"
          style="width:100%; aspect-ratio: 4 / 3; display:flex; align-items:center; justify-content:center;"
          aria-label="${label.replace(/"/g, "&quot;")}"
        >
          <span style="opacity:.55; font-size:14px;">${label}</span>
        </div>
      </div>
    `;
  }

  return "";
}

/* __END_IMAGE_MEDIA_HELPERS_R010__ */









// >>> START MODULE_EXPORT_R020
window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};
// <<< END MODULE_EXPORT_R020

// >>> START NORMALIZE_CARD_R030

function normalizeCard(raw) {
  if (!raw) return {};

  const isCanonical = raw.headword && raw.forms && Array.isArray(raw.examples);

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

      // Phase 13: preserve contract media, and keep legacy images for now
      media: raw.media || null,
      images: raw.images || null,

      quizSeeds: raw.quizSeeds || null,
      metadata: raw.metadata || {},
      legacyIcon: raw.legacyIcon || "",
      legacyRelated: Array.isArray(raw.legacyRelated) ? raw.legacyRelated : [],
      placeholders: raw.placeholders || null,
      tags: raw.tags || null,
    };
  }

  const legacy = raw;

  // Legacy -> minimal canonical-ish mapping
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
    examples: [{ it: legacy.examples?.it || "", en: legacy.examples?.en || "" }],
    grammar: {},
    etymology: { noteHtml: legacy.word?.etymology?.html || "" },
    relations: { related: Array.isArray(legacy.related) ? legacy.related.map((r) => r.it) : [] },
    legacyIcon: legacy.word?.icon || "",
    legacyRelated: Array.isArray(legacy.related) ? legacy.related : [],
    placeholders: legacy.placeholders || null,
    tags: legacy.tags || null,

    // Legacy images -> media bridge (Phase 13)
    images: legacy.images || null,
    media: legacy.media || legacy.images || null,

    quizSeeds: legacy.quizSeeds || null,
    metadata: legacy.metadata || {},
  };
}

// <<< END NORMALIZE_CARD_R030


// >>> START RENDER_ONE_CARD_R100

window.CapiscoSeasonsCard.render = function renderSeasonsCard(container, rawCardData) {
  if (!container) throw new Error("renderSeasonsCard: container is required");
  if (!rawCardData) throw new Error("renderSeasonsCard: cardData is required");

  const cardData = normalizeCard(rawCardData);

  // >>> START TEMPLATE_HTML_R111
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
  // <<< END TEMPLATE_HTML_R111

  container.appendChild(template.content.cloneNode(true));

  const root = container.lastElementChild;
  const card = root.querySelector(".card");

  // >>> START HEADER_WORDS_R121
  root.querySelector(".wg-word").textContent = cardData.headword.it || "";
  root.querySelector(".word-label-icon").textContent = cardData.legacyIcon || "";

  const itEl = root.querySelector(".word-it");
  itEl.textContent = cardData.headword.it || "";
  itEl.setAttribute("data-say", cardData.headword.it || "");

  const enEl = root.querySelector(".word-en");
  enEl.textContent = cardData.headword.en || "";
  enEl.setAttribute("data-say", cardData.headword.en || "");

  root.querySelector(".gender").textContent = cardData.headword.gender
    ? `(${cardData.headword.gender})`
    : "";
  // <<< END HEADER_WORDS_R121

  // >>> START TAG_PILLS_R123
  const tagLevel = cardData.tags?.level || cardData.metadata?.difficulty || "";
  const tagId = cardData.tags?.id || cardData.metadata?.rankId || "";
  const tagCat =
    cardData.tags?.category ||
    (Array.isArray(cardData.metadata?.tags) ? cardData.metadata.tags[0] : "") ||
    "";

  root.querySelector(".tag-level").textContent = tagLevel;
  root.querySelector(".tag-id").textContent = tagId;
  root.querySelector(".tag-cat").textContent = tagCat;
  // <<< END TAG_PILLS_R123

/* START_MEDIA_SLOT_R124 */

// Wire media into the existing DOM slot: <div class="card-image hidden"><img/></div>
(function wireCardMediaSlot() {
  const slot = root.querySelector(".card-image");
  const iconCircle = root.querySelector(".icon-circle");

  // Phase 13/14B: Contract-first media selection
  // Priority: media.canonical[0] -> media.fallback -> placeholder (empty)
  let chosen = null;

  if (
    cardData &&
    cardData.media &&
    Array.isArray(cardData.media.canonical) &&
    cardData.media.canonical.length > 0
  ) {
    chosen = cardData.media.canonical[0];
  } else if (cardData && cardData.media && cardData.media.fallback) {
    chosen = cardData.media.fallback;
  }

  const html = chosen ? renderCardMediaHtml(chosen) : "";

  // Put the HTML INSIDE the slot and show it (bounded slot still exists even if empty)
  slot.innerHTML = html;
  slot.classList.remove("hidden");

  // Keep rounding, but DO NOT clip (clipping caused breakpoint cut-off)
  slot.style.borderRadius = "20px";

  // Hide the old circle placeholder if ANY media rendered (image or fallback tile)
  const hasMedia = !!slot.querySelector(".capisco-card-media");
  if (hasMedia && iconCircle) iconCircle.classList.add("hidden");
})();

/* END_MEDIA_SLOT_R124 */






  // >>> START OVERVIEW_FORMS_R131
  const singEl = root.querySelector(".value-singular");
  singEl.textContent = cardData.forms.singular || "";
  singEl.setAttribute("data-say", cardData.forms.singular || "");

  const plEl = root.querySelector(".value-plural");
  plEl.textContent = cardData.forms.plural || "";
  plEl.setAttribute("data-say", cardData.forms.plural || "");

  root.querySelector(".pron-readable").textContent = cardData.pronunciation.readable || "";
  root.querySelector(".ipa").textContent = cardData.pronunciation.ipa || "";
  // <<< END OVERVIEW_FORMS_R131

  // >>> START ETYMOLOGY_RENDER_R133
  const etyEl = root.querySelector(".etymology");
  if (cardData.etymology?.origin || cardData.etymology?.evolution || cardData.etymology?.mnemonic) {
    const parts = [
      cardData.etymology.origin ? `<div><strong>Origin:</strong> ${cardData.etymology.origin}</div>` : "",
      cardData.etymology.evolution ? `<div>${cardData.etymology.evolution}</div>` : "",
      cardData.etymology.mnemonic ? `<div><em>${cardData.etymology.mnemonic}</em></div>` : "",
    ].filter(Boolean);
    etyEl.innerHTML = parts.join("");
  } else {
    etyEl.innerHTML = cardData.etymology?.noteHtml || "";
  }
  // <<< END ETYMOLOGY_RENDER_R133

  // >>> START EXAMPLES_RENDER_R141

  const examplesSection = root.querySelector('.tab-section[data-section="examples"]');
  if (examplesSection) {
    // Clear the single-example static markup and render a list instead.
    examplesSection.innerHTML = "";

    const examples = Array.isArray(cardData.examples) ? cardData.examples : [];

    // Render only non-empty examples (both it+en empty = skip)
    const usable = examples.filter((ex) => {
      const it = (ex?.it || "").trim();
      const en = (ex?.en || "").trim();
      return it || en;
    });

    if (!usable.length) {
      const empty = document.createElement("div");
      empty.className = "tab-placeholder examples";
      empty.textContent = "No examples available yet.";
      examplesSection.appendChild(empty);
    } else {
      usable.forEach((ex, idx) => {
        const bar = document.createElement("div");
        bar.className = "example-bar";

        const label = document.createElement("span");
        label.className = "example-label";
        label.textContent = usable.length > 1 ? `Example ${idx + 1}:` : "Example:";

        const block = document.createElement("div");
        block.className = "example-text-block";

        const it = document.createElement("div");
        it.className = "example-it";
        it.setAttribute("data-lang", "it-IT");
        it.textContent = ex.it || "";
        it.setAttribute("data-say", ex.it || "");

        const en = document.createElement("div");
        en.className = "example-en";
        en.setAttribute("data-lang", "en-GB");
        en.textContent = ex.en || "";
        en.setAttribute("data-say", ex.en || "");

        block.appendChild(it);
        block.appendChild(en);

        bar.appendChild(label);
        bar.appendChild(block);

        examplesSection.appendChild(bar);
      });
    }
  }

  // <<< END EXAMPLES_RENDER_R141



  // >>> START GRAMMAR_QUIZ_RENDER_R151
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
  // <<< END GRAMMAR_QUIZ_RENDER_R151

  // >>> START RELATED_RENDER_R161
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
  // <<< END RELATED_RENDER_R161

  // >>> START TABS_WIRING_R171
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
  // <<< END TABS_WIRING_R171

  // >>> START SPEECH_PICKVOICE_R181
  const pickVoice = (lang) => {
    const voices = window.speechSynthesis.getVoices();
    const l = (lang || "").toLowerCase();
    if (l.startsWith("it")) return voices.find((v) => v.lang.startsWith("it")) || null;
    if (l.startsWith("en")) return voices.find((v) => v.lang.startsWith("en")) || null;
    return null;
  };
  // <<< END SPEECH_PICKVOICE_R181

  // >>> START SPEECH_SAY_R182
  const say = (text, lang) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (lang) u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };
  // <<< END SPEECH_SAY_R182

  // >>> START SPEECH_BINDINGS_R183
  root.querySelectorAll("[data-say]").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      say(el.getAttribute("data-say"), el.getAttribute("data-lang"))
    );
    el.addEventListener("click", () =>
      say(el.getAttribute("data-say"), el.getAttribute("data-lang"))
    );
  });
  // <<< END SPEECH_BINDINGS_R183
};

// <<< END RENDER_ONE_CARD_R100

// >>> START RENDER_MANY_CARDS_R190
window.CapiscoSeasonsCard.renderMany = function renderMany(container, cards) {
  if (!container) throw new Error("renderMany: container is required");
  if (!Array.isArray(cards)) throw new Error("renderMany: cards[] is required");
  cards.forEach((c) => window.CapiscoSeasonsCard.render(container, c));
};
// <<< END RENDER_MANY_CARDS_R190
