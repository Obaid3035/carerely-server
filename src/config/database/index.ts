import { DataSource, DataSourceOptions } from "typeorm"

let dbConfig: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: false,
  synchronize: true,
  entities: [`src/entities/**/*{.ts,.js}`],
  migrations: [
    `src/migrations/*{.ts,.js}`
  ],
}

if (process.env.NODE_ENV === 'production') {
  dbConfig = {
    type: "postgres",
    url: process.env.DATABASE_URL,
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

console.log(dbConfig)

const AppDataSource = new DataSource(dbConfig)


export default AppDataSource;
