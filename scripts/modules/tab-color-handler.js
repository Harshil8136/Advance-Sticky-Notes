/**
 * tab-color-handler.js
 *
 * Manages the UI and logic for changing the background color of the
 * main list panels ('tabs') by clicking on the H2 titles.
 */
const TabColorHandler = {
    _colorMenu: null,
    _targetListType: null,
    _tabColors: [
        { name: 'Default', color: '#ffffff' },
        { name: 'Dark', color: '#1f2937' },
        { name: 'Paper', color: '#fdfaf2' },
        { name: 'Mint', color: '#f0fdf4' },
        { name: 'Sky', color: '#f0f9ff' },
    ],

    init() {
        this._createColorMenu();

        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        // Listen for clicks on the list headers
        appContainer.addEventListener('click', this._handleTitleClick.bind(this));
        
        // Global listener to close the menu
        document.addEventListener('click', this._handleGlobalClick.bind(this), true);
    },

    _createColorMenu() {
        this._colorMenu = document.createElement('div');
        this._colorMenu.id = 'tab-color-menu';
        this._colorMenu.className = 'color-menu';

        let menuItems = this._tabColors.map(c => 
            `<div class="color-swatch" data-color="${c.color}" style="background-color: ${c.color};" title="${c.name}"></div>`
        ).join('');
        
        this._colorMenu.innerHTML = menuItems;
        document.body.appendChild(this._colorMenu);

        this._colorMenu.addEventListener('click', this._applyColor.bind(this));
    },

    _handleTitleClick(event) {
        const title = event.target.closest('.list-header h2');
        if (!title) return;
        
        event.stopPropagation();
        this._targetListType = title.closest('.list-wrapper').id.includes('subjects') ? 'subjects' : 'descriptions';
        
        const titleRect = title.getBoundingClientRect();
        this._colorMenu.style.left = `${titleRect.left}px`;
        this._colorMenu.style.top = `${titleRect.bottom + 5}px`;
        this._colorMenu.classList.add('is-visible');
    },

    _handleGlobalClick(event) {
        if (!this._colorMenu.contains(event.target) && !event.target.closest('.list-header h2')) {
            this._colorMenu.classList.remove('is-visible');
        }
    },
    
    _applyColor(event) {
        const swatch = event.target.closest('.color-swatch');
        if (!swatch || !this._targetListType) return;

        const newColor = swatch.dataset.color;

        Store.setState(state => {
            const listToUpdate = state.lists[this._targetListType];
            const updatedList = { ...listToUpdate, backgroundColor: newColor };
            
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [this._targetListType]: updatedList
                }
            };
        });

        this._colorMenu.classList.remove('is-visible');
    }
};