import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PostImageCreateDTO, PostImageDeleteDTO, PostImageUpdateDTO } from 'src/domain/postimage/postimage.dto';
import { PostimageService } from 'src/service/postimage/postimage.service';

@ApiTags('Post Image')
@Controller('postimage')
export class PostimageController {
  constructor(private readonly postImageService: PostimageService){;}

  // 게시글 이미지 등록
  @ApiOperation({ summary: "게시글 이미지 등록" })
  @HttpCode(201)
  @Post(":postId")
  async create(
    @Param('postId') postId:number,
    @Body() postImageCreateDTO: PostImageCreateDTO
  ) {
    await this.postImageService.createPostImage(postId, postImageCreateDTO)
  }

  // 게시글 이미지 조회
  @ApiOperation({ summary: "게시글 이미지 조회" })
  @HttpCode(200)
  @Get(":postId")
  async findByPostId(
    @Param('postId') postId: number) {
      return await this.postImageService.findByPostId(postId)
    }

  // 게시글 이미지 전체 교체
  @ApiOperation({ summary: "게시글 이미지 전체 교체" })
  @HttpCode(200)
  @Put(":postId")
  async replace(
    @Param('postId') postId: number,
    @Body() postImageUpdateDTO: PostImageUpdateDTO
  ) {
    await this.postImageService.replacePostImage(postId, postImageUpdateDTO)
  }

  // 게시글 이미지 단일 삭제
  @ApiOperation({ summary: "게시글 이미지 단일 삭제" })
  @HttpCode(200)
  @Delete(":imageId")
  async remove(
    @Param("imageId") imageId: number) {
      await this.postImageService.deletePostImage(imageId)
    }
  
  // 게시글 이미지 선택 삭제
  @Delete()
  async removeSelected(@Body() postImageDeleteDTO: PostImageDeleteDTO) {
    await this.postImageService.deleteSelectedPostImage(postImageDeleteDTO)
  }
}
