import { Controller, Get, Param, UseGuards, Patch, ParseIntPipe, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BadgeResponseDto } from '../../domain/badge/badge.dto';
import { BadgeService } from 'src/service/badge/badge.service'; // BadgeService 임포트 확인
import { JwtAuthGuard } from 'src/module/auth/guard/jwt-auth.guard';

@ApiTags('Badges (뱃지 시스템)')
@ApiBearerAuth('accessToken')
@UseGuards(JwtAuthGuard)
@Controller('v1/badges')
export class BadgeController {
  // 1. BadgeService 주입
  constructor(private readonly badgeService: BadgeService) {}

  @Get('me')
  @ApiOperation({ 
    summary: '내 뱃지 도감 조회', 
    description: '로그인한 유저의 전체 뱃지 목록과 획득 여부를 조회합니다.' 
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: [BadgeResponseDto] })
  @ApiResponse({ status: 401, description: '인증되지 않은 사용자' })
  async getMyBadges(@Req() req: any): Promise<BadgeResponseDto[]> {
    // 2. JWT 가드에서 넣어준 req.user.id를 서비스로 넘깁니다.
    return await this.badgeService.findAllMyBadges(req.user.id);
  }

  @Patch('main/:badgeId')
  @ApiOperation({ 
    summary: '대표 뱃지 설정', 
    description: '획득한 뱃지 중 하나를 프로필 대표 뱃지로 지정합니다.' 
  })
  @ApiResponse({ status: 200, description: '설정 성공' })
  @ApiResponse({ status: 400, description: '획득하지 않은 뱃지는 설정할 수 없습니다.' })
  async setMainBadge(
    @Req() req: any,
    @Param('badgeId', ParseIntPipe) badgeId: number,
  ) {
    // 3. 대표 뱃지 업데이트 로직 호출
    return await this.badgeService.updateMainBadge(req.user.id, badgeId);
  }
}