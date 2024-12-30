const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Language = sequelize.define('Language', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
            unique: true,
            fields: ['isDefault'],
            where: {
                isDefault: true
            }
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