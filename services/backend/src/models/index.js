const sequelize = require('../config/database');

// Import models
const Tour = require('./Tour');
const TourDay = require('./TourDay');
const TourService = require('./TourService');
const User = require('./User');
const Language = require('./Language');
const Location = require('./Location');
const ServiceType = require('./ServiceType');
const ServiceCategory = require('./ServiceCategory');
const Translation = require('./Translation');
const DayTemplate = require('./DayTemplate');

// Define models object
const models = {
    Tour,
    TourDay,
    TourService,
    User,
    Language,
    Location,
    ServiceType,
    ServiceCategory,
    Translation,
    DayTemplate
};

// Basic relationships - nên chuyển vào từng model tương ứng
Tour.hasMany(TourDay, { foreignKey: 'tourId' });
TourDay.belongsTo(Tour, { foreignKey: 'tourId' });

TourDay.hasMany(TourService, { foreignKey: 'tourDayId' });
TourService.belongsTo(TourDay, { foreignKey: 'tourDayId' });

Tour.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
TourService.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Setup model associations
Object.values(models).forEach((model) => {
    if (model.associate) {
        model.associate(models);
    }
});

// Export cả models và sequelize
module.exports = {
    ...models,
    sequelize
};