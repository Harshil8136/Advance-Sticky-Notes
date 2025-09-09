/**
 * list-renderer.js
 *
 * Renders the snippet lists to the DOM based on the current state.
 * UPDATED: Subscribes to the EventBus and includes safety checks.
 */

const ListRenderer = {
    _descListWrapper: null,
    _subjListWrapper: null,
    _body: null,

    init() {
        this._descListWrapper = document.getElementById('descriptions-wrapper');
        this._subjListWrapper = document.getElementById('subjects-wrapper');
        this._body = document.body;

        // CRITICAL FIX: Subscribe to the EventBus for state changes.
        if (window.EventBus) {
            EventBus.on('STATE_CHANGED', this.render.bind(this));
        }
        
        // Perform an initial render to display the loaded data.
        this.render(Store.getState());
    },

    /**
     * Main render function, called by the EventBus on state updates.
     * @param {object} state The entire application state from the store.
     */
    render(state) {
        // Safety check to prevent errors if state is incomplete
        if (!state || !state.lists || !state.settings) return;

        this._body.dataset.theme = state.settings.theme;
        
        if (this._descListWrapper && state.lists.descriptions) {
            this._descListWrapper.style.backgroundColor = state.lists.descriptions.backgroundColor;
        }
        if (this._subjListWrapper && state.lists.subjects) {
            this._subjListWrapper.style.backgroundColor = state.lists.subjects.backgroundColor;
        }
        
        this._renderList(
            this._descListWrapper?.querySelector('.snippet-list'), 
            state.lists.descriptions.items, 
            'descriptions'
        );
        this._renderList(
            this._subjListWrapper?.querySelector('.snippet-list'), 
            state.lists.subjects.items, 
            'subjects'
        );
    },

    /**
     * Renders a single list's items into its container.
     * @param {HTMLElement} container The DOM element to render into.
     * @param {Array} itemsData The array of line items.
     * @param {string} listType A string identifier ('descriptions' or 'subjects').
     * @private
     */
    _renderList(container, itemsData, listType) {
        if (!container || !itemsData) {
            if (container) container.innerHTML = '';
            return;
        }

        const sortedData = [...itemsData].sort((a, b) => a.position - b.position);

        const listHtml = sortedData.map(item => `
            <div class="snippet-line" 
                 data-id="${item.id}"
                 data-list-type="${listType}"
                 draggable="true"
                 style="background-color:${item.backgroundColor}; color:${item.textColor};">
                <div class="line-content">${item.content}</div>
            </div>
        `).join('');

        container.innerHTML = listHtml;
    }
};