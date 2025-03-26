import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('courses/:courseId/lessons/:lessonId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment to a lesson' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'lessonId', description: 'ID of the lesson' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: Comment,
  })
  create(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(+courseId, +lessonId, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a lesson' })
  @ApiParam({ name: 'courseId', description: 'ID of the course' })
  @ApiParam({ name: 'lessonId', description: 'ID of the lesson' })
  @ApiResponse({
    status: 200,
    description: 'List of comments',
    type: [Comment],
  })
  findAll(
    @Param('courseId') courseId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.commentsService.findAllByLesson(+courseId, +lessonId);
  }
}
