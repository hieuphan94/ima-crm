'use client';
import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
} 