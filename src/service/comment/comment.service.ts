import { Injectable } from '@nestjs/common';
import { CommentRepository } from 'src/repository/comment/comment.repository';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository){;}

  // 댓글 생성

  // 게시글별 댓글 조회

  // 댓글 수정

  // 댓글 단일 삭제

  // 게시글별 댓글 전체 삭제

  // 선택한 댓글들 삭제(체크박스로 선택 삭제)

}
