const { Location, ServiceType, ServiceCategory, Language, DayTemplate } = require('../../models');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

async function seedBasicData() {
    try {
        // 1. Seed Languages
        console.log('Seeding languages...');
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
            },
            {
                id: uuidv4(),
                name: 'Vietnamese',
                code: 'vi',
                isDefault: false,
                isActive: true
            }
        ];

        // Đảm bảo chỉ có 1 ngôn ngữ mặc định
        for (const lang of languages) {
            if (lang.isDefault) {
                await Language.update({ isDefault: false }, { where: {} });
            }
            await Language.findOrCreate({
                where: { code: lang.code },
                defaults: lang
            });
        }
        console.log('✓ Languages seeded');

        // 2. Seed Locations
        console.log('Seeding locations...');
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
                name: 'Vịnh Hạ Long',
                code: slugify('Vịnh Hạ Long', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 20.9598, lng: 107.0480 }
            },
            {
                id: uuidv4(),
                name: 'Sapa',
                code: slugify('Sapa', { lower: true }),
                country: 'Vietnam',
                coordinates: { lat: 22.3364, lng: 103.8438 }
            }
        ];

        // Seed từng location và lưu lại reference
        const locationRefs = {};
        for (const loc of locations) {
            const [location] = await Location.findOrCreate({
                where: { code: loc.code },
                defaults: loc
            });
            locationRefs[loc.name] = location;  // Lưu reference để dùng sau
        }
        console.log('✓ Locations seeded');

        // 3. Seed Service Types
        console.log('Seeding service types...');
        const serviceTypes = [
            { name: 'HOTEL' },          // -> id: 'hot'
            { name: 'CAMPING' },        // -> id: 'cam'
            { name: 'BED_BREAKFAST' },  // -> id: 'bed'
            { name: 'CRUISE' },         // -> id: 'cru'
            { name: 'LODGE' },          // -> id: 'lod'
            { name: 'UNUSUAL' },        // -> id: 'unu'
            { name: 'BIVOUAC' },        // -> id: 'biv'
            { name: 'CAMPERVAN' },      // -> id: 'cpv'
            { name: 'TRAIN_CRUISE' }    // -> id: 'tra'
        ];

        for (const type of serviceTypes) {
            await ServiceType.findOrCreate({
                where: { name: type.name },
                defaults: type
            });
        }
        console.log('✓ Service Types seeded');

        // 4. Seed Service Categories
        console.log('Seeding service categories...');
        
        // Lấy locations đã seed để có ID thực
        const hanoiLocation = await Location.findOne({ 
            where: { code: slugify('Hà Nội', { lower: true }) }
        });
        const halongLocation = await Location.findOne({ 
            where: { code: slugify('Vịnh Hạ Long', { lower: true }) }
        });

        const serviceCategories = [
            {
                id: uuidv4(),
                typeId: 'hot',
                name: 'Khách sạn 5 sao Hà Nội',
                description: 'Các khách sạn 5 sao tại Hà Nội',
                locationId: hanoiLocation?.id,
                stars: 5,
                website: 'https://example.com',
                isActive: true
            },
            {
                id: uuidv4(),
                typeId: 'hot',
                name: 'Khách sạn 4 sao Hà Nội',
                description: 'Các khách sạn 4 sao tại Hà Nội',
                locationId: hanoiLocation?.id,
                stars: 4,
                website: 'https://example.com',
                isActive: true
            },
            {
                id: uuidv4(),
                typeId: 'cru',
                name: 'Du thuyền Hạ Long Premium',
                description: 'Du thuyền cao cấp tại Vịnh Hạ Long',
                locationId: halongLocation?.id,
                stars: 5,
                website: 'https://example.com',
                isActive: true
            },
            {
                id: uuidv4(),
                typeId: 'cru',
                name: 'Du thuyền Hạ Long Deluxe',
                description: 'Du thuyền tiêu chuẩn tại Vịnh Hạ Long',
                locationId: halongLocation?.id,
                stars: 4,
                website: 'https://example.com',
                isActive: true
            }
        ];

        // Chỉ seed các categories có locationId hợp lệ
        for (const category of serviceCategories) {
            if (category.locationId) {
                await ServiceCategory.findOrCreate({
                    where: { name: category.name },
                    defaults: category
                });
            }
        }
        console.log('✓ Service Categories seeded');

        // 5. Seed Day Templates
        console.log('Seeding day templates...');

        const dayTemplates = [
            {
                id: uuidv4(),
                name: 'Hà Nội - Hạ Long Classic',
                description: 'Tour kết hợp Hà Nội và Vịnh Hạ Long',
                locations: [
                    {
                        id: locationRefs['Hà Nội']?.id,
                        name: 'Hà Nội',
                        coordinates: { lat: 21.0285, lng: 105.8542 }
                    },
                    {
                        id: locationRefs['Vịnh Hạ Long']?.id,
                        name: 'Vịnh Hạ Long',
                        coordinates: { lat: 20.9598, lng: 107.0480 }
                    }
                ],
                images: [
                    'hanoi-halong-1.jpg',
                    'hanoi-halong-2.jpg'
                ],
                isActive: true
            },
            {
                id: uuidv4(),
                name: 'Hà Nội - Sapa Adventure',
                description: 'Tour khám phá Hà Nội và Sapa',
                locations: [
                    {
                        id: locationRefs['Hà Nội']?.id,
                        name: 'Hà Nội',
                        coordinates: { lat: 21.0285, lng: 105.8542 }
                    },
                    {
                        id: locationRefs['Sapa']?.id,
                        name: 'Sapa',
                        coordinates: { lat: 22.3364, lng: 103.8438 }
                    }
                ],
                images: [
                    'hanoi-sapa-1.jpg',
                    'hanoi-sapa-2.jpg'
                ],
                isActive: true
            }
        ];

        // Seed day templates
        for (const template of dayTemplates) {
            await DayTemplate.findOrCreate({
                where: { name: template.name },
                defaults: template
            });
        }
        console.log('✓ Day Templates seeded');

        console.log('✓ All basic data seeded successfully');

    } catch (error) {
        console.error('Error seeding basic data:', error);
        throw error;
    }
}

module.exports = seedBasicData; 