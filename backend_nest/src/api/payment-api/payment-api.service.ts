import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { CommonConfService } from "../../config/common-conf.service";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { ReqBillService15X } from "../cert-api/dto/req-bill-service-15x.interface";
import { getArrFirstData } from "../../utils/string.util";
import { RespBillService151 } from "../cert-api/dto/resp-bill-service-151.interface";
import { DepartmentType } from "../../const/department-type.const";
import { PaymentReceiptDetail } from "../cert-api/dto/payment-receipt-detail.interface";
import { McstDtoPtclInfoDto } from "../cert-api/dto/mcst-dto-ptcl-info.dto";
import { ReqRsvToday } from "../reservation-api/dto/req-rsv-today.interface";
import { PaymentSave } from "../cert-api/dto/payment-save.interface";
import { PatientApiService } from "../patient-api/patient-api.service";
import { PatientInfo } from "../patient-api/dto/patient-info.interface";
import { PaymentListItem } from "../cert-api/dto/payment-list-item.dto";
import { PaymentODetail } from "./dto/payment-o-detail.interface";
import { PaymentI } from "./dto/payment-i.interface";
import { CommonCodeConst, RCP_TYPE } from "../../const/common-code.const";
import { PaymentSaveI } from "../cert-api/dto/payment-save-i.interface";
import { parseToJson } from "../../utils/xml.util";

@Injectable()
export class PaymentApiService {
  private readonly logger = new Logger(PaymentApiService.name);


  constructor(private httpService: HttpService,
              private patientApiService: PatientApiService,
              private commonConfService: CommonConfService,
              private emrSoapApiService: EmrSoapApiService,
              private kioskWebServiceApiService: KioskWebServiceApiService,
  ) {
  }

