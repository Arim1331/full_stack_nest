import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  PostImageCreateDTO,
  PostImageDeleteDTO,
  PostImageUpdateDTO,
} from 'src/domain/postimage/postimage.dto';
import { PostimageService } from 'src/service/postimage/postimage.service';
import { FilesInterceptor } from '@nestjs/platform-express'; //추가
import { S3Service } from 'src/service/s3/s3.service'; //추가
import type { MulterFile } from 'src/domain/member/dto/member.dto'; //추가

@ApiTags('Post Image')
@Controller('postimage')
export class PostimageController {
  constructor(
    private readonly postImageService: PostimageService,
    private readonly s3Service: S3Service, // 추가
  ) {}

  // 게시글 이미지 등록
  @ApiOperation({ summary: '게시글 이미지 등록' })
  @HttpCode(201)
  @Post(':postId')
  async create(
    @Param('postId') postId: string,
    @Body() postImageCreateDTO: PostImageCreateDTO,
  ) {
    await this.postImageService.createPostImage(
      Number(postId),
      postImageCreateDTO,
    );
  }

  // 게시글 이미지 파일 업로드 후 S3 URL 저장
  @ApiOperation({ summary: '게시글 이미지 S3 다중 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['images'],
    },
  })
  @HttpCode(201)
  @Post(':postId/upload')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new Error('JPG 또는 PNG 파일만 업로드 가능합니다.'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async upload(
    @Param('postId') postId: string,
    @UploadedFiles() files: MulterFile[],
  ) {
    if (!files || files.length === 0) {
      throw new Error('이미지 파일이 없습니다.');
    }

    // S3에 올리기 전에 게시글 존재 여부 확인
    await this.postImageService.checkPostExists(Number(postId))

    const uploadedImages = await Promise.all(
      files.map(async (file, index) => {
        const { originalUrl } = await this.s3Service.uploadFile(
          file,
          'post-images',
        );

        return {
          imageUrl: originalUrl,
          imageOrder: index,
        };
      }),
    );

    await this.postImageService.createPostImage(Number(postId), {
      images: uploadedImages,
    });

    return {
      images: uploadedImages,
    };
  }

  // 게시글 이미지 조회
  @ApiOperation({ summary: '게시글 이미지 조회' })
  @HttpCode(200)
  @Get(':postId')
  async findByPostId(@Param('postId') postId: string) {
    return await this.postImageService.findByPostId(Number(postId));
  }

  // 게시글 이미지 전체 교체
  @ApiOperation({ summary: '게시글 이미지 전체 교체' })
  @HttpCode(200)
  @Put(':postId')
  async replace(
    @Param('postId') postId: number,
    @Body() postImageUpdateDTO: PostImageUpdateDTO,
  ) {
    await this.postImageService.replacePostImage(postId, postImageUpdateDTO);
  }

  // 게시글 이미지 단일 삭제
  @ApiOperation({ summary: '게시글 이미지 단일 삭제' })
  @HttpCode(200)
  @Delete(':imageId')
  async remove(@Param('imageId') imageId: number) {
    await this.postImageService.deletePostImage(imageId);
  }

  // 게시글 이미지 선택 삭제
  @Delete()
  async removeSelected(@Body() postImageDeleteDTO: PostImageDeleteDTO) {
    await this.postImageService.deleteSelectedPostImage(postImageDeleteDTO);
  }
}
