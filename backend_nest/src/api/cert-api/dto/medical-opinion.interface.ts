import { MedicalCertificateInsurance } from "./medical-certificate-insurance.interface";

export interface MedicalOpinion {
  pt_no: string;
  pt_nm: string;
  rrn1: string;
  rrn2: string;
  addr: string;
  tel: string;
  dg_nm: string;
  o_chk: string;
  o_from_dt: string;
  o_to_dt: string;
  o_period: string;
  i_chk: string;
  i_from_dt: string;
  i_to_dt: string;
  i_period: string;
  pasthistory: string;
  result: string;
  opinion: string;
  upur_iscm_yn: string;
  upur_otherhsp_yn: string;
  rmk: string;
  wrt_year: string;
  wrt_month: string;
  wrt_day: string;
  lcns_no: string;
  wrtr_nm: string;
  mdins_addr: string;
  mdins_nm: string;
  dgns_rer_rcdc_no: string;
  deptname: string;
  dg_option1_yn: string;   // 임상적추정 체크
  dg_option2_yn: string;   // 최종진단 체크
  dsoc_year: string;   // 발병 년
  dsoc_month: string;  // 발병 월
  dsoc_day: string;    // 발병 일
  dg_year: string;     // 진단 년
  dg_month: string;    // 진단 월
  dgc_day: string;     // 진단 일
  ads_dt: string;      // 입원 연월일
  ds_dt: string;       // 퇴원 연월일
  upur_gov_yn: string; // 관공서 제출용 체크
  upur_etc_yn: string; // 기타 체크
  upur_cmp_yn: string; // 회사 제출용 체크
  upur_schl_yn: string; // 학 제출용 체크
  upur_etc_cnte: string;   // 기타 내용
  doc_yn: string;      // 의사 체크
  rmk_cnte: string;    // 비고


}
