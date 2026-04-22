import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  CommentCreateDTO,
  CommentCreateServiceDTO,
  CommentUpdateDTO,
} from 'src/domain/comment/dto/comment.dto';
import CommentException from 'src/exception/exception.comment';
import { CommentRepository } from 'src/repository/comment/comment.repository';
import { PostRepository } from 'src/repository/post/post.repository';

// 비지니스 로직 담당
@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
  ) {}

  // 댓글 생성
  async createComment(
    commentCreateDTO: CommentCreateServiceDTO,
  ): Promise<void> {
    await this.commentRepository.save(commentCreateDTO);
  }

  // 게시글별 댓글 조회
  async getCommentByPostId(postId: number) {
    return await this.commentRepository.findCommentsByPostId(postId);
  }

  // 댓글 수정
  // 내 댓글만 수정 가능
  async updateComment(
    id: number,
    memberId: number,
    commentUpdateDTO: CommentUpdateDTO,
  ): Promise<void> {
    const foundComment = await this.commentRepository.findCommentById(id);

    if (!foundComment) {
      throw new CommentException('수정할 댓글이 없습니다.');
    }

    if (foundComment.memberId !== memberId) {
      throw new ForbiddenException('본인 댓글만 수정할 수 있습니다.');
    }

    await this.commentRepository.modify(id, commentUpdateDTO);
  }

  // 댓글 단일 삭제
  // 댓글 작성자 본인 삭제 가능
  // 게시글 작성자면 남 댓글도 삭제 가능
  async deleteComment(id: number, memberId: number): Promise<void> {
    const foundComment = await this.commentRepository.findCommentById(id);

    if (!foundComment) {
      throw new CommentException('삭제할 댓글이 없습니다.');
    }

    const foundPost = await this.postRepository.findPostById(
      foundComment.postId,
    );

    if (!foundPost) {
      throw new CommentException('게시글을 찾을 수 없습니다.');
    }

    const isCommentOwner = foundComment.memberId === memberId;
    const isPostOwner = foundPost.memberId === memberId;

    if (!isCommentOwner && !isPostOwner) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.commentRepository.remove(id);
  }

  // 게시글별 댓글 전체 삭제
  // 내 게시글일 때만 전체 삭제 가능
  async deleteAllCommentsByPostId(
    postId: number,
    memberId: number,
  ): Promise<void> {
    const foundPost = await this.postRepository.findPostById(postId);

    if (!foundPost) {
      throw new CommentException('게시글을 찾을 수 없습니다.');
    }

    if (foundPost.memberId !== memberId) {
      throw new ForbiddenException('내 게시글에서만 전체 삭제할 수 있습니다.');
    }

    const foundComments =
      await this.commentRepository.findCommentsByPostId(postId);

    if (!foundComments || foundComments.length === 0) {
      throw new CommentException('삭제할 댓글이 없습니다.');
    }

    await this.commentRepository.removeAllByPostId(postId);
  }

  // 선택한 댓글들 삭제(체크박스로 선택 삭제)
  // 내가 선택한 댓글들이 전부 내 댓글이면 삭제 가능
  // 내가 그 게시글 작성자이고, 선택한 댓글들이 모두 같은 게시글 소속이면 삭제 가능
  async deleteSelectedComments(
    commentIds: number[],
    memberId: number,
  ): Promise<void> {
    const foundComments =
      await this.commentRepository.findCommentsByIds(commentIds);

    if (!foundComments || foundComments.length === 0) {
      throw new CommentException('삭제할 댓글이 없습니다.');
    }

    // 요청한 개수와 조회된 개수가 다르면 잘못된 id 포함된 것
    if (foundComments.length !== commentIds.length) {
      throw new CommentException('일부 댓글을 찾을 수 없습니다.');
    }

    const allMine = foundComments.every(
      (comment) => comment.memberId === memberId,
    );

    if (allMine) {
      await this.commentRepository.removeSelected(commentIds);
      return;
    }

    // 전부 내 댓글이 아니면, 같은 게시글에 속한 댓글들인지 확인
    const firstPostId = foundComments[0].postId;
    const samePost = foundComments.every(
      (comment) => comment.postId === firstPostId,
    );

    if (!samePost) {
      throw new ForbiddenException(
        '다른 게시글의 댓글을 함께 삭제할 수 없습니다.',
      );
    }

    const foundPost = await this.postRepository.findPostById(firstPostId);

    if (!foundPost) {
      throw new CommentException('게시글을 찾을 수 없습니다.');
    }

    const isPostOwner = foundPost.memberId === memberId;

    if (!isPostOwner) {
      throw new ForbiddenException('선택한 댓글을 삭제할 권한이 없습니다.');
    }

    await this.commentRepository.removeSelected(commentIds);
  }

  // async deleteSelectedComments(commentIds: number[], memberId: number): Promise<void> {
  //   const foundComments =
  //     await this.commentRepository.findCommentsByIds(commentIds);

  //   if (!foundComments || foundComments.length === 0) {
  //     throw new CommentException('삭제할 댓글이 없습니다.');
  //   }

  //   const notMine = foundComments.some((comment) => comment.memberId !== memberId)

  //   if(notMine) {
  //     throw new ForbiddenException("본인 댓글만 선택 삭제할 수 있습니다.")
  //   }

  //   await this.commentRepository.removeSelected(commentIds);
  // }
}
