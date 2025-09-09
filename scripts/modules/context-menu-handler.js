/**
 * context-menu-handler.js
 *
 * Manages a right-click context menu for all line actions.
 * UPDATED: Uses the robust 'reducer' pattern for state updates.
 */
const ContextMenuHandler = {
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

        // Use the EventBus to know when to update (e.g., if lists are cleared)
        if (window.EventBus) {
            EventBus.on('STATE_CHANGED', () => this._hideContextMenu());
        }
    },

    _createContextMenu() {
        this._contextMenu = document.createElement('div');
        this._contextMenu.id = 'context-menu';
        this._contextMenu.className = 'context-menu';

        let menuItems = `
            <div class="context-menu-item action-item" data-action="edit">
                <i class="fas fa-pencil-alt fa-fw"></i> Edit
            </div>
            <div class="context-menu-item action-item" data-action="delete">
                <i class="fas fa-trash-alt fa-fw"></i> Delete
            </div>
            <hr class="context-menu-separator">
        `;

        for (const [name, colors] of Object.entries(this._colorPalettes)) {
            const displayName = name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            menuItems += `
                <div class="context-menu-item color-swatch-item" data-color-name="${name}" style="background-color:${colors.backgroundColor}; color:${colors.textColor};">
                    ${displayName}
                </div>`;
        }
        this._contextMenu.innerHTML = menuItems;
        document.body.appendChild(this._contextMenu);
        
        this._contextMenu.addEventListener('click', this._handleMenuClick.bind(this));
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
    
    _handleMenuClick(event) {
        const targetAction = event.target.closest('[data-action]');
        const targetColor = event.target.closest('[data-color-name]');

        if (!this._currentTargetLine) return;

        const listType = this._currentTargetLine.dataset.listType;
        const lineId = this._currentTargetLine.dataset.id;

        if (targetAction) {
            const action = targetAction.dataset.action;
            if (action === 'edit') {
                ListInteractions.enableEditing(this._currentTargetLine);
            } else if (action === 'delete') {
                ListInteractions.deleteLine(listType, lineId);
            }
        }
        else if (targetColor) {
            const colorName = targetColor.dataset.colorName;
            const color = this._colorPalettes[colorName];
            
            Store.setState(state => {
                const list = state.lists[listType];
                const updatedItems = list.items.map(item => 
                    item.id === lineId ? { ...item, ...color } : item
                );
                // Return the ENTIRE new state object
                return { 
                    ...state, 
                    lists: { 
                        ...state.lists, 
                        [listType]: { ...list, items: updatedItems }
                    }
                };
            });
        }
        
        this._hideContextMenu();
    }
};