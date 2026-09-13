import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { BadgeResponseDto } from '../../domain/badge/badge.dto';

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly LEVEL_SETTINGS: Record<number, number> = {
        1: 30,    2: 60,    3: 90,    4: 120,   5: 150,
        6: 200,   7: 250,   8: 300,   9: 350,   10: 450,
        11: 550,  12: 650,  13: 750,  14: 850,  15: 1000,
        16: 1200, 17: 1400, 18: 1600, 19: 1800, 20: 2000,
        21: 2400, 22: 2600, 23: 2800, 24: 3000, 25: 3200,
        26: 3500, 27: 3800, 28: 4100, 29: 4400, 30: 6000,
    };

    /**
     * 보유 XP 기준 정확한 레벨 산출 함수
     */
    private calculateLevelFromXp(xp: number): number {
        let currentLevel = 1;

        for (let lvl = 1; lvl <= 30; lvl++) {
            const targetXp = this.LEVEL_SETTINGS[lvl];
            if (xp >= targetXp) {
                currentLevel = Math.min(lvl + 1, 30);
            } else {
                currentLevel = lvl;
                break;
            }
        }
        return currentLevel;
    }

  /**
   * 1. 내 전체 뱃지 도감 조회 (조회 전 기존 달성 기록 동기화 추가)
   */
  async findAllMyBadges(memberId: number): Promise<BadgeResponseDto[]> {
    // 💡 조회 전 실제 DB 데이터 기반으로 뱃지/레벨 일괄 동기화
    await this.syncMemberBadges(memberId);

    const allBadges = await this.prisma.badge.findMany({
      orderBy: { id: 'asc' },
    });
    const userBadges = await this.prisma.userBadge.findMany({
      where: { memberId },
    });

    return allBadges.map((badge) => {
      const achievement = userBadges.find((ub) => ub.badgeId === badge.id);
      return {
        id: badge.id,
        badgeName: badge.badgeName,
        badgeDescription: badge.badgeDescription,
        badgeImageUrl: badge.badgeImageUrl,
        badgeRewardXp: badge.badgeRewardXp,
        badgeConditionType: badge.badgeConditionType,
        badgeConditionValue: badge.badgeConditionValue,
        unlockedDescription: badge.unlockedDescription,
        lockedDescription: badge.lockedDescription,
        category: badge.category,
        isUnlocked: !!achievement,
        achievedAt: achievement ? achievement.achievedAt : null,
      };
    });
  }

  /**
   * 💡 기존에 달성된 행동 기록들을 바탕으로 뱃지를 일괄 동기화/해금
   */
  private async syncMemberBadges(memberId: number) {
    // 1. 실제 냉장고에 등록된 재료 개수 카운트
    const actualIngredientCount = await this.prisma.myFridge.count({
      where: { memberId },
    });
    

    // 2. Member 테이블의 ingredientCount 동기화
    const member = await this.prisma.member.update({
      where: { id: memberId },
      data: {
        ingredientCount: actualIngredientCount,
      },
    });

    if (!member) return;

    // 지원하는 모든 조건 타입 리스트
    const conditionTypes = [
      'INGREDIENT_COUNT',
      'COOK_COUNT',
      'EXPIRY_RESCUE_COUNT',
      'LEFTOVER_COOK_COUNT',
      'SPECIFIC_INGREDIENT_REUSE_COUNT',
      'RECIPE_SCRAP_COUNT',
      'SCRAPPED_RECIPE_COOK_COUNT',
      'POST_COUNT',
      'LIKE_COUNT',
      'COMMENT_WRITE_COUNT',
      'CONTINUOUS_ATTENDANCE_DAYS',
      'CHALLENGE_COMPLETE_COUNT',
    ];

    for (const type of conditionTypes) {
      await this.checkAndAwardBadge(memberId, type);
    }
  }

  /**
   * 2. 뱃지 조건 충족 여부 확인, 지급 및 레벨업 체크
   */
  async checkAndAwardBadge(memberId: number, conditionType: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) return null;

    const currentCount = this.getMemberCountByType(member, conditionType);

    // 1. 해당 타입의 전체 뱃지 조회
    const allTypeBadges = await this.prisma.badge.findMany({
      where: { badgeConditionType: conditionType },
    });

    // 2. 이미 유저가 보유한 뱃지 ID 목록 조회
    const userBadges = await this.prisma.userBadge.findMany({
      where: { memberId },
      select: { badgeId: true },
    });
    const unlockedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

    // 3. 조건 비교
    const targetBadges = allTypeBadges.filter((badge) => {
      const requiredValue = badge.badgeConditionValue ?? 0;
      return !unlockedBadgeIds.has(badge.id) && currentCount >= requiredValue;
    });

    if (targetBadges.length === 0) {
      // 💡 신규 뱃지 해금이 없더라도 기존 XP 기반으로 레벨 최신화
      await this.handleLevelUp(member);
      return null;
    }

    const awardedBadges: any[] = [];

    // 조건 충족된 뱃지들 일괄 해금 처리 및 XP 지급
    for (const badge of targetBadges) {
      await this.prisma.$transaction([
        this.prisma.userBadge.create({
          data: {
            memberId: memberId,
            badgeId: badge.id,
          },
        }),
        this.prisma.member.update({
          where: { id: memberId },
          data: {
            memberXp: { increment: badge.badgeRewardXp || 30 },
          },
        }),
      ]);
      awardedBadges.push(badge);
    }

    // 최신 유저 경험치 정보로 레벨 업데이트
    const updatedMember = await this.prisma.member.findUnique({
      where: { id: memberId },
    });

    if (updatedMember) {
      await this.handleLevelUp(updatedMember);
    }

    return awardedBadges;
  }

  /**
   * 3. 대표 뱃지 설정 (오류 원인이었던 복구 메서드)
   */
  async updateMainBadge(memberId: number, badgeId: number) {
    const hasBadge = await this.prisma.userBadge.findUnique({
      where: {
        memberId_badgeId: { memberId, badgeId },
      },
    });

    if (!hasBadge) {
      throw new BadRequestException('획득하지 않은 뱃지는 대표 뱃지로 설정할 수 없습니다.');
    }

    return await this.prisma.member.update({
      where: { id: memberId },
      data: { mainBadgeId: badgeId },
    });
  }

