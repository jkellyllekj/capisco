/**
 * Seasons Card - render helper (vanilla)
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
 * Renderer: render a media item deterministically.
 * Supports:
 * - local or remote src images (img)
 * - fallback auto placeholders (stable, bounded div)
 *
 * Options:
 * - loading: "eager" | "lazy"
 * - fetchPriority: "high" | "low" | "auto"
 */
function renderCardMediaHtml(media, opts) {
  if (!media) return "";
  const options = opts || {};

  const src = media.src || media.url || media.href || media.path || "";
  if (src) {
    const alt = String(media.alt || "").replace(/"/g, "&quot;");
    const loading = options.loading === "eager" ? "eager" : "lazy";
    const fetchPriority = options.fetchPriority || "";

    const width = Number(media.width || 0);
    const height = Number(media.height || 0);
    const hasDims =
      Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0;

    return `
      <div class="capisco-card-media" data-media-slot="canonical">
        <img
          class="capisco-card-image"
          src="${src}"
          alt="${alt}"
          loading="${loading}"
          decoding="async"
          ${fetchPriority ? `fetchpriority="${fetchPriority}"` : ""}
          ${hasDims ? `width="${width}" height="${height}"` : ""}
          style="display:block;"
        />
      </div>
    `;
  }

  if (media.type === "auto") {
    const label = media.prompt || "image";
    return `
      <div class="capisco-card-media" data-media-slot="fallback">
        <div
          class="capisco-card-image"
          style="width:100%; aspect-ratio: 4 / 3; display:flex; align-items:center; justify-content:center;"
          aria-label="${String(label).replace(/"/g, "&quot;")}"
        >
          <span style="opacity:.55; font-size:14px;">${label}</span>
        </div>
      </div>
    `;
  }

  return "";
}

/* __END_IMAGE_MEDIA_HELPERS_R010__ */

/* __START_MODULE_EXPORT_R020__ */
window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};
/* __END_MODULE_EXPORT_R020__ */

/* __START_TYPE_HELPERS_R025__ */

function isSentenceType(t) {
  const raw = String(t || "").toLowerCase();
  return raw === "sentence" || raw === "expression" || raw === "phrase";
}

/* __END_TYPE_HELPERS_R025__ */

/* __START_SPEECH_PICKVOICE_R181__ */

const _capiscoVoiceCache = {
  loaded: false,
  voices: [],
  listenerAttached: false,
};

function _capiscoLoadVoicesOnce() {
  if (!_capiscoVoiceCache.loaded) {
    _capiscoVoiceCache.voices = window.speechSynthesis.getVoices() || [];
    _capiscoVoiceCache.loaded = true;
  }

  if (_capiscoVoiceCache.listenerAttached) return;

  _capiscoVoiceCache.listenerAttached = true;

  window.speechSynthesis.addEventListener("voiceschanged", () => {
    _capiscoVoiceCache.voices = window.speechSynthesis.getVoices() || [];
    _capiscoVoiceCache.loaded = true;
  });
}

function _capiscoScoreVoice(v, targetLang) {
  const name = String(v?.name || "");
  const lang = String(v?.lang || "").toLowerCase();
  const want = String(targetLang || "").toLowerCase();

  let score = 0;

  // Exact locale match first, then language prefix
  if (want && lang === want) score += 60;
  else if (want && lang.startsWith(want.split("-")[0])) score += 30;

  // Prefer Microsoft system voices
  if (/microsoft/i.test(name)) score += 80;

  // Prefer "Natural" style voices when available
  if (/natural/i.test(name)) score += 30;

  // Small preferences by language if present on the machine
  if (want.startsWith("it")) {
    if (/sonia/i.test(name)) score += 40;
    if (/elsa/i.test(name)) score += 20;
    if (/cosimo/i.test(name)) score += 20;
  }

  if (want.startsWith("en")) {
    if (/hazel/i.test(name)) score += 40; // common en-GB
    if (/sonia/i.test(name)) score += 10; // sometimes installed as en voice on some systems
    if (/susan/i.test(name)) score += 20;
    if (/george/i.test(name)) score += 20;
    if (/ryan|jenny|aria|guy/i.test(name)) score += 10;
  }

  // Avoid obvious low quality voices if they exist
  if (/espeak|festival/i.test(name)) score -= 80;

  return score;
}

