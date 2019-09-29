({
  /** Function called when theme layout is initialized. */
  doInit: function(component, event, helper) {
    // Declare the global namespace of the library.
    window.ExampleLibrary = window.ExampleLibrary || {};

    // Create a promise that components can use to wait for the library to be loaded.
    window.ExampleLibrary.loaded = new Promise(resolve => {
      component.exampleLibraryLoaded = resolve;
    });
  },

  /** Function called when library script has been loaded. */
  afterScriptsLoaded: function(component, event, helper) {
    // Configure the libary with settings provided on the theme layout.
    window.ExampleLibrary.config({
      configValue: component.get("v.configValue")
    });

    // Signal that the library is ready to use.
    component.exampleLibraryLoaded();
  }
});
