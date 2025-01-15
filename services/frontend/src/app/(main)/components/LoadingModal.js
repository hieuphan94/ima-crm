'use client';

export default function LoadingModal({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]" />
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]" />
      </div>
    </div>
  );
}
