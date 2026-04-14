import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { CreateAiSavedRecipeDTO } from 'src/domain/aisavedrecipe/dto/aisavedrecipe.dto';
import { AisavedrecipeService } from 'src/service/aisavedrecipe/aisavedrecipe.service';
import type { AuthRequest } from 'src/type/auth.type'; // import 뒤에 type 붙여주기(데코레이터가 있는 파일에서는 타입스크립트가 메타데이터를 만들려고 하는데 AuthRequest는 실제 js 런타임에 존재하는 값이 아니라 타입 전용이라서 그냥 import 하면 컴파일러가 헷갈려함)

@Controller('aisavedrecipe')
@UseGuards(AuthGuard('jwt'))
export class AisavedrecipeController {
  constructor(private readonly aisavedrecipeService: AisavedrecipeService) {}

  // 저장
  @ApiOperation({ summary: 'AI 저장 레시피 생성' })
  @HttpCode(201)
  @Post()
  async create(
    @Body() createAiSavedRecipeDTO: CreateAiSavedRecipeDTO, 
    @Req() req: AuthRequest) 
    {
    return await this.aisavedrecipeService.createAiSavedRecipe({
      ...createAiSavedRecipeDTO,
      memberId: req.user.id,
    }); 
  }

  // 회원별 목록 전체 조회
  @ApiOperation({ summary: '회원별 AI 저장 레시피 목록 조회' })
  @HttpCode(200)
  @Get('/my')
  async findAllByMemberId(@Req() req: AuthRequest) {
    return await this.aisavedrecipeService.getAiSavedRecipeList(
      (req.user.id),
    );
  }

  // 상세 조회
  @ApiOperation({ summary: 'AI 저장 레시피 상세 조회' })
  @HttpCode(200)
  @Get('/:id')
  async findById(@Param('id') id: string) {
    return await this.aisavedrecipeService.getAiSavedRecipeDetail(Number(id));
  }

  // 삭제
  @ApiOperation({ summary: 'AI 저장 레시피 삭제' })
  @HttpCode(200)
  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.aisavedrecipeService.deleteAiSavedRecipe(Number(id));
  }
}
