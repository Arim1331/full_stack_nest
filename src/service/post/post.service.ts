import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostRepository } from 'src/repository/post/post.repository';
import { PostCreateDTO, PostUpdatedDTO } from 'src/domain/post/dto/post.dto';
import PostException from 'src/exception/exception.post';
// 추가된 임포트
import { BadgeService } from '../badge/badge.service'; 
import { PrismaService } from 'src/service/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    // 뱃지 연동을 위해 추가된 주입
    private readonly badgeService: BadgeService,
    private readonly prisma: PrismaService,
  ) {}

  // 게시글 목록 전체 조회
  async getPosts(memberId?: number) {
    const foundPosts = await this.postRepository.findPosts();
    
    return foundPosts.map((post) => ({
      ...post,
      likes: post._count.postLike,
      liked: memberId
        ? post.postLike.some((like) => like.memberId === memberId)
        : false
    }));
  }

  // 게시글 단일 조회
  async getPost(id: number, memberId?: number) {
    const foundPost = await this.postRepository.findPostById(id);

    if(!foundPost) {
      throw new PostException("게시글을 찾을 수 없습니다.");
    }
    return { 
      ...foundPost,
      likes: foundPost._count.postLike,
      liked: memberId
        ? foundPost.postLike.some((like) => like.memberId === memberId)
        : false
    };
  }

  // 게시글 생성 (요리 완료 인증 및 뱃지 체크)
  async createPost(postCreateDTO: PostCreateDTO): Promise<void> {
    // 1. 기존 게시글 저장 로직 실행
    await this.postRepository.save(postCreateDTO);

    // 2. 요리 완료 횟수(cookCount) 1 증가
    // postCreateDTO 내부에 memberId 필드가 있다고 가정합니다.
    await this.prisma.member.update({
      where: { id: postCreateDTO.memberId },
      data: { cookCount: { increment: 1 } },
    });

    // 3. 뱃지 조건 충족 여부 확인 및 자동 지급
    await this.badgeService.checkAndAwardBadge(postCreateDTO.memberId, 'COOK_COUNT');
  }

  // 게시글 수정
  async updatePost(id: number, memberId: number, postUpdatedDTO: PostUpdatedDTO): Promise<void> {
    const foundPost = await this.postRepository.findPostById(id);

    if(!foundPost){
      throw new PostException("수정할 게시글이 없습니다.");
    }

    if (foundPost.memberId !== memberId) {
      throw new ForbiddenException("본인 게시글만 수정할 수 있습니다.");
    }

    await this.postRepository.modify(id, postUpdatedDTO);
  }

  // 게시글 삭제
  async deletePost(id: number, memberId: number): Promise<void> {
    const foundPost = await this.postRepository.findPostById(id);

    if(!foundPost) {
      throw new PostException("삭제할 게시글이 없습니다.");
    }

    if (foundPost.memberId !== memberId) {
      throw new ForbiddenException('본인 게시글만 삭제할 수 있습니다.');
    }

    await this.postRepository.remove(id);
  }
}