import { Module } from '@nestjs/common';
import { MemberModule } from './module/member/member.module';
import { CoreModule } from './module/core/core.module';
import { AuthModule } from './module/auth/auth.module';
import { PostModule } from './module/post/post.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { PostService } from './service/post/post.service';
import { FridgeModule } from './module/fridge/fridge.module';
import { FridgeController } from './controller/fridge/fridge.controller';
import { FridgeService } from './service/fridge/fridge.service';

@Module({
  imports: [
    CoreModule,
    MemberModule,
    AuthModule,
    PostModule,
    PrismaModule,
    FridgeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
