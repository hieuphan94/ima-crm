const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TourDay = sequelize.define('TourDay', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    tourId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    dayTemplateId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    dayNumber: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    locations: {
        type: DataTypes.JSONB,
        defaultValue: [],
        get() {
            return this.getDataValue('locations') || [];
        }
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        get() {
            return this.getDataValue('images') || [];
        }
    },
    meals: {
        type: DataTypes.JSONB,
        defaultValue: {
            included: false,
            breakfast: false,
            lunch: false,
            dinner: false
        }
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
    tableName: 'tour_days',
    timestamps: true
});

TourDay.associate = (models) => {
    TourDay.belongsTo(models.Tour, {
        foreignKey: 'tourId',
        as: 'tour'
    });

    TourDay.belongsTo(models.DayTemplate, {
        foreignKey: 'dayTemplateId',
        as: 'template'
    });

    TourDay.hasMany(models.TourDayService, {
        foreignKey: 'tourDayId',
        as: 'services'
    });

    TourDay.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'dayCreator'
    });

    TourDay.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'dayUpdater'
    });
};

module.exports = TourDay;