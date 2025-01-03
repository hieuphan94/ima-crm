const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const slugify = require('slugify');

const Location = sequelize.define('Location', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true  // Không cho phép string rỗng
        },
        set(value) {
            const code = slugify(value, {
                lower: true,
                strict: true,
                locale: 'vi'
            });
            this.setDataValue('code', code);
            this.setDataValue('name', value);
        }
    },
    coordinates: {
        type: DataTypes.JSONB,
        defaultValue: {},
        validate: {
            isValidCoordinates(value) {
                if (!value.lat || !value.lng) {
                    throw new Error('Coordinates must have lat and lng');
                }
                if (typeof value.lat !== 'number' || typeof value.lng !== 'number') {
                    throw new Error('Coordinates must be numbers');
                }
            }
        }
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'locations',
    indexes: [
        {
            fields: ['isActive']
        },
        {
            fields: ['code']
        }
    ]
});

Location.associate = (models) => {
    Location.hasMany(models.ServiceCategory, {
        foreignKey: 'locationId',
        as: 'serviceCategories'
    });

    Location.hasMany(models.Translation, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
            entityType: 'location'
        },
        as: 'translations'
    });
};

module.exports = Location; 