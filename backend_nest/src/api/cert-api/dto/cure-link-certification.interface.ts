import { ApiProperty } from "@nestjs/swagger";




export class CureLinkCertification {
  certSeq: number;     // 동일 이름, 날짜의 증명서는 sequence로 구분
  hospital: string;
  // locate: string;
  @ApiProperty({
    description: '병원코드 ',
    required: true,
    example: '02',
  })
  his_hsp_tp_cd: string;
  @ApiProperty({
    description: '환자번호 ',
    required: true,
    example: '10453963',
  })
  pat_no: string;
  @ApiProperty({
    description: '검색시작일자',
    required: true,
    example: '20180801',
  })
  fromdate: string;
  @ApiProperty({
    description: '검색종료일자 ',
    required: true,
    example: '20180802',
  })
  todate: string;

  date: string; // 진료날짜
  meddept: string;
  deptCode: string;
  pactid: string;  //병원에서 사용하는 거래 PK
  rcptype: string;  //수납종류 (외래/입원)
  adsdate: string;
  certCode: string;
  certName: string;
  certDate: string;
  email: string;
  certPrice: string;
  dummies: string; // 증명서별 추가 정보가 있는 경우에 사용 (ex : 진단서, 소견서 코드 정보)
  dummyData: string;


}
