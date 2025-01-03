const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Tour = sequelize.define('Tour', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ""
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 1.00
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'cancelled'),
        defaultValue: 'draft'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
    tableName: 'tours',
    timestamps: true
});

Tour.associate = (models) => {
    Tour.hasMany(models.Translation, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
            entityType: 'tour'
        },
        as: 'translations'
    });

    Tour.hasMany(models.TourDay, {
        foreignKey: 'tourId',
        as: 'days'
    });

    Tour.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'tourCreator'
    });

    Tour.belongsTo(models.User, {
        foreignKey: 'updatedBy',
        as: 'tourUpdater'
    });
};

module.exports = Tour;