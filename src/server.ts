import App from "./app";
import UserController from "./controller/user.controller";
import AdminUserController from "./controller/admin/user.controller";
import FriendShipController from "./controller/friendShip.controller";
import PostController from "./controller/post.controller";

new App([
  new UserController(),
  new AdminUserController(),
  new FriendShipController(),
  new PostController(),
]).bootstrap();
