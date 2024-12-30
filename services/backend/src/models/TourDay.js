const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourDay = sequelize.define('TourDay', {
    tourId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dayNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    tableName: 'tour_days'
});

module.exports = TourDay;