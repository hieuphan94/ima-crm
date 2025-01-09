const { User } = require('../../models');
const { v4: uuidv4 } = require('uuid');

async function seedAdmin() {
    try {
        // Kiểm tra xem đã có admin chưa
        const existingAdmin = await User.findOne({
            where: { role: 'admin' }
        });

        if (!existingAdmin) {
            // Tạo admin user với UUID
            await User.create({
                id: uuidv4(),
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                fullName: 'System Admin',
                role: 'admin',
                department: 'sales',
                status: 'active'
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
}

module.exports = seedAdmin;