import { Injectable, Logger } from '@nestjs/common';
import { CommonConfService } from '../../config/common-conf.service';
import { ReqPatientCallDto } from './dto/req-patient-call.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CommonCodeConst } from '../../const/common-code.const';
import { ReqCallWaitNumberDto } from '../ticket-api/dto/req-call-wait-number.dto';
import { RespOneSignalNotification } from './dto/resp-one-signal-notification.interface';

@Injectable()
export class OneSignalPushApiService {
  private readonly logger = new Logger(OneSignalPushApiService.name);

  constructor(private httpService: HttpService) {}

  /**
   * 환자 호출 - 발권서버로부터의 응답 메시지로 부터 호출됨
   * - /api/v1/ticket/callWaitingNumber 호출하여 티켓상태 갱신
   * - 환자 호출 PUSH (OneSignal RestAPI)
   *
   * type으로 구분하여 부서도 호출하는 로직이 있었던것 같은데, 삭제된듯
   * @param type > 호출: 'call',
   * @param player_id >  push key
   * @param parameters
   */
  async patientCallFromTicketServer(
    type: string,
    player_id: string,
    parameters: ReqCallWaitNumberDto,
  ) {
    this.logger.debug(`환자호출 OneSignal API START`);

    try {
      switch (type) {
        case 'CALL':
          {
            this.httpService
            .post(
              'http://localhost:4000/api/v1/ticket/callWaitingNumber',
              parameters,
            )
            .subscribe((callResp) => {
              if (callResp.status >= 200 && callResp.status < 400) {
                this.logger.debug(
                  `환자호출 OneSignal API 중 티켓상태 갱신을 위한 API 호출 응답 : ${JSON.stringify(
                    callResp.data,
                  )}`,
                );
              } else {
                this.logger.error(
                  `환자호출 OneSignal API 중 티켓상태 갱신을 위한 API 호출 실패 : ${JSON.stringify(
                    callResp.data,
                  )}`,
                );
              }
            });

            // PUSH 호출
            const callParam = new ReqPatientCallDto();
            callParam.include_player_ids.push(player_id); // push key
            if(parameters.desk != null && typeof(parameters.desk) != 'undefined') {
              callParam.contents = {
                en: `${parameters.desk}번 창구. 호출 하였습니다.`
              };
            }else{
              callParam.contents = {
                en: `${parameters.callNo}번 호출 하였습니다.`
              };
            }
            // json.get("DESK")+"번 창구. 호출 하였습니다."

            this.patientCall(callParam);
          }
          break;
        default: {
        }
      }
    } catch (e) {
      this.logger.error(`환자호출 OneSignal API ERR : ${e}`);
      throw e;
    }
  }

  /**
   * 환자 호출 PUSH 요청 (OneSignal RestAPI)
   * 참고 url https://documentation.onesignal.com/reference#create-notification
   */
  async patientCall(param: ReqPatientCallDto) {
    this.logger.debug(`환자 호출 PUSH 요청 OneSignal API START : ${JSON.stringify(param)}`);

    // let callResp;
    try {
      const result$ = await this.httpService.post(
        CommonCodeConst.ONE_SIGNAL_API_NOTIFICATION_URL,
        param,
        {
          headers: {
            // TODO: API키 필요한지 체크필요
            // Authorization: `Basic ONESIGNAL_REST_API_KEY`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      const callResp = await lastValueFrom(result$);

      if (callResp.status == 200) {
        // REQUEST SUCCESS
        this.logger.debug(`환자 호출 PUSH 요청 OneSignal API SUCCESS`);
        //if(callResp.data instanceof RespOneSignalNotification) {
        this.logger.debug(
          `환자 호출 PUSH 요청 OneSignal API Resp : ${JSON.stringify(
            callResp.data,
          )}`,
        );
        //}
      }
    } catch (e) {
      this.logger.error(`환자 호출 PUSH 요청 OneSignal API ERR : ${e}`);
      throw e;
    }
    // return callResp;
  }



}
