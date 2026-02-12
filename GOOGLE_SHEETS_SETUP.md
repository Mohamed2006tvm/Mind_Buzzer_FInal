# Google Sheets Integration Guide

To enable saving scores to a Google Sheet, follow these steps:

1.  **Create a Google Sheet**:
    *   Go to [sheets.google.com](https://sheets.google.com) and create a new sheet.
    *   Name the first tab `Scores`.
    *   Set the header row (Row 1):
        *   A1: `Timestamp`
        *   B1: `Team Name`
        *   C1: `Round 1 Score`
        *   D1: `Round 2 Score`
        *   E1: `Total Score`

2.  **Open Apps Script**:
    *   In the Google Sheet, go to **Extensions > Apps Script**.

3.  **Paste the Code**:
    *   Replace the contents of `Code.gs` with the snippet below.

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Scores");
    
    // Parse the JSON data sent from the React app
    const data = JSON.parse(e.postData.contents);
    
    // Append the row
    sheet.appendRow([
      new Date(),
      data.team_name,
      data.round1_score,
      data.round2_score,
      data.total_score
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4.  **Deploy as Web App**:
    *   Click **Deploy** (blue button top right) -> **New deployment**.
    *   **Select type**: Web app.
    *   **Description**: "Score Collector".
    *   **Execute as**: `Me (your google account)`.
    *   **Who has access**: `Anyone` (Important! This allows the React app to post data without login).
    *   Click **Deploy**.
    *   Copy the **Web App URL** (starts with `https://script.google.com/macros/s/...`).

5.  **Configure Environment**:
    *   Open your `.ENV` file in the project.
    *   Add (or update) the line:
        `VITE_GOOGLE_SHEET_URL=your_copied_url_here`
