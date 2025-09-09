/**
 * settings-handler.js
 *
 * Manages the consolidated settings pop-up menu, which includes
 * the theme switcher and a trigger for the help modal.
 * UPDATED: Uses the robust 'reducer' pattern for state updates.
 */
const SettingsHandler = {
    _settingsMenu: null,
    _settingsBtn: null,
    _themes: ['auto', 'light', 'dark'],

    init() {
        this._settingsBtn = document.getElementById('settings-btn');
        if (!this._settingsBtn) return;

        this._createSettingsMenu();
        
        this._settingsBtn.addEventListener('click', this._handleSettingsButtonClick.bind(this));
        document.addEventListener('click', this._handleGlobalClick.bind(this), true);
    },

    _createSettingsMenu() {
        this._settingsMenu = document.createElement('div');
        this._settingsMenu.id = 'settings-menu';
        this._settingsMenu.className = 'settings-menu';

        let menuItems = `
            <div class="settings-menu-section">
                <div class="settings-menu-title">Theme</div>
                ${this._themes.map(theme => `
                    <button class="settings-menu-item" data-theme="${theme}">
                        ${theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                `).join('')}
            </div>
            <hr class="settings-menu-separator">
            <button class="settings-menu-item" data-action="show-help">
                <i class="fas fa-question-circle fa-fw"></i> Help & Shortcuts
            </button>
        `;
        
        this._settingsMenu.innerHTML = menuItems;
        document.body.appendChild(this._settingsMenu);

        this._settingsMenu.addEventListener('click', this._handleMenuClick.bind(this));
    },

    _handleSettingsButtonClick(event) {
        event.stopPropagation();
        
        const btnRect = this._settingsBtn.getBoundingClientRect();
        this._settingsMenu.style.left = `${btnRect.left}px`;
        this._settingsMenu.style.top = `${btnRect.bottom + 5}px`;
        this._settingsMenu.classList.toggle('is-visible');
    },

    _handleGlobalClick(event) {
        if (!this._settingsMenu.contains(event.target) && event.target.closest('#settings-btn') !== this._settingsBtn) {
            this._settingsMenu.classList.remove('is-visible');
        }
    },
    
    _handleMenuClick(event) {
        const themeButton = event.target.closest('[data-theme]');
        
        if (themeButton) {
            const newTheme = themeButton.dataset.theme;
            
            // Dispatch an action to the store to update the theme
            Store.setState(state => {
                // Return the ENTIRE new state object, not just a part of it
                return {
                    ...state,
                    settings: { ...state.settings, theme: newTheme }
                };
            });
        }

        this._settingsMenu.classList.remove('is-visible');
    }
};