import { Injectable, Logger } from "@nestjs/common";
import { RespMedDept } from "../med-dept-api/dto/resp-med-dept.interface";
import { HttpService } from "@nestjs/axios";
import { MailSenderService } from "../../common/services/mail-sender.service";
import { PdfGenerateService } from "../../common/services/pdf-generate.service";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { ReqBilWebService } from "../emr-soap-api/dto/req-bil-web-service.dto";
import { KioskServiceCodeConst } from "../../const/kiosk-service-code.const";
import { CommonCodeConst } from "../../const/common-code.const";
import { PaymentSave } from "./dto/payment-save.interface";
import { PaymentSaveI } from "./dto/payment-save-i.interface";
import * as fs from "fs";
import { parseToJson } from "../../utils/xml.util";
import { CommonConfService } from "../../config/common-conf.service";
import { ReqBillService15X } from "./dto/req-bill-service-15x.interface";
import { PharmInfo } from "./dto/pharm-info.interface";
import { PharmDetail } from "./dto/pharm-detail.interface";
import { McstPymcFmtDto } from "./dto/mcst-pymc-fmt.dto";
import { ReqBillService16X } from "./dto/req-bill-service-16x.interface";
import { McstDtlPtclInfoDto } from "./dto/mcst-dtl-ptcl-info.dto";
import { McstDtoPtclInfoDto } from "./dto/mcst-dto-ptcl-info.dto";
import * as moment from "moment-timezone";
import { PaymentODetail } from "../payment-api/dto/payment-o-detail.interface";

@Injectable()
export class KioskWebServiceApiService {
  private readonly logger = new Logger(KioskWebServiceApiService.name);

  constructor(
    private commonConfService: CommonConfService,
    private httpService: HttpService,
    private emrSoapApiService: EmrSoapApiService,
  ) {}

