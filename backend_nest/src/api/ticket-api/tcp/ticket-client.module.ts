import { forwardRef, Module } from "@nestjs/common";
import { TicketClientService } from './ticket-client.service';
import { CommonConfService } from '../../../config/common-conf.service';
import { OneSignalPushApiModule } from "../../one-signal-push-api/one-signal-push-api.module";
import { TicketApiModule } from "../ticket-api.module";

@Module({
  imports: [OneSignalPushApiModule, forwardRef(() =>TicketApiModule)],
  providers: [CommonConfService, TicketClientService],
  exports: [TicketClientService],
})
export class TicketClientModule {}
