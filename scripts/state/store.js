/**
 * store.js
 *
 * Manages the application's entire state. It's the single source of truth.
 * UPDATED: Implements a safer 'reducer' pattern for setState and uses a
 * separate EventBus for notifications to decouple modules.
 */

const Store = {
    state: {},

    init() {
        this.load();
        console.log("Store initialized with state:", this.state);
    },

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

    save: Utils.debounce(function() {
        // Safety check to ensure state has the correct structure before saving
        if (!this.state || !this.state.meta) return;
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
        // The updater is now responsible for returning the *entire* new state.
        // This is the critical fix that prevents accidental data loss.
        this.state = updater(this.state);

        this.save();

        // Instead of notifying subscribers directly, emit a generic event.
        if (window.EventBus) {
            EventBus.emit('STATE_CHANGED', this.state);
        }
    },

    getState() {
        return this.state;
    }
};