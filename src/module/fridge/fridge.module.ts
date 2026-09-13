import { Module } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma/prisma.service';
import { OpenaiModule } from '../openai/openai.module';
import { FridgeController } from 'src/controller/fridge/fridge.controller';
import { FridgeService } from 'src/service/fridge/fridge.service';
import { ImageService } from 'src/service/image/image.service';
import { BadgeModule } from '../badge/badge.module';

@Module({
  imports: [OpenaiModule, BadgeModule], 
  controllers: [FridgeController],
  providers: [FridgeService, PrismaService, ImageService],
})
export class FridgeModule {}