import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { EumcAppVersionRepoService } from "../../repo/eumc-app-version-repo.service";
import { EumcPushRepoService } from "../../repo/eumc-push-repo.service";
import { InjectRepository } from "@nestjs/typeorm";
import { AlimtalkMgrEntity } from "../../entities/alimtalk-mgr.alimtalk-entity";
import { Repository } from "typeorm";
import { EumcAlimtalkEumcEntity } from "../../entities/eumc-alimtalk.eumc-entity";
import * as moment from "moment-timezone";
import { CommonCodeConst, RCP_TYPE } from "../../const/common-code.const";
import { PatientApiService } from "../patient-api/patient-api.service";

@Injectable()
export class AlimtalkApiService {
  private readonly logger = new Logger(AlimtalkApiService.name);

  private static HOS_NAME_1 = "♡이대서울병원♡";
  private static HOS_NAME_2 = "이대목동병원";
  private static HOS_PHONE_1 = "15227000";
  private static HOS_PHONE_2 = "0226505114";
  private static HOS_PHONE_1_B = "02-6986-5741~3";
  private static HOS_PHONE_1_S = "02-6986-5741~3";
  private static HOS_PHONE_2_B = "02-2650-2613, 2617";
  private static HOS_PHONE_2_S = "02-2650-5567, 5626, 5628";
  private static IN_SUBJECT_1 = "외래진료비 수납";
  private static IN_SUBJECT_2 = "입원중간비 수납";
  private static IN_SUBJECT_3 = "퇴원비 수납";
  private static IN_RCPTYPE_1 = "외래진료비";
  private static IN_RCPTYPE_2 = "입원중간비";
  private static IN_RCPTYPE_3 = "퇴원비";
  private static IN_BOT_TEXT_1 = "※ 당일 진료비(검사, 처치비용 포함) 수납가능\n" +
    "※ 진료비 영수증 및 원외처방전 발급은 무인수납기 이용";
  private static IN_BOT_TEXT_2 = "";
  private static IN_BOT_TEXT_I_B_1 = "(입원병동에 설치된 무인수납기 또는 1층 입원창구에서도 납부가능)";
  private static IN_BOT_TEXT_I_B_2 = "(입원병동에 설치된 무인수납기 또는 2층 입원창구에서도 납부가능)";
  private static IN_BOT_TEXT_I_S_1 = "(진료비영수증은 무인수납기에서 발급 가능합니다.)";
  private static IN_BOT_TEXT_I_S_2 = "";
  private static IN_SMS_SDLT_TEL_NO_CD = "201";
  private static IN_TEMPLATE_CODE_O_1 = "EC1000253";  // 라이브 외래 서울 2019.09.12 추가
  private static IN_TEMPLATE_CODE_O_2 = "EC1000233";  // 라이브 외래 목동
  private static IN_TEMPLATE_CODE_I_B_1 = "EC1000316";  // 라이브 중간금 서울 2020.11.18 변경
  private static IN_TEMPLATE_CODE_I_B_2 = "EC1000230";  // 라이브 중간금 목동
  private static IN_TEMPLATE_CODE_I_S_1 = "EC1000317";  // 라이브 퇴원비 서울 2020.11.18 변경

  //    private static IN_TEMPLATE_CODE_I_S_1_HOLIDAY = "EC1000305";  // 라이브 퇴원비 서울 휴일 2020.07.31 추가
  private static IN_TEMPLATE_CODE_I_S_1_HOLIDAY = "EC1000317";  // 라이브 퇴원비 서울 휴일 2021.06.15 변경
  private static IN_TEMPLATE_CODE_I_S_2 = "EC1000231";  // 라이브 퇴원비 목동
  private static IN_TEMPLATE_CODE_I_B_C_1 = "EC1000255";  // 라이브 중간금 완료 서울 2019.09.12 추가
  private static IN_TEMPLATE_CODE_I_B_C_2 = "EC1000240";  // 라이브 중간금 완료 목동
  private static IN_TEMPLATE_CODE_I_S_C_1 = "EC1000257";  // 라이브 퇴원비 완료 서울 2019.09.12 추가
  private static IN_TEMPLATE_CODE_I_S_C_2 = "EC1000241";  // 라이브 퇴원비 완료 목동
  private static IN_TEMPLATE_CODE_I_VIP_1 = "EC1000324";  // 라이브 VIP 퇴원 안내 서울 2020.12.15 추가

