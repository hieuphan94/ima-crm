'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DayTemplatesPage() {
  const router = useRouter();

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
        <span>Day Templates</span>
      </div>

      <h1 className="text-2xl font-bold">Day Templates</h1>
      {/* Table component sẽ được thêm sau */}
    </div>
  );
}
