import { Module } from '@nestjs/common';
import { PrescriptionApiController } from './prescription-api.controller';
import { PrescriptionApiService } from './prescription-api.service';
import { CommonConfService } from "../../config/common-conf.service";
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { EmrSoapApiModule } from "../emr-soap-api/emr-soap-api.module";
import { CertApiModule } from "../cert-api/cert-api.module";
import { PaymentApiModule } from "../payment-api/payment-api.module";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    EmrSoapApiModule,
    // CertApiModule,
    // PaymentApiModule,
  ],
  controllers: [PrescriptionApiController],
  providers: [PrescriptionApiService, CommonConfService, KioskWebServiceApiService],
  exports: [PrescriptionApiService],
})
export class PrescriptionApiModule {}
