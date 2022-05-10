import App from "./app";
import UserController from "./controller/user.controller";
import AdminUserController from "./controller/admin/user.controller";
import FriendShipController from "./controller/friendShip.controller";
import PostController from "./controller/post.controller";
import LikeController from "./controller/like.controller";
import CommentController from "./controller/comment.controller";
import QueriesController from "./controller/queries.controller";
import AdminBlogController from "./controller/admin/blog.controller";
import BlogController from "./controller/blog.controller";
import ProfileController from "./controller/profile.controller";
import CalorieController from "./controller/calorie.controller";

new App([
  new UserController(),
  new AdminUserController(),
  new FriendShipController(),
  new PostController(),
  new LikeController(),
  new CommentController(),
  new QueriesController(),
  new AdminBlogController(),
  new BlogController(),
  new ProfileController(),
  new CalorieController()
]).bootstrap();



