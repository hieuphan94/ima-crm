const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tour = sequelize.define('Tour', {
    code: {
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'draft'
    },
    currentDepartment: {
        type: DataTypes.STRING,
        defaultValue: 'sales'
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING
    },
    estimatedPrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    finalPrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    tableName: 'tours'
});

module.exports = Tour;