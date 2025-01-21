import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ReqInternetDeptRoomWaittingPatientList } from "./dto/req-internet-dept-room-waitting-patient-list.interface";
import { catchError, firstValueFrom } from "rxjs";
import qs from "qs";
import { AxiosError } from "axios/index";
import { ReqInternetDeptRoomArrivalConfirm } from "./dto/req-internet-dept-room-arrival-confirm.interface";
import { ReqInternetCtfsModifyTelno } from "./dto/req-internet-ctfs-modify-telno.interface";
import { ReqHomepagePtTelInsert } from "./dto/req-homepage-pt-tel-insert.interface";
import { ReqHomepagePtSear } from "./dto/req-homepage-pt-sear.interface";
import { ReqBilWebService } from "./dto/req-bil-web-service.dto";
import { ReqInternetCrtfSelectMedicalFormInfo } from "./dto/req-internet-crtf-select-medical-form-info.dto";
import { parseToJson } from "../../utils/xml.util";
import {
  ReqInternetCrtfSelectMedicalFormRecordList
} from "./dto/req-internet-crtf-select-medical-form-record-list.interface";
import { ReqInternetCtfsAdsInfom } from "./dto/req-internet-ctfs-ads-infom.interface";
import { ReqInternetCtfsOtptInfom } from "./dto/req-internet-ctfs-otpt-infom.interface";
import { ReqInternetMcstPymcFmt } from "./dto/req-internet-mcst-pymc-fmt.interface";
import { ReqInternetMcstDtlPtclFom } from "./dto/req-internet-mcst-dtl-ptcl-fom.interface";
import { ReqInternetMcstDtoPtclFom } from "./dto/req-internet-mcst-dto-ptcl-fom.interface";
import { CommonConfService } from "../../config/common-conf.service";
import * as fs from "fs";
import { ReqHomepageMedCode } from "./dto/req-homepage-med-code.interface";
import { HomepageMedCode } from "./dto/homepage-med-code.interface";
import { getArrFirstData } from "../../utils/string.util";
import { ReqHomepageExamRsvList } from "./dto/req-homepage-exam-rsv-list.interface";
import { ReqHomepageMedResvCancel } from "./dto/req-homepage-med-resv-cancel.interface";
import { ReqHomepageMedRsvList } from "./dto/req-homepage-med-rsv-list .interface";
import { ReqReservation } from "../reservation-api/dto/req-reservation.interface";
import { ReqRsvToday } from "../reservation-api/dto/req-rsv-today.interface";
import { ReqHomepageMedDocCode } from "./dto/req-homepage-med-doc-code.interface";
import { HomepageMedDocCode } from "./dto/homepage-medr-code.interface";
import { ReqHomepageMedSchd } from "./dto/req-homepage-med-schd.interface";
import { ReqHomepageMedDtm } from "./dto/req-homepage-med-dtm.interface";
import { ReqInternetCtfsPatInfo } from "./dto/req-internet-ctfs-pat-info";
import { ReqInternetDeptRoomArrivalConfirmNew } from "./dto/req-internet-dept-room-arrival-confirm-new.interface";

@Injectable()
export class EmrSoapApiService {
  private readonly logger = new Logger(EmrSoapApiService.name);


  constructor(private httpService: HttpService,
              private commonConfService: CommonConfService,
  ) {
  }

  private readonly BASE_URL_DEV = 'https://devensysinf.eumc.ac.kr'; // TODO: Conf로 변경예정
  private readonly BASE_URL = 'https://esysinf.eumc.ac.kr'; // TODO: Conf로 변경예정


  private readonly RSV_API_BASE_URL = this.BASE_URL + '/PA/PAKING/SERVICE1.ASMX';
  private readonly CERT_API_BASE_URL = this.BASE_URL + '/PA/InterCtfs/SERVICE1.ASMX';
  private readonly CERT_API_BASE_URL_DEV = this.BASE_URL_DEV + '/PA/InterCtfs/SERVICE1.ASMX';
  private readonly KIOSK_API_URL = this.BASE_URL + '/PA/AC/KioskWebService.asmx/BilWebService';


  private readonly KIOSK_API_DUMMY_PATH = 'src/api/emr-soap-api/dummy';
//TODO: 요청 API 주소도 상수화 시킬지 확인 필요


