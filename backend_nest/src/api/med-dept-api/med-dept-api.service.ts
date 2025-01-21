import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { RespMedDept } from "./dto/resp-med-dept.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { EumcWaitingNumberEumcEntity } from "../../entities/eumc-waiting-number.eumc-entity";
import { Repository } from "typeorm";
import { ReservationApiService } from "../reservation-api/reservation-api.service";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { ReqRsvToday } from "../reservation-api/dto/req-rsv-today.interface";
import * as moment from "moment-timezone";
import { getArrFirstData } from "../../utils/string.util";
import { parseToJson } from "../../utils/xml.util";

@Injectable()
export class MedDeptApiService {
  private readonly logger = new Logger(MedDeptApiService.name);


  constructor(private httpService: HttpService,
              @InjectRepository(EumcWaitingNumberEumcEntity, "eumc_pay")
              private eumcWaitingNumberRepo: Repository<EumcWaitingNumberEumcEntity>,
              private readonly emrSoapApiService: EmrSoapApiService,
              private readonly reservationApiService: ReservationApiService
  ) {
  }


  async getMeddeptWaitOCS(his_hsp_tp_cd: string, patno: string) {
    try{
      this.logger.debug(`getMeddeptWaitOCS : ${his_hsp_tp_cd}, ${patno}`)

      let resultArr: Array<RespMedDept> = [];
      let arrivePatInfoWaitList = await this.emrSoapApiService.internetDeptRoomWaittingPatientList({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_MED_DT: moment().format('yyyyMMDD'),
        IN_MED_DEPT_CD: "",
        IN_MTM_NO: "0",
        IN_MED_CMPL_YN: "N"
      });
      this.logger.debug(`arrivePatInfoWaitList : ${JSON.stringify(arrivePatInfoWaitList)}`);
      let processed = arrivePatInfoWaitList;

      // this.logger.debug(`arrivePatInfoWaitList2 : ${JSON.stringify(processed)}`);

      if (processed != null) {
        processed = processed.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table;

        for (let i = 0; i < processed.length; i++) {
          for (let el in processed[i]) {
            processed[i][el] = getArrFirstData(processed[i][el]);
          }
        }

        for (const arrivePatInfo of processed) {
          if(arrivePatInfo.PT_NO == patno) {
            resultArr.push({
              patno: arrivePatInfo.PT_NO,
              pact_id: '',
              deptcode: arrivePatInfo.MED_DEPT_CD,
              deptname: '',
              status: '1'
            })
          }
        }
      }
      this.logger.debug(`resultArr : ${JSON.stringify(resultArr)}`);
      return resultArr;
    }catch (e) {
      this.logger.error(e);
      throw e;
    }
  }



  async getMeddeptWaitServer(his_hsp_tp_cd: string, patno: string, rpy_pact_id: string) {
    try{
      const resultRsvList = await this.reservationApiService.getRsvList(rpy_pact_id, his_hsp_tp_cd, patno, patno, true);

      let resultArr: Array<RespMedDept> = [];

      this.logger.debug(`resultRsvList : ${JSON.stringify(resultRsvList)}`)

      for (const rsv_el of resultRsvList) {
       // if(rsv_el.MED_YN == '미진료') {
          const eumcWaitingMeddepts = await this.reservationApiService.getDeptWaitListByPactId(rsv_el.RPY_PACT_ID);
          if(eumcWaitingMeddepts.length == 0) {
            resultArr.push({
              patno: patno,
              pact_id: rsv_el.RPY_PACT_ID,
              deptcode: rsv_el.MED_DEPT_CD,
              deptname: rsv_el.DEPT_NM,
              status: "0"
            });
          }else{
            resultArr.push({
              patno: patno,
              pact_id: rsv_el.RPY_PACT_ID,
              deptcode: rsv_el.MED_DEPT_CD,
              deptname: rsv_el.DEPT_NM,
              status: "1"
            });
          }
      //  }
      }
      this.logger.debug(`getMeddeptWaitServer resultArr : ${JSON.stringify(resultArr)}`)

      return resultArr;
    }catch (e) {
      this.logger.error(e);
    }
  }



  async getMeddeptWaitList(his_hsp_tp_cd: string, pt_no: string, rpy_pact_id: string): Promise<Array<RespMedDept>> {
    let result: RespMedDept[] = [];
    /**
     *   IN_HSP_TP_CD: string;
     *   IN_MED_DT: string;
     *   IN_MED_DEPT_CD: string;
     *   IN_MTM_NO: string;
     *   IN_MED_CMPL_YN: string;
     */
    try {
      const waitServerList = await this.getMeddeptWaitServer(his_hsp_tp_cd, pt_no, rpy_pact_id);
      const arrMeddeptWaitOCS = await this.getMeddeptWaitOCS(his_hsp_tp_cd, pt_no);


      // 0 : 접수, 1 : 도착확인, 2 : 진료실앞 대기, 3 : 진료실 호출, 4 : 진료 완료
      for (const respMedDept of waitServerList) {
        for (const arrMeddeptWaitOC of arrMeddeptWaitOCS) {
          if (respMedDept.deptcode == arrMeddeptWaitOC.deptcode) {
            respMedDept.status = arrMeddeptWaitOC.status;
          }
        }
      }

      result = waitServerList;
    }catch (e) {
      this.logger.error(e);
      throw e;
    }

    return result;
  }






}
