const Tour = require('./Tour');
const TourDay = require('./TourDay');
const TourService = require('./TourService');
const User = require('./User');

// Relationships
Tour.hasMany(TourDay, { foreignKey: 'tourId' });
TourDay.belongsTo(Tour, { foreignKey: 'tourId' });

TourDay.hasMany(TourService, { foreignKey: 'tourDayId' });
TourService.belongsTo(TourDay, { foreignKey: 'tourDayId' });

Tour.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
TourService.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = {
    Tour,
    TourDay,
    TourService,
    User
};