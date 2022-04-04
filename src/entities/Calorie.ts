import {
  BaseEntity,
  Column, CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import User from "./User";

@Entity(Calorie.MODEL_NAME)
class Calorie extends BaseEntity {
  static MODEL_NAME = "calorie";

  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  mealType: string

  @Column("simple-json", {
    nullable: false
  })
  foodDetail: {
    calorie: number,
    protein: number,
    carb: number,
    fat: number,
    sugar: number
  };

  @ManyToOne(() => User, (user) => user.calorie)
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column("int")
  user_id: number;

  @CreateDateColumn()
  created_at: Date;
}

export default Calorie;












