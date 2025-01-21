import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { ResponseDto } from "../../common/dto/response.dto";
import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import * as moment from "moment-timezone";
import { WaitingNumber } from "./dto/waitting-number.dto";
import { CommonTicketRequestDto } from "../../common/dto/tcp/common-ticket-request.dto";
import { RespReqNumberTicketDto } from "./dto/resp-req-number-ticket.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../../entities/eumc-waiting-number.eumc-entity";
import { Repository } from "typeorm";
import { TicketClientService } from "./tcp/ticket-client.service";
import { ApiResult } from "../../const/api-result.const";
import assert from "assert";
import { RespTicketServerInterface } from "../../dto/ticket-server-tcp/resp-ticket-server.interface";
import { RespReqWaitNumberHospitalDto } from "./dto/resp-req-number-hospital.interface";
import { CommonCodeConst } from "../../const/common-code.const";
import { OneSignalPushApiService } from "../one-signal-push-api/one-signal-push-api.service";
import { ReqPatientCallDto } from "../one-signal-push-api/dto/req-patient-call.dto";
import { EumcAppApiService } from "../eumc-app-api/eumc-app-api.service";
import { WaittingNumberSeoul } from "./dto/waitting-number-seoul.dto";

@Injectable()
export class TicketApiService {
  private readonly logger = new Logger(TicketApiService.name);

  constructor(
    private httpService: HttpService,
    @Inject(forwardRef(() => TicketClientService))
    private tickerClientService: TicketClientService,
    private oneSignalPushApiService: OneSignalPushApiService,
    private eumcAppApiService: EumcAppApiService,
    @InjectRepository(EumcWaitingNumberEumcEntity, "eumc_pay")
    private eumcWaitingNumberRepo: Repository<EumcWaitingNumberEumcEntity>
  ) {
  }

  async selectWaitingList(
    hsp_tp_cd: string,
    patno: string
  ): Promise<EumcWaitingNumberEumcEntity[]> {
    const dataSet = await this.eumcWaitingNumberRepo.find({
      where: {
        hsp_tp_cd: hsp_tp_cd,
        patno: patno,
        status: 0
      }
    });

    return dataSet;
  }

