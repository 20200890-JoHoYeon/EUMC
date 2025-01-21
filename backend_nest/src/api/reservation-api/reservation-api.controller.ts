import { Body, Controller, Delete, Get, InternalServerErrorException, Logger, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ReservationApiService } from "./reservation-api.service";
import { ReqReceipt } from "../receipt-api/dto/req-receipt.interface";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { ReqReservation } from "./dto/req-reservation.interface";
import { ReqReservationInfoMeddtm } from "./dto/req-reservation-info-meddtm.interface";
import { ReqReservationInfoMeddtmtm } from "./dto/req-reservation-info-meddtmtm.interface";
import { ReqHomepageMedCode } from "../emr-soap-api/dto/req-homepage-med-code.interface";
import * as moment from "moment-timezone";
import { RespScheduleInfo } from "./dto/resp-schedule-info.interface";
import { ReqRsvToday } from "./dto/req-rsv-today.interface";
import { RespScheduleInfo2 } from "./dto/resp-schedule-info2.interface";
import { ReqHomepageMedDocCode } from "../emr-soap-api/dto/req-homepage-med-doc-code.interface";
import { ReqHomepageMedSchd } from "../emr-soap-api/dto/req-homepage-med-schd.interface";
import { ReqHomepageMedDtm } from "../emr-soap-api/dto/req-homepage-med-dtm.interface";
import { PatientApiService } from "../patient-api/patient-api.service";

@Controller('api/v1/reservation')
@ApiTags('예약 API')
export class ReservationApiController {
  private readonly logger = new Logger(ReservationApiController.name);


  constructor(private reservationApiService : ReservationApiService
            ,  private patientApiService: PatientApiService
  ) {
  }


