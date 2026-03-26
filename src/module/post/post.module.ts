import { Module } from '@nestjs/common';
import { PostController } from 'src/controller/post/post.controller';
import { PostRepository } from 'src/repository/post/post.repository';

@Module({
  controllers: [PostController],
  providers: [PostRepository],
  exports: [PostRepository]
})
export class PostModule {;}
