import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Lesson } from '../lessons/entities/lesson.entity'; // Certifique-se que está importado
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,

    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>, // Injeção correta
  ) {}

  async findAllByLesson(
    courseId: number,
    lessonId: number,
  ): Promise<Comment[]> {
    await this.verifyLessonExists(courseId, lessonId);
    return this.commentsRepository.find({
      where: { lesson: { id: lessonId } },
    });
  }

  async create(
    courseId: number,
    lessonId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const lesson = await this.verifyLessonExists(courseId, lessonId);

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      lesson,
    });

    return this.commentsRepository.save(comment);
  }

  private async verifyLessonExists(
    courseId: number,
    lessonId: number,
  ): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({
      where: {
        id: lessonId,
        course: { id: courseId },
      },
    });

    if (!lesson) {
      throw new NotFoundException(
        `Lesson with ID ${lessonId} not found in course ${courseId}`,
      );
    }

    return lesson;
  }
}
