import { DataSource, DataSourceOptions } from "typeorm"

let dbConfig: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: false,
  synchronize: false,
  entities: [`src/entities/**/*{.ts,.js}`],
  migrations: [
    `src/migrations/*{.ts,.js}`
  ],
}

if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    type: "postgres",
    name: "db-postgresql-carerely-nyc3-82257",
    username: "doadmin",
    password: "AVNS_oPA6FncjNZYt04sa6TG",
    host: "db-postgresql-carerely-nyc3-82257-do-user-11810815-0.b.db.ondigitalocean.com",
    port: 25060,
    database: "defaultdb",
    logging: false,
    synchronize: false,
    entities: [`dist/entities/**/*{.ts,.js}`],
    migrations: [
      `dist/migrations/*{.ts,.js}`
    ],
    ssl: {
      rejectUnauthorized: false
    }
  }
}

const AppDataSource = new DataSource(dbConfig)


export default AppDataSource;
