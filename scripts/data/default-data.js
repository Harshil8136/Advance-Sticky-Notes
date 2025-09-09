/**
 * default-data.js
 *
 * This file contains the initial, default state for the entire application.
 * It uses the new, nested structure required by the latest features.
 * It's used by the store when no saved data is found in localStorage.
 */

const DEFAULT_STATE = {
    // 1. Data for the snippet lists, using the new nested structure
    lists: {
        descriptions: {
            backgroundColor: "#ffffff", // Default background for the entire panel
            items: [
                { id: 'd1', content: "XFR to BILLER", backgroundColor: "#F5F5F5", textColor: "#424242", position: 0 },
                { id: 'd2', content: "PROVIDED BILLER #", backgroundColor: "#F5F5F5", textColor: "#424242", position: 1 },
                { id: 'd3', content: "ACCT BAL. INQUIRY", backgroundColor: "#F5F5F5", textColor: "#424242", position: 2 },
                { id: 'd4', content: "PASSWORD RESET", backgroundColor: "#FFF9C4", textColor: "#F57F17", position: 3 },
                { id: 'd5', content: "XFR to IVR - PMT REQUEST", backgroundColor: "#FFF9C4", textColor: "#F57F17", position: 4 }
            ]
        },
        subjects: {
            backgroundColor: "#ffffff", // Default background for the entire panel
            items: [
                { id: 's1', content: "PMT ARRANGEMENT/PLAN", backgroundColor: "#F5F5F5", textColor: "#424242", position: 0 },
                { id: 's2', content: "LIVE PMT", backgroundColor: "#E8F5E9", textColor: "#2E7D32", position: 1 },
                { id: 's3', content: "PAYMENTUS FEE INQUIRY", backgroundColor: "#F5F5F5", textColor: "#424242", position: 2 },
                { id: 's4', content: "ACCT INQUIRY", backgroundColor: "#F5F5F5", textColor: "#424242", position: 3 },
                { id: 's5', content: "Unblock payment method", backgroundColor: "#FCE4EC", textColor: "#C2185B", position: 4 }
            ]
        }
    },

    // 2. Data for all user settings
    settings: {
        theme: 'auto', // 'light', 'dark', 'auto'
        fontSize: 'medium', // 'small', 'medium', 'large'
        lineSpacing: 'compact', // 'compact', 'regular', 'loose'
        autoSave: 'realtime', // 'realtime', '5s', 'manual'
        clickBehavior: 'copy', // 'copy', 'edit'
    },
    
    // 3. Metadata for the application state
    meta: {
        version: "1.1.0", // Updated version to reflect new data structure
        lastUpdated: null
    }
};