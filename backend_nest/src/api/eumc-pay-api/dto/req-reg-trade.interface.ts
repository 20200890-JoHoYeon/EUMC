import { ApiProperty } from "@nestjs/swagger";

export class ReqRegTrade {

  @ApiProperty({
    description: '사이트코드',
    required: true,
    default: 'A52Q7',
    example: 'A52Q7',
  })
  site_cd : string;
  @ApiProperty({
    description: '주문번호',
    required: true,
    example: 'TEST202303221679418296858',
  })
  ordr_idxx : string;
  @ApiProperty({
    description: '결제 금액',
    required: false,
    default: '100',
    example: '100',
  })
  good_mny : string;
  @ApiProperty({
    description: '상품명',
    required: false,
    default: '테스트상품',
    example: '테스트상품',
  })
  good_name : string;
  @ApiProperty({
    description: '결제수단',
    required: false,
    default: 'AUTH',
    example: 'AUTH',
  })
  pay_method : string;
  @ApiProperty({
    description: '리턴 URL',
    required: false,
    example: '',
  })
  Ret_URL : string;
}
