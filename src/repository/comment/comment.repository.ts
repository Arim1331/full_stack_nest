import { Injectable } from "@nestjs/common";
import { CommentCreateDTO, CommentUpdateDTO } from "src/domain/comment/dto/comment.dto";
import { PrismaService } from "src/service/prisma/prisma.service";

// 모달이 내 게시글, 타인 게시글 이렇게 나뉘는데 그렇다고 해서 레포지토리를 둘로 나누는 게 아니라, 하나의 레포에 "댓글 관리 기능을 충분히 넣어두는 방식" 으로 설계함. 즉, MyPostModal 기준으로 넉넉하게 만들었음.

// MyPostModal 기준 필요한 댓글 기능
// - 댓글 생성
// - 게시글별 댓글 조회
// - 댓글 수정
// - 댓글 단일 삭제
// - 게시글 댓글 전체 삭제
// - 선택한 댓글들 삭제

// 타인 게시글 기준 필요한 댓글 기능
// - 댓글 생성
// - 게시글별 댓글 조회
// - 내 댓글만 수정/삭제

// DB 접근 담당
@Injectable()
export class CommentRepository {
  // Prisma 접근
  constructor(private readonly prisma: PrismaService){;}

  // 댓글 생성
  async save(commentCreateDTO: CommentCreateDTO): Promise<void> {
    await this.prisma.comment.create({
      data: commentCreateDTO
    })
  }

  // 게시글별 댓글 조회
  async findCommentsByPostId(postId: number) {
    return await this.prisma.comment.findMany({
      where: { postId },
      include: {
        member: {
          select : {
            id: true,
            memberName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }

  // 댓글 단일 조회
  async findCommentById(id: number) {
    return await this.prisma.comment.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            memberName: true
          }
        }
      }
    })
  }

  // 내 댓글인지 확인할 때 같이 쓰기 좋음("내 게시글의 댓글만 관리 가능" 같은 검증 넣기 쉬움)
  async findCommentByIdWithPost(id: number) {
    return await this.prisma.comment.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            memberName: true
          }
        },
        post: {
          select: {
            id: true,
            memberId: true
          }
        }
      }
    })
  }

  // 댓글 수정
  async modify(id: number, commentUpdateDTO: CommentUpdateDTO): Promise<void> {
    await this.prisma.comment.update({
      where: { id },
      data: {
        ...commentUpdateDTO,
        updatedAt: new Date()
      }
    })
  }

  // 댓글 단일 삭제
  async remove(id: number): Promise<void> {
    await this.prisma.comment.delete({
      where: { id }
    })
  }

  // 게시글별 댓글 전체 삭제
  async removeAllByPostId(postId: number): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: { postId }
    })
  }

  // 선택한 댓글들 삭제(체크박스로 선택 삭제)
  async removeSelected(commentIds: number[]): Promise<void> {
    await this.prisma.comment.deleteMany({
      where: {
        id: {
          in: commentIds
        }
      }
    })
  }

  // 선택한 댓글들이 특정 게시글 소속인지 확인용("내 게시글의 댓글만 관리 가능" 같은 검증 넣기 쉬움)
  async findCommentsByIds(commentIds: number[]) {
    return await this.prisma.comment.findMany({
      where: {
        id: {
          in: commentIds
        }
      },
      select: {
        id: true,
        postId: true,
        memberId: true
      }
    })
  }


}