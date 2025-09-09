/**
 * dom-diff.js
 *
 * Provides a lightweight and efficient DOM diffing utility to update lists
 * without rebuilding the entire HTML, resulting in a significant
 * performance improvement for large lists.
 */

const DOMDiff = {
    /**
     * Updates a container's child elements to match a new data array.
     * @param {HTMLElement} container - The parent DOM element (e.g., .snippet-list).
     * @param {Array} newData - The new array of item objects.
     * @param {Function} templateFn - A function that takes an item object and returns its HTML string.
     */
    updateList(container, newData, templateFn) {
        if (!container) return;

        const oldNodesMap = new Map();
        for (const child of container.children) {
            oldNodesMap.set(child.dataset.id, child);
        }

        let lastNode = null; // Keep track of the last processed node for correct insertion order

        // Update and add new nodes
        newData.forEach(item => {
            const existingNode = oldNodesMap.get(item.id);

            if (existingNode) {
                // --- UPDATE ---
                // A simple update: replace content if different.
                // A more advanced diff would compare attributes and children.
                const newHtml = templateFn(item);
                if (existingNode.outerHTML !== newHtml) {
                    // Create a temporary element to replace the old one
                    const tempWrapper = document.createElement('div');
                    tempWrapper.innerHTML = newHtml;
                    const newNode = tempWrapper.firstElementChild;
                    container.replaceChild(newNode, existingNode);
                    lastNode = newNode;
                } else {
                    lastNode = existingNode;
                }
                oldNodesMap.delete(item.id); // Mark this node as processed
            } else {
                // --- ADD ---
                const tempWrapper = document.createElement('div');
                tempWrapper.innerHTML = templateFn(item);
                const newNode = tempWrapper.firstElementChild;

                // Insert in the correct position
                if (lastNode && lastNode.nextSibling) {
                    container.insertBefore(newNode, lastNode.nextSibling);
                } else {
                    container.appendChild(newNode);
                }
                lastNode = newNode;
            }
        });

        // --- REMOVE ---
        // Any nodes left in the map are ones that should be removed
        oldNodesMap.forEach(nodeToRemove => {
            container.removeChild(nodeToRemove);
        });
    }
};