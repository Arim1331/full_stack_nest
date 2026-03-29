export class CreateFridgeDto {
  memberId: number;
  ingredientName: string;
  category: string;
  quantity: number;
  unit: string;
  expireDate?: string; // 프론트에서 string으로 옴
}