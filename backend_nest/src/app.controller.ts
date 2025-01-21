import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post
} from "@nestjs/common";
import { AppService } from './app.service';
import * as moment from 'moment-timezone';
import { ResponseDto } from './common/dto/response.dto';
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReqCallWaitNumberDto } from "./api/ticket-api/dto/req-call-wait-number.dto";
import { ApiResult } from "./const/api-result.const";
import { PatientApiService } from "./api/patient-api/patient-api.service";
import { AlimtalkApiService } from "./api/alimtalk-api/alimtalk-api.service";
import { CommonCodeConst, RCP_TYPE } from "./const/common-code.const";
import { PaymentApiService } from "./api/payment-api/payment-api.service";

/**
 * AppController는 공통 포인트만 들어가도록
 * Health Check, Version Check, etc...
 */

@Controller()
@ApiTags('시스템 API')
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService,
              private readonly patientApiService: PatientApiService,
              private readonly alimtalkApiService: AlimtalkApiService,
              private readonly paymentApiService: PaymentApiService
              ) {}

  @Get('/')
  main(): string {
    // throw new ForbiddenException();

    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  @Get('/health')
  healthCheck(): string {
    // throw new ForbiddenException();

    return moment().format('YYYY-MM-DD HH:mm:ss');
  }

  @Get('/serverCheck')
  serverCheck(): ResponseDto {
    return new ResponseDto();
  }





  @Post('/sendPaymentKakao')
  @ApiOperation({
    summary:
      '카카오 수납 알림톡 전송',
  })
  @ApiBody({
    description: '카카오 수납 알림톡',
    required: true,
    schema: {
      properties: {
        pact_id: { type: 'string', description: '', example: 5 },
        his_hsp_tp_cd: { type: 'string', description: '병원코드', example: '01' },
        pt_no: { type: 'string', description: '환자번호', example: '96476189' },
        pt_name: { type: 'string', description: '환자명', example: '홍길동' },
        meddate: { type: 'string', description: '진료일', example: '2022-03-01' },
        dept_cd: { type: 'string', description: '부서코드', example: 'FM' },
        dept_name: { type: 'string', description: '부서이름', example: '가정의학과' },
        rcp_type: { type: 'string', description: '수납타입', example: '1' },
        phone_no: { type: 'string', description: '환자휴대폰번호', example: '' },
        amount: { type: 'string', description: '환자번호', example: '', default: "0" },
      },
    },
  })
  async sendPaymentKakao(@Body() body: ReqSendAlimtalk) {
    const resp = new ResponseDto();
    try {

      // 서울 병원 VIP 병동 알림톡 발송 2020.12.15 추가
      if(body.his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL && body.dept_cd == '76') {
        this.logger.debug(`서울 병원 VIP 병동 알림톡 발송`)
        const db_resp = this.alimtalkApiService.sendVipKakaoTalk(body.his_hsp_tp_cd, body.pt_name, body.phone_no);
        if(db_resp != null) {
          return { result_cd: 200, result_msg: '알림톡 전송 요청 성공' };
        }
      }

      const patient_info = await this.patientApiService.getPatientInfo(body.pt_no);
      if(patient_info != null) {
        // 외래 진료비
        if(body.rcp_type == RCP_TYPE.OUT_PATIENT) {
          this.logger.debug(`외래 진료비 알림톡 발송 요청 : ${JSON.stringify(body)}`);
          try{
            // 수납내역 PaymentODetail
            const payment_list = await this.paymentApiService.getPaymentDetailListTypeO(body.his_hsp_tp_cd, patient_info);
            for (const el of payment_list) {
              if(el.OUT_MEDDEPT1 == body.dept_cd) {
                  if(typeof(el.OUT_RCPAMT1) != 'undefined' && el.OUT_RCPAMT1 != null && Number(el.OUT_RCPAMT1) > 0){
                    let dummy = body.pt_no + "|" + body.meddate.replace("-", "")
                      + "|" + body.dept_cd + "|" + el.OUT_MEDR_SID + "|" + body.rcp_type;
                    try{
                      let amount = el.OUT_RCPAMT1;
                      const resp_save_alimtalk = this.alimtalkApiService.saveAlimtalk(
                        body.his_hsp_tp_cd,
                        body.pt_no,
                        body.pt_name,
                        body.meddate,
                        body.dept_cd,
                        body.dept_name,
                        body.rcp_type,
                        body.phone_no,
                        amount,
                        dummy
                      );
                      this.logger.log(`SAVE ALIMTALK DB 성공 : ${resp_save_alimtalk}`);
                    }catch (e) {
                      this.logger.error(`SAVE ALIMTALK DB FAIL : ${e}`);
                      throw e;
                    }
                  }else{
                    this.logger.log(`수납금액 없음`);
                  }
              } // END OF IF
            }// END OF FOR
            resp.setSuccess('OK');
          }catch (e) {
            this.logger.error(`외래 진료비 알림톡 발송 요청 실패 : ${JSON.stringify(patient_info)} > ${e}`);
            throw e;
          }
        }
        // 입퇴원 중간비
        else if(body.rcp_type == RCP_TYPE.INOUT_MID) {
          this.logger.debug(`입원중간비 알림톡 발송 요청 : ${JSON.stringify(body)}`)

          const payment_list = await this.paymentApiService.getPaymentDetailListTypeI(body.his_hsp_tp_cd, patient_info, 'B');
          for (const el of payment_list) {
            try{
              let amount = el.OUT_RCPAMT;
              const resp_save_alimtalk = this.alimtalkApiService.saveAlimtalk(
                body.his_hsp_tp_cd,
                body.pt_no,
                body.pt_name,
                body.meddate,
                body.dept_cd,
                body.dept_name,
                body.rcp_type,
                body.phone_no,
                amount,
                ''
              );
              this.logger.log(`SAVE ALIMTALK DB 성공 : ${resp_save_alimtalk}`);
            }catch (e) {
              this.logger.error(`SAVE ALIMTALK DB FAIL : ${e}`);
              throw e;
            }
          }
          resp.setSuccess('OK');
        }
        else {
          this.logger.debug(`퇴원비 알림톡 발송 요청 : ${JSON.stringify(body)}`)

          const payment_list = await this.paymentApiService.getPaymentDetailListTypeI(body.his_hsp_tp_cd, patient_info, 'S');
          for (const el of payment_list) {
            try{
              let amount = el.OUT_RCPAMT;
              const resp_save_alimtalk = this.alimtalkApiService.saveAlimtalk(
                body.his_hsp_tp_cd,
                body.pt_no,
                body.pt_name,
                body.meddate,
                body.dept_cd,
                body.dept_name,
                body.rcp_type,
                body.phone_no,
                amount,
                ''
              );
              this.logger.log(`SAVE ALIMTALK DB 성공 : ${resp_save_alimtalk}`);
            }catch (e) {
              this.logger.error(`SAVE ALIMTALK DB FAIL : ${e}`);
              throw e;
            }
          }
          resp.setSuccess('OK');
        }
      }
    } catch (e) {
      this.logger.error(`카카오 수납 알림톡 전송 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }











}
