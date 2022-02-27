import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import jwt from "jsonwebtoken";
import FriendShip from "./FriendShip";
import UserPost from "./UserPost";
import PostLike from "./PostLike";
import PostComment from "./PostComment";
import bcrypt from "bcrypt";
import { BadRequest, NotFound } from "../utils/errorCode";
import Profile from "./Profile";

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

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {
    length: 25,
  })
  first_name: string;

  @Column("varchar", {
    length: 25,
  })
  last_name: string;

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
  is_profile_setup: boolean;

  @OneToMany(() => FriendShip, (friendShip) => friendShip.sender)
  sender: FriendShip[];

  @OneToMany(() => FriendShip, (friendShip) => friendShip.receiver)
  receiver: FriendShip[];

  @OneToMany(() => UserPost, (post) => post.user)
  post: UserPost[];

  @OneToMany(() => PostLike, (like) => like.user)
  like: PostLike[];

  @OneToMany(() => PostComment, (comment) => comment.user)
  comment: PostComment;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile

  generateToken() {
    return jwt.sign({ id: this.id.toString() }, process.env.JWT_SECRET);
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
