import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RespReqNumberTicketDto {
  @ApiProperty({
    description: '티켓번호',
    required: true,
    example: '234234FD',
  })
  @IsNumber()
  myNumber: number;

  @ApiProperty({
    description: '대기자 수',
    required: true,
    example: '234234FD',
  })
  @IsNumber()
  waitingCount: number;

  @ApiProperty({
    description: '키오스크 아이피',
    required: true,
    example: '234234FD',
  })
  @IsString()
  kioskIp: string;

  @ApiProperty({
    description: '부서',
    required: true,
    example: '234234FD',
  })
  @IsNumber()
  menu: number;

  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '234234FD',
  })
  @IsString()
  patno: string;

}
