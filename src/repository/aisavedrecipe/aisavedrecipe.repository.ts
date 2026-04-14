import { Injectable } from "@nestjs/common";
import { CreateAiSavedRecipeWithMemberDTO } from "src/domain/aisavedrecipe/dto/aisavedrecipe.dto";
import { PrismaService } from "src/service/prisma/prisma.service";

@Injectable()
export class AiSavedRecipeRepository {
  constructor(private readonly prisma: PrismaService){;}

  // 저장
  async save(createAiSavedRecipeDTO: CreateAiSavedRecipeWithMemberDTO) {
    return await this.prisma.aiSavedRecipe.create({
      data: {
        memberId: createAiSavedRecipeDTO.memberId,
        title: createAiSavedRecipeDTO.title,
        description: createAiSavedRecipeDTO.description,
        imageUrl: createAiSavedRecipeDTO.imageUrl,
        cookTime: createAiSavedRecipeDTO.cookTime,
        difficulty: createAiSavedRecipeDTO.difficulty,
        category: createAiSavedRecipeDTO.category,
        xp: createAiSavedRecipeDTO.xp,
        ingredients: createAiSavedRecipeDTO.ingredients,
        steps: createAiSavedRecipeDTO.steps

      }
    })
  }

  // 회원별 목록 전체 조회
  async findAllByMemberId(memberId: number) {
    return await this.prisma.aiSavedRecipe.findMany({
      where: { memberId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // 상세 조회
  async findById(id: number) {
    return await this.prisma.aiSavedRecipe.findUnique({
      where: { id }
    })
  }

  // 삭제
  async remove(id: number) {
    return await this.prisma.aiSavedRecipe.delete({
      where: { id } 
    })
  }

}