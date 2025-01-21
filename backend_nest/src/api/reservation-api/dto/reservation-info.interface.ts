export interface ReservationInfo {
  RPY_PACT_ID: string;
  PT_NM: string;
  RSV_ACPT_TP_CD: string;
  MED_RSV_TP_CD: string;
  MED_RSV_DTM: string;
  MED_DEPT_CD: string;
  GRP_DEPT_CD?: string;
  DEPT_NM: string;
  MEDR_SID: string;
  MED_NM: string;
  MEF_RPY_CLS_CD: string;
  DEPT_FLR_TP_CD: string;
  MED_DT: string;
  MED_DTM: string;
  MED_YN: string;
  APCN_DTM: string;
  NUM: string;

  PT_NO?: string;
}
