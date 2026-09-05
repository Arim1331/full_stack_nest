import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PostImageCreateDTO,
  PostImageDeleteDTO,
  PostImageUpdateDTO,
} from 'src/domain/postimage/postimage.dto';
import { PostImageRepository } from 'src/repository/postimage/postimage.repository';
import { PrismaService } from '../prisma/prisma.service';
import PostException from 'src/exception/exception.post';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class PostimageService {
  constructor(
    private readonly postImageRepository: PostImageRepository,
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service

  ) {}

  // 게시글 이미지 등록
  async createPostImage(
    postId: number,
    postImageCreateDTO: PostImageCreateDTO,
  ): Promise<void> {
    // post 존재 여부 체크
    
    await this.checkPostExists(postId)

    if (postImageCreateDTO.images.length > 5) {
      throw new PostException('이미지는 최대 5장까지 업로드 가능합니다.');
    }

    await this.postImageRepository.save(postId, postImageCreateDTO);
  }

  // 게시글 이미지 조회
  async findByPostId(postId: number) {
    return await this.postImageRepository.findByPostId(postId);
  }

  // 게시글 이미지 전체 교체
  async replacePostImage(
    postId: number,
    postImageUpdateDTO: PostImageUpdateDTO,
  ): Promise<void> {
    // post 존재 여부 체크
    const foundPost = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!foundPost) {
      throw new PostException('게시글이 존재하지 않습니다.');
    }

    await this.postImageRepository.replace(postId, postImageUpdateDTO);
  }

  // 게시글 이미지 단일 삭제
  async deletePostImage(imageId: number): Promise<void> {
    // post 존재 여부 체크
    const foundImage = await this.prisma.postImage.findUnique({
      where: { id: imageId },
      select: { 
        id: true,
        imageUrl: true
      },
    });

    if (!foundImage) {
      throw new PostException('이미지가 존재하지 않습니다.');
    }

    await this.s3Service.deleteFileByUrl(
      foundImage.imageUrl
    )

    await this.postImageRepository.remove(imageId);
  }

  // 게시글 이미지 선택 삭제
  async deleteSelectedPostImage(
    postImageDeleteDTO: PostImageDeleteDTO,
  ): Promise<void> {
    if (!postImageDeleteDTO.imageIds.length) {
      throw new PostException('삭제할 이미지가 없습니다.');
    }

    const foundImages = 
      await this.prisma.postImage.findMany({
        where: {
          id: {
            in: postImageDeleteDTO.imageIds,
          }
        },
        select: {
          id: true,
          imageUrl: true
        }
      })

      await Promise.all(
        foundImages.map((image) =>
          this.s3Service.deleteFileByUrl(image.imageUrl)
        )
      )

    await this.postImageRepository.removeSelected(postImageDeleteDTO);
  }

  // 게시글 검사
  async checkPostExists(postId: number): Promise<void> {
    const foundPost = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true } 
    })

    if (!foundPost) {
      throw new PostException('게시글이 존재하지 않습니다.')
    }
  }
}
