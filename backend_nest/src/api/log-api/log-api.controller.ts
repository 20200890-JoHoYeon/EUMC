import { Body, Controller, Logger, Post } from "@nestjs/common";
import { NumberTicketDto } from './dto/number-ticket.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LogApiService } from './log-api.service';
import { ResponseDto } from '../../common/dto/response.dto';

@Controller('api/v1/log')
@ApiTags('로그 API')
export class LogApiController {
  private readonly logger = new Logger(LogApiController.name);

  constructor(private readonly mobileApiService: LogApiService) {}

  @Post('/numberTicket')
  @ApiOperation({ summary: '번호표 발권 로그' })
  async numberTicket(@Body() body: NumberTicketDto) {
    return await this.mobileApiService.reqLogNumberTicket(body);
  }

  @Post('/deptArrive')
  @ApiOperation({ summary: '도착확인 로그' })
  async deptArrive() {
    return await this.mobileApiService.reqLogDeptArrive(null);
  }

  @Post('/tcp-connection')
  @ApiOperation({ summary: 'TCP 서버 연결 상태 로그' })
  async tcpConnection() {
    return await this.mobileApiService.reqLogTcpConnection(null);
  }


  @Post('/exception-notification-kiosk')
  @ApiOperation({ summary: '키오스크 장애 알림 로그' })
  async exceptionNotificationKiosk() {
    return await this.mobileApiService.reqLogExceptionNotificationKiosk(null);
  }


  @Post('/payment')
  @ApiOperation({ summary: '수납 정보 로그' })
  async payment() {
    return await this.mobileApiService.reqLogPayment(null);
  }




  @Post('/payment-alimtalk')
  @ApiOperation({ summary: '알림톡 로그 - 사용하는지 체크필요' })
  async alimtalkLog() {
    return await this.mobileApiService.reqLogAlimtalk(null);
  }




}
