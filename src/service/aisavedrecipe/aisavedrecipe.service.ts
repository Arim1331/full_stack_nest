import { Injectable } from '@nestjs/common';
import { AiSavedRecipeListResponseDTO, AiSavedRecipeResponseDTO, CreateAiSavedRecipeWithMemberDTO } from 'src/domain/aisavedrecipe/dto/aisavedrecipe.dto';
import AiSavedRecipeException from 'src/exception/exception.aisavedrecipe';
import { AiSavedRecipeRepository } from 'src/repository/aisavedrecipe/aisavedrecipe.repository';

@Injectable()
export class AisavedrecipeService {
  constructor(
    private readonly aisavedrecipeRepository: AiSavedRecipeRepository,
  ) {}

  // 저장
  async createAiSavedRecipe(createAiSavedRecipeDTO: CreateAiSavedRecipeWithMemberDTO) {
    const savedRecipe = await this.aisavedrecipeRepository.save(
      createAiSavedRecipeDTO,
    );

    return {
      id: savedRecipe.id,
      message: 'AI 저장 레시피 생성 완료',
    };
  }

  // 회원별 목록 전체 조회
  async getAiSavedRecipeList(memberId: number): Promise<AiSavedRecipeListResponseDTO[]> {
    const savedRecipes = await this.aisavedrecipeRepository.findAllByMemberId(memberId)

    return savedRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description ?? undefined,
      imageUrl: recipe.imageUrl ?? undefined,
      cookTime: recipe.cookTime ?? undefined,
      difficulty: recipe.difficulty ?? undefined,
      category: recipe.category ?? undefined,
      xp: recipe.xp,
      createdAt: recipe.createdAt, 
    }))
  }

  // 상세 조회
  async getAiSavedRecipeDetail(id: number, memberId: number): Promise<AiSavedRecipeResponseDTO> {
    const savedRecipe = await this.aisavedrecipeRepository.findByIdAndMemberId(id, memberId)

    if(!savedRecipe) {
      throw new AiSavedRecipeException('저장된 AI 레시피가 없습니다.')
    }
    return {
      id: savedRecipe.id,
      memberId: savedRecipe.memberId,
      title: savedRecipe.title,
      description: savedRecipe.description ?? undefined,
      imageUrl: savedRecipe.imageUrl ?? undefined,
      cookTime: savedRecipe.cookTime ?? undefined,
      difficulty: savedRecipe.difficulty ?? undefined,
      category: savedRecipe.category ?? undefined,
      xp: savedRecipe.xp,
      ingredients: savedRecipe.ingredients as {
        main: string[]
        sub: string[]
      },
      steps: savedRecipe.steps as string[],
      createdAt: savedRecipe.createdAt, 
    }
  }

  // 삭제
  async deleteAiSavedRecipe(id: number, memberId: number) {
    const savedRecipe = await this.aisavedrecipeRepository.findByIdAndMemberId(id, memberId)

    if(!savedRecipe) {
      throw new AiSavedRecipeException("삭제할 AI 저장 레시피가 없습니다.")
    }

    await this.aisavedrecipeRepository.remove(id, memberId)

    return {
      message: 'AI 저장 레시피 삭제 완료'
    }
  }
}
