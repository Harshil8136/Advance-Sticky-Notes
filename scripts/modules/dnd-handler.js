/**
 * dnd-handler.js
 *
 * Contains all the logic for drag-and-drop reordering of lines
 * both within and between the two lists.
 * UPDATED: Uses the new robust setState method.
 */

const DndHandler = {
    _draggedElement: null,

    init() {
        const appContainer = document.getElementById('app-container');
        if (!appContainer) return;

        appContainer.addEventListener('dragstart', this._handleDragStart.bind(this));
        appContainer.addEventListener('dragover', this._handleDragOver.bind(this));
        appContainer.addEventListener('drop', this._handleDrop.bind(this));
        appContainer.addEventListener('dragend', this._handleDragEnd.bind(this));
    },

    _handleDragStart(event) {
        const line = event.target.closest('.snippet-line');
        if (!line) return;

        this._draggedElement = line;
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', line.dataset.id);
        
        setTimeout(() => line.classList.add('is-dragging'), 0);
    },

    _handleDragOver(event) {
        event.preventDefault();
    },

    _handleDrop(event) {
        event.preventDefault();
        if (!this._draggedElement) return;

        const droppedOnElement = event.target.closest('.snippet-line');
        const targetListElement = event.target.closest('.snippet-list');
        if (!targetListElement) return;

        const draggedId = this._draggedElement.dataset.id;
        const sourceListType = this._draggedElement.dataset.listType;
        const targetListType = targetListElement.id.includes('subjects') ? 'subjects' : 'subjects';

        Store.setState(state => {
            // Deep copy the lists object to ensure immutability
            const newLists = JSON.parse(JSON.stringify(state.lists));
            
            let sourceItems = newLists[sourceListType].items;
            let targetItems = newLists[targetListType].items;

            const draggedItemIndex = sourceItems.findIndex(item => item.id === draggedId);
            if (draggedItemIndex === -1) return state; // Item not found, abort

            const [draggedItem] = sourceItems.splice(draggedItemIndex, 1);

            if (droppedOnElement) {
                const dropIndex = targetItems.findIndex(item => item.id === droppedOnElement.dataset.id);
                targetItems.splice(dropIndex, 0, draggedItem);
            } else {
                targetItems.push(draggedItem); // Drop at the end
            }

            // Re-calculate position indices for affected lists
            this._reindexList(sourceItems);
            if(sourceListType !== targetListType) this._reindexList(targetItems);

            // Return the ENTIRE new state object
            return {
                ...state,
                lists: newLists
            };
        });
    },

    _handleDragEnd() {
        if (this._draggedElement) {
            this._draggedElement.classList.remove('is-dragging');
            this._draggedElement = null;
        }
    },

    _reindexList(list) {
        list.forEach((item, index) => {
            item.position = index;
        });
    }
};