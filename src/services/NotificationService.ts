import { Service } from "typedi";
import User from "../entities/User";
import Notification  from "../entities/Notification";

@Service()
class NotificationService {
  async index(currentUser: User) {

    const notification= await Notification.createQueryBuilder("notification")
      .select(["notification", "sender.id", "sender.user_name", "sender.image", "receiver.id", "receiver.user_name", "receiver.image"])
      .where("notification.receiver_id = :receiver_id", {receiver_id: currentUser.id})
      .innerJoin("notification.sender", "sender")
      .innerJoin("notification.receiver", "receiver")
      .orderBy("notification.created_at", "DESC")
      .take(3)
      .getMany()

    return notification

  }
}

export default NotificationService;
