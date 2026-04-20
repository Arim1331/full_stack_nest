import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommentCreateDTO, CommentDeleteSelectedDTO, CommentUpdateDTO } from 'src/domain/comment/dto/comment.dto';
import { CommentService } from 'src/service/comment/comment.service';

// comment.service.ts 보고 짜면 됨
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService){;}

  // 댓글 생성
  @ApiOperation({summary: "댓글 생성"})
  @HttpCode(201)
  @Post()
  async create(@Body() commentCreateDTO: CommentCreateDTO) {
    await this.commentService.createComment(commentCreateDTO)
    return { message: "댓글이 생성되었습니다."}

  }

  // 게시글별 댓글 조회
  @ApiOperation({summary: "게시글별 댓글 조회"})
  @HttpCode(200)
  @Get('post/:id')
  async getCommentsByPostId(@Param('id', ParseIntPipe) id: number) {
    return await this.commentService.getCommentByPostId(id)
  }

  // 댓글 수정
  @ApiOperation({summary: "댓글 수정"})
  @HttpCode(200)
  @Put(":id")
  async update(@Param('id', ParseIntPipe) id: number, @Body() commentUpdateDTO: CommentUpdateDTO) {
    await this.commentService.updateComment((id), commentUpdateDTO)
    return { message: "댓글이 수정되었습니다."}

  }

  // 댓글 단일 삭제
  @ApiOperation({summary: "댓글 단일 삭제"})
  @HttpCode(200)
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.commentService.deleteComment(id)
    return { message: "댓글이 삭제되었습니다."}
  }

  // 게시글별 댓글 전체 삭제
  @ApiOperation({summary: "게시글별 댓글 전체 삭제"})
  @HttpCode(200)
  @Delete("post/:id")
  async removeAllByPostId(@Param("id", ParseIntPipe) id: number) {
    await this.commentService.deleteAllCommentsByPostId(id)
    return { message: "댓글이 삭제되었습니다."}

  }

  // 선택한 댓글들 삭제(체크박스로 선택 삭제)
  @ApiOperation({summary: "선택한 댓글들 삭제"})
  @HttpCode(200)
  @Delete()
  async removeSelected(@Body() commentSelectedDTO: CommentDeleteSelectedDTO) {
    await this.commentService.deleteSelectedComments(commentSelectedDTO.commentIds)
    return { message: "댓글이 삭제되었습니다."}

  }
}
