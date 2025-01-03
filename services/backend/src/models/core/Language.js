const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Language = sequelize.define('Language', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(2),
        allowNull: false,
        unique: true
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'languages',
    indexes: [
        {
            fields: ['isActive']
        },
        {
            fields: ['code'],
            unique: true
        }
    ]
});

Language.associate = (models) => {
    Language.hasMany(models.Translation, {
        foreignKey: 'languageId',
        as: 'translations'
    });
};

module.exports = Language;