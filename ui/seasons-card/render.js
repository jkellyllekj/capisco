/**
 * Seasons Card – render helper (vanilla, not wired)
 *
 * Phase 2 (step 3):
 * - Pronunciation line is data-driven
 * - Header + singular/plural already data-driven
 * - No layout or behaviour changes
 */

window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};

window.CapiscoSeasonsCard.render = function renderSeasonsCard(container) {
  if (!container) {
    throw new Error("renderSeasonsCard: container is required");
  }

  // ============================
  // Phase 2: data
  // ============================
  const cardData = {
    word: {
      it: "stagione",
      en: "season",
      gender: "f",
      icon: "🌀",
      singular: "stagione",
      plural: "stagioni",
      pronunciation: {
        readable: "sta-JO-ne",
        ipa: "[staˈd͡ʒoːne]",
      },
    },
    tags: {
      level: "A2",
      id: "#1482",
      category: "Seasons",
    },
  };

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
      <!-- Overview -->
      <div class="tab-section" data-section="overview">
        <div class="row">
          <div class="row-label">Singular:</div>
          <div>
            <span class="value-singular" data-lang="it-IT"></span>
          </div>
        </div>

        <div class="row">
          <div class="row-label">Plural:</div>
          <div>
            <span class="value-plural" data-lang="it-IT"></span>
          </div>
        </div>

        <div class="row">
          <div class="row-label">Pronunciation:</div>
          <div>
            <span class="pron-readable"></span>
            <span class="ipa"></span>
          </div>
        </div>

        <div class="row">
          <div class="row-label">Etymology:</div>
          <div>
            From Latin <em>statio</em> — “a fixed position or period.”
          </div>
        </div>
      </div>

      <!-- Examples -->
      <div class="tab-section hidden" data-section="examples">
        <div class="example-bar">
          <span class="example-label">Example:</span>
          <div class="example-text-block">
            <div
              class="example-it"
              data-lang="it-IT"
              data-say="La mia stagione preferita è l'autunno."
            >
              La mia stagione preferita è l'autunno.
            </div>
            <div
              class="example-en"
              data-lang="en-GB"
              data-say="My favourite season is autumn."
            >
              My favourite season is autumn.
            </div>
          </div>
        </div>
      </div>

      <!-- Grammar -->
      <div class="tab-section hidden" data-section="grammar">
        <div class="tab-placeholder">
          Grammar breakdown for <strong>stagione</strong> coming soon.
        </div>
      </div>

      <!-- Related -->
      <div class="tab-section hidden" data-section="related">
        <div class="related-row">
          <span class="related-label">Other seasons:</span>
          <div class="related-row-list">
            <span data-lang="it-IT" data-say="primavera">primavera 🌼</span>
            <span data-lang="it-IT" data-say="estate">estate ☀️</span>
            <span data-lang="it-IT" data-say="autunno">autunno 🍂</span>
            <span data-lang="it-IT" data-say="inverno">inverno ❄️</span>
          </div>
        </div>
      </div>

      <!-- Quiz -->
      <div class="tab-section hidden" data-section="quiz">
        <div class="tab-placeholder">
          Quiz for <strong>stagione</strong> coming soon.
        </div>
      </div>
    </div>
  </article>
</section>
`;

  const node = template.content.cloneNode(true);
  container.appendChild(node);

  const root = container.lastElementChild;
  const card = root.querySelector(".card");

  // ============================
  // Apply data → header
  // ============================
  root.querySelector(".wg-word").textContent = cardData.word.it;
  root.querySelector(".word-label-icon").textContent = cardData.word.icon;

  const itEl = root.querySelector(".word-it");
  itEl.textContent = cardData.word.it;
  itEl.setAttribute("data-say", cardData.word.it);

  const enEl = root.querySelector(".word-en");
  enEl.textContent = cardData.word.en;
  enEl.setAttribute("data-say", cardData.word.en);

  root.querySelector(".gender").textContent = `(${cardData.word.gender})`;
  root.querySelector(".tag-level").textContent = cardData.tags.level;
  root.querySelector(".tag-id").textContent = cardData.tags.id;
  root.querySelector(".tag-cat").textContent = cardData.tags.category;
  root.querySelector(".icon-circle").textContent = cardData.word.icon;

  // ============================
  // Apply data → singular / plural
  // ============================
  const sEl = root.querySelector(".value-singular");
  sEl.textContent = cardData.word.singular;
  sEl.setAttribute("data-say", cardData.word.singular);

  const pEl = root.querySelector(".value-plural");
  pEl.textContent = cardData.word.plural;
  pEl.setAttribute("data-say", cardData.word.plural);

  // ============================
  // Apply data → pronunciation
  // ============================
  root.querySelector(".pron-readable").textContent =
    cardData.word.pronunciation.readable;

  root.querySelector(".ipa").textContent =
    cardData.word.pronunciation.ipa;

  // ============================
  // Tabs (unchanged)
  // ============================
  const tabs = card.querySelectorAll(".tab");
  const sections = card.querySelectorAll(".tab-section");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-tab");
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      sections.forEach((sec) => {
        sec.classList.toggle(
          "hidden",
          sec.getAttribute("data-section") !== key
        );
      });
    });
  });

  // ============================
  // Speech (unchanged)
  // ============================
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