  async getWaitingNumberSeoulInfo(
    pt_no: string,
    result: any
  ): Promise<WaitingNumber[]> {
    let arr: WaitingNumber[] = []
    //   = [
    //   new WaitingNumber("1", 0, "원무 접수·수납", 0),
    //   new WaitingNumber("54", 0, "관절·척추센터 원무 접수·수납", 0),
    //   new WaitingNumber("2", 0, "원무 접수·수납", 0),
    //   new WaitingNumber("7", 0, "제증명", 0),
    //   new WaitingNumber("8", 0, "의무기록", 0),
    //   new WaitingNumber("9", 0, "입·퇴원 수속", 0),
    //   new WaitingNumber("3", 0, "A 원무 접수·수납", 0),
    //   new WaitingNumber("4", 0, "B 원무 접수·수납", 0),
    //   new WaitingNumber("5", 0, "A 원무 접수·수납", 0),
    //   new WaitingNumber("6", 0, "B 원무 접수·수납", 0)
    // ];

    const dataSet = await this.eumcWaitingNumberRepo.find({
      where: {
        hsp_tp_cd: '01',
        patno: pt_no,
        status: 0
      },
    });


    const waitNumberList =
      result as Array<WaittingNumberSeoul>;

    arr = waitNumberList
      .filter(item=>{
        return (item.DIV_ID == 1 || item.DIV_ID == 2
          || item.DIV_ID == 3 || item.DIV_ID == 4 || item.DIV_ID == 5
          || item.DIV_ID == 6 || item.DIV_ID == 7 || item.DIV_ID == 8
          || item.DIV_ID == 9 || item.DIV_ID == 54);
      })
      .map((item)=>{
        const newOne = new WaitingNumber(item.DIV_ID+'', 0, item.DESCRIPT, item.WAITING);
        let found = dataSet.filter(db=>{
          return (db.kioskIp == item.DIV_ID+'' && db.menu == '0');
        })
        if(typeof(found) != 'undefined' && found.length > 0 && typeof(found[0].callNo) != 'undefined'){
          newOne.myNumber = found[0].callNo;
        }
        return newOne;
    })

    /**
     * [{"TASK":"1","AREA":"지하1원무","GROUP":"","DIV_ID":1,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"1","AREA":"1층","GROUP":"","DIV_ID":2,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"1","AREA":"2층A","GROUP":"A","DIV_ID":3,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"1","AREA":"2층B","GROUP":"B","DIV_ID":4,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"1","AREA":"3층A","GROUP":"A","DIV_ID":5,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"1","AREA":"3층B","GROUP":"B","DIV_ID":6,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"2","AREA":"제증명","GROUP":"","DIV_ID":7,"DESCRIPT":"제증명(진단서)","WAITING":0},{"TASK":"3","AREA":"의무기록","GROUP":"","DIV_ID":8,"DESCRIPT":"의무기록","WAITING":0},{"TASK":"4","AREA":"입·퇴원","GROUP":"","DIV_ID":9,"DESCRIPT":"입·퇴원 수속","WAITING":0},{"TASK":"5","AREA":"산재·자보","GROUP":"","DIV_ID":10,"DESCRIPT":"산재·자보 상담","WAITING":0},{"TASK":"6","AREA":"내분비내과","GROUP":"","DIV_ID":11,"DESCRIPT":"내분비내과","WAITING":0},{"TASK":"7","AREA":"심뇌혈관센터","GROUP":"","DIV_ID":12,"DESCRIPT":"심뇌혈관센터","WAITING":0},{"TASK":"8","AREA":"진료실","GROUP":"","DIV_ID":13,"DESCRIPT":"외래 진료실","WAITING":0},{"TASK":"9","AREA":"채혈실2층","GROUP":"","DIV_ID":14,"DESCRIPT":"채혈실","WAITING":0},{"TASK":"10","AREA":"비뇨의학과","GROUP":"","DIV_ID":28,"DESCRIPT":"비뇨의학과","WAITING":0},{"TASK":"11","AREA":"관절척추센터","GROUP":"","DIV_ID":45,"DESCRIPT":"관절척추센터","WAITING":0},{"TASK":"12","AREA":"핵의학과","GROUP":"","DIV_ID":46,"DESCRIPT":"핵의학과","WAITING":0},{"TASK":"13","AREA":"산부인과","GROUP":"","DIV_ID":47,"DESCRIPT":"산부인과","WAITING":0},{"TASK":"14","AREA":"안과","GROUP":"","DIV_ID":48,"DESCRIPT":"안과","WAITING":0},{"TASK":"15","AREA":"피부과","GROUP":"","DIV_ID":49,"DESCRIPT":"피부과","WAITING":0},{"TASK":"16","AREA":"가정의학과","GROUP":"","DIV_ID":50,"DESCRIPT":"가정의학과","WAITING":0},{"TASK":"18","AREA":"외래주사실","GROUP":"","DIV_ID":52,"DESCRIPT":"외래주사실","WAITING":0},{"TASK":"19","AREA":"임상시험센터","GROUP":"","DIV_ID":53,"DESCRIPT":"임상시험센터","WAITING":0},{"TASK":"1","AREA":"지하1관절","GROUP":"","DIV_ID":54,"DESCRIPT":"원무 접수·수납","WAITING":0},{"TASK":"20","AREA":"웰니스종합검진","GROUP":"","DIV_ID":55,"DESCRIPT":"웰니스종합검진","WAITING":0},{"TASK":"21","AREA":"정신건강의학과","GROUP":"","DIV_ID":56,"DESCRIPT":"정신건강의학과","WAITING":0},{"TASK":"100","AREA":"개발용","GROUP":"","DIV_ID":57,"DESCRIPT":"개발용","WAITING":0},{"TASK":"100","AREA":"개발용-B","GROUP":"","DIV_ID":61,"DESCRIPT":"개발용-B","WAITING":0},{"TASK":"22","AREA":"원무접수·수납","GROUP":"","DIV_ID":62,"DESCRIPT":"수납","WAITING":0},{"TASK":"23","AREA":"특수검사실","GROUP":"","DIV_ID":63,"DESCRIPT":"특수검사실","WAITING":0},{"TASK":"24","AREA":"채혈실3층","GROUP":"","DIV_ID":64,"DESCRIPT":"채혈실","WAITING":0},{"TASK":"25","AREA":"채혈실B1","GROUP":"","DIV_ID":65,"DESCRIPT":"채혈실","WAITING":0},{"TASK":"26","AREA":"성형외과","GROUP":"","DIV_ID":66,"DESCRIPT":"성형외과","WAITING":0},{"TASK":"29","AREA":"치과촬영","GROUP":"","DIV_ID":68,"DESCRIPT":"치과촬영","WAITING":0},{"TASK":"27","AREA":"영상일반촬영","GROUP":"","DIV_ID":69,"DESCRIPT":"","WAITING":0},{"TASK":"28","AREA":"소아청소년과","GROUP":"","DIV_ID":78,"DESCRIPT":"소아청소년과","WAITING":0},{"TASK":"28","AREA":"진정실","GROUP":"","DIV_ID":85,"DESCRIPT":"진정실","WAITING":0},{"TASK":"30","AREA":"영상초음파실","GROUP":"","DIV_ID":86,"DESCRIPT":"","WAITING":0}]
     */


    return arr;
  }

