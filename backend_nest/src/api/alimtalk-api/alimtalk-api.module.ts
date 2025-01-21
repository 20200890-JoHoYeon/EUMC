import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CertApiService } from "../cert-api/cert-api.service";
import { CommonConfService } from "../../config/common-conf.service";
import { AlimtalkMgrEntity } from "../../entities/alimtalk-mgr.alimtalk-entity";
import { AlimtalkApiService } from "./alimtalk-api.service";
import { PatientApiModule } from "../patient-api/patient-api.module";
import { EumcAlimtalkEumcEntity } from "../../entities/eumc-alimtalk.eumc-entity";


@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    TypeOrmModule.forFeature([AlimtalkMgrEntity], 'alimtalk'),
    TypeOrmModule.forFeature([EumcAlimtalkEumcEntity], 'eumc_pay'),

    PatientApiModule,
  ],
  controllers: [],
  providers: [AlimtalkApiService, CommonConfService],
  exports: [ TypeOrmModule, AlimtalkApiService ],
})
export class AlimtalkApiModule {}
