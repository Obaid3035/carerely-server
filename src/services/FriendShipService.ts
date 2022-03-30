import { Service } from "typedi";
// import BaseService from "./base.service";
import FriendShip, { FriendShipStatus } from "../entities/FriendShip";
import User from "../entities/User";
import BadRequest, { NotFound } from "../utils/errorCode";
import { Brackets } from "typeorm";

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
      saved: true,
      status: "VIEW",
    };
  }

  async acceptFriendShipRequest(receiver: User, senderId: number) {
    const sender: User = await User.findOne({
      where: {
        id: senderId
      }
    });
    if (!sender) {
      throw new NotFound("User not found");
    }

    const friendShip = await FriendShip.findOne({
      where: {
        sender_id: sender.id,
        receiver_id: receiver.id,
      },
    });

    if (friendShip.status === FriendShipStatus.COMPLETE) {
      throw new BadRequest("Sorry friendship is already complete");
    }

    friendShip.status = FriendShipStatus.COMPLETE;
    await friendShip.save();
    return {
      updated: true,
      status: "VIEW",
    };
  }

  async declineFriendShipRequest(receiver: User, senderId: number) {
    const sender: User = await User.findOne({
      where: {
        id: senderId
      }
    });
    if (!sender) {
      throw new NotFound("User not found");
    }

    const friendShip = await FriendShip.findOne({
      where: {
        sender_id: sender.id,
        receiver_id: receiver.id,
      },
    });

    if (!friendShip) {
      throw new BadRequest("Sorry FriendShip Request does not exist");
    }

    await FriendShip.delete(friendShip.id);
    return {
      deleted: true,
      status: "SEND",
    };
  }

  async deleteFriendShip(userId_1: string, user_2: User) {
    console.log(
      "************** Checking if user 1 is the sender and user 2 is receiver *************"
    );
    const friendShip_1 = await FriendShip.createQueryBuilder("friendship")
      .where(
        new Brackets((qb) => {
          qb.where("friendship.receiver_id = :receiver_id", {
            receiver_id: userId_1,
          }).andWhere("friendship.sender_id = :sender_id", {
            sender_id: user_2.id,
          });
        })
      )
      .getOne();

    const friendShip_2 = await FriendShip.createQueryBuilder("friendship")
      .where(
        new Brackets((qb) => {
          qb.where("friendship.receiver_id = :receiver_id", {
            receiver_id: user_2.id,
          }).andWhere("friendship.sender_id = :sender_id", {
            sender_id: userId_1,
          });
        })
      )
      .getOne();

    console.log(userId_1, user_2.id);

    if (!friendShip_1 && !friendShip_2) {
      throw new Error("No FriendShip Found");
    }

    if (friendShip_1) {
      await FriendShip.delete(friendShip_1.id);
    } else {
      await FriendShip.delete(friendShip_2.id);
    }

    console.log("************** FriendShip Successfully deleted *************");
    return {
      deleted: true,
      status: "SEND",
    };
  }
}

export default FriendShipService;