  async reqWaitNumberList(pt_no: string) {
    this.logger.debug("병원 API서버에 대기 리스트를 요청");
    try {
      let callResp = null;
      // WORK_DT: string, APP_DIV: string
      const WORK_DT = moment().format("yyyyMMDD");
      const APP_DIV = "M";
      const result$ = await this.httpService.get(
        `http://172.17.10.33:3990/api/WAIT_SEQ_DEFAULT?WORK_DT=${WORK_DT}&APP_DIV=${APP_DIV}`
      );
      callResp = await lastValueFrom(result$);

      // API응답결과를 파싱해서
      return await this.getWaitingNumberSeoulInfo(pt_no, callResp.data);
    } catch (e) {
      this.logger.debug(`병원 API서버에 대기 리스트를 요청 ERR ${e}`);
      throw e;
    }
  }

  /**
   *
   * @param div_id 부서번호
   * @param reg_no 환자번호
   */
  async reqWaitNumber(div_id: string, reg_no: string) {
    this.logger.debug("병원 API서버에 번호표 요청");
    let resp: RespReqNumberTicketDto;

    try {
      let callResp = null;
      const APP_DIV = "M";

      const result$ = await this.httpService.get(
        `http://172.17.10.33:3990/api/WAIT_SEQ_GET?DIV_ID=${div_id}&${reg_no}&APP_DIV=${APP_DIV}`
      );
      callResp = await lastValueFrom(result$);

      // [{"WK_DIV":"GET","DIV_ID":1,"WORK_DT":"20230318","WAIT_NO":4,"REG_NO":"","REG_NM":"","BIRTH":"","WAITING":4,"AREATOTAL":4,"WND_NO":0,"ADDRESS":"","APP_DIV":"M"}]
      // RespReqWaitNumberHospitalDto {"BirthDate":"","DivId":2,"RegNm":"이정진","RegNo":"96476189","WaitNo":10,"WndNo":0,"AppDiv":"R","AreaTotal":6,"Message":"","Waiting":6}
      // 20230321: 요청결과
      // {"WK_DIV":"GET","DIV_ID":57,"WORK_DT":"20230321","WAIT_NO":3,"REG_NO":"","REG_NM":"","BIRTH":"","WAITING":3,"AREATOTAL":3,"WND_NO":0,"ADDRESS":"","APP_DIV":"M"}
      if (typeof callResp.data == "string") {
        callResp = JSON.parse(callResp);
      }

      const waitNumberList =
        callResp.data as Array<RespReqWaitNumberHospitalDto>;

      for (let i = 0; i < waitNumberList.length; i++) {
        try {
          const tmp = waitNumberList[i];

          this.logger.debug(`번호표 요청 결과 : ${JSON.stringify(tmp)}`);

          if (div_id == (tmp.DIV_ID+'')) {
            resp = new RespReqNumberTicketDto();
            resp.myNumber = tmp.WAIT_NO;
            resp.waitingCount = tmp.WAITING;
            resp.kioskIp = tmp.DIV_ID + '';
            resp.menu = 0;
            resp.patno = reg_no;

            const saveData = new EumcWaitingNumberEumcEntity();
            saveData.hsp_tp_cd = CommonCodeConst.HIS_HSP_TP_CD_SEOUL; // 서울
            saveData.kioskIp = resp.kioskIp;
            saveData.menu = resp.menu.toString();
            saveData.callNo = resp.myNumber;
            saveData.patno = resp.patno;
            saveData.status = 0;
            saveData.regDate = new Date();
            const dbOk = await this.eumcWaitingNumberRepo.save(saveData);
            this.logger.log(
              `번호표 데이터 디비저장 결과 : ${JSON.stringify(dbOk)}`
            );

            break;
          }
        } catch (e) {
          this.logger.error(`병원 API 데이터 파싱 및 디비 저장 ERR : ${e}`);
          throw e;
        }
      }

      return resp;

      /**
       *             JSONArray jArr = new JSONArray(result);
       *             for(int i = 0; i < jArr.length(); i++){
       *                 try{
       *                     JSONObject jObj = jArr.getJSONObject(i);
       *                     logger.info("request ticket result : " + jObj.toString());
       *                     if(divId.equals(String.valueOf(jObj.getInt("DIV_ID")))){
       *                         resReqNumberTicketDTO = new ResReqNumberTicketDTO(
       *                                 jObj.getInt("WAIT_NO"),
       *                                 jObj.getInt("WAITING"),
       *                                 String.valueOf(jObj.getInt("DIV_ID")),
       *                                 0,
       *                                 String.valueOf(jObj.getInt("REG_NO"))
       *                         );
       *
       *                         EumcWaitingNumberEumcEntity waitingNumber = new EumcWaitingNumberEumcEntity();
       *                         waitingNumber.setHsp_tp_cd("01");
       *                         waitingNumber.setKioskIp(String.valueOf(jObj.getInt("DIV_ID")));
       *                         waitingNumber.setMenu(0);
       *                         waitingNumber.setCallNo(jObj.getInt("WAIT_NO"));
       *                         waitingNumber.setStatus(0);
       *                         waitingNumber.setPatno(String.valueOf(jObj.getInt("REG_NO")));
       *                         waitingNumber.setRegDate(new Date());
       *                         eumcTicketRepository.save(waitingNumber);
       *
       *                         break;
       *                     }
       *
       *                 }
       *                 catch (Exception e){
       *                     logger.info("request number seoul parse e : " + e.toString());
       *                 }
       *             }
       */
      //TODO: EumcWaitingNumberEumcEntity 디비작업이므로 연결필요
    } catch (e) {
      this.logger.error(`병원 API서버에 번호표 요청 ERR : ${e}`);
      throw e;
    }

    return null;
  }

