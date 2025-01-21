import { Injectable, Logger, Query } from "@nestjs/common";
import { ReqReservation } from "./dto/req-reservation.interface";
import { ReqReservationInfoMeddtm } from "./dto/req-reservation-info-meddtm.interface";
import { ReqReservationInfoMeddtmtm } from "./dto/req-reservation-info-meddtmtm.interface";
import { ReceiptDetail } from "../receipt-api/dto/receipt-detail.interface";
import { CertApiService } from "../cert-api/cert-api.service";
import { PaymentApiService } from "../payment-api/payment-api.service";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { InjectRepository } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../../entities/eumc-waiting-number.eumc-entity";
import { MoreThan, Repository } from "typeorm";
import { EumcRsvNotMeEumcEntity } from "../../entities/eumc-rsv-not-me.eumc-entity";
import * as moment from "moment-timezone";
import { ReservationInfo } from "./dto/reservation-info.interface";
import { ReservationMedDept } from "./dto/reservation-med-dept-list.interface";
import { ReqHomepageMedCode } from "../emr-soap-api/dto/req-homepage-med-code.interface";
import { McstPymcFmtDto } from "../cert-api/dto/mcst-pymc-fmt.dto";
import { ReqInternetMcstPymcFmt } from "../emr-soap-api/dto/req-internet-mcst-pymc-fmt.interface";
import { getArrFirstData } from "../../utils/string.util";
import { ReqHomepageExamRsvList } from "../emr-soap-api/dto/req-homepage-exam-rsv-list.interface";
import { ReqHomepageMedResvCancel } from "../emr-soap-api/dto/req-homepage-med-resv-cancel.interface";
import { CommonCodeConst } from "../../const/common-code.const";
import { ReqHomepageMedRsvList } from "../emr-soap-api/dto/req-homepage-med-rsv-list .interface";
import { ReservationExamInfo } from "./dto/reservation-exam-info";
import { ReqRsvToday } from "./dto/req-rsv-today.interface";
import { RespScheduleInfo2 } from "./dto/resp-schedule-info2.interface";
import { ReqHomepageMedDocCode } from "../emr-soap-api/dto/req-homepage-med-doc-code.interface";
import { ReqHomepageMedSchd } from "../emr-soap-api/dto/req-homepage-med-schd.interface";
import { ReqHomepageMedDtm } from "../emr-soap-api/dto/req-homepage-med-dtm.interface";
import {
  ReqInternetDeptRoomArrivalConfirm
} from "../emr-soap-api/dto/req-internet-dept-room-arrival-confirm.interface";
import { EumcWaitingMeddeptEumcEntity } from "../../entities/eumc-waiting-meddept.eumc-entity";
import { RespMedDept } from "../med-dept-api/dto/resp-med-dept.interface";
import {
  ReqInternetDeptRoomArrivalConfirmNew
} from "../emr-soap-api/dto/req-internet-dept-room-arrival-confirm-new.interface";


@Injectable()
export class ReservationApiService {
  private readonly logger = new Logger(ReservationApiService.name);
  // public doctorProfiles = new Map();

  constructor(
    private emrSoapApiService : EmrSoapApiService,
    @InjectRepository(EumcRsvNotMeEumcEntity, 'eumc_pay')
    private rsvNotMeRepo: Repository<EumcRsvNotMeEumcEntity>,
    @InjectRepository(EumcWaitingMeddeptEumcEntity, 'eumc_pay')
    private rsvMeddeptRepo: Repository<EumcWaitingMeddeptEumcEntity>
  ) {
    // this.doctorProfiles = new Map();
  }





  async deleteRsv(his_hsp_tp_cd: string, pat_no: string, rpy_pact_id: string, dept_cd: string) {
    this.logger.debug(`예약 취소 START`);
    try{

      let req = {
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PACT_ID: rpy_pact_id,
        IN_PT_NO: pat_no,
        IN_MED_DEPT_CD: dept_cd,
        IN_LSH_STF_NO: CommonCodeConst.KISOK_ID,
        IN_LSH_PRGM_NM: '모바일예약접수',
        IN_LSH_IP_ADDR: '172.16.1.115' //TODO: IP체크해보기
      } as ReqHomepageMedResvCancel;

      const callResp = await this.emrSoapApiService.homepageMedRsvCancel(req);
      this.logger.debug(`예약 취소 : ${JSON.stringify(callResp)}`);
      if(callResp != null) {
        return true;
      }else{
        return false;
      }
    }catch (e){
      this.logger.error(`예약 취소 ERR : ${e}`);
      throw e;
    }
  }

