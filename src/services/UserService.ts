import { Service } from "typedi";
import User, { UserRole } from "../entities/User";
import { IUserResponse } from "../interface";
import BaseService from "./base.service";
import FriendShip, { FriendShipStatus } from "../entities/FriendShip";
import Post from "../entities/Post";

@Service()
class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  async searchUsers(search: any) {
    return await User.createQueryBuilder("user")
      .where("user.user_name like :search", {search: `${search}%`})
      .take(5)
      .getMany();
  }

  async register(userInput: User): Promise<IUserResponse> {
    console.log("********** Registering user ***********");
    const user = User.create({
      user_name: userInput.user_name,
      email: userInput.email,
      password: userInput.password,
      role: userInput.role ? userInput.role : UserRole.USER,
    });
    await user.save();
    const token: string = user.generateToken();
    console.log("********** User Registered Successfully ***********");
    return {
      token,
      auth: true,
    };
  }

  async login(email: string, password: string) {
    console.log("********** Logging user ***********");
    const user = await User.authenticate(email, password);
    const token = user.generateToken();
    console.log("********** User logged in Successfully ***********");
    return {
      auth: true,
      role: user.role,
      token,
    };
  }

  async getUserStats(otherUserId: string) {
    const postCountPromise = Post.createQueryBuilder("posts")
      .where("posts.user_id = :otherUserId", { otherUserId: otherUserId })
      .getCount();

    const followersCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiverId", {
        receiverId: otherUserId,
      })
      .orWhere("friendship.status = :status", {status: FriendShipStatus.COMPLETE})
      .getCount();

    const followingsCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :senderId", { senderId: otherUserId })
      .orWhere("friendship.status = :status", {status: FriendShipStatus.COMPLETE})
      .getCount();

    const otherUserPromise = User.findOne({
      where: {
        id: otherUserId,
      },
      select: ["user_name"],
    });
    const [ postCount, followersCount, followingCount, otherUser] =
      await Promise.all([
        postCountPromise,
        followersCountPromise,
        followingsCountPromise,
        otherUserPromise,
      ]);

    return {
      user: otherUser,
      postCount: postCount,
      followingCount: followingCount,
      followersCount: followersCount,
    }
  }

  async getCurrentUserStats(currentUser: User) {
    const postCountPromise = Post.createQueryBuilder("posts")
      .where("posts.user_id = :otherUserId", { otherUserId: currentUser.id })
      .getCount();

    const followersCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiverId", {
        receiverId: currentUser.id,
      })
      .getCount();

    const followingsCountPromise = FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :senderId", { senderId: currentUser.id })
      .getCount();

    const [ postCount, followersCount, followingCount] =
      await Promise.all([
        postCountPromise,
        followersCountPromise,
        followingsCountPromise,
      ]);

    return {
      user: currentUser,
      postCount: postCount,
      followingCount: followingCount,
      followersCount: followersCount,
    }
  }

  async mostFollowedUser() {
    const mostFollowers = await FriendShip.createQueryBuilder("friendship")
      .select("COUNT(friendship.receiver_id)", "count")
      .addSelect("receiver_id")
      .groupBy("friendship.receiver_id")
      .orderBy("count", "DESC")
      .take(4)
      .getRawMany()

    const mostFollowedUserIds = mostFollowers.map((friendship) => friendship.receiver_id);


    return await User.createQueryBuilder("user")
      .select(["user.id", "user.user_name"])
      .where("user.id IN(:...receiver_id)", { receiver_id: mostFollowedUserIds })
      .getMany()
  }
}

export default UserService;