  private static IN_TEMPLATE_I_S_LOCATION_ON_1 = "1층 입원·퇴원창구";   // 퇴원비 창구안내 서울
  private static IN_TEMPLATE_I_S_LOCATION_OFF_1 = "1층 응급 원무접수창구";   // 퇴원비 응급창구안내 서울
  private static IN_TEMPLATE_I_S_LOCATION_ON_2 = "2층 입퇴원수속 15~19번 창구";   // 퇴원비 창구안내 목동
  private static IN_TEMPLATE_I_S_LOCATION_OFF_2 = "1층 응급의료센터내 응급수납창구";   // 퇴원비 응급창구안내 목동

  private static IN_TEMPLATE_BUTTON_TEXT_O = "수납하기"; // 외래수납
  private static IN_TEMPLATE_BUTTON_TEXT_I_B_1 = "결제하기"; // 중간 서울
  private static IN_TEMPLATE_BUTTON_TEXT_I_B_2 = "입원 중간진료비 결제하기"; // 중간 목동
  private static IN_TEMPLATE_BUTTON_TEXT_I_S_1 = "결제하기"; // 퇴원비 서울
  private static IN_TEMPLATE_BUTTON_TEXT_I_S_2 = "입원 퇴원금 결제하기"; // 퇴원비 목동

  private static IN_TEMPLATE_KAKAO_CODE_1 = "ebb2b2e4a4893e7c4ebd3e656f12edd4e1ce420f";  // 알림톡 코드 서울
  //    private static IN_TEMPLATE_KAKAO_CODE_1 = "5dbf3b8a93ebc1cb4b8537749df2ad8086f4a6e6";  // 알림톡 코드 서울 - 원복(20210923)
  private static IN_TEMPLATE_KAKAO_CODE_2 = "c641b14044bab959693be7e1023d89cc95252d35";  // 알림톡 코드 목동
//    private static IN_TEMPLATE_KAKAO_CODE_2 = "749ff475733c753f290e45fa0a53e6d5b3aca5c6";  // 알림톡 코드 목동 - 원복(20210923)




  constructor(
    private httpService: HttpService,
    private patientApiService: PatientApiService,
    @InjectRepository(AlimtalkMgrEntity, "alimtalk")
    private alimtalkMgrEntityRepo: Repository<AlimtalkMgrEntity>,
    @InjectRepository(EumcAlimtalkEumcEntity, "eumc_pay")
    private alimtalkEumcEntityRepo: Repository<EumcAlimtalkEumcEntity>

  ) {
  }

  between(min, max) {
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
  }

  async saveAlimtalk(
    his_hsp_tp_cd: string,
    pt_no: string,
    pt_name: string,
    meddate: string,
    dept_cd: string,
    dept_name: string,
    rcp_type: string,
    phone_no: string,
    amount: string,
    dummyData: string
  ) {
    try{

      // generate user key
      let hexcode = Date.now().toString(16);
      let userKey = hexcode + String.fromCharCode((this.between(0,26) + 65));

      const regDate = moment().format('yyyy-MM-DD');
      const regTime = moment().format('HH:mm:ss');

      let newAlimtalk = {
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        pt_name: pt_name,
        meddate: meddate,
        dept_cd: dept_cd,
        dept_name: dept_name,
        rcp_type: rcp_type,
        phone_no: phone_no,
        reg_date: regDate,
        reg_time: regTime,
        user_Key: userKey,
      } as EumcAlimtalkEumcEntity;

      let senderResp;
      if(rcp_type == RCP_TYPE.RSV_PAY) {
        senderResp = await this.sendRsvKakaoTalk(his_hsp_tp_cd, pt_no, pt_name, dept_name, rcp_type, phone_no, userKey);
      }
      else if(rcp_type == RCP_TYPE.HISTORY_TALK_PAY) {
        senderResp = await this.sendSsKakaoTalk(his_hsp_tp_cd, pt_no, pt_name, dept_name, rcp_type, phone_no, userKey);
      }
      else{
        senderResp = await this.sendKakaoAlimtalk(his_hsp_tp_cd, pt_no, pt_name, meddate, dept_cd, dept_name, rcp_type, phone_no, userKey, amount, dummyData)
      }
      this.logger.verbose(`Alimtak Sender DB 저장 : ${senderResp}`)

      return await this.alimtalkEumcEntityRepo.save(newAlimtalk);
    }catch (e) {
      this.logger.error(`Alimtak DB 저장 실패 ${e}`)
      throw e;
    }
  }


