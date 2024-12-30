const { Location, ServiceType, Language } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

async function seedBasicData() {
    try {
        // 1. Seed Languages (UUID + code)
        const languages = [
            {
                id: uuidv4(),
                name: 'English',
                code: 'en',
                isDefault: true,
                isActive: true
            },
            {
                id: uuidv4(),
                name: 'French',
                code: 'fr',
                isDefault: false,
                isActive: true
            }
        ];

        // Đảm bảo chỉ có 1 ngôn ngữ mặc định
        for (const lang of languages) {
            if (lang.isDefault) {
                await Language.update(
                    { isDefault: false },
                    { where: {} }
                );
            }
            await Language.findOrCreate({
                where: { code: lang.code },
                defaults: lang
            });
        }
        console.log('Languages seeded successfully');

        // 2. Seed Locations (UUID + auto code from name)
        const locations = [
            {
                id: uuidv4(),
                name: 'Hà Nội',
                code: slugify('Hà Nội', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 21.0285, lng: 105.8542 }
            },
            {
                id: uuidv4(),
                name: 'Hạ Long',
                code: slugify('Hạ Long', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 20.9598, lng: 107.0480 }
            },
            {
                id: uuidv4(),
                name: 'Sapa',
                code: slugify('Sapa', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 22.3364, lng: 103.8438 }
            },
            {
                id: uuidv4(),
                name: 'Hội An',
                code: slugify('Hội An', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 15.8801, lng: 108.3380 }
            },
            {
                id: uuidv4(),
                name: 'Đà Nẵng',
                code: slugify('Đà Nẵng', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 16.0544, lng: 108.2022 }
            },
            {
                id: uuidv4(),
                name: 'Nha Trang',
                code: slugify('Nha Trang', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 12.2388, lng: 109.1967 }
            },
            {
                id: uuidv4(),
                name: 'Đà Lạt',
                code: slugify('Đà Lạt', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 11.9404, lng: 108.4583 }
            },
            {
                id: uuidv4(),
                name: 'Phú Quốc',
                code: slugify('Phú Quốc', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 10.2896, lng: 103.9829 }
            }
        ];

        for (const loc of locations) {
            await Location.findOrCreate({
                where: { code: loc.code },
                defaults: loc
            });
        }
        console.log('Locations seeded successfully');

        // 3. Seed Service Types (ID tự động từ name)
        const serviceTypes = [
            { name: 'HOTEL' },       // -> id: 'hot'
            { name: 'CAMPING' },     // -> id: 'cam'
            { name: 'BED_BREAKFAST' },// -> id: 'bed'
            { name: 'CRUISE' },      // -> id: 'cru'
            { name: 'LODGE' },       // -> id: 'lod'
            { name: 'UNUSUAL' },     // -> id: 'unu'
            { name: 'BIVOUAC' },     // -> id: 'biv'
            { name: 'CAMPERVAN' },   // -> id: 'cam'
            { name: 'TRAIN_CRUISE' } // -> id: 'tra'
        ];

        for (const type of serviceTypes) {
            await ServiceType.findOrCreate({
                where: { name: type.name },
                defaults: type
            });
        }
        console.log('Service Types seeded successfully');

    } catch (error) {
        console.error('Error seeding basic data:', error);
        throw error; // Để xem lỗi chi tiết
    }
}

module.exports = seedBasicData; 