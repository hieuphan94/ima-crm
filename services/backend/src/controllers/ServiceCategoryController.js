const { ServiceCategory, Translation } = require('../models');

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

            const { name, typeId, locationId, stars, description, website, translations } = req.body;

            // Validate required fields
            if (!name || !typeId || !locationId) {
                return res.status(400).json({ message: 'Name, type and location are required' });
            }

            // Create service
            const service = await ServiceCategory.create({
                name,
                typeId,
                locationId,
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
            // Kiểm tra department
            if (req.user.role !== 'admin' && req.user.department !== 'sales') {
                return res.status(403).json({ message: 'Permission denied' });
            }

            const { id } = req.params;
            const { name, typeId, locationId, stars, description, website, translations } = req.body;

            // Find service
            const service = await ServiceCategory.findOne({
                where: { 
                    id,
                    isActive: true
                }
            });

            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Update service
            await service.update({
                name: name || service.name,
                typeId: typeId || service.typeId,
                locationId: locationId || service.locationId,
                stars: stars !== undefined ? stars : service.stars,
                description: description !== undefined ? description : service.description,
                website: website !== undefined ? website : service.website,
                updatedBy: req.user.id
            });

            // Update translations if provided
            if (translations) {
                await Translation.destroy({
                    where: {
                        entityId: id,
                        entityType: 'service_category'
                    }
                });

                if (translations.length > 0) {
                    await Translation.bulkCreate(
                        translations.map(t => ({
                            ...t,
                            entityId: id,
                            entityType: 'service_category',
                            createdBy: req.user.id
                        }))
                    );
                }
            }

            // Return updated data
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