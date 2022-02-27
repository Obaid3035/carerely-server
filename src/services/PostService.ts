import BaseService from "./base.service";
import UserPost from "../entities/UserPost";
import User from "../entities/User";
import { Service } from "typedi";
import { ICreateResponse } from "../interface";
import FriendShip from "../entities/FriendShip";
import { In } from "typeorm";

@Service()
class PostService extends BaseService<UserPost> {
  constructor() {
    super(UserPost);
  }

  async index(user: User) {
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
    return await UserPost.find({
      where: {
        user_id: In(validUserIds),
      },
    });
  }

  async create(userInput: UserPost, user: User): Promise<ICreateResponse> {
    const post = UserPost.create({
      user,
      text: userInput.text,
    });
    await post.save();
    return {
      saved: true,
    };
  }
}

export default PostService;
