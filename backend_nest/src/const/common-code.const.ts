export enum PDF_GEN_API_TYPE {
  JINDAN = 'jindan',
  SOGYEONSEO = 'sogyeonseo',
  IN_OUT_CERT = 'ibtoewonsasilhwaginseo',
  TONGWON_CERT = 'tongwonjinryo',
  MEDICAL_PAY_CERT = 'jinlyobinabibhwaginseo',
  MEDICAL_PAY_DTL_IN_CERT = 'jinryobisebuIn',
  MEDICAL_PAY_DTL_OUT_CERT = 'jinryobisebuOut',
  BILL_INFO = 'billInfo',
}


export class CommonCodeConst {
  static readonly HOSPITAL_NAME_SEOUL = 'SEOUL';
  static readonly HOSPITAL_NAME_MOCKDONG = 'MOCKDONG';

  static readonly HIS_HSP_TP_CD_SEOUL = '01';
  static readonly HIS_HSP_TP_CD_MOCKDONG = '02';

  static readonly ONE_SIGNAL_API_NOTIFICATION_URL =
    'https://onesignal.com/api/v1/notifications';



  static readonly KISOK_ID = 'KIO99';

  static readonly KAKAO_CID_SEOUL = true ? "C532370028" : "TC0ONETIME"
  static readonly KAKAO_CID_MOKDONG = true ? "C187000022" : "TC0ONETIME";  // 목동
  static readonly NHNKCP_SITECD = "S6186";

  // 이메일전송 API 주소
  static readonly EMAIL_SENDER_API_URL = 'https://mail-sender.eumc.ac.kr/mail-sender';
  // static readonly EMAIL_SENDER_API_URL = 'https://test-app.eumc.ac.kr/mail-sender';

  // PDF 생성 API 기본주소
  static readonly GENERATE_PDF_API_BASE_URL = 'https://pdf-create.eumc.ac.kr';
  // static readonly GENERATE_PDF_API_BASE_URL = 'https://test-app.eumc.ac.kr';
  // 진단서
  static readonly GENERATE_PDF_API_URL_JINDAN = CommonCodeConst.GENERATE_PDF_API_BASE_URL + '/' + PDF_GEN_API_TYPE.JINDAN;
  // 소견서
  static readonly GENERATE_PDF_API_URL_SOGYEONSEO = CommonCodeConst.GENERATE_PDF_API_BASE_URL + '/' + PDF_GEN_API_TYPE.SOGYEONSEO;
  // 입퇴원확인서
  static readonly GENERATE_PDF_API_URL_IN_OUT_CERT = CommonCodeConst.GENERATE_PDF_API_BASE_URL + '/' + PDF_GEN_API_TYPE.IN_OUT_CERT;
  // 통원진료확인서
  static readonly GENERATE_PDF_API_URL_TONGWON_CERT = CommonCodeConst.GENERATE_PDF_API_BASE_URL + '/' + PDF_GEN_API_TYPE.TONGWON_CERT;
  // 진료비납입확인서
  static readonly GENERATE_PDF_API_URL_MEDICAL_PAY_CERT = CommonCodeConst.GENERATE_PDF_API_BASE_URL + '/' + PDF_GEN_API_TYPE.MEDICAL_PAY_CERT;

  // PDF 파일 저장경로
  static readonly CERT_PDF_FILE_PATH = '/app/cert-pdf';
  // static readonly CERT_PDF_FILE_PATH = '/Users/oyeongjae/pdftmp';

  // QR 이미지 파일 저장경로
  static readonly QR_CODE_FILE_PATH = '/app/nginx/html/qrcode';
  // static readonly QR_CODE_FILE_PATH = '/Users/oyeongjae/qrtmp';



  static readonly CERTIFICATION_PRICE_MEDICAL_INFORMATION = '1000'; // 진단서
  static readonly CERTIFICATION_PRICE_ADS_INFORMATION = '3000';     // 입퇴원확인서
  static readonly CERTIFICATION_PRICE_PAYMENT_INFORMATION = '0';    // 진료비납입확인서(연말정산용)
  static readonly CERTIFICATION_PRICE_OTPT_INFORMATION = '3000';    // 통원진료확인서
  static readonly CERTIFICATION_PRICE_PAYMENT_DETAIL_INFORMATION = '0'; // 진료비세부내역서
  static readonly CERTIFICATION_PRICE_RECEIPT = '0';    // 진료비 계산 영수증


}

export enum MEDICAL_FORM_CODE {
  JINDAN = '00100',
  SOGYEON = '00107',

}

export enum RSV_STATUS {
  RECEIPT = 0,
  ARRIVE_CONFIRM = 1,
  WAIT_ROOM = 2,
  CALL_ROOM = 3,
  COMPLETED = 4
}

export enum RCP_TYPE {
  OUT_PATIENT = '1', // 외래 진료비
  INOUT_MID = '2', // 입퇴원 중간비
  INOUT_FINAL = '3', // 퇴원비
  RSV_PAY = '4', // 진료예약 예약비
  HISTORY_TALK_PAY = '5', // 문진표 작성(스마트서베이)
  REQ_CERTIFICATION = '6', // 증명서 신청
  RSV_MEDICINE_PAY = '7', // 예약 조제비 결제
}
