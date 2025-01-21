import {
  Body,
  Controller, Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Query,
  Session,
  Render
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ConfigService } from '@nestjs/config';
import { EumcPayApiService } from "./eumc-pay-api.service";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { ReqRegTrade } from "./dto/req-reg-trade.interface";
import { HttpService } from "@nestjs/axios";
import { ReqKcpPayment } from "./dto/req-kcp-payment.interface";

@Controller('api/v1/eumc-pay')
@ApiTags('이화의료원 페이 API')
export class EumcPayApiController {
  private readonly logger = new Logger(EumcPayApiController.name);

  constructor( private httpService: HttpService, private eumcPayApiService: EumcPayApiService,private configService: ConfigService) {

  }



  @Post('/auth_hash')
  @ApiOperation({ summary: 'KCP본인인증-해시' })
  // @ApiBody({
  //   description: '요청값',
  //   required: true,
  //   type: ReqRegTrade,
  // })
  async authHash(@Body() body: any) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP본인인증 해시 START`);

      const result = await this.eumcPayApiService.authHash(body);
      resp.setSuccess(result);

      return resp;
    } catch (e) {
      this.logger.error(`KCP인증 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    // return resp;
  }





  @Render('view_kcp_auth')
  @Post('/view_kcp_auth')
  @ApiOperation({ summary: 'KCP본인인증-해시' })
  async reqAuthCert(@Body() body: any, @Session() session: Record<string, any>) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP본인인증 요청 START : ${JSON.stringify(body)}`);
      body.site_cd = 'A8EI7';
      body.ordr_idxx = body.param_opt_1;
      body.up_hash = body.param_opt_2;

      session.kcp = {
        ordr_idxx: body.ordr_idxx,
        up_hash: body.up_hash,
      }

      return {
        sbParam: JSON.stringify(body),
      };
    } catch (e) {
      this.logger.error(`KCP본인인증 요청 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    // return resp;
  }

  // @Render('req_kcp_auth')
  // @Post('/kcp_cert_req')
  // @ApiOperation({ summary: 'KCP본인인증-해시' })
  // async kcp_cert_req(@Body() body: any) {
  //   const resp = new ResponseDto();
  //   try {
  //     this.logger.debug(`KCP본인인증 요청 START : ${JSON.stringify(body)}`);
  //
  //     body.site_cd = 'A8EI7';
  //     body.up_hash = body.param_opt_2;
  //     body.ordr_idxx = body.param_opt_1;
  //
  //     return {
  //       sbParam: JSON.stringify(body),
  //     };
  //   } catch (e) {
  //     this.logger.error(`KCP본인인증 요청 ERR : ${e}`);
  //     resp.setError(ApiResult.UNKNOWN_ERROR);
  //     throw new InternalServerErrorException(resp, {
  //       cause: e,
  //       description: resp.resultMsg,
  //     });
  //   }
  //   // return resp;
  // }


  // @Render('view_kcp_auth')
  // @Post('/kcp_cert_res')
  // @ApiOperation({ summary: 'KCP본인인증-해시' })
  // async kcp_cert_res(@Body() body: any) {
  //   const resp = new ResponseDto();
  //   try {
  //     this.logger.debug(`KCP본인인증 응답 START : ${JSON.stringify(body)}`);
  //     body.site_cd = 'A8EI7';
  //
  //     return {
  //       sbParam: JSON.stringify(body),
  //     }
  //   } catch (e) {
  //     this.logger.error(`KCP본인인증 응답 ERR : ${e}`);
  //     resp.setError(ApiResult.UNKNOWN_ERROR);
  //     throw new InternalServerErrorException(resp, {
  //       cause: e,
  //       description: resp.resultMsg,
  //     });
  //   }
  //   // return resp;
  // }

  @Render('callback_kcp_auth')
  @Post('/kcp_cert_res2')
  @ApiOperation({ summary: 'KCP본인인증-해시' })
  async kcp_cert_res2(@Body() body: any, @Session() session: Record<string, any>) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP본인인증 응답2 START : ${JSON.stringify(body)}`);
      this.logger.debug(`KCP본인인증 응답2 SESSION : ${JSON.stringify(session)}`);

      const result = await this.eumcPayApiService.authCertRes(body);
      resp.setSuccess(result);

      this.logger.debug(`KCP본인인증 응답2 RES : ${JSON.stringify(result)}`);
      return resp;
    } catch (e) {
      this.logger.error(`KCP본인인증 응답2 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    // return resp;
  }

  @Post('/reg-trade')
  @ApiOperation({ summary: 'KCP거래등록' })
  @ApiBody({
    description: '요청값',
    required: true,
    type: ReqRegTrade,
  })
  async regKcpTrade(@Body() body: ReqRegTrade) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP거래등록 START`);
      body.Ret_URL = '/api/v1/eumc-pay/callback_kcp_trade';
      // body.site_cd = 'A52Q7';
      body.good_mny = '100';
      body.good_name = 'TEST_PRODUCT';
      body.pay_method = 'AUTH';
      /***
       * ordr_idxx: TEST202303221679442296345
       * good_name: 운동화
       * good_mny: 1004
       * buyr_name: 홍길동
       * buyr_tel2: 010-0000-0000
       * buyr_mail: test@test.co.kr
       * kcp_group_id: A52Q71000489
       * req_tx: pay
       * shop_name: TEST SITE
       * site_cd: A52Q7
       * currency: 410
       * escw_used: N
       * pay_method: AUTH
       * ActionResult: batch
       * Ret_URL: http://.../mobile_request/order_mobile
       * tablet_size: 1.0
       * approval_key: k/Che+IOTaHYK33mhgeVNAcHyKIPdQ/iE35VBPEo1cQ=
       * traceNo: A52Q7LFIWKZTPUKQ
       * PayUrl: https://testsmpay.kcp.co.kr/pay/mobileGW.kcp
       */

      const result = await this.eumcPayApiService.regKcpTrade(body);
      return result;
    } catch (e) {
      this.logger.error(`KCP거래등록 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    // return resp;
  }


  @Post('/reg-trade-normal')
  @ApiOperation({ summary: 'KCP거래등록' })
  @ApiBody({
    description: '요청값',
    required: true,
    type: ReqRegTrade,
  })
  async regKcpTradeNormal(@Body() body: ReqRegTrade) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP거래등록 START`);
      body.Ret_URL = '/api/v1/eumc-pay/callback_kcp_normal';
      // body.site_cd = 'A52Q7';
      // body.good_mny = '100';
      // body.good_name = 'TEST_PRODUCT';
      body.pay_method = 'CARD';
      /***
       * ordr_idxx: TEST202303221679442296345
       * good_name: 운동화
       * good_mny: 1004
       * buyr_name: 홍길동
       * buyr_tel2: 010-0000-0000
       * buyr_mail: test@test.co.kr
       * kcp_group_id: A52Q71000489
       * req_tx: pay
       * shop_name: TEST SITE
       * site_cd: A52Q7
       * currency: 410
       * escw_used: N
       * pay_method: AUTH
       * ActionResult: batch
       * Ret_URL: http://.../mobile_request/order_mobile
       * tablet_size: 1.0
       * approval_key: k/Che+IOTaHYK33mhgeVNAcHyKIPdQ/iE35VBPEo1cQ=
       * traceNo: A52Q7LFIWKZTPUKQ
       * PayUrl: https://testsmpay.kcp.co.kr/pay/mobileGW.kcp
       */

      const result = await this.eumcPayApiService.regKcpTrade(body);
      return result;
    } catch (e) {
      this.logger.error(`KCP거래등록 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    // return resp;
  }

  @Render('callback_kcp_batch')
  @Post('/callback_kcp_batch')
  @ApiOperation({ summary: 'KCP 배치키 요청' })
  async reqKcpBatch_callback(@Body() body: any) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP 배치키 요청 START : ${JSON.stringify(body)}`)

      /**
       * KCP 배치키 요청 START : {
       * "tran_cd":"00300001",
       * "kvp_card_code":"",
       * "enc_data":"1nYYE9MGyo7E-NIbZnRuaJuIuyL0lQf4RSMD9Om9M0.G1DH33vNXALzkdZtugPO3noESMAMsBHSs2SN98cEXcwJXYZhP2.PvhMMU-638PS4M3R3Cwn1I2xXlNmKFyAwU5Ej3q1xiVrdCqQ7rlJdRPUuLUGK04l84B0HduntiCHuJwRPoapZORTDgFwn7nDaZNlPC1Q2rVCzzzNEs6Hrs5zjSn1e-i8p0yLJD9qdZMFukFY-AG0o9txCi-kCa84dU7hPb6uaak-KuPsNVFR7tlu4mw7DQxGzAI9ZHdIx8jOuAGZnCJFh8dra32Q8jha1Ze.Gu.wzGP.vrQsZDn5Ml-ssqA4CNbvUdFF64E7l6gFJdkWMZ37QbgDhQqQKOlOw4zC-yePOUSvNpfbDnWuIH1Dohg-hovszeO2Z5u0QNkya3BiEA7kSmK-ERnr5JW-RVRyZxdP2Wwr7a0M3LdlYJgzHYyrlQ903D9Md32n8jwS9btXuTSctOAJJBzYh9HWOc7OWd8XCBWqKVCrgwx4LMOZ3CnmNdex7NY9s-JzLLGnDf.mal1kQJmbW4qcfUVQWOeN45UGZiNb5RE9BsCkLl4pmQpJubSVNWR8xpl-zcZo6wZwyuaPXT4n4mkwweBOfATQVCbgO1an2OBVC5fecuO.pDMV1FiyfQgnekXf1BfqP2R3mKbHDeTiRi2qfv4Hf.5OJYSxsEWdApVZdlftMhoYmhCc8FcB8p5jWUAro7LE1Vf4X3Mej7KMdYbynw5GHUcO42nagahe0OMqkMwiT.a0Mmx7C9MumjNUVL0lvEaCOoAYyZwQhdh9LnlQ9TP7H.n",
       * "enc_info":"2nc.0blULUD02q56qAulN708rY3LcaefipKvmRbo5q6F9ZkiJPvOnc8lIlrV27znlC9esI683SeclEnZOV8h.6TnicLaN7NNjQA0VXkFe8TQtuLppf.VEjB8nEn4MVvHXAJ7DKvvbLLcRevGoN9wKXvgSNCzvm7trv9PpBhSrLBNtlYNR0RIaAsO9lkCG66JMeN4WtzQ14n__",
       * "card_mask_no":"",
       * "kcp_group_id":"A52Q71000489",
       * "escw_used":"N",
       * "req_tx":"pay",
       * "rtn_key_info_yn":"",
       * "trace_no":"A52Q7452DCE64RGH",
       * "buyr_tel2":"010-1234-1234",
       * "buyr_mail":"test@test.com",
       * "buyr_tel1":"",
       * "lang_flag":"",
       * "param_opt_1":"",
       * "param_opt_3":"",
       * "param_opt_2":"",
       * "ally_type":"",
       * "buyr_name":"EUMC",
       * "confirm_type":"",
       * "good_name":"TEST_PRODUCT",
       * "deli_term":"",
       * "rcvr_add2":"",
       * "rcvr_add1":"",
       * "rcvr_zipx":"",
       * "bask_cntx":"",
       * "Ret_URL_Method_Type":"",
       * "rcvr_mail":"",
       * "pay_method":"AUTH",
       * "rcvr_tel1":"",
       * "rcvr_tel2":"",
       * "site_cd":"A52Q7",
       * "good_mny":"100",
       * "ordr_idxx":"KLDJFKLDSJFLKDSJFL3244",
       * "encoding_trans":"",
       * "rcvr_name":"",
       * "pay_mod":"",
       * "good_info":"",
       * "use_pay_method":"BATCH",
       * "smart_useyn":"",
       * "Ret_URL":"https://test-pay.eumc.ac.kr/api/v1/eumc-pay/callback_kcp_batch",
       * "res_cd":"0000",
       * "res_msg":"%C1%A4%BB%F3%C3%B3%B8%AE",
       * "cert_no":"23345000933355",
       * "dn_hash":"94AFF5406D7ABC48030B7765E355CF84F95B454C",
       * "enc_cert_data":"3B42A231E5A4172AED360E79A2BD4433F0B129926F328F16EE77F6FE34784BC8F27DB52905EE183A9902E2028EEE6998A48FF407802C92C92338A5B1719AF8B6E43CB7AEA1605C4EF07464C29D0041977702C2FC6A242C02A6A3CFA8E1C9C8D17B4396B7880059E5FCA5411A8B261DEB4E4F4535101D396581F716582429C9CEE2453521541637EB04D44C11C49B3052211F02298CB5606035CF6AA1051DE9F70271B1FDFBBD4D00E5737B107C124B77EE185889400C35EE62937248A2479331A9AADC76B15F475658B172DD5079C1CD507F90CC63312AD089D2E095CEEB3D4875501D6613B3ECF22099DAB3C8E40A43178F5678408D54F7BD9644C18F5F4FDB3864132FFCDCBE50C14CF364244FE078"
       * }
       */


      const result = await this.eumcPayApiService.reqKcpBatch(body);


      // TODO: 여기서 SSR으로 페이지 서비스
      // 모바일의 웹뷰페이지 닫고
      resp.setSuccess(result, "카드 정보 등록이 완료 되었습니다.");
      return resp;
      /**
       *  {"res_msg":"정상처리",
       *  "card_cd":"CCDI",
       *  "card_bin_type_02":"0",
       *  "card_bank_cd":"0321",
       *  "batch_key":"2304051168518034",
       *  "card_name":"현대카드",
       *  "van_tx_id":"",
       *  "card_bin_type_01":"0",
       *  "res_cd":"0000",
       *  "join_cd":""}
       */
    } catch (e) {
      this.logger.error(`KCP 배치키 요청 ERR : ${e}`);
      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e, e);
      return resp;
      // throw new InternalServerErrorException(resp, {
      //   cause: e,
      //   description: resp.resultMsg,
      // });


    }

  }



  @Render('callback_kcp_normal')
  @Post('/callback_kcp_normal')
  @ApiOperation({ summary: 'KCP 노멀 결제 요청 콜백' })
  async reqKcpNormal_callback(@Body() body: any) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP 결제 콜백 요청 START : ${JSON.stringify(body)}`)
      const result = await this.eumcPayApiService.reqKcpNormal(body);


      // TODO: 여기서 SSR으로 페이지 서비스
      // 모바일의 웹뷰페이지 닫고
      resp.setSuccess(result, "결제가 완료 되었습니다.");
      this.logger.error(`KCP 일반 결제 요청 응답 SSR : ${JSON.stringify(result)}`);
      return resp;
      /**
       *  {"res_msg":"정상처리",
       *  "card_cd":"CCDI",
       *  "card_bin_type_02":"0",
       *  "card_bank_cd":"0321",
       *  "batch_key":"2304051168518034",
       *  "card_name":"현대카드",
       *  "van_tx_id":"",
       *  "card_bin_type_01":"0",
       *  "res_cd":"0000",
       *  "join_cd":""}
       */
    } catch (e) {
      this.logger.error(`KCP 일반 결제 요청 ERR : ${e}`);
      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e, e);
      return resp;
      // throw new InternalServerErrorException(resp, {
      //   cause: e,
      //   description: resp.resultMsg,
      // });


    }

  }



  @Render('callback_kcp_auth')
  @Post('/callback_kcp_auth')
  async reqKcpAuth_callback(@Body() body: any) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`KCP 인증 요청 CallBack START : ${JSON.stringify(body)}`)

      const result = await this.eumcPayApiService.reqKcpBatch(body);

      // TODO: 여기서 SSR으로 페이지 서비스
      // 모바일의 웹뷰페이지 닫고
      resp.setSuccess(result, "카드 정보 등록이 완료 되었습니다.");
      return resp;
    } catch (e) {
      this.logger.error(`KCP 배치키 요청 ERR : ${e}`);
      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e, e);
      return resp;
    }

  }





  @Get('/cardList')
  @ApiOperation({ summary: 'EUMC 페이 카드 리스트' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'pat_no',
    description: '환자번호',
    required: true,
    example: '',
  })
  async cardList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pat_no') pat_no: string
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`EUMC 페이 카드 리스트 START`);
      const result = await this.eumcPayApiService.getKcpPayList(his_hsp_tp_cd, pat_no);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`EUMC 페이 카드 리스트 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Post('/card/:seq')
  @ApiOperation({ summary: 'EUMC 페이 삭제 리스트' })
  async deleteKcpBatchKey(
    @Param('seq') seq: string
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`EUMC 페이 카드 삭제 START`);
      const result = await this.eumcPayApiService.deleteKcpBatchKey(seq);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`EUMC 페이 카드 삭제 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Post('/paymentSmart')
  @ApiOperation({ summary: 'EUMC 페이 자동 결제' })
  @ApiBody({
    description: 'EUMC 페이 자동 결제',
    required: true,
    schema: {
      properties: {
        his_hsp_tp_cd: { type: 'string' },
        patno: { type: 'string' },
        bt_batch_key: { type: 'string' },
        good_mny: { type: 'string' },
        good_name: { type: 'string' },
        buyr_name: { type: 'string' },
        data_set: {type: 'string'}
      },
    },
  })
  async paymentSmart(
    @Body() body: ReqKcpPayment
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`EUMC 페이 자동 결제 START`);
      this.logger.error(`EUMC 페이 자동 결제 body : ${JSON.stringify(body)}`);
      /* ============================================================================== */
      /* = g_conf_site_cd, g_conf_site_key 설정                                       = */
      /* = 실결제시 KCP에서 발급한 사이트코드(site_cd), 사이트키(site_key)를 반드시   = */
      /* = 변경해 주셔야 결제가 정상적으로 진행됩니다.                                = */
      /* =----------------------------------------------------------------------------= */
      /* = 테스트 시 : 사이트코드(T0000)와 사이트키(3grptw1.zW0GSo4PQdaGvsF__)로      = */
      /* =            설정해 주십시오.                                                = */
      /* = 실결제 시 : 사이트코드(A8DZT)와 사이트키(2zFYprYnOQvafYDf03YNdm1__)로  = */
      /* =            설정해 주십시오. 이대목동                                            = */
      /* = 실결제 시 : 사이트코드(A8DZL)와 사이트키(47DPYaW97iazHr-lkxyshnY__)로  = */
      /* =            설정해 주십시오. 이대서울                                          = */
      /* ============================================================================== */
      // public String g_conf_site_cd   = "A8DZT";
      // public String g_conf_site_key  = "2zFYprYnOQvafYDf03YNdm1__";
      //
      // public String g_conf_site_cd_seoul   = "A8DZL";
      // public String g_conf_site_key_seoul  = "47DPYaW97iazHr-lkxyshnY__";
      // 그룹아이디 BA0011000348 살제 A8B2Z1002682 PG A8DZR1002800 : PG 사용
      /*
      if(body.his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
        body.site_cd = "A8DZL";
      }else{
        body.site_cd = "A8DZT";
      }
      body.bt_group_id = "A8DZR1002800";

      // 테스트용
      body.site_cd = "A52Q7";
      body.bt_group_id = "A52Q71000489";
      */
      body.site_cd = this.configService.get<string>(`PAY_SITE_CD_${body.his_hsp_tp_cd}`);
      body.bt_group_id = this.configService.get<string>(`PAY_GROUP_ID`);

      const result = await this.eumcPayApiService.reqKcpAutoPay(body);
      resp.setSuccess(result);

    } catch (e) {
      this.logger.error(`EUMC 페이 자동 결제 ERR : ${e}`);
      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e.toString(), e);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Post('/req_auth_number')
  @ApiOperation({ summary: '본인인증' })
  async req_auth_number(@Body() body: any) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`EUMC 페이 자동 결제 START`);
      this.logger.debug(`EUMC 페이 자동 결제 body : ${JSON.stringify(body)}`);

      if(body.comm_id == 'KT') {
        body.comm_id = 'KTF';
      }

      /**
       * site_cd, pt_no, media_type, user_name, phone_no, comm_id, birth_day, sex_code, local_code,
       * cp_sms_msg, cp_callback
       */

        // body.site_cd = this.configService.get<string>(`PAY_SITE_CD_${body.his_hsp_tp_cd}`);
      //body.bt_group_id = this.configService.get<string>(`PAY_GROUP_ID`);

      const result = await this.eumcPayApiService.reqKcpAuthProcess(body);
      resp.setSuccess(result);

    } catch (e) {
      this.logger.error(`EUMC 페이 자동 결제 ERR : ${e}`);
      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e.toString(), e);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Post('/req_auth_confirm')
  @ApiOperation({ summary: '본인인증확인' })
  async req_auth_confirm(@Body() body: any) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`EUMC 본인인증확인 START`);
      this.logger.debug(`EUMC 본인인증확인 body : ${JSON.stringify(body)}`);

      const result = await this.eumcPayApiService.reqKcpOtpConfirm(body);
      resp.setSuccess(result);

    } catch (e) {
      this.logger.error(`EUMC 본인인증확인 ERR : ${e}`);
      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e.toString(), e);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }









  //
  // @Post('/e-prescription')
  // @ApiOperation({ summary: '전자 처방전 API 요청' })
  // async requestPharmData(    @Body("patno") patno: string,
  //                            @Body("his_hsp_tp_cd") his_hsp_tp_cd: string,
  //                            @Body("ord_dt") ord_dt: string,
  //                            @Body("ams_no") ams_no: string,
  //                            @Body("pact_id") pact_id: string,
  //                            @Body("pharmName") pharmName: string,
  //                            @Body("pharmId") pharmId: string,) {
  //
  //
  //   const resp = new ResponseDto();
  //   try {
  //     this.logger.debug(`전자 처방전 요청 START`);
  //     const result = await this.prescriptionApiService.getEPharmDetail(patno, his_hsp_tp_cd, ord_dt, ams_no, pact_id, pharmName, pharmId);
  //     resp.setSuccess(result);
  //
  //     return resp;
  //   } catch (e) {
  //     this.logger.error(`전자 처방전 요청 ERR : ${e}`);
  //     resp.setError(ApiResult.UNKNOWN_ERROR);
  //     throw new InternalServerErrorException(resp, {
  //       cause: e,
  //       description: resp.resultMsg,
  //     });
  //   }
  // }




}
