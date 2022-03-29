import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";

export enum GENDER {
  MALE = "male",
  FEMALE = "female",
}

@Entity(Profile.MODEL_NAME)
class Profile extends BaseEntity {
  static MODEL_NAME = "profile";

  @PrimaryGeneratedColumn()
  id: number;

  @Column("date")
  dob: Date;

  @Column("float")
  height: number;

  @Column("varchar")
  height_unit: string;

  @Column("float")
  weight: number;

  @Column("varchar")
  weight_unit: string;

  @Column({
    type: "enum",
    enum: GENDER,
  })
  gender: GENDER;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}

export default Profile;
