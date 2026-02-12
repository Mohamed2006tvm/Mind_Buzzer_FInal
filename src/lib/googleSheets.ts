export const submitToGoogleSheet = async (data: {
    team_name: string;
    round1_score: number;
    round2_score: number;
    total_score: number;
}) => {
    // The Google Apps Script Web App URL must be set in your .ENV or hardcoded here
    // Example: https://script.google.com/macros/s/AKfycbx.../exec
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

    if (!SCRIPT_URL) {
        console.warn("Google Sheet URL (VITE_GOOGLE_SHEET_URL) not configured.");
        return;
    }

    try {
        // We use 'no-cors' triggering a simpler request, but we can't read the response.
        // This is standard for simple form submissions to Google Apps Script from client-side
        // to avoid CORS preflight issues with redirect.
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        console.log("Submitted to Google Sheet");
    } catch (error) {
        console.error("Error submitting to Google Sheet", error);
    }
};
