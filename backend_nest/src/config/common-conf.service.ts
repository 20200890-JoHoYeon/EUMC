import { Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TicketServerTcp } from '../dto/ticket-server-tcp/kiosk-server-tcp.interface';
import { CommonCodeConst } from '../const/common-code.const';

@Injectable()
export class CommonConfService {
  IS_EMR_TEST_DATA: boolean = false;
  TICKET_SERVER_TCP_INFO;

  constructor(private configService: ConfigService) {
    this.TICKET_SERVER_TCP_INFO = JSON.parse(configService.get('KIOSK_TCP'));
    this.IS_EMR_TEST_DATA = ('true' == configService.get('IS_EMR_TEST_DATA'));
  }

  getActiveTickerServerInfo(): TicketServerTcp {
    const idx = this.configService.get('SELECTED_TICKET_SERVER_IDX') as number;
    const name = this.configService.get('SELECTED_TICKET_SERVER_NAME');
    if (name == 'SEOUL') {
      return this.getTcpInfoSeoul()[idx];
    } else {
      return this.getTcpInfoMockdong()[idx];
    }
  }

  getActiveTickerServerInfoWithIdx(idx: number): TicketServerTcp {
    const name = this.configService.get('SELECTED_TICKET_SERVER_NAME');
    if (name == CommonCodeConst.HOSPITAL_NAME_SEOUL) {
      return this.getTcpInfoSeoul()[idx];
    } else if (name == CommonCodeConst.HOSPITAL_NAME_MOCKDONG) {
      return this.getTcpInfoMockdong()[idx];
    } else {
      return this.getTcpInfoMockdong()[idx];
    }
  }

  getTcpInfoSeoul(): Array<TicketServerTcp> {
    return this.TICKET_SERVER_TCP_INFO.SEOUL;
  }

  getTcpInfoMockdong(): Array<TicketServerTcp> {
    return this.TICKET_SERVER_TCP_INFO.MOCKDONG;
  }
}
