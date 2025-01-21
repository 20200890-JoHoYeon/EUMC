import { Module } from '@nestjs/common';
import { PatientApiController } from './patient-api.controller';
import { PatientApiService } from './patient-api.service';
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { CommonConfService } from "../../config/common-conf.service";
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { EmrSoapApiModule } from "../emr-soap-api/emr-soap-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    EmrSoapApiModule,
  ],
  controllers: [PatientApiController],
  providers: [PatientApiService, CommonConfService, KioskWebServiceApiService],
  exports: [PatientApiService]
})
export class PatientApiModule {}
