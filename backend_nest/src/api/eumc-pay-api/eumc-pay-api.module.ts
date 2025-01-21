import { Module } from '@nestjs/common';
import { EumcPayApiController } from './eumc-pay-api.controller';
import { EumcPayApiService } from './eumc-pay-api.service';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../../config/http/http-conf.service";
import { TicketClientModule } from "../ticket-api/tcp/ticket-client.module";
import { EumcAppApiModule } from "../eumc-app-api/eumc-app-api.module";
import { OneSignalPushApiModule } from "../one-signal-push-api/one-signal-push-api.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../../entities/eumc-waiting-number.eumc-entity";
import { CrytoUtil } from "../../utils/cryto.util";
import { EumcPayEumcEntity } from "../../entities/eumc-pay.eumc-entity";
import { EumcKakaopayEumcEntity } from "../../entities/eumc-kakaopay.eumc-entity";
import { PaymentApiModule } from "../payment-api/payment-api.module";
import { CertApiModule } from "../cert-api/cert-api.module";


@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    TypeOrmModule.forFeature([EumcPayEumcEntity], 'eumc_pay'),
    TypeOrmModule.forFeature([EumcKakaopayEumcEntity], 'eumc_pay'),
    PaymentApiModule,
    CertApiModule,
  ],
  controllers: [EumcPayApiController],
  providers: [EumcPayApiService, CrytoUtil],
  exports: [TypeOrmModule],
})
export class EumcPayApiModule {}
