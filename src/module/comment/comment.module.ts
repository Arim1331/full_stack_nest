import { Module } from '@nestjs/common';
import { CommentController } from 'src/controller/comment/comment.controller';
import { CommentRepository } from 'src/repository/comment/comment.repository';
import { CommentService } from 'src/service/comment/comment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService]
})
export class CommentModule {}
