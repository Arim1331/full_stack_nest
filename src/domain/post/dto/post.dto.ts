import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer"
import { ApiProperty } from "@nestjs/swagger";

export class PostDTO {
  @ApiProperty({ example: 1, description: "게시글 아이디" })
  id: number;

  @ApiProperty({
    example: { id: 1, memberName: "홍길동" },
    description: "게시글 작성자 정보",
  })
  member: {
    id: number;
    memberName: string;
  } // member relation 객체

  @ApiProperty({ example: "첫 번째 게시글", description: "게시글 제목"})
  @IsString()
  postTitle: string;

  @ApiProperty({ example: "내용입니다", description: "게시글 내용"})
  @IsString()
  postContent: string;

  @ApiProperty({ example: "2026-03-23T09:00:00.000Z", description: "게시글 생성일"})
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ example: "2026-03-23T09:00:00.000Z", description: "게시글 수정일", required: false, nullable: true })
  @IsOptional()
  @Type(() => Date)
  updatedAt: Date | null;

  @ApiProperty({ example: 10, description: "획득 XP"})
  @IsNumber()
  postXp: number;

  @ApiProperty({ example: { id: 1, recipeTitle: "김치찌개" }, description: "인증한 레시피 정보"})
  recipe: {
    id: number;
    recipeTitle: string;
  } // recipe relation 객체
  
  @ApiProperty({ example: "2026-03-23T09:00:00.000Z", description: "게시글 삭제일", required: false, nullable: true })
  @IsOptional()
  @Type(() => Date)
  deletedAt: Date | null;

}

export class PostCreateDTO {
  @ApiProperty({ example: 1, description: "게시글 작성자 아이디"})
  @Type(() => Number)
  @IsNumber()
  memberId: number;

  @ApiProperty({ example: 1, description: 
    "인증 레시피 아이디"
  })
  @Type(() => Number)
  @IsNumber()
  recipeId: number;

  @ApiProperty({ example: "첫 번째 게시글", description: "게시글 제목" })
  @IsString()
  postTitle: string;

  @ApiProperty({ example: "내용입니다", description: "게시글 내용" })
  @IsString()
  postContent: string;

}

export class PostUpdatedDTO {
  @ApiProperty({ example: 1, description: "수정할 게시글 아이디" })
  @Type(() => Number)
  @IsNumber()
  id: number;

  @ApiProperty({ example: "수정된 제목", description: "게시글 제목", required: false })
  @IsOptional()
  @IsString()
  postTitle?: string;

  @ApiProperty({ example: "수정된 내용입니다", description: "게시글 내용", required: false })
  @IsOptional()
  @IsString()
  postContent?: string;
}

export class PostDeletedDTO {
  @ApiProperty({ example: 1, description: "삭제할 게시글 아이디" })
  @Type(() => Number)
  @IsNumber()
  id: number;
}

// id         Int      @id @default(autoincrement()) @map("post_id")
//   memberId   Int      @map("member_id")
//   postTitle  String   @map("post_title")
//   postContent String  @map("post_content")
//   createdAt  DateTime @default(now()) @map("post_created_at")
//   updatedAt  DateTime? @map("post_updated_at")
//   postXp     Int      @default(0) @map("post_xp")
//   recipeId   Int      @map("recipe_id")
//   deletedAt  DateTime? @map("post_deleted_at")

//   member Member @relation(fields: [memberId], references: [id])
//   recipe Recipe @relation(fields: [recipeId], references: [id])

//   postImage          PostImage[]
//   comment            Comment[]
//   postLike           PostLike[]
//   postIngredientUsed PostIngredientUsed[]

//   @@map("tbl_post")