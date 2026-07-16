// import { Injectable } from "@nestjs/common";
// import axios from "axios";

// @Injectable()
// export class ImageService {
//   async getFoodImage(query: string): Promise<string> {
//     try {
//       const res = await axios.get(
//         "https://api.unsplash.com/search/photos",
//         {
//           params: {
//             query: query + " food", // 음식 키워드 보정
//             per_page: 10,
//           },
//           headers: {
//             Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
//           },
//         }
//       );

//       const results = res.data.results;

//       // 결과 없으면 fallback
//       if (!results || results.length === 0) {
//         return `https://source.unsplash.com/800x600/?food`;
//       }

//       const randomIndex = Math.floor(Math.random() * results.length);

//       return results[randomIndex].urls.regular;

//     } catch (e) {
//       console.error("Unsplash error:", e.message);

//       // API 실패 시 fallback
//       return `https://source.unsplash.com/800x600/?food`;
//     }
//   }
// }

import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImageService {
  private getFoodImageKeyword(query: string): string {
    const title = String(query || '').toLowerCase();

    // 양식
    if (title.includes('파스타') || title.includes('pasta')) {
      return 'pasta dish';
    }

    if (title.includes('피자') || title.includes('pizza')) {
      return 'pizza';
    }

    if (title.includes('스테이크') || title.includes('steak')) {
      return 'steak food';
    }

    if (title.includes('샌드위치') || title.includes('sandwich')) {
      return 'sandwich food';
    }

    if (title.includes('버거') || title.includes('burger')) {
      return 'burger food';
    }

    // 일식
    if (
      title.includes('초밥') ||
      title.includes('스시') ||
      title.includes('sushi')
    ) {
      return 'sushi';
    }

    if (
      title.includes('라멘') ||
      title.includes('라면') ||
      title.includes('우동') ||
      title.includes('국수') ||
      title.includes('면')
    ) {
      return 'noodle soup food';
    }

    if (title.includes('덮밥')) {
      return 'rice bowl food';
    }

    // 중식 / 아시안
    if (title.includes('볶음밥')) {
      return 'fried rice food';
    }

    if (title.includes('마라')) {
      return 'spicy chinese food';
    }

    if (title.includes('만두') || title.includes('dumpling')) {
      return 'dumpling food';
    }

    if (title.includes('튀김')) {
      return 'fried food';
    }

    // 국물 / 찌개
    if (title.includes('찌개') || title.includes('스튜')) {
      return 'stew food';
    }

    if (title.includes('국') || title.includes('탕')) {
      return 'soup food';
    }

    // 메인 재료 먼저 검사
    if (
      title.includes('닭') ||
      title.includes('치킨') ||
      title.includes('chicken')
    ) {
      return 'chicken dish';
    }

    if (
      title.includes('삼겹살') ||
      title.includes('돼지') ||
      title.includes('pork')
    ) {
      return 'pork dish';
    }

    if (
      title.includes('소고기') ||
      title.includes('불고기') ||
      title.includes('beef')
    ) {
      return 'beef dish';
    }

    if (
      title.includes('생선') ||
      title.includes('연어') ||
      title.includes('참치') ||
      title.includes('해산물') ||
      title.includes('seafood')
    ) {
      return 'seafood dish';
    }

    if (
      title.includes('계란') ||
      title.includes('달걀') ||
      title.includes('egg')
    ) {
      return 'egg dish';
    }

    if (title.includes('두부') || title.includes('tofu')) {
      return 'tofu dish';
    }

    if (title.includes('김치') || title.includes('kimchi')) {
      return 'kimchi food';
    }

    if (title.includes('카레') || title.includes('curry')) {
      return 'curry food';
    }

    // 요리 형태
    if (title.includes('볶음')) {
      return 'stir fry food';
    }

    if (title.includes('샐러드') || title.includes('salad')) {
      return 'fresh salad food';
    }

    // 채소 조건은 마지막 쪽으로
    if (
      title.includes('상추') ||
      title.includes('양파') ||
      title.includes('고수') ||
      title.includes('채소') ||
      title.includes('야채')
    ) {
      return 'fresh vegetable food';
    }

    return 'home cooked food';
  }

  async getFoodImage(query: string): Promise<string> {
    const keyword = this.getFoodImageKeyword(query);

    try {

      const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: keyword,
          per_page: 10,
          orientation: 'landscape',
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
        },
      });

      const results = res.data.results;


      if (!results || results.length === 0) {
        return '/assets/images/default-recipe.png';
      }

      const randomIndex = Math.floor(Math.random() * results.length);

      return results[randomIndex].urls.regular;
    } catch (e) {
      console.error('Unsplash error:', e.response?.data || e.message);

      return '/assets/images/default-recipe.png';
    }
  }
}
