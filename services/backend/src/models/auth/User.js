// src/models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcryptjs');
const CONSTANTS = require('../../constants');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fullName: {
        type: DataTypes.STRING(100)
    },
    role: {
        type: DataTypes.STRING(20),
        defaultValue: CONSTANTS.ROLES.USER,
        validate: {
            isIn: {
                args: [CONSTANTS.VALID_ROLES],
                msg: `Role must be one of: ${CONSTANTS.VALID_ROLES.join(', ')}`
            }
        }
    },
    department: {
        type: DataTypes.STRING(50),
        validate: {
            isIn: {
                args: [CONSTANTS.VALID_DEPARTMENTS],
                msg: `Department must be one of: ${CONSTANTS.VALID_DEPARTMENTS.join(', ')}`
            }
        }
    },
    status: {
        type: DataTypes.STRING(20),
        defaultValue: CONSTANTS.STATUS.ACTIVE,
        validate: {
            isIn: {
                args: [CONSTANTS.VALID_STATUS],
                msg: `Status must be one of: ${CONSTANTS.VALID_STATUS.join(', ')}`
            }
        }
    }
}, {
    timestamps: true,
    tableName: 'users',
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

// Instance method để check password
User.prototype.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Class methods
User.createUser = async function(userData) {
    return this.create(userData);
};

User.findByEmail = async function(email) {
    return this.findOne({ where: { email } });
};

User.findByUsername = async function(username) {
    return this.findOne({ where: { username } });
};

module.exports = User;