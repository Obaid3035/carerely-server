import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  Index
} from "typeorm";
import jwt from "jsonwebtoken";
import FriendShip from "./FriendShip";
import Post from "./Post";
import Like from "./Like";
import Comment from "./Comment";
import bcrypt from "bcrypt";
import { BadRequest, NotFound, UnAuthorized } from "../utils/errorCode";
import Profile from "./Profile";
import Queries from "./Queries";
import Blog from "./Blog";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity(User.MODEL_NAME)
class User extends BaseEntity {
  static MODEL_NAME = "user";

  static async authenticate(email: string, password: string) {
    const user: User = await User.findOne({
      email: email,
    });
    if (!user) {
      throw new NotFound("Unable too login. Please registered yourself");
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequest("Email or Password is incorrect");
    }
    return user;
  }

  static async authorize(token: string) {
    const decode = <any> jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne(decode.user._id);
    if (!user) {
      throw new UnAuthorized("Session expired")
    }
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column("varchar", {
    length: 25,
  })
  user_name: string;

  @Column("varchar", {
    length: 50,
    unique: true,
  })
  email: string;

  @Column("varchar")
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role: UserRole;

  @Column("boolean", {
    default: false,
  })
  profile_setup: boolean;

  @OneToMany(() => FriendShip, (friendShip) => friendShip.sender)
  sender: FriendShip[];

  @OneToMany(() => FriendShip, (friendShip) => friendShip.receiver)
  receiver: FriendShip[];

  @OneToMany(() => Post, (post) => post.user)
  post: Post[];

  @OneToMany(() => Like, (like) => like.user)
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile

  @OneToMany(() => Queries, (queries) => queries.user)
  queries: Queries

  @OneToMany(() => Blog, (blog) => blog.user)
  blog: Queries

  generateToken() {
    const user = this;
    console.log(user)
    delete user.password
    return jwt.sign({ user }, process.env.JWT_SECRET);
  }

  @BeforeInsert()
  async userAlreadyExists() {
    const user = await User.findOne({ email: this.email });
    if (user) {
      throw new NotFound("Sorry this email is already in use");
    }
  }

  @BeforeInsert()
  async encryptPassword() {
    const user = this;
    if (user.password) {
      this.password = await bcrypt.hash(user.password, 10);
    }
  }
}

export default User;
