export const createUserHandlers = ({
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
}) => {
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRefresh = async () => {
    try {
      await fetchUsers();
    } catch (error) {
      notifyError('Có lỗi xảy ra khi tải lại dữ liệu');
    }
  };

  const handleEdit = async (user) => {
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
  };

  const handleEditSubmit = async (formData) => {
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
      await fetchUsers();

      setIsEditModalOpen(false);
      setSelectedUser(null);
      notifySuccess('Cập nhật thông tin thành công');
    } catch (error) {
      notifyError('Không thể cập nhật: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  const handleChangePassword = async (user) => {
    try {
      const exists = await checkUserExists(user.id);
      if (!exists) {
        notifyError('Người dùng không còn tồn tại trong hệ thống');
        await fetchUsers();
        return;
      }
      setSelectedUser(user);
      setIsChangePasswordOpen(true);
    } catch (error) {
      notifyError('Không thể kiểm tra người dùng: ' + error.message);
    }
  };

  const handlePasswordSubmit = async (passwordData) => {
    try {
      const exists = await checkUserExists(selectedUser.id);
      if (!exists) {
        notifyError('Người dùng không còn tồn tại trong hệ thống');
        await fetchUsers();
        setIsChangePasswordOpen(false);
        setSelectedUser(null);
        return false;
      }

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
  };

  const handleToggleStatus = async (user) => {
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
  };

  const handleToggleStatusConfirm = async () => {
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
  };

  const handleDelete = async (user) => {
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
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const exists = await checkUserExists(selectedUser.id);
      if (!exists) {
        notifyError('Người dùng không còn tồn tại trong hệ thống');
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers();
        return;
      }

      await deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  return {
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
  };
};
