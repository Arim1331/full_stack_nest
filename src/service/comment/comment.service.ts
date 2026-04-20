import { Injectable } from '@nestjs/common';
import { CommentCreateDTO, CommentUpdateDTO } from 'src/domain/comment/dto/comment.dto';
import CommentException from 'src/exception/exception.comment';
import { CommentRepository } from 'src/repository/comment/comment.repository';

// 비지니스 로직 담당
@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository){;}

  // 댓글 생성
  async createComment(commentCreateDTO: CommentCreateDTO): Promise<void> {
    await this.commentRepository.save(commentCreateDTO)
  }

  // 게시글별 댓글 조회
  async getCommentByPostId(postId: number) {
    return await this.commentRepository.findCommentsByPostId(postId)
  }

  // 댓글 수정
  async updateComment(id: number, commentUpdateDTO: CommentUpdateDTO): Promise<void> {
    const foundComment = await this.commentRepository.findCommentById(id)

    if (!foundComment) {
      throw new CommentException('수정할 댓글이 없습니다.')
    }

    await this.commentRepository.modify(id, commentUpdateDTO)
  }

  // 댓글 단일 삭제
  async deleteComment(id: number) {
    const foundComment = await this.commentRepository.findCommentById(id)

    if(!foundComment) {
      throw new CommentException("삭제할 댓글이 없습니다.")
    }

    await this.commentRepository.remove(id)
  }

  // 게시글별 댓글 전체 삭제
  async deleteAllCommentsByPostId(postId: number) {
    const foundComments = await this.commentRepository.findCommentsByPostId(postId)

    if(!foundComments || foundComments.length === 0) {
      throw new CommentException("삭제할 댓글이 없습니다.")
    }

    await this.commentRepository.removeAllByPostId(postId)
  }

  // 선택한 댓글들 삭제(체크박스로 선택 삭제)
  async deleteSelectedComments(commentIds: number[]) {
    const foundComments = await this.commentRepository.findCommentsByIds(commentIds)

    if(!foundComments || foundComments.length === 0) {
      throw new CommentException("삭제할 댓글이 없습니다.")
    }
    await this.commentRepository.removeSelected(commentIds)
  }
}
