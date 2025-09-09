/**
 * list-interactions.js
 *
 * Handles primary user interactions: one-click-copy and adding new lines.
 * Exposes public methods for editing and deleting that can be called by other modules.
 * UPDATED: Uses the robust 'reducer' pattern for all state updates to prevent data loss.
 */

const ListInteractions = {
    init() {
        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        appContainer.addEventListener('click', this._handleClick.bind(this));
        appContainer.addEventListener('blur', this._handleBlur.bind(this), true);
    },

    // --- Public Methods ---

    enableEditing(lineElement) {
        const contentElement = lineElement.querySelector('.line-content');
        if (contentElement) {
            contentElement.setAttribute('contenteditable', 'true');
            contentElement.focus();
        }
    },

    deleteLine(listType, lineId) {
        if (!listType || !lineId) return;
        if (confirm('Are you sure you want to delete this snippet?')) {
            Store.setState(state => {
                const list = state.lists[listType];
                const updatedItems = list.items.filter(item => item.id !== lineId);

                // CRITICAL FIX: Return the ENTIRE new state object
                return {
                    ...state,
                    lists: {
                        ...state.lists,
                        [listType]: { ...list, items: updatedItems }
                    }
                };
            });
        }
    },

    // --- Private Event Handlers & Actions ---

    _handleClick(event) {
        const target = event.target;
        const addBtn = target.closest('.add-btn');
        if (addBtn) {
            this._addLine(addBtn.dataset.listType);
            return;
        }

        const lineElement = target.closest('.snippet-line');
        if (lineElement) {
            this._copyLineContent(lineElement);
        }
    },

    _handleBlur(event) {
        const contentElement = event.target;
        if (contentElement.matches('.line-content[contenteditable="true"]')) {
            contentElement.setAttribute('contenteditable', 'false');
            const lineElement = contentElement.closest('.snippet-line');
            if (!lineElement) return;
            
            Store.setState(state => {
                const listType = lineElement.dataset.listType;
                const lineId = lineElement.dataset.id;
                const newContent = contentElement.innerHTML;
                
                const list = state.lists[listType];
                const updatedItems = list.items.map(item => 
                    item.id === lineId ? { ...item, content: newContent } : item
                );
                
                // CRITICAL FIX: Return the ENTIRE new state object
                return {
                    ...state,
                    lists: {
                        ...state.lists,
                        [listType]: { ...list, items: updatedItems }
                    }
                };
            });
        }
    },

    _addLine(listType) {
        if (!listType) return;
        const newLine = {
            id: Utils.generateId(),
            content: 'New Snippet...',
            backgroundColor: "#F5F5F5",
            textColor: "#424242",
            position: 999
        };

        Store.setState(state => {
            const list = state.lists[listType];
            const updatedItems = [...list.items, newLine];
            
            // CRITICAL FIX: Return the ENTIRE new state object
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [listType]: { ...list, items: updatedItems }
                }
            };
        });
    },
    
    _copyLineContent(lineElement) {
        const content = lineElement.querySelector('.line-content').innerText;
        navigator.clipboard.writeText(content).then(() => {
            lineElement.classList.add('copied');
            setTimeout(() => lineElement.classList.remove('copied'), 600);
        }).catch(err => console.error('Failed to copy text: ', err));
    }
};