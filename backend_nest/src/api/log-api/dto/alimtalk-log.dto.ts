import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AlimtalkLogDto {
  @ApiProperty({
    description: '일련번호',
    required: false,
  })
  @IsNumber()
  kakaoAlimtalkSeq: number;
  hospital: string;
  locate: string;
  patno: string;
  gender: string;
  birth: string;
  rcpType: string;
  cDate: Date;
}
