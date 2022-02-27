import express from "express";
import { before, after } from "mocha";
import { Connection, createConnection, getConnection } from "typeorm";
import UserController from "../controller/user.controller";
import App from "../app";
import AdminUserController from "../controller/admin/user.controller";
import FriendShipController from "../controller/friendShip.controller";
import PostController from "../controller/post.controller";

let application: App;
let connection: Connection;
export let app: express.Application;
let server: any;

before(async () => {
  connection = await createConnection(process.env.DB_NAME);
  if (connection.isConnected) {
    application = await new App([
      new UserController(),
      new AdminUserController(),
      new FriendShipController(),
      new PostController(),
    ]);
    app = application.app;
    server = await app.listen(process.env.PORT);
  }
});

afterEach(async () => {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = getConnection().getRepository(entity.name);
    await repository.delete({});
  }
});

after(async () => {
  await server.close();
  await connection.close();
});
