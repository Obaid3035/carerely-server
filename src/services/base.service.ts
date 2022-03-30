// import { getManager, Repository } from "typeorm";
//
// class BaseService<T> {
//   repo: Repository<T>;
//
//   constructor(user: any) {
//     this.repo = getManager().getRepository(user);
//   }
//
//   async findAll(): Promise<T[]> {
//     return await this.repo.find();
//   }
//
//   async insert(data: T): Promise<T> {
//     const resource = this.repo.create(data);
//     return await this.repo.save(resource);
//   }
// }
//
// export default BaseService;
