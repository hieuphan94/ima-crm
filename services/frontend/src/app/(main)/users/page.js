'use client';

import { useUI } from '@/hooks/useUI';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@nextui-org/react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChangePasswordModal,
  DeleteUserModal,
  EditUserModal,
  SearchBar,
  ToggleStatusModal,
} from './components/DynamicComponents';
import { UsersTable } from './components/UsersTable';
import { createUserHandlers } from './handlers/userHandlers';

export default function UsersPage() {
  // States
  const [mounted, setMounted] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isToggleStatusOpen, setIsToggleStatusOpen] = useState(false);

  // Hooks
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

  // Create handlers
  const handlers = useMemo(
    () =>
      createUserHandlers({
        fetchUsers,
        updateUser,
        updateUserStatus,
        deleteUser,
        checkUserExists,
        adminChangeUserPassword,
        notifyError,
        notifySuccess,
        setSelectedUser,
        setIsEditModalOpen,
        setIsChangePasswordOpen,
        setIsDeleteModalOpen,
        setIsToggleStatusOpen,
        setSearchTerm,
        selectedUser,
      }),
    [
      fetchUsers,
      updateUser,
      updateUserStatus,
      deleteUser,
      checkUserExists,
      adminChangeUserPassword,
      notifyError,
      notifySuccess,
      selectedUser,
    ]
  );

  const {
    handleSearch,
    handleRefresh,
    handleEdit,
    handleEditSubmit,
    handleChangePassword,
    handlePasswordSubmit,
    handleToggleStatus,
    handleToggleStatusConfirm,
    handleDelete,
    handleDeleteConfirm,
  } = handlers;

  // Effects
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  // Filter users
  const filteredUsers = useMemo(
    () =>
      searchTerm
        ? users?.filter(
            (user) =>
              user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : users,
    [users, searchTerm]
  );

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
      {/* Header */}
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

      {/* Table with empty states */}
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
            Không tìm thấy người dùng nào khớp với từ khóa &quot;{searchTerm}&quot;
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
        <UsersTable
          users={filteredUsers}
          loadingUserIds={loadingUserIds}
          onEdit={handleEdit}
          onChangePassword={handleChangePassword}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}

      {/* Modals */}
      {mounted && (
        <>
          {isEditModalOpen && (
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
          )}

          {isChangePasswordOpen && (
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
          )}

          {isDeleteModalOpen && (
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
          )}

          {isToggleStatusOpen && (
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
          )}
        </>
      )}
    </div>
  );
}
