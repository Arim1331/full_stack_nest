import { Body, Controller, Post } from '@nestjs/common';
import { CreateFridgeDto } from 'src/domain/fridge/dto/create-fridge.dto';
import { FridgeService } from 'src/service/fridge/fridge.service';

@Controller('fridge')
export class FridgeController {
  constructor(private readonly fridgeService: FridgeService) {}

  @Post()
  create(@Body() dto: CreateFridgeDto) {
    return this.fridgeService.create(dto);
  }
}