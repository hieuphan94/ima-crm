const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourService = sequelize.define('TourService', {
    tourDayId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    serviceType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    serviceName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supplierId: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
    },
    estimatedPrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    finalPrice: {
        type: DataTypes.DECIMAL(10, 2)
    },
    notes: {
        type: DataTypes.TEXT
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true,
    tableName: 'tour_services'
});

module.exports = TourService;