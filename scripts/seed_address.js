const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

async function seedAddress() {
    try {
        console.log('Starting Address Seeding...');

        // 1. Create Country: Bangladesh
        const countryRes = await axios.post(`${STRAPI_URL}/api/countries`, {
            data: {
                name: 'Bangladesh',
                code: 'BD'
            }
        });
        const bdId = countryRes.data.data.documentId;
        console.log('Created Country: Bangladesh');

        // 2. Create Divisions
        const divisions = [
            { name: 'Dhaka', bnName: 'ঢাকা' },
            { name: 'Chittagong', bnName: 'চট্টগ্রাম' },
            { name: 'Rajshahi', bnName: 'রাজশাহী' },
            { name: 'Khulna', bnName: 'খুলনা' },
            { name: 'Barisal', bnName: 'বরিশাল' },
            { name: 'Sylhet', bnName: 'সিলেট' },
            { name: 'Rangpur', bnName: 'রংপুর' },
            { name: 'Mymensingh', bnName: 'ময়মনসিংহ' }
        ];

        const divisionIds = {};
        for (const div of divisions) {
            const res = await axios.post(`${STRAPI_URL}/api/divisions`, {
                data: {
                    ...div,
                    country: bdId
                }
            });
            divisionIds[div.name] = res.data.data.documentId;
            console.log(`Created Division: ${div.name}`);
        }

        // 3. Create a few Districts for Dhaka
        const dhakaDistricts = [
            { name: 'Dhaka', bnName: 'ঢাকা' },
            { name: 'Gazipur', bnName: 'গাজীপুর' },
            { name: 'Narayanganj', bnName: 'নারায়ণগঞ্জ' }
        ];

        const districtIds = {};
        for (const dist of dhakaDistricts) {
            const res = await axios.post(`${STRAPI_URL}/api/districts`, {
                data: {
                    ...dist,
                    division: divisionIds['Dhaka']
                }
            });
            districtIds[dist.name] = res.data.data.documentId;
            console.log(`Created District: ${dist.name} (in Dhaka)`);
        }

        // 4. Create a few Upazilas for Dhaka District
        const dhakaUpazilas = [
            { name: 'Dhamrai', bnName: 'ধামরাই' },
            { name: 'Dohar', bnName: 'দোহার' },
            { name: 'Keraniganj', bnName: 'কেরানীগঞ্জ' },
            { name: 'Savar', bnName: 'সাভার' }
        ];

        for (const upa of dhakaUpazilas) {
            await axios.post(`${STRAPI_URL}/api/upazilas`, {
                data: {
                    ...upa,
                    district: districtIds['Dhaka']
                }
            });
            console.log(`Created Upazila: ${upa.name} (in Dhaka Dist)`);
        }

        // 5. Create City Corporations for Dhaka District
        const cityCorps = [
            { name: 'Dhaka North City Corporation', bnName: 'ঢাকা উত্তর সিটি কর্পোরেশন' },
            { name: 'Dhaka South City Corporation', bnName: 'ঢাকা দক্ষিণ সিটি কর্পোরেশন' }
        ];

        const cityCorpIds = {};
        for (const corp of cityCorps) {
            const res = await axios.post(`${STRAPI_URL}/api/city-corporations`, {
                data: {
                    ...corp,
                    district: districtIds['Dhaka']
                }
            });
            cityCorpIds[corp.name] = res.data.data.documentId;
            console.log(`Created City Corp: ${corp.name}`);
        }

        // 6. Create Zones for Dhaka North
        const dnccZones = [
            { name: 'Zone 1 (Uttara)', bnName: 'অঞ্চল ১ (উত্তরা)' },
            { name: 'Zone 2 (Pallabi)', bnName: 'অঞ্চল ২ (পল্লবী)' },
            { name: 'Zone 3 (Gulshan)', bnName: 'অঞ্চল ৩ (গুলশান)' }
        ];

        for (const zone of dnccZones) {
            await axios.post(`${STRAPI_URL}/api/zones`, {
                data: {
                    ...zone,
                    cityCorporation: cityCorpIds['Dhaka North City Corporation']
                }
            });
            console.log(`Created Zone: ${zone.name} (in DNCC)`);
        }

        console.log('Address Seeding Completed Successfully!');
    } catch (error) {
        if (error.response) {
            console.error('Seeding failed (Backend Response):', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Seeding failed (Message):', error.message);
        }
    }
}

seedAddress();
