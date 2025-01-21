import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EumcAppVersionEntity } from "../entities/eumc-app-version.eumc-entity";
import { EumcAppVersionRepoService } from "./eumc-app-version-repo.service";
import { HttpConfService } from "../config/http/http-conf.service";
import { EumcPushRepoService } from "./eumc-push-repo.service";
import { EumcPushEumcEntity } from "../entities/eumc-push.eumc-entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([EumcAppVersionEntity, EumcPushEumcEntity], 'eumc_pay'),
  ],
  controllers: [],
  providers: [EumcAppVersionRepoService, EumcPushRepoService],
  exports: [TypeOrmModule, EumcAppVersionRepoService, EumcPushRepoService],
})
export class EumcRepoModule {}
