import * as moment from "moment-timezone";
import { CommonCodeConst } from "../../../const/common-code.const";

export class PaymentSave {
  // input data
  in_hsp_tp_cd: string;    // 0 : 병원 구분 코드 (01:서울, 02:목동)
  patno: string;       // 2
  treatDate: string;   // 3 : 진료일자(YYYYMMDD)
  deptCode: string;    // 7 : 진료과코드
  spcdrYn: string;     // 10 : 지정구분
  medType: string;     // 11 : 초재진구분
  drcode: string;      // 12 : 의사코드
  patType: string;     // 13 : 급여종별
  typeCd: string;      // 14 : 유형보조
  insurt: string;
  custCd: string;      // 16 : 계약처코드
  custRate: string;
  custInfo: string;
  inordCd: string;     // 43 : 예외환자코드
  rcpseq2: string;     // 44 : 그룹영수증순번
  buyerCode: string;   // 63 : 카드종류 (VAN응답-'0'+카드타입2자리)
  creditCardNo: string;   // 64 : 카드번호 (Track2값 중 '=' 앞까지)
  approvedNo: string;   // 65 : 승인번호 (VAN 응답)
  creditPaidDate: string;  // 66 : 카드승인일시
  creditPaidTime: string;  // 66 : 카드승인일시 (YYYYMMDDHHNN)
  revolving: string;   // 67 : 카드할부개월수 (MM)
  availablePeriod: string; // 69 : 카드유효기간 (Track2값 중 '=' 뒤부터 4자리)
  paidAmount: string;  // 70 : 요청금액
  shipID: string;      // 71 : 카드가맹점 (VAN응답 - VAN구분2자리+가맹점번호16자리)
  buyer: string;       // 72 : 카드명 (VAN응답 - 12자리)
  catId: string;       //가맹점번호

  // output data
  ioDosNo: string;
  ioRcpNo: string;
  ioRcpSeq: string;
  ioDosNo2: string;
  ioRcpNo2: string;
  ioRcpSeq2: string;



