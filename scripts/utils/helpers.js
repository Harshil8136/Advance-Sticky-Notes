/**
 * helpers.js
 *
 * A collection of stateless utility functions for common tasks
 * like debouncing, generating IDs, and migrating state.
 */

const Utils = {
    /**
     * Creates a debounced function that delays invoking the provided function.
     * @param {Function} func The function to debounce.
     * @param {number} delay The number of milliseconds to delay.
     * @returns {Function} The new debounced function.
     */
    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    },

    /**
     * Generates a simple, reasonably unique ID string.
     * @returns {string} A new unique ID.
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    },

    /**
     * Checks a loaded state object and migrates it to the current format if it's outdated.
     * This is the key fix for preventing crashes from old data in localStorage.
     * @param {object} loadedState The state object loaded from localStorage.
     * @returns {object|null} The corrected, valid state object, or null if the input is invalid.
     */
    migrateState(loadedState) {
        if (!loadedState || !loadedState.lists || !loadedState.lists.descriptions) {
            // The loaded state is invalid or empty, signal to use defaults.
            return null;
        }

        // --- Migration Check ---
        // We detect an old version if `lists.descriptions` is an array instead of an object.
        if (Array.isArray(loadedState.lists.descriptions)) {
            console.warn("Old state structure detected. Migrating to new version...");
            
            // Create a new state object based on the current default structure.
            const migratedState = JSON.parse(JSON.stringify(DEFAULT_STATE));

            // Copy the old line items into the new structure.
            migratedState.lists.descriptions.items = loadedState.lists.descriptions;
            migratedState.lists.subjects.items = loadedState.lists.subjects;

            // Preserve old settings if they exist.
            if (loadedState.settings) {
                migratedState.settings = { ...migratedState.settings, ...loadedState.settings };
            }

            return migratedState;
        }

        // If the structure is not old, it's assumed to be correct.
        return loadedState;
    }
};