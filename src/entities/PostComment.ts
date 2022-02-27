import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import UserPost from './UserPost';
import User from './User';

@Entity(PostComment.Model_NAME)
class PostComment extends BaseEntity {
  static Model_NAME = 'post_comment';

  @PrimaryGeneratedColumn()
    id: number;

  @ManyToOne(() => UserPost, (post) => post.comment)
  @JoinColumn({
    name: 'user_post_id',
  })
    post: UserPost;

  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({
    name: 'user_id',
  })
    user: User;

  @Column('varchar')
    comment: string;

  @CreateDateColumn()
    created_at: Date;
}
export default PostComment;
