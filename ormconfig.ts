import config from "./src/config";

module.exports = [
  {
    name: process.env.CONNECTION_NAME,
    type: "postgres",
    host: config.orm.host,
    port: config.orm.port,
    username: config.orm.username,
    password: config.orm.password,
    database: config.orm.database,
    logging: false,
    synchronize: true,
    entities: ["src/entities/*.ts"],
    cli: {
      entitiesDir: "src/entities",
    },
  },
  {
    name: process.env.CONNECTION_NAME,
    type: "postgres",
    host: config.orm.host,
    port: config.orm.port,
    username: config.orm.username,
    password: config.orm.password,
    database: config.orm.database,
    logging: false,
    synchronize: true,
    entities: ["src/entities/*.ts"],
    cli: {
      entitiesDir: "src/entities",
    },
  },
];
