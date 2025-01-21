import { Module } from '@nestjs/common';
import { MedDeptApiController } from './med-dept-api.controller';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { MedDeptApiService } from "./med-dept-api.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../../entities/eumc-waiting-number.eumc-entity";
import { ReservationApiModule } from "../reservation-api/reservation-api.module";
import { EmrSoapApiModule } from "../emr-soap-api/emr-soap-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    TypeOrmModule.forFeature([EumcWaitingNumberEumcEntity], 'eumc_pay'),
    ReservationApiModule,
    EmrSoapApiModule
  ],
  controllers: [MedDeptApiController],
  providers: [MedDeptApiService],
  exports: [MedDeptApiService]
})
export class MedDeptApiModule {}
