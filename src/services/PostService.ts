// import BaseService from "./base.service";
import Post from "../entities/Post";
import User from "../entities/User";
import { Service } from "typedi";
import FriendShip, { FriendShipStatus } from "../entities/FriendShip";
import { Brackets } from "typeorm";
import Comment from "../entities/Comment";
import Like from "../entities/Like";
import cloudinary from "../utils/cloudinary";

@Service()
class PostService {

  async index(user: User, skip: number, limit: number): Promise<any> {
    console.log(
      "************ Fetching all the friendships of current user ************"
    );
    const friendShips = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :sender_id", { sender_id: user.id })
      .orWhere("friendship.receiver_id = :receiver_id", {
        receiver_id: user.id,
      })
      .getMany();

    const validUserIds = FriendShip.getValidUserIdsForPost(
      friendShips,
      user.id
    );

    console.log(
      "************ Fetching all the post that current user can see ************"
    );


    const postsPromise = await Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post_user.user_name"])
      .where("post.user_id IN(:...user_id)", { user_id: validUserIds })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.like_count", "post.like")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .orderBy("post.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    const postCountPromise = await Post.createQueryBuilder("post")
      .where("post.user_id IN(:...user_id)", { user_id: validUserIds })
      .innerJoin("post.user", "post_user")
      .getCount()

    const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])

    const postIds = posts.map((post) => post.id);

    if (postIds.length <= 0) return [];

    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name"])
      .where("comment.post_id IN(:...post_id)", { post_id: postIds })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "DESC")
      .getMany();

    const likedPost = await Like.find({
      where: {
        user_id: user.id,
      },
    });

    return {
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
      count: postCount
    }
  }


  async getTrendingPost(skip: number, limit: number) {
    const mostLike = await Like.createQueryBuilder("likes")
      .select("COUNT(likes.post_id)", "count")
      .addSelect("post_id")
      .groupBy("likes.post_id")
      .orderBy("count", "DESC")
      .take(limit)
      .skip(skip)
      .getRawMany();

    const mostLikedPostIds = mostLike.map((like) => like.post_id);

    return await Post.createQueryBuilder("post")
      .select(["post", "user.id", "user.user_name"])
      .where("post.id IN(:...post_id)", { post_id: mostLikedPostIds })
      .loadRelationCountAndMap("post.like_count", "post.like", "count")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .leftJoin("post.user", "user")
      .getMany();
  }


  async currentUserPost(user: User, skip: number, limit: number): Promise<any>  {

    const postsPromise = Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post_user.user_name"])
      .where("post.user_id = :user_id", { user_id: user.id })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.like_count", "post.like")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .orderBy("post.created_at", "DESC")
      .skip(skip)
      .take(limit)
      .getMany();

    const postCountPromise = Post.createQueryBuilder("post")
      .where("post.user_id = :user_id", { user_id: user.id })
      .innerJoin("post.user", "post_user")
      .getCount()

    const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])

    const postIds = posts.map((post) => post.id);

    if (postIds.length <= 0) return [];

    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name"])
      .where("comment.post_id IN(:...post_id)", { post_id: postIds })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "DESC")
      .getMany();

    const likedPost = await Like.find({
      where: {
        user_id: user.id,
      },
    });

    return {
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
      count: postCount,
    }
  }

  async show(postId: string, user: User) {
    const post: any = await Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post_user.user_name"])
      .where("post.id = :postId", { postId: postId })
      .loadRelationCountAndMap("post.like_count", "post.like", "count")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .innerJoin("post.user", "post_user")
      .getOne();

    if (!post) {
      return "No Post Found";
    }

    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name"])
      .where("comment.post_id = :post_id", { post_id: post.id })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "ASC")
      .getMany();

    const likedPost = await Like.createQueryBuilder("like")
      .where("like.user_id = :user_id", {user_id: user.id})
      .andWhere("like.post_id = :post_id", {post_id: post.id})
      .getOne()

    post.liked = !!likedPost;
    post.comment = comments
    return post;
  }

  async getFewTrendingPost() {
    const mostLike = await Like.createQueryBuilder("likes")
      .select("COUNT(likes.post_id)", "count")
      .addSelect("post_id")
      .groupBy("likes.post_id")
      .orderBy("count", "DESC")
      .take(4)
      .getRawMany();
    const mostLikedPostIds = mostLike.map((like) => like.post_id);

    if (mostLikedPostIds.length > 0) {
      return await Post.createQueryBuilder("post")
        .select(["post", "user.id", "user.user_name"])
        .where("post.id IN(:...post_id)", { post_id: mostLikedPostIds })
        .loadRelationCountAndMap("post.like_count", "post.like", "count")
        .loadRelationCountAndMap("post.comment_count", "post.comment")
        .leftJoin("post.user", "user")
        .getMany();
    }
    return []
  }

  async create(userInput: Post, user: User, img: any) {

    let createdPost;
    if (img) {
      const uploadedImage = await cloudinary.v2.uploader.upload(img.path);
      createdPost = Post.create({
        user,
        image: {
          avatar: uploadedImage.secure_url,
          cloudinary_id: uploadedImage.public_id
        },
        text: userInput.text,
      });
      await createdPost.save();
    } else  {
      createdPost = Post.create({
        user,
        image: img ? img.path : null,
        text: userInput.text,
      });
      await createdPost.save();
    }

    const post: any = await Post.createQueryBuilder("post")
      .select(["post", "post_user.id", "post_user.user_name"])
      .where("post.id = :postId", { postId: createdPost.id })
      .innerJoin("post.user", "post_user")
      .loadRelationCountAndMap("post.like_count", "post.like", "count")
      .loadRelationCountAndMap("post.comment_count", "post.comment")
      .getOne();
    const comments = await Comment.createQueryBuilder("comment")
      .select(["comment", "user.id", "user.user_name"])
      .where("comment.post_id = :post_id", { post_id: post.id })
      .innerJoin("comment.user", "user")
      .orderBy("comment.created_at", "ASC")
      .getMany();


    const likedPost = await Like.createQueryBuilder("post")
      .where("post.post_id = :post_id", { post_id: post.id })
      .andWhere("post.user_id = :user_id", { user_id: user.id})
      .getOne();
    post.comment = comments;
    post.liked = !!likedPost

    return post;
  }

  // @ts-ignore
  async otherPost(
    currUser: User,
    otherUserId: string,
    skip: number,
    limit: number
  ) {
    console.log(
      "************ Fetching post, followers/following, name of the other user ************"
    );

    console.log(
      "************ Checking if user and otherUser have a friendShip ************"
    );
    const completedFriendShip = await FriendShip.createQueryBuilder("friendship")
      .where(
        new Brackets((qb) => {
          qb.where(`friendship.status = :status`, {
            status: FriendShipStatus.COMPLETE,
          })
            .orWhere(
              new Brackets((qb) => {
                qb.where("friendship.receiver_id = :receiver_id", {
                  receiver_id: otherUserId,
                }).andWhere("friendship.sender_id = :sender_id", {
                  sender_id: currUser.id,
                });
              })
            )
            .orWhere(
              new Brackets((qb) => {
                qb.where("friendship.receiver_id = :receiver_id", {
                  receiver_id: currUser.id,
                }).andWhere("friendship.sender_id = :sender_id", {
                  sender_id: otherUserId,
                });
              })
            );
        })
      ).getOne();

    const partialFriendship = await FriendShip.createQueryBuilder("friendship")
      .where(
        new Brackets((qb) => {
          qb.where(`friendship.status = :status`, {
            status: FriendShipStatus.PARTIAL,
          })
            .orWhere(
              new Brackets((qb) => {
                qb.where("friendship.receiver_id = :receiver_id", {
                  receiver_id: otherUserId,
                }).andWhere("friendship.sender_id = :sender_id", {
                  sender_id: currUser.id,
                });
              })
            )
            .orWhere(
              new Brackets((qb) => {
                qb.where("friendship.receiver_id = :receiver_id", {
                  receiver_id: currUser.id,
                }).andWhere("friendship.sender_id = :sender_id", {
                  sender_id: otherUserId,
                });
              })
            );
        })
      ).getOne();

    console.log("FRIENDSHIP", completedFriendShip)

    if (completedFriendShip === undefined && partialFriendship === undefined) {
      console.log(
        "************ User and other user friendShip does not exist ************"
      );
      return {
        friendShip: false,
        status: "SEND",
      };
    }

    if ((partialFriendship && partialFriendship.status === FriendShipStatus.PARTIAL && partialFriendship.sender_id === currUser.id)
      ||(completedFriendShip && completedFriendShip.status === FriendShipStatus.COMPLETE) ) {
      console.log(
        "************ Fetching all the post that other user ************"
      );
      const postsPromise = Post.createQueryBuilder("post")

        .select(["post", "post_user.id", "post_user.user_name"])
        .where("post.user_id = :user_id", { user_id: otherUserId })
        .innerJoin("post.user", "post_user")
        .loadRelationCountAndMap("post.like_count", "post.like")
        .loadRelationCountAndMap("post.comment_count", "post.comment")
        .orderBy("post.created_at", "DESC")
        .skip(skip)
        .take(limit)
        .getMany();

      const postCountPromise = Post.createQueryBuilder("post")
        .where("post.user_id = :user_id", { user_id: otherUserId })
        .innerJoin("post.user", "post_user")
        .getCount()


      const [posts, postCount] = await Promise.all([postsPromise, postCountPromise])


      const postIds = posts.map((post) => post.id);

      if (postIds.length <= 0) {
        return [];
      }

      const comments = await Comment.createQueryBuilder("comment")
        .select([
          "comment",
          "user.id",
          "user.user_name",
        ])
        .where("comment.post_id IN(:...post_id)", { post_id: postIds })
        .innerJoin("comment.user", "user")
        .orderBy("comment.created_at", "ASC")
        .getMany();

      const likedPost = await Like.find({
        where: {
          user_id: currUser.id,
        },
      });
      return {
        friendship: true,
        status: "VIEW",
        count: postCount,
        posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
      };
    }

    return {
      friendship: true,
      status: "ACCEPT"
    }
  }
}

export default PostService;
