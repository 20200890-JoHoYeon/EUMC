import { forwardRef, Module } from "@nestjs/common";
import { TicketApiController } from './ticket-api.controller';
import { TicketApiService } from './ticket-api.service';
import { HttpModule } from '@nestjs/axios';
import { TicketClientModule } from './tcp/ticket-client.module';
import { EumcWaitingNumberEumcEntity } from '../../entities/eumc-waiting-number.eumc-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpConfService } from '../../config/http/http-conf.service';
import { OneSignalPushApiModule } from '../one-signal-push-api/one-signal-push-api.module';
import { EumcAppApiModule } from "../eumc-app-api/eumc-app-api.module";

@Module({
  imports: [
    HttpModule.registerAsync({
      useClass: HttpConfService,
    }),
    EumcAppApiModule,
    OneSignalPushApiModule,
    forwardRef(() =>TicketClientModule),
    TypeOrmModule.forFeature([EumcWaitingNumberEumcEntity], 'eumc_pay'),
  ],
  controllers: [TicketApiController],
  providers: [TicketApiService],
  exports: [TypeOrmModule, TicketApiService],
})
export class TicketApiModule {}
