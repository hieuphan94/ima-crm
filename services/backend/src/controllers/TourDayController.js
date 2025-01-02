const { Tour, TourDay, TourDayService, DayTemplate } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

class TourDayController {
    // Get days of a tour
    async getDays(req, res) {
        try {
            const { tourId } = req.params;
            
            const days = await TourDay.findAll({
                where: { tourId },
                attributes: [
                    'id',
                    'tourId',
                    'dayTemplateId',  // chỉ trả về ID của template
                    'dayNumber',
                    'name',
                    'description',
                    'locations',
                    'images',
                    'meals',
                    'createdAt',
                    'updatedAt'
                ],
                include: [{
                    model: TourDayService,
                    as: 'services',
                    attributes: [
                        'id',
                        'serviceCategoryId',
                        'note',
                        'order',
                        'createdAt',
                        'updatedAt'
                    ]
                }],
                order: [['dayNumber', 'ASC']]
            });

            return res.json(days);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Create new day
    async create(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { tourId } = req.params;
            const { 
                dayTemplateId, 
                name, 
                description, 
                locations, 
                images,
                meals,
                services = []
            } = req.body;

            // Check tour exists
            const tour = await Tour.findByPk(tourId);
            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            // Check if tour is not published
            if (tour.status === 'published') {
                return res.status(400).json({ 
                    message: 'Cannot modify a published tour' 
                });
            }

            // Get template
            const template = await DayTemplate.findByPk(dayTemplateId);
            if (!template) {
                return res.status(404).json({ message: 'Day template not found' });
            }

            // Get next day number
            const lastDay = await TourDay.findOne({
                where: { tourId },
                order: [['dayNumber', 'DESC']]
            });
            const dayNumber = (lastDay?.dayNumber || 0) + 1;

            // Create tour day
            const tourDay = await TourDay.create({
                tourId,
                dayTemplateId,
                dayNumber,
                name: name || template.name,
                description: description || template.description,
                locations: locations || template.locations,
                images: images || template.images,
                meals: meals || {
                    included: false,
                    breakfast: false,
                    lunch: false,
                    dinner: false
                },
                createdBy: req.user.id
            }, { transaction });

            // Add services if provided
            if (services.length > 0) {
                await TourDayService.bulkCreate(
                    services.map((service, index) => ({
                        tourDayId: tourDay.id,
                        serviceCategoryId: service.serviceCategoryId,
                        note: service.note,
                        order: service.order || index + 1,
                        createdBy: req.user.id
                    })),
                    { transaction }
                );
            }

            await transaction.commit();

            // Return created day with services
            const result = await TourDay.findByPk(tourDay.id, {
                attributes: [
                    'id', 
                    'tourId',
                    'dayTemplateId',  // chỉ trả về ID của template
                    'dayNumber',
                    'name',
                    'description',
                    'locations',
                    'images',
                    'meals'
                ],
                include: [{
                    model: TourDayService,
                    as: 'services',
                    attributes: ['id', 'serviceCategoryId', 'note', 'order']
                }]
            });

            return res.status(201).json(result);
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Update day
    async update(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { tourId, dayId } = req.params;
            const { 
                name, 
                description, 
                locations, 
                images,
                meals,
                services = []
            } = req.body;

            // Chỉ query các fields cần thiết
            const tourDay = await TourDay.findOne({
                where: { id: dayId, tourId },
                attributes: ['id', 'tourId'],
                include: [{
                    model: Tour,
                    as: 'tour',
                    attributes: ['status']
                }]
            });

            if (!tourDay) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Tour day not found' });
            }

            // Check tour status
            if (tourDay.tour.status === 'published') {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: 'Cannot modify a published tour' 
                });
            }

            // Update tour day - chỉ update các fields được cung cấp
            const updateData = {};
            if (name) updateData.name = name;
            if (description) updateData.description = description;
            if (locations) updateData.locations = locations;
            if (images) updateData.images = images;
            if (meals) updateData.meals = meals;
            updateData.updatedBy = req.user.id;

            await tourDay.update(updateData, { transaction });

            // Nếu có services mới thì mới xử lý services
            if (services.length > 0) {
                // Xóa services cũ
                await TourDayService.destroy({
                    where: { tourDayId: dayId },
                    transaction
                });

                // Tạo services mới
                await TourDayService.bulkCreate(
                    services.map(service => ({
                        tourDayId: dayId,
                        serviceCategoryId: service.serviceCategoryId,
                        note: service.note,
                        order: service.order || 0,
                        createdBy: req.user.id
                    })),
                    { transaction }
                );
            }

            await transaction.commit();

            // Query kết quả với specific fields
            const result = await TourDay.findByPk(dayId, {
                attributes: ['id', 'dayNumber', 'name', 'description', 'locations', 'images', 'meals'],
                include: [{
                    model: TourDayService,
                    as: 'services',
                    attributes: ['id', 'serviceCategoryId', 'note', 'order']
                }]
            });

            return res.json(result);
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Delete day
    async delete(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { tourId, dayId } = req.params;

            // Check tour and day
            const tourDay = await TourDay.findOne({
                where: { id: dayId, tourId },
                include: ['tour']
            });

            if (!tourDay) {
                await transaction.rollback();
                return res.status(404).json({ message: 'Tour day not found' });
            }

            // Check if tour is not published
            if (tourDay.tour.status === 'published') {
                await transaction.rollback();
                return res.status(400).json({ 
                    message: 'Cannot modify a published tour' 
                });
            }

            // Delete day and its services (cascade)
            await tourDay.destroy({ transaction });

            // Reorder remaining days
            const remainingDays = await TourDay.findAll({
                where: { 
                    tourId,
                    dayNumber: { [Op.gt]: tourDay.dayNumber }
                },
                order: [['dayNumber', 'ASC']],
                transaction
            });

            for (const day of remainingDays) {
                await day.update(
                    { dayNumber: day.dayNumber - 1 },
                    { transaction }
                );
            }

            await transaction.commit();
            return res.json({ message: 'Tour day deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Reorder days
    async reorder(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { tourId } = req.params;
            const { days } = req.body; // Array of { id, dayNumber }

            // Check tour
            const tour = await Tour.findByPk(tourId);
            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            // Check if tour is not published
            if (tour.status === 'published') {
                return res.status(400).json({ 
                    message: 'Cannot modify a published tour' 
                });
            }

            // Update day numbers
            for (const day of days) {
                await TourDay.update(
                    { dayNumber: day.dayNumber },
                    { 
                        where: { id: day.id, tourId },
                        transaction
                    }
                );
            }

            await transaction.commit();

            // Return reordered days
            const result = await TourDay.findAll({
                where: { tourId },
                include: ['services', 'template'],
                order: [['dayNumber', 'ASC']]
            });

            return res.json(result);
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TourDayController(); 