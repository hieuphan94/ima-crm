'use client';

import { Card, CardBody } from '@nextui-org/react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LIBRARY_ITEMS } from './constants/library-items';

export default function LibraryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  console.log('LibraryPage mounted');

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

      <h1 className="text-2xl font-bold">Library Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LIBRARY_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => handleClick(item.route)}
              className="w-full"
              disabled={isLoading}
            >
              <Card
                className={`
                hover:scale-105 transition-transform cursor-pointer
                ${isLoading ? 'opacity-50' : ''}
              `}
              >
                <CardBody className="flex flex-row items-center gap-4 p-6">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                  </div>
                </CardBody>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
