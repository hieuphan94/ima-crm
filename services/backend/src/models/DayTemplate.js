const { Model, DataTypes } = require('sequelize');

class DayTemplate extends Model {
    static init(sequelize) {
        super.init({
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
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        }, {
            sequelize,
            tableName: 'day_templates',
            timestamps: true
        });
    }

    static associate(models) {
        // Chỉ cần quan hệ với Translation
        DayTemplate.hasMany(models.Translation, {
            foreignKey: 'entityId',
            constraints: false,
            scope: {
                entityType: 'day_template'
            },
            as: 'translations'
        });
    }
}

module.exports = DayTemplate; 