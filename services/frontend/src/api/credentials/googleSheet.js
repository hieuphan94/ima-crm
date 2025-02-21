const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GoogleSheetService {
  constructor(spreadsheetId) {
    try {
      // Đọc credentials từ file JSON
      const credentialsPath = path.join(
        process.cwd(), // Thay đổi từ __dirname thành process.cwd()
        'src',
        'api',
        'credentials',
        'my-sheet-ima-crm-import-084d657ff146.json'
      );
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

      this.spreadsheetId = spreadsheetId;
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error('Error initializing GoogleSheetService:', error);
      throw error;
    }
  }

  async getSheetInfo() {
    try {
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching sheet info: ${error.message}`);
    }
  }

  async getAllSheets() {
    const info = await this.getSheetInfo();
    return info.sheets.map((sheet) => ({
      id: sheet.properties.sheetId,
      title: sheet.properties.title,
    }));
  }

  async getSheetData(range) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });
      return response.data.values;
    } catch (error) {
      throw new Error(`Error fetching sheet data: ${error.message}`);
    }
  }

  // Convert sheet data to object array
  formatSheetData(headers, rows) {
    return rows.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  // Get multiple ranges in one request
  async getBatchData(ranges) {
    try {
      const response = await this.sheets.spreadsheets.values.batchGet({
        spreadsheetId: this.spreadsheetId,
        ranges: ranges,
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
      });

      return response.data.valueRanges;
    } catch (error) {
      console.error('Error fetching batch data:', error);
      throw error;
    }
  }
}

module.exports = { GoogleSheetService };
