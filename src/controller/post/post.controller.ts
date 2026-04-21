import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PostCreateDTO, PostUpdatedDTO } from 'src/domain/post/dto/post.dto';
import { PostService } from 'src/service/post/post.service';
import type { AuthRequest } from 'src/type/auth.type';

@Controller('posts') // /posts
export class PostController {
  // 생성자 주입
  constructor(private readonly postService: PostService){;}

  // 게시글 전체 조회
  @ApiOperation({summary: "게시글 전체 조회"})
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get() 
  async getPosts(@Req() req: AuthRequest) {
    const memberId = req.user?.id
    return await this.postService.getPosts(memberId)
  }

  // 게시글 단일 조회
  @ApiOperation({summary: "게시글 단일 조회"})
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get(":id") // /posts/:id
  async getPost(@Param("id") id: string, @Req() req: AuthRequest) {
    const memberId = req.user?.id

    return await this.postService.getPost(Number(id), memberId)
  }

  // 게시글 생성
  @ApiOperation({summary: "게시글 생성"})
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @Post("")
  async create(@Body() postCreateDTO: PostCreateDTO) {
    await this.postService.createPost(postCreateDTO)
  }

  // 게시글 수정
  @ApiOperation({summary: "게시글 수정"})
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Put(":id") 
  async update(@Param("id") id: string, @Body() postUpdatedDTO: PostUpdatedDTO) {
    await this.postService.updatePost(Number(id), postUpdatedDTO)
  }

  // 게시글 삭제
  @ApiOperation({summary: "게시글 삭제"})
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.postService.deletePost(Number(id))
  }

}
