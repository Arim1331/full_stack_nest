import { Module } from '@nestjs/common';
import { PostController } from 'src/controller/post/post.controller';
import { PostRepository } from 'src/repository/post/post.repository';
import { PostService } from 'src/service/post/post.service';
import { PrismaService } from 'src/service/prisma/prisma.service';
// 1. BadgeModule 임포트 (경로는 프로젝트 구조에 맞게 확인해주세요)
import { BadgeModule } from 'src/module/badge/badge.module'; 

@Module({
  imports: [
    BadgeModule
  ],
  controllers: [PostController],
  providers: [
    PostRepository, 
    PostService, 
    PrismaService
  ],
  exports: [PostRepository]
})
export class PostModule {;}