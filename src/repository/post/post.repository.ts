import { Injectable } from "@nestjs/common";
import { PostCreateDTO, PostDTO, PostUpdatedDTO } from "src/domain/post/dto/post.dto";
import { PrismaService } from "src/service/prisma/prisma.service";

@Injectable()
export class PostRepository {
  // Prisma 접근
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 목록 전체 조회
  async findPosts(): Promise<PostDTO[]> {
    const foundPosts = await this.prisma.post.findMany({
      include: {
        member: {
          select: {
            id: true,
            memberName: true,
          },
        },
        recipe: {
          select: {
            id: true,
            recipeTitle: true,
          },
        },
      },
    });

    return foundPosts;
  }

  // 게시글 단일 조회
  async findPostById(id: number): Promise<PostDTO | null> {
    const foundPost = await this.prisma.post.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            memberName: true,
          },
        },
        recipe: {
          select: {
            id: true,
            recipeTitle: true,
          },
        },
      },
    });

    return foundPost;
  }

  // 게시글 추가
  async save(postCreateDTO: PostCreateDTO): Promise<void> {
    await this.prisma.post.create({
      data: postCreateDTO,
    });
  }

  // 게시글 수정
  async modify(postUpdatedDTO: PostUpdatedDTO): Promise<void> {
    const foundPost = await this.prisma.post.findUnique({
      where: { id: postUpdatedDTO.id },
    });

    if (foundPost) {
      const { id, ...updatedPost } = postUpdatedDTO;

      await this.prisma.post.update({
        where: { id },
        data: {
          ...updatedPost,
          updatedAt: new Date(),
        },
      });
    }
  }

  // 게시글 삭제
  async remove(id: number): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }
}