  /**
   * 카카오톡 전송 DB에 입력
   */
  async sendKakaoAlimtalk(
    his_hsp_tp_cd: string,
    pt_no: string,
    pt_name: string,
    meddate: string,
    dept_cd: string,
    dept_name: string,
    rcp_type: string,
    phone_no: string,
    user_key: string,
    amount: string,
    dummyData: string
  ) {
    this.logger.debug(`Alimtak 전송 DB 저장 START`)
    try{
      let subject = "";
      let rcpname = "";
      let bottext = "";
      let hos_name = "";
      let hos_phone = "";
      let templateCode = "";
      let buttonText = "";
      let kakaoCode = "";

      switch (his_hsp_tp_cd) {
        case "01":
          hos_name = AlimtalkApiService.HOS_NAME_1;
          hos_phone = AlimtalkApiService.HOS_PHONE_1;
          kakaoCode = AlimtalkApiService.IN_TEMPLATE_KAKAO_CODE_1;
          break;
        case "02":
          hos_name = AlimtalkApiService.HOS_NAME_2;
          hos_phone = AlimtalkApiService.HOS_PHONE_2;
          kakaoCode = AlimtalkApiService.IN_TEMPLATE_KAKAO_CODE_2;
          break;
      }

      switch (rcp_type) {
        case RCP_TYPE.OUT_PATIENT:
          subject = AlimtalkApiService.IN_SUBJECT_1;
          rcpname = AlimtalkApiService.IN_RCPTYPE_1;
          bottext = AlimtalkApiService.IN_BOT_TEXT_1;
          templateCode = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_CODE_O_1 : AlimtalkApiService.IN_TEMPLATE_CODE_O_2;  // 2019.09.12 추가.
          buttonText = AlimtalkApiService.IN_TEMPLATE_BUTTON_TEXT_O;

          break;
        case RCP_TYPE.INOUT_MID:
          subject = AlimtalkApiService.IN_SUBJECT_2;
          rcpname = AlimtalkApiService.IN_RCPTYPE_2;
          templateCode = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_CODE_I_B_1 : AlimtalkApiService.IN_TEMPLATE_CODE_I_B_2;  // 2019.09.12 추가.
          buttonText = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_BUTTON_TEXT_I_B_1 : AlimtalkApiService.IN_TEMPLATE_BUTTON_TEXT_I_B_2;  // 2019.09.12 추가.
          if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) bottext = AlimtalkApiService.IN_BOT_TEXT_I_B_1;
          else bottext = AlimtalkApiService.IN_BOT_TEXT_I_B_2;
          break;
        case RCP_TYPE.INOUT_FINAL:
          subject = AlimtalkApiService.IN_SUBJECT_3;
          rcpname = AlimtalkApiService.IN_RCPTYPE_3;
          templateCode = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_CODE_I_S_1 : AlimtalkApiService.IN_TEMPLATE_CODE_I_S_2;  // 2019.09.12 추가.
          buttonText = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_BUTTON_TEXT_I_S_1 : AlimtalkApiService.IN_TEMPLATE_BUTTON_TEXT_I_S_2;  // 2019.09.12 추가.
          if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) bottext = AlimtalkApiService.IN_BOT_TEXT_I_S_1;
          else bottext = AlimtalkApiService.IN_BOT_TEXT_I_S_2;
          break;
      }

      let today = moment().format("yyyy년MM월DD일");
      let content = '';

