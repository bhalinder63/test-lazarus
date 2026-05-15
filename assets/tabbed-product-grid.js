import { Component } from '@theme/component';

/**
 * Tabbed product grid component
 *
 * Handles tab switching to show/hide product grid panels.
 * Follows WAI-ARIA Tabs pattern with keyboard navigation.
 *
 * @typedef {Object} Refs
 * @property {HTMLElement[]} tabs - Tab button elements
 * @property {HTMLElement[]} panels - Tab panel elements
 *
 * @extends {Component<Refs>}
 */
class TabbedProductGrid extends Component {
  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', this.#handleClick);
    this.addEventListener('keydown', this.#handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /** @returns {HTMLElement[]} */
  get tabs() {
    return [...this.querySelectorAll('[role="tab"]')];
  }

  /** @returns {HTMLElement[]} */
  get panels() {
    return [...this.querySelectorAll('[role="tabpanel"]')];
  }

  /** @returns {number} */
  get activeIndex() {
    return this.tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
  }

  /**
   * Select a tab by index
   *
   * @param {number} index
   */
  #selectTab(index) {
    const { tabs, panels } = this;
    const clampedIndex = Math.max(0, Math.min(index, tabs.length - 1));

    for (const [i, tab] of tabs.entries()) {
      const isSelected = i === clampedIndex;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    }

    for (const [i, panel] of panels.entries()) {
      panel.hidden = i !== clampedIndex;
    }
  }

  /**
   * Handle click events on tab buttons
   *
   * @param {MouseEvent} event
   */
  #handleClick = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;

    const index = this.tabs.indexOf(tab);
    if (index === -1) return;

    this.#selectTab(index);
  };

  /**
   * Handle keyboard navigation for tabs
   *
   * @param {KeyboardEvent} event
   */
  #handleKeydown = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) return;

    const { tabs, activeIndex } = this;
    let newIndex = activeIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (activeIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = (activeIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    this.#selectTab(newIndex);
    tabs[newIndex]?.focus();
  };
}

if (!customElements.get('tabbed-product-grid')) {
  customElements.define('tabbed-product-grid', TabbedProductGrid);
}
