import { ApiProperty } from "@nestjs/swagger";

export class ReqMakeCertPdf {
  @ApiProperty({
    description: '병원코드 ',
    required: true,
    example: '02',
  })
  his_hsp_tp_cd: string;
  @ApiProperty({
    description: '환자번호 ',
    required: true,
    example: '',
  })
  patno: string;
  @ApiProperty({
    description: '',
    required: true,
    default: '1',
    example: '1, 2',
  })
  rcptype: string;
  @ApiProperty({
    description: '인증서이름',
    required: true,
    example: '일반진단서[재발급] , 소견서[재발급], 입퇴원사실확인서, 진료비납입확인서(연말정산용), 통원진료확인서, 진료비세부내역서(외래), 진료비세부내역서(입원), 진료비계산영수증, ',
  })
  certname: string;
  @ApiProperty({
    description: '부서이름',
    required: true,
    example: '',
  })
  deptname: string;
  @ApiProperty({
    description: '시작날짜',
    required: true,
    example: '',
  })
  fromdate: string;
  @ApiProperty({
    description: '종료날짜',
    required: true,
    example: '',
  })
  todate: string;
  @ApiProperty({
    description: '날짜(입원날짜등등)',
    required: true,
    example: '',
  })
  date: string;
  @ApiProperty({
    description: '데이터',
    required: true,
    example: '',
  })
  data: string;

  @ApiProperty({
    description: '이메일주소',
    required: true,
    example: '',
  })
  email: string;

}
