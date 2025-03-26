import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Lesson } from './entities/lesson.entity';

@ApiTags('lessons')
@Controller('courses/:courseId/lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all lessons for a course' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiResponse({ status: 200, description: 'List of lessons', type: [Lesson] })
  findAll(@Param('courseId') courseId: string) {
    return this.lessonsService.findAllByCourse(+courseId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiResponse({
    status: 201,
    description: 'The lesson has been successfully created.',
    type: Lesson,
  })
  create(
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    return this.lessonsService.create(+courseId, createLessonDto);
  }

  @Get(':lessonId')
  @ApiOperation({ summary: 'Get lesson details' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'lessonId', description: 'ID of the lesson' })
  @ApiResponse({ status: 200, description: 'Lesson details', type: Lesson })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  findOne(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.lessonsService.findOne(+courseId, +lessonId);
  }

  @Put(':lessonId')
  @ApiOperation({ summary: 'Update a lesson' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'lessonId', description: 'ID of the lesson' })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully updated.',
    type: Lesson,
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  update(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonsService.update(+courseId, +lessonId, updateLessonDto);
  }

  @Delete(':lessonId')
  @ApiOperation({ summary: 'Delete a lesson' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'lessonId', description: 'ID of the lesson' })
  @ApiResponse({
    status: 200,
    description: 'The lesson has been successfully deleted.',
    schema: {
      example: {
        message: 'Lesson deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Lesson not found' })
  async remove(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    await this.lessonsService.remove(+courseId, +lessonId);
    return { message: 'Lesson deleted successfully' };
  }
}