  // String patno, String result
  async getWaitingNumberInfo(
    pt_no: string,
    wait_cnt_list_str: string
  ): Promise<WaitingNumber[]> {

    const waitingCnt = wait_cnt_list_str.split("|");

    const arrWaitingList: WaitingNumber[] = [
      new WaitingNumber("10.10.205.57", 1, "1층 외래수납", Number(waitingCnt[0])),
      new WaitingNumber("10.10.210.66", 1, "2층 외래수납", Number(waitingCnt[4])),
      new WaitingNumber("10.10.219.53", 1, "4층여성암(외래수납)", Number(waitingCnt[5])),
      new WaitingNumber("10.10.210.63", 3, "2층 입퇴원", Number(waitingCnt[1])),
      new WaitingNumber("10.10.210.65", 4, "2층 제증명", Number(waitingCnt[2])),
      new WaitingNumber("10.10.210.65", 5, "2층 의무기록사본", Number(waitingCnt[3]))
    ];

    const arrDbList = await this.selectWaitingList("02", pt_no);

    for (let i = 0; i < arrWaitingList.length; i++) {
      for (let j = 0; j < arrDbList.length; j++) {
        if (
          arrDbList[j].kioskIp == arrWaitingList[i].kioskIp &&
          arrDbList[j].menu == arrWaitingList[i].menu.toString()
        ) {
          arrWaitingList[i].myNumber = arrDbList[j].callNo;
          break;
        }
      }
    }
    /**
     *    String[] waitingCnt = result.split("[|]");
     *         ArrayList<WaitingNumber> arrWaitingList = new ArrayList<>();
     *         // 테스트
     * //        arrWaitingList.add(new WaitingNumber("192.168.10.178", 1, "4층여성암(외래수납)", Integer.parseInt(waitingCnt[5])));
     * //        arrWaitingList.add(new WaitingNumber("192.168.10.178", 2, "4층여성암(유방암갑상선)", Integer.parseInt(waitingCnt[6])));
     * //        arrWaitingList.add(new WaitingNumber("192.168.10.178", 3, "4층여성암(부인종양)", Integer.parseInt(waitingCnt[7])));
     * //        arrWaitingList.add(new WaitingNumber("192.168.10.178", 4, "4층여성암(영상의학과)", Integer.parseInt(waitingCnt[8])));
     * //        arrWaitingList.add(new WaitingNumber("192.168.10.178", 5, "4층여성암(외래검사)", Integer.parseInt(waitingCnt[9])));
     * //        arrWaitingList.add(new WaitingNumber("192.168.10.178", 6, "4층여성암(검사예약)", Integer.parseInt(waitingCnt[10])));
     *
     *         // 라이브waitingList_test
     *
     *         arrWaitingList.add(new WaitingNumber("10.10.205.57", 1, "1층 외래수납", Integer.parseInt(waitingCnt[0])));
     *         arrWaitingList.add(new WaitingNumber("10.10.210.66", 1, "2층 외래수납", Integer.parseInt(waitingCnt[4])));
     *         arrWaitingList.add(new WaitingNumber("10.10.219.53", 1, "4층여성암(외래수납)", Integer.parseInt(waitingCnt[5])));
     *         arrWaitingList.add(new WaitingNumber("10.10.210.63", 3, "2층 입퇴원", Integer.parseInt(waitingCnt[1])));
     *         arrWaitingList.add(new WaitingNumber("10.10.210.65", 4, "2층 제증명", Integer.parseInt(waitingCnt[2])));
     *         arrWaitingList.add(new WaitingNumber("10.10.210.65", 5, "2층 의무기록사본", Integer.parseInt(waitingCnt[3])));
     * //        arrWaitingList.add(new WaitingNumber("10.10.219.53", 2, "4층여성암(유방암갑상선)", Integer.parseInt(waitingCnt[6])));
     * //        arrWaitingList.add(new WaitingNumber("10.10.219.53", 3, "4층여성암(부인종양)", Integer.parseInt(waitingCnt[7])));
     * //        arrWaitingList.add(new WaitingNumber("10.10.219.53", 4, "4층여성암(영상의학과)", Integer.parseInt(waitingCnt[8])));
     * //        arrWaitingList.add(new WaitingNumber("10.10.219.53", 5, "4층여성암(외래검사)", Integer.parseInt(waitingCnt[9])));
     * //        arrWaitingList.add(new WaitingNumber("10.10.219.53", 6, "4층여성암(검사예약)", Integer.parseInt(waitingCnt[10])));
     *
     *         ArrayList<EumcWaitingNumberEumcEntity> arrDbList = eumcTicketRepository.waitingList("02", patno);
     * //        logger.info("w_number db size : " + arrDbList.size());
     * //        for(int i = 0; i < arrDbList.size(); i++){
     * //            logger.info(arrDbList.get(i).getKioskIp() + " | " + arrDbList.get(i).getCallNo());
     * //        }
     *         for(int i = 0; i < arrWaitingList.size(); i++){
     *             for(int j = 0; j < arrDbList.size(); j++){
     *                 if(arrDbList.get(j).getKioskIp().equals(arrWaitingList.get(i).getKioskIp())
     *                         && arrDbList.get(j).getMenu() == arrWaitingList.get(i).getMenu()
     *                 ){
     * //                    logger.info("w : " + arrWaitingList.get(i).getKioskIp() + " | " + arrWaitingList.get(i).getMenu());
     * //                    logger.info("d : " + arrDbList.get(j).getKioskIp() + " | " + arrDbList.get(j).getMenu());
     *                     arrWaitingList.get(i).setMyNumber(arrDbList.get(j).getCallNo());
     *                     break;
     *                 }
     *             }
     *         }
     * //        for(int i = 0; i < arrWaitingList.size(); i++){
     * //            logger.info(arrWaitingList.get(i).getKioskIp() + " | " + arrWaitingList.get(i).getMenu() + " | " + arrWaitingList.get(i).getMyNumber());
     * //        }
     */

    return arrWaitingList;
  }

