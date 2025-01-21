import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { RespTicketServerInterface } from '../../../dto/ticket-server-tcp/resp-ticket-server.interface';

export class CommonTicketRequestDto {
  @ApiProperty({
    description: '요청타입 > wait: 순번대기리스트, issue: ',
    required: false,
    example: 'call',
  })
  @IsString()
  type?: string;
  @ApiProperty({
    description: '환자번호',
    required: false,
    example: 96476189, //FIXME: string이여야 하지 않나?
  })
  @IsString()
  patNo: string;

  @ApiProperty({
    description: '사용자아이디(푸시아이디)',
    required: false,
    example: '1dd608f2-c6a1-11e3-851d-000c2940e62c',
  })
  @IsString()
  playerId?: string;

  @ApiProperty({
    description: '발권서버 IDX',
    required: false,
    default: 0,
  })
  @IsNumber()
  ticketServerIdx?: number = 0;

  @ApiProperty({
    description:
      '발권 서버에 보내야될 정보\n' +
      'SYSTEM: 순번 시스템,' +
      '\nCMD: 요청구분,' +
      '\nK_IP: 순번 서버 IP,' +
      '\nMENU: 업무번호,' +
      '\nPATIENT: 환자번호',
    required: false,
  })
  msg: RespTicketServerInterface;
}
