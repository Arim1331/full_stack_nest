import { Injectable } from '@nestjs/common';
import { PostLikeDTO, PostLikeServiceDTO } from 'src/domain/postlike/dto/postlike.dto';
import PostLikeException from 'src/exception/exception.postlike';
import { PostLikeRepository } from 'src/repository/postlike/postlike.repository';

// 비지니스 로직
@Injectable()
export class PostlikeService {
  constructor(private readonly postlikeRepository: PostLikeRepository){;}

  // 좋아요 생성
  async createPostLike(postLikeCreateDTO: PostLikeServiceDTO){
    const { memberId, postId } = postLikeCreateDTO

    const existingLike = await this.postlikeRepository.findPostLike(memberId, postId)

    if(existingLike){
      throw new PostLikeException("이미 좋아요를 눌렀습니다.")
    } 
    return this.postlikeRepository.createPostLike(memberId, postId)
  }

  // 좋아요 삭제
  async deletePostLike(postLikeDeleteDTO: PostLikeServiceDTO) {
    const { memberId, postId } = postLikeDeleteDTO

    const existingLike = await this.postlikeRepository.findPostLike(memberId, postId)

    if(!existingLike){
      throw new PostLikeException("좋아요가 없습니다.")
    }

    return this.postlikeRepository.deletePostLike(memberId, postId)

  }

}
