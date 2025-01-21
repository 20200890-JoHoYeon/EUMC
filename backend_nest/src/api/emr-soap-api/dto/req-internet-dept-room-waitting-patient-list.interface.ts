/**
 * 진료과 도착확인 리스트 조회
 * @param inHspTpCd      병원구분  서울(01), 목동(02)
 * @param inMedDt      진료일자  YYYYMMDD
 * @param inMedDeptCd    진료과코드  NULL 일경우 모든진료과
 * @param inMtmNo         진료실번호  0 일경우 모든 진료실
 * @param inMedCmplYn    진료완료여부  Y : 진료완료, N : 진료미완료
 */
export interface ReqInternetDeptRoomWaittingPatientList {
  IN_HSP_TP_CD: string;
  IN_MED_DT: string;
  IN_MED_DEPT_CD: string;
  IN_MTM_NO: string;
  IN_MED_CMPL_YN: string;
}
