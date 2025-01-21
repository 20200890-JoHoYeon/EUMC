export interface ReceiptDetail {
  rownum: string;
  patsite: string; // 입원/외래구분
  patno: string; // 등록번호
  patname: string; // 성명
  meddate: string; // 진료(입원)일자
  rcptno: string; // 영수증번호
  meddeptcd: string; // 진료과코드
  meddept: string; // 진료과
  meddr: string; // 진료의
  code: string; // 항목코드
  codename: string; // 항목명
  slrsctnsfcgamt: string; // 급여-일부본인부담
  slrsctnpblcobrdnamt: string; // 급여-일부공단부담
  slrtotamtsfcgamt: string; // 급여-전액본인부담
  nslrchocclnccrgamt: string; // 비급여-선택진료료금액
  nslrchocclnccrgxcptamt: string; // 비급여-선택진료료이외금액
  totmedxpnamt: string; // 총진료비
  ownamt: string; // 본인부담금계
  uniamt: string; // 비급여총액
}
