import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteUserModal({ isOpen, onClose, onConfirm, user, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center text-warning">
          <AlertTriangle className="w-5 h-5" />
          Xác nhận xóa người dùng
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="text-sm">
              Bạn có chắc chắn muốn xóa người dùng:{' '}
              <span className="font-medium">{user?.username}</span>?
            </div>
            <div className="text-sm text-gray-500">
              Hành động này không thể hoàn tác. Tất cả dữ liệu của người dùng sẽ bị xóa vĩnh viễn.
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={loading}>
            Hủy
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={loading} isDisabled={loading}>
            Xác nhận xóa
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
