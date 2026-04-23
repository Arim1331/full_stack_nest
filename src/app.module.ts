import { Module } from '@nestjs/common';
import { MemberModule } from './module/member/member.module';
import { CoreModule } from './module/core/core.module';
import { AuthModule } from './module/auth/auth.module';
import { PostModule } from './module/post/post.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { FridgeModule } from './module/fridge/fridge.module';
import { OpenaiModule } from './module/openai/openai.module';
import { ImageService } from './service/image/image.service';
import { PostlikeModule } from './module/postlike/postlike.module';
import { AisavedrecipeModule } from './module/aisavedrecipe/aisavedrecipe.module';
import { CommentModule } from './module/comment/comment.module';

@Module({
  imports: [
    CoreModule,
    MemberModule,
    AuthModule,
    PostModule,
    PrismaModule,
    FridgeModule,
    OpenaiModule,
    PostlikeModule,
    AisavedrecipeModule,
    CommentModule
  ],
  controllers: [],
  providers: [ImageService,  ],
})
export class AppModule {}
