import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { Lesson } from '../lessons/entities/lesson.entity'; // Importe a entidade Lesson

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Lesson]), // Adicione Lesson aqui
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
