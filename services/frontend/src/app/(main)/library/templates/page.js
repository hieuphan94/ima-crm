'use client';

import { Button, Input } from '@nextui-org/react';
import { ChevronLeft, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AddDayTemplateModal from './components/AddDayTemplateModal';
import AddServiceModal from './components/AddServiceModal';

// Mock data với đường dẫn hình từ public folder
const dayTemplates = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Day Template ${i + 1}`,
  location: `Location ${i + 1}`,
  languages: ['en', 'fr', 'de'],
}));

// Mock data cho services
const services = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Service ${i + 1}`,
  location: `Location ${i + 1}`,
}));

export default function TemplatesPage() {
  const router = useRouter();
  const [isDayTemplateModalOpen, setIsDayTemplateModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => router.back()}
          className="hover:text-primary flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <span>/</span>
        <span>Templates</span>
      </div>

      <h1 className="text-2xl font-bold">Templates Management</h1>

      {/* Main content with 50-50 split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Day Templates Section */}
        <div className="p-6 rounded-xl bg-blue-100 shadow-lg space-y-4">
          {/* Search and Add New in same row */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
              <Input
                placeholder="Search day templates..."
                classNames={{
                  base: 'max-w-full',
                  inputWrapper: [
                    'bg-gray-50/80',
                    'hover:bg-gray-50',
                    'transition-colors',
                    '!cursor-text',
                    'h-[38px]',
                  ],
                }}
                variant="flat"
                size="md"
                startContent={
                  <Search className="w-4 h-4 text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <Button
              color="primary"
              size="md"
              className="shrink-0 h-[38px]"
              onPress={() => setIsDayTemplateModalOpen(true)}
            >
              Add New
            </Button>
          </div>

          {/* Day Templates List */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              <div className="space-y-0 h-[300px] overflow-y-auto pr-2">
                {dayTemplates.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4 p-2 hover:bg-blue-50 rounded-lg group">
                      {/* Image */}
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                        <Image
                          src="/images/img-demo.jpg"
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-sm text-gray-500 truncate">{item.location}</div>
                      </div>

                      {/* Actions Column */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Delete button */}
                        <button
                          className="p-1.5 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Language flags with label */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">có ngôn ngữ:</span>
                          <div className="flex gap-0.5">
                            <div className="w-4 h-4 relative" title="English">
                              <Image
                                src="/images/flags/en.png"
                                alt="English"
                                fill
                                className="object-cover rounded"
                                sizes="16px"
                              />
                            </div>
                            <div className="w-4 h-4 relative" title="French">
                              <Image
                                src="/images/flags/fr.png"
                                alt="French"
                                fill
                                className="object-cover rounded"
                                sizes="16px"
                              />
                            </div>
                            <div className="w-4 h-4 relative" title="German">
                              <Image
                                src="/images/flags/de.png"
                                alt="German"
                                fill
                                className="object-cover rounded"
                                sizes="16px"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < dayTemplates.length - 1 && (
                      <div className="h-[1px] bg-gray-100 mx-2" />
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                <div>Showing 1-5 of 10 items</div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded">1</button>
                  <button className="px-2 py-1 hover:bg-gray-100 rounded">2</button>
                  <button className="p-1 hover:bg-gray-100 rounded">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Repository Section */}
        <div className="p-6 rounded-xl bg-purple-200 shadow-lg space-y-4">
          {/* Search and Add New row */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
              <Input
                placeholder="Search services..."
                classNames={{
                  base: 'max-w-full',
                  inputWrapper: [
                    'bg-gray-50/80',
                    'hover:bg-gray-50',
                    'transition-colors',
                    '!cursor-text',
                    'h-[38px]',
                  ],
                }}
                variant="flat"
                size="md"
                startContent={
                  <Search className="w-4 h-4 text-default-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>
            <Button
              color="secondary"
              size="md"
              className="shrink-0 h-[38px]"
              onPress={() => setIsServiceModalOpen(true)}
            >
              Add New
            </Button>
          </div>

          {/* Services List */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="space-y-2">
              {/* Table content - scrollable */}
              <div className="space-y-0 h-[300px] overflow-y-auto pr-2">
                {services.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-4 p-2 hover:bg-purple-50 rounded-lg group">
                      {/* Image */}
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                        <Image
                          src="/images/img-demo.jpg"
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">{item.name}</div>
                        <div className="text-sm text-gray-500 truncate">{item.location}</div>
                      </div>

                      {/* Actions Column */}
                      <div className="flex flex-col items-end gap-2">
                        {/* Delete button */}
                        <button
                          className="p-1.5 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Language flags with label */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">có ngôn ngữ:</span>
                          <div className="flex gap-0.5">
                            <div className="w-4 h-4 relative" title="English">
                              <Image
                                src="/images/flags/en.png"
                                alt="English"
                                fill
                                className="object-cover rounded"
                                sizes="16px"
                              />
                            </div>
                            <div className="w-4 h-4 relative" title="French">
                              <Image
                                src="/images/flags/fr.png"
                                alt="French"
                                fill
                                className="object-cover rounded"
                                sizes="16px"
                              />
                            </div>
                            <div className="w-4 h-4 relative" title="German">
                              <Image
                                src="/images/flags/de.png"
                                alt="German"
                                fill
                                className="object-cover rounded"
                                sizes="16px"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < services.length - 1 && <div className="h-[1px] bg-gray-100 mx-2" />}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pt-4 border-t flex items-center justify-between text-sm text-gray-500">
                <div>Showing 1-5 of 10 items</div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded disabled:opacity-50" disabled>
                    Previous
                  </button>
                  <button className="px-2 py-1 bg-purple-100 text-purple-700 rounded">1</button>
                  <button className="px-2 py-1 hover:bg-gray-100 rounded">2</button>
                  <button className="p-1 hover:bg-gray-100 rounded">Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDayTemplateModal
        isOpen={isDayTemplateModalOpen}
        onClose={() => setIsDayTemplateModalOpen(false)}
      />
      <AddServiceModal isOpen={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} />
    </div>
  );
}
