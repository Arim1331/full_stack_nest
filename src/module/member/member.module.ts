import { forwardRef, Module } from '@nestjs/common';
import { MemberController } from 'src/controller/member/member.controller';
import { MemberRepository } from 'src/repository/member/member.repository';
import { MemberService } from 'src/service/member/member.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        forwardRef(() => AuthModule),
    ],
    controllers: [MemberController],
    providers: [MemberRepository, MemberService],
    exports: [MemberRepository, MemberService],
})
export class MemberModule {;}
