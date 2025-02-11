'use client';
import { useAuth } from '@/hooks/useAuth';
import OperatorView from './components/Operator/OperatorView';
export default function OfficePage() {
  const { user } = useAuth();
  const department = user?.department;

  // Nếu không có department, hiển thị thông báo lỗi
  if (!department) {
    return <div>Không có quyền truy cập</div>;
  }

  // Kiểm tra và render view tương ứng
  switch (department) {
    case 'operator':
      return <OperatorView />;
    case 'sales':
      return <OperatorView />;
    default:
      return <div>Không có quyền truy cập</div>;
  }
}
