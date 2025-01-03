const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const ServiceType = sequelize.define('ServiceType', {
    id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.ENUM(
            'HOTEL',
            'CAMPING',
            'BED_BREAKFAST',
            'CRUISE',
            'LODGE',
            'UNUSUAL',
            'BIVOUAC',
            'CAMPERVAN',
            'TRAIN_CRUISE'
        ),
        allowNull: false,
        unique: true,
        set(value) {
            let id;
            if (value === 'CAMPERVAN') {
                id = 'cpv';
            } else {
                id = value.toLowerCase().slice(0, 3);
            }
            this.setDataValue('id', id);
            this.setDataValue('name', value);
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'service_types',
    indexes: [
        {
            fields: ['isActive']
        }
    ]
});

ServiceType.associate = (models) => {
    ServiceType.hasMany(models.ServiceCategory, {
        foreignKey: 'typeId',
        as: 'serviceCategories'
    });
};

module.exports = ServiceType; 