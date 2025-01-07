'use client';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Trang bạn tìm kiếm không tồn tại.</p>
      <Link href="/">
        <Button color="primary">Về trang chủ</Button>
      </Link>
    </div>
  );
}