public async handleLevelUp(member: any) {
    const xp = member.memberXp || 0;
    
    // 1. 프론트엔드 LEVEL_SETTINGS 기준 적정 레벨 계산
    const LEVEL_SETTINGS: Record<number, number> = {
        1: 30,    2: 60,    3: 90,    4: 120,   5: 150,
        6: 200,   7: 250,   8: 300,   9: 350,   10: 450,
        11: 550,  12: 650,  13: 750,  14: 850,  15: 1000,
        16: 1200, 17: 1400, 18: 1600, 19: 1800, 20: 2000,
        21: 2400, 22: 2600, 23: 2800, 24: 3000, 25: 3200,
        26: 3500, 27: 3800, 28: 4100, 29: 4400, 30: 6000,
    };

    let newLevel = 1;
    for (let lvl = 1; lvl <= 30; lvl++) {
        if (xp >= LEVEL_SETTINGS[lvl]) {
            newLevel = Math.min(lvl + 1, 30);
        } else {
            newLevel = lvl;
            break;
        }
    }

    // 2. 레벨이 변경된 경우 DB 업데이트 (기존 로직 동일 유지)
    if (newLevel !== member.memberLevel) {
        await this.prisma.member.update({
            where: { id: member.id },
            data: { memberLevel: newLevel },
        });
    }
}

  /**
   * [내부 로직] 시드 데이터의 conditionType 전체 지원
   */
  private getMemberCountByType(member: any, type: string): number {
    switch (type) {
      case 'INGREDIENT_COUNT':
        return member.ingredientCount || 0;
      case 'COOK_COUNT':
        return member.cookCount || 0;
      case 'EXPIRY_RESCUE_COUNT':
        return member.expiryRescueCount || 0;
      case 'LEFTOVER_COOK_COUNT':
        return member.leftoverCookCount || 0;
      case 'SPECIFIC_INGREDIENT_REUSE_COUNT':
        return member.specificIngredientReuseCount || 0;
      case 'RECIPE_SCRAP_COUNT':
        return member.recipeScrapCount || 0;
      case 'SCRAPPED_RECIPE_COOK_COUNT':
        return member.scrappedRecipeCookCount || 0;
      case 'POST_COUNT':
        return member.postCount || 0;
      case 'LIKE_COUNT':
        return member.likeCount || 0;
      case 'COMMENT_WRITE_COUNT':
        return member.commentWriteCount || 0;
      case 'CONTINUOUS_ATTENDANCE_DAYS':
        return member.continuousAttendanceDays || 0;
      case 'CHALLENGE_COMPLETE_COUNT':
        return member.challengeCompleteCount || 0;
      default:
        return 0;
    }
  }
}