  @Get('/getRsvList')
  @ApiOperation({ summary: '예약내역 조회' })
  async getRsvList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약내역(검사 예약 + 진료 예약) 조회 START`);
      const resultRsv = await this.reservationApiService.getRsvList('', his_hsp_tp_cd, pt_no, hmpg_cust_no, false);


      let rsvToday = [];

      let doctorProfiles = new Map();
      for (const item of resultRsv) {
        let profile = await this.reservationApiService.getDoctorProfile(his_hsp_tp_cd, item.MEDR_SID, item.MED_DEPT_CD, doctorProfiles, item.GRP_DEPT_CD)

        if(typeof(profile) == 'undefined') {
          profile = {
            photo: ''
          }
        }

        let hour = item.MED_DTM.substring(0, 2);
        let min = item.MED_DTM.substring(2);

        // return {
        //   when: item.med_dtm,
        //   what: '진료예약',
        //   where: item.dept_nm,
        // } as RespScheduleInfo;
        rsvToday.push( {
          PROFILE: profile.photo,
          PT_NO: item.PT_NO,
          PT_NM: item.PT_NM,
          RPY_PACT_ID: item.RPY_PACT_ID,
          DEPT_NM: item.DEPT_NM,//진료과명
          MEDR_NM: item.MED_NM,//진료의명
          MED_DT: moment(item.MED_DT).format('yyyy년 MM월 DD일'),//진료일자
          MED_TM: `${hour}시 ${min}분`,//진료일시
          SEL_TYPE: '진료',//진료/검사 구분
          MED_DEPT_CD: item.MED_DEPT_CD, // 부서코드
          ARRIVED_YN: item.MED_YN.trim() == '진료'? 'Y' : 'N'
        } as RespScheduleInfo2);
      }

      resp.setSuccess(rsvToday);
    } catch (e) {
      this.logger.error(`예약내역 조회(검사 예약 + 진료 예약) ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/getRsvList2')
  @ApiOperation({ summary: '예약내역 조회' })
  async getRsvList2(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약내역(검사 예약 + 진료 예약) 조회 START`);

      // 진료 예약 정보
      const resultRsv = await this.reservationApiService.getTodayRsv({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt || moment().format('yyyyMMDD'),
        IN_TO_DT: to_dt || moment().add(12, 'month').format('yyyyMMDD'),
      } as ReqRsvToday, 'NOT_TODAY');


      let rsvToday = [];
      let doctorProfiles = new Map();
      for (const item of resultRsv) {
        let profile = await this.reservationApiService.getDoctorProfile(his_hsp_tp_cd, item.MEDR_SID, item.MED_DEPT_CD, doctorProfiles, item.GRP_DEPT_CD)

        let pt_info = await this.patientApiService.getPatientInfo(pt_no);

        if(typeof(profile) == 'undefined') {
          profile = {
            photo: ''
          }
        }

        this.logger.debug(`PROFILE PARM = ${JSON.stringify(item)}`);
        this.logger.debug(`PROFILE = ${JSON.stringify(profile)}`);
        rsvToday.push( {
          PROFILE: profile.photo,
          PT_NO: pt_no,
          PT_NM: pt_info.out_patname,
          RPY_PACT_ID: item.RPY_PACT_ID,
          DEPT_NM: item.DEPT_NM,//진료과명
          MEDR_NM: item.MEDR_NM,//진료의명
          MED_DT: item.MED_DT,//진료일자
          MED_TM: item.MED_TM,//진료일시
          SEL_TYPE: item.SEL_TYPE,//진료/검사 구분
          MED_DEPT_CD: item.MED_DEPT_CD, // 부서코드
          ARRIVED_YN: 'N',//item.MED_YN.trim() == '진료'? 'Y' : 'N'
        } as RespScheduleInfo2);
      }


      resp.setSuccess(rsvToday);
    } catch (e) {
      this.logger.error(`예약내역 조회(검사 예약 + 진료 예약) ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/getRsvListAll')
  @ApiOperation({ summary: '예약내역 조회' })
  async getRsvListAll(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약내역(검사 예약 + 진료 예약) 조회 START`);

      // 진료 예약 정보
      const resultRsv = await this.reservationApiService.getTodayRsv({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt || moment().format('yyyyMMDD'),
        IN_TO_DT: to_dt || moment().add(12, 'month').format('yyyyMMDD'),
      } as ReqRsvToday, 'ALL');


      let rsvToday = [];
      let doctorProfiles = new Map();
      for (const item of resultRsv) {
        let profile = await this.reservationApiService.getDoctorProfile(his_hsp_tp_cd, item.MEDR_SID, item.MED_DEPT_CD, doctorProfiles, item.GRP_DEPT_CD)

        let pt_info = await this.patientApiService.getPatientInfo(pt_no);

        if(typeof(profile) == 'undefined') {
          profile = {
            photo: ''
          }
        }

        this.logger.debug(`PROFILE PARM = ${JSON.stringify(item)}`);
        this.logger.debug(`PROFILE = ${JSON.stringify(profile)}`);
        rsvToday.push( {
          PROFILE: profile.photo,
          PT_NO: pt_no,
          PT_NM: pt_info.out_patname,
          RPY_PACT_ID: item.RPY_PACT_ID,
          DEPT_NM: item.DEPT_NM,//진료과명
          MEDR_NM: item.MEDR_NM,//진료의명
          MED_DT: item.MED_DT,//진료일자
          MED_TM: item.MED_TM,//진료일시
          SEL_TYPE: item.SEL_TYPE,//진료/검사 구분
          MED_DEPT_CD: item.MED_DEPT_CD, // 부서코드
          ARRIVED_YN: 'N',//item.MED_YN.trim() == '진료'? 'Y' : 'N'
        } as RespScheduleInfo2);
      }


      resp.setSuccess(rsvToday);
    } catch (e) {
      this.logger.error(`예약내역 조회(검사 예약 + 진료 예약) ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Get('/getTodaySchedule')
  @ApiOperation({ summary: '당일 스케쥴 (검사 예약 + 진료 예약) 조회' })
  async getTodaySchedule(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string
                         ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`당일 스케쥴 (검사 예약 + 진료 예약) 조회 START`);

      const resultExam = await this.reservationApiService.getExamRsvList({
        IN_PT_NO: pt_no,
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_RSV_DT: moment().format('yyyyMMDD')
      });
      /**
       *    <PT_NO>string</PT_NO>
       *     <EXAM_CD_NM>string</EXAM_CD_NM>
       *     <RSV_DT>string</RSV_DT>
       *     <RSV_TM>string</RSV_TM>
       *     <PT_GUID_PLC_NM>string</PT_GUID_PLC_NM>
       */

      // 진료 예약 정보
      const resultRsv = await this.reservationApiService.getRsvList('', his_hsp_tp_cd, pt_no, hmpg_cust_no, true);

      let todaySchduleArr: Array<RespScheduleInfo2> = [];

      let examToday = resultExam.map((item)=> {

        let hour = item.RSV_TM.substring(0, 2);
        let min = item.RSV_TM.substring(2);

        // return {
        //   when: item.rsv_tm,
        //   what: item.exam_cd_nm,
        //   where: item.pt_guid_plc_nm,
        // } as RespScheduleInfo;
        return {
          PT_NO: item.PT_NO,
          DEPT_NM : item.EXAM_CD_NM,//진료과명
          MEDR_NM : '',//진료의명
          MED_DT : moment(item.RSV_DT).format('yyyy년 MM월 DD일'),//진료일자
          MED_TM: `${hour}시 ${min}분`,//진료일시
          SEL_TYPE : '검사',//진료/검사 구분
        } as RespScheduleInfo2;
      });


      let rsvToday = [];

      let doctorProfiles = new Map();
      for (const item of resultRsv) {
        let profile = await this.reservationApiService.getDoctorProfile(his_hsp_tp_cd, item.MEDR_SID, item.MED_DEPT_CD, doctorProfiles, item.GRP_DEPT_CD)

        if(typeof(profile) == 'undefined') {
          profile = {
            photo: ''
          }
        }

        let hour = item.MED_DTM.substring(0, 2);
        let min = item.MED_DTM.substring(2);

        // return {
        //   when: item.med_dtm,
        //   what: '진료예약',
        //   where: item.dept_nm,
        // } as RespScheduleInfo;
        rsvToday.push( {
          PROFILE: profile.photo,
          PT_NO: item.PT_NO,
          PT_NM: item.PT_NM,
          RPY_PACT_ID: item.RPY_PACT_ID,
          DEPT_NM: item.DEPT_NM,//진료과명
          MEDR_NM: item.MED_NM,//진료의명
          MED_DT: moment(item.MED_DT).format('yyyy년 MM월 DD일'),//진료일자
          MED_TM: `${hour}시 ${min}분`,//진료일시
          SEL_TYPE: '진료',//진료/검사 구분
          MED_DEPT_CD: item.MED_DEPT_CD, // 부서코드
          ARRIVED_YN: item.MED_YN.trim() == '진료'? 'Y' : 'N'
        } as RespScheduleInfo2);
      }

      todaySchduleArr.push(
        ...examToday, ...rsvToday
      );

      resp.setSuccess(todaySchduleArr);
    } catch (e) {
      this.logger.error(`당일 스케쥴 (검사 예약 + 진료 예약) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/getTodaySchedule2')
  @ApiOperation({ summary: '당일 스케쥴 (검사 예약 + 진료 예약) 조회' })
  async getTodaySchedule2(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`당일 스케쥴 (검사 예약 + 진료 예약) 조회 START`);

      // 진료 예약 정보
      const resultRsv = await this.reservationApiService.getTodayRsv({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no
      } as ReqRsvToday, 'TODAY');


      let rsvToday = [];
      let doctorProfiles = new Map();
      for (const item of resultRsv) {
        let profile = await this.reservationApiService.getDoctorProfile(his_hsp_tp_cd, item.MEDR_SID, item.MED_DEPT_CD, doctorProfiles, item.GRP_DEPT_CD)

        if(typeof(profile) == 'undefined') {
          profile = {
            photo: ''
          }
        }

        let pt_info = await this.patientApiService.getPatientInfo(pt_no);

        // return {
        //   when: item.med_dtm,
        //   what: '진료예약',
        //   where: item.dept_nm,
        // } as RespScheduleInfo;
        rsvToday.push( {
          PROFILE: profile.photo,
          PT_NO: pt_no,
          PT_NM: pt_info.out_patname,
          RPY_PACT_ID: item.RPY_PACT_ID,
          DEPT_NM: item.DEPT_NM,//진료과명
          MEDR_NM: item.MEDR_NM,//진료의명
          MED_DT: item.MED_DT,//진료일자
          MED_TM: item.MED_TM,//진료일시
          SEL_TYPE: item.SEL_TYPE,//진료/검사 구분
          MED_DEPT_CD: item.MED_DEPT_CD, // 부서코드
          ARRIVED_YN: 'N',//item.MED_YN.trim() == '진료'? 'Y' : 'N'
        } as RespScheduleInfo2);
      }




      resp.setSuccess(rsvToday);
    } catch (e) {
      this.logger.error(`당일 스케쥴 (검사 예약 + 진료 예약) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Get('/getRsvListForPactId')
  @ApiOperation({ summary: '예약내역 조회' })
  async getRsvListForPactId(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string,
    @Query('rpy_pact_id') rpy_pact_id: string

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약내역(검사 예약 + 진료 예약) 조회 START`);
      const result = await this.reservationApiService.getRsvList(rpy_pact_id, his_hsp_tp_cd, pt_no, hmpg_cust_no, false);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`예약내역 조회(검사 예약 + 진료 예약) ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Post('/requestRsvInfom')
  @ApiOperation({ summary: '예약 접수' })
  @ApiBody({
    description: '예약 접수',
    required: true,
    schema: {
      properties: {
        his_hsp_tp_cd: { type: 'string' },
        patno: { type: 'string' },
        rsv_patno: { type: 'string' },
        hmpg_cust_no: { type: 'string' },
        dept_cd: { type: 'string' },
        dr_sid: { type: 'string' },
        med_dt: { type: 'string' },
        med_tm: { type: 'string' },
      },
    },
  })
  async requestRsvInfom(
    @Body('his_hsp_tp_cd') his_hsp_tp_cd,
    @Body('patno') patno,
    @Body('rsv_patno') rsv_patno,
    @Body('hmpg_cust_no') hmpg_cust_no,
    @Body('dept_cd') dept_cd,
    @Body('dr_sid') dr_sid,
    @Body('med_dt') med_dt,
    @Body('med_tm') med_tm) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약 접수 START`);
      const result = await this.reservationApiService.requestRsvInfom(his_hsp_tp_cd,
        patno,
        rsv_patno,
        hmpg_cust_no,
        dept_cd,
        dr_sid,
        med_dt,
        med_tm);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`예약 접수 ERR : ${e}`);

      if((e + '').includes('초진정원이 초과')) {
        resp.setErrorWithMsg(ApiResult.RSV_OVER_BOOK, e.toString(), e);
      }
      else{
        resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e.toString(), e);
      }

      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Post('/rsvMedDtmTm')
  @ApiOperation({ summary: '예약 접수' })
  async getRsvMedDtmTm(@Body() body: ReqReservationInfoMeddtmtm) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약 접수 START`);
      const result = await this.reservationApiService.getRsvMedDtmTm(body);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`예약 접수 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Post('/rsvMedDtm')
  @ApiOperation({ summary: '예약 접수' })
  async getRsvMedDtm(@Body() body: ReqReservationInfoMeddtm) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약 접수 START`);
      const result = await this.reservationApiService.getRsvMedDtm(body);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`예약 접수 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
  }


  @Get('/rsvMeddrList')
  @ApiOperation({ summary: '예약 접수' })
  async getRsvMeddrList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pat_no') pat_no: string,
    @Query('dept_cd') dept_cd: string,
    @Query('dr_nm') dr_nm: string
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약 접수 START`);
      const result = await this.reservationApiService.getRsvMeddrList(his_hsp_tp_cd, pat_no, dept_cd, dr_nm);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`예약 접수 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Get('/rsvMeddeptList')
  @ApiOperation({ summary: '예약 진료과 리스트' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'dept_cd',
    description: '진료과 코드',
    required: false,
    example: '',
  })
  @ApiQuery({
    name: 'dept_nm',
    description: '진료과 이름',
    required: false,
    example: '',
  })
  async getRsvMeddeptList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('dept_cd') dept_cd: string,
    @Query('dept_nm') dept_nm: string,
    @Query('tot_yn') tot_yn: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약 진료과 리스트 START`);
      const reqBody = {
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_DEPT_CD: dept_cd ||'',
        IN_DEPT_NM: dept_nm || '',
        IN_TOT_YN: tot_yn || 'N'
      } as ReqHomepageMedCode;
      const result = await this.reservationApiService.getRsvMeddeptList(reqBody);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`예약 진료과 리스트 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Get('/medDocList')
  @ApiOperation({ summary: '진료과 의사 리스트' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'dept_cd',
    description: '진료과 코드',
    required: false,
    example: '',
  })
  @ApiQuery({
    name: 'pat_no',
    description: '환자번호',
    required: false,
    example: '',
  })
  async getMedDocList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('dept_cd') dept_cd: string,
    @Query('pat_no') pat_no: string
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`진료과 의사 리스트 START`);
      const reqBody = {
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_MED_DEPT_CD: dept_cd ||'',
        IN_PT_NO: pat_no ||'',
        IN_DR_SID: '',
        IN_DR_NM: '',
        IN_TOT_YN: 'N',
      } as ReqHomepageMedDocCode;
      const result = await this.reservationApiService.getMedDocList(reqBody);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`진료과 의사 리스트 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




