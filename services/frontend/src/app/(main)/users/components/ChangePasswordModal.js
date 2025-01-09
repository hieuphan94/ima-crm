import { generatePassword } from '@/utils/generatePassword';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import { useCallback, useState } from 'react';

export function ChangePasswordModal({ isOpen, onClose, onSubmit, user, loading }) {
  const [newPassword, setNewPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const isPasswordValid = newPassword.length >= 8;

  const handleSubmit = useCallback(async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    if (!isPasswordValid) {
      return;
    }

    try {
      const success = await onSubmit({ newPassword: newPassword });
      if (success) {
        setNewPassword('');
        setIsVisible(false);
        setIsConfirming(false);
        onClose();
      } else {
        setIsConfirming(false);
      }
    } catch (error) {
      console.error('Password change error:', error);
      setIsConfirming(false);
    }
  }, [isConfirming, isPasswordValid, newPassword, onSubmit, onClose]);

  const handleClose = useCallback(() => {
    setNewPassword('');
    setIsVisible(false);
    setIsConfirming(false);
    onClose();
  }, [onClose]);

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword();
    setNewPassword(newPassword);
  }, []);

  const toggleVisibility = useCallback(() => setIsVisible(!isVisible), [isVisible]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>Đổi mật khẩu</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Đổi mật khẩu cho người dùng: <span className="font-medium">{user?.username}</span>
            </div>
            <div className="flex gap-2">
              <Input
                disabled={loading}
                type={isVisible ? 'text' : 'password'}
                label="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                errorMessage={
                  newPassword && !isPasswordValid ? 'Mật khẩu phải có ít nhất 8 ký tự' : ''
                }
                endContent={
                  <Button isIconOnly variant="light" size="sm" onPress={toggleVisibility}>
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                }
              />
              <Button isIconOnly variant="flat" onPress={handleGeneratePassword} className="h-14">
                <Wand2 size={18} />
              </Button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-between items-center">
            {isConfirming && (
              <p className="text-sm text-warning-500">
                Bạn có chắc muốn đổi mật khẩu cho người dùng này?
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
                isDisabled={!isPasswordValid || loading}
              >
                {isConfirming ? 'Xác nhận' : 'Đổi'}
              </Button>
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
