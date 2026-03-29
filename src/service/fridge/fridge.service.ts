import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateFridgeDto } from "src/domain/fridge/dto/create-fridge.dto";

@Injectable()
export class FridgeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFridgeDto) {
    const {
      memberId,
      ingredientName,
      category,
      quantity,
      unit,
      expireDate
    } = dto;

    // 1. ingredient 찾기 or 생성
    let ingredient = await this.prisma.ingredient.findFirst({
      where: { ingredientName }
    });

    if (!ingredient) {
      ingredient = await this.prisma.ingredient.create({
        data: {
          ingredientName,
          ingredientCategory: category
        }
      });
    }

    // 2. 같은 날짜 + 재료 있는지 확인
    const existing = await this.prisma.myFridge.findFirst({
      where: {
        memberId,
        ingredientId: ingredient.id,
        expireDate: expireDate ? new Date(expireDate) : null
      }
    });

    // 3. merge or create
    if (existing) {
      return await this.prisma.myFridge.update({
        where: { id: existing.id },
        data: {
          fridgeQuantity: existing.fridgeQuantity + quantity
        }
      });
    }

    return await this.prisma.myFridge.create({
      data: {
        memberId,
        ingredientId: ingredient.id,
        fridgeQuantity: quantity,
        unit,
        expireDate: expireDate ? new Date(expireDate) : null
      }
    });
  }
}