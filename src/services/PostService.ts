// import BaseService from "./base.service";
import Post from "../entities/Post";
import User from "../entities/User";
import { Service } from "typedi";
import FriendShip  from "../entities/FriendShip";
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

    if (postIds.length <= 0) return {
      posts: [],
      count: postCount
    };

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

    if (postIds.length <= 0) return {
      posts: [],
      count: 0
    }

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

  async getFewTrendingPost(currUserId: number) {
    const mostLike = await Like.createQueryBuilder("likes")
      .select("COUNT(likes.post_id)", "count")
      .addSelect("post_id")
      .groupBy("likes.post_id")
      .orderBy("count", "DESC")
      .take(4)
      .getRawMany();
    const mostLikedPostIds = mostLike.map((like) => like.post_id);

    const likedPost = await Like.find({
      where: {
        user_id: currUserId,
      },
    });

    if (mostLikedPostIds.length > 0) {
      const posts = await Post.createQueryBuilder("post")
        .select(["post", "user.id", "user.user_name"])
        .where("post.id IN(:...post_id)", { post_id: mostLikedPostIds })
        .loadRelationCountAndMap("post.like_count", "post.like", "count")
        .loadRelationCountAndMap("post.comment_count", "post.comment")
        .leftJoin("post.user", "user")
        .getMany();

      return posts.map((post) => {
        const liked = likedPost.find((like) => {
          return like.post_id === post.id;
        })
        return {
          ...post,
          liked: !!liked
        };
      })
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

    const friendShip = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiver_id", {
        receiver_id: otherUserId,
      }).andWhere("friendship.sender_id = :sender_id", {
        sender_id: currUser.id,
      }).getOne();

    if (!friendShip) {
      console.log(
        "************ User and other user friendShip does not exist ************"
      );
      return {
        friendship: false,
      };
    }
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
      return {
        friendship: true,
        count: postCount,
        posts: []
      };
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
      count: postCount,
      posts: Post.mergeCommentLikeAndPost(posts, comments, likedPost),
    };
  }
}

export default PostService;
