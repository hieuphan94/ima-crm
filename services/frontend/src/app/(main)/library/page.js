'use client';

import { ROUTES } from '@/configs/routesPermission';
import {
  Building2,
  ChevronLeft,
  CreditCard,
  FileText,
  FolderOpen,
  History,
  Image,
  MapPin,
  Palette,
  Tags,
  UserCheck,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LIBRARY_ITEMS } from './constants/library-items';

const SECTIONS = {
  core: {
    title: 'Core',
    items: LIBRARY_ITEMS,
  },
  services: {
    title: 'Services',
    items: [
      { title: 'Service Providers', icon: Building2, route: `${ROUTES.library}/providers` },
      { title: 'Service Categories', icon: Tags, route: `${ROUTES.library}/categories` },
      { title: 'Locations', icon: MapPin, route: `${ROUTES.library}/locations` },
    ],
  },
  tours: {
    title: 'Tours',
    items: [
      { title: 'Tour Programs', icon: FileText, route: ROUTES.tours },
      { title: 'Tour Categories', icon: Tags, route: `${ROUTES.tours}/categories` },
      { title: 'Tour History', icon: History, route: `${ROUTES.tours}/history` },
    ],
  },
  storage: {
    title: 'Storage',
    items: [
      { title: 'Company Files', icon: FolderOpen, route: `${ROUTES.library}/files` },
      { title: 'Media Library', icon: Image, route: `${ROUTES.library}/media` },
      { title: 'Documents', icon: FileText, route: `${ROUTES.library}/documents` },
    ],
  },
  customers: {
    title: 'Customers',
    items: [
      { title: 'Customer List', icon: Users, route: `${ROUTES.library}/customers` },
      { title: 'Tour Guides', icon: UserCheck, route: `${ROUTES.library}/guides` },
      { title: 'Customer History', icon: History, route: `${ROUTES.library}/customer-history` },
    ],
  },
  designs: {
    title: 'Designs',
    items: [
      { title: 'Tour PDFs', icon: FileText, route: `${ROUTES.library}/designs/tour-pdfs` },
      { title: 'Name Cards', icon: CreditCard, route: `${ROUTES.library}/designs/name-cards` },
      { title: 'Brand Assets', icon: Palette, route: `${ROUTES.library}/designs/brand-assets` },
    ],
  },
};

const SECTION_COLORS = {
  core: {
    background: 'bg-gray-100',
    iconBg: 'bg-gray-200',
    iconText: 'text-gray-700',
    border: 'border-gray-200',
  },
  services: {
    background: 'bg-emerald-100',
    iconBg: 'bg-emerald-200',
    iconText: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  tours: {
    background: 'bg-blue-100',
    iconBg: 'bg-blue-200',
    iconText: 'text-blue-700',
    border: 'border-blue-200',
  },
  storage: {
    background: 'bg-amber-100',
    iconBg: 'bg-amber-200',
    iconText: 'text-amber-700',
    border: 'border-amber-200',
  },
  customers: {
    background: 'bg-purple-100',
    iconBg: 'bg-purple-200',
    iconText: 'text-purple-700',
    border: 'border-purple-200',
  },
  designs: {
    background: 'bg-rose-100',
    iconBg: 'bg-rose-200',
    iconText: 'text-rose-700',
    border: 'border-rose-200',
  },
};

export default function LibraryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (route) => {
    try {
      setIsLoading(true);
      await router.push(route);
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSection = (sectionKey, section) => {
    const colors = SECTION_COLORS[sectionKey];
    const RepresentativeIcon = section.items[0].icon;

    return (
      <div
        className={`
        ${colors.background} rounded-lg p-4 shadow-sm
        transform transition-all duration-300
        hover:scale-102 hover:shadow-md
        border ${colors.border}
        h-full
      `}
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <div
            className={`
            p-2 rounded-lg ${colors.iconBg}
            transform transition-all duration-300
            group-hover:scale-105
          `}
          >
            <RepresentativeIcon className={`w-5 h-5 ${colors.iconText}`} />
          </div>
          <h2 className="text-base font-semibold text-center">{section.title}</h2>
        </div>

        <div className="space-y-1.5">
          {section.items.map((item) => (
            <button
              key={item.route}
              onClick={() => handleClick(item.route)}
              className="w-full"
              disabled={isLoading}
            >
              <div
                className={`
                flex items-center gap-2 p-1.5 rounded-md
                bg-white hover:shadow-sm transition-all duration-300
                ${isLoading ? 'opacity-50' : ''}
              `}
              >
                <div className={`p-1 rounded-md ${colors.iconBg} ${colors.iconText}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => router.back()}
          className="hover:text-primary flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <span>/</span>
        <span>Library</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="col-span-1">{renderSection('core', SECTIONS.core)}</div>

        <div className="col-span-1">{renderSection('services', SECTIONS.services)}</div>

        <div className="col-span-1">{renderSection('tours', SECTIONS.tours)}</div>

        <div className="col-span-1">{renderSection('storage', SECTIONS.storage)}</div>

        <div className="col-span-1">{renderSection('customers', SECTIONS.customers)}</div>

        <div className="col-span-1">{renderSection('designs', SECTIONS.designs)}</div>
      </div>
    </div>
  );
}
