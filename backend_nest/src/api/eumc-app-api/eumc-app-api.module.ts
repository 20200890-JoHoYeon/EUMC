import { Module } from '@nestjs/common';
import { EumcAppApiService } from './eumc-app-api.service';
import { EumcAppApiController } from './eumc-app-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EumcPushEumcEntity } from '../../entities/eumc-push.eumc-entity';
import { EumcAppVersionEntity } from '../../entities/eumc-app-version.eumc-entity';
import { HttpModule } from '@nestjs/axios';
import { EumcRepoModule } from "../../repo/eumc-repo.module";
import { EumcPayEumcEntity } from "../../entities/eumc-pay.eumc-entity";
import { AlimtalkMgrEntity } from "../../entities/alimtalk-mgr.alimtalk-entity";

@Module({
  imports: [
    HttpModule,
    EumcRepoModule,
    TypeOrmModule.forFeature([AlimtalkMgrEntity], 'alimtalk'),
  ],
  providers: [EumcAppApiService],
  controllers: [EumcAppApiController],
  exports: [EumcAppApiService, TypeOrmModule],
})
export class EumcAppApiModule {}
