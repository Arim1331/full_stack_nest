import { Module } from '@nestjs/common';
import { PostimageController } from 'src/controller/postimage/postimage.controller';
import { PostImageRepository } from 'src/repository/postimage/postimage.repository';
import { PostimageService } from 'src/service/postimage/postimage.service';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [PostimageController],
  providers: [PostImageRepository, PostimageService, PrismaService],
  exports: [PostimageService]
})
export class PostimageModule {;}