  /**
   *
   * @param url
   * @param body -> JSON 형태로 호출
   */
  async requestApi(url: string, body: any): Promise<any> {

    this.logger.debug(`############## EMR-API START ##############`);
    this.logger.debug(`URL : ${url}`);
    // this.logger.debug(`HEADER : ${JSON.stringify(req.headers)}`);
    this.logger.debug(`REQ : ${JSON.stringify(body)}`);


    // for (let el in body) {
    //   body[el.toUpperCase()] = getArrFirstData(body[el]);
    // }

    // Form-Url-Encoded 이므로 stringfiy
    const { data } = await firstValueFrom(
      this.httpService.post<string>(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000,
      }).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          var msg = error.response.data.toString();
          var len = 16;
          var start = 0;//msg.indexOf('&lt;!ERROR!&gt;');
          if(msg.indexOf('&lt;!ERROR!&gt;') > 0){
            start = msg.indexOf('&lt;!ERROR!&gt;') + len;
          }
          var end = (msg.indexOf('&lt;/!ERROR!&gt;'));
          if(end < 0 || msg.indexOf('ERROR2') > 0){
            end = (msg.indexOf('위치'));
          }

          //start = start+len;
          if(start > 0 && end > 0) {
            msg = msg.substring(start, end);
            this.logger.error(`msg: ${msg}`);
            throw msg;
          }else{
            this.logger.error(`msg: ${msg}`);
            throw msg;
          }
        }),
      ),
    ).finally(()=>{

    });

    this.logger.debug(`RESP : ${data}`);


    // XML TO JSON
    let parseXml = await parseToJson(data);

    this.logger.debug(`RESP-CONVERT-JSON : ${JSON.stringify(parseXml)}`);
    this.logger.debug(`############## EMR-API END ################`);
    //TODO: replace 필요할지 체크필요
    // 원본코드 부분
    // result = result.replace("&lt;", "<");
    // result = result.replace("&gt;", ">");
    // result = result.replace("> <", "><");


    return parseXml;
  }






  /**
   * 진료과 도착확인 리스트 조회
   * @param body
   */
  async internetDeptRoomWaittingPatientList(body: ReqInternetDeptRoomWaittingPatientList) {
   if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetDeptRoomWaittingPatientList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      let resp = await this.requestApi(this.CERT_API_BASE_URL + '/InternetDeptRoomWaittingPatientList', body);
      return resp;//.DataSet["diffgr:diffgram"][0].NewDataSet;
    }
  }

  /**
   * 도착확인 요청
   * @param body
   */
  async internetDeptRoomArrivalConfirm(body: ReqInternetDeptRoomArrivalConfirm): Promise<string> {
    const xml = await this.requestApi(this.CERT_API_BASE_URL + '/InternetDeptRoomArrivalConfirm', body);
    return xml;
  }

  /**
   * 도착확인 요청
   * @param body
   */
  async InternetDeptRoomArrivalConfirmSelection(body: ReqInternetDeptRoomArrivalConfirmNew): Promise<string> {
    const xml = await this.requestApi(this.CERT_API_BASE_URL + '/InternetDeptRoomArrivalConfirmSelection', body);
    return xml;
  }

  /**
   * 환자 전화번호 수정
   * @param body
   */
  async internetCtfsModifyTelno(body: ReqInternetCtfsModifyTelno): Promise<string> {
    const xml = await this.requestApi(this.CERT_API_BASE_URL + '/InternetCtfsModifyTelno', body);
    return xml;
  }

  /**
   * 환자 이메일 수정
   * @param body
   */
  async homepagePtTelInsert(body: ReqHomepagePtTelInsert): Promise<string> {
    const xml = await this.requestApi(this.RSV_API_BASE_URL + '/HomepagePtTelInsert', body);
    return xml;
  }

  /**
   * 환자 이메일 조회
   * @param body
   */
  async homepagePtSear(body: ReqHomepagePtSear) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepagePtSear.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/HomepagePtSear', body);
    }
  }


  /**
   * 진료 예약 내역 조회
   * @param body
   */
  async homepageMedRsvList(body: ReqHomepageMedRsvList) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedRsvList', body);
    }
  }


  /**
   *  진료 예약 내역 조회
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_TODOLIST(body: ReqRsvToday) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_TODOLIST', body);
    }
  }

  /**
   * 진료 리스트
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_MEDLIST(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_MEDLIST', body);
    }
  }


  /**
   * 진료상세
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_MEDDETAIL(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_MEDDETAIL', body);
    }
  }

  /**
   * 검사 리스트
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_EXRMLIST(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_EXRMLIST', body);
    }
  }


  /**
   * 검사상세
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_EXRMDETAIL(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_EXRMDETAIL', body);
    }
  }


  async MOBILEINTERFACE_SEL_CP_EXRMDETAIL(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_CP_EXRMDETAIL', body);
    }
  }


  /**
   * 약처방 리스트
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_PRSPLIST(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_PRSPLIST', body);
    }
  }


  /**
   * 약처방 상세
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_PRSPDETAIL(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_PRSPDETAIL', body);
    }
  }




  /**
   * 수납내역
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_RPYLIST(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_RPYLIST', body);
    }
  }


  /**
   * 수납상세
   * @param body
   * @constructor
   */
  async MOBILEINTERFACE_SEL_RPYDETAIL(body) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/MOBILEINTERFACE_SEL_RPYDETAIL', body);
    }
  }





  /**
   *         arrKeyValue.add(new KeyValue("in_hsp_tp_cd", his_hsp_tp_cd));
   *         arrKeyValue.add(new KeyValue("in_pact_id", rpy_pact_id));
   *         arrKeyValue.add(new KeyValue("in_pt_no", patno));
   *         arrKeyValue.add(new KeyValue("in_med_dept_cd", dept_cd));
   *         arrKeyValue.add(new KeyValue("in_lsh_stf_no", "KIO99"));
   *         arrKeyValue.add(new KeyValue("in_lsh_prgm_nm", "모바일예약접수"));
   *         arrKeyValue.add(new KeyValue("in_lsh_ip_addr", "172.16.1.115"));
   *
   * @param body
   */
  /**
   * 예약 취소
   * @param body
   */
  async homepageMedRsvCancel(body: ReqHomepageMedResvCancel) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/homepageMedRsvCancel.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedRsvCancel', body);
    }
  }


  /**
   * 검사내역조회 -> 검사예약일정
   * @param body
   */
  async homepageExamRsvList(body: ReqHomepageExamRsvList) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageExamRsvList.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/HomepageExamRsvList', body);
    }
  }

  /**
   * 예약 접수
   * @param body
   * @constructor
   */
  async HomepageMedRsvInfom(body: ReqReservation) {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/HomepageMedRsvInfom.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      return await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedRsvInfom', body);
    }
  }





  /**
   * 키오스크쪽으로 요청하는 데이터는 sParam 에 XML형식으로 데이터를 넣어야함
   * sGubun는 서비스 구분자
   * @param body
   */
  async bilWebService(body: ReqBilWebService): Promise<any> {
    const xml = await this.requestApi(this.KIOSK_API_URL, {
      sGubun: body.sGubun,
      sParam: body.sParam,
    });
    return xml;
  }

  /**
   * 진단서/소견서 요청
   * @param body
   */
  async internetCrtfSelectMedicalFormInfo(body: ReqInternetCrtfSelectMedicalFormInfo): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetCrtfSelectMedicalFormInfo_jindan.xml', 'utf8');
      return await parseToJson(xml);
    }else{
      let resp = await this.requestApi(this.CERT_API_BASE_URL + '/InternetCrtfSelectMedicalFormInfo', body);
      let data =  await parseToJson(resp.string._);
      return data.NewDataSet;
    }
  }

  /**
   * 진단서/소견서 목록
   * @param body
   */
  async internetCrtfSelectMedicalRecordList(body: ReqInternetCrtfSelectMedicalFormRecordList): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetCrtfSelectMedicalRecordList.xml', 'utf8');
      let data = await parseToJson(xml);
      return data.string.NewDataSet[0]
    }else{
      const resp = await this.requestApi(this.CERT_API_BASE_URL + '/InternetCrtfSelectMedicalRecordList', body);
      let data =  await parseToJson(resp.string._);
      return data.NewDataSet;
    }
  }

  /**
   * 진단서/소견서 목록
   * @param body
   */
  async internetCtfsAdsInfom(body: ReqInternetCtfsAdsInfom): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      this.logger.debug(`############## EMR-API START [DUMMY] ##############`);
      this.logger.debug(`REQ : ${JSON.stringify(body)}`);

      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetCtfsAdsInfom.xml', 'utf8');
      this.logger.debug(`RESP : ${JSON.stringify(xml)}`);

      const parseXml = await parseToJson(xml);
      this.logger.debug(`RESP-CONVERT-JSON : ${JSON.stringify(parseXml)}`);
      this.logger.debug(`############## EMR-API END [DUMMY] ################`);
      return parseXml;
    }else{
      return await this.requestApi(this.CERT_API_BASE_URL + '/InternetCtfsAdsInfom', body);
    }
  }

  /**
   * 진료비납입확인서(연말정산용)
   * @param body
   */
  async internetMcstMcstPymCfmt(body: ReqInternetMcstPymcFmt): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      this.logger.debug(`############## EMR-API START [DUMMY] ##############`);
      this.logger.debug(`REQ : ${JSON.stringify(body)}`);

      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetMcstMcstPymCfmt.xml', 'utf8');
      this.logger.debug(`RESP : ${JSON.stringify(xml)}`);

      const parseXml = await parseToJson(xml);
      this.logger.debug(`RESP-CONVERT-JSON : ${JSON.stringify(parseXml)}`);
      this.logger.debug(`############## EMR-API END [DUMMY] ################`);
      return parseXml;
    }else{
      return await this.requestApi(this.CERT_API_BASE_URL + '/InternetMcstMcstPymCfmt', body);
    }
  }

  /**
   *
   * //        pt_no = "10628653";
   * //        fromdate = "20180427";
   * //        todate = "20180831";
   * //        his_hsp_tp_cd = "02";
   * @param body
   */

  /**
   * 통원진료확인서
   * @param body
   */
  async internetCtfsOtptInfom(body: ReqInternetCtfsOtptInfom): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      this.logger.debug(`############## EMR-API START [DUMMY] ##############`);
      this.logger.debug(`REQ : ${JSON.stringify(body)}`);

      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetCtfsOtptInfom.xml', 'utf8');
      this.logger.debug(`RESP : ${JSON.stringify(xml)}`);

      const parseXml = await parseToJson(xml);
      this.logger.debug(`RESP-CONVERT-JSON : ${JSON.stringify(parseXml)}`);
      this.logger.debug(`############## EMR-API END [DUMMY] ################`);
      return parseXml;
    }else{
      return await this.requestApi(this.CERT_API_BASE_URL + '/InternetCtfsOtptInfom', body);
    }
  }

  /**
   * 진료비세부내역서(입원)
   * @param body
   */
  async internetMcstDtlPtclFom(body: ReqInternetMcstDtlPtclFom): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      this.logger.debug(`############## EMR-API START [DUMMY] ##############`);
      this.logger.debug(`REQ : ${JSON.stringify(body)}`);

      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetMcstDtlPtclFomNEW.xml', 'utf8');
      this.logger.debug(`RESP : ${JSON.stringify(xml)}`);

      const parseXml = await parseToJson(xml);
      this.logger.debug(`RESP-CONVERT-JSON : ${JSON.stringify(parseXml)}`);
      this.logger.debug(`############## EMR-API END [DUMMY] ################`);return parseXml;
    }else{
      return await this.requestApi(this.CERT_API_BASE_URL + '/InternetMcstDtlPtclFomNEW', body);
    }
  }

  /**
   * 진료비 세부산정내역 - 외래
   * @param body
   */
  async internetMcstDtOPtclFom(body: ReqInternetMcstDtoPtclFom): Promise<any> {
    if(this.commonConfService.IS_EMR_TEST_DATA){
      this.logger.debug(`############## EMR-API START [DUMMY] ##############`);
      this.logger.debug(`REQ : ${JSON.stringify(body)}`);

      const xml =  fs.readFileSync(this.KIOSK_API_DUMMY_PATH + '/InternetMcstDtOPtclFomNEW.xml', 'utf8');
      this.logger.debug(`RESP : ${JSON.stringify(xml)}`);

      const parseXml = await parseToJson(xml);
      this.logger.debug(`RESP-CONVERT-JSON : ${JSON.stringify(parseXml)}`);
      this.logger.debug(`############## EMR-API END [DUMMY] ################`);
      return parseXml;
    }else{
      return await this.requestApi(this.CERT_API_BASE_URL_DEV + '/InternetMcstDtOPtclFomNEW', body);
    }
  }

  /**
   * 진료과 리스트
   * @param body
   */
  async homepageMedCode(body: ReqHomepageMedCode): Promise<HomepageMedCode> {
    try {
      const json = await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedCode', body);
      return json;
    } catch(e) {
      this.logger.debug(e);
      return null;
    }
  }


  /**
   * 진료과별 의사 리스트
   * @param body
   * @constructor
   */
  async HomepageMedrCode(body: ReqHomepageMedDocCode) {
    try {
      const json = await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedrCode', body);


      return json;
    } catch(e) {
      this.logger.debug(e);
      return null;
    }
  }

  /**
   * 의사별 진료일 체크
   * @param body
   * @constructor
   */
  async HomepageMedDtm_Doc_Sched(body: ReqHomepageMedSchd) {
    try {
      const json = await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedDtm_Doc_Sched_New', body);


      return json;
    } catch(e) {
      this.logger.debug(e);
      return null;
    }
  }

  /**
   * 의사별 진료시간 체크
   * @param body
   * @constructor
   */
  async HomepageMedDtmTmSear(body: ReqHomepageMedDtm) {
    try {
      const json = await this.requestApi(this.RSV_API_BASE_URL + '/HomepageMedDtmTmSearNew', body);


      return json;
    } catch(e) {
      this.logger.debug(e);
      return null;
    }
  }


  /**
   * 환자정보체크
   * @param body
   * @constructor
   */
  async InternetCtfsPatInfo_2(body: ReqInternetCtfsPatInfo) {
    try {
      // const json = await this.requestApi(this.CERT_API_BASE_URL + '/InternetCtfsPatInfo_2', body);
      const json = await this.requestApi(this.CERT_API_BASE_URL + '/InternetCtfsPatInfo_2_PTNO', body);


      return json;
    } catch(e) {
      this.logger.debug(e);
      return null;
    }
  }





}
