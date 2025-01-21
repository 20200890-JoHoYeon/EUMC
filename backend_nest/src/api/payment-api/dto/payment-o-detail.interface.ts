export interface PaymentODetail {
  rrn: string;         // 환자식별번호

  OUT_RCPSEQ2: string,
  OUT_ROW: string,
  OUT_PT_NO: string,
  OUT_PATNAME: string,
  OUT_MEDDATE: string,    // 진료날짜
  OUT_RPY_PACT_ID: string,
  OUT_RPY_CLS_SEQ: string,
  OUT_MEDR_SID: string,
  OUT_HIPASS_YN: string,

  OUT_MEDDEPT1: string,
  OUT_DEPTNAME1: string,
  OUT_MEDDR1: string,
  OUT_DRNAME1: string,
  OUT_SPCDRYN1: string,
  OUT_MEDYN1: string,
  OUT_MEDTYPE1: string,
  OUT_PATTYPE1: string,
  OUT_TYPECD1: string,
  OUT_CUSTCD1: string,
  OUT_CUSTNAME1: string,
  OUT_INORDCD1: string,
  OUT_CUSTINF1: string,
  OUT_RATEINF1: string,
  OUT_INSURT1: string,
  OUT_RCPAMT1: string,
  OUT_CALTYN1: string,
  OUT_INORD_YN1: string,

  IO_ERRYN: string,
  IO_ERRMSG: string,
}


