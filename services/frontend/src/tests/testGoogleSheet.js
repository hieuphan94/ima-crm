// Disable deprecation warnings
process.removeAllListeners('warning');

const dotenv = require('dotenv');
const { GoogleSheetService } = require('../services/googleSheet');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testGoogleSheetConnection() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    console.log('Using spreadsheet ID:', spreadsheetId);

    // Khởi tạo service chỉ với spreadsheetId
    console.log('\nInitializing Google Sheet Service...');
    const sheetService = new GoogleSheetService(spreadsheetId);

    // Test get sheet info
    console.log('\nTesting getSheetInfo...');
    const sheetInfo = await sheetService.getSheetInfo();
    console.log('Sheet Title:', sheetInfo.properties.title);
    console.log('Sheet URL:', sheetInfo.spreadsheetUrl);

    // Test get all sheets
    console.log('\nTesting getAllSheets...');
    const sheets = await sheetService.getAllSheets();
    console.log('Available Sheets:', sheets);

    // Test get sheet data
    console.log('\nTesting getSheetData...');
    const range = process.env.GOOGLE_SHEETS_RANGE || 'A1:B100';
    const data = await sheetService.getSheetData(range);
    console.log('First row:', data[0]);
    console.log('Total rows:', data.length);

    console.log('\nAll tests completed successfully! ✅');
  } catch (error) {
    console.error('Test failed ❌');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testGoogleSheetConnection();
