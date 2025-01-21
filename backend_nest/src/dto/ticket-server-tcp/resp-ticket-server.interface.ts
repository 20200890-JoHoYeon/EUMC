import { ApiProperty } from '@nestjs/swagger';

export class RespTicketServerInterface {
  @ApiProperty({
    description: '순번 시스템',
    required: true,
    example: 1,
  })
  SYSTEM: number;
  @ApiProperty({
    description: '요청 구분(WAIT/ISSUE/CALL)',
    required: false,
    example: 'WAIT',
  })
  CMD: string;
  @ApiProperty({
    description: '순번 서버 IP',
    required: false,
    example: '10.10.210.65',
  })
  K_IP: string;
  @ApiProperty({
    description: '업무번호',
    required: true,
    example: 5,
  })
  MENU: number;
  @ApiProperty({
    description: '환자번호',
    required: true,
    example: 96476189, //FIXME: string이여야 하지 않나?
  })
  PATIENT: number;
  @ApiProperty({
    description: '발급된 티켓 번호',
    required: false,
  })
  TICKET: number;
  @ApiProperty({
    description: '대기인 수',
    required: false,
    example: 5,
  })
  WAITCNT: number;





}

// 발권 서버에 보내야될 정보.
/*  SYSTEM:     순번 시스템
    CMD:        요청 구분
    K_IP:       순번 서버 IP
    MENU:       업무번호
    PATIENT:    환자번호
 */
