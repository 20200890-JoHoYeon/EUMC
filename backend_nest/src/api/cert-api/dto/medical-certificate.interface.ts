import { MedicalCertificateInsurance } from "./medical-certificate-insurance.interface";

export interface MedicalCertificate {
  pt_no: string;   // 환자번호
  pt_nm: string;   // 환자이름
  rrn1: string;    // 주민번호 앞자리
  rrn2: string;    // 주민번호 뒷자리
  addr: string;    // 주소
  tel: string;     // 전화번호
  dg_option1_yn: string;   // 임상적추정 체크
  dg_option2_yn: string;   // 최종진단 체크
  dg_nm: string;   // 진단명
  dsoc_year: string;   // 발병 년
  dsoc_month: string;  // 발병 월
  dsoc_day: string;    // 발병 일
  dg_year: string;     // 진단 년
  dg_month: string;    // 진단 월
  dgc_day: string;     // 진단 일
  opinion: string;     // 치료에 대한 소견
  ads_dt: string;      // 입원 연월일
  ds_dt: string;       // 퇴원 연월일
  upur_gov_yn: string; // 관공서 제출용 체크
  upur_etc_yn: string; // 기타 체크
  upur_iscm_yn: string;    // 보험회사 제출용 체크
  upur_cmp_yn: string; // 회사 제출용 체크
  upur_schl_yn: string; // 학 제출용 체크
  upur_etc_cnte: string;   // 기타 내용
  wrt_year: string;    // 작성 년
  wrt_month: string;   // 작성 월
  wrt_day: string;     // 작성 일
  mdins_nm: string;    // 병원명
  mdins_addr: string;  // 병원 주소
  doc_yn: string;      // 의사 체크
  lcns_no: string;     // 의사 번호
  wrtr_nm: string;     // 의사명
  dgns_rer_rcdc_no: string;    // 연번호
  rmk_cnte: string;    // 비고
  deptname: string;

}
