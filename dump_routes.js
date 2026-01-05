"use strict";

const strapi = require("@strapi/strapi");

async function main() {
    const app = await strapi().load();
    const routes = app.server.listRoutes();
    console.log(JSON.stringify(routes, null, 2));
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
