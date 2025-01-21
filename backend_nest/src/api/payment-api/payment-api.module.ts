import { Module } from '@nestjs/common';
import { PaymentApiService } from './payment-api.service';
import { PaymentApiController } from './payment-api.controller';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { EmrSoapApiModule } from "../emr-soap-api/emr-soap-api.module";
import { CommonConfService } from "../../config/common-conf.service";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { PatientApiModule } from "../patient-api/patient-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    EmrSoapApiModule,
    PatientApiModule,
  ],
  providers: [PaymentApiService, CommonConfService, KioskWebServiceApiService],
  controllers: [PaymentApiController],
  exports: [PaymentApiService]
})
export class PaymentApiModule {}
