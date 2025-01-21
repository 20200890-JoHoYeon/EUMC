import { ApiProperty } from "@nestjs/swagger";

export class ReqPatientInfo {
  @ApiProperty({
    description: '환자명',
    required: true,
    example: '박시온',
  })
  nm: string;
  @ApiProperty({
    description: '생년월일',
    required: true,
    example: '19960623',
  })
  birth: string;
  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '01075591153',
  })
  pt_no: string;
}
