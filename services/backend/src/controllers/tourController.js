// src/controllers/TourController.js
const { Tour, TourDay, Translation, Language, User } = require('../models');
const sequelize = require('../config/database');

class TourController {
    // Get all with pagination
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const tours = await Tour.findAndCountAll({
                where: { isActive: true },
                include: ['translations'],
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                distinct: true
            });

            // Add duration for each tour
            const toursWithDuration = await Promise.all(
                tours.rows.map(async (tour) => {
                    const daysCount = await TourDay.count({
                        where: { tourId: tour.id }
                    });
                    const tourData = tour.toJSON();
                    tourData.duration = daysCount;
                    return tourData;
                })
            );

            return res.json({
                total: tours.count,
                totalPages: Math.ceil(tours.count / limit),
                currentPage: parseInt(page),
                tours: toursWithDuration
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Get one
    async getOne(req, res) {
        try {
            const tour = await Tour.findOne({
                where: {
                    id: req.params.id,
                    isActive: true
                },
                include: [
                    'translations',
                    {
                        model: TourDay,
                        as: 'days',
                        include: ['services'],
                        order: [['dayNumber', 'ASC']]
                    }
                ]
            });

            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            const tourData = tour.toJSON();
            tourData.duration = tourData.days?.length || 0;

            return res.json(tourData);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Create
    async create(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { name, description, code, price = 1.00, currency, translations } = req.body;

            // Chỉ validate code
            if (!code) {
                return res.status(400).json({ 
                    message: 'Tour code is required' 
                });
            }

            // Check if code exists
            const existingTour = await Tour.findOne({ 
                where: { code } 
            });
            if (existingTour) {
                return res.status(400).json({ 
                    message: 'Tour code already exists' 
                });
            }

            // Create tour with default price if not provided
            const tour = await Tour.create({
                name,
                description,
                code,
                price,  // sẽ dùng giá trị mặc định 1.00 nếu không có
                currency,
                createdBy: req.user.id
            }, { transaction });

            // Handle translations if provided
            if (translations?.length > 0) {
                const defaultLanguage = await Language.findOne({
                    where: { isDefault: true }
                });

                await Translation.bulkCreate(
                    translations.map(t => ({
                        ...t,
                        entityId: tour.id,
                        entityType: 'tour',
                        createdBy: req.user.id
                    })),
                    { transaction }
                );

                // Update tour with default translation
                const defaultTranslation = translations.find(
                    t => t.languageId === defaultLanguage.id
                );
                if (defaultTranslation) {
                    await tour.update({
                        name: defaultTranslation.name,
                        description: defaultTranslation.description
                    }, { transaction });
                }
            }

            await transaction.commit();

            // Return created tour
            const result = await Tour.findByPk(tour.id, {
                include: ['translations']
            });

            return res.status(201).json(result);
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Update
    async update(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { name, description, code, price, currency, status, translations } = req.body;

            // Find tour
            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            // Check code if changed
            if (code && code !== tour.code) {
                const existingTour = await Tour.findOne({ where: { code } });
                if (existingTour) {
                    return res.status(400).json({ message: 'Tour code already exists' });
                }
            }

            // Update tour
            await tour.update({
                code,
                price,
                currency,
                status,
                updatedBy: req.user.id
            }, { transaction });

            // Handle translations if provided
            if (translations?.length > 0) {
                const defaultLanguage = await Language.findOne({
                    where: { isDefault: true }
                });

                // Get current translations
                const currentTranslations = await Translation.findAll({
                    where: {
                        entityId: id,
                        entityType: 'tour'
                    }
                });

                // Create map of current translations
                const translationsMap = currentTranslations.reduce((acc, trans) => {
                    acc[trans.languageId] = trans;
                    return acc;
                }, {});

                // Update or create translations
                for (const trans of translations) {
                    if (translationsMap[trans.languageId]) {
                        await Translation.update(
                            {
                                name: trans.name,
                                description: trans.description,
                                updatedBy: req.user.id
                            },
                            {
                                where: {
                                    entityId: id,
                                    entityType: 'tour',
                                    languageId: trans.languageId
                                },
                                transaction
                            }
                        );
                    } else {
                        await Translation.create(
                            {
                                ...trans,
                                entityId: id,
                                entityType: 'tour',
                                createdBy: req.user.id
                            },
                            { transaction }
                        );
                    }
                }

                // Update tour with default translation
                const defaultTranslation = translations.find(
                    t => t.languageId === defaultLanguage.id
                );
                if (defaultTranslation) {
                    await tour.update({
                        name: defaultTranslation.name,
                        description: defaultTranslation.description
                    }, { transaction });
                }
            }

            await transaction.commit();

            // Return updated tour
            const result = await Tour.findByPk(id, {
                include: [
                    'translations',
                    {
                        model: TourDay,
                        as: 'days',
                        include: ['services'],
                        order: [['dayNumber', 'ASC']]
                    }
                ]
            });

            const tourData = result.toJSON();
            tourData.duration = tourData.days?.length || 0;

            return res.json(tourData);
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Delete (soft delete)
    async delete(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            // Check if tour can be deleted (e.g., not published)
            if (tour.status === 'published') {
                return res.status(400).json({
                    message: 'Cannot delete a published tour'
                });
            }

            await tour.update({
                isActive: false,
                updatedBy: req.user.id
            }, { transaction });

            await transaction.commit();
            return res.json({ message: 'Tour deleted successfully' });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Restore
    async restore(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;

            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            await tour.update({
                isActive: true,
                updatedBy: req.user.id
            }, { transaction });

            await transaction.commit();
            return res.json({ message: 'Tour restored successfully' });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }

    // Update status
    async updateStatus(req, res) {
        const transaction = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { status } = req.body;

            const tour = await Tour.findByPk(id, {
                include: ['days']
            });

            if (!tour) {
                return res.status(404).json({ message: 'Tour not found' });
            }

            // Validate status change
            if (status === 'published') {
                // Check if tour has days
                if (!tour.days || tour.days.length === 0) {
                    return res.status(400).json({
                        message: 'Cannot publish tour without days'
                    });
                }
            }

            await tour.update({
                status,
                updatedBy: req.user.id
            }, { transaction });

            await transaction.commit();
            return res.json({ message: 'Tour status updated successfully' });
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new TourController();