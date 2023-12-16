async function addRowToSheet(auth, formData) {
    const sheets = google.sheets({ version: 'v4', auth });
  
    // The spreadsheet ID and range where you want to add the row
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'Sheet1!A:F'; // Assuming columns A to F are used for the form responses
  
    // Prepare the row data
    const rowValues = Object.values(formData);
  
    try {
      // Get the current values in the sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
  
      // Find the next empty row and add the new data
      const nextRow = response.data.values ? response.data.values.length + 1 : 1;
  
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!A${nextRow}:F${nextRow}`,
        valueInputOption: 'RAW',
        resource: {
          values: [rowValues],
        },
      });
  
      console.log('Row added to Google Sheets successfully.');
    } catch (err) {
      console.error('Error adding row to Google Sheets:', err);
      throw err;
    }
  }
  