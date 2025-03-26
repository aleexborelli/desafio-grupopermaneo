import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lesson } from '../../lessons/entities/lesson.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  text: string;

  @Column()
  date: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.comments, { onDelete: 'CASCADE' })
  lesson: Lesson;
}