  /**
   * 진료비 계산 영수증 (외래)
   */
  async getBillList(hsp_tp_cd: string, pat_no: string, from_date: string, to_date: string): Promise<Array<RespBillService151>> {
    this.logger.log(`진료비 계산 영수증 (외래) START`);
    const paymentReceiptList = [] as Array<RespBillService151>;
    try{
      const resp = await this.kioskWebServiceApiService.getReceiptList(hsp_tp_cd, pat_no, from_date, to_date);
      const resList = resp.NewDataSet.Table0;
      for (const item of resList) {

        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }

        // {
        //   "HSP_TP_CD": "02",
        //   "RPY_PACT_ID": "1001717518",
        //   "RPY_CLS_SEQ": "1",
        //   "PT_NO": "12112191",
        //   "MED_DT": "201902210000",
        //   "ORD_DT": "",
        //   "MEDR_SID": "1001146",
        //   "MED_DEPT_CD": "FM",
        //   "PATSITE": "O",
        //   "ORPY_CLS_CD": "S",
        //   "RPY_SEQ": "1",
        //   "RPY_SEQ2": "",
        //   "RPY_STF_NO": "96663",
        //   "APY_STR_DT": "20190221",
        //   "APY_END_DT": "20190221",
        //   "CAL_APY_STR_DT": "20190221",
        //   "CAL_APY_END_DT": "20190221",
        //   "MED_DEPT_NM": "가정의학과"
        // }
        const tmpList = await this.kioskWebServiceApiService.getReceiptTypeOList({
          hsp_tp_cd: item.HSP_TP_CD,
          rpy_pact_id: item.RPY_PACT_ID,
          rpy_cls_seq: item.RPY_CLS_SEQ,
          pt_no: item.PT_NO,
          med_dt: item.MED_DT,
          ord_dt: item.ORD_DT,
          medr_sid: item.MEDR_SID,
          med_dept_cd: item.MED_DEPT_CD,
          patsite: item.PATSITE,
          orpy_cls_cd: item.ORPY_CLS_CD,
          rpy_seq: item.RPY_SEQ,
          rpy_seq2: item.RPY_SEQ2,
          rpy_stf_no: item.RPY_STF_NO,
          apy_str_dt: item.RPY_STF_NO,
          apy_end_dt: item.APY_END_DT,
          cal_apy_str_dt: item.CAL_APY_STR_DT,
          cal_apy_end_dt: item.CAL_APY_END_DT,
          med_dept_nm: item.MED_DEPT_NM,
        }  as ReqBillService15X);

        this.logger.debug(`RESP 151 : ${JSON.stringify(tmpList)}`);
        let table3 = [];
        if(typeof(tmpList.Table03) != 'undefined') {
          table3 = tmpList.Table03;

          // const table3 = tmpList.NewDataSet.Table03[0];
          const paymentReceipt = {} as RespBillService151;
          table3.forEach((item2) => {
            for (let el in item2) {
              paymentReceipt[el.toLowerCase()] = getArrFirstData(item2[el]);
            }
          })
          this.logger.log(`paymentReceipt RESP : ${JSON.stringify(paymentReceipt)}`);

          paymentReceipt.custom_out_patsite = item.PATSITE;
          paymentReceipt.custom_out_rpy_pact_id = item.RPY_PACT_ID;
          paymentReceipt.custom_out_meddept = DepartmentType.getTypeByDeptName(item.HSP_TP_CD, paymentReceipt.out_deptname.replace("\\p{Z}", "")).code;

          let preAmtA = Number(paymentReceipt.out_pv_rpy_amt);
          let preAmtB = 0;

          try {
            preAmtB = Number(paymentReceipt.out_spcpbdn_amt);
          } catch (e) {
            preAmtB = 0;
          }

          let preAmt = preAmtA - preAmtB;
          paymentReceipt.custom_out_pre_amt = preAmt.toString();

          let totCash = Number(paymentReceipt.out_oncash_rpy_amt) + Number(paymentReceipt.out_cash_rpy_amt);
          let totCard = Number(paymentReceipt.out_card_rpy_amt);
          let totAmt = totCash + totCard;

          paymentReceipt.custom_out_cash_rpy_amt = totCash.toString();
          paymentReceipt.custom_out_card_rpy_amt = totCard.toString();
          paymentReceipt.custom_out_tot_rpy_amt = totAmt.toString();
        }

        const paymentReceiptDetailList = [] as Array<PaymentReceiptDetail>;
        if(typeof(tmpList.Table0) != 'undefined') {
          const table0 = tmpList.Table0;

          table0.forEach((item2)=>{
            let tmp = {} as PaymentReceiptDetail;
            for (let el in item2) {
              tmp[el.toLowerCase()] = getArrFirstData(item2[el][0]);
            }
            paymentReceiptDetailList.push(tmp);
          })
          this.logger.log(`paymentReceiptDetailList RESP : ${JSON.stringify(paymentReceiptDetailList)}`);
        }


        let paymentReceipt = {} as RespBillService151;
        const lastIdx = paymentReceiptDetailList.length-1;
        paymentReceipt.custom_out_tot_insown = paymentReceiptDetailList[lastIdx].insown;
        paymentReceipt.custom_out_tot_insreq = paymentReceiptDetailList[lastIdx].insreq;
        paymentReceipt.custom_out_tot_insall = paymentReceiptDetailList[lastIdx].insall;
        paymentReceipt.custom_out_tot_spc = paymentReceiptDetailList[lastIdx].spc;
        paymentReceipt.custom_out_tot_uin = paymentReceiptDetailList[lastIdx].uin;

        let totIns = Number(paymentReceipt.custom_out_tot_insown) + Number(paymentReceipt.custom_out_tot_insreq) + Number(paymentReceipt.custom_out_tot_insall);
        let totUins = Number(paymentReceipt.custom_out_tot_spc) + Number(paymentReceipt.custom_out_tot_uin);

        paymentReceipt.custom_out_tot_ins = totIns.toString();
        paymentReceipt.custom_out_tot_uni = totUins.toString();

        // // 맨 마지막은 합계 이므로 삭제함
        delete paymentReceiptDetailList[lastIdx];
        paymentReceipt.out_table0 = paymentReceiptDetailList;
        paymentReceipt.hsp_tp_cd = hsp_tp_cd;


        paymentReceiptList.push(paymentReceipt);
      }
    }catch (e) {
      this.logger.error(`진료비 계산 영수증 (외래) ERR : ${e}`);
    }
    return paymentReceiptList;
  }


  async getMcsPymCfmtDtlType170(hsp_tcp_cd: string, pat_no: string, pact_id: string, salary_type: string) {
    this.logger.log(`진료비 계산 영수증 (외래) START`);
    const mcstDtoPtclInfoList = [] as Array<McstDtoPtclInfoDto>;
    try {
      const resp = await this.kioskWebServiceApiService.getMcsPymCfmtDtlType170(hsp_tcp_cd, pat_no, pact_id, salary_type);
      const resultArr = resp.NewDataSet.Table0;
      resultArr.forEach((item)=>{
        let tmp = McstDtoPtclInfoDto.fromXml(new McstDtoPtclInfoDto(), item);

        for (let el in tmp) {
          tmp[el] = getArrFirstData(tmp[el]);
        }

        if(tmp.sugacode != '') {
          tmp.setSpcamt('');
          tmp.setUinamt('');
          tmp.setInsyn('');
          tmp.setSugacode(tmp.sugacode);

          // TODO: 2020-02-18 전산에서 바뀔 경우 그에 맞게 대응해야 함.
          tmp.codename = tmp.codename.toUpperCase().replace("\\p{Z}", "");

          mcstDtoPtclInfoList.push(tmp);
        }
      });
    }catch (e) {
      this.logger.error(`진료비 계산 영수증 (외래) ERR : ${e}`);
    }
    return mcstDtoPtclInfoList;
  }









  async getPayHistory(body: ReqRsvToday) {
    this.logger.debug(`수납내역 START`);
    body.IN_QUREY_TYPE = '2';
    body.IN_DUMMY1 = '';

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_RPYLIST(body);
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_RPYLIST.MOBILEINTERFACE_SEL_RPYLIST;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`수납내역 :  ${callResp}`)

    return callResp;
  }



  async getPayDetail(pact_id: string) {
    this.logger.debug(`수납상세 START`);

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_RPYDETAIL({
      IN_QUREY_TYPE: 2,
      IN_PACT_ID: pact_id
    });

    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_RPYDETAIL.MOBILEINTERFACE_SEL_RPYDETAIL;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`수납상세 :  ${callResp}`)

    return callResp;
  }





  async getPayHistoryDtl(body: ReqRsvToday) {
    this.logger.debug(`수납내역 START`);
    body.IN_QUREY_TYPE = '2';
    body.IN_DUMMY1 = '';

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_RPYLIST(body);
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_RPYLIST.MOBILEINTERFACE_SEL_RPYLIST;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }

        item['DETAIL'] = await this.getPayDetail(item.RPY_PACT_ID);
      }
    }
    this.logger.debug(`수납내역 :  ${callResp}`)

    return callResp;
  }



  /**
   * 외래-외래비 수납 저장 요청
   * @param rcp_type
   * @param pat_no
   * @param body
   */
  async savePayment(rcp_type: string, pat_no: string, body: PaymentSave) {
    this.logger.debug(`수납상세 START ${JSON.stringify(body)}`);

    const patient_info = await this.patientApiService.getPatientInfo(pat_no);
    let callResp =  await this.kioskWebServiceApiService.reqPaymentSaveTypeO(body, rcp_type, patient_info.birth);

    // let data =  await parseToJson("<?xml version='1.0' encoding='euc-kr'?> <NewDataSet> <Table0><IN_TRD_IHRT_NO><![CDATA[]]></IN_TRD_IHRT_NO></Table0><Table0><IO_DOSNO><![CDATA[0]]></IO_DOSNO></Table0><Table0><IO_RCPNO><![CDATA[20230627-00037-KIO99]]></IO_RCPNO></Table0><Table0><IO_DOSNO2><![CDATA[0]]></IO_DOSNO2></Table0><Table0><IO_RCPSEQ2><![CDATA[8]]></IO_RCPSEQ2></Table0><Table0><IO_RCPSEQ><![CDATA[1]]></IO_RCPSEQ></Table0><Table0><IO_RCPNO2><![CDATA[20230627-G0037-KIO99]]></IO_RCPNO2></Table0></NewDataSet>");
    callResp = callResp.NewDataSet;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`수납상세 :  ${callResp}`)

    return callResp;
  }


  /**
   * 입퇴원-입원중간비 수납 저장 요청
   * @param rcp_type
   * @param pat_no
   * @param body
   */
  async savePaymentIB(rcp_type: string, body: PaymentSaveI) {
    this.logger.debug(`수납상세 START`);

    let callResp =  await this.kioskWebServiceApiService.getPaymentSaveTypeIB(rcp_type, body);
    callResp = callResp.string.NewDataSet.Table0;

    // <IN_TRD_IHRT_NO><![CDATA[]]></IN_TRD_IHRT_NO>
    // </Table0><Table0><IO_DOSNO><![CDATA[0]]></IO_DOSNO></Table0><Table0><IO_RCPNO><![CDATA[20230627-00035-KIO99]]></IO_RCPNO></Table0><Table0><IO_DOSNO2><![CDATA[0]]></IO_DOSNO2></Table0><Table0><IO_RCPSEQ2><![CDATA[4]]></IO_RCPSEQ2></Table0><Table0><IO_RCPSEQ><![CDATA[1]]></IO_RCPSEQ></Table0><Table0><IO_RCPNO2><![CDATA[20230627-G0035-KIO99]]></IO_RCPNO2>


    // let data =  await parseToJson("<?xml version='1.0' encoding='euc-kr'?> <NewDataSet> <Table0><IN_TRD_IHRT_NO><![CDATA[]]></IN_TRD_IHRT_NO></Table0><Table0><IO_DOSNO><![CDATA[0]]></IO_DOSNO></Table0><Table0><IO_RCPNO><![CDATA[20230627-00037-KIO99]]></IO_RCPNO></Table0><Table0><IO_DOSNO2><![CDATA[0]]></IO_DOSNO2></Table0><Table0><IO_RCPSEQ2><![CDATA[8]]></IO_RCPSEQ2></Table0><Table0><IO_RCPSEQ><![CDATA[1]]></IO_RCPSEQ></Table0><Table0><IO_RCPNO2><![CDATA[20230627-G0037-KIO99]]></IO_RCPNO2></Table0></NewDataSet>");
    // let callResp = data.NewDataSet;


    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`수납상세 :  ${callResp}`)

    return callResp;
  }


  /**
   *
   * @param his_hsp_tp_cd
   * @param pat_no
   */
  async getPaymentList(his_hsp_tp_cd: string, pat_no: string) {
    this.logger.log(`수납내역 요청 START ${his_hsp_tp_cd}, ${pat_no}`);
    try {
      let result_list: Array<PaymentListItem> = [];
      const patient_info = await this.patientApiService.getPatientInfo(pat_no);
      const paymentListO = await this.getPaymentDetailListTypeO(his_hsp_tp_cd, patient_info);
      const paymentListI = await this.getPaymentDetailListTypeI(his_hsp_tp_cd, patient_info, 'S');

      if (paymentListO != null) {
        this.logger.debug(`외래 수납 리스트 : ${JSON.stringify(paymentListO)}`)
        paymentListO.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }

          result_list.push({
            deptname: '' + data.OUT_DEPTNAME1.trim(),
            rcptype: RCP_TYPE.OUT_PATIENT,
            rcpamt: data.OUT_RCPAMT1,
            meddate: data.OUT_MEDDATE,
            raw: data
          } as PaymentListItem);
        });
      }


      if (paymentListI != null) {
        paymentListI.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }

          result_list.push({
            deptname: '' + data.OUT_DEPTNAME.trim(),
            rcpamt: data.OUT_RCPAMT,
            rcptype: RCP_TYPE.INOUT_MID,
            meddate: data.OUT_ADMDATE,
            raw: data
          } as PaymentListItem);
        });
      }

      return {
        patient: patient_info,
        arrPayment: result_list
      };
    } catch (e) {
      this.logger.error(`진단서/소견서 요청 ERR : ${e}`);
      throw e;
    }
  }


  /**
   *
   * @param his_hsp_tp_cd
   * @param patient_info
   */
  async getPaymentDetailListTypeO(his_hsp_tp_cd: string, patient_info: PatientInfo) {
    this.logger.log(`수납내역 요청 START ${his_hsp_tp_cd}, ${patient_info.out_pt_no}`);
    try {
      let list: Array<PaymentODetail> = [];
      let paymentListO = await this.kioskWebServiceApiService.getPaymentTypeO(his_hsp_tp_cd, patient_info.out_pt_no);

      if (paymentListO != null) {
        paymentListO = paymentListO.Table0;

       let tmp = {};
        paymentListO.forEach(function(data) {
          for (let el in data) {
            tmp[el] = getArrFirstData(data[el]);
          }
        });
        paymentListO = tmp;

        console.log(`list : ${JSON.stringify(paymentListO)}`);


        if (paymentListO.OUT_MEDDEPT1 != '') {
          let detail = await this.kioskWebServiceApiService
            .getPaymentTypeODetail(his_hsp_tp_cd, patient_info.out_pt_no, patient_info.out_patname, paymentListO.OUT_MEDDEPT1);

          console.log(`detail : ${JSON.stringify(detail)}`);
          // detail.forEach(function(data) {
          //   for (let el in data) {
          //     detail[el] = getArrFirstData(data[el]);
          //   }
          // });

          let tmp = {};
          detail.forEach(function(data) {
            for (let el in data) {
              tmp[el] = getArrFirstData(data[el]);
            }
          });
          detail = tmp;

          console.log(`detail : ${JSON.stringify(detail)}`);


          detail.rrn = patient_info.out_ssn;

          // 원내약 있는 환자의 경우 모바일 수납 차단
          // 산재, 자보 환자 모바일 수납 차단
          if( !(detail.OUT_INORD_YN1 == "Y" || detail.OUT_PATTYPE1 == "SA" || detail.OUT_PATTYPE1 == "TD") ) {
            list.push(detail);
          }
        }
        if (paymentListO.OUT_MEDDEPT2 != '') {
          let detail = await this.kioskWebServiceApiService
            .getPaymentTypeODetail(his_hsp_tp_cd, patient_info.out_pt_no, patient_info.out_patname, paymentListO.OUT_MEDDEPT2);

          console.log(`detail : ${JSON.stringify(detail)}`);
          // detail.forEach(function(data) {
          //   for (let el in data) {
          //     detail[el] = getArrFirstData(data[el]);
          //   }
          // });

          let tmp = {};
          detail.forEach(function(data) {
            for (let el in data) {
              tmp[el] = getArrFirstData(data[el]);
            }
          });
          detail = tmp;
          console.log(`detail : ${JSON.stringify(detail)}`);


          detail.rrn = patient_info.out_ssn;

          // 원내약 있는 환자의 경우 모바일 수납 차단
          // 산재, 자보 환자 모바일 수납 차단
          if( !(detail.OUT_INORD_YN1 == "Y" || detail.OUT_PATTYPE1 == "SA" || detail.OUT_PATTYPE1 == "TD") ) {
            list.push(detail);
          }
        }
        if (paymentListO.OUT_MEDDEPT3 != '') {
          let detail = await this.kioskWebServiceApiService
            .getPaymentTypeODetail(his_hsp_tp_cd, patient_info.out_pt_no, patient_info.out_patname, paymentListO.OUT_MEDDEPT3);

          console.log(`detail : ${JSON.stringify(detail)}`);
          // detail.forEach(function(data) {
          //   for (let el in data) {
          //     detail[el] = getArrFirstData(data[el]);
          //   }
          // });

          let tmp = {};
          detail.forEach(function(data) {
            for (let el in data) {
              tmp[el] = getArrFirstData(data[el]);
            }
          });
          detail = tmp;
          console.log(`detail : ${JSON.stringify(detail)}`);


          detail.rrn = patient_info.out_ssn;

          // 원내약 있는 환자의 경우 모바일 수납 차단
          // 산재, 자보 환자 모바일 수납 차단
          if( !(detail.OUT_INORD_YN1 == "Y" || detail.OUT_PATTYPE1 == "SA" || detail.OUT_PATTYPE1 == "TD") ) {
            list.push(detail);
          }
        }
      }
      return list;
    }catch (e) {
      this.logger.error(`진단서/소견서 요청 ERR : ${e}`);
      throw e;
    }
  }




  /**
   *
   * @param his_hsp_tp_cd
   * @param patient_info
   * @param pay_type
   */
  async getPaymentDetailListTypeI(his_hsp_tp_cd: string, patient_info: PatientInfo, pay_type: 'A'|'B'|'S') {
    this.logger.log(`수납내역 요청 START ${his_hsp_tp_cd}, ${patient_info.out_pt_no}`);
    try {
      let list: Array<PaymentI> = [];
      const paymentListI = await this.kioskWebServiceApiService.getPaymentTypeI(his_hsp_tp_cd, patient_info.out_pt_no);

      if (paymentListI != null) {
        for (let el in paymentListI) {
          paymentListI[el] = getArrFirstData(paymentListI[el]);
        }

        if(paymentListI.OUT_PAYGUBN == pay_type || pay_type == 'A'){
          list.push(paymentListI);
        }
      }
      return list;
    }catch (e) {
      this.logger.error(`진단서/소견서 요청 ERR : ${e}`);
      throw e;
    }
  }








}
