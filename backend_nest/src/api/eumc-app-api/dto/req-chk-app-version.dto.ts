import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ReqChkAppVersionDto {
  @ApiProperty({
    description: '버전 문자열',
    required: true,
    example: '1.2.3',
  })
  @IsString()
  userVersion: string;
  @ApiProperty({
    description: '운영체제 타입',
    required: true,
    example: 'ANDROID',
  })
  @IsString()
  osType: string;
}
