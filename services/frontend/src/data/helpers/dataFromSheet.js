import { GoogleSheetService } from '@/services/googleSheet';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const sheetService = new GoogleSheetService(process.env.GOOGLE_SHEETS_ID);
    const range = 'TÁCH ĐỊA ĐIỂM!A1:Z1000';
    const data = await sheetService.getSheetData(range);

    console.log('Raw data from sheet:', data);

    // Convert data to array of objects
    const headers = data[0];
    console.log('Headers:', headers);

    const locations = data.slice(1).map((row) => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || '';
      });
      return item;
    });

    console.log('Processed locations:', locations);

    return res.status(200).json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
