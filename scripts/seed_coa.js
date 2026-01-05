
const strapiFactory = require('@strapi/strapi').createStrapi;

async function seedCOA() {
    const strapi = await strapiFactory({ distDir: './dist' }).load();

    try {
        console.log('🌱 Seeding Chart of Accounts...');

        const accounts = [
            { code: '1000', name: 'Assets', type: 'Asset', classification: 'Non-Current' },
            { code: '1001', name: 'Cash on Hand', type: 'Asset', classification: 'Current', currentBalance: 5000 },
            { code: '1002', name: 'Bank Account - Main', type: 'Asset', classification: 'Current', currentBalance: 25000 },
            { code: '2000', name: 'Accounts Payable', type: 'Liability', classification: 'Current' },
            { code: '3000', name: 'Owner Equity', type: 'Equity', classification: 'Non-Current' },
            { code: '4000', name: 'Fuel Revenue', type: 'Revenue', classification: 'Operating', currentBalance: 12000 },
            { code: '4001', name: 'Lube Revenue', type: 'Revenue', classification: 'Operating', currentBalance: 450 },
            { code: '5000', name: 'Cost of Goods Sold', type: 'Expense', classification: 'Operating' },
            { code: '5001', name: 'Rent Expense', type: 'Expense', classification: 'Operating', currentBalance: 1000 },
        ];

        for (const acc of accounts) {
            const existing = await strapi.entityService.findMany('api::chart-of-account.chart-of-account', { filters: { code: acc.code } });
            if (existing.length === 0) {
                await strapi.entityService.create('api::chart-of-account.chart-of-account', { data: acc });
                console.log(`Created Account: ${acc.code} - ${acc.name}`);
            }
        }

        console.log('✅ COA Seeding complete');
    } catch (error) {
        console.error('Seeding failed', error);
    } finally {
        strapi.destroy();
    }
}

seedCOA();
