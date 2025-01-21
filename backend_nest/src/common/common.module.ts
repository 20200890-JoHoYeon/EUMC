import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";
import { HttpConfService } from "../config/http/http-conf.service";
import { TicketClientModule } from "../api/ticket-api/tcp/ticket-client.module";
import { EumcAppApiModule } from "../api/eumc-app-api/eumc-app-api.module";
import { OneSignalPushApiModule } from "../api/one-signal-push-api/one-signal-push-api.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../entities/eumc-waiting-number.eumc-entity";
import { TicketApiController } from "../api/ticket-api/ticket-api.controller";
import { TicketApiService } from "../api/ticket-api/ticket-api.service";
import { MailSenderService } from "./services/mail-sender.service";
import { PdfGenerateService } from "./services/pdf-generate.service";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
  ],
  controllers: [],
  providers: [MailSenderService, PdfGenerateService],
  exports: [],
})
export class CommonModule {

}
