import { Module } from '@nestjs/common';
import { KakaoPayApiController } from './kakao-pay-api.controller';
import { KakaoPayApiService } from './kakao-pay-api.service';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EumcPayEumcEntity } from "../../entities/eumc-pay.eumc-entity";
import { EumcKakaopayEumcEntity } from "../../entities/eumc-kakaopay.eumc-entity";
import { PaymentApiModule } from "../payment-api/payment-api.module";
import { CertApiModule } from "../cert-api/cert-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    TypeOrmModule.forFeature([EumcKakaopayEumcEntity], 'eumc_pay'),
    PaymentApiModule,
    CertApiModule
  ],
  controllers: [KakaoPayApiController],
  providers: [KakaoPayApiService]
})
export class KakaoPayApiModule {}
