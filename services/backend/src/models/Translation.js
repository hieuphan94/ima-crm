const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Translation = sequelize.define('Translation', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    entityId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    entityType: {
        type: DataTypes.ENUM('location', 'service_category'),
        allowNull: false,
        validate: {
            isIn: [['location', 'service_category']]
        }
    },
    languageId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: 'languages',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'translations',
    indexes: [
        {
            unique: true,
            fields: ['entityId', 'entityType', 'languageId']
        },
        {
            fields: ['languageId']
        }
    ],
    validate: {
        nameOrDescription() {
            if (!this.name && !this.description) {
                throw new Error('Either name or description must be provided');
            }
        }
    }
});

Translation.associate = (models) => {
    Translation.belongsTo(models.Language, {
        foreignKey: 'languageId',
        as: 'language'
    });
};

module.exports = Translation; 