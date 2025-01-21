import { ApiProperty } from "@nestjs/swagger";

export class ReqKcpPayment {

  @ApiProperty({
    description: '사이트코드',
    required: false,
    example: 'A52Q7',
  })
  site_cd : string;
  @ApiProperty({
    description: '그룹아이디',
    required: false,
    example: 'TEST202303221679418296858',
  })
  bt_group_id : string;
  @ApiProperty({
    description: '상품명',
    required: false,
    example: '',
  })
  good_name : string;

  @ApiProperty({
    description: '병원코드',
    required: true,
    example: '',
  })
  his_hsp_tp_cd : string;
  @ApiProperty({
    description: '환자번호',
    required: true,
    example: '',
  })
  pat_no : string;
  @ApiProperty({
    description: '배치키',
    required: true,
    example: '100',
  })
  bt_batch_key : string;
  @ApiProperty({
    description: '금액',
    required: true,
    example: '1000',
  })
  good_mny : string;

  @ApiProperty({
    description: '수납종류',
    required: true,
    example: '',
  })
  rcp_type : string;




  @ApiProperty({
    description: '환자명',
    required: true,
    example: '',
  })
  buyr_name : string;



  @ApiProperty({
    description: '데이터',
    required: false,
    example: '',
  })
  data_set? : string;





}


  // site_cd : site_cd,
  // kcp_cert_info : this.KCP_CERT_INFO,
  // bt_group_id : bt_group_id,
  // bt_batch_key : bt_batch_key,
  // good_mny : '1' // 결제요청금액   ** 1 원은 실제로 업체에서 결제하셔야 될 원 금액을 넣어주셔야 합니다. 결제금액 유효성 검증 **
