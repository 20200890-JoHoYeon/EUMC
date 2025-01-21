export class CurelinkTypeData {
  readonly code: string;
  readonly name: string;

  constructor(code: string, desc: string) {
    this.code = code;
    this.name = desc;
  }

  toString(): string {
    return `code: ${this.code}, desc: ${this.name}`;
  }
}

/**
 * 응답코드 정의
 * 0xxx: 공통
 * 1xxx: 시스템
 * 2xxx: 환자
 * 3xxx: 번호표
 * 4xxx: 예약
 * 5xxx: 수납
 * 6xxx: 증명
 * 7xxx:
 * 8xxx:
 * 9xxx:
 */
export class CurelinkType {
  static readonly DIAGNOSIS = new CurelinkTypeData(           '1', '일반진단서[재발급]');
  static readonly OPINION = new CurelinkTypeData(             '2', '소견서[재발급]');
  static readonly IN_CONFIRMATION = new CurelinkTypeData(     '3', '입퇴원사실확인서');
  static readonly PAYMENT_CONFIRMATION = new CurelinkTypeData('4', '진료비납입확인서(연말정산용)');
  static readonly OUT_CONFIRMATION = new CurelinkTypeData(    '5', '통원진료확인서');
  static readonly PAYMENT_DETAIL_OUT = new CurelinkTypeData(  '6', '진료비세부내역서(외래)');
  static readonly PAYMENT_DETAIL_IN = new CurelinkTypeData(   '7', '진료비세부내역서(입원)');
  static readonly PAYMENT_RECEIPT_OUT = new CurelinkTypeData( '8', '진료비계산영수증(외래)');
  static readonly PAYMENT_RECEIPT_IN = new CurelinkTypeData(  '9', '진료비계산영수증(입원)');
}
