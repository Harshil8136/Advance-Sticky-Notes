/**
 * splitter-handler.js
 *
 * Adds functionality to the list separator, allowing the user to
 * drag it up and down to resize the two list panels.
 */
const SplitterHandler = {
    _separator: null,
    _appContainer: null,
    _isDragging: false,

    init() {
        this._separator = document.querySelector('.list-separator');
        this._appContainer = document.querySelector('.app-container');
        
        if (!this._separator || !this._appContainer) return;

        // Bind the methods once to maintain the 'this' context and allow removal
        this._dragMove = this._dragMove.bind(this);
        this._dragEnd = this._dragEnd.bind(this);

        this._separator.addEventListener('mousedown', this._dragStart.bind(this));
    },

    _dragStart(e) {
        e.preventDefault();
        this._isDragging = true;
        
        // Add listeners to the window to capture mouse movement anywhere on the page
        window.addEventListener('mousemove', this._dragMove);
        window.addEventListener('mouseup', this._dragEnd);
        
        // Add a class to the body to prevent text selection during drag
        document.body.style.userSelect = 'none';
    },

    _dragMove(e) {
        if (!this._isDragging) return;

        // Calculate the height of the top pane based on the mouse position
        const containerRect = this._appContainer.getBoundingClientRect();
        const topPaneHeight = e.clientY - containerRect.top;

        // Ensure the panes don't get too small (e.g., min 50px)
        if (topPaneHeight < 50 || e.clientY > (containerRect.bottom - 50)) {
            return;
        }
        
        // Update the grid layout dynamically
        this._appContainer.style.gridTemplateRows = `${topPaneHeight}px auto 1fr`;
    },

    _dragEnd() {
        this._isDragging = false;
        
        // Clean up event listeners from the window
        window.removeEventListener('mousemove', this._dragMove);
        window.removeEventListener('mouseup', this._dragEnd);

        // Restore default body styles
        document.body.style.userSelect = '';
    }
};