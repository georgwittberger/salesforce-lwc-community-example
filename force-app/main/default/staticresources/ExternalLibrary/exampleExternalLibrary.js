/** Listen to the custom events dispatched from the internal library. */
document.addEventListener("custom_event", event => {
  console.info(
    `Received custom event in external library. Detail: ${event.detail}`
  );
});

console.info("External library has been loaded.");
