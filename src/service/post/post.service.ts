import { ForbiddenException, Injectable } from '@nestjs/common';
import { PostRepository } from 'src/repository/post/post.repository';
import { PostCreateDTO, PostUpdatedDTO } from 'src/domain/post/dto/post.dto';
import PostException from 'src/exception/exception.post';

// 비지니스 로직 담당
@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository ) {;}

  // 게시글 목록 전체 조회
  async getPosts(memberId?: number) {
    const foundPosts = await this.postRepository.findPosts()
    console.log("foundPosts", foundPosts)
    
    return foundPosts.map((post) => ({
      ...post,
      likes: post._count.postLike,
      liked: memberId
        ? post.postLike.some((like) => like.memberId === memberId)
        : false
    }))
    // 데이터를 돌려줘야하니 return
  }

  // 게시글 단일 조회
  async getPost(id: number, memberId?: number) {
    const foundPost =  await this.postRepository.findPostById(id)
    console.log("foundPost", foundPost)

    if(!foundPost) {
      throw new PostException("게시글을 찾을 수 없습니다.")
    }
    return { 
      ...foundPost,
      likes: foundPost._count.postLike,
      liked: memberId
        ? foundPost.postLike.some((like) => like.memberId === memberId)
        : false
    }
  }

  // 게시글 생성
  async createPost(postCreateDTO: PostCreateDTO) {
    return await this.postRepository.save(postCreateDTO)
    // 행동만 하면 return 없어도 됨
  }

  // 게시글 수정
  async updatePost(id: number,  memberId: number, postUpdatedDTO: PostUpdatedDTO): Promise<void> {
    const foundPost = await this.postRepository.findPostById(id)

    if(!foundPost){
      throw new PostException("수정할 게시글이 없습니다.")
    }

    if (foundPost.memberId !== memberId) {
      throw new ForbiddenException("본인 게시글만 수정할 수 있습니다.")
    }

    await this.postRepository.modify(id, postUpdatedDTO)
  }

  // 게시글 삭제
  async deletePost(id: number, memberId: number): Promise<void> {
    const foundPost = await this.postRepository.findPostById(id)

    if(!foundPost) {
      throw new PostException("삭제할 게시글이 없습니다.")
    }

    if (foundPost.memberId !== memberId) {
      throw new ForbiddenException('본인 게시글만 삭제할 수 있습니다.');
    }

    await this.postRepository.remove(id)
  }

}
