import { Body, Controller, Delete, Get, HttpCode, Param, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PostUpdatedDTO } from 'src/domain/post/dto/post.dto';
import { PostRepository } from 'src/repository/post/post.repository';

@Controller('posts') // /posts
export class PostController {
  // 생성자 주입
  constructor(private readonly postRepository: PostRepository){;}

  // 게시글 전체 조회
  @ApiOperation({summary: "게시글 전체 조회"})
  @HttpCode(200)
  @Get("") 
  async getPosts() {
    return await this.postRepository.findPosts()
  }

  // 게시글 단일 조회
  @ApiOperation({summary: "게시글 단일 조회"})
  @HttpCode(200)
  @Get(":id") // /posts/:id
  async getPost(@Param("id") id: string) {
    return await this.postRepository.findPostById(Number(id))
  }

  // 게시글 수정
  @ApiOperation({summary: "게시글 수정"})
  @HttpCode(200)
  @Put(":id") 
  async update(@Param("id") id: string, @Body() postUpdatedDTO: PostUpdatedDTO) {
    postUpdatedDTO.id = Number(id)
    await this.postRepository.modify(postUpdatedDTO)
  }

  // 게시글 삭제
  @ApiOperation({summary: "게시글 삭제"})
  @HttpCode(200)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.postRepository.remove(Number(id))
  }

}

// @ApiOperation({summary: "회원 탈퇴"})
//     @HttpCode(204)