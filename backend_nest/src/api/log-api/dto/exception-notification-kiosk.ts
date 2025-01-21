import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ExceptionNotificationKioskDto {
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

  systemName: string;
  sourceName: string;
  eventCode: string;
  message: string;
  occurDate: string;
}
