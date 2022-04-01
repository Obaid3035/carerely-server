import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: false,
  synchronize: true,
  entities: [`${process.env.PROJECT_PATH}/entities/**/*{.ts,.js}`],
  migrations: [
    `${process.env.PROJECT_PATH}/migrations/**/*{.ts,.js}`
  ],
  ssl: {
    rejectUnauthorized: false
  }
})

export default AppDataSource;