  @Get('/medSchdList')
  @ApiOperation({ summary: '진료과 의사 스케쥴 리스트' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'dept_cd',
    description: '진료과 코드',
    required: false,
    example: '',
  })
  @ApiQuery({
    name: 'med_ym',
    description: '진료년월',
    required: true,
    example: '202304',
  })
  @ApiQuery({
    name: 'pat_no',
    description: '환자번호',
    required: false,
    example: '',
  })
  async medSchdList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('dept_cd') dept_cd: string,
    @Query('med_ym') med_ym: string,
    @Query('pat_no') pat_no: string,
    @Query('dr_sid') dr_sid: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`진료과 의사 리스트 START`);
      const reqBody = {
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_MED_DEPT_CD: dept_cd ||'',
        IN_MED_YM: med_ym ||'',
        IN_PT_NO: pat_no ||'',
        IN_DR_SID: dr_sid || ''
      } as ReqHomepageMedSchd;
      const result = await this.reservationApiService.getMedDocSchdList(reqBody);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`진료과 의사 리스트 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/medDtmList')
  @ApiOperation({ summary: '진료 의사 스케줄 시간 리스트' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'dept_cd',
    description: '진료과 코드',
    required: true,
    example: 'FM',
  })
  @ApiQuery({
    name: 'med_dt',
    description: '진료년월일',
    required: true,
    example: '20230404',
  })
  @ApiQuery({
    name: 'dr_sid',
    description: '의사등록번호',
    required: true,
    example: '1002555',
  })
  async getMedDocDtmList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('dept_cd') dept_cd: string,
    @Query('med_dt') med_dt: string,
    @Query('dr_sid') dr_sid: string,
    @Query('pt_no') pt_no: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`진료과 의사 리스트 START`);
      const reqBody = {
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_MED_DEPT_CD: dept_cd ||'',
        IN_MED_DT: med_dt ||'',
        IN_DR_SID: dr_sid ||'',
        IN_PT_NO: pt_no || '',
        IN_TOT_YN: 'N',
      } as ReqHomepageMedDtm;
      const result = await this.reservationApiService.getMedDocDtmList(reqBody);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`진료과 의사 리스트 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




  @Post('/requestArrive')
  @ApiOperation({ summary: '도착확인(목동)' })
  @ApiBody({
    description: '도착확인(목동)',
    required: true,
    schema: {
      properties: {
        his_hsp_tp_cd: { type: 'string' },
        pact_id: { type: 'string' },
      },
    },
  })
  async requestArriveConfirm(
    @Body('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Body('pact_id') pact_id: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`도착확인(목동) START ${his_hsp_tp_cd}, ${pact_id}`);
      // const result = await this.reservationApiService.requestArriveConfirm(his_hsp_tp_cd, pact_id);
      const result = await this.reservationApiService.requestArriveConfirmNew(his_hsp_tp_cd, pact_id);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`도착확인(목동) ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Get('/examRsvList')
  @ApiOperation({ summary: '검사내역조회' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'pt_no',
    description: '환자번호',
    required: true,
    example: '11875538',
  })
  async getExamRsvList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`검사내역조회 START`);
      const result = await this.reservationApiService.getExamRsvList({
        IN_PT_NO: pt_no,
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_RSV_DT: moment().format('yyyyMMDD')
      } );
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`검사내역조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }












  @Post('/deleteRsv')
  @ApiOperation({ summary: '예약취소' })
  @ApiBody({
    description: '예약 삭제',
    required: true,
    schema: {
      properties: {
        his_hsp_tp_cd: { type: 'string' },
        pt_no: { type: 'string' },
        rpy_pact_id: { type: 'string' },
        hmpg_cust_no: { type: 'string' },
        dept_cd: { type: 'string' },
      },
    },
  })
  async deleteRsv(
    @Body('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Body('pt_no') pt_no: string,
    @Body('rpy_pact_id') rpy_pact_id: string,
    @Body('dept_cd') dept_cd: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`예약취소 START`);
      const result = await this.reservationApiService.deleteRsv(his_hsp_tp_cd, pt_no, rpy_pact_id, dept_cd);
      resp.setSuccess(result);
      return resp;
    } catch (e) {
      this.logger.error(`예약취소 ERR : ${e}`);

      resp.setErrorWithMsg(ApiResult.UNKNOWN_ERROR, e.toString(), e);

      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
  }





  @Get('/medicalHistory')
  @ApiOperation({ summary: '진료이력 일자별 조회' })
  async medicalHistory(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`진료이력 일자별 조회 START`);
      const result = await this.reservationApiService.getMedicalHistory({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt,
        IN_TO_DT: to_dt,
      } as ReqRsvToday);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`진료이력 일자별 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/medicalDetail')
  @ApiOperation({ summary: '진료이력 일자별 조회' })
  async medicalDetail(
    @Query('pact_id') pact_id: string
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`진료이력 일자별 조회 START`);
      const result = await this.reservationApiService.getMedicalDetail(pact_id);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`진료이력 일자별 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }







  @Get('/examHistory')
  @ApiOperation({ summary: '검사이력 일자별 조회' })
  async examHistory(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`검사이력 일자별 조회 START`);
      const result = await this.reservationApiService.getExamHistoryDtl({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt,
        IN_TO_DT: to_dt,
      } as ReqRsvToday);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`검사이력 일자별 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/examDetail')
  @ApiOperation({ summary: '검사이력 상세 조회' })
  async examDetail(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('code') code: string,
    @Query('search_dt') search_dt: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`검사이력 상세  조회 START`);
      //hsp_tp_cd: string, pt_no: string, code: string, search_dt: string
      const result = await this.reservationApiService.getExamDetail(his_hsp_tp_cd, pt_no, code, search_dt);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`검사이력 상세 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }








  @Get('/drugHistory')
  @ApiOperation({ summary: '약처방 일자별 조회' })
  async drugHistory(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('hmpg_cust_no') hmpg_cust_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`약처방 일자별 조회 START`);
      const result = await this.reservationApiService.getDrugHistoryDtl({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt,
        IN_TO_DT: to_dt,
      } as ReqRsvToday);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`약처방 일자별 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }







}
