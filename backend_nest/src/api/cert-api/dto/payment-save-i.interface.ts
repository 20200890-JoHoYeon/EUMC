import * as moment from "moment-timezone";
import { CommonCodeConst } from "../../../const/common-code.const";

export class PaymentSaveI {
  in_hsp_tp_cd: string;
  treatDate: string;
  typeCd: string;
  patType: string;
  creditPaidTime: string;
  patno: string;
  paidAmount: string;
  deptCode: string;
  approvedNo: string;
  revolving: string;
  buyerCode: string;
  buyer: string;
  catId: string;
  creditCardNo: string;



  generateInputArr(rcp_type: string, kiosk_id: string): string[] {
    const resArr = new Array(28);

    // 파싱하는거 찾아서 수정 필요
    const paidTime = moment(this.creditPaidTime).format('yyyyMMddHHmmss');

    resArr[0] = this.in_hsp_tp_cd;
    resArr[1] = 'Y';
    resArr[2] = this.patno;
    resArr[3] = this.treatDate.replace('-', '');
    resArr[4] = '0';
    resArr[5] = '24';
    resArr[6] = this.paidAmount;
    resArr[7] = kiosk_id;
    resArr[8] = this.treatDate.replace('-', '');
    resArr[9] = this.deptCode;
    resArr[10] = this.patType;
    resArr[11] = this.typeCd;
    resArr[12] = 'I';
    resArr[13] = 'Y';
    resArr[14] = this.buyer;  // 카드명
    resArr[15] = '8';
    resArr[16] = this.buyerCode; // 카드종류
    resArr[17] = this.creditCardNo;//'123456******1234'; // 카드번호
    resArr[18] = this.approvedNo;
    resArr[19] = paidTime;
    resArr[20] = this.revolving;
    resArr[21] = '172016001115'; // IP주소
    resArr[22] = this.paidAmount;
    if(this.buyerCode == '777'){
      resArr[23] = '02' + this.catId;
    }else{
      resArr[23] = '03' + this.catId;
    }

    resArr[24] = '9912';
    resArr[25] = '';
    resArr[26] = '';
    resArr[27] = '';

    return resArr;
  }










}
