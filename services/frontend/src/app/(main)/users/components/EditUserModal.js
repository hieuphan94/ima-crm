import { DEPARTMENTS } from '@/constants';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useCallback, useEffect, useState } from 'react';

export default function EditUserModal({ isOpen, onClose, onSubmit, user, loading }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
  });

  const [errors, setErrors] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        department: user.department?.toLowerCase() || '',
      });
    }
  }, [user]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.department) {
      newErrors.department = 'Vui lòng chọn phòng ban';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
      setIsConfirming(false);
    } catch (error) {
      console.error('Submit error:', error);
    }
  }, [formData, validateForm, onSubmit, onClose, isConfirming]);

  const handleClose = useCallback(() => {
    setFormData({
      fullName: '',
      email: '',
      department: '',
    });
    setErrors({});
    setIsConfirming(false);
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalContent>
        <ModalHeader>Chỉnh sửa thông tin người dùng</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                errorMessage={errors.fullName}
                isDisabled={loading}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                errorMessage={errors.email}
                isDisabled={loading}
              />
            </div>

            <div className="w-1/3">
              <Select
                label="Phòng ban"
                selectedKeys={formData.department ? new Set([formData.department]) : new Set()}
                disallowEmptySelection={true}
                onChange={(e) => {
                  setFormData({ ...formData, department: e.target.value });
                }}
                errorMessage={errors.department}
                isDisabled={loading}
              >
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-between items-center">
            {isConfirming && (
              <p className="text-sm text-warning-500">
                Bạn có chắc chắn muốn cập nhật thông tin người dùng này?
              </p>
            )}
            {!isConfirming && <div />}
            <div className="flex gap-2">
              <Button variant="light" onPress={handleClose} isDisabled={loading}>
                Hủy
              </Button>
              <Button
                color={isConfirming ? 'warning' : 'primary'}
                onPress={handleSubmit}
                isLoading={loading}
                isDisabled={loading}
              >
                {isConfirming ? 'Xác nhận' : 'Lưu'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
