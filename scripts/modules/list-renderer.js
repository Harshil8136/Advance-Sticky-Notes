/**
 * list-renderer.js
 *
 * Renders the snippet lists to the DOM based on the current state.
 * It subscribes to the EventBus and re-renders whenever the state changes.
 */

const ListRenderer = {
    _descListWrapper: null,
    _subjListWrapper: null,
    _body: null,

    init() {
        // Cache the top-level elements this module controls
        this._descListWrapper = document.getElementById('descriptions-wrapper');
        this._subjListWrapper = document.getElementById('subjects-wrapper');
        this._body = document.body;

        // Subscribe to the EventBus. The render method will be called automatically on state changes.
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
        if (!state || !state.lists || !state.settings) return;

        // Apply global visual settings from state to the body element
        this._body.dataset.theme = state.settings.theme;
        
        // Apply the background color to the list wrappers
        if (this._descListWrapper && state.lists.descriptions) {
            this._descListWrapper.style.backgroundColor = state.lists.descriptions.backgroundColor;
        }
        if (this._subjListWrapper && state.lists.subjects) {
            this._subjListWrapper.style.backgroundColor = state.lists.subjects.backgroundColor;
        }
        
        // Render the items within both lists
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
            if (container) container.innerHTML = ''; // Clear if data is missing
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
                <div class="line-controls">
                    <button class="icon-btn edit-btn" title="Edit"><i class="fas fa-pencil-alt"></i></button>
                    <button class="icon-btn delete-btn" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `).join('');

        container.innerHTML = listHtml;
    }
};