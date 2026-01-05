
const strapiFactory = require('@strapi/strapi').createStrapi;

async function seedRequisitions() {
    const strapi = await strapiFactory({ distDir: './dist' }).load();

    try {
        console.log('🌱 Seeding Requisitions...');

        const requisitions = [
            {
                requisitionNo: 'REQ-2026-001',
                requestDate: '2026-01-02',
                department: 'Logistics',
                status: 'Pending Approval',
                items: [
                    { product: 'Diesel Legacy', quantity: 5000 },
                    { product: 'Safety Gloves', quantity: 10 }
                ]
            },
            {
                requisitionNo: 'REQ-2026-002',
                requestDate: '2026-01-03',
                department: 'Admin',
                status: 'Approved',
                items: [
                    { product: 'Printer Paper', quantity: 20 },
                    { product: 'Ink Cartridges', quantity: 5 }
                ]
            },
            {
                requisitionNo: 'REQ-2026-003',
                requestDate: '2026-01-08',
                department: 'Sales',
                status: 'Draft',
                items: [
                    { product: 'Marketing Flyers', quantity: 1000 }
                ]
            }
        ];

        for (const req of requisitions) {
            const existing = await strapi.entityService.findMany('api::requisition.requisition', { filters: { requisitionNo: req.requisitionNo } });
            if (existing.length === 0) {
                await strapi.entityService.create('api::requisition.requisition', { data: req });
                console.log(`Created Requisition: ${req.requisitionNo}`);
            }
        }

        console.log('✅ Requisition Seeding complete');
    } catch (error) {
        console.error('Seeding failed', error);
    } finally {
        strapi.destroy();
    }
}

seedRequisitions();
