import { Module } from '@nestjs/common';
import { PostController } from 'src/controller/post/post.controller';
import { PostRepository } from 'src/repository/post/post.repository';
import { PostService } from 'src/service/post/post.service';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [PostController],
  providers: [PostRepository, PostService, PrismaService],
  exports: [PostRepository]
})
export class PostModule {;}
