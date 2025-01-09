'use client';

import { useUI } from '@/hooks/useUI';
import { useUsers } from '@/hooks/useUsers';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { AlertCircle, Edit, Key, Power, RefreshCw, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { DeleteUserModal } from './components/DeleteUserModal';
import { EditUserModal } from './components/EditUserModal';
import { SearchBar } from './components/SearchBar';
import { ToggleStatusModal } from './components/ToggleStatusModal';

const columns = [
  {
    key: 'userInfo',
    label: 'THÔNG TIN',
    width: '30%', // Cột này sẽ rộng hơn vì chứa nhiều thông tin
  },
  {
    key: 'username',
    label: 'TÊN ĐĂNG NHẬP',
  },
  {
    key: 'role',
    label: 'VAI TRÒ',
  },
  {
    key: 'status',
    label: 'TRẠNG THÁI',
  },
  {
    key: 'department',
    label: 'PHÒNG BAN',
  },
  {
    key: 'dates',
    label: 'THỜI GIAN',
    width: '20%', // Cột này sẽ rộng hơn để hiển thị cả ngày tạo và cập nhật
  },
  {
    key: 'actions',
    label: 'THAO TÁC',
    width: '220px', // Đủ rộng cho 4 nút
  },
];

export default function UsersPage() {
  const {
    users,
    loading,
    loadingUserIds,
    error,
    fetchUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    checkUserExists,
    adminChangeUserPassword,
  } = useUsers();
  const { notifyError, notifySuccess } = useUI();
  const hasFetchedRef = useRef(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = searchTerm
    ? users?.filter(
        (user) =>
          user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      await fetchUsers();
    } catch (error) {
      notifyError('Có lỗi xảy ra khi tải lại dữ liệu');
    }
  }, [fetchUsers, notifyError]);

  const handleEdit = useCallback(
    async (user) => {
      try {
        const exists = await checkUserExists(user.id);
        if (!exists) {
          notifyError('Người dùng không còn tồn tại trong hệ thống');
          await fetchUsers();
          return;
        }
        setSelectedUser(user);
        setIsEditModalOpen(true);
      } catch (error) {
        notifyError('Không thể kiểm tra người dùng: ' + error.message);
      }
    },
    [checkUserExists, fetchUsers, notifyError]
  );

  const handleEditSubmit = useCallback(
    async (formData) => {
      if (!selectedUser) return;

      try {
        const exists = await checkUserExists(selectedUser.id);
        if (!exists) {
          notifyError('Người dùng không còn tồn tại trong hệ thống');
          setIsEditModalOpen(false);
          setSelectedUser(null);
          await fetchUsers();
          return;
        }

        await updateUser(selectedUser.id, formData);
        await fetchUsers(); // Refresh data sau khi cập nhật

        setIsEditModalOpen(false);
        setSelectedUser(null);
        notifySuccess('Cập nhật thông tin thành công');
      } catch (error) {
        notifyError('Không thể cập nhật: ' + (error.message || 'Đã có lỗi xảy ra'));
      }
    },
    [selectedUser, checkUserExists, updateUser, fetchUsers, notifyError, notifySuccess]
  );

  const handleChangePassword = useCallback(
    async (user) => {
      try {
        const exists = await checkUserExists(user.id);
        if (!exists) {
          notifyError('Người dùng không còn tồn tại trong hệ thống');
          await fetchUsers(); // Refresh lại danh sách
          return;
        }

        // Chỉ set selected user và mở modal khi user tồn tại
        setSelectedUser(user);
        setIsChangePasswordOpen(true);
      } catch (error) {
        notifyError('Không thể kiểm tra người dùng: ' + error.message);
      }
    },
    [checkUserExists, fetchUsers, notifyError]
  );

  const handlePasswordSubmit = useCallback(
    async (passwordData) => {
      try {
        const exists = await checkUserExists(selectedUser.id);
        if (!exists) {
          notifyError('Người dùng không còn tồn tại trong hệ thống');
          await fetchUsers(); // Chỉ fetch khi user không tồn tại
          setIsChangePasswordOpen(false);
          setSelectedUser(null);
          return false;
        }

        // Chỉ đổi password, KHÔNG fetch lại
        await adminChangeUserPassword(selectedUser.id, passwordData);

        setIsChangePasswordOpen(false);
        setSelectedUser(null);
        return true;
      } catch (error) {
        if (error.response?.status === 400) {
          notifyError('Mật khẩu không hợp lệ. Vui lòng thử lại');
        } else {
          notifyError('Không thể đổi mật khẩu: ' + (error.message || 'Đã có lỗi xảy ra'));
        }
        return false;
      }
    },
    [selectedUser, checkUserExists, adminChangeUserPassword, fetchUsers, notifyError]
  );

  const handleToggleStatus = useCallback(
    async (user) => {
      try {
        const exists = await checkUserExists(user.id);
        if (!exists) {
          notifyError('Người dùng không còn tồn tại trong hệ thống');
          await fetchUsers();
          return;
        }
        setSelectedUser(user);
        setIsToggleStatusOpen(true);
      } catch (error) {
        notifyError('Không thể kiểm tra người dùng: ' + error.message);
      }
    },
    [checkUserExists, fetchUsers, notifyError]
  );

  const handleToggleStatusConfirm = useCallback(async () => {
    if (!selectedUser) return;

    try {
      const exists = await checkUserExists(selectedUser.id);
      if (!exists) {
        notifyError('Người dùng không còn tồn tại trong hệ thống');
        setIsToggleStatusOpen(false);
        setSelectedUser(null);
        await fetchUsers();
        return;
      }

      await updateUserStatus(
        selectedUser.id,
        selectedUser.status === 'active' ? 'inactive' : 'active'
      );
      setIsToggleStatusOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setIsToggleStatusOpen(false);
      setSelectedUser(null);
    }
  }, [selectedUser, checkUserExists, updateUserStatus, fetchUsers, notifyError]);

  const handleDelete = useCallback(
    async (user) => {
      try {
        const exists = await checkUserExists(user.id);
        if (!exists) {
          notifyError('Người dùng không còn tồn tại trong hệ thống');
          await fetchUsers();
          return;
        }
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
      } catch (error) {
        notifyError('Không thể kiểm tra người dùng: ' + error.message);
      }
    },
    [checkUserExists, fetchUsers, notifyError]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedUser) return;

    try {
      // Check user exists again before delete
      const exists = await checkUserExists(selectedUser.id);
      if (!exists) {
        notifyError('Người dùng không còn tồn tại trong hệ thống');
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers(); // Refresh list
        return;
      }

      // Proceed with delete if user exists
      await deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error is already handled in useUsers hook
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  }, [selectedUser, checkUserExists, deleteUser, fetchUsers, notifyError]);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetchedRef.current) {
        try {
          await fetchUsers();
        } catch (error) {
          notifyError('Có lỗi xảy ra khi tải dữ liệu');
        }
        hasFetchedRef.current = true;
      }
    };
    fetchData();
  }, [fetchUsers, notifyError]);

  // Loading state
  if (loading && !users?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <AlertCircle className="w-12 h-12 text-danger mb-4" />
          <h2 className="text-xl font-semibold text-danger mb-2">Không thể tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            color="primary"
            variant="flat"
            onPress={handleRefresh}
            startContent={<RefreshCw className="w-4 h-4" />}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-semibold">Danh sách người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">
            Hiển thị {filteredUsers?.length || 0} người dùng
            {searchTerm && ` (đang tìm: "${searchTerm}")`}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <SearchBar onSearch={handleSearch} loading={loading} />
          <Button
            isIconOnly
            variant="light"
            onPress={handleRefresh}
            isLoading={loading}
            className="p-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Table with filtered results */}
      {users?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Chưa có người dùng thường nào trong hệ thống</p>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            className="mt-2"
            onPress={handleRefresh}
            startContent={<RefreshCw className="w-4 h-4" />}
          >
            Tải lại dữ liệu
          </Button>
        </div>
      ) : filteredUsers?.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Không tìm thấy người dùng nào khớp với từ khóa "{searchTerm}"
          </p>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            className="mt-2"
            onPress={() => setSearchTerm('')}
          >
            Xóa tìm kiếm
          </Button>
        </div>
      ) : (
        <Table aria-label="Bảng danh sách">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} width={column.width}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user?.id}>
                {/* Cột thông tin người dùng */}
                <TableCell>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'unknown'}`}
                        alt={`Avatar của ${user?.fullName || 'Người dùng'}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {user?.fullName || 'Chưa có tên'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user?.email || 'Chưa có email'}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Tên đăng nhập */}
                <TableCell>
                  <span className="text-sm">{user?.username || 'N/A'}</span>
                </TableCell>

                {/* Vai trò */}
                <TableCell>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium
                    {user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                     user?.role === 'user' ? 'bg-blue-100 text-blue-700' : 
                     'bg-gray-100 text-gray-700'}"
                  >
                    {user?.role?.toUpperCase() || 'CHƯA CÓ'}
                  </span>
                </TableCell>

                {/* Trạng thái */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                    ${
                      user?.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user?.status === 'active' ? 'active' : 'inactive'}
                  </span>
                </TableCell>

                {/* Phòng ban */}
                <TableCell>
                  <span className="capitalize text-sm">
                    {user?.department || 'Chưa có phòng ban'}
                  </span>
                </TableCell>

                {/* Thời gian */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="text-xs">
                      <span className="font-medium">Tạo: </span>
                      {user?.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Cập nhật: </span>
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleString('vi-VN') : 'N/A'}
                    </div>
                  </div>
                </TableCell>

                {/* Thêm cột actions */}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400 hover:text-blue-500"
                      onPress={() => handleEdit(user)}
                      isLoading={loadingUserIds.edit.includes(user.id)}
                    >
                      <Edit size={18} />
                    </Button>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className={`${
                        user?.status === 'active'
                          ? 'text-success hover:text-success-400'
                          : 'text-danger hover:text-danger-400'
                      }`}
                      onPress={() => handleToggleStatus(user)}
                      isLoading={loadingUserIds.status.includes(user.id)}
                    >
                      <Power size={18} />
                    </Button>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-default-400 hover:text-warning-500"
                      onPress={() => handleChangePassword(user)}
                      isLoading={loadingUserIds.password.includes(user.id)}
                    >
                      <Key size={18} />
                    </Button>

                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      className="text-danger hover:text-danger-400"
                      onPress={() => handleDelete(user)}
                      isLoading={loadingUserIds.delete.includes(user.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleEditSubmit}
        user={selectedUser}
        loading={
          selectedUser
            ? loadingUserIds.edit.includes(selectedUser.id) ||
              loadingUserIds.check.includes(selectedUser.id)
            : false
        }
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => {
          setIsChangePasswordOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handlePasswordSubmit}
        user={selectedUser}
        loading={selectedUser ? loadingUserIds.password.includes(selectedUser.id) : false}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteConfirm}
        user={selectedUser}
        loading={
          selectedUser
            ? loadingUserIds.delete.includes(selectedUser.id) ||
              loadingUserIds.check.includes(selectedUser.id)
            : false
        }
      />

      <ToggleStatusModal
        isOpen={isToggleStatusOpen}
        onClose={() => {
          setIsToggleStatusOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleToggleStatusConfirm}
        user={selectedUser}
        loading={
          selectedUser
            ? loadingUserIds.status.includes(selectedUser.id) ||
              loadingUserIds.check.includes(selectedUser.id)
            : false
        }
      />
    </div>
  );
}
