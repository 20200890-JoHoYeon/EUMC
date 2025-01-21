import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ReqSetAppPushDto {
  @ApiProperty({
    description: '버전 문자열',
    required: false,
    example: '',
  })
  @IsNumber()
  seq: number;

  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '',
  })
  @IsNumber()
  patno: string;

  @ApiProperty({
    description: '푸시키',
    required: true,
    example: '',
  })
  @IsNumber()
  pushKey: string;

  @ApiProperty({
    description: '앱키',
    required: false,
    example: 'a5f70288-e31f-4a3b-8fc6-79e8ebf91293',
  })
  @IsNumber()
  appKey: string;

  @ApiProperty({
    description: '운영체제타입',
    required: true,
    example: 'ANDROID',
  })
  @IsNumber()
  osType: string;

  @ApiProperty({
    description: '버전 문자열',
    required: false,
    example: '',
  })
  @IsNumber()
  regDate: Date;

  @ApiProperty({
    description: '버전 문자열',
    required: false,
    example: '',
  })
  @IsNumber()
  modifyDate: Date;
}
