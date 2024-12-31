const { DayTemplate, Translation, Location, Language } = require('../models');

class DayTemplateController {
    // Get all templates with pagination
    async getAll(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const templates = await DayTemplate.findAndCountAll({
                where: { isActive: true },
                include: ['translations'],
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return res.json({
                total: templates.count,
                pages: Math.ceil(templates.count / limit),
                currentPage: page,
                data: templates.rows
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Get one
    async getOne(req, res) {
        try {
            const { id } = req.params;
            
            const template = await DayTemplate.findOne({
                where: { 
                    id,
                    isActive: true
                },
                include: ['translations']
            });

            if (!template) {
                return res.status(404).json({ message: 'Day template not found' });
            }

            return res.json(template);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Create new template
    async create(req, res) {
        try {
            const { locations, images, translations = [] } = req.body;
            let { name, description } = req.body;

            // Validate locations
            if (!locations || locations.length === 0) {
                return res.status(400).json({ 
                    message: 'Locations are required' 
                });
            }

            // Tìm ngôn ngữ mặc định
            const defaultLanguage = await Language.findOne({
                where: { isDefault: true }
            });

            // Nếu có name và description, tự động tạo/cập nhật bản dịch mặc định
            if (name && description) {
                const defaultTransIndex = translations.findIndex(
                    t => t.languageId === defaultLanguage.id
                );

                if (defaultTransIndex >= 0) {
                    // Update bản dịch mặc định nếu đã có
                    translations[defaultTransIndex] = {
                        ...translations[defaultTransIndex],
                        name,
                        description
                    };
                } else {
                    // Thêm bản dịch mặc định nếu chưa có
                    translations.push({
                        languageId: defaultLanguage.id,
                        name,
                        description
                    });
                }
            } else {
                // Nếu không có name và description, bắt buộc phải có bản dịch mặc định
                const defaultTranslation = translations.find(
                    t => t.languageId === defaultLanguage.id
                );

                if (!defaultTranslation) {
                    return res.status(400).json({ 
                        message: `Translation for default language (${defaultLanguage.code}) is required` 
                    });
                }

                // Gán name và description từ bản dịch mặc định
                name = defaultTranslation.name;
                description = defaultTranslation.description;
            }

            // Create template
            const template = await DayTemplate.create({
                name,
                description,
                locations,
                images,
                createdBy: req.user.id
            });

            // Add translations
            if (translations.length > 0) {
                await Translation.bulkCreate(
                    translations.map(t => ({
                        ...t,
                        entityId: template.id,
                        entityType: 'day_template',
                        createdBy: req.user.id
                    }))
                );
            }

            // Return with translations
            const result = await DayTemplate.findByPk(template.id, {
                include: ['translations']
            });

            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Update
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, locations, images, translations } = req.body;

            // 1. Tìm template
            const template = await DayTemplate.findByPk(id);
            if (!template) {
                return res.status(404).json({ message: 'Day template not found' });
            }

            // 2. Update thông tin cơ bản
            await template.update({
                locations,
                images,
                updatedBy: req.user.id
            });

            // 3. Xử lý translations
            if (translations?.length > 0) {
                // Tìm ngôn ngữ mặc định
                const defaultLanguage = await Language.findOne({
                    where: { isDefault: true }
                });

                // Lấy translations hiện tại
                const currentTranslations = await Translation.findAll({
                    where: {
                        entityId: id,
                        entityType: 'day_template'
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
                                    entityType: 'day_template',
                                    languageId: trans.languageId
                                }
                            }
                        );
                    } else {
                        // Tạo translation mới
                        await Translation.create({
                            ...trans,
                            entityId: id,
                            entityType: 'day_template',
                            createdBy: req.user.id
                        });
                    }
                }

                // Update template chính nếu có bản dịch mặc định
                const defaultTranslation = translations.find(
                    t => t.languageId === defaultLanguage.id
                );

                if (defaultTranslation) {
                    await template.update({
                        name: defaultTranslation.name,
                        description: defaultTranslation.description
                    });
                }
            }

            // 4. Trả về kết quả
            const result = await DayTemplate.findByPk(id, {
                include: ['translations']
            });

            return res.json(result);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Delete (soft)
    async delete(req, res) {
        try {
            const { id } = req.params;
            
            const deleted = await DayTemplate.update(
                { isActive: false },
                { where: { id } }
            );

            if (!deleted[0]) {
                return res.status(404).json({ message: 'Day template not found' });
            }

            return res.json({ message: 'Day template deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Restore
    async restore(req, res) {
        try {
            const { id } = req.params;
            
            const restored = await DayTemplate.update(
                { isActive: true },
                { where: { id } }
            );

            if (!restored[0]) {
                return res.status(404).json({ message: 'Day template not found' });
            }

            const result = await DayTemplate.findByPk(id, {
                include: ['translations']
            });

            return res.json({
                message: 'Day template restored successfully',
                data: result
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new DayTemplateController(); 