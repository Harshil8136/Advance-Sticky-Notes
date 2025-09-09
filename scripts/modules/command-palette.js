/**
 * command-palette.js
 *
 * Manages the state, search logic, and keyboard interactions
 * for the Command Palette power-user feature.
 */
const CommandPalette = {
    _elements: {},
    _isOpen: false,
    _activeIndex: -1,

    init() {
        this._cacheDOMElements();
        this._bindEvents();
    },

    _cacheDOMElements() {
        this._elements.overlay = document.getElementById('command-palette-overlay');
        this._elements.container = this._elements.overlay?.querySelector('.cp-container');
        this._elements.input = this._elements.overlay?.querySelector('.cp-input');
        this._elements.resultsList = this._elements.overlay?.querySelector('.cp-results');
    },

    _bindEvents() {
        if (!this._elements.overlay) return;

        // Global listener for the shortcut
        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this._isOpen ? this.close() : this.open();
            }
        });

        // Close on overlay click
        this._elements.overlay.addEventListener('click', (e) => {
            if (e.target === this._elements.overlay) this.close();
        });

        this._elements.input.addEventListener('input', () => this._performSearch());
        this._elements.input.addEventListener('keydown', this._handleKeyDown.bind(this));
        
        // Click to copy
        this._elements.resultsList.addEventListener('click', (e) => {
            const item = e.target.closest('.cp-result-item');
            if (item) this._copyItem(item);
        });
    },

    open() {
        this._isOpen = true;
        this._elements.overlay.classList.add('is-visible');
        this._elements.input.focus();
        this._performSearch(); // Show all items initially
    },

    close() {
        this._isOpen = false;
        this._elements.overlay.classList.remove('is-visible');
        this._elements.input.value = '';
        this._elements.resultsList.innerHTML = '';
    },

    _performSearch() {
        const query = this._elements.input.value.toLowerCase();
        const state = Store.getState();
        const allItems = [
            ...state.lists.descriptions.items.map(item => ({ ...item, list: 'Description' })),
            ...state.lists.subjects.items.map(item => ({ ...item, list: 'Subject' }))
        ];

        const filteredItems = query
            ? allItems.filter(item => item.content.toLowerCase().includes(query))
            : allItems;

        this._renderResults(filteredItems);
    },

    _renderResults(items) {
        if (items.length === 0) {
            this._elements.resultsList.innerHTML = '<div class="cp-empty-state">No results found.</div>';
            return;
        }

        this._elements.resultsList.innerHTML = items.map(item => `
            <li class="cp-result-item" data-content="${item.content}">
                <span>${item.content}</span>
                <span class="item-label">${item.list}</span>
            </li>
        `).join('');

        this._activeIndex = 0;
        this._elements.resultsList.children[0]?.classList.add('is-active');
    },

    _handleKeyDown(e) {
        const items = this._elements.resultsList.children;
        if (items.length === 0) return;

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this._updateActiveIndex(1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this._updateActiveIndex(-1);
                break;
            case 'Enter':
                e.preventDefault();
                const activeItem = items[this._activeIndex];
                if (activeItem) this._copyItem(activeItem);
                break;
            case 'Escape':
                this.close();
                break;
        }
    },

    _updateActiveIndex(direction) {
        const items = this._elements.resultsList.children;
        items[this._activeIndex]?.classList.remove('is-active');
        
        this._activeIndex += direction;
        
        if (this._activeIndex >= items.length) this._activeIndex = 0;
        if (this._activeIndex < 0) this._activeIndex = items.length - 1;
        
        const newActiveItem = items[this._activeIndex];
        newActiveItem?.classList.add('is-active');
        newActiveItem?.scrollIntoView({ block: 'nearest' });
    },

    _copyItem(itemElement) {
        const content = itemElement.dataset.content;
        navigator.clipboard.writeText(content).then(() => {
            console.log('Copied from command palette:', content);
            this.close();
        }).catch(err => console.error('Failed to copy from palette:', err));
    }
};