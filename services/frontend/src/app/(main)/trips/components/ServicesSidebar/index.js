'use client';
import { useState } from 'react';
import FoodSection from './FoodSection';
import HotelSection from './HotelSection';
import VisitSection from './VisitSection';

export default function ServicesSidebar({ isOperator = false }) {
  // Visit section states
  const [openCountry, setOpenCountry] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sheetServices, setSheetServices] = useState([]);
  const [sheetAccommodationServices, setSheetAccommodationServices] = useState([]);
  const [openFood, setOpenFood] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(null);

  const handleLocationSelect = async (locationName) => {
    if (selectedLocation === locationName) {
      setSelectedLocation(null);
      setSheetServices([]);
      setSheetAccommodationServices([]);
      return;
    }
    setSelectedLocation(locationName);
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-1 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="space-y-2">
        <VisitSection
          openCountry={openCountry}
          setOpenCountry={setOpenCountry}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          sheetServices={sheetServices}
          setSheetServices={setSheetServices}
          setSheetAccommodationServices={setSheetAccommodationServices}
          loadingLocation={loadingLocation}
          setLoadingLocation={setLoadingLocation}
        />
        <HotelSection
          openCountry={openCountry}
          setOpenCountry={setOpenCountry}
          selectedLocation={selectedLocation}
          sheetAccommodationServices={sheetAccommodationServices}
        />
        {!isOperator && <FoodSection openFood={openFood} setOpenFood={setOpenFood} />}
      </div>
    </div>
  );
}
