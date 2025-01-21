import { Module } from '@nestjs/common';
import { OneSignalPushApiService } from './one-signal-push-api.service';
import { HttpModule } from '@nestjs/axios';
import { OneSignalPushApiController } from "./one-signal-push-api.controller";

@Module({
  imports: [HttpModule],
  controllers:[OneSignalPushApiController],
  providers: [OneSignalPushApiService],
  exports: [OneSignalPushApiService],
})
export class OneSignalPushApiModule {}
