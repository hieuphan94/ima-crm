const Tour = require('./Tour');
const TourDay = require('./TourDay');
const TourService = require('./TourService');
const User = require('./User');
const Language = require('./Language');
const Location = require('./Location');
const ServiceType = require('./ServiceType');
const ServiceCategory = require('./ServiceCategory');
const Translation = require('./Translation');

// Relationships
Tour.hasMany(TourDay, { foreignKey: 'tourId' });
TourDay.belongsTo(Tour, { foreignKey: 'tourId' });

TourDay.hasMany(TourService, { foreignKey: 'tourDayId' });
TourService.belongsTo(TourDay, { foreignKey: 'tourDayId' });

Tour.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
TourService.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Export all models
module.exports = {
    Tour,
    TourDay,
    TourService,
    User,
    Language,
    Location,
    ServiceType,
    ServiceCategory,
    Translation
};

// Call associations AFTER exporting all models
Object.values(module.exports).forEach((model) => {
    if (model.associate) {
        model.associate(module.exports);
    }
});