  /**
   * 진료 예약 내역 조회
   *
   * 예약 내역은 당일 기준 추후 3개월 이내의 예약 내역만 조회.
   * 2019.11.28 목동병원 원무과 김성길 계장 요청으로 기존 3개월에서 12개월로 확대
   *
   * @return
   * @param body
   * @param type
   */
  async getTodayRsv(body: ReqRsvToday, type: string): Promise<Array<RespScheduleInfo2>> {
    try{
      let callResp = null;
      if(type == 'ALL') { // 전체일정
        callResp = await this.reqRsvList({
          IN_RPY_PACT_ID: '',
          IN_PT_NM: '',
          IN_HSP_TP_CD: body.IN_HSP_TP_CD,
          IN_HMPG_CUST_NO: body.IN_PT_NO,
          IN_PT_NO: body.IN_PT_NO,
          IN_APCN_YN: 'N',
          IN_STR: '1',
          IN_END: '100',
          IN_APY_DT: body.IN_FROM_DT,
        } as ReqHomepageMedRsvList, false);
        callResp = callResp.ArrayOfHomepageMedRsvList.HomepageMedRsvList;

        if(callResp != null){
          for (const item of callResp) {
            for (let el in item) {
              item[el] = getArrFirstData(item[el]);
            }

            item['MEDR_NM'] = item['MED_NM']; //
            item['MED_DT'] = item['MED_DT']; // 2023-12-29 -> 2023년 12월 29일
            item['MED_TM'] = item['MED_DTM']; // 1315 ->  오후 01시 15분
            item['SEL_TYPE'] = '진료';
          }
        }else{
          callResp = [];
        }
      }else {
        body.IN_QUREY_TYPE = '3';

        if(type == 'TODAY') { // 오늘일정만
          body.IN_DUMMY1 = '2';
          body.IN_FROM_DT = moment().format('yyyyMMDD');
          body.IN_TO_DT = moment().format('yyyyMMDD');
        }
        else { // 다가오는 일정만
          body.IN_DUMMY1 = '1';
        }

        callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_TODOLIST(body);
        callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_TODOLIST.MOBILEINTERFACE_SEL_TODOLIST;

        if(callResp != null){
          for (const item of callResp) {
            for (let el in item) {
              item[el] = getArrFirstData(item[el]);
            }
          }
        }else{
          callResp = [];
        }
      }


      this.logger.debug(`getTodayRsv ${callResp}`)

      return callResp;
    }catch (e) {
      this.logger.error(`getTodayRsv err ${e}`)
      return []
    }
  }




  /**
   * 진료 예약 내역 조회
   *
   * 예약 내역은 당일 기준 추후 3개월 이내의 예약 내역만 조회.
   * 2019.11.28 목동병원 원무과 김성길 계장 요청으로 기존 3개월에서 12개월로 확대
   *
   * @return
   * @param body
   * @param only_today
   */
  async reqRsvList(body: ReqHomepageMedRsvList, only_today: boolean) {
    if(only_today)  body.IN_END_DT = moment().format('yyyyMMDD')
    else body.IN_END_DT = moment().add('12', 'M').format("yyyyMMDD");

    let callResp =  await this.emrSoapApiService.homepageMedRsvList(body);
    this.logger.debug(`reqRevList ${callResp}`)

    return callResp;
  }

  async getExamHistory(body: ReqRsvToday) {
    this.logger.debug(`진료이력 START`);
    body.IN_QUREY_TYPE = '2';
    body.IN_DUMMY1 = '';

    /**
     * ACPT_DT : 검사접수일자
     * EXM_CTG_ABBR_NM : 검사 분류명
     * EXM_CTG_CD : 검사실코드/검사코드
     * PT_NO : 등록번호
     * SPCM_NO : 검체번호 [진단검사(혈액검사) 의 경우]
     */

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_EXRMLIST(body);
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_EXRMLIST.MOBILEINTERFACE_SEL_EXRMLIST;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`진료이력 :  ${callResp}`)

