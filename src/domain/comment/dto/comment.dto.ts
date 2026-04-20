import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsNumber, IsOptional, IsString } from "class-validator"

// 댓글 dto
export class CommentDTO {
  @ApiProperty({ example: 1, description: "댓글 아이디"})
  @IsNumber()
  id: number
  
  @ApiProperty({ example: 1, description: "작성자 아이디"})
  @IsNumber()
  memberId: number
  
  @ApiProperty({ example: 1, description: "게시글 아이디"})
  @IsNumber()
  postId: number
  
  @ApiProperty({ example: "댓글 내용입니다.", description: "댓글 내용"})
  @IsString()
  content: string
  
  @ApiProperty({ example: "2026-04-17T12:50:00.000Z", description: "댓글 생성일"})
  @Type(() => Date)
  createdAt: Date
  
  @ApiProperty({ example: "2026-04-17T12:50:00.000Z", description: "댓글 수정일"})
  @Type(() => Date)
  updatedAt: Date
  
  @ApiProperty({ example: {id: 1, memberName: "홍길동" }, description: "댓글 수정일"})
  member: {
    id: number
    memberName: string
  }
}

// 댓글 생성
export class CommentCreateDTO  {
  @ApiProperty({ example: 1, description: "작성자 아이디"})
  @Type(() => Number)
  @IsNumber()
  memberId: number
  
  @ApiProperty({ example: 1, description: "게시글 아이디"})
  @Type(() => Number)
  @IsNumber()
  postId: number
  
  @ApiProperty({ example: "댓글 내용입니다.", description: "댓글 내용"})
  @IsString()
  content: string
}

// 댓글 수정
export class CommentUpdateDTO  {
  @ApiProperty({ example: "수정된 댓글 내용입니다.", description: "수정할 댓글 내용", required: false})
  @IsString()
  @IsOptional()
  content?: string
}

// 댓글 (선택) 삭제
export class CommentDeleteSelectedDTO {
  @ApiProperty({ example: [1, 2, 3], description: "선택 삭제할 댓글 아이디 목록"})
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  commentIds: number[]
}