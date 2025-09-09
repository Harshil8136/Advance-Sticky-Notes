/**
 * theme-handler.js
 *
 * Manages the new, simplified theme-switching functionality.
 * Creates a small pop-up menu to select light/dark/auto themes.
 */
const ThemeHandler = {
    _themeMenu: null,
    _themeBtn: null,
    _themes: ['auto', 'light', 'dark'],

    init() {
        this._themeBtn = document.getElementById('theme-btn');
        if (!this._themeBtn) return;

        this._createThemeMenu();
        
        this._themeBtn.addEventListener('click', this._handleThemeButtonClick.bind(this));
        document.addEventListener('click', this._handleGlobalClick.bind(this), true);
    },

    _createThemeMenu() {
        this._themeMenu = document.createElement('div');
        this._themeMenu.id = 'theme-menu';
        this._themeMenu.className = 'theme-menu'; // Use a unique class for styling

        let menuItems = this._themes.map(theme => 
            `<button class="theme-menu-item" data-theme="${theme}">
                ${theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>`
        ).join('');
        
        this._themeMenu.innerHTML = menuItems;
        document.body.appendChild(this._themeMenu);

        this._themeMenu.addEventListener('click', this._applyTheme.bind(this));
    },

    _handleThemeButtonClick(event) {
        event.stopPropagation();
        
        const btnRect = this._themeBtn.getBoundingClientRect();
        this._themeMenu.style.left = `${btnRect.left}px`;
        this._themeMenu.style.top = `${btnRect.bottom + 5}px`;
        this._themeMenu.classList.toggle('is-visible');
    },

    _handleGlobalClick(event) {
        if (!this._themeMenu.contains(event.target) && event.target !== this._themeBtn) {
            this._themeMenu.classList.remove('is-visible');
        }
    },
    
    _applyTheme(event) {
        const themeButton = event.target.closest('.theme-menu-item');
        if (!themeButton) return;

        const newTheme = themeButton.dataset.theme;

        Store.setState(state => ({
            ...state,
            settings: { ...state.settings, theme: newTheme }
        }));

        this._themeMenu.classList.remove('is-visible');
    }
};