  /**
   * 공통-병원(요양기관) 정보 요청
   * @param hsp_tp_cd
   */
  async getHospitalInfo(hsp_tp_cd: string) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_HOSPITAL_INFO START`);
    try{
      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_HOSPITAL_INFO, [
        hsp_tp_cd
      ]);

      return await this.emrSoapApiService.bilWebService(req);
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_HOSPITAL_INFO ERR : ${e}`);
    }
  }

  /**
   * 공통-환자정보 데이터 요청
   * @param pat_no
   * @param kiosk_id
   */
  async getPatientInfo(pat_no: string, kiosk_id: string = CommonCodeConst.KISOK_ID) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_CHECK_PATIENT START`);
    try{
      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_CHECK_PATIENT, [
        pat_no,
        kiosk_id
      ]);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_CHECK_PATIENT.xml', 'utf8');
        return await parseToJson(xml);
      }else{
        let data = await this.emrSoapApiService.bilWebService(req);
        data =  await parseToJson(data.string._);
        return data.NewDataSet;
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_CHECK_PATIENT : ${e}`);
    }
  }

  /**
   * 외래-수납 내역 데이터 요청 (중복 없는 진료과에 따른 data - 최대 진료과 3개까지 노출)
   * @param hsp_tp_cd
   * @param pat_no
   * @param kiosk_id
   */
  async getPaymentTypeO(hsp_tp_cd: string, pat_no: string, kiosk_id: string = CommonCodeConst.KISOK_ID) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_O START`);
    try{
      // if(pat_no == '16388130') { //박시온
      //   const json = fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYMENT_TYPE_O.json', 'utf8');
      //   let tmp = JSON.parse(json);
      //   this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_O DUMMY : ${JSON.stringify(tmp)}`);
      //   tmp = await parseToJson(tmp.string._);
      //   return tmp.NewDataSet;
      // }

      const param = new Array(62);
      param[0] = hsp_tp_cd;
      param[1] = pat_no;
      param[2] = kiosk_id;
      param[61] = "Y";  // 당일 여부 (Y : 당일, N : 전체)


      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYMENT_TYPE_O, param);

      let data = await this.emrSoapApiService.bilWebService(req);
      data =  await parseToJson(data.string._);
      return data.NewDataSet;
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_O : ${e}`);
    }
  }

  /**
   * 외래-수납 내역 데이터 요청 (각 진료과코드에 해당하는 data 리턴)
   * @param hsp_tp_cd
   * @param pat_no
   * @param pat_nm
   * @param med_dept
   * @param kiosk_id
   */
  async getPaymentTypeODetail(hsp_tp_cd: string, pat_no: string, pat_nm: string, med_dept:string,  kiosk_id: string = CommonCodeConst.KISOK_ID) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_O_DETAIL START`);
    try{
      // if(pat_no == '16388130') { // 박시온
      //   const json = fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYMENT_TYPE_O_DETAIL.json', 'utf8');
      //   let tmp = JSON.parse(json);
      //   this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_O_DETAIL DUMMY : ${JSON.stringify(tmp)}`);
      //   tmp = await parseToJson(tmp.string._);
      //   return tmp.NewDataSet.Table0;
      // }


      const param = new Array(7);
      param[0] = hsp_tp_cd;
      param[1] = pat_no;
      param[2] = pat_nm;
      param[3] = med_dept; // 진료과 코드
      param[4] = kiosk_id;
      param[5] = "Y";
      param[6] = "Y";  // 당일 여부 (Y : 당일, N : 전체)


      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYMENT_TYPE_O_DETAIL, param);

      let data = await this.emrSoapApiService.bilWebService(req);
      data =  await parseToJson(data.string._);
      return data.NewDataSet.Table0;
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_O_DETAIL : ${e}`);
    }
  }



  /**
   * 입퇴원-수납내역 데이터 요청
   * @param hsp_tp_cd
   * @param pat_no
   * @param kiosk_id
   */
  async getPaymentTypeI(hsp_tp_cd: string, pat_no: string, kiosk_id: string = CommonCodeConst.KISOK_ID) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_I START`);
    try{
      const param = new Array(3);
      param[0] = hsp_tp_cd;
      param[1] = pat_no;
      param[2] = kiosk_id;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYMENT_TYPE_I, param);

      let data = await this.emrSoapApiService.bilWebService(req);
      data =  await parseToJson(data.string._);
      return data.NewDataSet;
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENT_TYPE_I : ${e}`);
    }
  }

  /**
   * 외래-외래비 수납 저장 요청
   */
  async reqPaymentSaveTypeO(saveData: PaymentSave, rcp_type: string, birth_day: string, kiosk_id: string = CommonCodeConst.KISOK_ID) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENTSAVE_TYPE_O START`);
    try{
      const param = saveData.generateInputArr(rcp_type, birth_day, kiosk_id);
      const chkIndex = [
        0,1,2,3,7,11,12,13,14,15,17,18,20,21,23,57,61,63,64,65,66,67,68,69,70,71,72,83
      ];

      for(var i = 0; i < chkIndex.length; i++){
        if(typeof(param[chkIndex[i]]) == 'undefined' || param[chkIndex[i]] == null || param[chkIndex[i]] == ''){
          throw '외래비 수납 요청 파라메터 오류 idx : ' + chkIndex[i];
        }
      }

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYMENTSAVE_TYPE_O, param);

      let data = await this.emrSoapApiService.bilWebService(req);
      data =  await parseToJson(data.string._);
      return data.NewDataSet;
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENTSAVE_TYPE_O : ${e}`);
      throw e;
    }
  }

  /**
   * 입퇴원-입원중간비 수납 저장 요청
   */
  async getPaymentSaveTypeIB(rcp_type: string, saveData: PaymentSaveI, kiosk_id: string = CommonCodeConst.KISOK_ID) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENTSAVE_TYPE_I_B START`);
    try{
      let birth_day; // patientService

      const param = saveData.generateInputArr(rcp_type, kiosk_id);
      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYMENTSAVE_TYPE_I_B, param);

      return await this.emrSoapApiService.bilWebService(req);
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENTSAVE_TYPE_I_B : ${e}`);
    }
  }

  async getPaymentSaveTypeIS(rcp_type: string, kiosk_id: string = CommonCodeConst.KISOK_ID, saveData: PaymentSaveI) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENTSAVE_TYPE_I_S START`);
    try{
      let birth_day; // patientService

      const param = saveData.generateInputArr(rcp_type, kiosk_id);
      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYMENTSAVE_TYPE_I_S, param);

      return await this.emrSoapApiService.bilWebService(req);
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYMENTSAVE_TYPE_I_B : ${e}`);
    }
  }



  /**
   * 제증명-재출력 영수증 내역 데이터 요청
   * @param hsp_tp_cd
   * @param pat_no
   * @param from_date
   * @param to_date
   * @param kiosk_id
   */
  async getReceiptList(hsp_tp_cd: string, pat_no: string, from_date: string, to_date: string) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_LIST START`);
    try{
      const param = new Array(6);
      param[0] = hsp_tp_cd;
      param[1] = pat_no;
      param[2] = '';
      param[3] = 'O';
      param[4] = from_date;
      param[5] = to_date;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_RECEIPT_LIST, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_RECEIPT_LIST.xml', 'utf8');
        let data = await parseToJson(xml); return data.string;
      }else{
        const result = await this.emrSoapApiService.bilWebService(req);
        // result.string._ = result.string._.replace('</NewDataSet>', '</Table0></NewDataSet>');
        return await parseToJson(result.string._);
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_LIST : ${e}`);
    }
  }



  /**
   * 제증명-재출력 영수증 내역 데이터 요청
   * @param hsp_tp_cd
   * @param patno
   * @param rcptype
   * @param meddept
   * @param pay_complete
   * @param date
   */
  async getReceiptListPDF(hsp_tp_cd: string, patno: string, rcptype: string, meddept: string, pay_complete: string, date: string) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_LIST START`);
    try{
      const param = new Array(6);
      param[0] = hsp_tp_cd;
      param[1] = patno;
      param[3] = rcptype == "1" ? "O" : "I";

      if(pay_complete == '1') {
        param[2] = meddept;
        param[4] = moment().format("yyyyMMDD");
        param[5] = moment().format("yyyyMMDD");
      }else{
        param[2] = '';
        param[4] = moment().add(-3).format("yyyyMMDD");
        param[5] = moment().format("yyyyMMDD");
      }

      if(date != null && date != '') {
        if(rcptype == '1'){
          param[2] = '';
          param[4] = date.substring(0, 8);
          param[5] = date.substring(0, 8);
        }else{
          param[2] = '';
          param[4] = date.substring(0, 8);
          param[5] = date.substring(8, 16);
        }
      }

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_RECEIPT_LIST, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_RECEIPT_LIST.xml', 'utf8');
        let data = await parseToJson(xml); return data.string;
      }else{
        const result = await this.emrSoapApiService.bilWebService(req);
        return await parseToJson(result.string._);
        // result.string._ = result.string._.replace('</NewDataSet>', '</Table0></NewDataSet>');
        // return await parseToJson(result.string._);
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_LIST : ${e}`);
    }
  }


  /**
   * 외래-외래비 영수증 full(header+detail) 데이터 요청
   * @param body
   */
  async getReceiptTypeOList(body: ReqBillService15X) {
    this.logger.log(`[KIOSK-WEB-API] SERVICE_RECEIPT_TYPE_O START`);
    try{
      const param = new Array(13);
      param[0] = body.hsp_tp_cd;
      param[1] = body.rpy_pact_id;
      param[2] = body.rpy_cls_seq;
      param[3] = body.pt_no;
      param[4] = body.med_dt;
      param[5] = body.ord_dt;
      param[6] = body.medr_sid;
      param[7] = body.med_dept_cd;
      param[8] = body.patsite;
      param[9] = body.orpy_cls_cd;
      param[10] = body.rpy_seq;
      param[11] = body.rpy_seq2;
      param[12] = body.rpy_stf_no;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_RECEIPT_TYPE_O, param);

      // if(this.commonConfService.IS_EMR_TEST_DATA){
      //   const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_RECEIPT_LIST_TYPE_O.xml', 'utf8');
      //   let data = await parseToJson(xml); return data.string;
      // }else{
        let result = await this.emrSoapApiService.bilWebService(req);
        result =  await parseToJson(result.string._);
        return result.NewDataSet;

      // }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_TYPE_O : ${e}`);
    }
  }


  /**
   * 입퇴원-입퇴원 영수증 full(header+detail) 데이터 요청
   * @param body
   */
  async getReceiptTypeIList(body: ReqBillService15X) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_TYPE_I START`);
    try{
      const param = new Array(9);
      param[0] = body.pt_no;
      param[1] = body.hsp_tp_cd;
      param[2] = body.rpy_pact_id;
      param[3] = body.rpy_cls_seq;
      param[4] = '';
      param[5] = body.apy_str_dt;
      param[6] = body.apy_end_dt;
      param[7] = body.cal_apy_str_dt;
      param[8] = body.cal_apy_end_dt;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_RECEIPT_TYPE_I, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_RECEIPT_LIST_TYPE_I.xml', 'utf8');
        let data = await parseToJson(xml); return data.string;
      }else{
        return await this.emrSoapApiService.bilWebService(req);
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_TYPE_I : ${e}`);
    }
  }


  /**
   * 입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청
   * @param hsp_tcp_cd
   * @param pat_no
   * @param adm_date
   * @param payment_date
   */
  async getReceiptTypeIBList(hsp_tcp_cd: string, pat_no: string, adm_date: string, payment_date: string) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_TYPE_I_B START`);
    try{
      const param = new Array(8);
      param[0] = hsp_tcp_cd;
      param[1] = pat_no;
      param[2] =payment_date;
      param[3] = '0';
      param[4] = 'I';
      param[5] = adm_date;// 입원일자
      param[6] = '24';
      param[7] = 'Y';// 수납구분 (Y:카드, C:현금영수증, N:현금)

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_RECEIPT_TYPE_I_B, param);

      // if(this.commonConfService.IS_EMR_TEST_DATA){
      //   const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_RECEIPT_TYPE_I_B.xml', 'utf8');
      //   let data = await parseToJson(xml); return data.string;
      // }else{
        return await this.emrSoapApiService.bilWebService(req);
      // }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_RECEIPT_TYPE_I_B : ${e}`);
    }
  }

  /**
   * 외래-원외처방전 내역 데이터 요청
   * @param hsp_tcp_cd
   * @param pat_no
   */
  async getPharmInfo(hsp_tcp_cd: string, pat_no: string) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PHARM_INFO START`);
    try{
      const param = new Array(2);
      param[0] = pat_no;
      param[1] = hsp_tcp_cd;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PHARM_INFO, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PHARM_INFO.xml', 'utf8');
        let data = await parseToJson(xml); return data.string;
      }else{
      const result = await this.emrSoapApiService.bilWebService(req);
      const resArr = [] as Array<PharmInfo>;


      return result;
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PHARM_INFO : ${e}`);
    }
  }


  /**
   * 외래-원외처방전 full(header+detail) 데이터 요청 (각 투약번호에 해당하는 data 리턴)
   * @param hsp_tcp_cd
   * @param pat_no
   * @param ord_dt
   * @param ams_no
   * @param pact_id
   */
  async getPharmDetail(hsp_tcp_cd: string, pat_no: string, ord_dt: string, ams_no: string, pact_id: string) {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PHARM_DETAIL START`);
    try{
      const param = new Array(8);
      param[0] = pat_no;
      param[1] = ord_dt;
      param[2] = ams_no;
      param[3] = 'N';
      param[4] = hsp_tcp_cd;
      param[5] = '';
      param[6] = 'N';
      param[7] = pact_id;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PHARM_DETAIL, param);

      //TODO: dev서버에 있는 데이터라서 일단 더미로 표시
     if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PHARM_DETAIL.xml', 'utf8');
        let data = await parseToJson(xml);
        return data.string.NewDataSet[0];
      }else{
        let result = await this.emrSoapApiService.bilWebService(req);
        result =  await parseToJson(result.string._);
        return result.NewDataSet;
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PHARM_DETAIL : ${e}`);
    }
  }


  /**
   * 제증명-진료비납입확인 내역 데이터 요청
   * @param hsp_tcp_cd
   * @param pat_no
   * @param from_date
   * @param to_date
   * @param password
   */
  async getMcsPymCfmt(hsp_tcp_cd: string, pat_no: string, from_date: string, to_date: string, password: string): Promise<Array<McstPymcFmtDto>> {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYCONF_LIST START`);
    try{
      const param = new Array(5);
      param[0] = hsp_tcp_cd;
      param[1] = pat_no;
      param[2] = from_date;
      param[3] = to_date;
      param[4] = '';

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYCONF_LIST, param);

      // if(this.commonConfService.IS_EMR_TEST_DATA){
      //   const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYCONF_LIST.xml', 'utf8');
      //   let data = await parseToJson(xml); return data.string;
      // }else{
      const result = await this.emrSoapApiService.bilWebService(req);
      const resArr = [] as Array<McstPymcFmtDto>;


      return resArr;
      // }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYCONF_LIST : ${e}`);
    }
  }


  /**
   * 제증명-진료비세부내역서 출력대상 조회
   * @param hsp_tcp_cd
   * @param pat_no
   * @param from_date
   * @param to_date
   */
  async getMcsPymCfmtDtl(hsp_tcp_cd: string, pat_no: string, from_date: string, to_date: string): Promise<any> {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_CHECK START`);
    try{
      const param = new Array(5);
      param[0] = hsp_tcp_cd;
      param[1] = pat_no;
      param[2] = 'I';
      param[3] = from_date;
      param[4] = to_date;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYDETAIL_CHECK, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYDETAIL_CHECK.xml', 'utf8');
        let data = await parseToJson(xml); return data.string;
      }else{
      const result = await this.emrSoapApiService.bilWebService(req);
      const resArr = [] as Array<ReqBillService16X>;


      return resArr;
       }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_CHECK : ${e}`);
    }
  }



  /**
   * 제증명-외래 진료비세부산정내역 full 데이터 요청
   * @param hsp_tcp_cd
   * @param pat_no
   * @param from_date
   * @param to_date
   */
  async getMcsPymCfmtDtlTypeO(hsp_tcp_cd: string, pat_no: string, from_date: string, to_date: string, med_dept: string): Promise<Array<McstDtoPtclInfoDto>> {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_LIST_TYPE_O START`);
    try{
      const param = new Array(9);
      param[0] = hsp_tcp_cd;
      param[1] = pat_no;
      param[2] = from_date;
      param[3] = to_date;
      param[4] = med_dept;
      param[5] = 'Y';
      param[6] = '0';
      param[7] = '0';
      param[8] = 'Y';

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYDETAIL_LIST_TYPE_O, param);

      // if(this.commonConfService.IS_EMR_TEST_DATA){
      //   const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYDETAIL_LIST_TYPE_O.xml', 'utf8');
      //   let data = await parseToJson(xml); return data.string;
      // }else{
      const result = await this.emrSoapApiService.bilWebService(req);
      const resArr = [] as Array<McstDtoPtclInfoDto>;


      return resArr;
      // }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_LIST_TYPE_O : ${e}`);
    }
  }



  /**
   * 제증명-입원 진료비세부산정내역 full 데이터 요청
   * @param hsp_tcp_cd
   * @param rpy_pact_id
   * @param med_rsv_dtm
   * @param from_date
   * @param to_date
   */
  async getMcsPymCfmtDtlTypeI(hsp_tcp_cd: string, rpy_pact_id: string, med_rsv_dtm: string, from_date: string, to_date: string): Promise<Array<McstDtlPtclInfoDto>> {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_LIST_TYPE_I START`);
    try{
      const param = new Array(9);
      param[0] = hsp_tcp_cd;
      param[1] = rpy_pact_id;
      param[2] = med_rsv_dtm;
      param[3] = '0';
      param[4] = from_date;
      param[5] = to_date;
      param[6] = '0';
      param[7] = 'NULL';
      param[8] = '1';

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYDETAIL_LIST_TYPE_I, param);

      // if(this.commonConfService.IS_EMR_TEST_DATA){
      //   const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYDETAIL_LIST_TYPE_I.xml', 'utf8');
      //   let data = await parseToJson(xml); return data.string;
      // }else{
      const result = await this.emrSoapApiService.bilWebService(req);
      const resArr = [] as Array<McstDtlPtclInfoDto>;


      return result;
      // }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_LIST_TYPE_I : ${e}`);
    }
  }


  /**
   * 보험청구용 진료비 세부 내역서
   * result.NewDataSet.Table0 - Array<McstDtoPtclInfoDto>
   * @param hsp_tcp_cd
   * @param pat_no
   * @param pact_id
   * @param salary_type 급여구분 - "0":전체,"1":비급여만
   */
  async getMcsPymCfmtDtlType170(hsp_tcp_cd: string, pat_no: string, pact_id: string, salary_type: string = '0') {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_LIST_170 START`);
    try{
      const param = new Array(5);
      param[0] = hsp_tcp_cd;
      param[1] = pact_id;
      param[2] = pat_no;
      param[3] = salary_type;//급여구분 - "0":전체,"1":비급여만

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_PAYDETAIL_LIST_170, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_PAYDETAIL_LIST_170.xml', 'utf8');
        const result = await parseToJson(xml);
        // const resArr = [] as Array<McstDtoPtclInfoDto>;
        // result.NewDataSet.Table0

        return result;
      }else{
        const result = await this.emrSoapApiService.bilWebService(req);
        const resArr = [] as Array<McstDtoPtclInfoDto>;

        return result;
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_PAYDETAIL_LIST_170 : ${e}`);
    }
  }



  /**
   * 보험청구용 진료비 세부 내역서
   * @param hsp_tcp_cd
   * @param check_date
   */
  async checkHoliday(hsp_tcp_cd: string, check_date: string = moment().format('yyyyMMDD')): Promise<boolean> {
    this.logger.error(`[KIOSK-WEB-API] SERVICE_CHECK_HOLIDAY_171 START`);
    try{
      const param = new Array(2);
      param[0] = hsp_tcp_cd;
      param[1] = check_date;

      const req = new ReqBilWebService(KioskServiceCodeConst.SERVICE_CHECK_HOLIDAY_171, param);

      if(this.commonConfService.IS_EMR_TEST_DATA){
        const xml =  fs.readFileSync('src/api/emr-soap-api/dummy/KioskWebService_SERVICE_CHECK_HOLIDAY_171.xml', 'utf8');
        const resp = await parseToJson(xml);
        return (typeof(resp.string.NewDataSet[0].Table0[0].HDY_YN[0]) != 'undefined') ? resp.string.NewDataSet[0].Table0[0].HDY_YN[0] : false;
      }else{
      const resp = await this.emrSoapApiService.bilWebService(req);
      let data = await parseToJson(resp.string._);
      return (typeof(data.Table0[0].HDY_YN[0]) != 'undefined') ? data.NewDataSet[0].Table0[0].HDY_YN[0] : false
      }
    }catch (e) {
      this.logger.error(`[KIOSK-WEB-API] SERVICE_CHECK_HOLIDAY_171 : ${e}`);
    }
  }



}