function pickVoice(lang) {
  _capiscoLoadVoicesOnce();

  const voices = _capiscoVoiceCache.voices || [];
  const want = String(lang || "").trim();
  if (!want) return null;

  const wantLower = want.toLowerCase();
  const wantPrefix = wantLower.split("-")[0];

  const candidates = voices.filter((v) => {
    const vLang = String(v?.lang || "").toLowerCase();
    return vLang === wantLower || vLang.startsWith(wantPrefix);
  });

  if (!candidates.length) return null;

  let best = candidates[0];
  let bestScore = _capiscoScoreVoice(best, wantLower);

  for (let i = 1; i < candidates.length; i += 1) {
    const s = _capiscoScoreVoice(candidates[i], wantLower);
    if (s > bestScore) {
      best = candidates[i];
      bestScore = s;
    }
  }

  return best || null;
}

/* __END_SPEECH_PICKVOICE_R181__ */

/* __START_NORMALIZE_CARD_R030__ */

function normalizeCard(raw) {
  if (!raw) return {};

  const rawType = String(raw.type || raw.kind || "").toLowerCase();
  const looksLikeSentence =
    rawType === "sentence" || rawType === "expression" || rawType === "phrase";

  const hasHeadword = !!raw.headword;
  const hasForms = !!raw.forms;
  const hasExamplesArray = Array.isArray(raw.examples);

  const isCanonicalLike = hasHeadword && (hasForms || looksLikeSentence);

  if (isCanonicalLike) {
    const headwordRaw = raw.headword || {};
    const formsRaw = raw.forms || {};

    // Sentence cards in this repo use headword.target/native
    const sentenceIt = String(
      headwordRaw.it || headwordRaw.target || formsRaw.canonical || ""
    ).trim();

    const sentenceEn = String(
      headwordRaw.en || headwordRaw.native || raw.meaning?.primary || ""
    ).trim();

    const headword = looksLikeSentence
      ? {
          it: sentenceIt,
          en: sentenceEn,
          partOfSpeech: headwordRaw.partOfSpeech || "phrase",
          register: headwordRaw.register || "neutral",
        }
      : {
          ...headwordRaw,
        };

    const normalizedForms = looksLikeSentence
      ? {
          canonical: String(formsRaw.canonical || sentenceIt || "").trim(),
          singular: String(formsRaw.singular || formsRaw.canonical || sentenceIt || "").trim(),
          plural: "",
          variants: Array.isArray(formsRaw.variants) ? formsRaw.variants : [],
        }
      : {
          canonical: formsRaw.canonical || "",
          singular: formsRaw.singular || "",
          plural: formsRaw.plural || "",
          variants: Array.isArray(formsRaw.variants) ? formsRaw.variants : [],
        };

    // Unify tagging across vocab + sentence cards
    const outTags =
      raw.tags && typeof raw.tags === "object" && !Array.isArray(raw.tags) ? { ...raw.tags } : {};

    // Sentence JSON shape: level + lemmaId + tags[]
    if (looksLikeSentence) {
      if (raw.level && !outTags.level) outTags.level = String(raw.level);
      if (raw.lemmaId && !outTags.id) outTags.id = String(raw.lemmaId);

      if (Array.isArray(raw.tags) && raw.tags.length && !outTags.category) {
        outTags.category = String(raw.tags[0] || "");
      }
    }

    // Allow metadata.tags[0] as a fallback category
    if (!outTags.category && Array.isArray(raw.metadata?.tags) && raw.metadata.tags.length) {
      outTags.category = String(raw.metadata.tags[0] || "");
    }

    return {
      id: raw.id || headword.it || "",
      type: raw.type || raw.kind || "vocab",

      // Your JSON has lang.target like "it-IT" and language like "it"
      language: raw.language || raw.lang?.target || "it",

      headword: headword,
      forms: normalizedForms,

      pronunciation: raw.pronunciation || {},
      meaning: raw.meaning || (looksLikeSentence && sentenceEn ? { primary: sentenceEn } : {}),

      examples: hasExamplesArray ? raw.examples : [],

      grammar: raw.grammar || {},
      etymology: raw.etymology || {},
      relations: raw.relations || {},

      media: raw.media || null,
      images: raw.images || null,

      quizSeeds: raw.quizSeeds || null,
      metadata: raw.metadata || {},
      legacyIcon: raw.legacyIcon || "",
      legacyRelated: Array.isArray(raw.legacyRelated) ? raw.legacyRelated : [],
      placeholders: raw.placeholders || null,

      tags: outTags,
    };
  }

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
    examples: [{ it: legacy.examples?.it || "", en: legacy.examples?.en || "" }],
    grammar: {},
    etymology: { noteHtml: legacy.word?.etymology?.html || "" },
    relations: { related: Array.isArray(legacy.related) ? legacy.related.map((r) => r.it) : [] },
    legacyIcon: legacy.word?.icon || "",
    legacyRelated: Array.isArray(legacy.related) ? legacy.related : [],
    placeholders: legacy.placeholders || null,
    tags: legacy.tags || null,

    images: legacy.images || null,
    media: legacy.media || legacy.images || null,

    quizSeeds: legacy.quizSeeds || null,
    metadata: legacy.metadata || {},
  };
}

