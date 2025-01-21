import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonConfService } from './common-conf.service';
import { LogApiService } from '../api/log-api/log-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.dev', '.env.prod'], // 다음파일이 있으면 다음파일로 진행됨
    }),
  ],
  providers: [CommonConfService],
})
export class CommonConfModule {}
