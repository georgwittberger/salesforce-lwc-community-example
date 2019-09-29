(window => {
  /** Declare the global namespace. */
  window.ExampleLibrary = window.ExampleLibrary || {};

  /** Extend the namespace with properties and methods. */
  window.ExampleLibrary = {
    ...window.ExampleLibrary,

    /** Configuration parameter to be set after library has been loaded. */
    configValue: null,

    /**
     * Configure the libary with the given parameters.
     * @param {object} options Configuration parameters.
     */
    config(options) {
      this.configValue = options.configValue;
    },

    /**
     * Insert generated HTML content into the given element.
     * @param {string} input Library input parameter.
     * @param {HTMLElement} element Element to render the generated content.
     * @returns {Promise} Resolves once the content has been inserted.
     */
    async insertContent(input, element) {
      /** Generate and insert the HTML content. */
      const html = `<p>Library content for input "${input}" and configuration "${this.configValue}"</p>`;
      element.insertAdjacentHTML("beforeend", html);

      /** Dispatch a custom event which bubbles up the DOM tree. */
      const event = new CustomEvent("custom_event", {
        bubbles: true,
        composed: true,
        detail: input
      });
      element.dispatchEvent(event);
      console.info(
        `Dispatched custom event from internal library. Detail: ${event.detail}`
      );
    }
  };
})(window);

console.info("Internal library has been loaded.");