/* __END_NORMALIZE_CARD_R030__ */

/* __START_RENDER_ONE_CARD_R100__ */

window.CapiscoSeasonsCard.render = function renderSeasonsCard(container, rawCardData) {
  if (!container) throw new Error("renderSeasonsCard: container is required");
  if (!rawCardData) throw new Error("renderSeasonsCard: cardData is required");

  const cardData = normalizeCard(rawCardData);
  const isSentenceCard = isSentenceType(cardData?.type);

  /* __START_TEMPLATE_HTML_R111__ */

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

      <div class="tab-section hidden" data-section="examples"></div>

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

  /* __END_TEMPLATE_HTML_R111__ */

  container.appendChild(template.content.cloneNode(true));

  const root = container.lastElementChild;
  const card = root.querySelector(".card");

  /* __START_HEADER_WORDS_R121__ */

  const itText = String(cardData?.headword?.it || "").trim();
  const enText = String(cardData?.headword?.en || cardData?.meaning?.primary || "").trim();

  root.querySelector(".wg-word").textContent = itText || "";
  root.querySelector(".word-label-icon").textContent = "";

  const itEl = root.querySelector(".word-it");
  itEl.textContent = itText;
  itEl.setAttribute("data-say", itText);

  const enEl = root.querySelector(".word-en");
  enEl.textContent = enText;
  enEl.setAttribute("data-say", enText);

  const dotEl = root.querySelector(".dot");
  const genderEl = root.querySelector(".gender");

  if (isSentenceCard) {
    if (dotEl) dotEl.style.display = "none";
    if (genderEl) genderEl.textContent = "";

    itEl.style.display = "block";
    enEl.style.display = "block";
    enEl.style.marginTop = "6px";
  } else {
    if (dotEl) dotEl.style.display = "";
    if (genderEl) {
      genderEl.textContent = cardData.headword.gender ? `(${cardData.headword.gender})` : "";
    }
    itEl.style.display = "";
    enEl.style.display = "";
    enEl.style.marginTop = "";
  }

  /* __END_HEADER_WORDS_R121__ */

  /* __START_TAG_PILLS_R123__ */

  const rawTags = cardData.tags;

  // typeof null === "object", so guard rawTags truthiness first
  const tagsObj =
    rawTags && typeof rawTags === "object" && !Array.isArray(rawTags) ? rawTags : null;

  const tagsArr = Array.isArray(rawTags) ? rawTags : null;

  const level = String(tagsObj?.level || cardData.level || cardData.metadata?.difficulty || "").trim();

  const idPill = String(
    tagsObj?.id ||
      cardData.metadata?.rankId ||
      cardData.lemmaId ||
      (cardData.sense?.id ? `sense-${cardData.sense.id}` : "") ||
      ""
  ).trim();

  const catPill = String(
    tagsObj?.category ||
      (tagsArr && tagsArr.length ? tagsArr[0] : "") ||
      (Array.isArray(cardData.metadata?.tags) && cardData.metadata.tags.length
        ? cardData.metadata.tags[0]
        : "") ||
      ""
  ).trim();

  root.querySelector(".tag-level").textContent = level;
  root.querySelector(".tag-id").textContent = idPill;
  root.querySelector(".tag-cat").textContent = catPill;

  /* __END_TAG_PILLS_R123__ */

  /* __START_MEDIA_SLOT_R124__ */

  (function wireCardMediaSlot() {
    const slot = root.querySelector(".card-image");
    const iconCircle = root.querySelector(".icon-circle");

    let chosen = null;

    const fromImages = pickMedia(cardData);
    if (fromImages) {
      chosen = fromImages;
    } else if (
      cardData &&
      cardData.media &&
      Array.isArray(cardData.media.canonical) &&
      cardData.media.canonical.length > 0
    ) {
      chosen = cardData.media.canonical[0];
    } else if (cardData && cardData.media && cardData.media.fallback) {
      chosen = cardData.media.fallback;
    }

    window.__capisco_firstImageEagerUsed = window.__capisco_firstImageEagerUsed || 0;
    const chosenSrc = chosen ? (chosen.src || chosen.url || chosen.href || chosen.path || "") : "";
    const canEager = !!chosenSrc && window.__capisco_firstImageEagerUsed === 0;

    const html = chosen
      ? renderCardMediaHtml(chosen, {
          loading: canEager ? "eager" : "lazy",
          fetchPriority: canEager ? "high" : "auto",
        })
      : "";

    if (canEager) window.__capisco_firstImageEagerUsed += 1;

    slot.innerHTML = html;

    const mediaRoot = slot.querySelector(".capisco-card-media");
    if (!mediaRoot) {
      slot.classList.add("hidden");
      if (iconCircle) iconCircle.classList.remove("hidden");
      return;
    }

    slot.classList.remove("hidden");
    if (iconCircle) iconCircle.classList.add("hidden");

    slot.style.borderRadius = "20px";
    slot.style.overflow = "hidden";

    const img = mediaRoot.querySelector("img.capisco-card-image");
    if (img) {
      img.style.setProperty("object-fit", "contain", "important");
      img.style.setProperty("object-position", "center", "important");
      img.style.setProperty("border-radius", "0", "important");
    }
  })();

  /* __END_MEDIA_SLOT_R124__ */

/* __START_OVERVIEW_FORMS_R131__ */

const overview = root.querySelector('.tab-section[data-section="overview"]');
const rows = overview ? Array.from(overview.querySelectorAll(".row")) : [];
const labels = overview ? Array.from(overview.querySelectorAll(".row .row-label")) : [];

// Rows in template order:
// 0: Singular (Phrase for sentence)
// 1: Plural
// 2: Pronunciation
// 3: Etymology (Notes for sentence)
const rowPhrase = rows[0] || null;
const rowPlural = rows[1] || null;
const rowPron = rows[2] || null;
const rowNotes = rows[3] || null;

if (labels[0]) labels[0].textContent = isSentenceCard ? "Phrase:" : "Singular:";
if (labels[3]) labels[3].textContent = isSentenceCard ? "Notes:" : "Etymology:";

// Plural row: do not rely on CSS ".hidden" for rows
if (rowPlural) rowPlural.style.display = isSentenceCard ? "none" : "";

// Phrase / singular value
const singEl = root.querySelector(".value-singular");
const singularText = isSentenceCard ? itText : String(cardData.forms?.singular || "");
if (singEl) {
  singEl.textContent = singularText;
  singEl.setAttribute("data-say", singularText);
}

// Plural value
const plEl = root.querySelector(".value-plural");
const pluralText = isSentenceCard ? "" : String(cardData.forms?.plural || "");
if (plEl) {
  plEl.textContent = pluralText;
  plEl.setAttribute("data-say", pluralText);
}

// Pronunciation row visibility
if (rowPron) {
  const pronReadable = String(cardData.pronunciation?.readable || "");
  const pronIpa = String(cardData.pronunciation?.ipa || "");
  const tooLong = isSentenceCard && itText.length > 28;

  if (tooLong && !pronReadable && !pronIpa) rowPron.style.display = "none";
  else rowPron.style.display = "";
}

root.querySelector(".pron-readable").textContent = String(cardData.pronunciation?.readable || "");
root.querySelector(".ipa").textContent = String(cardData.pronunciation?.ipa || "");

// Sentence cards: add a compact Examples row into Overview
if (overview) {
  let overviewExamplesRow = overview.querySelector(".row-overview-examples");

  if (isSentenceCard) {
    if (!overviewExamplesRow) {
      overviewExamplesRow = document.createElement("div");
      overviewExamplesRow.className = "row row-overview-examples";

      const label = document.createElement("div");
      label.className = "row-label";
      label.textContent = "Examples:";

      const body = document.createElement("div");
      body.className = "overview-examples";

      overviewExamplesRow.appendChild(label);
      overviewExamplesRow.appendChild(body);

      // Put examples just before Notes
      if (rowNotes) overview.insertBefore(overviewExamplesRow, rowNotes);
      else overview.appendChild(overviewExamplesRow);
    }

    const body = overviewExamplesRow.querySelector(".overview-examples");
    if (body) body.innerHTML = "";

    const examples = Array.isArray(cardData.examples) ? cardData.examples : [];
    const usable = examples
      .map((ex) => ({
        it: String(ex?.it || "").trim(),
        en: String(ex?.en || "").trim(),
      }))
      .filter((ex) => ex.it || ex.en)
      .slice(0, 4);

    if (!usable.length) {
      overviewExamplesRow.style.display = "none";
    } else {
      overviewExamplesRow.style.display = "";

      usable.forEach((ex) => {
        const item = document.createElement("div");
        item.className = "overview-example";

        const itLine = document.createElement("div");
        itLine.className = "overview-example-it";
        itLine.setAttribute("data-lang", "it-IT");
        itLine.textContent = ex.it;
        if (ex.it) itLine.setAttribute("data-say", ex.it);

        const enLine = document.createElement("div");
        enLine.className = "overview-example-en";
        enLine.setAttribute("data-lang", "en-GB");
        enLine.textContent = ex.en;
        if (ex.en) enLine.setAttribute("data-say", ex.en);

        item.appendChild(itLine);
        item.appendChild(enLine);

        overviewExamplesRow.querySelector(".overview-examples").appendChild(item);
      });
    }
  } else {
    // Non sentence cards: remove or hide that injected row if it exists
    if (overviewExamplesRow) overviewExamplesRow.remove();
  }
}

/* __END_OVERVIEW_FORMS_R131__ */


  /* __START_ETYMOLOGY_RENDER_R133__ */

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

  /* __END_ETYMOLOGY_RENDER_R133__ */

  /* __START_EXAMPLES_RENDER_R141__ */

  const examplesSection = root.querySelector('.tab-section[data-section="examples"]');
  if (examplesSection) {
    examplesSection.innerHTML = "";

    const examples = Array.isArray(cardData.examples) ? cardData.examples : [];
    const usable = examples.filter((ex) => {
      const it = (ex?.it || "").trim();
      const en = (ex?.en || "").trim();
      return it || en;
    });

    if (!usable.length) {
      const empty = document.createElement("div");
      empty.className = "tab-placeholder examples";
      empty.textContent = isSentenceCard ? "No similar sentences yet." : "No examples available yet.";
      examplesSection.appendChild(empty);
    } else {
      usable.forEach((ex, idx) => {
        const bar = document.createElement("div");
        bar.className = "example-bar";

        const label = document.createElement("span");
        label.className = "example-label";

        if (isSentenceCard) {
          label.textContent = usable.length > 1 ? `Similar ${idx + 1}:` : "Similar:";
        } else {
          label.textContent = usable.length > 1 ? `Example ${idx + 1}:` : "Example:";
        }

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

  /* __END_EXAMPLES_RENDER_R141__ */

  /* __START_GRAMMAR_QUIZ_RENDER_R151__ */

  const grammarTab = root.querySelector('.tab[data-tab="grammar"]');
  const quizTab = root.querySelector('.tab[data-tab="quiz"]');

  const grammarBox = root.querySelector('.tab-section[data-section="grammar"] .tab-placeholder.grammar');
  const quizBox = root.querySelector('.tab-section[data-section="quiz"] .tab-placeholder.quiz');

  let grammarRendered = false;

  if (grammarBox) {
    const notes = String(cardData.grammar?.notes || "").trim();
    const patterns = Array.isArray(cardData.grammar?.patterns)
      ? cardData.grammar.patterns.map((x) => String(x || "").trim()).filter(Boolean)
      : [];
    const exceptions = Array.isArray(cardData.grammar?.exceptions)
      ? cardData.grammar.exceptions.map((x) => String(x || "").trim()).filter(Boolean)
      : [];

    const hasStructured = !!notes || patterns.length > 0 || exceptions.length > 0;
    const hasPlaceholder =
      typeof cardData.placeholders?.grammar === "string" &&
      cardData.placeholders.grammar.trim().length > 0;

    if (hasStructured) {
      const parts = [];

      if (notes) {
        parts.push(`
          <div class="grammar-block">
            <div class="grammar-title">Notes</div>
            <div class="grammar-text">${notes}</div>
          </div>
        `);
      }

      if (patterns.length) {
        parts.push(`
          <div class="grammar-block">
            <div class="grammar-title">Patterns</div>
            <ul class="grammar-list">
              ${patterns.map((p) => `<li>${p}</li>`).join("")}
            </ul>
          </div>
        `);
      }

      if (exceptions.length) {
        parts.push(`
          <div class="grammar-block">
            <div class="grammar-title">Exceptions</div>
            <ul class="grammar-list">
              ${exceptions.map((e) => `<li>${e}</li>`).join("")}
            </ul>
          </div>
        `);
      }

      grammarBox.innerHTML = parts.join("");
      grammarRendered = true;
    } else if (hasPlaceholder) {
      grammarBox.innerHTML = cardData.placeholders.grammar;
      grammarRendered = true;
    } else {
      grammarBox.textContent = "No grammar notes yet.";
    }
  }

  if (!grammarRendered && grammarTab) {
    grammarTab.style.display = "none";
  }

  let quizRendered = false;

  if (quizBox) {
    const seeds = cardData.quizSeeds && typeof cardData.quizSeeds === "object" ? cardData.quizSeeds : null;

    const hasPlaceholder =
      typeof cardData.placeholders?.quiz === "string" &&
      cardData.placeholders.quiz.trim().length > 0;

    if (seeds) {
      const enabled = [];
      if (seeds.recognition) enabled.push("Recognition");
      if (seeds.recall) enabled.push("Recall");
      if (seeds.production) enabled.push("Production");

      const distractors = Array.isArray(seeds.distractors)
        ? seeds.distractors.map((x) => String(x || "").trim()).filter(Boolean)
        : [];

      const parts = [];
      parts.push(`<div class="quiz-lead">This card supports the following quiz modes:</div>`);
      parts.push(`<div class="quiz-modes">${enabled.length ? enabled.join(", ") : "-"}</div>`);

      if (distractors.length) {
        parts.push(`<div class="quiz-distractors"><strong>Distractors:</strong> ${distractors.join(", ")}</div>`);
      }

      quizBox.innerHTML = parts.join("");
      quizRendered = true;
    } else if (hasPlaceholder) {
      quizBox.innerHTML = cardData.placeholders.quiz;
      quizRendered = true;
    } else {
      quizBox.textContent = "No quiz available yet.";
    }
  }

  if (!quizRendered && quizTab) {
    quizTab.style.display = "none";
  }

  /* __END_GRAMMAR_QUIZ_RENDER_R151__ */

  /* __START_RELATED_RENDER_R161__ */

  const relatedSection = root.querySelector('.tab-section[data-section="related"]');
  const relatedList = root.querySelector(".related-row-list");
  if (relatedList) relatedList.innerHTML = "";

  function renderRelationGroup(labelText, items) {
    const clean = Array.isArray(items)
      ? items.map((x) => String(x || "").trim()).filter(Boolean)
      : [];

    if (!clean.length) return;

    const wrap = document.createElement("div");
    wrap.className = "related-row";

    const label = document.createElement("span");
    label.className = "related-label";
    label.textContent = `${labelText}:`;

    const list = document.createElement("div");
    list.className = "related-row-list";

    clean.forEach((w) => {
      const span = document.createElement("span");
      span.textContent = w;
      span.setAttribute("data-lang", "it-IT");
      span.setAttribute("data-say", w);
      list.appendChild(span);
    });

    wrap.appendChild(label);
    wrap.appendChild(list);

    if (relatedSection) relatedSection.appendChild(wrap);
    else if (relatedList) relatedList.appendChild(wrap);
  }

  if (Array.isArray(cardData.legacyRelated) && cardData.legacyRelated.length) {
    if (relatedList) relatedList.innerHTML = "";

    cardData.legacyRelated.forEach((r) => {
      const text = r && r.it ? (r.emoji ? `${r.it} ${r.emoji}` : r.it) : "";
      if (!text) return;

      const span = document.createElement("span");
      span.textContent = text;
      span.setAttribute("data-lang", "it-IT");
      span.setAttribute("data-say", r.it);
      relatedList.appendChild(span);
    });
  } else {
    const relObj = cardData.relations && typeof cardData.relations === "object" ? cardData.relations : {};

    if (relatedSection) {
      relatedSection.innerHTML = `
        <div class="related-row">
          <span class="related-label">Related:</span>
          <div class="related-row-list"></div>
        </div>
      `;
    }

    const hasAny = Object.keys(relObj).some(
      (k) => Array.isArray(relObj[k]) && relObj[k].some((x) => String(x || "").trim())
    );

    if (!hasAny) {
      if (relatedSection) {
        relatedSection.innerHTML = `<div class="tab-placeholder related">No related items available yet.</div>`;
      } else if (relatedList) {
        const span = document.createElement("span");
        span.textContent = "No related items available yet.";
        relatedList.appendChild(span);
      }
    } else {
      renderRelationGroup("Related", relObj.related);
      renderRelationGroup("Synonyms", relObj.synonyms);
      renderRelationGroup("Antonyms", relObj.antonyms);
      renderRelationGroup("Collocations", relObj.collocations);
      renderRelationGroup("Expressions", relObj.expressions);
      renderRelationGroup("Themes", relObj.themes);
      renderRelationGroup("Semantic", relObj.semantic);
      renderRelationGroup("Phonetic", relObj.phonetic);
      renderRelationGroup("Contrasts", relObj.contrasts);
      renderRelationGroup("Forms", relObj.forms);
      renderRelationGroup("Lemma", relObj.lemma);
      renderRelationGroup("Grammar", relObj.grammar);
    }
  }

  /* __END_RELATED_RENDER_R161__ */

  /* __START_TABS_WIRING_R171__ */

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

  /* __END_TABS_WIRING_R171__ */

  /* __START_SPEECH_SAY_R182__ */

  const say = (text, lang) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (lang) u.lang = lang;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  };

  /* __END_SPEECH_SAY_R182__ */

  /* __START_SPEECH_BINDINGS_R183__ */

  root.querySelectorAll("[data-say]").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      say(el.getAttribute("data-say"), el.getAttribute("data-lang"))
    );
    el.addEventListener("click", () =>
      say(el.getAttribute("data-say"), el.getAttribute("data-lang"))
    );
  });

  /* __END_SPEECH_BINDINGS_R183__ */
};

/* __END_RENDER_ONE_CARD_R100__ */

/* __START_RENDER_MANY_CARDS_R190__ */

window.CapiscoSeasonsCard.renderMany = function renderMany(container, cards) {
  if (!container) throw new Error("renderMany: container is required");
  if (!Array.isArray(cards)) throw new Error("renderMany: cards[] is required");
  cards.forEach((c) => window.CapiscoSeasonsCard.render(container, c));
};

/* __END_RENDER_MANY_CARDS_R190__ */
