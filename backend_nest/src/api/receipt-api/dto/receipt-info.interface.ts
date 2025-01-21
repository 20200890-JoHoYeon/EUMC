export interface ReceiptInfo {
  hsp_tp_cd?: string; // 병원코드
  rownum: string;
  patsite: string; // 입원/외래구분
  patno: string; // 등록번호
  patname: string; // 성명
  meddate: string; // 진료(입원)일자
  fromdate: string; // 진료시작일자
  todate: string; // 진료종료일자
  medday: string; // 진료일수
  pattype_code: string; // 환자유형코드
  pattype: string; // 환자유형
  meddeptcd: string; // 진료과코드
  meddept: string; // 진료과
  meddr: string; // 진료의
  medtime: string; // 진료시간
  rcptcurecfcd: string; // 영수증치료구분코드
  hsprecvclsfcnm: string; // 병원수납구분명
  rcptno: string; // 영수증번호
  main_kcd: string; // 주상병코드(질병분류코드)
  main_kcd_name: string; // 주상병명(질병분류코드명)
  nomain_kcd: string; // 부상병코드(질병분류코드)
  nomain_kcd_name: string; // 부상병명(질병분류코드명)
  wardcfcd: string; // 병실구분코드
  roomno: string; // 병실번호
  slrsctnsfcgsum: string; // 급여-일부본인부담 합계
  slrsctnpblcobrdnsum: string; // 급여-일부공단부담 합계
  slrtotamtsfcgsum: string; // 급여-전액본인부담 합계
  nslrchocclnccrgsum: string; // 비급여-선택진료료 합계
  nslrchocclnccrgxcptsum: string; // 비급여-선택진료료이외금 합계
  totmedxpnsum: string; // 진료비 총액
  totpatmedxpnsum: string; // 환자부담 총액
  insamt: string; // 급여총액
  uniamt: string; // 비급여총액
  ovamt: string; // 본인부담상한액
  vatamt: string; // 부가세
  dcamt: string; // 할인액(감면액)
  preamt: string; // 이미납부한금액
  suamt: string; // 납부할금액
  uncolamt: string; // 미수금
  rcpamt: string; // 수납액 (납부한금액_합계)
  cashpaidamt: string; // 납부한금액_현금
  cardpaidamt: string; // 납부한금액_카드
  rcpdate: string;
  rcpseq: string;
  claimFlag: string;
  admDate: string;
  medicalName: string;
  paidAmt: string;
  pactid: string;
  icCaseKey: string;  //-- rcptno 값을 대입하게 한다
}
