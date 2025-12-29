/**
 * Seasons Card – render helper (vanilla, not wired)
 *
 * Purpose:
 * - Clone the static markup for one Seasons card
 * - Append it into a provided container
 *
 * This file does NOT:
 * - attach event handlers
 * - load CSS
 * - assume any module system
 * - get called anywhere yet
 */

window.CapiscoSeasonsCard = window.CapiscoSeasonsCard || {};

window.CapiscoSeasonsCard.render = function renderSeasonsCard(container) {
  if (!container) {
    throw new Error("renderSeasonsCard: container is required");
  }

  const template = document.createElement("template");
  template.innerHTML = `
    <!-- Seasons Card — static markup reference (stagione) -->

    <section class="word-group">
      <h2 class="word-group-title">
        stagione <span class="word-label-icon">🌀</span>
      </h2>

      <article class="card">
        <header class="card-header">
          <div>
            <div class="card-title-line">
              <span data-say="stagione" data-lang="it-IT">stagione</span>
              <span class="dot">·</span>
              <span class="translation" data-say="season" data-lang="en-GB">
                season
              </span>
              <span class="gender">(f)</span>
            </div>

            <div class="tag-row">
              <span class="tag-pill tag-level">A2</span>
              <span class="tag-pill tag-id">#1482</span>
              <span class="tag-pill tag-cat">Seasons</span>
            </div>
          </div>

          <div class="icon-circle">🌀</div>
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
                <span data-lang="it-IT" data-say="stagione">stagione</span>
              </div>
            </div>

            <div class="row">
              <div class="row-label">Plural:</div>
              <div>
                <span data-lang="it-IT" data-say="stagioni">stagioni</span>
              </div>
            </div>

            <div class="row">
              <div class="row-label">Pronunciation:</div>
              <div>
                sta-JO-ne <span class="ipa">[staˈd͡ʒoːne]</span>
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
};
