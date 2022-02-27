import { Service } from "typedi";
import BaseService from "./base.service";
import FriendShip, { FriendShipStatus } from "../entities/FriendShip";
import User from "../entities/User";
import BadRequest, { NotFound } from "../utils/errorCode";

@Service()
class FriendShipService extends BaseService<FriendShip> {
  constructor() {
    super(FriendShip);
  }

  async sendFriendShipRequest(
    sender: User,
    receiverId: string
  ): Promise<{ saved: boolean }> {
    console.log("*********** Creating FriendShip *************");

    const receiver: User = await User.findOne(receiverId);
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
    };
  }

  async acceptFriendShipRequest(
    receiver: User,
    senderId: string
  ): Promise<{ updated: boolean }> {
    const sender: User = await User.findOne(senderId);
    if (!sender) {
      throw new NotFound("User not found");
    }

    const friendShip = await FriendShip.findOne({
      where: {
        sender_id: sender,
        receiver_id: receiver,
      },
    });


    if (friendShip.status === FriendShipStatus.COMPLETE) {
      throw new BadRequest("Sorry friendship is already complete");
    }

    friendShip.status = FriendShipStatus.COMPLETE;
    await friendShip.save();
    return {
      updated: true,
    };
  }

  async declineFriendShipRequest(receiver: User, senderId: string) {
    const sender: User = await User.findOne(senderId);
    if (!sender) {
      throw new NotFound("User not found");
    }

    const friendShip = await FriendShip.findOne({
      where: {
        sender_id: sender,
        receiver_id: receiver,
      },
    });

    if (!friendShip) {
      throw new BadRequest("Sorry FriendShip Request does not exist");
    }

    await FriendShip.delete(friendShip.id);
    return {
      deleted: true,
    };
  }

  async deleteFriendShip(userId_1: string, user_2: User) {
    console.log("************** Checking if user 1 is the sender and user 2 is receiver *************")
    const friendShip = await FriendShip.createQueryBuilder("friendship")
      .where("friendship.sender_id = :sender_id", {
        sender_id: userId_1
      })
      .andWhere("friendship.receiver_id = :receiver_id", {
        receiver_id: user_2.id,
      })
      .andWhere("friendship.status = :status", {
        status: FriendShipStatus.COMPLETE,
      })
      .getOne();


    if (!friendShip) {
      console.log("************** Checking if user 2 is the sender and user 1 is receiver *************")
      const friendShip_2 = await FriendShip.createQueryBuilder("friendship")
        .where("friendship.sender_id = :sender_id", {
          sender_id: user_2.id,
        })
        .andWhere("friendship.receiver_id = :receiver_id", {
          receiver_id: userId_1,
        })
        .andWhere("friendship.status = :status", {
          status: FriendShipStatus.COMPLETE,
        })
        .getOne();
      if (!friendShip_2) {
        throw new Error("No FriendShip Found");
      }
      console.log("************** FriendShip Successfully deleted *************")
      await FriendShip.delete(friendShip_2.id);
      return {
        deleted: true,
      };
    }

    await FriendShip.delete(friendShip.id);
    console.log("************** FriendShip Successfully deleted *************")
    return {
      deleted: true,
    };
  }
}

export default FriendShipService;
