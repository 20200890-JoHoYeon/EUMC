import { ApiProperty } from "@nestjs/swagger";

export class ReqKcpOtpConfirm {

  @ApiProperty({
    description: '본인확인 거래번호',
    required: true,
    example: '',
  })
  per_cert_no : string;

  @ApiProperty({
    description: '이동통신사 코드',
    required: true,
    example: '',
  })
  comm_id : string;

  @ApiProperty({
    description: 'OTP번호',
    required: true,
    example: '123456',
  })
  otp_no : string;

  @ApiProperty({
    description: '휴대폰 인증보호 수신동의',
    required: true,
    example: 'Y',
  })
  adl_agree_yn : string;

  @ApiProperty({
    description: '사이트 코드',
    required: true,
    example: '',
  })
  site_cd? : string;




}
