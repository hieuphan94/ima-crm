'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, CardHeader } from "@nextui-org/react";

export default function DashboardPage() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Thống kê */}
        <Card>
          <CardHeader className="font-bold">Thống kê</CardHeader>
          <CardBody>
            <p>Chào mừng, {user?.username || 'User'}!</p>
            <p>Role: {user?.role || 'N/A'}</p>
            <p>Department: {user?.department || 'N/A'}</p>
          </CardBody>
        </Card>

        {/* Hoạt động gần đây */}
        <Card>
          <CardHeader className="font-bold">Hoạt động gần đây</CardHeader>
          <CardBody>
            <p>Đăng nhập lúc: {new Date().toLocaleString()}</p>
          </CardBody>
        </Card>

        {/* Thông báo */}
        <Card>
          <CardHeader className="font-bold">Thông báo</CardHeader>
          <CardBody>
            <p>Không có thông báo mới</p>
          </CardBody>
        </Card>
      </div>

      {/* Nội dung chính */}
      <Card className="mt-6">
        <CardHeader className="font-bold">Nội dung chính</CardHeader>
        <CardBody>
          <p>Đây là nội dung chính của dashboard.</p>
          <p>Bạn có thể thêm các components và chức năng khác ở đây.</p>
        </CardBody>
      </Card>
    </div>
  );
} 