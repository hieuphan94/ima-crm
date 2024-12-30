// src/controllers/tourController.js
const { Tour, TourDay, TourService, User } = require('../models');
const { Op } = require('sequelize');

class TourController {
    // 1. Tạo tour mới
    static async createTour(req, res) {
        try {
            const tourData = {
                name: req.body.name,
                description: req.body.description,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                location: req.body.location,
                createdBy: req.user.id,
                status: 'draft',
                currentDepartment: 'sales'
            };

            // Tạo tour
            const tour = await Tour.create(tourData);

            // Tạo các ngày tour
            if (req.body.days && req.body.days.length > 0) {
                const tourDays = req.body.days.map(day => ({
                    ...day,
                    tourId: tour.id
                }));
                await TourDay.bulkCreate(tourDays);
            }

            // Lấy tour đầy đủ thông tin
            const fullTour = await Tour.findByPk(tour.id, {
                include: [{
                    model: TourDay,
                    include: [TourService]
                }]
            });

            res.status(201).json({
                message: 'Tour created successfully',
                tour: fullTour
            });

        } catch (error) {
            console.error('Create tour error:', error);
            res.status(500).json({
                message: 'Error creating tour',
                error: error.message
            });
        }
    }

    // 2. Lấy danh sách tours
    static async getTours(req, res) {
        try {
            const { 
                page = 1, 
                limit = 10, 
                search = '',
                status,
                department,
                startDate,
                endDate
            } = req.query;
            
            const offset = (page - 1) * limit;
            
            // Xây dựng where clause
            let whereClause = {};
            
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                    { location: { [Op.iLike]: `%${search}%` } }
                ];
            }
            
            if (status) {
                whereClause.status = status;
            }
            
            if (department) {
                whereClause.currentDepartment = department;
            }
            
            if (startDate && endDate) {
                whereClause.startDate = {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                };
            }

            const tours = await Tour.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: TourDay,
                        include: [TourService]
                    },
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'username', 'fullName']
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [['createdAt', 'DESC']]
            });

            res.json({
                message: 'Tours retrieved successfully',
                data: {
                    tours: tours.rows,
                    total: tours.count,
                    totalPages: Math.ceil(tours.count / limit),
                    currentPage: parseInt(page)
                }
            });

        } catch (error) {
            console.error('Get tours error:', error);
            res.status(500).json({
                message: 'Error retrieving tours',
                error: error.message
            });
        }
    }

    // 3. Lấy chi tiết tour
    static async getTour(req, res) {
        try {
            const { id } = req.params;

            const tour = await Tour.findByPk(id, {
                include: [
                    {
                        model: TourDay,
                        include: [TourService]
                    },
                    {
                        model: User,
                        as: 'creator',
                        attributes: ['id', 'username', 'fullName']
                    }
                ]
            });

            if (!tour) {
                return res.status(404).json({
                    message: 'Tour not found'
                });
            }

            res.json({
                message: 'Tour retrieved successfully',
                tour
            });

        } catch (error) {
            console.error('Get tour error:', error);
            res.status(500).json({
                message: 'Error retrieving tour',
                error: error.message
            });
        }
    }

    // 4. Cập nhật tour
    static async updateTour(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Kiểm tra tour tồn tại
            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({
                    message: 'Tour not found'
                });
            }

            // Cập nhật thông tin tour
            await tour.update(updateData);

            // Cập nhật các ngày tour nếu có
            if (updateData.days) {
                // Xóa các ngày cũ
                await TourDay.destroy({
                    where: { tourId: id }
                });

                // Tạo các ngày mới
                const tourDays = updateData.days.map(day => ({
                    ...day,
                    tourId: id
                }));
                await TourDay.bulkCreate(tourDays);
            }

            // Lấy tour đã cập nhật
            const updatedTour = await Tour.findByPk(id, {
                include: [{
                    model: TourDay,
                    include: [TourService]
                }]
            });

            res.json({
                message: 'Tour updated successfully',
                tour: updatedTour
            });

        } catch (error) {
            console.error('Update tour error:', error);
            res.status(500).json({
                message: 'Error updating tour',
                error: error.message
            });
        }
    }

    // 5. Xóa tour
    static async deleteTour(req, res) {
        try {
            const { id } = req.params;

            // Kiểm tra tour tồn tại
            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({
                    message: 'Tour not found'
                });
            }

            // Xóa các ngày và dịch vụ liên quan
            await TourDay.destroy({
                where: { tourId: id }
            });

            // Xóa tour
            await tour.destroy();

            res.json({
                message: 'Tour deleted successfully'
            });

        } catch (error) {
            console.error('Delete tour error:', error);
            res.status(500).json({
                message: 'Error deleting tour',
                error: error.message
            });
        }
    }

    // 6. Cập nhật trạng thái tour
    static async updateTourStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, currentDepartment } = req.body;

            const tour = await Tour.findByPk(id);
            if (!tour) {
                return res.status(404).json({
                    message: 'Tour not found'
                });
            }

            await tour.update({
                status,
                currentDepartment,
                updatedAt: new Date()
            });

            res.json({
                message: 'Tour status updated successfully',
                tour
            });

        } catch (error) {
            console.error('Update tour status error:', error);
            res.status(500).json({
                message: 'Error updating tour status',
                error: error.message
            });
        }
    }
}

module.exports = TourController;