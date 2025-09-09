/**
 * event-bus.js
 *
 * Creates a global Publisher/Subscriber system for decoupled communication
 * between modules.
 *
 * - on(eventName, callback): Subscribes to an event.
 * - emit(eventName, data): Publishes an event to all subscribers.
 */

const EventBus = {
    _events: {},

    /**
     * Subscribes a callback function to a specific event.
     * @param {string} eventName The name of the event to listen for.
     * @param {Function} callback The function to execute when the event is emitted.
     */
    on(eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(callback);
    },

    /**
     * Publishes an event, calling all subscribed callbacks with the provided data.
     * @param {string} eventName The name of the event to emit.
     * @param {*} [data] The data to pass to the event listeners.
     */
    emit(eventName, data) {
        if (!this._events[eventName]) {
            return;
        }
        this._events[eventName].forEach(callback => {
            callback(data);
        });
    },

    /**
     * Unsubscribes a callback function from a specific event.
     * @param {string} eventName The name of the event.
     * @param {Function} callback The specific callback to remove.
     */
    off(eventName, callback) {
        if (!this._events[eventName]) {
            return;
        }
        this._events[eventName] = this._events[eventName].filter(
            registeredCallback => registeredCallback !== callback
        );
    }
};

// Make it globally accessible for all modules
window.EventBus = EventBus;