    return callResp;
  }


  async getExamHistoryDtl(body: ReqRsvToday) {
    this.logger.debug(`진료이력 START`);
    body.IN_QUREY_TYPE = '5';
    body.IN_DUMMY1 = '';

    /**
     * ACPT_DT : 검사접수일자
     * EXM_CTG_ABBR_NM : 검사 분류명
     * EXM_CTG_CD : 검사실코드/검사코드
     * PT_NO : 등록번호
     * SPCM_NO : 검체번호 [진단검사(혈액검사) 의 경우]
     */

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_EXRMLIST(body);
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_EXRMLIST.MOBILEINTERFACE_SEL_EXRMLIST;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }

        // <ACPT_DT>2023-03-20 오전 12:00:00</ACPT_DT>
        // <EXM_CTG_ABBR_NM>CT 촬영실 4</EXM_CTG_ABBR_NM>
        // <EXM_CTG_CD>RDC10</EXM_CTG_CD>
        // <PT_NO>10783804</PT_NO>
        // <SPCM_NO/>
        item.HSP_TP_NM = (body.IN_HSP_TP_CD == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? '이대서울병원' : '이대목동병원';

        let detail = {
          HSP_TP_NM: (body.IN_HSP_TP_CD == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? '이대서울병원' : '이대목동병원',
          DEPT_NM: '',
          MEDR_NM: '',
          MED_DT: '',
        }

        let target_date = item.ACPT_DT.split(' ')[0];
        target_date = target_date.replace(/-/gi, '');

        if (typeof (item.SPCM_NO) != 'undefined' && item.SPCM_NO != '') {
          item.TYPE = 'DIAG';
          item.TYPE_LABEL = '진단검사(혈액검사)';
          /**
           * <ACPT_DT>2023-04-12 오전 12:00:00</ACPT_DT>
           * <EXM_CTG_ABBR_NM>일반화학면역</EXM_CTG_ABBR_NM>
           * <EXRS_CNTE>31.5</EXRS_CNTE>
           * <EITM_ABBR>ASO</EITM_ABBR>
           * <EXRS_UNIT>IU/mL</EXRS_UNIT>
           * <SREFVAL>0~166</SREFVAL>
           */
          detail = await this.getExamCpDetail(body.IN_HSP_TP_CD, body.IN_PT_NO, item.SPCM_NO, item.EXM_CTG_CD);
        } else {
          item.TYPE = 'TEST';
          item.TYPE_LABEL = '영상/과내검사';
          /**
           * <HSP_TP_NM>이대서울병원</HSP_TP_NM>
           * <EXRM_NM>일반촬영실 1</EXRM_NM>
           * <DEPT_NM>직업환경의학과</DEPT_NM>
           * <EXRM_TYPE>Spine</EXRM_TYPE>
           * <EXRM_DT>2023-03-20 오전 12:00:00</EXRM_DT>
           * <MEDR_NM>김세은</MEDR_NM>
           */
          detail = await this.getExamDetail(body.IN_HSP_TP_CD, body.IN_PT_NO, item.EXM_CTG_CD, target_date);
        }

        item.DETAIL = detail;
      }
    }
    this.logger.debug(`진료이력 :  ${callResp}`)

    return callResp;
  }



  async getExamDetail(hsp_tp_cd: string, pt_no: string, code: string, search_dt: string) {
    this.logger.debug(`진료상세 START`);

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_EXRMDETAIL({
      IN_SEL_TYPE: 1,
      IN_HSP_TP_CD: hsp_tp_cd,
      IN_PT_NO: pt_no,
      IN_SRC_STR_DT: search_dt,
      IN_CODE: code,
    });

    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_EXRMDETAIL.MOBILEINTERFACE_SEL_EXRMDETAIL;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`진료상세 :  ${callResp}`)

    return callResp;

  }

  async getExamCpDetail(hsp_tp_cd: string, pt_no: string, code: string, code2: string) {
    this.logger.debug(`진료 검사상세 START`);

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_CP_EXRMDETAIL({
      IN_SEL_TYPE: 2,
      IN_HSP_TP_CD: hsp_tp_cd,
      IN_PT_NO: pt_no,
      IN_SRC_STR_DT: '',
      IN_CODE: code,
      IN_CODE2: code2
    });

    /**
     * <ArrayOfMOBILEINTERFACE_SEL_CP_EXRMDETAIL xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tempuri.org/">
     * <MOBILEINTERFACE_SEL_CP_EXRMDETAIL>
     * <ACPT_DT>2023-04-12 오전 12:00:00</ACPT_DT>
     * <EXM_CTG_ABBR_NM>일반화학면역</EXM_CTG_ABBR_NM>
     * <EXRS_CNTE>31.5</EXRS_CNTE>
     * <EITM_ABBR>ASO</EITM_ABBR>
     * <EXRS_UNIT>IU/mL</EXRS_UNIT>
     * <SREFVAL>0~166</SREFVAL>
     * </MOBILEINTERFACE_SEL_CP_EXRMDETAIL>
     * </ArrayOfMOBILEINTERFACE_SEL_CP_EXRMDETAIL>
     */

    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_CP_EXRMDETAIL.MOBILEINTERFACE_SEL_CP_EXRMDETAIL;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`진료상세 :  ${callResp}`)

    return callResp;

  }


  /**
   * IN_HSP_TP_CD
   * IN_PT_NO
   * IN_FROM_DT
   * IN_TO_DT
   * @param body
   */
  async getDrugHistoryDtl(body: ReqRsvToday) {
    this.logger.debug(`약처방 START`);
    // body.IN_QUREY_TYPE = '5';
    // body.IN_DUMMY1 = '';


    /**
     * HSP_TP_CD : 병원구분명
     * PT_HME_DEPT_CD_NM : 진료과명
     * LGL_KOR_NM : 진료의명
     * ORD_DT : 처방일
     * AMS_NO : 약제발행번호
     * PACT_ID : 접수 ID
     */
    /**
     * <ArrayOfMOBILEINTERFACE_SEL_PRSPLIST xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tempuri.org/">
     *   <MOBILEINTERFACE_SEL_PRSPLIST>
     *     <HSP_TP_CD>01</HSP_TP_CD>
     *     <PT_HME_DEPT_CD_NM>피부과</PT_HME_DEPT_CD_NM>
     *     <LGL_KOR_NM>노주영</LGL_KOR_NM>
     *     <ORD_DT>2023-04-11</ORD_DT>
     *     <AMS_NO>10463</AMS_NO>
     *     <PACT_ID>1011546741</PACT_ID>
     *   </MOBILEINTERFACE_SEL_PRSPLIST>
     */

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_PRSPLIST(body);
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_PRSPLIST.MOBILEINTERFACE_SEL_PRSPLIST;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }

        item.HSP_TP_NM = (body.IN_HSP_TP_CD == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? '이대서울병원' : '이대목동병원';

        let detail = {
          HSP_TP_NM: (body.IN_HSP_TP_CD == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? '이대서울병원' : '이대목동병원',
        }

        let target_date = item.ORD_DT.replace(/-/gi, '');
        detail = await this.getDrugDetail(body.IN_HSP_TP_CD, body.IN_PT_NO, item.PACT_ID, target_date, item.AMS_NO);
        /**
         * <ArrayOfMOBILEINTERFACE_SEL_PRSPDETAIL xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://tempuri.org/">
         * <MOBILEINTERFACE_SEL_PRSPDETAIL>
         *   <ORD_DT>2023-04-26</ORD_DT>
         *   <PT_HME_DEPT_NM>피부과</PT_HME_DEPT_NM>
         *   <WKPERS_NM>노주영</WKPERS_NM>
         *   <KPEM_MDPR_NM>씨잘정 5mg</KPEM_MDPR_NM>
         *   <ENG_MDPR_NM>Xyzal 5mg tab (Levocetirizine)</ENG_MDPR_NM>
         *   <PUTQTY>0.5</PUTQTY>
         *   <MDPR_UNIT_CD>tab</MDPR_UNIT_CD>
         *   <PRPD_NOTM>1회</PRPD_NOTM>
         *   <ABBR>1일 1회 자기전에 복용</ABBR>
         *   <WHL_PRD_DYS>21일</WHL_PRD_DYS>
         *   <PHA_QTY>10.50</PHA_QTY>
         *   <STCR_MDPR_UNIT_TP_CD>tab</STCR_MDPR_UNIT_TP_CD>
         * </MOBILEINTERFACE_SEL_PRSPDETAIL>
         */



        item.DETAIL = detail;
      }
    }
    this.logger.debug(`약처방 :  ${callResp}`)

    return callResp;
  }


  async getDrugDetail(hsp_tp_cd: string, pt_no: string, pact_id: string, ord_dt: string, ams_no: string) {
    this.logger.debug(`약처방 상세 START`);

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_PRSPDETAIL({
      IN_PACT_ID: pact_id,
      IN_HSP_TP_CD: hsp_tp_cd,
      IN_PT_NO: pt_no,
      IN_ORD_DT: ord_dt,
      IN_AMS_NO: ams_no,
    });


    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_PRSPDETAIL.MOBILEINTERFACE_SEL_PRSPDETAIL;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`약처방 상세 :  ${callResp}`)

    return callResp;

  }


  async getMedicalHistory(body: ReqRsvToday) {
    this.logger.debug(`진료이력 START`);
    body.IN_QUREY_TYPE = '1';
    body.IN_DUMMY1 = '';

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_MEDLIST(body);
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_RSVLIST.MOBILEINTERFACE_SEL_RSVLIST;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`진료이력 :  ${callResp}`)

    return callResp;

  }



  async getMedicalDetail(pact_id: string) {
    this.logger.debug(`진료상세 START`);

    let callResp =  await this.emrSoapApiService.MOBILEINTERFACE_SEL_MEDDETAIL({
      IN_QUREY_TYPE: '1', // 고정값
      IN_PACT_ID: pact_id
    });
    callResp = callResp.ArrayOfMOBILEINTERFACE_SEL_MEDDETAIL.MOBILEINTERFACE_SEL_MEDDETAIL;

    if(callResp != null && callResp.length > 0) {
      for (const item of callResp) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }
      }
    }
    this.logger.debug(`진료상세 :  ${callResp}`)

    return callResp;

  }


  async getRsvList(rpy_pact_id: string, his_hsp_tp_cd: string, pat_no: string, hmpg_cust_no: string, only_today: boolean): Promise<Array<ReservationInfo>> {
    this.logger.debug(`예약내역 조회 조회`);
    let resultArr: Array<ReservationInfo> = [];
    try{
      // 예약 조회 등록번호 관리
      let arrPatno = [];

      // 본인 등록번호 추가\
      arrPatno.push(pat_no);

      // 본인 외 예약 리스트 체크
      // 본인외 예약리스트가 앱에 보이지 않도록;
      const foundList = [];
      //   await this.rsvNotMeRepo.find({
      //   where:{
      //     hspTpCd: his_hsp_tp_cd,
      //     appPatno: pat_no,
      //     rsvDate: MoreThan(Number(moment().format('yyyyMMDD'))),
      //     // rsvDate: MoreThan(Number('20170101')),
      //   }
      // });

      // if(foundList != null && foundList.length > 0) {
      //   for (const item of foundList) {
      //     for (let el in item) {
      //       item[el] = getArrFirstData(item[el]);
      //     }
      //   }
      // }

      // 등록번호만 추가
      // 본인 외 등록번호 비교하여 리스트에 추가 (중복되지 않도록)
      arrPatno.push(
        ...foundList
          .filter((item)=> item.rsvPatno != pat_no)
          .map(item=> item.rsvPatno)
      );

      const uniqueArr = arrPatno.filter((element, index) => {
        return arrPatno.indexOf(element) === index;
      });

      this.logger.log(`uniqueArr : ${JSON.stringify(uniqueArr)}`)


      for (const arr_ptno of uniqueArr) {
        if(arr_ptno != null) {
          const idx = uniqueArr.indexOf(arr_ptno);

          let arrRsvList = await this.reqRsvList({
            IN_RPY_PACT_ID: rpy_pact_id,
            IN_HSP_TP_CD: his_hsp_tp_cd,
            IN_HMPG_CUST_NO: arr_ptno,
            IN_PT_NO: arr_ptno,
            IN_PT_NM: '',
            IN_APCN_YN: 'N',
            IN_STR: '1',
            IN_END: '100',
            IN_APY_DT: only_today ? moment().format('yyyyMMDD') : moment().add('1', 'day').format('yyyyMMDD'),

          } as ReqHomepageMedRsvList, only_today);

          this.logger.log(`arrRsvList : ${JSON.stringify(arrRsvList)}`)
          this.logger.log(`foundList : ${JSON.stringify(foundList)}`)


          arrRsvList = arrRsvList.ArrayOfHomepageMedRsvList.HomepageMedRsvList

          if(arrRsvList != null && arrRsvList.length > 0){
            for (const item of arrRsvList) {
              for (let el in item) {
                item[el] = getArrFirstData(item[el]);
              }
            }

            for (const medRsvInfo of arrRsvList) {
              // 본인 예약 내역은 전체 출력 i = 0
              if(idx == 0){
                resultArr.push(medRsvInfo);
              }else{
                // 예약 환자등록번호, 날짜, 시간 비교하여 추가
                // arrPatno.get(i).equals(arrEumcRsvNotMe.get(k).getRsvPatno())
                // && Integer.parseInt(arrRsvList.get(j).getMed_dt().replace("-", "").replace("\\r", "").trim()) == arrEumcRsvNotMe.get(k).getRsvDate()
                // && Integer.parseInt(arrRsvList.get(j).getMed_dtm().replace("\\r", "").trim()) == arrEumcRsvNotMe.get(k).getRsvTime()

                for (const item of foundList) {
                  try{
                    if (item.appPatno != arr_ptno &&
                      Number(medRsvInfo.MED_DT.replace(/-/gi, '').replace("\\r", "").trim()) == item.rsvDate
                      && Number(medRsvInfo.MED_DTM.replace(/-/gi, '').replace("\\r", "").trim()) == item.rsvTime
                    ) {
                      resultArr.push(medRsvInfo);
                      this.logger.error(`LOOP SEL : ${JSON.stringify(medRsvInfo)}`)
                    }
                  }catch(e){
                    this.logger.error(`LOOP ITEM : ${JSON.stringify(item)}`)
                    this.logger.error(e);
                  }
                } // FOR LOOP

              }// END OF ELSE
            }
          } // END OF FOR LOOP
        }
      }
    }catch (e) {
      this.logger.debug(`예약내역 조회 ERR ${e}`);
      throw e;
    }

    this.logger.error(`LOOP RESULT : ${JSON.stringify(resultArr)}`)
    return resultArr;
  }


  async requestRsvInfom(
    his_hsp_tp_cd: string,
    patno: string,
    rsv_patno: string,
    hmpg_cust_no: string,
    dept_cd: string,
    dr_sid: string,
    med_dt: string,
    med_tm: string) {
    this.logger.debug(`예약 접수 START`);
    let resultOk = false;

    try{
      const resp = await this.emrSoapApiService.HomepageMedRsvInfom({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: rsv_patno,
        IN_DPTY_APLC_HMPG_CUST_NO: hmpg_cust_no,
        IN_MED_DEPT_CD: dept_cd,
        IN_MEDR_SID: dr_sid,
        IN_MED_DT: med_dt,
        IN_MED_TM: med_tm,

        IN_LSH_STF_NO: CommonCodeConst.KISOK_ID,
        IN_LSH_PRGM_NM: '모바일예약접수',
        IN_LSH_IP_ADDR: '172.16.1.115',
        IN_RSV_RSN: '',

      } as ReqReservation);

      this.logger.error(`예약접수 성공 - ${resp}`);

      resultOk = true;

      if(patno != rsv_patno){



        const newOne = {
          hspTpCd: his_hsp_tp_cd,
          appPatno: patno,
          rsvPatno: rsv_patno,
          rsvDate: Number(med_dt),
          rsvTime: Number(med_tm),
        } as EumcRsvNotMeEumcEntity;

        const created = this.rsvNotMeRepo.save(newOne);
        if(created != null) {
          this.logger.error(`예약접수 성공 - DB입력 완료(본인외예약)`);
        }
      }
    }catch (e){
      this.logger.error(`예약접수 ERR : ${e}`);
      throw e;
    }
    return resultOk;
  }


  async getRsvMedDtmTm(body: ReqReservationInfoMeddtmtm) {

  }


  async getRsvMedDtm(body: ReqReservationInfoMeddtm) {

  }

  async getRsvMeddrList(his_hsp_tp_cd: string, pat_no: string, dept_cd: string, dr_nm: string) {

  }



  async getDoctorProfile(his_hsp_tp_cd: string, dr_sid: string, dept_code: string, profile_map: Map<string, object>, grp_dept_code: string = 'N') {
    var htmlToJson = require('html-to-json');
    let imgAddr;

    try{
      let grp_yn = 'N';

      if(typeof(grp_dept_code) != 'undefined' && grp_dept_code != 'N'){
        grp_yn = 'Y';
        dept_code = grp_dept_code;
      }

      let doctorProfiles = new Map();
      if(profile_map != null) {
        doctorProfiles = profile_map;
      }

      if(doctorProfiles.has(dr_sid)) {
        return doctorProfiles.get(dr_sid);
      }




      if(his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
        let result = await htmlToJson.request(`https://seoul.eumc.ac.kr/medical/dept/deptDoctor.do?dept_cd=${dept_code}&grp_yn=${grp_yn}`, {
          'value': ['.card', function ($item) {
            var $img = $item.find('.card-img a');
            var key = $img[0].attribs.onclick.split('\'')[1];
            var addr = $img.find('img').attr('src');
            var desc = $item.find('.card-body ul li')[1].children[2].data.replaceAll('\t', '').replaceAll('\n', '')
            return { key: key, photo: 'https://seoul.eumc.ac.kr' + addr, desc: desc }; // { dr_id , addr }
          }]
        });

        result.value.forEach(function (item) {
          doctorProfiles.set(item.key, item);
        })

        return doctorProfiles.get(dr_sid);

        // imgAddr = await htmlToJson.request(`https://seoul.eumc.ac.kr/doctor/basicInfo.do?dr_sid=${dr_sid}`, {
        //   'photo': ['.profile .photo img', function ($img) {
        //     return 'https://seoul.eumc.ac.kr' + $img.attr('src');
        //   }],
        //   'desc': ['.profile .info p', function ($desc) {
        //     return $desc.text();
        //   }]
        // }, function (err, result) {
        //   //  console.log(result);
        // });
      }else{
        let result = {
          value: []
        };

        // 비교기병원 별도 처리
        if(dept_code == 'hh' // 센터 : https://ewui.eumc.ac.kr/medical/dept/centerDoctor.do?dept_cd=hh&grp_yn=N
        || dept_code == 'PRC'// 센터 : https://ewui.eumc.ac.kr/medical/dept/centerDoctor.do?dept_cd=PRC&grp_yn=N
        || dept_code == 'KDNC' // https://ewui.eumc.ac.kr/medical/dept/centerDoctor.do?dept_cd=KDNC&grp_yn=N
        ) {
          result = await htmlToJson.request(`https://ewui.eumc.ac.kr/medical/dept/centerDoctor.do?dept_cd=${dept_code}&grp_yn=${grp_yn}`, {
            'value': ['.dr_sel', function ($item) {
              var $img = $item.find('dt a');
              var key = $img[0].attribs.onclick.split('\'')[1];
              var addr = $item.find('.people img').attr('src');
              var desc = $item.find('dd dl dd')[0].data.replaceAll('\t', '').replaceAll('\n', '')
              return { key: key, photo: 'https://ewui.eumc.ac.kr' + addr, desc: desc }; // { dr_id , addr }
            }]
          });
        }
        else if(dept_code == 'SFM' // 클리닉 : https://ewui.eumc.ac.kr/medical/dept/clinicDoctor.do?dept_cd=SFM&grp_yn=N
            || dept_code == 'CAA'
            || dept_code == 'DPH'
            || dept_code == 'URO'
            || dept_code == 'UTI'
            || dept_code == 'NCS') {
          result = await htmlToJson.request(`https://ewui.eumc.ac.kr/medical/dept/clinicDoctor.do?dept_cd=${dept_code}&grp_yn=${grp_yn}`, {
            'value': ['.dr_sel', function ($item) {
              var $img = $item.find('dt a');
              var key = $img[0].attribs.onclick.split('\'')[1];
              var addr = $item.find('.people img').attr('src');
              var desc = $item.find('dd dl dd')[0].data.replaceAll('\t', '').replaceAll('\n', '')
              return { key: key, photo: 'https://ewui.eumc.ac.kr' + addr, desc: desc }; // { dr_id , addr }
            }]
          });
        }
        else{
          result = await htmlToJson.request(`https://mokdong.eumc.ac.kr/medical/dept/deptDoctor.do?dept_cd=${dept_code}&grp_yn=${grp_yn}`, {
            'value': ['.card', function ($item) {
              var $img = $item.find('.card-img a');
              var key = $img[0].attribs.onclick.split('\'')[1];
              var addr = $img.find('img').attr('src');
              var desc = $item.find('.card-body ul li')[1].children[2].data.replaceAll('\t', '').replaceAll('\n', '')
              return { key: key, photo: 'https://mokdong.eumc.ac.kr' + addr, desc: desc }; // { dr_id , addr }
            }]
          });
        }





        result.value.forEach(function (item) {
          doctorProfiles.set(item.key, item);
        })

        return doctorProfiles.get(dr_sid);

        // imgAddr = await htmlToJson.request(`https://mokdong.eumc.ac.kr/doctor/basicInfo.do?dr_sid=${dr_sid}`, {
        //   'photo': ['.profile .photo img', function ($img) {
        //     return 'https://mokdong.eumc.ac.kr' + $img.attr('src');
        //   }],
        //   'desc': ['.profile .info p', function ($desc) {
        //     return $desc.text();
        //   }]
        // }, function (err, result) {
        //   //  console.log(result);
        // });
      }
      return imgAddr;
    }catch (e){
      this.logger.error(`의사프로필 ERR : ${e}`);
      return {id: null, photo: '', desc: ''}
    }
  }


  /**
   * 부서별 의사샘 리스트
   * @param body
   */
  async getMedDocList(body: ReqHomepageMedDocCode) {
    this.logger.debug(`의사샘 리스트 START`);
    let result;

    try{
      body.IN_TOT_YN = 'N';

      const resp = await this.emrSoapApiService.HomepageMedrCode(body);
      let callResp = resp.ArrayOfHomepageMedrCode.HomepageMedrCode;
      /**
       *   <HomepageMedrCode>
       *    <MED_DEPT_CD>FM</MED_DEPT_CD>
       *    <DR_SID>1001095</DR_SID>
       *    <DR_STF_NO>00041</DR_STF_NO>
       *    <DR_NM>이홍수</DR_NM>
       *    <CMED_YN>비지정</CMED_YN>
       *    <RSV_COMMENT />
       *    <FIRST_DATE>2023-04-12</FIRST_DATE>
       *    <FRVS_RMDE_TP_CD>3</FRVS_RMDE_TP_CD>
       *  </HomepageMedrCode>
       */
      if(callResp != null && callResp.length > 0) {

        let doctorProfiles = new Map();
        for (const item of callResp) {
          for (let el in item) {
            item[el] = getArrFirstData(item[el]);
          }

          // 프로필얻기
          try{
            this.logger.debug(`프로필얻기 START`);
            const profile_json = await this.getDoctorProfile(body.IN_HSP_TP_CD, item.DR_SID, item.MED_DEPT_CD, doctorProfiles, item.GRP_DEPT_CD);
            item.PROFILE = profile_json.photo;
            item.DESC = profile_json.desc;

            this.logger.debug(`프로필얻기 ${JSON.stringify(profile_json)}`);
          }catch (e) {
            this.logger.error(`프로필얻기 실패 : ${e}`);
          }

        }
      }

      // 20231031: 한지원교수 필터링 제거
      // callResp = callResp
      //   .filter(item=> item.DR_SID != '1014503')
      // ;

      result = callResp;
    }catch (e){
      this.logger.error(`의사샘 리스트 ERR : ${e}`);
      throw e;
    }
    return result;
  }




  /**
   * 월별 의사샘 스케쥴 리스트
   * @param body
   */
  async getMedDocSchdList(body: ReqHomepageMedSchd) {
    this.logger.debug(`월별 의사샘 스케쥴 리스트 START`);
    let result;

    try{
      let list = [];
      const resp = await this.emrSoapApiService.HomepageMedDtm_Doc_Sched(body);
      let callResp = resp.ArrayOfHomepageMedDtm_Doc_Sched.HomepageMedDtm_Doc_Sched;
      if(callResp != null && callResp.length > 0) {
        for (const item of callResp) {
          for (let el in item) {
            item[el] = getArrFirstData(item[el]);
          }

         // if(item.CLNC_YN == 'N') {
            list.push(item);
         // }
        }
      }

      result = list;
    }catch (e){
      this.logger.error(`월별 의사샘 스케쥴 리스트 ERR : ${e}`);
      throw e;
    }
    return result;
  }


  /**
   * 의사샘 스케쥴 시간 리스트
   * @param body
   */
  async getMedDocDtmList(body: ReqHomepageMedDtm) {
    this.logger.debug(`의사샘 스케쥴 시간 리스트 리스트 START`);
    let result;

    try{

      const resp = await this.emrSoapApiService.HomepageMedDtmTmSear(body);
      let callResp = resp.ArrayOfHomepageMedDtmTmSear.HomepageMedDtmTmSear;

      let list = [];
      if(callResp != null && callResp.length > 0) {
        for (const item of callResp) {
          for (let el in item) {
            item[el] = getArrFirstData(item[el]);
          }

          if(item.RSV_PSB_CNT >= 1 && item.CLNC_YN == 'N') {
            list.push(item);
          }
        }
      }

      result = list;
    }catch (e){
      this.logger.error(`의사샘 스케쥴 시간 리스트 리스트 ERR : ${e}`);
      throw e;
    }
    return result;
  }



  async getDeptWaitListByPactId(pact_id: string): Promise<Array<EumcWaitingMeddeptEumcEntity>> {
    try{
      return await this.rsvMeddeptRepo.find({
        where: {
          pact_id: pact_id
        }
      });
    }catch (e){
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * 병원 도착확인
   * @param hsp_tp_cd
   * @param pact_id
   */
  async requestArriveConfirm(hsp_tp_cd: string, pact_id: string) {
    this.logger.debug(`병원 도착확인 START`);
    let result;

    try{
      /**
       *   IN_HSP_TP_CD: string;
       *   IN_PACT_ID: string;
       *   IN_STF_NO: string;
       *   IN_PRGM_NM: string;
       *   IN_IP_ADDR: string;
       *   IN_JOB_TYP: string;
       */
        //hspTpCd, pactId, "KIO99", "Mobile", "172.17.1.114", "SAVE"
      const resp = await this.emrSoapApiService.internetDeptRoomArrivalConfirm({
          IN_HSP_TP_CD: hsp_tp_cd,
          IN_PACT_ID: pact_id,
          IN_STF_NO: CommonCodeConst.KISOK_ID,
          IN_PRGM_NM: "Mobile",
          IN_IP_ADDR: "172.17.1.114",
          IN_JOB_TYP: "SAVE"
        } as ReqInternetDeptRoomArrivalConfirm);

      try{
        // EumcWaitingMeddept eumcWaitingMeddept = new EumcWaitingMeddept();
        // eumcWaitingMeddept.setPact_id(pactId);
        // eumcDeptWaitRepository.save(eumcWaitingMeddept);
        let db_save = new EumcWaitingMeddeptEumcEntity();
        db_save.pact_id = pact_id;
        db_save.hsp_tp_cd = hsp_tp_cd;

        const db_resp = await this.rsvMeddeptRepo.save(db_save);
        this.logger.log(`도착확인 데이터 입력 : ${JSON.stringify(db_resp)}`)
      }catch (e) {
        this.logger.error(e);
      }

      // let callResp = resp;
      return (resp != null);
    }catch (e){
      this.logger.error(`병원 도착확인 ERR : ${e}`);
      throw e;
    }
    // return result;
  }


  /**
   * 병원 도착확인
   * @param hsp_tp_cd
   * @param pact_id
   */
  async requestArriveConfirmNew(hsp_tp_cd: string, pact_id: string) {
    this.logger.debug(`병원 도착확인 START`);
    let result;

    try{
      /**
       *   IN_HSP_TP_CD: string;
       *   IN_PACT_ID: string;
       *   IN_STF_NO: string;
       *   IN_PRGM_NM: string;
       *   IN_IP_ADDR: string;
       *   IN_JOB_TYP: string;
       */
        //hspTpCd, pactId, "KIO99", "Mobile", "172.17.1.114", "SAVE"
      const resp = await this.emrSoapApiService.InternetDeptRoomArrivalConfirmSelection({
          IN_HSP_TP_CD: hsp_tp_cd,
          IN_PACT_ID: pact_id
        } as ReqInternetDeptRoomArrivalConfirmNew);
      // <string xmlns="http://tempuri.org/">{"MTM_ARVL_DTM":"","MED_YN":"N"}</string>

      try{
        // EumcWaitingMeddept eumcWaitingMeddept = new EumcWaitingMeddept();
        // eumcWaitingMeddept.setPact_id(pactId);
        // eumcDeptWaitRepository.save(eumcWaitingMeddept);
        let db_save = new EumcWaitingMeddeptEumcEntity();
        db_save.pact_id = pact_id;
        db_save.hsp_tp_cd = hsp_tp_cd;

        const db_resp = await this.rsvMeddeptRepo.save(db_save);
        this.logger.log(`도착확인 데이터 입력 : ${JSON.stringify(db_resp)}`)
      }catch (e) {
        this.logger.error(e);
      }

      // let callResp = resp;
      return (resp != null);
    }catch (e){
      this.logger.error(`병원 도착확인 ERR : ${e}`);
      throw e;
    }
    // return result;
  }





  async getRsvMeddeptList(body: ReqHomepageMedCode): Promise<Array<ReservationMedDept>> {
    const res = [] as Array<ReservationMedDept>;
    const SPECIAL_CASE = {
      OMS: { popup: "2", popupMsg: "치과 예약은 콜센터 상담원을\n통해 진행해주시기 바랍니다." },
      CONSE: { popup: "2", popupMsg: "치과 예약은 콜센터 상담원을\n통해 진행해주시기 바랍니다." },
      NP: { popup: "2", popupMsg: "정신건강의학과 예약은 콜센터 상담원을\n통해 진행해주시기 바랍니다." },
      DA: { popup: "2", popupMsg: "스켈링과 예약은 콜센터 상담원을\n통해 진행해주시기 바랍니다." },
      TR: { popup: "2", popupMsg: "방사선종양학과 예약은 콜센터 상담원을\n통해 진행해주시기 바랍니다." },
      //   PERIO: { popup: "2", popupMsg: "치과 예약은 콜센터 상담원을\n통해 진행해주시기 바랍니다." },
    };

    try{
      const req = await this.emrSoapApiService.homepageMedCode(body as ReqHomepageMedCode);

      // 목동병원 (HSP_TP_CD = 02)
      // PROST   치과보철과 | PERIO   치과치주과

      req.ArrayOfHomepageMedCode.HomepageMedCode.map(({ CDCODE, CDVALUE }) => {
        const [cdcode] = CDCODE;
        const [cdvalue] = CDVALUE;
        if (body.IN_HSP_TP_CD === "02" && SPECIAL_CASE[cdcode]) {
          const { popup, popupMsg } = SPECIAL_CASE[cdcode];
          res.push({ cdcode, cdvalue, popup, popupMsg });
        } else res.push({ cdcode, cdvalue, popup: "0", popupMsg: "" });
      });
      return res;
    }catch (e){
      this.logger.error(`진료과 리스트 조회 ERR : ${e}`);
      throw e;
    }

  }

  // String hsp_tp_cd, String pt_no
  async getExamRsvList(body: ReqHomepageExamRsvList) {
    this.logger.debug(`검사내역조회 START ${body}`);
    const result = [] as Array<ReservationExamInfo>;

    try{
      const resp = await this.emrSoapApiService.homepageExamRsvList(body as ReqHomepageExamRsvList);
      const processed = resp.ArrayOfHomepageExamRsvList.HomepageExamRsvList

      /**
       *    <PT_NO>string</PT_NO>
       *     <EXAM_CD_NM>string</EXAM_CD_NM>
       *     <RSV_DT>string</RSV_DT>
       *     <RSV_TM>string</RSV_TM>
       *     <PT_GUID_PLC_NM>string</PT_GUID_PLC_NM>
       */
      if(processed != null) {
        processed.forEach(function(data) {
          let tmp = {} as ReservationExamInfo;
          for (let el in data) {
            tmp[el.toLowerCase()] = getArrFirstData(data[el]);
          }
          result.push(tmp);
        });
      }
    }catch (e){
      this.logger.error(`검사내역조회 ERR : ${e}`);
      throw e;
    }
    return result;
  }



}