      if(rcp_type == RCP_TYPE.OUT_PATIENT) {
        if(his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
          content = "[" + hos_name + " 모바일수납 안내] \n" +
            "안녕하세요. " + pt_name + "님[등록번호:" + pt_no + "]\n" +
            " \n" +
            today + dept_name + " 수납하실 외래진료비가 있습니다. \n" +
            "\n" +
            "※ 수납창구 방문없이 아래 “수납하기” 를 누르시면 간편하게 모바일로 수납이 가능합니다. \n" +
            "※ 당일 진료비(검사, 처치비용 포함) 수납가능\n" +
            "※ 진료비 영수증 및 원외처방전 발급은 무인수납기 이용";
        }else{
          content = "[" + hos_name + " 모바일수납 안내] \n" +
            "안녕하세요. " + pt_name + "님[등록번호:" + pt_no + "] \n" +
            today + " " + dept_name + " 수납하실 외래진료비가 있습니다. \n" +
            "수납창구 방문없이 아래 “수납하기” 버튼을 누르시면 간편하게 모바일로 수납이 가능합니다. \n" +
            "※ 당일 진료비(검사, 처치비용 포함) 수납가능\n" +
            "※ 진료비 영수증 및 원외처방전 발급은 무인수납기 이용";
        }
      }else if(rcp_type == RCP_TYPE.INOUT_MID) {
        let phone = "";
        if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) phone = AlimtalkApiService.HOS_PHONE_1_B;
        else phone = AlimtalkApiService.HOS_PHONE_2_B;

