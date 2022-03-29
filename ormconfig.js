"use strict";
module.exports = [
    {
        name: process.env.CONNECTION_NAME,
        type: "postgres",
        url: process.env.DATABASE_URL,
        logging: false,
        synchronize: false,
        entities: [`src/entities/*{.ts,.js}`],
        migrations: [
            "src/config/*{.ts,.js}"
        ],
        cli: {
            migrationsDir: "src/config",
            entitiesDir: "src/entities",
        },
    },
];
