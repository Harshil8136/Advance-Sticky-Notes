/**
 * color-handler.js
 *
 * Manages all color-related functionality, including the custom
 * right-click context menu for applying colors to lines.
 * UPDATED: Uses the EventBus and robust setState pattern.
 */

const ColorHandler = {
    _contextMenu: null,
    _currentTargetLine: null,
    _colorPalettes: {
        "classic-yellow": { backgroundColor: "#FFF9C4", textColor: "#F57F17" },
        "mint-fresh":     { backgroundColor: "#E8F5E9", textColor: "#2E7D32" },
        "sky-blue":       { backgroundColor: "#E3F2FD", textColor: "#1565C0" },
        "coral-pink":     { backgroundColor: "#FCE4EC", textColor: "#C2185B" },
        "lavender":       { backgroundColor: "#F3E5F5", textColor: "#7B1FA2" },
        "peach":          { backgroundColor: "#FFF3E0", textColor: "#E65100" },
        "sage-green":     { backgroundColor: "#F1F8E9", textColor: "#558B2F" },
        "neutral-gray":   { backgroundColor: "#F5F5F5", textColor: "#424242" }
    },

    init() {
        this._createContextMenu();
        
        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        appContainer.addEventListener('contextmenu', this._showContextMenu.bind(this));
        document.addEventListener('click', this._hideContextMenu.bind(this));
    },

    _createContextMenu() {
        this._contextMenu = document.createElement('div');
        this._contextMenu.id = 'color-context-menu';
        this._contextMenu.className = 'context-menu';

        let menuItems = '<div class="context-menu-title">Set Color</div>';
        for (const [name, colors] of Object.entries(this._colorPalettes)) {
            const displayName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            menuItems += `
                <div class="context-menu-item" data-color-name="${name}" style="background-color:${colors.backgroundColor}; color:${colors.textColor};">
                    ${displayName}
                </div>`;
        }
        this._contextMenu.innerHTML = menuItems;
        document.body.appendChild(this._contextMenu);
        
        // Use event delegation on the menu itself
        this._contextMenu.addEventListener('click', this._applyColor.bind(this));
    },

    _showContextMenu(event) {
        const line = event.target.closest('.snippet-line');
        if (!line) return;

        event.preventDefault();
        this._currentTargetLine = line;

        this._contextMenu.style.left = `${event.pageX}px`;
        this._contextMenu.style.top = `${event.pageY}px`;
        this._contextMenu.classList.add('is-visible');
    },

    _hideContextMenu() {
        if (this._contextMenu) {
            this._contextMenu.classList.remove('is-visible');
        }
        this._currentTargetLine = null;
    },

    _applyColor(event) {
        const item = event.target.closest('.context-menu-item');
        if (!item || !this._currentTargetLine) return;
        
        const colorName = item.dataset.colorName;
        const color = this._colorPalettes[colorName];
        const lineId = this._currentTargetLine.dataset.id;
        const listType = this._currentTargetLine.dataset.listType;

        Store.setState(state => {
            const listToUpdate = state.lists[listType];
            const updatedItems = listToUpdate.items.map(line => 
                line.id === lineId ? { ...line, ...color } : line
            );
            
            // Return the entire new state object, preserving all other state properties
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listType]: {
                        ...listToUpdate,
                        items: updatedItems
                    }
                }
            };
        });
    }
};