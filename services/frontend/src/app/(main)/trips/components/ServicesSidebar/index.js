'use client';
import { useState } from 'react';
import FoodSection from './FoodSection';
import GuideSection from './GuideSection';
import VisitSection from './VisitSection';

export default function ServicesSidebar({ isOperator = false }) {
  // Visit section states
  const [openCountry, setOpenCountry] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetServices, setSheetServices] = useState([]);
  const [hasChanges, setHasChanges] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);

  // Guide section states
  const [openGuide, setOpenGuide] = useState(false);
  const [guideSearchTerm, setGuideSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // Food section states
  const [openFood, setOpenFood] = useState(false);
  const [foodSearchTerm, setFoodSearchTerm] = useState('');

  const mockChanges = {
    added: ['Temple Literature', 'Cyclo Hanoi'],
    updated: ['Pagode Tran Quoc'],
    removed: ['Old Quarter Tour'],
  };

  const servicesPerPage = 7;

  const handleLocationSelect = async (locationName) => {
    if (selectedLocation === locationName) {
      setSelectedLocation(null);
      return;
    }
    setSelectedLocation(locationName);
  };

  const handleCountryClick = (countryName) => {
    setOpenCountry(openCountry === countryName ? null : countryName);
    setSelectedLocation(null);
  };

  const handleRefreshServices = () => {
    if (selectedLocation) {
      setHasChanges(false);
      setIsRefreshed(true);
      setTimeout(() => {
        setIsRefreshed(false);
      }, 2000);
    }
  };

  const onFetchLocationServices = async () => {
    // Implement logic to fetch services
    // This was available in the original ServicesSidebar.js
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-1 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="space-y-2">
        <VisitSection
          openCountry={openCountry}
          setOpenCountry={setOpenCountry}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          sheetServices={sheetServices}
          setSheetServices={setSheetServices}
          mockChanges={mockChanges}
          hasChanges={hasChanges}
          setHasChanges={setHasChanges}
          showModal={showModal}
          setShowModal={setShowModal}
          isRefreshed={isRefreshed}
          setIsRefreshed={setIsRefreshed}
          onCountryClick={handleCountryClick}
          onRefreshServices={handleRefreshServices}
        />

        <GuideSection
          openGuide={openGuide}
          setOpenGuide={setOpenGuide}
          guideSearchTerm={guideSearchTerm}
          setGuideSearchTerm={setGuideSearchTerm}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
        />

        {!isOperator && (
          <FoodSection
            openFood={openFood}
            setOpenFood={setOpenFood}
            foodSearchTerm={foodSearchTerm}
            setFoodSearchTerm={setFoodSearchTerm}
          />
        )}
      </div>
    </div>
  );
}
