export enum KioskServiceCodeConst {

  // KIOSK API SERVICE CODE
  SERVICE_HOSPITAL_INFO            = "Pk_AIC.CASQ_S127",       // 공통-병원(요양기관) 정보 요청
  SERVICE_CHECK_PATIENT            = "Pk_AIC.CASQ_S117",       // 공통-환자정보 데이터 요청
  SERVICE_PAYMENT_TYPE_O           = "Pk_AIC.CASQ_S092",       // 외래-수납 내역 데이터 요청 (중복 없는 진료과에 따른 data - 최대 진료과 3개까지 노출)
  SERVICE_PAYMENT_TYPE_O_DETAIL    = "Pk_AIC.CASQ_S092_1",     // 외래-수납 내역 데이터 요청 (각 진료과코드에 해당하는 data 리턴)
  SERVICE_PAYMENT_TYPE_I           = "Pk_AIC.CASQ_S095",       // 입퇴원-수납내역 데이터 요청
  SERVICE_PAYMENTSAVE_TYPE_O       = "Pk_AIC.CASQ_S093",       // 외래-외래비 수납 저장 요청
  SERVICE_PAYMENTSAVE_TYPE_I_B     = "Pk_AIC.CASQ_I029",       // 입퇴원-입원중간비 수납 저장 요청
  SERVICE_PAYMENTSAVE_TYPE_I_S     = "Pk_AIC.CASQ_S093",       // 입퇴원-퇴원비 수납 저장 요청
  SERVICE_RECEIPT_LIST             = "Pk_AIC.CASQ_S150",       // 제증명-재출력 영수증 내역 데이터 요청
  SERVICE_RECEIPT_TYPE_O           = "Pk_AIC.CASQ_S151",       // 외래-외래비 영수증 full(header+detail) 데이터 요청
  SERVICE_RECEIPT_TYPE_I           = "Pk_AIC.CASQ_S152",       // 입퇴원-입퇴원 영수증 full(header+detail) 데이터 요청
  SERVICE_RECEIPT_TYPE_I_B         = "Pk_AIC.CASQ_S098",       // 입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청
  SERVICE_RECEIPT_TYPE_I_S         = "Pk_AIC.CASQ_S152",       // 입퇴원-퇴원비 영수증 full(header+detail) 데이터 요청
  SERVICE_RECEIPT_TYPE_I_M         = "Pk_AIC.CASQ_S152",       // 입퇴원-입원중간비 계산서 영수증 full(header+detail) 데이터 요청
  SERVICE_PHARM_INFO               = "Pk_AIC.CASQ_S101",       // 외래-원외처방전 내역 데이터 요청
  SERVICE_PHARM_DETAIL             = "Pk_AIC.CASQ_S102",       // 외래-원외처방전 full(header+detail) 데이터 요청 (각 투약번호에 해당하는 data 리턴)
  SERVICE_PAYCONF_LIST             = "Pk_AIC.CASQ_S124",       // 제증명-진료비납입확인 내역 데이터 요청
  SERVICE_PAYDETAIL_CHECK          = "Pk_AIC.CASQ_S160",       // 제증명-진료비세부내역서 출력대상 조회
  SERVICE_PAYDETAIL_LIST_TYPE_O    = "Pk_AIC.CASQ_S161",       // 제증명-외래 진료비세부산정내역 full 데이터 요청
  SERVICE_PAYDETAIL_LIST_TYPE_I    = "Pk_AIC.CASQ_S162",       // 제증명-입원 진료비세부산정내역 full 데이터 요청
  SERVICE_PAYDETAIL_LIST_170       = "Pk_AIC.CASQ_S170",       // 보험청구용 진료비 세부 내역서
  SERVICE_CHECK_HOLIDAY_171        = "Pk_AIC.CASQ_S171",       // 휴일 체크

}
