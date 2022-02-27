import {
  BaseEntity,
  Column,
  Entity,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";
import PostLike from "./PostLike";
import PostComment from "./PostComment";

@Entity(UserPost.MODEL_NAME)
class UserPost extends BaseEntity {
  static MODEL_NAME = "user_post";

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {
    nullable: false
  })
  text: string;

  @Column("simple-json", {
    nullable: true
  })
  post_img: {
    avatar: string;
    cloudinary_id: string;
  };

  @Column("int", {
    default: 0,
  })
  like_count: number;

  @Column("int", {
    default: 0,
  })
  comment_count: number;

  @ManyToOne(() => User, (user) => user.post, {
    nullable: false
  })
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column("int")
  user_id: number

  @OneToMany(() => PostLike, (like) => like.post, {
    nullable: true
  })
  like: UserPost[];

  @OneToMany(() => PostComment, (comment) => comment.post, {
    nullable: true
  })
  comment: PostComment;

  @CreateDateColumn()
  created_at: Date;

}

export default UserPost;
