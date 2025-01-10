import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { Edit, Key, Power, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { memo } from 'react';
import { columns } from '../constants/tableColumns';

export const UsersTable = memo(
  ({ users, loadingUserIds, onEdit, onChangePassword, onToggleStatus, onDelete }) => {
    return (
      <Table aria-label="Bảng danh sách">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key} width={column.width}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {users.map((user) => (
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
                    <span className="text-sm font-semibold">{user?.fullName || 'Chưa có tên'}</span>
                    <span className="text-xs text-gray-500">{user?.email || 'Chưa có email'}</span>
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
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : user?.role === 'user'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {user?.role?.toUpperCase() || 'CHƯA CÓ'}
                </span>
              </TableCell>

              {/* Trạng thái */}
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
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

              {/* Actions */}
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400 hover:text-blue-500"
                    onPress={() => onEdit(user)}
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
                    onPress={() => onToggleStatus(user)}
                    isLoading={loadingUserIds.status.includes(user.id)}
                  >
                    <Power size={18} />
                  </Button>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-default-400 hover:text-warning-500"
                    onPress={() => onChangePassword(user)}
                    isLoading={loadingUserIds.password.includes(user.id)}
                  >
                    <Key size={18} />
                  </Button>

                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-danger hover:text-danger-400"
                    onPress={() => onDelete(user)}
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
    );
  }
);

UsersTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      fullName: PropTypes.string,
      email: PropTypes.string,
      role: PropTypes.string,
      status: PropTypes.string,
      department: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ).isRequired,
  loadingUserIds: PropTypes.shape({
    edit: PropTypes.arrayOf(PropTypes.string),
    password: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.arrayOf(PropTypes.string),
    delete: PropTypes.arrayOf(PropTypes.string),
    check: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

UsersTable.displayName = 'UsersTable';
