import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { Lesson } from './entities/lesson.entity';
import { Course } from '../courses/entities/course.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

describe('LessonsService', () => {
  let service: LessonsService;
  let lessonRepository: Repository<Lesson>;
  let courseRepository: Repository<Course>;

  const mockCourse: Course = {
    id: 1,
    name: 'Test Course',
    category: 'Programming',
    lessons: [],
  };

  const mockLesson: Lesson = {
    id: 1,
    title: 'Test Lesson',
    description: 'Test Description',
    course: mockCourse,
    comments: [],
  };

  const createLessonDto: CreateLessonDto = {
    title: 'New Lesson',
    description: 'New Description',
  };

  const updateLessonDto: UpdateLessonDto = {
    title: 'Updated Lesson',
    description: 'Updated Description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: {
            find: jest.fn().mockResolvedValue([mockLesson]),
            findOne: jest.fn().mockResolvedValue(mockLesson),
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              course: mockCourse,
              id: 1,
            })),
            save: jest
              .fn()
              .mockImplementation((lesson) => Promise.resolve(lesson)),
            merge: jest.fn(),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
        {
          provide: getRepositoryToken(Course),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockCourse),
          },
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    lessonRepository = module.get<Repository<Lesson>>(
      getRepositoryToken(Lesson),
    );
    courseRepository = module.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByCourse', () => {
    it('should return an array of lessons for a course', async () => {
      const result = await service.findAllByCourse(1);
      expect(result).toEqual([mockLesson]);
      expect(lessonRepository.find).toHaveBeenCalledWith({
        where: { course: { id: 1 } },
        relations: ['comments'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single lesson', async () => {
      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockLesson);
      expect(lessonRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, course: { id: 1 } },
        relations: ['comments'],
      });
    });

    it('should throw NotFoundException when lesson not found', async () => {
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne(1, 999)).rejects.toThrow(
        new NotFoundException('Lesson with ID 999 not found in course 1'),
      );
    });
  });

  describe('create', () => {
    it('should create a new lesson', async () => {
      const result = await service.create(1, createLessonDto);
      expect(result).toEqual({
        ...createLessonDto,
        course: mockCourse,
        id: 1,
      });
      expect(courseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(lessonRepository.create).toHaveBeenCalledWith({
        ...createLessonDto,
        course: mockCourse,
      });
      expect(lessonRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when course not found', async () => {
      jest.spyOn(courseRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create(999, createLessonDto)).rejects.toThrow(
        new NotFoundException('Course with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a lesson', async () => {
      const result = await service.update(1, 1, updateLessonDto);
      expect(result).toEqual({
        ...mockLesson,
        ...updateLessonDto,
      });
      expect(lessonRepository.merge).toHaveBeenCalledWith(
        mockLesson,
        updateLessonDto,
      );
      expect(lessonRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when lesson not found', async () => {
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.update(1, 999, updateLessonDto)).rejects.toThrow(
        new NotFoundException('Lesson with ID 999 not found in course 1'),
      );
    });
  });

  describe('remove', () => {
    it('should delete a lesson', async () => {
      await service.remove(1, 1);
      expect(lessonRepository.delete).toHaveBeenCalledWith({
        id: 1,
        course: { id: 1 },
      });
    });

    it('should throw NotFoundException when lesson not found', async () => {
      jest
        .spyOn(lessonRepository, 'delete')
        .mockResolvedValueOnce({ affected: 0 } as any);
      await expect(service.remove(1, 999)).rejects.toThrow(
        new NotFoundException('Lesson with ID 999 not found in course 1'),
      );
    });
  });
});
