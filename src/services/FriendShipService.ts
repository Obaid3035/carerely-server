import { Service } from "typedi";
// import BaseService from "./base.service";
import FriendShip  from "../entities/FriendShip";
import User from "../entities/User";
import { NotFound } from "../utils/errorCode";

@Service()
class FriendShipService {

  async getUserFollower(currUserId: number | string) {
    return await FriendShip.createQueryBuilder("friendShip")
      .select(["friendShip", "user.user_name"])
      .where("friendShip.receiver_id = :receiver_id", { receiver_id: currUserId })
      .innerJoin("friendShip.sender", "user")
      .getMany();
  }

  async getUserFollowing(currUserId: number | string) {
    return await FriendShip.createQueryBuilder("friendShip")
      .select(["friendShip", "user.user_name"])
      .where("friendShip.sender_id = :sender_id", { sender_id: currUserId })
      .innerJoin("friendShip.receiver", "user")
      .getMany();
  }

  async unFollowFriendship(friendShipId: number) {
    const friendShip = await FriendShip.findOne({
      where: {
        id: friendShipId
      }
    });
    if (!friendShip) {
      throw new NotFound("FriendShip not found");
    }
    await FriendShip.remove(friendShip);
    return {
      deleted: true
    }
  }

  async sendFriendShipRequest(sender: User, receiverId: number) {
    console.log("*********** Creating FriendShip *************");

    const receiver: User = await User.findOne({
      where: {
        id: receiverId
      }
    });
    if (!receiver) {
      throw new NotFound("User not found");
    }
    const friendShip = FriendShip.create({
      sender: sender,
      receiver: receiver,
    });
    await friendShip.save();

    console.log("*********** FriendShip Created Successfully *************");
    return {
      friendship: true
    };
  }

  async deleteFriendShip(userId_1: string, currUserId: User) {
    console.log(
      "************** Checking if user 1 is the sender and user 2 is receiver *************"
    );
    const friendShip_1 = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.receiver_id = :receiver_id", {
        receiver_id: userId_1,
      }).andWhere("friendship.sender_id = :sender_id", {
        sender_id: currUserId.id,
      }).getOne();

    if (!friendShip_1) {
      throw new Error("No FriendShip Found");
    }

    await FriendShip.delete(friendShip_1.id);
    console.log("************** FriendShip Successfully deleted *************");
    return {
      friendship: false,
    };
  }
}

export default FriendShipService;
