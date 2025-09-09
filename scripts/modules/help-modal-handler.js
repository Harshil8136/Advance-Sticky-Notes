/**
 * help-modal-handler.js
 *
 * Manages the "Help & Shortcuts" instructional modal.
 */
const HelpModalHandler = {
    _modal: null,
    _closeBtn: null,
    
    init() {
        this._modal = document.getElementById('help-modal');
        this._closeBtn = document.getElementById('help-modal-close-btn');

        if (!this._modal || !this._closeBtn) {
            console.error("Help modal elements not found. Aborting init.");
            return;
        }

        this._bindEvents();
    },

    _bindEvents() {
        // Listen for a global trigger click (e.g., from a settings menu)
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="show-help"]')) {
                this.open();
            }
        });

        // Close button inside the modal
        this._closeBtn.addEventListener('click', () => this.close());

        // Close the modal if the user clicks on the dark overlay
        this._modal.addEventListener('click', (e) => {
            if (e.target === this._modal) {
                this.close();
            }
        });

        // Close the modal if the user presses the Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._modal.classList.contains('is-visible')) {
                this.close();
            }
        });
    },

    open() {
        if (this._modal) {
            this._modal.classList.add('is-visible');
        }
    },

    close() {
        if (this._modal) {
            this._modal.classList.remove('is-visible');
        }
    }
};