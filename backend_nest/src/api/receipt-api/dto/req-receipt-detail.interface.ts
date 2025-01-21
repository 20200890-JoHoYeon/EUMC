import { ApiProperty } from "@nestjs/swagger";

export class ReqReceiptDetail {
  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '',
  })
  patno: string;
  @ApiProperty({
    description: '진료일',
    required: true,
    example: '',
  })
  meddate: string; // 진료일
  @ApiProperty({
    description: '진료과',
    required: true,
    example: '',
  })
  meddept: string; // 진료과
  @ApiProperty({
    description: '',
    required: true,
    example: '',
  })
  meddr: string;
  @ApiProperty({
    description: '영수증번호',
    required: true,
    example: '',
  })
  rcptno: string; // 영수증번호
  // locateCode: string;
  @ApiProperty({
    description: '병원코드',
    required: true,
    example: '01',
  })
  hsp_tp_cd: string;
}
