import { ApiProperty } from "@nestjs/swagger";

export class ReqReceipt {
  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '',
  })
  patno: string;   // 환자번호
  // locateCode: string;
  @ApiProperty({
    description: '병원코드',
    required: true,
    example: '',
  })
  hsp_tp_cd: string;
  @ApiProperty({
    description: '영수증번호',
    required: true,
    example: '',
  })
  rcptno: string; // 영수증번호

  // 헤더일때
  @ApiProperty({
    description: '진료일',
    required: false,
    example: '',
  })
  meddate?: string; // 진료일
  @ApiProperty({
    description: '진료과',
    required: false,
    example: '',
  })
  meddept?: string; // 진료과

  // 상세 기간조회일때
  @ApiProperty({
    description: '상세 조회 시작기간',
    required: false,
    example: '',
  })
  startDate?: string;
  @ApiProperty({
    description: '상세 조회 종료기간',
    required: false,
    example: '',
  })
  endDate?: string;
}
