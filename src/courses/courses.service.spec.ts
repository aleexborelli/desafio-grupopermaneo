import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let service: CoursesService;

  const mockCoursesRepository = {
    find: jest
      .fn()
      .mockResolvedValue([{ id: 1, name: 'Test Course', category: 'Test' }]),
    findOne: jest
      .fn()
      .mockResolvedValue({ id: 1, name: 'Test Course', category: 'Test' }),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((course) => Promise.resolve({ id: 1, ...course })),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCoursesRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all courses', async () => {
    expect(await service.findAll()).toEqual([
      { id: 1, name: 'Test Course', category: 'Test' },
    ]);
  });
});
