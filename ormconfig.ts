
module.exports = [
  {
    name: process.env.CONNECTION_NAME,
    type: "postgres",
    url: process.env.DATABASE_URL,
    // host: config.orm.host,
    // port: config.orm.port,
    // username: config.orm.username,
    // password: config.orm.password,
    // database: config.orm.database,
    logging: false,
    synchronize: false,
    entities: [`src/entities/**/*{.ts,.js}`],
    migrations: [
      "src/migrations/**/*{.ts,.js}"
    ],
    cli: {
      migrationsDir: "src/migrations",
      entitiesDir: "src/entities",
    },

  },
  // {
  //   name: process.env.CONNECTION_NAME,
  //   type: "postgres",
  //   host: config.orm.host,
  //   port: config.orm.port,
  //   username: config.orm.username,
  //   password: config.orm.password,
  //   database: config.orm.database,
  //   logging: false,
  //   synchronize: true,
  //   entities: ["src/entities/*.ts"],
  //   cli: {
  //     entitiesDir: "src/entities",
  //   },
  // },
];
