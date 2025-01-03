'use client';

import { Button } from "@nextui-org/react";

export default function Error({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Đã xảy ra lỗi!</h2>
      <Button 
        color="primary"
        onClick={() => reset()}
      >
        Thử lại
      </Button>
    </div>
  );
} 