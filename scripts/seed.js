
const strapiFactory = require('@strapi/strapi');

async function seed() {
    const strapi = await strapiFactory({ distDir: './dist' }).load();

    try {
        console.log('🌱 Seeding data...');

        // products
        const products = [
            { name: 'Diesel', type: 'Fuel', sellingPrice: 1.5, costPrice: 1.2, stockQuantity: 5000 },
            { name: 'Petrol 95', type: 'Fuel', sellingPrice: 1.8, costPrice: 1.4, stockQuantity: 3000 },
            { name: 'Engine Oil', type: 'Lube', sellingPrice: 25, costPrice: 15, stockQuantity: 100 },
        ];

        for (const p of products) {
            // Check if exists
            const existing = await strapi.entityService.findMany('api::product.product', { filters: { name: p.name } });
            if (existing.length === 0) {
                await strapi.entityService.create('api::product.product', { data: p });
                console.log(`Created product: ${p.name}`);
            }
        }

        console.log('✅ Seeding complete');
    } catch (error) {
        console.error('Seeding failed', error);
    } finally {
        strapi.destroy();
    }
}

seed();
