import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { NumberTicketDto } from './dto/number-ticket.dto';
import { ResponseDto } from '../../common/dto/response.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { DeptArriveDto } from './dto/dept-arrive.dto';
import { TcpConnectionDto } from './dto/tcp-connection.dto';
import { ExceptionNotificationKioskDto } from './dto/exception-notification-kiosk';
import { PaymentDto } from './dto/payment.dto';
import { AlimtalkLogDto } from './dto/alimtalk-log.dto';

@Injectable()
export class LogApiService {
  private readonly logger = new Logger(LogApiService.name);

  private readonly BASE_CURELINK_API_DEV = "https://test-data-monitor.curelink.co.kr"
  private readonly BASE_CURELINK_API_PROD = "https://test-data-monitor.curelink.co.kr"
  private BASE_CURELINK_API = this.BASE_CURELINK_API_DEV;

  constructor(private httpService: HttpService) {}

  async reqLogNumberTicket(req: NumberTicketDto) {
    this.logger.debug('번호표 발권 로그를 요청');
    const resp = new ResponseDto();

    try {
      let callResp = null;
      const result$ = await this.httpService.post(`${this.BASE_CURELINK_API}/log/numberTicket`, req);
      callResp = await lastValueFrom(result$);
      resp.data = callResp.data;
      resp.resultCode = '0000';
    } catch (e) {
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return resp;
  }

  async reqLogDeptArrive(req: DeptArriveDto) {
    this.logger.debug('도착확인 로그를 요청');
    const resp = new ResponseDto();

    try {
      let callResp = null;
      const result$ = await this.httpService.post(`${this.BASE_CURELINK_API}/log/deptArrive`, req);
      callResp = await lastValueFrom(result$);
      resp.data = callResp.data;
      resp.resultCode = '0000';
    } catch (e) {
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return resp;
  }

  async reqLogTcpConnection(req: TcpConnectionDto) {
    this.logger.debug('TCP 서버 연결 상태 로그를 요청');
    const resp = new ResponseDto();

    try {
      let callResp = null;
      const result$ = await this.httpService.post(`${this.BASE_CURELINK_API}/log/tcp-connection`, req);
      callResp = await lastValueFrom(result$);
      resp.data = callResp.data;
      resp.resultCode = '0000';
    } catch (e) {
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return resp;
  }

  async reqLogExceptionNotificationKiosk(req: ExceptionNotificationKioskDto) {
    this.logger.debug('키오스크 장애 알림 로그를 요청');
    const resp = new ResponseDto();

    try {
      let callResp = null;
      const result$ = await this.httpService.post(
        `${this.BASE_CURELINK_API}/log/exception-notification-kiosk`,
        req,
      );
      callResp = await lastValueFrom(result$);
      resp.data = callResp.data;
      resp.resultCode = '0000';
    } catch (e) {
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return resp;
  }

  async reqLogPayment(req: PaymentDto) {
    this.logger.debug('키오스크 수납 결과 로그를 요청');
    const resp = new ResponseDto();

    try {
      let callResp = null;
      const result$ = await this.httpService.post(`${this.BASE_CURELINK_API}/log/payment`, req);
      callResp = await lastValueFrom(result$);
      resp.data = callResp.data;
      resp.resultCode = '0000';
    } catch (e) {
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return resp;
  }

  async reqLogAlimtalk(req: AlimtalkLogDto) {
    this.logger.debug('키오스크 수납 결과 로그를 요청');
    const resp = new ResponseDto();

    try {
      let callResp = null;
      const result$ = await this.httpService.post(`${this.BASE_CURELINK_API}/log/payment-alimtalk`, req);
      callResp = await lastValueFrom(result$);
      resp.data = callResp.data;
      resp.resultCode = '0000';
    } catch (e) {
      throw new HttpException(
        {
          message: '000 API 요청에러',
          error: e,
          code: '8000',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return resp;
  }
}
