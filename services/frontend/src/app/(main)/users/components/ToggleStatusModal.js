import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { AlertTriangle } from 'lucide-react';

export function ToggleStatusModal({ isOpen, onClose, onConfirm, user, loading }) {
  const newStatus = user?.status === 'active' ? 'inactive' : 'active';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center text-warning">
          <AlertTriangle className="w-5 h-5" />
          Xác nhận thay đổi trạng thái
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="text-sm">
              Bạn có chắc chắn muốn {newStatus === 'active' ? 'active' : 'inactive'} người dùng:{' '}
              <span className="font-medium">{user?.username}</span>?
            </div>
            <div className="text-sm text-gray-500">
              {newStatus === 'active'
                ? 'Người dùng sẽ có thể đăng nhập và sử dụng hệ thống.'
                : 'Người dùng sẽ không thể đăng nhập vào hệ thống cho đến khi được kích hoạt lại.'}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            Hủy
          </Button>
          <Button
            color={newStatus === 'active' ? 'success' : 'danger'}
            onPress={onConfirm}
            isLoading={loading}
            isDisabled={loading}
          >
            {loading ? 'Đang xử lý...' : newStatus === 'active' ? 'active' : 'inactive'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
