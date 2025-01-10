import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

export default function Breadcrumb({ items }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <button onClick={() => router.back()} className="hover:text-primary flex items-center gap-1">
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>
      {items.map((item, index) => (
        <Fragment key={index}>
          <span>/</span>
          <span>{item}</span>
        </Fragment>
      ))}
    </div>
  );
}
