const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourDayService = sequelize.define('TourDayService', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tourDayId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'tour_days',
            key: 'id'
        }
    },
    serviceCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'service_categories',
            key: 'id'
        }
    },
    note: {
        type: DataTypes.TEXT
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'tour_day_services',
    timestamps: true
});

TourDayService.associate = (models) => {
    TourDayService.belongsTo(models.TourDay, {
        foreignKey: 'tourDayId',
        as: 'tourDay'
    });

    TourDayService.belongsTo(models.ServiceCategory, {
        foreignKey: 'serviceCategoryId',
        as: 'serviceCategory'
    });

    TourDayService.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'serviceCreator'
    });

    TourDayService.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'serviceUpdater'
    });
};

module.exports = TourDayService;