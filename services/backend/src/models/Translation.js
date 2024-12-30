const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Translation = sequelize.define('Translation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    languageId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    entityId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    entityType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'translations',
    indexes: [
        {
            fields: ['isActive']
        },
        {
            fields: ['languageId']
        },
        {
            fields: ['entityId', 'entityType', 'languageId'],
            unique: true
        }
    ]
});

Translation.associate = (models) => {
    Translation.belongsTo(models.Language, {
        foreignKey: 'languageId',
        as: 'language'
    });
};

module.exports = Translation; 