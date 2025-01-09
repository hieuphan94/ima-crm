// src/controllers/userController.js
const { User, Tour } = require('../models');
const jwt = require('jsonwebtoken');
const CONSTANTS = require('../constants');


class UserController {
    // 1. Đăng ký user mới
    static async register(req, res) {
        try {
            const { username, email, password, fullName, department } = req.body;

            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({
                    message: 'Username, email and password are required'
                });
            }

            // Kiểm tra email đã tồn tại
            const existingEmail = await User.findByEmail(email);
            if (existingEmail) {
                return res.status(400).json({
                    message: 'Email already exists'
                });
            }

            // Kiểm tra username đã tồn tại
            const existingUsername = await User.findByUsername(username);
            if (existingUsername) {
                return res.status(400).json({
                    message: 'Username already exists'
                });
            }

            // Tạo user mới
            const user = await User.createUser({
                username,
                email,
                password,
                fullName,
                department
            });

            // Loại bỏ password trước khi trả về
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;

            res.status(201).json({
                message: 'User registered successfully',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                message: 'Error registering user',
                error: error.message
            });
        }
    }

    // 2. Đăng nhập
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({
                    message: 'Email and password are required'
                });
            }

            // Tìm user theo email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Kiểm tra password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid email or password'
                });
            }

            // Kiểm tra status
            if (user.status !== CONSTANTS.STATUS.ACTIVE) {
                return res.status(401).json({
                    message: 'Account is not active'
                });
            }

            // Tạo token
            const token = jwt.sign(
                { 
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    department: user.department
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    department: user.department
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                message: 'Error logging in',
                error: error.message
            });
        }
    }

    // 3. Lấy thông tin user
    static async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.json({
                message: 'Profile retrieved successfully',
                user
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                message: 'Error retrieving profile',
                error: error.message
            });
        }
    }

    // 4. Cập nhật thông tin user
    static async updateProfile(req, res) {
        try {
            const { fullName, username } = req.body;
            const userId = req.user.id;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Kiểm tra username đã tồn tại chưa (nếu có thay đổi)
            if (username && username !== user.username) {
                const existingUsername = await User.findByUsername(username);
                if (existingUsername) {
                    return res.status(400).json({
                        message: 'Username already exists'
                    });
                }
                user.username = username;
            }

            // Cập nhật thông tin khác
            if (fullName) user.fullName = fullName;

            await user.save();

            res.json({
                message: 'Profile updated successfully',
            });

        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                message: 'Error updating profile',
                error: error.message
            });
        }
    }

    // 5. Lấy danh sách users (Admin only)
    static async getUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = '', department } = req.query;
            const offset = (page - 1) * limit;

            let whereClause = {};
            
            if (search) {
                whereClause = {
                    [Op.or]: [
                        { username: { [Op.iLike]: `%${search}%` } },
                        { email: { [Op.iLike]: `%${search}%` } },
                        { fullName: { [Op.iLike]: `%${search}%` } }
                    ]
                };
            }

            if (department) {
                whereClause.department = department;
            }

            const users = await User.findAndCountAll({
                where: whereClause,
                attributes: { exclude: ['password'] },
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            res.json({
                message: 'Users retrieved successfully',
                data: {
                    users: users.rows,
                    total: users.count,
                    totalPages: Math.ceil(users.count / limit),
                    currentPage: parseInt(page)
                }
            });

        } catch (error) {
            console.error('Get users error:', error);
            res.status(500).json({
                message: 'Error retrieving users',
                error: error.message
            });
        }
    }

    // 6. Lấy thông tin user theo id (Admin only)
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user });
        } catch (error) {
            console.error('Get user by id error:', error);
            res.status(500).json({ message: 'Error retrieving user', error: error.message });
        }
    }

    // 6. Cập nhật status user (Admin only)
    static async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            user.status = status;
            await user.save();

            res.json({
                message: 'User status updated successfully',
                user: {
                    id: user.id,
                    username: user.username,
                    status: user.status
                }
            });

        } catch (error) {
            console.error('Update user status error:', error);
            res.status(500).json({
                message: 'Error updating user status',
                error: error.message
            });
        }
    }

    // 7. Xóa user (Admin only)
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
    
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
    
            // Kiểm tra role admin
            if (user.role === 'admin') {
                return res.status(403).json({
                    message: 'Cannot delete admin user'
                });
            }
    
            // Kiểm tra self-delete
            if (user.id === req.user.id) {
                return res.status(403).json({
                    message: 'Cannot delete your own account'
                });
            }
    
            // Xóa user
            await user.destroy();
    
            res.json({
                message: 'User deleted successfully'
            });
    
        } catch (error) {
            console.error('Delete user error:', error);
            res.status(500).json({
                message: 'Error deleting user',
                error: error.message
            });
        }
    }

    // 8. Đổi mật khẩu
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const isValidPassword = await user.comparePassword(currentPassword);
            if (!isValidPassword) {
                return res.status(400).json({
                    message: 'Current password is incorrect'
                });
            }

            user.password = newPassword;
            await user.save();

            res.json({
                message: 'Password changed successfully'
            });

        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({
                message: 'Error changing password',
                error: error.message
            });
        }
    }

    // Admin đổi mật khẩu cho user
    static async changeUserPassword(req, res) {
        try {
            const { id } = req.params; // ID của user cần đổi mật khẩu
            const { newPassword } = req.body;

            // Validate input
            if (!newPassword) {
                return res.status(400).json({
                    message: 'New password is required'
                });
            }

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Kiểm tra không cho phép admin đổi mật khẩu của admin khác
            if (user.role === CONSTANTS.ROLES.ADMIN && user.id !== req.user.id) {
                return res.status(403).json({
                    message: 'Cannot change password of other admin users'
                });
            }

            user.password = newPassword;
            await user.save();

            res.json({
                message: 'User password changed successfully'
            });

        } catch (error) {
            console.error('Change user password error:', error);
            res.status(500).json({
                message: 'Error changing user password',
                error: error.message
            });
        }
    }

    static async updateUserByAdmin(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body; // Lấy tất cả các trường được gửi lên

            // Tìm user cần update
            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Kiểm tra không cho phép admin sửa thông tin của admin khác
            if (user.role === CONSTANTS.ROLES.ADMIN && user.id !== req.user.id) {
                return res.status(403).json({
                    message: 'Cannot update information of other admin users'
                });
            }

            // Kiểm tra email đã tồn tại chưa (chỉ khi email được gửi lên và khác email hiện tại)
            if (updates.email && updates.email !== user.email) {
                const existingUser = await User.findOne({ where: { email: updates.email } });
                if (existingUser) {
                    return res.status(400).json({
                        message: 'Email already exists'
                    });
                }
            }

            // Validate department
            if (updates.department && !CONSTANTS.VALID_DEPARTMENTS.includes(updates.department.toLowerCase())) {
                return res.status(400).json({
                    message: `Invalid department. Must be one of: ${CONSTANTS.VALID_DEPARTMENTS.join(', ')}`
                });
            }

            // Cập nhật từng trường nếu có
            if (updates.fullName !== undefined) user.fullName = updates.fullName;
            if (updates.email !== undefined) user.email = updates.email;
            if (updates.department !== undefined) user.department = updates.department;

            await user.save();

            // Loại bỏ password trước khi trả về
            const userWithoutPassword = user.toJSON();
            delete userWithoutPassword.password;

            res.json({
                message: 'User updated successfully',
                user: userWithoutPassword
            });

        } catch (error) {
            console.error('Update user error:', error);
            res.status(500).json({
                message: 'Error updating user',
                error: error.message
            });
        }
    }
}

module.exports = UserController;