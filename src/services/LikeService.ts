import { Service } from "typedi";
import User from "../entities/User";
import Like from "../entities/Like";
import Post from "../entities/Post";
import { NotFound } from "../utils/errorCode";

@Service()
class LikeService {
  async create(currUser: User, postId: number) {
    const post: Post = await Post.findOne({
      where: {
        id: postId
      }
    });
    if (!post) {
      throw new NotFound("User not found");
    }

    const foundLike = await Like.findOne({
      where: {
        post_id: postId,
        user_id: currUser.id,
      },
    });

    if (foundLike) {
      await Like.delete({
        id: foundLike.id
      });
      return {
        liked: false,
      };
    }

    const like = Like.create({
      user: currUser,
      post: post,
    });

    await like.save();

    return {
      liked: true,
    };
  }
}

export default LikeService;