  /**
   * ###########################################################################################################
   *                                           발권서버 요청 중계
   * ###########################################################################################################
   */

  /**
   * 번호표 리스트 조회
   * @param req
   * @return wait_cnt_list_str
   */
  async getWaitingListFromTicketServer(
    req: CommonTicketRequestDto
  ): Promise<string> {
    this.logger.debug("번호표 리스트 조회 START ");
    let resp = null;

    try {
      resp = await this.tickerClientService.sendMessage({
        SEND_CMD: "WAIT",
        TICKET_NUM: "",
        SERVER_IDX: 0,//req.ticketServerIdx,
        DATA: req
      });

      if (typeof resp == "string") {
        resp = JSON.parse(resp);
      }

      if (resp instanceof Array) {
        resp = resp.length > 0 ? resp[0] : {};
      }

      this.logger.debug(`번호표 리스트 조회 END : ${resp}`);

      //      assert(resp.WAIT);

      if (resp.WAIT == null) {
        throw `TICKER_SERVER RESPONSE 'WAIT' field IS NULL`;
      }
    } catch (e) {
      // this.logger.error(`번호표 리스트 조회 ERR : ${e}`);
      throw e;
    }

    return resp.WAIT;
  }

  async requestTicketToTicketServer(req: CommonTicketRequestDto) {
    this.logger.debug("번호표 요청 START");
    const resp = new RespReqNumberTicketDto();

    try {
      // RESP: [{\"SYSTEM\":1,\"CMD\":\"ISSUE2\", \"K_IP\":\"10.10.210.65\", \"MENU\":5, \"PATIENT\":96476189, \"TICKET\":5, \"WAITCNT\":5}]
      let tcpResp = await this.tickerClientService.sendMessage({
        SEND_CMD: "ISSUE",
        SERVER_IDX: 0,//req.ticketServerIdx,
        DATA: req
      });

      let reqTicketResp: RespTicketServerInterface;

      if (typeof tcpResp == "string") {
        tcpResp = JSON.parse(tcpResp + '');
      }

      // 예상한 형태에 맞을 경우
      if (tcpResp instanceof Array<RespTicketServerInterface>) {
        reqTicketResp = tcpResp[0] as RespTicketServerInterface;
      } else {
        // string 형태등의 다른 형태로 넘어올경우
      }

      // 발권서버 응답결과를 가공해서 'ResReqNumberTicketDTO' 형태로 가공
      resp.myNumber = reqTicketResp.TICKET;
      resp.waitingCount = reqTicketResp.WAITCNT;
      resp.kioskIp = reqTicketResp.K_IP;
      resp.menu = reqTicketResp.MENU;
      resp.patno = reqTicketResp.PATIENT + '';

      // 'ResReqNumberTicketDTO' 데이터를 디비에 저장
      /**
       * EumcWaitingNumberEumcEntity
       *  @Column({ nullable: false, length: 2 })
       *   hsp_tp_cd: string;
       *
       *   @Column({ nullable: false, length: 20 })
       *   kioskIp: string;
       *
       *   @Column({ nullable: false })
       *   menu: string;
       *
       *   @Column({ nullable: false })
       *   callNo: number;
       *
       *   @Column({ nullable: false })
       *   status: number;
       *
       *   @Column({ nullable: false, length: 10 })
       *   patno: string;
       */

      const saveData = new EumcWaitingNumberEumcEntity();
      saveData.hsp_tp_cd = CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG;
      saveData.kioskIp = resp.kioskIp;
      saveData.menu = resp.menu + '';
      saveData.callNo = resp.myNumber;
      saveData.patno = resp.patno;
      saveData.status = 0;
      saveData.regDate = new Date();
      const dbOk = await this.eumcWaitingNumberRepo.save(saveData);
      this.logger.log(`번호표 데이터 디비저장 결과 : ${JSON.stringify(dbOk)}`);

      // 리턴 'ResReqNumberTicketDTO'
      return resp;

      /**
       *     String result = nettyClient.sendMessage(request, playerId);
       * //        logger.info("requestTicket : " + result);
       * //        String result = "[{\"SYSTEM\":1,\"CMD\":\"ISSUE2\", \"K_IP\":\"10.10.210.65\", \"MENU\":5, \"PATIENT\":96476189, \"TICKET\":5, \"WAITCNT\":5}]";
       * //        ArrayList<ResReqNumberTicketDTO> arrTicket = new ArrayList<>();
       * //        JSONArray jArr = new JSONArray(result);
       * //        for(int i = 0; i < jArr.length(); i++){
       *         ResReqNumberTicketDTO resReqNumberTicketDTO = null;
       *         try{
       *             JSONObject jObj = new JSONObject(result);
       *             logger.info("request ticket result : " + jObj.toString());
       *             resReqNumberTicketDTO = new ResReqNumberTicketDTO(
       *                             jObj.getInt("TICKET"),
       *                             jObj.getInt("WAITCNT"),
       *                             jObj.getString("K_IP"),
       *                             jObj.getInt("MENU"),
       *                             String.valueOf(jObj.getInt("PATIENT"))
       *                     );
       *
       *             EumcWaitingNumberEumcEntity waitingNumber = new EumcWaitingNumberEumcEntity();
       *             waitingNumber.setHsp_tp_cd("02");
       *             waitingNumber.setKioskIp(jObj.getString("K_IP"));
       *             waitingNumber.setMenu(jObj.getInt("MENU"));
       *             waitingNumber.setCallNo(jObj.getInt("TICKET"));
       *             waitingNumber.setStatus(0);
       *             waitingNumber.setPatno(String.valueOf(jObj.getInt("PATIENT")));
       *             waitingNumber.setRegDate(new Date());
       *             eumcTicketRepository.save(waitingNumber);
       *         }
       *         catch (Exception e){
       *             logger.info("ticket save e : " + e.toString());
       *         }
       */
    } catch (e) {
      throw e;
    }
  }