  generateInputArr(rcp_type: string, birth_day: string, kiosk_id: string): string[] {
    const resArr = new Array(85);

    console.log(`PAID TIME : ${this.creditPaidTime}`);
    // 파싱하는거 찾아서 수정 필요
    const paidTime = this.creditPaidTime;//moment('2023-04-13 00:00:00').format('yyyyMMDDhhmmss');

    resArr[0] = this.in_hsp_tp_cd;
    resArr[1] = '1';
    resArr[2] = this.patno;

    if(rcp_type == '1') {
      resArr[3] = paidTime.replace(/-/gi, '').substring(0, 8);
    }else{
      resArr[3] = moment(this.treatDate).format('yyyyMMDD');
    }

    resArr[4] = '';
    resArr[5] = '';
    resArr[6] = '';
    resArr[7] = this.deptCode;
    resArr[8] = this.rcpseq2;
    resArr[9] = '';

    // if(rcp_type == '1') {
      resArr[10] = this.spcdrYn || '';
      resArr[11] = this.medType || '';
    // }else{
    //   resArr[10] = '';
    //   resArr[11] = '';
    // }
  // private String custcd;      // 계약처코드
  // private String custname;    // 계약처명
  // private String inordcd;     // 예외환자사유
  // private String custinf;     // 계약처정보
  // private String rateinf;     // 보험부담율정보
  // private String insurt;      // 보험정보

    resArr[12] = this.drcode;
    resArr[13] = this.patType;
    resArr[14] = this.typeCd;
    try {
      resArr[15] = (this.insurt.substring(30, 41) == '0'?'':this.insurt.substring(30, 41).trim());
    }catch (e) {}
    resArr[16] = this.custCd;
    try {
      resArr[17] = (this.custRate.substring(10, 20) == '0'?'':this.custRate.substring(10, 20).trim());
      resArr[18] = (this.custRate.substring(0, 10) == '0'?'':this.custRate.substring(0, 10).trim());
    }catch (e) {}
    resArr[19] = (rcp_type == '1'? 'O' : 'I');

    resArr[20] = kiosk_id;
    resArr[21] = (rcp_type == '1'? 'O' : 'I');
    try {
      if(rcp_type == '1') {
        resArr[22] = birth_day.replace(/-/gi, '');
      }else{
        resArr[22] = '';
      }
    }catch (e) {}
    resArr[23] = '1';
    resArr[24] = '';
    resArr[25] = '';
    resArr[26] = '';
    resArr[27] = 'Y';
    resArr[28] = '';
    try {
      resArr[29] = (this.custRate.substring(20, 30) == '0'?'':this.custRate.substring(20, 30).trim());
      resArr[30] = (this.custRate.substring(30, 40) == '0'?'':this.custRate.substring(30, 40).trim());
      resArr[31] = (this.custRate.substring(50, 60) == '0'?'':this.custRate.substring(50, 60).trim());
      resArr[32] = (this.custRate.substring(60, 70) == '0'?'':this.custRate.substring(60, 70).trim());
    }catch (e) {}

    try {
      resArr[33] = (this.custInfo.substring(0, 10) == '0'?'':this.custInfo.substring(0, 10));
      resArr[34] = (this.custInfo.substring(10, 20) == '0'?'':this.custInfo.substring(10, 20));
      resArr[35] = (this.custInfo.substring(20, 30) == '0'?'':this.custInfo.substring(20, 30));
      resArr[36] = (this.custInfo.substring(30, 40) == '0'?'':this.custInfo.substring(30, 40));
      resArr[38] = (this.custInfo.substring(50, 60) == '0'?'':this.custInfo.substring(50, 60));
      resArr[39] = (this.custInfo.substring(60, 70) == '0'?'':this.custInfo.substring(60, 70));
      resArr[40] = (this.custInfo.substring(70, 80) == '0'?'':this.custInfo.substring(70, 80));
      resArr[41] = (this.custInfo.substring(80, 90) == '0'?'':this.custInfo.substring(80, 90));
    }catch (e) {}
    resArr[37] = '0'
    resArr[42] = '0'

    if(rcp_type == '1') {
      resArr[43] = this.inordCd;
    }else{
      resArr[43] = '';
    }
    resArr[44] = this.rcpseq2;
    resArr[45] = 'Y';
    try {
      resArr[46] = (this.custRate.substring(20, 30) == '0'?'':this.custRate.substring(20, 30));
    }catch (e) {}
    resArr[47] = 'N';
    try {
      resArr[48] = (this.custRate.substring(90, 100) == '0'?'':this.custRate.substring(90, 100));
    }catch (e) {}
    resArr[49] = '';

    resArr[50] = '';
    resArr[51] = '';
    resArr[52] = '';
    resArr[53] = '';
    resArr[54] = '';
    resArr[55] = '';
    resArr[56] = '';
    resArr[57] = 'Y';
    resArr[58] = '';
    try {
      resArr[59] = (this.custInfo.substring(90, 100) == '0'?'':this.custInfo.substring(90, 100));
      resArr[60] = (this.custInfo.substring(40, 50) == '0'?'':this.custInfo.substring(40, 50));
    }catch (e) {}
    resArr[61] = 'Y';
    resArr[62] = '';
    resArr[63] = this.buyerCode;
    resArr[64] = this.creditCardNo;
    resArr[65] = this.approvedNo;
    resArr[66] = paidTime;
    resArr[67] = this.revolving;
    resArr[68] = '172016001115'; //TODO: IP주소 체크필요
    resArr[69] = '9912';


    resArr[70] = this.paidAmount;
    if(this.buyerCode == '777') {
      resArr[71] = '02' + this.catId;
    }else{
      resArr[71] = '03' + this.catId;
    }

    resArr[72] = this.buyer;
    resArr[73] = '';
    resArr[74] = '';
    resArr[75] = '';
    resArr[76] = '';
    resArr[77] = '';
    resArr[78] = '';
    resArr[79] = '';

    resArr[80] = '';
    resArr[81] = '';
    resArr[82] = '';
    resArr[83] = 'Y';
    resArr[84] = '';




    return resArr;
  }










}
