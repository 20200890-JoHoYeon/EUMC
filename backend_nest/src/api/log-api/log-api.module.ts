import { Module } from '@nestjs/common';
import { LogApiController } from './log-api.controller';
import { LogApiService } from './log-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [LogApiController],
  providers: [LogApiService],
})
export class LogApiModule {}
