import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgres://obaidaqeel:password@localhost:5432/carerely_development",
  logging: false,
  synchronize: true,
  entities: [`src/entities/**/*{.ts,.js}`],
  migrations: [
    "src/migrations/**/*{.ts,.js}"
  ],
})

export default AppDataSource;
