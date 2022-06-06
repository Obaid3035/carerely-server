import { Server, Socket } from 'socket.io'
import User from "../entities/User";
import Message from "../entities/Message";

class EventHandler {
  private io: Server;
  constructor(io: Server) {
    this.io = io
    this.createConnection();
  }

  private createConnection() {
    this.io.on("connection", (socket: Socket) => {
     console.log("Socket connected successfully!")
      this.joinRoom(socket)
      this.disconnect(socket)
    })
  }


  private joinRoom(socket: Socket) {
    socket.on("setup", (currUser: User) => {
      socket.join(currUser.id.toString())
      socket.emit("connected")
    })

    socket.on("join chat", (conversationId: number) => {
      socket.join(conversationId.toString())
      console.log("User Joined Room: " + conversationId)
    })
    this.messageTransmission(socket)
  }

  private messageTransmission(socket: Socket) {
    socket.on("typing", (room: number) => socket.in(room.toString()).emit("typing"))
    socket.on("stop typing", (room: number) => socket.in(room.toString()).emit("stop typing"))

    socket.on("new message", (newMessageReceived: Message) => {
      if (newMessageReceived.conversation.sender_id == newMessageReceived.sender_id) {
        console.log("RECEIVER")
        socket.in(newMessageReceived.conversation.receiver_id.toString()).emit("message received", newMessageReceived)
      }
      if (newMessageReceived.conversation.receiver_id == newMessageReceived.sender_id) {
        console.log(newMessageReceived.conversation.sender_id)
        socket.in(newMessageReceived.conversation.sender_id.toString()).emit("message received", newMessageReceived)
      }
    })
  }

  private disconnect(socket: Socket) {
    socket.off("setup", (currUser: User) => {
      console.log("User disconnect")
      socket.leave(currUser.id.toString())
    })
  }
}

export default EventHandler;
