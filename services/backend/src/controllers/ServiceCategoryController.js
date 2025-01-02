const { ServiceCategory, Translation, Language, Location } = require('../models');
const { slugify } = require('slugify');
const { v4: uuidv4 } = require('uuid');

class ServiceCategoryController {
    // Get all services with pagination
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const services = await ServiceCategory.findAndCountAll({
                where: { isActive: true },
                include: ['translations'],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return res.json({
                total: services.count,
                pages: Math.ceil(services.count / limit),
                currentPage: parseInt(page),
                data: services.rows
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Get service by ID
    async getById(req, res) {
        try {
            const service = await ServiceCategory.findOne({
                where: { 
                    id: req.params.id,
                    isActive: true
                },
                include: ['translations']
            });
            
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            return res.json(service);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Create new service
    async create(req, res) {
        try {
            // Kiểm tra department
            if (req.user.role !== 'admin' && req.user.department !== 'sales') {
                return res.status(403).json({ message: 'Permission denied' });
            }

            const { 
                name, 
                typeId, 
                locationId,
                locationName,  // Thêm locationName
                stars, 
                description, 
                website, 
                translations 
            } = req.body;

            // Validate required fields
            if (!name || !typeId) {
                return res.status(400).json({ message: 'Name and type are required' });
            }

            let finalLocationId = locationId;

            // Xử lý location
            if (!locationId && locationName) {
                // Tìm hoặc tạo location mới
                const [location] = await Location.findOrCreate({
                    where: { 
                        code: slugify(locationName, { lower: true })
                    },
                    defaults: {
                        id: uuidv4(),
                        name: locationName,
                        code: slugify(locationName, { lower: true }),
                        country: 'Vietnam'
                    }
                });
                finalLocationId = location.id;
            }

            // Validate final locationId
            if (!finalLocationId) {
                return res.status(400).json({ 
                    message: 'Location ID or location name is required' 
                });
            }

            // Create service
            const service = await ServiceCategory.create({
                name,
                typeId,
                locationId: finalLocationId,
                stars: stars || null,
                description: description || null,
                website: website || null,
                createdBy: req.user.id
            });

            // Add translations if provided
            if (translations && translations.length > 0) {
                await Translation.bulkCreate(
                    translations.map(t => ({
                        ...t,
                        entityId: service.id,
                        entityType: 'service_category',
                        createdBy: req.user.id
                    }))
                );
            }

            // Return with translations
            const result = await ServiceCategory.findByPk(service.id, {
                include: ['translations']
            });

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Update service
    async update(req, res) {
        try {
            const { id } = req.params;
            const { 
                locationId,
                locationName,  // Thêm locationName
                website, 
                stars, 
                translations 
            } = req.body;

            // 1. Tìm service
            const service = await ServiceCategory.findByPk(id);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // 2. Xử lý location nếu có thay đổi
            let finalLocationId = locationId;
            if (!locationId && locationName) {
                // Tìm hoặc tạo location mới
                const [location] = await Location.findOrCreate({
                    where: { 
                        code: slugify(locationName, { lower: true })
                    },
                    defaults: {
                        id: uuidv4(),
                        name: locationName,
                        code: slugify(locationName, { lower: true }),
                        country: 'Vietnam'
                    }
                });
                finalLocationId = location.id;
            }

            // 3. Update thông tin cơ bản
            await service.update({
                locationId: finalLocationId || service.locationId, // Giữ nguyên nếu không có thay đổi
                website,
                stars,
                updatedBy: req.user.id
            });

            // 4. Xử lý translations
            if (translations && translations.length > 0) {
                // Tìm ngôn ngữ mặc định
                const defaultLanguage = await Language.findOne({
                    where: { isDefault: true }
                });

                // Lấy tất cả translations hiện tại
                const currentTranslations = await Translation.findAll({
                    where: {
                        entityId: id,
                        entityType: 'service_category'
                    }
                });

                // Tạo map từ translations hiện tại
                const translationsMap = currentTranslations.reduce((acc, trans) => {
                    acc[trans.languageId] = trans;
                    return acc;
                }, {});

                // Xử lý từng translation mới
                for (const trans of translations) {
                    if (translationsMap[trans.languageId]) {
                        // Update translation hiện có
                        await Translation.update(
                            {
                                name: trans.name,
                                description: trans.description,
                                updatedBy: req.user.id
                            },
                            {
                                where: {
                                    entityId: id,
                                    entityType: 'service_category',
                                    languageId: trans.languageId
                                }
                            }
                        );
                    } else {
                        // Tạo translation mới
                        await Translation.create({
                            ...trans,
                            entityId: id,
                            entityType: 'service_category',
                            createdBy: req.user.id
                        });
                    }
                }

                // Update service chính nếu có bản dịch mặc định
                const defaultTranslation = translations.find(
                    t => t.languageId === defaultLanguage.id
                );

                if (defaultTranslation) {
                    await service.update({
                        name: defaultTranslation.name,
                        description: defaultTranslation.description
                    });
                }
            }

            // 5. Trả về kết quả
            const result = await ServiceCategory.findByPk(id, {
                include: ['translations']
            });

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Delete service (soft delete)
    async delete(req, res) {
        try {
            // Kiểm tra department
            if (req.user.role !== 'admin' && req.user.department !== 'sales') {
                return res.status(403).json({ message: 'Permission denied' });
            }

            const { id } = req.params;
            
            const service = await ServiceCategory.findOne({
                where: { 
                    id,
                    isActive: true
                }
            });

            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Soft delete
            await service.update({ 
                isActive: false,
                updatedBy: req.user.id
            });

            return res.json({ message: 'Service deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Restore service (khôi phục từ soft delete)
    async restore(req, res) {
        try {
            // Kiểm tra department
            if (req.user.role !== 'admin' && req.user.department !== 'sales') {
                return res.status(403).json({ message: 'Permission denied' });
            }

            const { id } = req.params;
            
            // Tìm service đã bị xóa
            const service = await ServiceCategory.findOne({
                where: { 
                    id,
                    isActive: false  // Chỉ tìm những service đã bị xóa
                }
            });

            if (!service) {
                return res.status(404).json({ message: 'Deleted service not found' });
            }

            // Khôi phục service
            await service.update({ 
                isActive: true,
                updatedBy: req.user.id
            });

            // Return service đã được khôi phục
            const restored = await ServiceCategory.findByPk(id, {
                include: ['translations']
            });

            return res.json({
                message: 'Service restored successfully',
                data: restored
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new ServiceCategoryController(); 