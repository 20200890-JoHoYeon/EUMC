import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class NumberTicketDto {
  @ApiProperty({
    description: '일련번호',
    required: false,
  })
  @IsNumber()
  numberTicketSeq: number;
  @ApiProperty({
    description: '키오스크코드',
    required: true,
    example: '234234FD',
  })
  @IsString()
  kioskCode: string;
  kioskIp: string;
  hospital: string;
  locate: string;
  patno: string;
  gender: string;
  birth: string;
  locationName: string;
  number: string;
  deviceType: string;
  cDate: Date;
}

