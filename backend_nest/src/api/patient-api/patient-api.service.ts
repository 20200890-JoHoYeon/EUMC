import { Injectable, Logger, Query } from "@nestjs/common";
import * as moment from "moment-timezone";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { CommonCodeConst, PDF_GEN_API_TYPE } from "../../const/common-code.const";
import { getArrFirstData } from "../../utils/string.util";
import { PatientInfo } from "./dto/patient-info.interface";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { ReqHomepagePtSear } from "../emr-soap-api/dto/req-homepage-pt-sear.interface";
import { ReqHomepagePtTelInsert } from "../emr-soap-api/dto/req-homepage-pt-tel-insert.interface";
import { ReqInternetCtfsModifyTelno } from "../emr-soap-api/dto/req-internet-ctfs-modify-telno.interface";

@Injectable()
export class PatientApiService {
  private readonly logger = new Logger(PatientApiService.name);

  constructor(private kioskWebServiceApiService: KioskWebServiceApiService,
              private emrSoapApiService: EmrSoapApiService) {
  }







  async getPatientInfo(pat_no: string): Promise<PatientInfo>{
    this.logger.debug(`환자정보 START : ${pat_no}`);
    try{
      const result = {} as PatientInfo;
      const resp = await this.kioskWebServiceApiService.getPatientInfo(pat_no);
      //resp.data.string.NewDataSet[0].Table00[0]
      const processed = resp.Table00;

      if(processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            result[el.toLowerCase()] = getArrFirstData(data[el]);
          }
        });

        let century = '';
        let chk_num = result.out_ssn.substring(6,7);
        switch (chk_num) {
          case '1':
          case '2':
          case '5':
          case '6':
            century = "19";
            break;
          case '3':
          case '4':
          case '7':
          case '8':
            century = "20";
            break;
        }
        chk_num = Number(chk_num) % 2 == 0 ? '2' : '1';

        let birth = result.out_ssn.substring(0, 6);
        result.birth = century + birth.substring(0, 2) + "-" + birth.substring(2, 4) + "-" + birth.substring(4);
        result.gender = chk_num;

        result.resno1 = result.out_ssn.substring(0, 6);
        result.resno2 = result.out_ssn.substring(6, 13);
        result.address = '';
        result.telno = '';
        result.zipcd = '';

      }else{
        // 정보없음
      }


      return result;
    }catch (e) {
      this.logger.error(`환자정보 ERR : ${e}`);
      throw e;
    }
  }


  async checkPatientInfo(nm: string, birth: string, pt_no: string){
    this.logger.debug(`환자정보체크 START : ${nm}, ${birth}, ${pt_no}`);
    try{
      let resp = await this.emrSoapApiService.InternetCtfsPatInfo_2({
        HNGNM: nm,
        BIRTHDAY: birth,
        PT_NO: pt_no
      } );
      let callResp = resp.ArrayOfInternetCtfsPatInfo.InternetCtfsPatInfo;
      if(callResp != null && callResp.length > 0) {
        for (const item of callResp) {
          for (let el in item) {
            item[el] = getArrFirstData(item[el]);
          }
        }
        return callResp;
      }else{
        throw `환자정보가 없음`;
      }
    }catch (e) {
      this.logger.error(`환자정보체크 ERR : ${e}`);
      throw e;
    }
  }



  async checkHoliday(hisHspTpCd: string, checkDate?: string){
    this.logger.debug(`휴일체크 START : ${hisHspTpCd}, ${checkDate}`);
    try{
      return await this.kioskWebServiceApiService.checkHoliday(hisHspTpCd)
    }catch (e) {
      this.logger.error(`휴일체크 ERR : ${e}`);
      throw e;
    }
  }




  async getPharmInfo(hisHspTpCd: string, checkDate: string){
    this.logger.debug(`휴일체크 START : ${hisHspTpCd}, ${checkDate}`);
    try{
      return await this.kioskWebServiceApiService.getPharmInfo(hisHspTpCd, checkDate)
    }catch (e) {
      this.logger.error(`휴일체크 ERR : ${e}`);
      throw e;
    }
  }




  async getEmail(hisHspTpCd: string, rrn: string){
    this.logger.debug(`환자 이메일 조회 START : ${hisHspTpCd}, ${rrn}`);
    try {
      const result = {};
      const resp = await this.emrSoapApiService.homepagePtSear({
        HIS_HSP_TP_CD: hisHspTpCd,
        RRN: rrn,
        HMPG_CUST_NO: ''
      } as ReqHomepagePtSear);

      const item = resp.ArrayOfHomepagePtSear.HomepagePtSear[0];
      //for (const item of resList) {
        for (let el in item) {
          result[el.toLowerCase()] = getArrFirstData(item[el]);
       // }
      }
      return result;
    }catch (e) {
      this.logger.error(`환자 이메일 조회 ERR : ${e}`);
      throw e;
    }
  }




  async updateEmail(hisHspTpCd: string, pt_no: string, email: string){
    this.logger.debug(`환자 이메일 수정 START : ${hisHspTpCd}, ${email}`);
    try{
      const resp = await this.emrSoapApiService.homepagePtTelInsert({
        HIS_HSP_TP_CD: hisHspTpCd,
        PT_NO: pt_no,
        EMAL_ADDR: email,

        LSH_STF_NO: CommonCodeConst.KISOK_ID,
        LSH_PRGM_NM: '모바일',
        REL_TP_CD: '본인',
        LSH_IP_ADDR: '172.17.1.115',

        TEL_NO: '',
        CTAD_TP_SEQ: '',
        POST_NO: '',
        BSC_ADDR: '',
        DTL_ADDR: '',
        PT_REL_TP_CD: '',
        PT_TEL_NO: '',
        PT_POST_NO: '',
        PT_BSC_ADDR: '',
        PT_DTL_ADDR: '',
        PT_EMAL_ADDR: '',
      } as ReqHomepagePtTelInsert);








      return null;
    }catch (e) {
      this.logger.error(`환자 이메일 수정 ERR : ${e}`);
      throw e;
    }
  }


  async updateTelNo(hisHspTpCd: string, pt_no: string, tel_no: string){
    this.logger.debug(`환자 전화번호 수정 START : ${hisHspTpCd}, ${pt_no}, ${tel_no}`);
    try{
      const resp = await this.emrSoapApiService.internetCtfsModifyTelno({
        IN_HSP_TP_CD: hisHspTpCd,
        IN_PT_NO: pt_no,
        IN_TEL_NO: tel_no,

        IN_LSH_STF_NO: CommonCodeConst.KISOK_ID,
        IN_LSH_PRGM_NM: '모바일',
        IN_LSH_IP_ADDR: '172.17.1.114',
      } as ReqInternetCtfsModifyTelno);


      return null;
    }catch (e) {
      this.logger.error(`환자 전화번호 수정 ERR : ${e}`);
      throw e;
    }
  }



}

