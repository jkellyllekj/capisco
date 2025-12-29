/**
 * Seasons Card – render helper (vanilla)
 *
 * Phase 3.2:
 * - Add renderMany(container, cards[])
 * - render(container, cardData) unchanged
 */

window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};

/**
 * Render ONE card
 * @param {HTMLElement} container
 * @param {Object} cardData
 */
window.CapiscoSeasonsCard.render = function renderSeasonsCard(container, cardData) {
  if (!container) throw new Error("renderSeasonsCard: container is required");
  if (!cardData) throw new Error("renderSeasonsCard: cardData is required");

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
          <span class="related-label">Other seasons:</span>
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

  // Header
  root.querySelector(".wg-word").textContent = cardData.word.it;
  root.querySelector(".word-label-icon").textContent = cardData.word.icon;

  root.querySelector(".word-it").textContent = cardData.word.it;
  root.querySelector(".word-it").setAttribute("data-say", cardData.word.it);

  root.querySelector(".word-en").textContent = cardData.word.en;
  root.querySelector(".word-en").setAttribute("data-say", cardData.word.en);

  root.querySelector(".gender").textContent = `(${cardData.word.gender})`;
  root.querySelector(".tag-level").textContent = cardData.tags.level;
  root.querySelector(".tag-id").textContent = cardData.tags.id;
  root.querySelector(".tag-cat").textContent = cardData.tags.category;
  root.querySelector(".icon-circle").textContent = cardData.word.icon;

  // Overview
  root.querySelector(".value-singular").textContent = cardData.word.singular;
  root.querySelector(".value-singular").setAttribute("data-say", cardData.word.singular);

  root.querySelector(".value-plural").textContent = cardData.word.plural;
  root.querySelector(".value-plural").setAttribute("data-say", cardData.word.plural);

  root.querySelector(".pron-readable").textContent = cardData.word.pronunciation.readable;
  root.querySelector(".ipa").textContent = cardData.word.pronunciation.ipa;

  root.querySelector(".etymology").innerHTML = cardData.word.etymology.html;

  // Examples
  const exIt = root.querySelector(".example-it");
  exIt.textContent = cardData.examples.it;
  exIt.setAttribute("data-say", cardData.examples.it);

  const exEn = root.querySelector(".example-en");
  exEn.textContent = cardData.examples.en;
  exEn.setAttribute("data-say", cardData.examples.en);

  // Grammar / Quiz
  root.querySelector(".grammar").innerHTML = cardData.placeholders.grammar;
  root.querySelector(".quiz").innerHTML = cardData.placeholders.quiz;

  // Related
  const relatedList = root.querySelector(".related-row-list");
  cardData.related.forEach((r) => {
    const span = document.createElement("span");
    span.textContent = `${r.it} ${r.emoji}`;
    span.setAttribute("data-lang", "it-IT");
    span.setAttribute("data-say", r.it);
    relatedList.appendChild(span);
  });

  // Tabs
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

  // Speech
  const pickVoice = (lang) => {
    const voices = window.speechSynthesis.getVoices();
    const l = (lang || "").toLowerCase();
    if (l.startsWith("it")) return voices.find(v => v.lang.startsWith("it")) || null;
    if (l.startsWith("en")) return voices.find(v => v.lang.startsWith("en")) || null;
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
 * @param {HTMLElement} container
 * @param {Array<Object>} cards
 */
window.CapiscoSeasonsCard.renderMany = function renderMany(container, cards) {
  if (!container) throw new Error("renderMany: container is required");
  if (!Array.isArray(cards)) throw new Error("renderMany: cards[] is required");

  cards.forEach((cardData) => {
    window.CapiscoSeasonsCard.render(container, cardData);
  });
};
