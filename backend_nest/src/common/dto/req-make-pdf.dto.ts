export interface ReqMakePdfDto {
  fileCode: string,
  fileName: string,
  pdfInfo: string, // json


  // 진단서, 소견서
  his_hsp_tp_cd?: string,
  address?: string,
  qrName?: string,
  password?: string


  // + 입퇴원확인서, 통원진료확인서
  hospital_name?: string,
  pat_nm?: string;
  pat_no?: string;
  rrn1?: string;
  rrn2?: string;

  // 진료비납입확인서(연말정산용)
  companyNumber?: string,
  hospitalName?: string,
  hospitalAddress?: string,
  ownerName?: string,

  // 영수증
  rcptype? : string,


}
