import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
  type: "postgres",
  url: "postgres://pwmhszjhwxpvit:99321ac75479a76af5141b63a5b38b210a8ac3a00b545d77b05578a7f9e69950@ec2-34-231-63-30.compute-1.amazonaws.com:5432/d6ag5tpu52r1gg",
  logging: false,
  synchronize: false,
  entities: [`src/entities/**/*{.ts,.js}`],
  migrations: [
    "src/migrations/**/*{.ts,.js}"
  ],
  ssl: {
    rejectUnauthorized: true
  }
})

export default AppDataSource;
