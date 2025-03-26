import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundException } from '@nestjs/common';
import { Course } from 'src/courses/entities/course.entity';

describe('CommentsService', () => {
  let service: CommentsService;
  let commentRepository: Repository<Comment>;
  let lessonRepository: Repository<Lesson>;

  const mockLesson: Lesson = {
    id: 1,
    title: 'Test Lesson',
    description: 'Test Description',
    course: { id: 1, name: 'Test Course', category: 'Test' } as Course,
    comments: [],
  };

  const mockComment: Comment = {
    id: 1,
    user: 'Test User',
    text: 'Test Comment',
    date: '2023-10-15',
    lesson: mockLesson,
  };

  const createCommentDto: CreateCommentDto = {
    user: 'New User',
    text: 'New Comment',
    date: '2023-10-16',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            find: jest.fn().mockResolvedValue([mockComment]),
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              lesson: mockLesson,
              id: 1,
            })),
            save: jest
              .fn()
              .mockImplementation((comment) => Promise.resolve(comment)),
          },
        },
        {
          provide: getRepositoryToken(Lesson),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockLesson),
          },
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    lessonRepository = module.get<Repository<Lesson>>(
      getRepositoryToken(Lesson),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByLesson', () => {
    it('should return an array of comments for a lesson', async () => {
      const result = await service.findAllByLesson(1, 1);
      expect(result).toEqual([mockComment]);
      expect(lessonRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, course: { id: 1 } },
      });
      expect(commentRepository.find).toHaveBeenCalledWith({
        where: { lesson: { id: 1 } },
      });
    });

    it('should throw NotFoundException when lesson not found', async () => {
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findAllByLesson(1, 999)).rejects.toThrow(
        new NotFoundException('Lesson with ID 999 not found in course 1'),
      );
    });
  });

  describe('create', () => {
    it('should create a new comment', async () => {
      const result = await service.create(1, 1, createCommentDto);
      expect(result).toEqual({
        ...createCommentDto,
        lesson: mockLesson,
        id: 1,
      });
      expect(lessonRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, course: { id: 1 } },
      });
      expect(commentRepository.create).toHaveBeenCalledWith({
        ...createCommentDto,
        lesson: mockLesson,
      });
      expect(commentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when lesson not found', async () => {
      jest.spyOn(lessonRepository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.create(1, 999, createCommentDto)).rejects.toThrow(
        new NotFoundException('Lesson with ID 999 not found in course 1'),
      );
    });
  });
});
