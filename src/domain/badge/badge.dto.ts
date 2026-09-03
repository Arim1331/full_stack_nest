// badge-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BadgeResponseDto {
  @ApiProperty({ example: 1, description: '뱃지 ID' })
  id!: number;

  @ApiProperty({ example: '냉털 요리사', description: '뱃지 이름' })
  badgeName!: string;

  @ApiProperty({ example: '남은 재료만으로 요리 5회 완성', description: '뱃지 설명' })
  badgeDescription!: string;

  @ApiProperty({ example: 'leftover-cook', description: '이미지 파일명' })
  badgeImageUrl!: string | null;

  @ApiProperty({ example: 'cook', description: '뱃지 카테고리' })
  category!: string | null;

  @ApiProperty({ example: true, description: '유저의 획득 여부' })
  isUnlocked!: boolean;

  @ApiProperty({ example: '2026-05-04T22:36:04Z', description: '획득 일시 (미획득 시 null)', nullable: true })
  achievedAt?: Date | null;
}