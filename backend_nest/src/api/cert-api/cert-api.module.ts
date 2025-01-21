import { Module } from '@nestjs/common';
import { CertApiController } from './cert-api.controller';
import { CertApiService } from './cert-api.service';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { EmrSoapApiModule } from "../emr-soap-api/emr-soap-api.module";
import { MailSenderService } from "../../common/services/mail-sender.service";
import { PdfGenerateService } from "../../common/services/pdf-generate.service";
import { KioskWebServiceApiService } from "./kiosk-web-service-api.service";
import { CommonConfService } from "../../config/common-conf.service";
import { InsuranceApiController } from "./insurance-api.controller";
import { PaymentApiService } from "../payment-api/payment-api.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EumcRsvNotMeEumcEntity } from "../../entities/eumc-rsv-not-me.eumc-entity";
import { EumcCertEumcEntity } from "../../entities/eumc-cert.eumc-entity";
import { PatientApiService } from "../patient-api/patient-api.service";
import { CrytoUtil } from "../../utils/cryto.util";
import { ImgUtil } from "../../utils/img.util";
import { PatientApiModule } from "../patient-api/patient-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    EmrSoapApiModule,
    PatientApiModule,
    TypeOrmModule.forFeature([EumcCertEumcEntity], 'eumc_pay'),
  ],
  controllers: [CertApiController, InsuranceApiController],
  providers: [CertApiService, CommonConfService, KioskWebServiceApiService, PatientApiService, PaymentApiService, MailSenderService, PdfGenerateService, CrytoUtil, ImgUtil, PdfGenerateService],
  exports: [TypeOrmModule, CertApiService],
})
export class CertApiModule {}
