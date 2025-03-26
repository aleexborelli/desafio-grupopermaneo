import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonsRepository: Repository<Lesson>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async create(
    courseId: number,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    const course = await this.coursesRepository.findOneBy({ id: courseId });

    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    const lesson = this.lessonsRepository.create({
      ...createLessonDto,
      course,
    });

    return await this.lessonsRepository.save(lesson);
  }

  async findAllByCourse(courseId: number): Promise<Lesson[]> {
    return await this.lessonsRepository.find({
      where: { course: { id: courseId } },
      relations: ['comments'],
    });
  }

  async findOne(courseId: number, lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId, course: { id: courseId } },
      relations: ['comments'],
    });

    if (!lesson) {
      throw new NotFoundException(
        `Lesson with ID ${lessonId} not found in course ${courseId}`,
      );
    }

    return lesson;
  }

  async update(
    courseId: number,
    lessonId: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    const lesson = await this.findOne(courseId, lessonId);
    this.lessonsRepository.merge(lesson, updateLessonDto);
    return await this.lessonsRepository.save(lesson);
  }

  async remove(courseId: number, lessonId: number): Promise<void> {
    const result = await this.lessonsRepository.delete({
      id: lessonId,
      course: { id: courseId },
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Lesson with ID ${lessonId} not found in course ${courseId}`,
      );
    }
  }
}
