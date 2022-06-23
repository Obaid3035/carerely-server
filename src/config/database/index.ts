import { DataSource, DataSourceOptions } from "typeorm"

let dbConfig: DataSourceOptions = {
  type: "postgres",
  url: "postgres://obaidaqeel:password@localhost:5432/carerely_development",
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
    url: "postgres://uzqpzlmypzkdkp:a4f94151ff2ecbe239f0962130b6753018636c553aa9e2c60a5c2f4baf46d7e3@ec2-23-20-224-166.compute-1.amazonaws.com:5432/dbu76ag6mhjmek",
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
