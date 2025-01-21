/**
 * 병원 API에서 오는 응답을 구조화
 */
export interface RespReqWaitNumberHospitalDto {
  WK_DIV: string;
  DIV_ID: number;
  WORK_DT: string;
  WAIT_NO: number;
  REG_NO: string;
  REG_NM: string;
  BIRTH: string;
  WAITING: number;
  AREATOTAL: number;
  WND_NO: number;
  ADDRESS: string;
  APP_DIV: string;
}
