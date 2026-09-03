import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service'; 
import { BadgeResponseDto } from '../../domain/badge/badge.dto';

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. 내 전체 뱃지 도감 조회
   */
  async findAllMyBadges(memberId: number): Promise<BadgeResponseDto[]> {
    const allBadges = await this.prisma.badge.findMany();
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
        category: badge.category,
        isUnlocked: !!achievement,
        achievedAt: achievement ? achievement.achievedAt : null,
      };
    });
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

    const targetBadge = await this.prisma.badge.findFirst({
      where: {
        badgeConditionType: conditionType,
        badgeConditionValue: { lte: currentCount },
        userBadge: {
          none: { memberId: memberId },
        },
      },
    });

    if (targetBadge) {
      // 1. 뱃지 지급 및 경험치 상승을 트랜잭션으로 처리
      const [_, updatedMember] = await this.prisma.$transaction([
        this.prisma.userBadge.create({
          data: {
            memberId: memberId,
            badgeId: targetBadge.id,
          },
        }),
        this.prisma.member.update({
          where: { id: memberId },
          data: {
            memberXp: { increment: targetBadge.badgeRewardXp || 30 },
          },
        }),
      ]);

      // 2. 업데이트된 경험치 기반으로 레벨 계산 및 적용
      await this.handleLevelUp(updatedMember);

      return targetBadge;
    }
    
    return null;
  }

  /**
   * 3. 대표 뱃지 설정
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

  /**
   * [내부 로직] 기획안 기준 누적 XP별 레벨 계산 및 업데이트
   */
  private async handleLevelUp(member: any) {
    const xp = member.memberXp;
    let newLevel = 1;

    // 팀원 가이드라인 기반 누적 XP 구간 설정
    if (xp >= 3350) newLevel = 10;      // Lv 9->10 (800)
    else if (xp >= 2550) newLevel = 9;  // Lv 8->9 (650)
    else if (xp >= 1900) newLevel = 8;  // Lv 7->8 (500)
    else if (xp >= 1400) newLevel = 7;  // Lv 6->7 (400)
    else if (xp >= 1000) newLevel = 6;  // Lv 5->6 (300)
    else if (xp >= 700) newLevel = 5;   // Lv 4->5 (250)
    else if (xp >= 450) newLevel = 4;   // Lv 3->4 (200)
    else if (xp >= 250) newLevel = 3;   // Lv 2->3 (150)
    else if (xp >= 100) newLevel = 2;   // Lv 1->2 (100)
    else newLevel = 1;

    // 계산된 레벨이 기존 레벨과 다를 경우에만 DB 업데이트
    if (newLevel !== member.memberLevel) {
      await this.prisma.member.update({
        where: { id: member.id },
        data: { memberLevel: newLevel },
      });
    }
  }

  private getMemberCountByType(member: any, type: string): number {
    switch (type) {
      case 'COOK_COUNT': return member.cookCount || 0;
      case 'INGREDIENT_COUNT': return member.ingredientCount || 0;
      case 'POST_COUNT': return member.postCount || 0;
      default: return 0;
    }
  }
}