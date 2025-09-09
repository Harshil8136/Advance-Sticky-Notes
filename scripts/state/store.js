/**
 * store.js
 *
 * Manages the application's entire state. It's the single source of truth.
 * It handles loading from/saving to localStorage and notifies subscribers
 * of any state changes using the global EventBus.
 */

const Store = {
    state: {},

    /**
     * Initializes the store by loading the state from localStorage or defaults.
     */
    init() {
        this.load();
        console.log("Store initialized with state:", this.state);
    },

    /**
     * Loads state from localStorage, migrates it to the latest format if necessary,
     * and falls back to default state if no valid data is found.
     */
    load() {
        const savedStateJSON = localStorage.getItem('compact-snippet-app-state');
        let loadedState = null;

        if (savedStateJSON) {
            try {
                loadedState = JSON.parse(savedStateJSON);
            } catch (e) {
                console.error("Failed to parse saved state from localStorage.", e);
                loadedState = null;
            }
        }

        const migratedState = Utils.migrateState(loadedState);

        if (migratedState) {
            this.state = migratedState;
        } else {
            this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    },

    /**
     * Saves the current state to localStorage. This function is debounced
     * to prevent excessive writes.
     */
    save: Utils.debounce(function() {
        if (!this.state || !this.state.meta) return; // Safety check
        this.state.meta.lastUpdated = new Date().toISOString();
        localStorage.setItem('compact-snippet-app-state', JSON.stringify(this.state));
        console.log("State saved.");
    }, 500),

    /**
     * The primary method for updating the state. It takes an updater function
     * that must return the new, complete state object.
     * @param {Function} updater A function that receives the current state and returns the entire new state.
     */
    setState(updater) {
        this.state = updater(this.state);

        this.save();
        
        if (window.EventBus) {
            EventBus.emit('STATE_CHANGED', this.state);
        }
    },

    /**
     * Returns the current state.
     * @returns {object} The current application state.
     */
    getState() {
        return this.state;
    }
};