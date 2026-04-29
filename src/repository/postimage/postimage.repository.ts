import { Injectable } from "@nestjs/common";
import { PostImageCreateDTO, PostImageDeleteDTO, PostImageUpdateDTO } from "src/domain/postimage/postimage.dto";
import { PrismaService } from "src/service/prisma/prisma.service";

@Injectable()
export class PostImageRepository {
  constructor(private readonly prisma: PrismaService) {;}

  // 게시글 이미지 등록
  async save(postId: number, postImageCreateDTO: PostImageCreateDTO): Promise<void> {
    const { images } = postImageCreateDTO

    await this.prisma.postImage.createMany({
      data: images.map((image, index) => ({
        postId,
        imageUrl: image.imageUrl,
        imageOrder: image.imageOrder ?? index
      }))
    })
  }

  // 게시글 이미지 조회
  async findByPostId(postId: number) {
    return await this.prisma.postImage.findMany({
      where: { postId },
      orderBy: {
        imageOrder: "asc"
      }
    })
  }

  // 게시글 이미지 전체 교체
  async replace(postId: number, postImageUpdateDTO: PostImageUpdateDTO): Promise<void> {
    const { images } = postImageUpdateDTO;

    await this.prisma.$transaction([
      this.prisma.postImage.deleteMany({
        where: { postId },
      }),
      this.prisma.postImage.createMany({
        data: images.map((image, index) => ({
          postId,
          imageUrl: image.imageUrl,
          imageOrder: image.imageOrder ?? index,
        })),
      }),
    ]);
  }

  // 게시글 이미지 단일 삭제  
  async remove(imageId: number): Promise<void> {
    await this.prisma.postImage.delete({
      where: { id: imageId }
    })
  }

  // 게시글 이미지 선택 삭제
  async removeSelected(postImageDeleteDTO: PostImageDeleteDTO): Promise<void> {
    const { imageIds } = postImageDeleteDTO

    await this.prisma.postImage.deleteMany({
      where: {
        id: {
          in: imageIds
        }
      }
    })
  }
}