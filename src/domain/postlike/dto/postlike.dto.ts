import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt } from "class-validator";

// 로그인된 사용자 id는 토큰/세션에서 받고, 요청 바디에서는 postId만 받겠다
// 로그인 사용자 정보 사용 가능 -> postId만 DTO에 넣기
// 로그인 기능 아직 연결 안됨 ? -> memberId, postId 둘 다 DTO에 넣기
// export class PostLikeDTO {
//   // @IsInt()랑 @IsNumber()랑 차이? @IsInt()는 정수만 허용
//   @IsInt()
//   postId: number;
// }


// 프론트가 보내는 값만 받음
export class PostLikeDTO {
  @ApiProperty({ example: 1, description: "게시글 아이디" })
  @Type(() => Number)
  @IsInt()
  postId: number;
}

// 컨트롤러가 JWT에서 memberId 붙여서 서비스에 넘김
export class PostLikeServiceDTO {
  memberId: number
  postId: number
}