  async updateCallStatus(
    hsp_tp_cd: string,
    kioskIp: string,
    menu: number,
    patno: string,
    callNo: number,
    desk?: number
  ) {
    this.logger.debug("번호표 정보 갱신 START");
    try {
      //TODO: 체크필요 서울병원일때만 푸시전송?
      // if (hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
      /**
       *  // 푸시 전송
       *                 ResponseDTO res = pushService.getPush(patno);
       *                 EumcPush eumcPush = (EumcPush) res.getData();
       *
       *                 OneSignalRequest oneSignalRequest = new OneSignalRequest();
       *                 oneSignalRequest.patientCall(oneSignalRequest.getMessage(new NumberTicketDTO(eumcPush.getAppKey(), String.valueOf(callNo), jObj)));
       *             }
       * //            11283254 | 10.10.210.66 | 1 | 51
       *             if(eumcTicketRepository == null){
       * //                logger.info("eumcTicketRepository is null");
       *                 return 0;
       *             }else {
       * //                logger.info("eumcTicketRepository is not null");
       *                 int result = eumcTicketRepository.updateStatus(his_hsp_tp_cd, kioskIp, patno, menu, callNo, 0);
       * //                logger.info("w_number update result : " + result);
       *                 return result;
       *             }
       */

      // 1. Push 전송 - OneSignal
      // DB에서 Push-key 가져오고 > pushService
      try {
        const foundOne = await this.eumcAppApiService.getPushInfo(patno);
        const callParam = new ReqPatientCallDto();
        callParam.include_player_ids.push(foundOne.pushKey); // push key

        if(desk != null && typeof(desk) != 'undefined') {
          callParam.contents = {
            en: `${desk}번 창구. 호출 하였습니다.`
          };
        }else{
          callParam.contents = {
            en: `${callNo}번 호출 하였습니다.`
          };
        }

        // OneSignal Request
        await this.oneSignalPushApiService.patientCall(callParam);
      } catch (e) {
        this.logger.error(e);
      }
      // }

      // 2. DB 저장
      const foundOne = await this.eumcWaitingNumberRepo.findBy({
        hsp_tp_cd: hsp_tp_cd,
        kioskIp: kioskIp,
        patno: patno,
        menu: menu.toString(),
        callNo: callNo,
        status: 0
      });

      if (foundOne != null && foundOne.length > 0) {
        foundOne[0].status = 1;
        foundOne[0].callDate = new Date();

        const dbOk = await this.eumcWaitingNumberRepo.update(
          foundOne[0].seq,
          foundOne[0]
        );
        this.logger.log(
          `번호표 데이터 디비저장 결과 : ${JSON.stringify(dbOk)}`
        );

        if (dbOk != null) {
          return 1;
        }
      }
    } catch (e) {
      this.logger.debug(`번호표 정보 갱신 ERR : ${e}`);
      throw e;
    }
    return 0;
  }
}
