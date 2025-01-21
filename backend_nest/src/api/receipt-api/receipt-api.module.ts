import { Module } from '@nestjs/common';
import { ReceiptApiController } from './receipt-api.controller';
import { ReceiptApiService } from './receipt-api.service';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { EmrSoapApiModule } from "../emr-soap-api/emr-soap-api.module";
import { CommonConfService } from "../../config/common-conf.service";
import { CertApiModule } from "../cert-api/cert-api.module";
import { PaymentApiModule } from "../payment-api/payment-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    EmrSoapApiModule,
    CertApiModule,
    PaymentApiModule,
  ],
  controllers: [ReceiptApiController],
  providers: [ReceiptApiService, CommonConfService]
})
export class ReceiptApiModule {}
