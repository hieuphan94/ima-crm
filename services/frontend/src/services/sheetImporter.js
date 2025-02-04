import { importFromMainSheet } from '../data/configs/sheetConfig';
import { enrichServicesWithSampleData } from '../data/helpers/sampleDataGenerator';
import { ActivityService, FoodService, Service, VisitService } from '../data/models/Service';
import { ServiceType } from '../data/models/enums';
import { GoogleSheetService } from './googleSheet';

export class SheetImporter {
  constructor(credentials, spreadsheetId) {
    this.googleSheet = new GoogleSheetService(credentials, spreadsheetId);
  }

  async importServices() {
    try {
      // 1. Fetch data from sheet
      const sheetData = await this.googleSheet.getSheetData('A1:B100'); // Adjust range as needed

      // 2. Get headers and rows
      const [headers, ...rows] = sheetData;

      // 3. Format to object array
      const formattedData = this.googleSheet.formatSheetData(['LOCATION', 'PROGRAMME'], rows);

      // 4. Parse sheet data using config
      const sheetServices = await importFromMainSheet(formattedData);

      // 5. Enrich with sample data
      const enrichedServices = enrichServicesWithSampleData(sheetServices);

      // 6. Create service instances
      const services = enrichedServices.map((data) => {
        switch (data.type) {
          case ServiceType.VISIT:
            return new VisitService(data);
          case ServiceType.ACTIVITY:
            return new ActivityService(data);
          case ServiceType.FOOD:
            return new FoodService(data);
          default:
            return new Service(data);
        }
      });

      return services;
    } catch (error) {
      console.error('Error importing services:', error);
      throw error;
    }
  }
}
