import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator"

// PostImageCreateDTO랑 PostImageUpdateDTO를 나눈 이유?
// 지금은 구조가 같아도 나중에 수정 정책 달라질 수 있어서

// 이미지 1장 데이터
export class PostImageItemDTO {
  @ApiProperty({ 
    example: "https://example.com/post-image-1.jpg", 
    description: "게시글 이미지 URL"
  })
  @IsString()
  @IsNotEmpty()
  imageUrl: string

  @ApiPropertyOptional({ 
    example: 0, 
    description: "이미지 순서입니다. 0번쨰 이미지가 카드 썸네일로 사용됩니다.",
    minimum: 0,
    maximum: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  imageOrder?: number
}

// 이미지 여러 장 등록
export class PostImageCreateDTO {
  @ApiProperty({
    type: [PostImageItemDTO],
    description: "등록할 게시글 이미지 목록입니다. 최대 5장까지 등록할 수 있습니다."
  })
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => PostImageItemDTO)
  images: PostImageItemDTO []
}

// 이미지 여러 장 교체/수정
export class PostImageUpdateDTO {
  @ApiProperty({
    type: [PostImageItemDTO],
    description: "수정할 게시글 이미지 목록입니다. 기존 이미지를 이 목록으로 교체합니다."
  })
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => PostImageItemDTO)
  images: PostImageItemDTO[]
}

// 이미지 여러 장 선택 삭제
export class PostImageDeleteDTO {
  @ApiProperty({
    example: [1, 2, 3],
    description: "삭제할 게시글 이미지 ID 목록입니다."
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  imageIds: number[]
}