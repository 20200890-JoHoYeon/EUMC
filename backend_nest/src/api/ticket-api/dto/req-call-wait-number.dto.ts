import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ReqCallWaitNumberDto {
  @ApiProperty({
    description: '병원코드',
    required: true,
    example: '01',
  })
  @IsString()
  hsp_tp_cd: string;

  @ApiProperty({
    description: '키오스크 아이피',
    required: true,
    example: '10.10.210.65',
  })
  @IsString()
  kioskIp: string;

  @ApiProperty({
    description: '부서',
    required: true,
    example: '5',
  })
  @IsNumber()
  menu: number;

  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '96476189',
  })
  @IsString()
  patno: string;

  @ApiProperty({
    description: '호출번호',
    required: true,
    example: '3',
  })
  @IsString()
  callNo: number;

  @ApiProperty({
    description: '부서번호',
    required: false,
    example: '1',
  })
  @IsString()
  desk?: number;


}
