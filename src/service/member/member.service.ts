import { ConflictException ,forwardRef, Inject, Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { MemberRepository } from 'src/repository/member/member.repository';
import { BadgeService } from '../badge/badge.service';
import { AuthService } from '../auth/auth.service';
import { MemberRegisterDTO, MemberUpdateDTO, MulterFile, OAuthLoginDTO, NicknameChangeDTO, ChangePasswordDTO } from 'src/domain/member/dto/member.dto';
import MemberException from 'src/exception/exception.member';
import { AuthProvider } from '@prisma/client';
import { MemberResponse } from 'src/domain/member/dto/member.response';
import { S3Service } from '../s3/s3.service'; 
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class MemberService {
    private readonly logger = new Logger(MemberService.name);

    constructor(
        private readonly memberRepository: MemberRepository,
        @Inject(forwardRef(() => BadgeService))
        private readonly badgeService: BadgeService,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        private readonly s3Service: S3Service,
    ) {}

    // --- 1. 레벨별 목표 경험치(maxExp) 설정 테이블 ---
    private readonly LEVEL_SETTINGS: Record<number, number> = {
        1: 30,    2: 60,    3: 90,    4: 120,   5: 150,
        6: 200,   7: 250,   8: 300,   9: 350,   10: 450,
        11: 550,  12: 650,  13: 750,  14: 850,  15: 1000,
        16: 1200, 17: 1400, 18: 1600, 19: 1800, 20: 2000,
        21: 2400, 22: 2600, 23: 2800, 24: 3000, 25: 3200,
        26: 3500, 27: 3800, 28: 4100, 29: 4400, 30: 6000,
    };

    /**
     * [내부 로직] 보유 XP 기준 현재 적정 레벨 및 목표 XP 계산
     */
    private calculateLevelInfo(xp: number) {
        let currentLevel = 1;

        // 1레벨부터 차례대로 검사하여 목표 XP 이상이면 다음 레벨로 판정
        for (let lvl = 1; lvl <= 30; lvl++) {
            const targetXp = this.LEVEL_SETTINGS[lvl];
            
            if (xp >= targetXp) {
                // maxExp 이상 달성 시 다음 레벨로 진입 (최대 30레벨)
                currentLevel = Math.min(lvl + 1, 30);
            } else {
                // 아직 달성 못했으면 현재 lvl이 적정 레벨
                currentLevel = lvl;
                break;
            }
        }

        // 현재 레벨의 목표 경험치 (30레벨 이상이면 6000)
        const nextLevelMaxXp = this.LEVEL_SETTINGS[currentLevel] || 6000;

        return { currentLevel, nextLevelMaxXp };
    }

// 회원 가입 서비스
  async join(member: MemberRegisterDTO): Promise<void> {
    this.logger.log(`[회원가입 요청] Email: ${member.memberEmail}`);

    // 💡 일반 폼 회원가입(LOCAL)일 때만 LOCAL 이메일 중복 체크
    if (member.memberProvider === AuthProvider.LOCAL) {
      const foundLocalMember = await this.memberRepository.findLocalMemberByEmail(
        member.memberEmail
      );
      if (foundLocalMember) {
        this.logger.warn(
          `[회원가입 실패] 이미 존재하는 로컬 이메일: ${member.memberEmail}`
        );
        throw new MemberException("이미 일반 회원으로 가입된 이메일입니다.");
      }
    }

    let hashedPassword = member.memberPassword;
    if (
      member.memberProvider === AuthProvider.LOCAL &&
      member.memberPassword
    ) {
      hashedPassword = await this.authService.hashPassword(
        member.memberPassword
      );
    }

    try {
      await this.memberRepository.save({
        ...member,
        memberPassword: hashedPassword,
      });
      this.logger.log(`[회원가입 성공] Email: ${member.memberEmail}`);
    } catch (error: any) {
      // 💡 Prisma DB 제약조건 위반 에러(P2002) 캐치
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = String(error.meta?.target);

        // 닉네임 중복 체크
        if (target.includes('member_nickname') || target.includes('nickname')) {
          this.logger.warn(`[회원가입 실패] 닉네임 중복: ${member.memberNickname}`);
          throw new MemberException("이미 사용 중인 이름입니다.");
        }

        // DB 레벨 이메일 중복 체크 (안전장치)
        if (target.includes('member_email') || target.includes('email')) {
          this.logger.warn(`[회원가입 실패] 이메일 중복: ${member.memberEmail}`);
          throw new MemberException("이미 가입된 이메일입니다.");
        }
      }

      // 잡히지 않은 다른 에러는 그대로 다시 throw
      throw error;
    }
  }

    /**
 * 회원 단일 조회 (레벨 및 경험치 진행도 포함)
 */
async getMember(id: number): Promise<any> {
    const member = await this.memberRepository.findMemberById(id);

    if (!member) { 
        this.logger.warn(`[회원 조회 실패] 존재하지 않는 Member ID: ${id}`);
        throw new MemberException("멤버를 찾을 수 없습니다.");
    }

    const currentXp = member.memberXp || 0;

    // 1. 현재 XP 기반 적정 레벨 및 목표 XP 자동 산출
    const { currentLevel, nextLevelMaxXp } = this.calculateLevelInfo(currentXp);

    // 2. DB의 레벨과 계산된 레벨이 다르면 DB 동기화 업데이트
    if (member.memberLevel !== currentLevel) {
        this.logger.log(`[레벨 동기화] Member ID: ${id} - Lv.${member.memberLevel} -> Lv.${currentLevel} (XP: ${currentXp})`);
        
        await this.memberRepository.updateProfile(id, {
            memberName: member.memberName,
            memberLevel: currentLevel
        });
    }

    // 3. 레벨업/뱃지 동기화 처리
    await this.badgeService.handleLevelUp({
        ...member,
        memberLevel: currentLevel
    });

    // 4. 💡 [수정] BadgeService의 실제 메서드인 findAllMyBadges 호출
    const badges = await this.badgeService.findAllMyBadges(id);

    // 5. 진행률(%) 계산
    const progress = Math.min(
        Math.floor((currentXp / nextLevelMaxXp) * 100), 
        100
    );

    return {
        ...member,
        memberLevel: currentLevel,
        socials: member.socials.map(({ memberPassword, ...rest }) => rest),
        nextLevelMaxXp, // 현재 레벨 목표치
        progress,       // 게이지 퍼센트 (0~100)
        currentXp,
        badges          // 뱃지 목록 및 해금 정보 반환
    };
}

    // 단일 회원 이메일로 조회
    async getMemberByMemberEmail(memberEmail: string): Promise<any | null> {
        const member = await this.memberRepository.findMemberByMemberEmail(memberEmail);
        if (member) {
            return this.getMember(member.id); // 공통된 계산 로직 적용을 위해 getMember 호출
        }
        return null;
    }

    // 단일 회원 Provider로 조회
    async getMemberByMemberProvider(socialMember: OAuthLoginDTO): Promise<any | null> {
        const member = await this.memberRepository.findByProvider(socialMember);
        if (member) {
            return this.getMember(member.id);
        }
        return null;
    }

    // 회원 전체 목록 조회
    async getMembers(): Promise<MemberResponse[]> {
        const members = await this.memberRepository.findMemberAll();
        return members.map((member) => ({
            ...member,
            socials: member.socials.map(({ memberPassword, ...rest }) => rest)
        }));
    }

    // 회원 프로필 이미지 수정
    async updateProfile(id: number, thumbnail: MulterFile, member: MemberUpdateDTO) {
        this.logger.log(`[프로필 이미지 수정 요청] Member ID: ${id}`);
        if (thumbnail) {
            const s3Result = await this.s3Service.uploadFile(thumbnail, "profiles");
            
            const foundMember = await this.memberRepository.findMemberById(id);
            if (!foundMember) { 
                this.logger.warn(`[프로필 이미지 수정 실패] Member ID: ${id} 회원 없음`);
                throw new MemberException("회원 조회 실패");
            }

            await this.memberRepository.updateProfile(id, { 
                memberName: foundMember.memberName,
                memberProfile: s3Result.originalUrl
            });
            this.logger.log(`[프로필 이미지 수정 완료] Member ID: ${id} -> URL: ${s3Result.originalUrl}`);
        }
        return await this.getMember(id);
    }

    // 회원 정보 수정
    async modify(id: number, member: MemberUpdateDTO) {
        this.logger.log(`[회원정보 수정 요청] Member ID: ${id}`);
        const foundMember = await this.memberRepository.findMemberById(id);
        if (!foundMember) {
            this.logger.warn(`[회원정보 수정 실패] Member ID: ${id} 회원 없음`);
            throw new MemberException("회원을 찾을 수 없습니다");
        }

        await this.memberRepository.updateProfile(id, member);
        this.logger.log(`[회원정보 수정 완료] Member ID: ${id}`);
        return await this.getMember(id);
    }

    // 회원 탈퇴
    async withdraw(id: number): Promise<void> {
        this.logger.log(`[회원 탈퇴 요청] Member ID: ${id}`);
        await this.memberRepository.delete(id);
        this.logger.log(`[회원 탈퇴 완료] Member ID: ${id}`);
    }

    // 닉네임 변경
    async changeNickname(
        id: number,
        member: NicknameChangeDTO
    ) {
        this.logger.log(`[닉네임 변경 요청] Member ID: ${id} -> 새 닉네임: ${member.memberName}`);
        const foundMember = await this.memberRepository.findMemberById(id);

        if (!foundMember) {
            this.logger.warn(`[닉네임 변경 실패] Member ID: ${id} 회원 없음`);
            throw new MemberException("회원을 찾을 수 없습니다"); 
        }

        // 💡 memberName 및 memberNickname 중복 검사 (본인 제외)
        const duplicateMember =
            await this.memberRepository.findMemberByName(member.memberName);

        if (duplicateMember && duplicateMember.id !== id) {
            this.logger.warn(`[닉네임 변경 실패] 중복된 닉네임: ${member.memberName}`);
            throw new ConflictException("중복된 닉네임입니다.");
        }

        try {
            // 💡 memberName과 memberNickname을 모두 동일한 값으로 업데이트
            const updatedMember =
                await this.memberRepository.updateNickname(
                    id,
                    member.memberName
                );
            this.logger.log(`[닉네임 변경 성공] Member ID: ${id} -> ${member.memberName}`);

            return updatedMember;
        } catch (error: any) {
            // 💡 Prisma Unique 제약조건(P2002) 예외 처리 (안전장치)
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002'
            ) {
                this.logger.warn(`[닉네임 변경 실패] DB Unique 제약조건 위반: ${member.memberName}`);
                throw new ConflictException("중복된 닉네임입니다.");
            }
            throw error;
        }
    }
    // 비밀번호 변경
    async changePassword(memberId: number, dto: ChangePasswordDTO): Promise<void> {
        this.logger.log(`[비밀번호 변경 요청] Member ID: ${memberId}`);

        const { currentPassword, newPassword } = dto;

        // 1. 회원 존재 확인
        const member = await this.memberRepository.findMemberById(memberId);
        if (!member) {
            this.logger.error(`[비밀번호 변경 실패] 존재하지 않는 Member ID: ${memberId}`);
            throw new NotFoundException('존재하지 않는 회원입니다.');
        }

        // 2. 소셜/로컬 계정 비밀번호 추출
        const localSocial = member.socials?.find((s: any) => s.memberPassword);
        const currentHashedPassword = localSocial?.memberPassword;

        // 3. 비밀번호 해시 존재 여부 검증 (bcrypt 호출 전 방어 로직)
        if (!currentHashedPassword) {
            this.logger.warn(`[비밀번호 변경 실패] Member ID: ${memberId} - 비밀번호 정보 없음/소셜계정`);
            throw new BadRequestException(
            '소셜 로그인 계정이거나 저장된 비밀번호 정보가 없어 변경할 수 없습니다.',
            );
        }

        // 4. 현재 비밀번호 일치 여부 확인
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            currentHashedPassword,
        );
        if (!isPasswordValid) {
            this.logger.warn(`[비밀번호 변경 실패] Member ID: ${memberId} - 현재 비밀번호 불일치`);
            throw new BadRequestException('현재 비밀번호가 일치하지 않습니다.');
        }

        // 5. 새 비밀번호가 기존 비밀번호와 동일한지 확인
        const isSameAsOld = await bcrypt.compare(
            newPassword,
            currentHashedPassword,
        );
        if (isSameAsOld) {
            this.logger.warn(`[비밀번호 변경 실패] Member ID: ${memberId} - 기존 비밀번호와 동일`);
            throw new BadRequestException(
            '기존 비밀번호와 동일한 비밀번호로 변경할 수 없습니다.',
            );
        }

        // 6. 새 비밀번호 해싱 및 저장
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.memberRepository.updatePassword(memberId, hashedPassword);

        this.logger.log(`[비밀번호 변경 성공] Member ID: ${memberId}`);
        }
    }
