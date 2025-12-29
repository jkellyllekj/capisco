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
    <!-- markup will be injected here later -->
  `;

  const node = template.content.cloneNode(true);
  container.appendChild(node);
};
