export interface RespScheduleInfo2 {
  DEPT_NM : string;//진료과명
  MEDR_NM : string;//진료의명
  MED_DT : string;//진료일자
  MED_TM : string;//진료일시
  SEL_TYPE : string;//진료/검사 구분

  CALL_TEXT?: string;//
  RPY_PACT_ID?: string;
  MEDR_SID?: string;// 진료의 일련번호
  PROFILE?: string;
  PATIENT_TYPE?: string;
  ARRIVED_YN?: string;
  MED_DEPT_CD?: string;
  GRP_DEPT_CD?: string;
  PT_NO?: string;
  PT_NM?: string;
}
