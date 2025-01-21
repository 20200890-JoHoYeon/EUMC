import { PaymentReceiptDetail } from "./payment-receipt-detail.interface";

export class RespBillService151 {
  hsp_tp_cd?: string; // 병원 코드
  out_dcomn_cd: string;
  out_acct_cursor: string;
  out_ampm: string;
  out_emepyn: string;                  // 야간공휴일진료 - 예."1"(야간 체크)
  out_spcyn: string;                   // 선택진료신청 - 예."Y"(유 체크)
  out_rcorg_grd_nm: string;            // 요양기관종류 - 예."종 합 병 원""
  out_exdosno: string;                 // 원외처방전교부번호
  io_erryn: string;
  out_pt_nm: string;                   // 환자성명
  out_bloodamt: "0";          // 헌혈감액
  out_rpy_dt: string;                  // 영수증출력일자 - 예."20190221"
  out_lsh_dtm: string;                 // 영수증출력일자시각 - 예."2019-02-21 15:12"
  out_refundnm: string;
  out_inpbdn_amt: "0";
  out_pat_req_amt: "0";
  out_card: string;                    // 결제카드명
  out_meddate: string;                 // 진료일자시각 - 예."2019-02-21 14:45"
  out_deptname: string;                // 진료과목
  out_frvs_rmde_tp_cd: string;         // 초진재진구분 - 예."초진"
  out_mtcs_amt: "0";          // 진료비총액
  out_drname: string;                  // 진료의사
  out_pse_cls_cd: string;              // 환자구분(보조구분) - 예."정상급여"
  out_pbdn_amt: "0";          // 환자부담총액
  out_refundsignstr: string;
  out_refundrlnm: string;
  out_refundurl: string;
  out_citizen: string;                 // 영수증번호 - 예."0221-96663-00124"
  out_cash: string;                    // 신분확인번호[3],현금승인번호[5],현금영수증[6] - 예."|||||| ||"
  out_rcpnm: string;                   // 수납자_성명
  out_refundhp: string;
  out_uncl_amt: "0";          // 납부하지않은금액
  out_pv_rpy_amt: "0";        // 이미납부한금액(=x1-x2)_x1값
  out_med_rsv_tp_cd: string;           // 수납자구분 - 예."창구"
  out_rpy_stf_no: string;              // 수납자_수납사번
  out_rdtn_amt: "0";          // 감면금액
  out_hipss_yn: string;
  out_acnt_no: string;                 // 가상계좌번호
  out_con_inf: string;
  out_nins_sum_amt: "0";
  out_aprv_tp_cd: string;              // 승인구분(카드,현금,현금영수증)
  out_dosnostr: string;
  out_spcpbdn_amt: "0";       // 외래정산액 // 이미납부한금액(=x1-x2)_x2값
  out_lastdate: string;                // 진료기간(진료일자시각) - 예.201711160900
  out_med_dt_cursor: string;
  out_oncash_rpy_amt : "0";    // 납부한금액_현금 // 납부한금액_합계(=x1+x2+x3)_x3값
  out_custnm: string;
  out_unn_brdn_amt : "0";
  out_cmed_sum_amt : "0";
  out_w1_unit_cof_amt : "0";
  out_vat_amt : "0";           // 부가가치세
  out_guide_cursor: string;
  out_card_rpy_amt : "0";      // 납부한금액_카드 // 납부한금액_합계(=x1+x2+x3)_x1값
  io_errmsg: string;
  out_cash_rpy_amt : "0";      // 납부한금액_현금영수증 // 납부한금액_합계(=x1+x2+x3)_x2값
  out_pme_cls_cd: string;              // 급여종별 - 예."국민건강보험공단"
  out_grpamt : "0";            // 계약처금액
  out_dosno: string;                   // 원내약접수번호
  out_cmed_yn: string;
  out_rsvcnt: string;
  out_rpy_amt : "0";           // 납부할금액

  custom_out_patsite: string;                // 오더구분 (O:외래,E:응급,I:입퇴원)
  custom_out_rpy_pact_id: string;            // pactid
  custom_out_meddept: string;                // 진료과코드
  custom_out_pre_amt : string | "0";          // 이미납부한금액
  custom_out_tot_rpy_amt : string | "0";      // 납부한금액_합계
  custom_out_cash_rpy_amt : string | "0";     // 납부한금액_현금전체
  custom_out_card_rpy_amt : string | "0";     // 납부한금액_카드전체
  custom_out_tot_insown : string | "0";       // 급여_본인부담금_합계
  custom_out_tot_insreq : string | "0";       // 급여_공단부담금_합계
  custom_out_tot_insall : string | "0";       // 급여_전액본인부담금_합계
  custom_out_tot_spc : string | "0";          // 비급여_선택진료료_합계
  custom_out_tot_uin : string | "0";          // 비급여_선택진료료이외_합계
  custom_out_tot_ins : string | "0";          // 급여_합계
  custom_out_tot_uni : string | "0";          // 비급여_합계

  out_table0: PaymentReceiptDetail[];
}
