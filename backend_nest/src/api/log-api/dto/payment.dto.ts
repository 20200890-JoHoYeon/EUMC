import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PaymentDto {
  @ApiProperty({
    description: '키오스크코드',
    required: true,
    example: '234234FD',
  })
  @IsString()
  kioskCode: string;
  kioskIp: string;
  locate: string;
  gender: string;
  birth: string;
  payComp: string;
  cardComp: string;
  rcpType: string;
  tid: string;
  deptName: string;
}
