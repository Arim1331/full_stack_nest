// 저징 레시피 생성
export class CreateAiSavedRecipeDTO {
  // memberId: number  지우는 이유: 컨트롤러에서 이걸 무시하고 req.user.id를 넣고 있음. 클라이언트가 회원 번호를 보내는 구조보다 서버가 인증정보로 넣는 구조가 더 안전.
  title: string
  description?: string
  imageUrl?: string

  cookTime?: number
  difficulty?: string
  category?: string
  xp?: number

  ingredients: {
    main: string[]
    sub: string[]
  }

  steps: string[]
}

// 저장한 레시피 목록 응답
export class AiSavedRecipeListResponseDTO {
  id: number
  title: string
  description?: string
  imageUrl?: string

  cookTime?: number
  difficulty?: string
  category?: string
  xp?: number

  createdAt: Date
}

// 저장한 레시피 응답
export class AiSavedRecipeResponseDTO {
  id: number
  memberId: number
  title: string
  description?: string
  imageUrl?: string

  cookTime?: number
  difficulty?: string
  category?: string
  xp?: number

  ingredients?: {
    main: string[]
    sub: string[]
  }

  steps?: string[]
  createdAt: Date
}