'use client';

import { Spinner } from '@nextui-org/react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm"><Spinner size="lg" />
    </div>
  );
}
