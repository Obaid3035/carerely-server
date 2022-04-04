import { Service } from "typedi";
import User from "../entities/User";
import Post from "../entities/Post";
import { NotFound } from "../utils/errorCode";
import Comment from "../entities/Comment";

@Service()
class CommentService {

  async delete(commentId: number) {
    const comment = await Comment.findOne({
      where: {
        id: commentId
      }
    })

    if(!comment) {
      throw new NotFound("Comment not found")
    }

    await Comment.delete(comment.id)
    return {
      message: "Comment deleted successfully!"
    }
  }

  async create(currUser: User, postId: number, userInput: Comment) {
    const post: Post = await Post.findOne({
      where: {
        id: postId
      }
    });
    if (!post) {
      throw new NotFound("User not found");
    }

    const createdComment = Comment.create({
      post: post,
      user_id: currUser.id,
      text: userInput.text,
    });

    await createdComment.save();

    return await Comment.createQueryBuilder("comment")
      .select([
        "comment.id",
        "comment.post_id",
        "comment.text",
        "user.id",
        "user.user_name",
      ])
      .where("comment.id = :id", { id: createdComment.id })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "ASC")
      .getOne();
  }
}

export default CommentService;
