import { HttpException, HttpStatus } from "@nestjs/common";

// 댓글 커스텀 예외 생성
export default class CommentException extends HttpException  {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND)
  }
}