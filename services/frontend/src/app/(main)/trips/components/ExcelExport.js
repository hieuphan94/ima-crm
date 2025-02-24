import * as XLSX from 'xlsx';

const createExcel = async ({ scheduleItems = [], scheduleInfo = {}, settings = {} }) => {
  const workbook = XLSX.utils.book_new();

  // Create trip info worksheet
  const tripInfoData = [
    ['Trip Information'],
    ['Title', scheduleInfo?.title || 'Trip Schedule'],
    ['Number of Days', settings?.numberOfDays || 1],
    ['Number of Guests', settings?.globalPax || 1],
    ['Star Rating', settings?.starRating || 4],
  ];
  const tripInfoWS = XLSX.utils.aoa_to_sheet(tripInfoData);

  // Create schedule worksheet
  const scheduleData = [['Day', 'Title', 'Distance (km)', 'Description']];
  scheduleItems.forEach((day, index) => {
    scheduleData.push([
      `Day ${index + 1}`,
      day.titleOfDay || '',
      day.distance || '',
      day.paragraphDay.paragraphTotal.replace(/<[^>]+>/g, '') || '',
    ]);
  });
  const scheduleWS = XLSX.utils.aoa_to_sheet(scheduleData);

  // Add worksheets to workbook
  XLSX.utils.book_append_sheet(workbook, tripInfoWS, 'Trip Info');
  XLSX.utils.book_append_sheet(workbook, scheduleWS, 'Schedule');

  return workbook;
};

export const generateAndDownloadExcel = async (data) => {
  try {
    const workbook = await createExcel(data);
    const fileName = `${data.scheduleInfo?.title || 'trip'}-${Date.now()}.xlsx`;

    // Write and download
    XLSX.writeFile(workbook, fileName);

    return true;
  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw error;
  }
};

export default createExcel;
