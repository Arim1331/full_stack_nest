import { Injectable } from '@nestjs/common';
import { PostCreateDTO, PostUpdatedDTO } from 'src/domain/post/dto/post.dto';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { Prisma } from '@prisma/client';

export type PostWithLikeInfo = Prisma.PostGetPayload<{
  include: {
    member: {
      select: {
        id: true;
        memberName: true;
      };
    };
    recipe: {
      select: {
        id: true;
        recipeTitle: true;
      };
    };
    postLike: {
      select: {
        memberId: true;
      };
    };
    _count: {
      select: {
        postLike: true;
      };
    };
  };
}>;

// DB 접근 담당
@Injectable()
export class PostRepository {
  // Prisma 접근
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 목록 전체 조회
  async findPosts(): Promise<PostWithLikeInfo[]> {
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
        postLike: {
          select: {
            memberId: true,
          },
        },
        _count: {
          select: {
            postLike: true,
          },
        },
      },
    });

    return foundPosts;
  }

  // 게시글 단일 조회
  async findPostById(id: number): Promise<PostWithLikeInfo | null> {
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
        postLike: {
          select: {
            memberId: true,
          },
        },
        _count: {
          select: {
            postLike: true,
          },
        },
      },
    });

    return foundPost;
  }

  // 게시글 생성
  async save(postCreateDTO: PostCreateDTO): Promise<void> {
    await this.prisma.post.create({
      data: postCreateDTO,
    });
  }

  // 게시글 수정
  async modify(id: number, postUpdatedDTO: PostUpdatedDTO): Promise<void> {
    await this.prisma.post.update({
      where: { id },
      data: {
        ...postUpdatedDTO,
        updatedAt: new Date(),
      },
    });
  }

  // 게시글 삭제
  async remove(id: number): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });
  }
}
