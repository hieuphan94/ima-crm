'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component đơn giản
const EditorLoading = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="border-b border-gray-200 p-2 h-10 bg-gray-50 animate-pulse" />
    <div className="p-4 h-[200px] bg-gray-50 animate-pulse" />
  </div>
);

// Dynamic import TiptapEditor
const DynamicTiptapEditor = dynamic(() => import('./TiptapEditorComponent'), {
  loading: () => <EditorLoading />,
  ssr: false, // Disable SSR vì Tiptap cần window object
});

// Export wrapped component
const TiptapEditor = ({ content = '', onChange }) => {
  return (
    <Suspense fallback={<EditorLoading />}>
      <DynamicTiptapEditor content={content} onChange={onChange} />
    </Suspense>
  );
};

export default TiptapEditor;
