import { Injectable, Logger } from "@nestjs/common";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { getArrFirstData } from "../../utils/string.util";
import { ReqReceipt } from "./dto/req-receipt.interface";
import { ReqReceiptDetail } from "./dto/req-receipt-detail.interface";
import { ReceiptInfo } from "./dto/receipt-info.interface";
import { RespBillService151 } from "../cert-api/dto/resp-bill-service-151.interface";
import { InsuranceType } from "../../const/insurance-type.const";
import { CertApiService } from "../cert-api/cert-api.service";
import { PaymentApiService } from "../payment-api/payment-api.service";
import { ReceiptDetail } from "./dto/receipt-detail.interface";

@Injectable()
export class ReceiptApiService {
  private readonly logger = new Logger(ReceiptApiService.name);

  constructor(
    private certApiService: CertApiService,
    private paymentApiService: PaymentApiService) {
  }



  async getMedicalHistory(body: ReqReceipt) {
    this.logger.debug(`${body.patno} 환자 ${body.startDate} ~ ${body.endDate} 진료 기록 조회 START`);
    const result: Array<ReceiptInfo> = [];
    try{

      const resp = await this.paymentApiService.getBillList(body.hsp_tp_cd, body.patno, body.startDate, body.endDate);
      if(resp != null) {
        resp.forEach(function(data: RespBillService151) {

          if(data.out_meddate != null && data.out_meddate != ''){
            const tmp = {
              hsp_tp_cd: body.hsp_tp_cd,
              patsite: data.custom_out_patsite,
              patno: body.patno,
              patname: data.out_pt_nm,
              meddate: data.out_meddate,

              fromdate: data.out_lastdate.substring(0, 8),
              todate: data.out_lastdate.substring(0, 8),
              medday: '1',

              meddeptcd: data.custom_out_meddept,
              meddept: data.out_deptname,
              meddr: data.out_drname,
              pattype: data.out_pme_cls_cd,
              pattype_code: InsuranceType.getTypeByName(data.out_pme_cls_cd).code,
              rcptno: data.out_citizen,

              slrsctnsfcgsum: data.custom_out_tot_insown,
              slrsctnpblcobrdnsum: data.custom_out_tot_insreq,
              slrtotamtsfcgsum: data.custom_out_tot_insall,
              nslrchocclnccrgsum: data.custom_out_tot_spc,
              nslrchocclnccrgxcptsum: data.custom_out_tot_uin,
              totmedxpnsum: data.out_mtcs_amt,
              totpatmedxpnsum: data.out_pbdn_amt,
              insamt: data.custom_out_tot_ins,
              uniamt: data.custom_out_tot_uni,
              ovamt: '0',
              vatamt: data.out_vat_amt,
              dcamt: data.out_rdtn_amt,
              preamt: data.custom_out_pre_amt,
              suamt: data.out_rpy_amt,
              uncolamt: data.out_uncl_amt,
              rcpamt: data.custom_out_tot_rpy_amt,
              cashpaidamt: data.custom_out_cash_rpy_amt,
              cardpaidamt: data.custom_out_card_rpy_amt,
              rcpdate: data.out_rpy_dt,

              claimFlag: '0',
              admDate: data.out_meddate,
              medicalName: data.out_meddate,
              paidAmt: data.custom_out_tot_rpy_amt,
              pactid: data.custom_out_rpy_pact_id,

              icCaseKey: data.out_citizen,
            } as ReceiptInfo;

            result.push(tmp);
          }
        });
      }

      return result;
    }catch (e) {
      this.logger.debug(`${body.patno} 환자 ${body.startDate} ~ ${body.endDate} 진료 기록 조회 ERR ${e}`);
      throw e;
    }
  }

  async getReceiptInfo(body: ReqReceipt) {
    this.logger.debug(`${body.rcptno} 환자 영수증 정보 조회`);
    let result = {} as ReceiptInfo;
    try{
      body.startDate = body.meddate;
      body.endDate = body.meddate
      const list = await this.getMedicalHistory(body);

      if(list != null) {
          const foundOne = list.filter((item)=>{
            return (item.rcptno == body.rcptno)
          }).pop();

          // FIXME: 아래는 원래 JAVA소스 주석
        // TODO: 2020-01-19 주상병코드,부상병코드 -> 영수증 1개에 대한 진단서로부터 가져오도록 로직 구현하기로 함
        // TODO: 2020-02-19 로직 최종 반영하게 되면 활성화 시켜야 함
          if(false){
            const finalOne = await this.certApiService.getMedicalFormInfo({
              his_hsp_tp_cd: body.hsp_tp_cd,
              in_pt_no: body.patno,
            }, foundOne.meddept, foundOne.meddate);

            if(finalOne != null) {
              foundOne.main_kcd = finalOne.mainKcd;
              foundOne.main_kcd_name = finalOne.mainKcdName;
              foundOne.nomain_kcd = finalOne.noMainKcd;
              foundOne.nomain_kcd_name = finalOne.noMainKcdName;
            }
          }
        result = foundOne;
      }
      return result;
    }catch (e) {
      this.logger.debug(`${body.rcptno} 환자 영수증 정보 조회 ERR ${e}`);
      throw e;
    }


  }


  async getReceiptDetailInfo(body: ReqReceiptDetail) {
    this.logger.debug(`영수증 ${body.rcptno} 세부정보 조회`);
    try{
      const list = await this.paymentApiService.getBillList(body.hsp_tp_cd, body.patno, body.meddate, body.meddate);

      const foundOne = list.filter((item)=>{
        return item.out_citizen == body.rcptno;
      }).pop();

      return foundOne.out_table0
        .map((item) => {
          const tmp = {} as ReceiptDetail;

          // FIXME: JAVA코드에서 옮겨온 주석, 아마도 code에 codename를 잘라쓰는것에 대한 것일듯
          // TODO: 2020-02-13 전산에서 바뀔 경우 그에 맞게 대응해야 함.
          let code_only = item.code;
          let code_name_only = item.codename;

          code_only = item.codename.split("\\.")[0];
          code_name_only = item.codename.split("\\.")[1];
          code_name_only = code_name_only.toUpperCase().replace("\\p{Z}", "");

          tmp.code = code_only;
          tmp.codename = code_name_only;

          tmp.slrsctnsfcgamt = item.insown;
          tmp.slrsctnpblcobrdnamt = item.insreq;
          tmp.slrtotamtsfcgamt = item.insall;
          tmp.nslrchocclnccrgamt = item.spc;
          tmp.nslrchocclnccrgxcptamt = item.uin;
          return tmp;
        });
    }catch (e) {
      this.logger.debug(`영수증 ${body.rcptno} 세부정보 조회 ERR ${e}`);
      throw e;
    }

  }


}
