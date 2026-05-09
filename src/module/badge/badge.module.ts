import { Module } from '@nestjs/common';
import { BadgeController } from 'src/controller/badge/badge.controller';
import { BadgeService } from 'src/service/badge/badge.service';
import { PrismaService } from 'src/service/prisma/prisma.service';

@Module({
  controllers: [BadgeController],
  providers: [BadgeService, PrismaService], // PrismaService를 등록
  exports: [BadgeService],
})
export class BadgeModule {}