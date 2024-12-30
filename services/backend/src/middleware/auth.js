const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.auth = async (req, res, next) => {
    try {
        // Lấy token từ header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                message: 'No token, authorization denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Tìm user
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'User not found'
            });
        }

        // Kiểm tra status
        if (user.status !== 'active') {
            return res.status(401).json({
                message: 'Account is not active'
            });
        }

        // Gán user vào request
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            message: 'Access denied. Admin role required.'
        });
    }
    next();
};