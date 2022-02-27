import {
  BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import UserPost from './UserPost';
import User from './User';

@Entity(PostLike.MODEL_NAME)
class PostLike extends BaseEntity {
  static MODEL_NAME = 'post_like';

    @PrimaryGeneratedColumn()
      id: number;

    @ManyToOne(() => UserPost, (post) => post.like)
    @JoinColumn({
      name: 'user_post_id',
    })
      post: UserPost;

    @ManyToOne(() => User, (user) => user.like)
    @JoinColumn({
      name: 'user_id',
    })
      user: User;
}

export default PostLike;