        if(his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
          //20210729변경
          content = "[" + hos_name + " 중간진료비 납부 안내] \n" +
            pt_name + "님[등록번호: " + pt_no + "]\n" +
            "안녕하세요. 이대서울병원 원무팀입니다.\n" +
            "\n" +
            pt_name + "님의 입원중간진료비 " + amount + "원(전일기준)이 발생되어 납부 안내하오니 5일 이내 납부하여 주시기 바랍니다.\n" +
            "\n" +
            "■ 중간진료비 납부방법\n" +
            "○ 무인수납기 이용 : 입원병동 휴게실에 위치(신용/체크카드 결제\n" +
            "○ 카카오 알림톡(모바일) 이용 : 카카오톡으로 안내문자를 받으신 분\n" +
            "- 아래 하단 “결제하기” 선택(신용/체크카드 결제)\n" +
            "○ 원무창구 방문 : 현금, 신용/체크/현금IC카드 결제)\n" +
            "  - 일과시간/공휴일 주간 : 입원퇴원수속창구 이용(1층)\n" +
            "  - 일과이후 : 응급 원무접수수납창구 이용(1층 응급실 내) \n" +
            "○ 가상계좌 이체\n" +
            "  - 문의전화로 연락주시면 가상계좌번호를 발송해 드림\n" +
            "\n" +
            "■ 「현금 IC카드」로 진료비 결제 시 혜택\n" +
            "○ 현금 IC카드란?\n" +
            "  - 은행에서 발급한 입·출금 기능이 있는 신용카드, 체크카드\n" +
            "○ 주요 혜택\n" +
            "  - 혜택 1 : 결제금액의 0.5% 실시간 통장 입금\n" +
            "  - 혜택 2 : 소득공제 30% 혜택\n" +
            " ○ 진료비 결제 방법\n" +
            "  - “원무창구 방문” 현금 IC카드 제시, 카드 비밀번호 입력\n" +
            "\n" +
            "※ 진료비 수납 문의\n" +
            " · 02-6986-5741~3(일과시간)";
        }else{
          content = "[" + hos_name + " 중간진료비 납부 안내] \n" +
            "안녕하세요. " + pt_name + "님[등록번호:" + pt_no + "] \n" +
            hos_name + " 원무팀입니다. \n" +
            pt_name + "님의 입원 중간진료비 " + amount + "원이 발생되어 납부 안내하오니 5일 이내 납부하여 주시기 바랍니다. \n" +
            "우리 병원은 원활한 입원 중간진료비 납부를 위하여 모바일 수납 서비스를 시행 중입니다. \n" +
            "아래 버튼을 누르시면 수납창구 방문 없이 편리하게 입원 중간진료비를 납부하실 수 있습니다. \n" +
            bottext + "\n" +
            "문의 : " + phone;
        }
      }else{
        let phone = "";
        let locationISON = ""; // 퇴원비 창구 안내
        let locationISOFF = ""; // 퇴원비 응급창구 안내

        if (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
          phone = AlimtalkApiService.HOS_PHONE_1_S;
          locationISON = AlimtalkApiService.IN_TEMPLATE_I_S_LOCATION_ON_1;
          locationISOFF = AlimtalkApiService.IN_TEMPLATE_I_S_LOCATION_OFF_1;
        } else {
          phone = AlimtalkApiService.HOS_PHONE_2_S;
          locationISON = AlimtalkApiService.IN_TEMPLATE_I_S_LOCATION_ON_2;
          locationISOFF = AlimtalkApiService.IN_TEMPLATE_I_S_LOCATION_OFF_2;
        }

        if(his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
          this.logger.debug("[서울]퇴원비 알림톡 휴일 체크");
          const holiday_resp = await this.patientApiService.checkHoliday(his_hsp_tp_cd);
          this.logger.debug("[서울]퇴원비 알림톡 휴일 체크 " + holiday_resp);

          if(holiday_resp) {
            templateCode = AlimtalkApiService.IN_TEMPLATE_CODE_I_S_1_HOLIDAY;

            content = "[" + hos_name + " 퇴원수속 안내] \n" +
              "안녕하세요.\n" +
              pt_name + "님[등록번호: " + pt_no + "]퇴원진료비 심사가 완료되었습니다.\n" +
              "아래 퇴원진료비 납부방법을 이용해 퇴원수속을 하시기 바랍니다.\n" +
              "\n" +
              "■ 퇴원진료비 납부방법\n" +
              " ○ 무인수납기 이용 : 입원병동 휴게실(엘리베이터 있는 곳)에 설치\n" +
              " ○ 모바일 이용 : 본 카카오 알림톡(퇴원수속 안내)에서 수납(아래 하단 “결제하기” 선택)\n" +
              " ○ 원무창구(방문) 이용\n" +
              "  - 09:30~17:30 : 1층 입원·퇴원수속창구\n" +
              "    (문의: 02-6986-5741~2)\n" +
              "  - 09:30 이전/17:30 이후 : 1층 응급실 내 원무수납창구\n" +
              "    (문의: 02-6986-5747~8)\n" +
              "\n" +
              "■ 무인수납기, 모바일을 이용하시면 원무창구를 방문할 필요가 없어 편리합니다.\n" +
              "■ 퇴원수속이 완료되신 분은 입원병동 간호사실에서 퇴원약 수령 및 퇴원안내를 받으시기 바랍니다.";
          }else{
            // 20210729 변경
            content = "[" + hos_name + " 퇴원수속 안내] \n" +
              "안녕하세요.\n" +
              pt_name + "님[등록번호:" + pt_no + "]퇴원진료비 심사가 완료되었습니다.\n" +
              "아래 퇴원진료비 납부방법을 이용해 퇴원수속을 하시기 바랍니다. \n" +
              "\n" +
              "■ 퇴원진료비 납부방법\n" +
              "○ 무인수납기 이용 : 입원병동 휴게실에 위치(신용/체크카드 결제)\n" +
              "○ 카카오 알림톡(모바일) 이용 : 카카오톡으로 안내문자를 받으신 분\n" +
              "  - 아래 하단 “결제하기” 선택(신용/체크카드 결제)\n" +
              "  - 입원병동 무인수납기에서 진료비영수증 발급 가능(퇴원당일)\n" +
              "○ 원무창구 방문 : 현금, 신용/체크/현금IC카드 결제)\n" +
              "  - 일과시간/공휴일 주간 : 입원퇴원수속창구 이용(1층)\n" +
              "  - 일과이후 : 응급 원무접수수납창구 이용(1층 응급실 내) \n" +
              "○ 가상계좌 이체\n" +
              "  - 문의전화로 연락주시면 가상계좌번호를 발송해 드림\n" +
              "\n" +
              "■ 「현금 IC카드」로 진료비 결제 시 혜택\n" +
              "○ 현금 IC카드란?\n" +
              "  - 은행에서 발급한 입·출금 기능이 있는 신용카드, 체크카드\n" +
              "○ 주요 혜택\n" +
              "  - 혜택 1 : 결제금액의 0.5% 실시간 통장 입금\n" +
              "  - 혜택 2 : 소득공제 30% 혜택\n" +
              " ○ 진료비 결제 방법\n" +
              "  - “원무창구 방문” 현금 IC카드 제시, 카드 비밀번호 입력\n" +
              "\n" +
              "※ 퇴원수속 문의\n" +
              " · 일과시간 : 02-6986-5741~3\n" +
              " · 일과이후 : 02-6986-5747~8";
          }
        }else{
          content = "[" + hos_name + " 퇴원수속 안내] \n" +
            "안녕하세요. \n" +
            pt_name + "님[등록번호: " + pt_no + "] 퇴원정산이 완료되었습니다. \n" +
            "입원병동에 설치된 무인수납기 또는 " + locationISON + "를 이용해 주시기 바랍니다.(일과시간 이후 " + locationISOFF + " 이용) \n" +
            "우리 병원은 원활한 퇴원진료비 납부를 위하여 모바일 수납 서비스를 시행 중입니다. \n" +
            "아래 버튼을 누르시면 수납창구 방문 없이 편리하게 퇴원진료비를 납부하실 수 있습니다. \n" +
            "(진료비영수증은 무인수납기에서 발급 가능합니다.) \n" +
            "문의 : " + phone;
        }
      }

      let alimtalkSend = {
        mtRefkey: his_hsp_tp_cd,
        addRefkey: pt_no,
        dateClientReq: new Date(),
        subject: subject,
        content: content,
        callback: hos_phone,
        msgStatus: "1",
        recipientNum: phone_no,
        countryCode: "82",
        msgType: "1008",
        senderKey: kakaoCode,
        responseMethod: "push",
        attachmentType: "",
        attachmentName: buttonText,
        attachmentUrl: "https://pay.eumc.ac.kr/payment/info?key=" + user_key,
        etc_text_1: dummyData,
        hsp_tp_cd: his_hsp_tp_cd
      } as AlimtalkMgrEntity;

      return await this.alimtalkMgrEntityRepo.save(alimtalkSend);
    }catch (e) {
      this.logger.error(`Alimtak 전송 DB 저장 실패 ${e}`)
      throw e;
    }
  }



  async sendRsvKakaoTalk(his_hsp_tp_cd: string,
                         pt_no: string,
                         pt_name: string,
                         dept_name: string,
                         rcp_type: string,
                         phone_no: string,
                         userKey: string) {
    this.logger.debug(`Alimtak RSV 전송 DB 저장 START`)
    try{
      let subject = "진료예약 예약비";
      let hos_name = "";
      let hos_phone = "";

      switch (his_hsp_tp_cd) {
        case CommonCodeConst.HIS_HSP_TP_CD_SEOUL:
          hos_name = AlimtalkApiService.HOS_NAME_1;
          hos_phone = AlimtalkApiService.HOS_PHONE_1;
          break;
        case CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG:
          hos_name = AlimtalkApiService.HOS_NAME_2;
          hos_phone = AlimtalkApiService.HOS_PHONE_2;
          break;
      }

      let content = "안녕하세요. " + pt_name + "님\n" +
        "\n" +
        "2018년 12월 07일 금요일 " + dept_name + " 진료가 있습니다.\n" +
        "\n" +
        "오후 3시까지 " + dept_name + " 진료접수 바랍니다.\n" +
        "\n" +
        "* 진료비를 선수납 하시면 원무창구에서 기다리실 필요 없이 바로 진료접수 하실 수 있습니다.";

      let alimtalkSend = {
        mtRefkey: his_hsp_tp_cd,
        addRefkey: pt_no,
        dateClientReq: new Date(),
        subject: subject,
        content: content,
        callback: hos_phone,
        msgStatus: "1",
        recipientNum: phone_no,
        countryCode: "82",
        msgType: "1008",
        senderKey: '1e14bdb06a6e21bcbaa200f98c4e44e0583d1c5d',
        templateCode: "EC1000215",
        responseMethod: "push",
        attachmentType: "자유설정",
        attachmentName: "예약비 수납하기",
        attachmentUrl: "https://pay.eumc.ac.kr/payment/info?key=" + userKey,
      } as AlimtalkMgrEntity;

      return await this.alimtalkMgrEntityRepo.save(alimtalkSend);
    }catch (e) {
      this.logger.error(`Alimtak RSV 전송 DB 저장 실패 ${e}`)
      throw e;
    }
  }




  async sendVipKakaoTalk(
                         pt_no: string,
                         pt_name: string,
                         phone_no: string) {
    this.logger.debug(`[Alimtak] VIP 퇴원 알림톡 START`)
    try{
      let subject = "VIP 병동 퇴원";
      let content = "[♡이대서울병원♡ 퇴원수속 안내] \n" +
        "안녕하세요.\n" +
        pt_name + "님[등록번호:" + pt_no + "]퇴원진료비 심사가 완료되었습니다.\n" +
        "\n" +
        "입원병동(76병동) 간호사실을 방문하셔서 퇴원수속 안내를 받으시기 바랍니다. \n" +
        "\n" +
        "※ 퇴원수속 문의 : 02-6986-4761~2";

      let alimtalkSend = {
        mtRefkey: CommonCodeConst.HIS_HSP_TP_CD_SEOUL,
        addRefkey: pt_no,
        dateClientReq: new Date(),
        subject: subject,
        content: content,
        callback: AlimtalkApiService.HOS_PHONE_1,
        msgStatus: "1",
        recipientNum: phone_no,
        countryCode: "82",
        msgType: "1008",
        senderKey: AlimtalkApiService.IN_TEMPLATE_KAKAO_CODE_1,
        templateCode: AlimtalkApiService.IN_TEMPLATE_CODE_I_VIP_1,
        responseMethod: "push",
        hsp_tp_cd: CommonCodeConst.HIS_HSP_TP_CD_SEOUL
      } as AlimtalkMgrEntity;

      return await this.alimtalkMgrEntityRepo.save(alimtalkSend);
    }catch (e) {
      this.logger.error(`[Alimtak] VIP 퇴원 알림톡 실패 ${e}`)
      throw e;
    }
  }




  async sendSsKakaoTalk(his_hsp_tp_cd: string,
                         pt_no: string,
                         pt_name: string,
                         dept_name: string,
                         rcp_type: string,
                         phone_no: string,
                         userKey: string) {
    this.logger.debug(`Alimtak SS 전송 DB 저장 START`)
    try{
      let subject = "문진표 작성하기";
      let hos_name = "";
      let hos_phone = "";

      switch (his_hsp_tp_cd) {
        case CommonCodeConst.HIS_HSP_TP_CD_SEOUL:
          hos_name = AlimtalkApiService.HOS_NAME_1;
          hos_phone = AlimtalkApiService.HOS_PHONE_1;
          break;
        case CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG:
          hos_name = AlimtalkApiService.HOS_NAME_2;
          hos_phone = AlimtalkApiService.HOS_PHONE_2;
          break;
      }

      let content = "안녕하세요. 이정진님\n" +
        "\n" +
        "원할한 진료를 위하여\n" +
        "오늘 진료에 앞서 문진표를 작성하여 주세요.";

      let alimtalkSend = {
        mtRefkey: his_hsp_tp_cd,
        addRefkey: pt_no,
        dateClientReq: new Date(),
        subject: subject,
        content: content,
        callback: hos_phone,
        msgStatus: "1",
        recipientNum: phone_no,
        countryCode: "82",
        msgType: "1008",
        senderKey: '1e14bdb06a6e21bcbaa200f98c4e44e0583d1c5d',
        templateCode: "EC1000216",
        responseMethod: "push",
        attachmentType: "자유설정",
        attachmentName: "문진표 작성하기",
        attachmentUrl: "https://pay.eumc.ac.kr/doc-survey?key=" + userKey,
      } as AlimtalkMgrEntity;

      return await this.alimtalkMgrEntityRepo.save(alimtalkSend);
    }catch (e) {
      this.logger.error(`Alimtak SS 전송 DB 저장 실패 ${e}`)
      throw e;
    }
  }


  /**
   * 카카오페이 수납 완료 알림톡
   */
  async sendKakaoPaymentAlimtalk(
    his_hsp_tp_cd: string,
    pt_no: string,
    dept_name: string,
    rcp_type: string,
    amount: string
  ) {
    this.logger.debug(`카카오페이 수납 완료 Alimtak 전송 START`)
    try{
      let subject = "";
      let hos_name = "";
      let hos_phone = "";
      let templateCode = "";
      let counterPlace = "";
      let kakaoCode = "";

      switch (his_hsp_tp_cd) {
        case "01":
          hos_name = AlimtalkApiService.HOS_NAME_1;
          hos_phone = AlimtalkApiService.HOS_PHONE_1;
          kakaoCode = AlimtalkApiService.IN_TEMPLATE_KAKAO_CODE_1;
          break;
        case "02":
          hos_name = AlimtalkApiService.HOS_NAME_2;
          hos_phone = AlimtalkApiService.HOS_PHONE_2;
          kakaoCode = AlimtalkApiService.IN_TEMPLATE_KAKAO_CODE_2;
          break;
      }

      switch (rcp_type) {
        case RCP_TYPE.INOUT_MID:
          subject = AlimtalkApiService.IN_SUBJECT_2;
          templateCode = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_CODE_I_B_1 : AlimtalkApiService.IN_TEMPLATE_CODE_I_B_2;  // 2019.09.12 추가.
          break;
        case RCP_TYPE.INOUT_FINAL:
          subject = AlimtalkApiService.IN_SUBJECT_3;
          templateCode = (his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) ? AlimtalkApiService.IN_TEMPLATE_CODE_I_S_1 : AlimtalkApiService.IN_TEMPLATE_CODE_I_S_2;  // 2019.09.12 추가.
          break;
      }

      let today = moment().format("yyyy년MM월DD일");
      let todayDate = moment().format("yyyy-MM-DD");

      let content = '';
      if(dept_name == null || dept_name == 'null') {
        dept_name = " ";
      }else{
        dept_name = " " + dept_name + " ";
      }

      try{
   //     intAmount = Number(amount);
   //     amount = String.format("%,d", intAmount);
      }catch (e) {

      }

      const eumcAlimtalk = await this.alimtalkEumcEntityRepo.findOne({
        where: {
          his_hsp_tp_cd: his_hsp_tp_cd,
          pt_no: pt_no,
          reg_date: todayDate,
          rcp_type: rcp_type
        }
      });

      this.logger.debug(`알림톡 회원정보 조회 결과 : ${JSON.stringify(eumcAlimtalk)}`)

      if(rcp_type == RCP_TYPE.INOUT_MID) {
        if(his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
          content = "[" + hos_name + " 모바일수납 완료안내] \n" +
            "안녕하세요. " + eumcAlimtalk.pt_name + "님 [등록번호:" + eumcAlimtalk.pt_no + "] " + dept_name + "\n" +
            "\n" +
            today + " 입원 중간진료비 " + amount + "원 수납이 완료되었습니다.";
        }else{
          content = "[" + hos_name + " 모바일수납 완료안내]\n" +
            "안녕하세요. " + eumcAlimtalk.pt_name + "님\n" +
            today + dept_name + amount + "원 입원중간금 수납이 완료되었습니다.";
        }
      }else{
        if(his_hsp_tp_cd == CommonCodeConst.HIS_HSP_TP_CD_SEOUL) {
          content = "[" + hos_name + " 모바일수납 완료안내] \n" +
            "안녕하세요. " + eumcAlimtalk.pt_name + "님 [등록번호:" + eumcAlimtalk.pt_no + "] " + dept_name + "\n" +
            "\n" +
            today + " 퇴원진료비 " + amount + "원 수납이 완료되었습니다. \n" +
            "\n" +
            "※ 진료비영수증 및 입퇴원확인서 필요 시 병동에 설치된 무인수납기 또는 " + counterPlace + "에서 발급 받으세요.";
        }else{
          content = "[" + hos_name + " 모바일수납 완료안내] \n" +
            "안녕하세요. " + eumcAlimtalk.pt_name + "님\n" +
            today + dept_name + amount + "원 퇴원금 수납이 완료되었습니다.\n\n" +
            "※ 진료비영수증 및 입퇴원확인서 필요 시 입원용 무인수납기(병동 위치) 또는 " + counterPlace + "에서 발급 받으세요.";
        }
      }

      let alimtalkSend = {
        mtRefkey: his_hsp_tp_cd,
        addRefkey: pt_no,
        dateClientReq: new Date(),
        subject: subject,
        content: content,
        callback: hos_phone,
        msgStatus: "1",
        recipientNum: eumcAlimtalk.phone_no,
        countryCode: "82",
        msgType: "1008",
        senderKey: kakaoCode,
        templateCode: templateCode,
        responseMethod: "push",
        hsp_tp_cd: his_hsp_tp_cd
      } as AlimtalkMgrEntity;

      return await this.alimtalkMgrEntityRepo.save(alimtalkSend);
    }catch (e) {
      this.logger.error(`카카오페이 수납 완료 Alimtak 실패 ${e}`)
      throw e;
    }
  }




}
