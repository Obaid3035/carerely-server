import { Service } from "typedi";
import Conversation from "../entities/Conversation";
import User from "../entities/User";
import { Brackets } from "typeorm";
import { NotFound } from "../utils/errorCode";

@Service()
class ConversationService {
  async index(currUser: User, search: any) {
    const conversation = await Conversation.createQueryBuilder("conversation")
      .select(["conversation", "sender.id", "sender.user_name", "receiver.id", "receiver.user_name"])
      .where("conversation.sender_id = :sender_id", { sender_id: currUser.id})
      .orWhere("conversation.receiver_id = :receiver_id", { receiver_id: currUser.id})
      .innerJoin("conversation.sender", "sender")
      .innerJoin("conversation.receiver", "receiver")
      .orderBy("conversation.updated_at", "ASC")
      .getMany();


    if (search && search.length > 0) {
      let searchedConversation = conversation.filter((conversation: Conversation) => {
        if (conversation.sender.id !== currUser.id && conversation.sender.user_name.includes(search)) {
          return true
        } else if (conversation.receiver.id !== currUser.id && conversation.receiver.user_name.includes(search)) {
          return true
        }
        return false
      })
      return searchedConversation;
    }



    return conversation;
  }

  async create(currUser: User, otherUserId: number) {
    const receiver: User = await User.findOne({
      where: {
        id: otherUserId
      }
    });

    if (!receiver) {
      throw new NotFound("User does not exist with that particular id")
    }
    const conversation = await Conversation.createQueryBuilder("conversation")
      .where(new Brackets((qb) => {
        qb.where("conversation.sender_id = :sender_id", { sender_id: currUser.id})
          .andWhere("conversation.receiver_id = :receiver_id", { receiver_id: receiver.id})
      }))
      .orWhere(new Brackets((qb) => {
        qb.where("conversation.sender_id = :receiver_id", { receiver_id: receiver.id})
          .andWhere("conversation.receiver_id = :sender_id", { sender_id: currUser.id})
      }))
      .getOne();


    if (conversation) {
      return {
        message: "Conversation already created"
      }
    }

    const conversationInstance = Conversation.create({
      sender: currUser,
      receiver: receiver,
    })

    await conversationInstance.save()

    return {
      message: "Conversation created successfully!"
    }

  }
}

export default ConversationService
