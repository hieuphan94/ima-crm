const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceCategory = sequelize.define('ServiceCategory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true 
        }
    },
    typeId: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: 'service_types',
            key: 'id'
        }
    },
    locationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id'
        }
    },
    stars: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        },
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    website: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isUrl: {
                msg: "Website must be a valid URL"
            }
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    images: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        validate: {
            isValidImages(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Images must be an array');
                }
                value.forEach(img => {
                    if (typeof img !== 'string') {
                        throw new Error('Each image must be a string URL');
                    }
                });
            }
        }
    }
}, {
    timestamps: true,
    tableName: 'service_categories',
    indexes: [
        {
            unique: true,
            fields: ['name', 'locationId', 'typeId']
        },
        {
            fields: ['typeId']
        },
        {
            fields: ['locationId']
        },
        {
            fields: ['isActive']
        }
    ]
});

ServiceCategory.associate = (models) => {
    ServiceCategory.belongsTo(models.ServiceType, {
        foreignKey: 'typeId',
        as: 'type'
    });
    
    ServiceCategory.belongsTo(models.Location, {
        foreignKey: 'locationId',
        as: 'location'
    });

    ServiceCategory.hasMany(models.Translation, {
        foreignKey: 'entityId',
        constraints: false,
        scope: {
            entityType: 'service_category'
        },
        as: 'translations'
    });
};

module.exports = ServiceCategory; 