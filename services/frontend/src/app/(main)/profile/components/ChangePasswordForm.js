'use client';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { showNotification } from '@/store/slices/uiSlice';
import { generatePassword } from '@/utils/generatePassword';
import { Button, CardBody, CardHeader, Input } from '@nextui-org/react';
import { Eye, EyeOff, Wand2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function ChangePasswordForm({
  onCancel,
  loading,
  failedAttempts,
  onFailedAttempt,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const { changePassword } = useProfile();
  const { logout } = useAuth();
  const [countdown, setCountdown] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [visibility, setVisibility] = useState({
    currentPassword: false,
    newPassword: false,
  });
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleVisibility = (field) => {
    setVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleGeneratePassword = useCallback(() => {
    const newPassword = generatePassword();
    setPasswords((prev) => ({
      ...prev,
      newPassword: newPassword,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      onSuccess();

      setCountdown(10);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            logout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to change password:', error);

      if (error.response?.status === 400) {
        onFailedAttempt();

        dispatch(
          showNotification({
            type: 'error',
            message: 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.',
          })
        );
      } else {
        dispatch(
          showNotification({
            type: 'error',
            message: 'Không thể đổi mật khẩu. Vui lòng thử lại sau.',
          })
        );
      }
    }
  };

  // Kiểm tra form hợp lệ
  const isFormValid = passwords.currentPassword && passwords.newPassword;

  return (
    <>
      {countdown !== null && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {error?.response?.status === 401 ? (
              <>
                <p className="text-error-700 text-lg font-medium">Phiên đăng nhập đã hết hạn!</p>
                <p className="text-error-600 mt-2">Bạn sẽ được đăng xuất sau {countdown} giây.</p>
                <p className="text-sm text-gray-500 mt-1">Vui lòng đăng nhập lại để tiếp tục.</p>
              </>
            ) : (
              <>
                <p className="text-warning-700 text-lg font-medium">
                  Mật khẩu đã được thay đổi thành công!
                </p>
                <p className="text-warning-600 mt-2">Bạn sẽ được đăng xuất sau {countdown} giây.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Vui lòng đăng nhập lại với mật khẩu mới.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <div className="w-full flex justify-between items-center">
          <h4 className="text-xl font-bold">Change Password</h4>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Current Password"
              name="currentPassword"
              type={visibility.currentPassword ? 'text' : 'password'}
              value={passwords.currentPassword}
              onChange={handleChange}
              required
              isDisabled={countdown !== null}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => toggleVisibility('currentPassword')}
                  isDisabled={countdown !== null}
                >
                  {visibility.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              }
            />

            <div className="flex gap-2">
              <Input
                label="New Password"
                name="newPassword"
                type={visibility.newPassword ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={handleChange}
                required
                isDisabled={countdown !== null}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => toggleVisibility('newPassword')}
                    isDisabled={countdown !== null}
                  >
                    {visibility.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                }
              />
              <Button
                isIconOnly
                variant="flat"
                onPress={handleGeneratePassword}
                className="h-14"
                isDisabled={countdown !== null}
              >
                <Wand2 size={18} />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 items-center">
            {failedAttempts > 0 && (
              <p className="text-sm mr-auto">
                {failedAttempts >= 5 ? (
                  <span className="text-error-600">
                    Thử sai {failedAttempts} lần. Vui lòng liên hệ Admin qua email:
                    admin@example.com
                  </span>
                ) : (
                  <span className="text-warning-600">Thử sai {failedAttempts} lần</span>
                )}
              </p>
            )}
            <Button
              color="danger"
              variant="flat"
              onPress={onCancel}
              disabled={loading || countdown !== null}
            >
              Cancel
            </Button>
            <Button
              color="warning"
              type="submit"
              isLoading={loading}
              isDisabled={countdown !== null || failedAttempts >= 5 || !isFormValid}
            >
              Change Password
            </Button>
          </div>
        </form>
      </CardBody>
    </>
  );
}
