/**
 * main.js
 *
 * The main entry point for the application.
 * It initializes all modules in the correct order to start the application.
 */

document.addEventListener('DOMContentLoaded', () => {

    const App = {
        init() {
            console.log("Application starting...");

            // 1. Initialize the central state store first.
            Store.init();

            // 2. Initialize all feature modules.
            ListRenderer.init();
            TabColorHandler.init();
            ThemeHandler.init();      // New simple theme handler
            SplitterHandler.init();   // New draggable splitter handler
            ColorHandler.init();
            DndHandler.init();
            ListInteractions.init();

            console.log("Application initialized and all modules are active.");
        }
    };

    // Start the application!
    App.init();

});