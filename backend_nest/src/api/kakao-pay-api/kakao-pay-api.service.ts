import { Injectable,
Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { CrytoUtil } from "../../utils/cryto.util";
import { PaymentApiService } from "../payment-api/payment-api.service";
import { InjectRepository } from "@nestjs/typeorm";
import { EumcPayEumcEntity } from "../../entities/eumc-pay.eumc-entity";
import { Repository } from "typeorm";
import { EumcKakaopayEumcEntity } from "../../entities/eumc-kakaopay.eumc-entity";
import { CommonCodeConst, RCP_TYPE } from "../../const/common-code.const";
import * as moment from "moment-timezone";
import axios, { AxiosError } from "axios";
import { catchError, firstValueFrom, lastValueFrom } from "rxjs";
import { ReqKcpPayment } from "../eumc-pay-api/dto/req-kcp-payment.interface";
import { RespKcpPayment } from "../eumc-pay-api/dto/resp-kcp-payment.interface";
import { PaymentSave } from "../cert-api/dto/payment-save.interface";
import { PaymentSaveI } from "../cert-api/dto/payment-save-i.interface";
import { ReqMakeCertPdf } from "../cert-api/dto/req-make-cert.pdf";
import { CertApiService } from "../cert-api/cert-api.service";

@Injectable()
export class KakaoPayApiService {
  private readonly logger = new Logger(KakaoPayApiService.name);

  constructor(
    private httpService: HttpService,
    private paymentApiService: PaymentApiService,
    private certApiService: CertApiService,
    @InjectRepository(EumcKakaopayEumcEntity,
"eumc_pay")
    private kakaopayEumcEntityRepo: Repository<EumcKakaopayEumcEntity>,
  ) {
  }


  /**
   * 카카오페이 결제 준비
   * @param payFlag
   * @param rcptype
   * @param payStore
   * @param meddept
   * @param spcdryn
   * @param medtype
   * @param meddr
   * @param pattype
   * @param typecd
   * @param insurt
   * @param custcd
   * @param custinf
   * @param rateinf
   * @param inordcd
   * @param meddate
   * @param admdate
   * @param email
   */
  async kakaoPayReady(
    his_hsp_tp_cd: string,
    alimtalk_user_key: string,
    pat_no: string,

    payFlag: string,
    rcptype: string,
    payStore: string,
    meddept: string,
    spcdryn: string,
    medtype: string,
    meddr: string,
    pattype: string,
    typecd: string,
    insurt: string,
    custcd: string,
    custinf: string,
    rateinf: string,
    inordcd: string,
    meddate: string,
    admdate: string,
    email: string
  ) {

    try {
      let partner_order_id = moment().format('yyyyMMDDHHmmss');

      let reqBody = {
        cid: '',
        available_cards: null,
        partner_order_id: pat_no + partner_order_id,
        partner_user_id: "EumcMD",
        item_code: null,
        item_name: null,

        quantity: '1',
        total_amount: payStore.replace(",", ""),
        tax_free_amount: '0',
        payment_method_type: (Number(payStore) > 2000000 ? "CARD" : null),
        approval_url: null,
        fail_url: null,
        cancel_url: null,
      }

      if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
        // reqBody.cid = 'TC0ONETIME';//CommonCodeConst.KAKAO_CID_SEOUL;
        reqBody.cid = CommonCodeConst.KAKAO_CID_SEOUL;
        reqBody.available_cards = ["SHINHAN", "KB", "HYUNDAI", "LOTTE", "SAMSUNG", "NH", "BC", "CITI", "KAKAOBANK", "KAKAOPAY", "WOORI", "GWANGJU", "SUHYUP", "SHINHYUP", "JEONBUK", "JEJU", "SC"]

      } else if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG) {
        // reqBody.cid = 'TC0ONETIME';//CommonCodeConst.KAKAO_CID_MOKDONG;
        reqBody.cid = CommonCodeConst.KAKAO_CID_MOKDONG;
      }

      /**
       *   INOUT_MID = '2', // 입퇴원 중간비
       *   INOUT_FINAL = '3', // 퇴원비
       *   RSV_PAY = '4', // 진료예약 예약비
       *   HISTORY_TALK_PAY = '5', // 문진표 작성(스마트서베이)
       *   REQ_CERTIFICATION = '6', // 증명서 신청
       *   RSV_MEDICINE_PAY = '7', // 예약 조제비 결제
       */
      reqBody.item_code = rcptype;
      if (alimtalk_user_key == null || alimtalk_user_key == '') {
        reqBody.cancel_url = 'https://pay.eumc.ac.kr' + "/api/v1/kakao-pay/cancel";
        reqBody.approval_url = 'https://pay.eumc.ac.kr' + "/api/v1/kakao-pay/approval";
        reqBody.fail_url = 'https://pay.eumc.ac.kr' + "/api/v1/kakao-pay/fail";

        // reqBody.cancel_url = 'https://test-pay.eumc.ac.kr' + "/api/v1/kakao-pay/cancel";
        // reqBody.approval_url = 'https://test-pay.eumc.ac.kr' + "/api/v1/kakao-pay/approval";
        // reqBody.fail_url = 'https://test-pay.eumc.ac.kr' + "/api/v1/kakao-pay/fail";
      } else {
        reqBody.cancel_url = 'https://pay.eumc.ac.kr' + "/api/v1/kakao-pay/cancel";
        reqBody.approval_url = 'https://pay.eumc.ac.kr' + "/api/v1/kakao-pay/approval";
        reqBody.fail_url = 'https://pay.eumc.ac.kr' + "/api/v1/kakao-pay/fail";

        // reqBody.cancel_url = 'https://test-pay.eumc.ac.kr' + "/api/v1/kakao-pay/cancel";
        // reqBody.approval_url = 'https://test-pay.eumc.ac.kr' + "/api/v1/kakao-pay/approval";
        // reqBody.fail_url = 'https://test-pay.eumc.ac.kr' + "/api/v1/kakao-pay/fail";
      }

      switch (rcptype) {
        case RCP_TYPE.OUT_PATIENT: {
          reqBody.item_name = '외래수납';
        }
          break;
        case RCP_TYPE.INOUT_MID: {
          reqBody.item_name = '입원중간비 수납';
        }
          break;
        case RCP_TYPE.INOUT_FINAL: {
          reqBody.item_name = '퇴원비 수납';
        }
          break;
        case RCP_TYPE.REQ_CERTIFICATION: {
          reqBody.item_name = '증명서 신청';
        }
          break;
        case RCP_TYPE.RSV_MEDICINE_PAY: {
          reqBody.item_name = '예약 조제비 결제';
        }
          break;
      }

      // const result$ = await this.httpService.post(
      //   `https://kapi.kakao.com/v1/payment/ready`,
      //   reqBody,
      //   {
      //     headers: {
      //       Authorization: "KakaoAK " + "c4aeff4192f52fef5b2ddfc090104e7e",
      //       'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //       Accept: 'application/json',
      //     },
      //   },
      // );
      //
      // const callResp = await lastValueFrom(result$);

      const { data } = await lastValueFrom(
        this.httpService.post(`https://kapi.kakao.com/v1/payment/ready`, reqBody, {
          headers: {
            Authorization: "KakaoAK " + "c4aeff4192f52fef5b2ddfc090104e7e",
            // Authorization: "KakaoAK " + "359e60db812962a943dbd62d667d4f75",
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
      ).finally(()=>{
        this.logger.debug(`KAKAO READY SEND`)
      });

      this.logger.debug(`KAKAO READY RESP : ${JSON.stringify(data)}`)


      // this.kakaopayEumcEntityRepo.save({
      //   tid: data.tid,
      //   partner_order_id: data.partner_order_id,
      // } as EumcKakaopayEumcEntity)


      return {
        tid: data.tid,
        partner_order_id: reqBody.partner_order_id,
        item_name: rcptype,
        redirect_url: data.next_redirect_mobile_url
      };

      // return await fetch('https://kapi.kakao.com/v1/payment/ready', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: "KakaoAK " + "c4aeff4192f52fef5b2ddfc090104e7e",
      //     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      //   },
      //   body: JSON.stringify(reqBody),
      // })
      // .then(response => {
      //   return response.json();
      // })
      // .then(callResp => {
      //   this.logger.debug(`KAKAO READY OK : ${JSON.stringify(callResp)}`)
      //    return { tid: callResp.data.tid,
      //      partner_order_id: callResp.data.partner_order_id,
      //      item_name: rcptype,
      //      redirect_url: callResp.data.next_redirect_mobile_url}
      // })
    } catch (e) {
      this.logger.error(`KAKAO PAY ERROR : ${e}`);
      throw e;
    }
  }







  /**
   * 카카오페이 결제 진행
   * @param his_hsp_tp_cd
   * @param pat_no
   * @param tid
   * @param partner_order_id
   * @param pg_token
   * @param emailChk
   * @param rcp_type
   * @param target_data
   */
  async kakaoPayApproval(
    his_hsp_tp_cd: string,
    pat_no: string,
    partner_order_id: string,
    tid: string,
    pg_token: string,
    emailChk?: string,
    rcp_type?: string,
    target_data?: any
  ) {

    try{
      let reqBody = {
        cid: '',
        partner_user_id: "EumcMD",
        partner_order_id: partner_order_id,
        pg_token: pg_token,
        tid: tid
      }

      if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
        // reqBody.cid = 'TC0ONETIME';//CommonCodeConst.KAKAO_CID_SEOUL;
        reqBody.cid = CommonCodeConst.KAKAO_CID_SEOUL;
      } else if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG) {
        // reqBody.cid = 'TC0ONETIME';//CommonCodeConst.KAKAO_CID_MOKDONG;
        reqBody.cid = CommonCodeConst.KAKAO_CID_MOKDONG;
      }


      const { data } = await lastValueFrom(
        this.httpService.post(`https://kapi.kakao.com/v1/payment/approve`, reqBody, {
          headers: {
            Authorization: "KakaoAK " + "c4aeff4192f52fef5b2ddfc090104e7e",
            // Authorization: "KakaoAK " + "359e60db812962a943dbd62d667d4f75",
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
      ).finally(()=>{
        this.logger.debug(`KAKAO APRROVE SEND`)
      });


      /**
       * {"aid":"A44933aa5b8c2c026ee5",
       * "tid":"T44933a541ce0891c833",
       * "cid":"TC0ONETIME",
       * "partner_order_id":"1581861420230426232229",
       * "partner_user_id":"EumcMD",
       * "payment_method_type":"MONEY",
       * "item_name":"외래수납",
       * "item_code":"1",
       * "quantity":1,
       * "amount":{"total":1100,"tax_free":0,"vat":100,"point":0,"discount":0,"green_deposit":0},
       * "created_at":"2023-04-26T23:22:29",
       * "approved_at":"2023-04-26T23:22:37"}
       * "card_info":{"approved_id":"11111111",
       * "bin":"111111",
       * "card_mid":"111111",
       * "card_type":"신용",
       * "install_month":"00",
       * "issuer_corp":"신한카드",
       * "issuer_corp_code":"05",
       * "purchase_corp":"신한카드",
       * "purchase_corp_code":"05",
       * "card_item_code":"111111",
       * "interest_free_install":"N",
       * "kakaopay_purchase_corp":"신한",
       * "kakaopay_purchase_corp_code":"101",
       * "kakaopay_issuer_corp":"신한",
       * "kakaopay_issuer_corp_code":"101"}
       */
      this.logger.debug(`KAKAO APPROVE RESP : ${JSON.stringify(data)}`)


      if(data != null) {
          let amount = data.amount;
          // data.total = amount.total;
          data.tax_free = amount.tax_free;
          data.vat = amount.vat;
          // data.point = amount.point;
          // data.discount = amount.discount;
          // data.green_deposit = amount.green_deposit;
          data.amount = amount.total;

          const db_resp = await this.kakaopayEumcEntityRepo.save({
            tid: data.tid,
            cid: data.cid, //TODO: AES256
            partner_order_id: data.partner_order_id,
            payment_method_type: data.payment_method_type,
            item_name: data.item_name,
            item_code: data.item_code,
            amount: data.amount,
            tax_free: data.tax_free,
            vat: data.vat,

            purchase_corp: (typeof(data.card_info) != 'undefined' ? data.card_info.purchase_corp : ''),
            purchase_corp_code: (typeof(data.card_info) != 'undefined' ? data.card_info.purchase_corp_code : ''),
            issuer_corp: (typeof(data.card_info) != 'undefined' ? data.card_info.issuer_corp : ''),
            issuer_corp_code: (typeof(data.card_info) != 'undefined' ? data.card_info.issuer_corp_code : ''),
            card_type: (typeof(data.card_info) != 'undefined' ? data.card_info.card_type : ''),
            install_month: (typeof(data.card_info) != 'undefined' ? data.card_info.install_month : ''),
            approved_id: (typeof(data.card_info) != 'undefined' ? data.card_info.approved_id : ''),//TODO: AES256
            interest_free_install: (typeof(data.card_info) != 'undefined' ? data.card_info.interest_free_install : ''),

            patno: pat_no
          } as EumcKakaopayEumcEntity);

          let type = target_data.type;

          //TODO: paymentLog????? 저장?

          if(type == 'PAY'){
            //TODO: 수납일때 처리 필요!!!!
            const db_resp = await this.savePaymentDB(data.item_name, his_hsp_tp_cd, pat_no, rcp_type, {
              order_no: data.partner_order_id, //":"20230412329",
              pg_txid: data.aid, //"0412032914MK28987373370000000011000070577311",
              card_bin_type_01: (typeof(data.card_info) != 'undefined' ? data.card_info.bin : '0'), //"0", //FIXME:
              trace_no: data.tid, //"A52Q7YM1N8ONLXDR",
              card_mny: data.amount, //"1100",
              res_vat_mny: data.vat, //"100",
              ca_order_id: data.partner_order_id, //"20230412329",
              acqu_name: (typeof(data.card_info) != 'undefined' ? data.card_info.purchase_corp : '카카오머니'), //"신한카드",
              // card_no: string, //"461954******7815",
              quota: (typeof(data.card_info) != 'undefined' ? data.card_info.install_month : '00'), //"00",
              // van_cd: string, //"VNKC",
              // acqu_cd: string, //"CCLG",
              amount: data.amount, //"1100",
              cert_no: data.cid, //"23732987373372",
              van_apptime: data.approved_at, //"20230412032914",
              pay_method: data.payment_method_type, //"PACA",
              // card_bin_bank_cd: string, //"0301",
              bizx_numb: (typeof(data.card_info) != 'undefined' ? data.card_info.card_mid : '0000000000'), //"0040905630",//FIXME: 가맹점번호 필요 card_item_code 없음
              app_time: data.approved_at, //"20230412032914",
              tno: data.tid, //"23732987373372",
              card_cd: (typeof(data.card_info) != 'undefined' ? data.card_info.issuer_corp_code : 'KAKAO'), //"CCLG",
              card_name: (typeof(data.card_info) != 'undefined' ? data.card_info.purchase_corp : '카카오머니'), //"신한카드",
              // res_tax_mny: string, //"1000",
              app_no: data.cid, //"70577311"}
            } as RespKcpPayment, target_data);
            if(db_resp != null) {
              //TODO: 수납일때 이메일 전송 - emailChk


              try{
                let pdfReq = new ReqMakeCertPdf();
                pdfReq.his_hsp_tp_cd = his_hsp_tp_cd;
                pdfReq.patno = pat_no;
                pdfReq.rcptype = rcp_type;
                pdfReq.certname = '진료비계산영수증';
                pdfReq.deptname = target_data.deptCode;
                pdfReq.date = moment(data.approved_at).format('yyyyMMDD');
                pdfReq.data = '';
                pdfReq.email = emailChk;
                const pdfResp = await this.certApiService.getCertificationListSummary(pdfReq);
                this.logger.debug(`bill PDF RESP : ${pdfResp}`);
              }catch (e) {
                this.logger.error(e);
              }

              // // 영수증 발행
              // try {
              //   String email = mail;
              //   if (email != null && email.trim().length() > 0) {
              //     ResponseDTO resultEmailBill = eumcCertService.sendEmailBillInfo(his_hsp_tp_cd, paymentSave.getPatno(), String.valueOf(item_code), paymentSave.getDeptCode(), paymentSave.getTreatDate().replace("-", ""), email);
              //
              //     logger.info("result send email : " + resultEmailBill.toString());
              //   }
              // } catch (Exception e) {
              //   logger.info("영수증 발행 실패 = " + e.toString());
              // }
            }


          }
          this.logger.log(`KAKAO PAY APPROVE SAVE DB : ${JSON.stringify(db_resp)}`);
        }else{ // TODO: 결제 실패 일때??
          // this.kakaoPayCancel(his_hsp_tp_cd, pat_no, tid, )


        }
      // }catch (e) {
      //   this.logger.error(e);
      //   // return "https://test-pay.eumc.ac.kr/api/v1/kakao-pay/fail";
      //   throw e;
      // }
      return data;
  } catch (e) {
    this.logger.error(`KAKAO PAY ERROR : ${e}`);
      // return "https://test-pay.eumc.ac.kr/api/v1/kakao-pay/fail";
      throw e;
  }
}



  async savePaymentDB(item_name: string, his_hsp_tp_cd: string, pat_no: string, rcp_type: string, pay_resp: RespKcpPayment, data_set: any){
    if(rcp_type == RCP_TYPE.OUT_PATIENT) {

      // data_set :
      // target_data":{"type":"PAY","deptCode":"PGE",
      // "pattype":"BB","typecd":"000","medtype":"2","drcode":"01238"}}

      /**
       *  {"aid":"A549ad3c51d613a3c898",
       *  "tid":"T549ad2e247008d6c0de",
       *  "cid":"C532370028",
       *  "partner_order_id":"1638813020231107122118",
       *  "partner_user_id":"EumcMD",
       *  "payment_method_type":"MONEY",
       *  "item_name":"외래수납",
       *  "item_code":"1","quantity":1,
       *  "amount":{"total":11200,"tax_free":0,"vat":1018,"point":0,"discount":0,"green_deposit":0},
       *  "created_at":"2023-11-07T12:21:18",
       *  "approved_at":"2023-11-07T12:21:36"}
       */
      let reqBody = new PaymentSave();
      reqBody.buyerCode = '777';// KCP : 778
      reqBody.in_hsp_tp_cd = his_hsp_tp_cd;
      reqBody.patno = pat_no
      reqBody.treatDate =  moment().format("yyyyMMDD");
      reqBody.approvedNo = pay_resp.tno;
      reqBody.creditPaidTime = pay_resp.app_time;
      reqBody.paidAmount = pay_resp.amount;
      reqBody.buyer = pay_resp.card_name;
      reqBody.catId = pay_resp.bizx_numb;
      reqBody.revolving = pay_resp.quota;

      // 환자정보
      reqBody.deptCode = data_set.deptCode;
      reqBody.medType = data_set.medtype;
      reqBody.patType = data_set.pattype;
      reqBody.drcode = data_set.drcode;
      reqBody.typeCd = data_set.typecd;

      reqBody.rcpseq2 = data_set.rcpseq2;
      reqBody.spcdrYn = data_set.spcdrYn;
      reqBody.insurt = data_set.insurt;
      reqBody.custCd = data_set.custcd;
      reqBody.custRate = data_set.rateinf;
      reqBody.custInfo = data_set.custinf;


      // if(typeof(data_set.raw) != 'undefined'){
      //   reqBody.rcpseq2 = data_set.raw.OUT_RCPSEQ2;
      //   reqBody.spcdrYn = data_set.raw.OUT_SPCDRYN1; //
      //   reqBody.insurt = data_set.raw.OUT_INSURT1; //
      //   reqBody.custCd = data_set.raw.OUT_CUSTCD1; //
      //   reqBody.custRate = data_set.raw.OUT_RATEINF1; //
      //   reqBody.insurt = data_set.raw.OUT_INSURT1; //
      //   reqBody.custInfo = data_set.raw.OUT_CUSTINF1; //
      // }



      reqBody.creditCardNo = "123456**********";
      this.logger.debug(`SAVE PAYMENT REQ : ${rcp_type}, ${pat_no}, ${JSON.stringify(reqBody)}`)

      const callResp = await this.paymentApiService.savePayment(rcp_type, pat_no, reqBody);

      let reqEamilBody = new ReqMakeCertPdf();
      reqEamilBody.his_hsp_tp_cd = his_hsp_tp_cd;
      reqEamilBody.patno = pat_no;
      reqEamilBody.rcptype = rcp_type;
      // reqEamilBody.certname = data_set_value.certname;
      // reqEamilBody.deptname = data_set_value.deptname;
      // reqEamilBody.fromdate = data_set_value.fromdate;
      // reqEamilBody.todate = data_set_value.todate;
      // reqEamilBody.date = data_set_value.date;
      // reqEamilBody.data = data_set_value.date;
      // reqEamilBody.email = data_set_value.email;
      // const callEmailResp = await this.certApiService.getCertificationListSummary(reqBody);

      this.logger.debug(`savePayment EMR RESP : ${callResp}`);
    }
    else if(rcp_type == RCP_TYPE.INOUT_MID) {
      let reqBody = new PaymentSaveI();
      reqBody.buyerCode = '777';// KCP : 778
      reqBody.in_hsp_tp_cd = his_hsp_tp_cd;
      reqBody.patno = pat_no
      reqBody.treatDate =  moment().format("yyyyMMDD");

      reqBody.approvedNo = pay_resp.tno;
      reqBody.creditPaidTime = pay_resp.app_time;
      reqBody.paidAmount = pay_resp.amount;
      reqBody.buyer = pay_resp.card_name;
      reqBody.catId = pay_resp.bizx_numb;
      reqBody.revolving = pay_resp.quota;

      // 환자정보
      reqBody.deptCode = data_set.deptCode;
      reqBody.patType = data_set.pattype;
      reqBody.typeCd = data_set.typecd;

      /**
       *  treatDate: string;
       *   typeCd: string;
       *   patType: string;
       *   creditPaidTime: string;
       *   patno: string;-
       *   paidAmount: string;-
       *   deptCode: string;
       *   approvedNo: string;-
       *   revolving: string; --
       *   buyerCode: string;-
       *   buyer: string;-
       *   catId: string;-
       */
      this.logger.debug(`SAVE PAYMENT REQ : ${rcp_type}, ${pat_no}, ${JSON.stringify(reqBody)}`)
      const callResp = await this.paymentApiService.savePaymentIB(rcp_type, reqBody);

      let reqEamilBody = new ReqMakeCertPdf();
      reqEamilBody.his_hsp_tp_cd = his_hsp_tp_cd;
      reqEamilBody.patno = pat_no;
      reqEamilBody.rcptype = rcp_type;
      // reqEamilBody.certname = data_set_value.certname;
      // reqEamilBody.deptname = data_set_value.deptname;
      // reqEamilBody.fromdate = data_set_value.fromdate;
      // reqEamilBody.todate = data_set_value.todate;
      // reqEamilBody.date = data_set_value.date;
      // reqEamilBody.data = data_set_value.date;
      // reqEamilBody.email = data_set_value.email;
      // const callEmailResp = await this.certApiService.getCertificationListSummary(reqBody);

      this.logger.debug(`savePayment EMR RESP : ${callResp}`);
    }
    else if(rcp_type == RCP_TYPE.REQ_CERTIFICATION){
      this.logger.debug(`CERTIFICATION : ${JSON.stringify(data_set)}`);
      let data_set_value = JSON.parse(data_set).targetData;
      //this.logger.debug(`data_set_value : ${JSON.stringify(data_set_value)}`);
      //this.logger.debug(`rcptype : ${data_set_value.rcptype}`);
      let reqBody = new ReqMakeCertPdf();
      reqBody.his_hsp_tp_cd = his_hsp_tp_cd;
      reqBody.patno = pat_no;
      reqBody.rcptype = data_set_value.rcptype;
      reqBody.certname = data_set_value.certname;
      reqBody.deptname = data_set_value.deptname;
      reqBody.fromdate = data_set_value.fromdate;
      reqBody.todate = data_set_value.todate;
      reqBody.date = data_set_value.date;
      reqBody.data = data_set_value.date;
      reqBody.email = data_set_value.email;
      // const callResp = await this.certApiService.getCertificationListSummary(reqBody);
    }

    // 수납저장
    let newOne = {
      tid: pay_resp.tno,
      amount: pay_resp.amount,
      issuer_corp_code: '',
      issuer_corp: '',
      approved_at: '',
      approved_id: '',
      install_month: pay_resp.quota,
      interest_free_install: '',
      item_name: item_name,
      payment_method_type: 'KAKAO_PAY',
      patno: pat_no
    } as EumcKakaopayEumcEntity;
    this.logger.error(`kakaopayEumcEntityRepo : ${newOne}`);
    return this.kakaopayEumcEntityRepo.save(newOne);
    // pay_resp
    //{"order_no":"20230412329",
    // "mall_taxno":"1138521083",
    // "partcanc_yn":"Y",
    // "noinf":"N",
    // "res_msg":"정상처리",
    // "coupon_mny":"0",
    // "pg_txid":"0412032914MK28987373370000000011000070577311",
    // "card_bin_type_01":"0",
    // "trace_no":"A52Q7YM1N8ONLXDR",
    // "card_mny":"1100",
    // "res_vat_mny":"100",
    // "ca_order_id":"20230412329",
    // "res_tax_flag":"TG01",
    // "acqu_name":"신한카드",
    // "card_no":"461954******7815",
    // "quota":"00",
    // "van_cd":"VNKC",
    // "acqu_cd":"CCLG",
    // "amount":"1100",
    // "cert_no":"23732987373372",
    // "van_apptime":"20230412032914",
    // "use_point":"0",
    // "res_free_mny":"0",
    // "pay_method":"PACA",
    // "card_bin_bank_cd":"0301",
    // "bizx_numb":"0040905630",
    // "res_cd":"0000",
    // "escw_yn":"N",
    // "join_cd":"0000",
    // "app_time":"20230412032914",
    // "tno":"23732987373372",
    // "card_bin_type_02":"1",
    // "card_cd":"CCLG",
    // "res_en_msg":"processing completed",
    // "card_name":"신한카드",
    // "mcht_taxno":"1138521083",
    // "res_green_deposit_mny":"0",
    // "res_tax_mny":"1000",
    // "app_no":"70577311"}

    /*
    String buyerCode, String in_hsp_tp_cd, String patno, String treatDate, String deptCode, String spcdrYn, String medType, String drcode, String patType, String typeCd, String insurt, String custCd, String custRate, String custInfo, String inordCd, String rcpseq2
      PaymentSave paymentSave = new PaymentSave(
          "778",  // KCP : 778
          his_hsp_tp_cd, (String) session.getAttribute("patno"), (String) session.getAttribute("meddate"),
          (String) session.getAttribute("meddept"), (String) session.getAttribute("spcdryn"),
          (String) session.getAttribute("medtype"), (String) session.getAttribute("meddr"), (String) session.getAttribute("pattype"), (String) session.getAttribute("typecd"), (String) session.getAttribute("insurt"),
          (String) session.getAttribute("custcd"), (String) session.getAttribute("rateinf"), (String) session.getAttribute("custinf"), (String) session.getAttribute("inordcd"), "0"
  );
     */


    // paymentSave.setApprovedNo(tno);  // KCP 거래 고유 번호
    // paymentSave.setCreditPaidTime(app_time);
    // paymentSave.setRevolving(quota);
    // paymentSave.setPaidAmount(amount); // 승인 완료 금액
    // paymentSave.setBuyer(card_name);
    // paymentSave.setCatId(bizx_numb);



    /**
     *   in_hsp_tp_cd: string;    // 0 : 병원 구분 코드 (01:서울, 02:목동)
     *   patno: string;       // 2
     *   treatDate: string;   // 3 : 진료일자(YYYYMMDD)
     *   deptCode: string;    // 7 : 진료과코드
     *   spcdrYn: string;     // 10 : 지정구분
     *   medType: string;     // 11 : 초재진구분
     *   drcode: string;      // 12 : 의사코드
     *   patType: string;     // 13 : 급여종별
     *   typeCd: string;      // 14 : 유형보조
     *   insurt: string;
     *   custCd: string;      // 16 : 계약처코드
     *   custRate: string;
     *   custInfo: string;
     *   inordCd: string;     // 43 : 예외환자코드
     *   rcpseq2: string;     // 44 : 그룹영수증순번
     *   buyerCode: string;   // 63 : 카드종류 (VAN응답-'0'+카드타입2자리)
     *   creditCardNo: string;   // 64 : 카드번호 (Track2값 중 '=' 앞까지)
     *   approvedNo: string;   // 65 : 승인번호 (VAN 응답)
     *   creditPaidDate: string;  // 66 : 카드승인일시
     *   creditPaidTime: string;  // 66 : 카드승인일시 (YYYYMMDDHHNN)
     *   revolving: string;   // 67 : 카드할부개월수 (MM)
     *   availablePeriod: string; // 69 : 카드유효기간 (Track2값 중 '=' 뒤부터 4자리)
     *   paidAmount: string;  // 70 : 요청금액
     *   shipID: string;      // 71 : 카드가맹점 (VAN응답 - VAN구분2자리+가맹점번호16자리)
     *   buyer: string;       // 72 : 카드명 (VAN응답 - 12자리)
     *   catId: string;       //가맹점번호
     */
  }





  async kakaoPayCancel(his_hsp_tp_cd: string, pat_no: string,
                       tid: string, amount: string, tax_free: string, vat: string, partner_order_id: string) {
    this.logger.debug(`KAKAO PAY CANCEL START`);
    try{

      let reqBody = {
        cid: '',
        cancel_amount: amount,
        cancel_tax_free_amount: tax_free,
        cancel_vat_amount: vat,
        tid: tid,
      }

      if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
        reqBody.cid = CommonCodeConst.KAKAO_CID_SEOUL;
        // reqBody.cid = 'TC0ONETIME';//CommonCodeConst.KAKAO_CID_SEOUL;
      } else if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG) {
        reqBody.cid = CommonCodeConst.KAKAO_CID_MOKDONG;
        // reqBody.cid = 'TC0ONETIME';//CommonCodeConst.KAKAO_CID_MOKDONG;
      }



      const { data } = await lastValueFrom(
        this.httpService.post(`https://kapi.kakao.com/v1/payment/cancel`, reqBody, {
          headers: {
            Authorization: "KakaoAK " + "c4aeff4192f52fef5b2ddfc090104e7e",
            // Authorization: "KakaoAK " + "359e60db812962a943dbd62d667d4f75",
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
      ).finally(()=>{
        this.logger.debug(`KAKAO CANCEL SEND`)
      });


    }catch (e) {
      this.logger.error(`KAKAO PAY CANCEL ERROR : ${e}`);
      // return "https://test-pay.eumc.ac.kr/api/v1/kakao-pay/fail";
      throw e;
    }

  }






}
