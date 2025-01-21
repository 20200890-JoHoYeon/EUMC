export class ResultData {
  readonly code: string;
  readonly desc: string;

  constructor(code: string, desc: string) {
    this.code = code;
    this.desc = desc;
  }

  toString(): string {
    return `code: ${this.code}, desc: ${this.desc}`;
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
export class ApiResult {
  static readonly RESULT_OK = new ResultData('0000', '정상처리');
  static readonly UNKNOWN_ERROR = new ResultData(
    '0999',
    '잠시 후 이용해 주십시오',
  );

  static readonly RSV_OVER_BOOK = new ResultData(
    '4999',
    '초진정원이 초과되었습니다.',
  );

  /** PUSH */
  static readonly NONE_PUSH = new ResultData('1000', 'Push Key 값이 없음.');

  static readonly FAIL_GET_TICKET_WAIT_LIST = new ResultData(
    '1000',
    '번호표 리스트 조회 실패',
  );
}
