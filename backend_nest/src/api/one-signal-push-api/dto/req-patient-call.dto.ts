import { ApiProperty } from '@nestjs/swagger';
import { PatientCallData } from './patient-call-data.interface';


class PatientCallContent {
  @ApiProperty({
    description: '푸시 메시지',
    required: true,
    example: '00번 창구. 호출 하였습니다',
  })
  en: string;
  @ApiProperty({
    description: '타입',
    required: false,
    example: '',
  })
  type?: string;
  @ApiProperty({
    description: '',
    required: false,
    example: '02',
  })
  his_hsp_tp_cd?: string;
  @ApiProperty({
    description: '호출 데이터',
    required: false,
    example:
      '{"SYSTEM":1,"CMD":"CALL2", "K_IP":"10.10.210.66", "MENU":1, "PATIENT":12009954, "CALL_NO":291, "DESK":22}',
  })
  data?: PatientCallData;
}


/**
 * 순번대기 푸시 메시지 생성 클래스 - OneSignal API Request
 * https://documentation.onesignal.com/reference/create-notification
 */
export class ReqPatientCallDto {
  @ApiProperty({
    description: '푸시 서비스(OneSignal API) 앱 아이디',
    required: false,
    example: 'a5f70288-e31f-4a3b-8fc6-79e8ebf91293',
  })
  app_id = 'a5f70288-e31f-4a3b-8fc6-79e8ebf91293';

  @ApiProperty({
    description: '푸시대상 사용자 아이디(앱키) 배열',
    required: true,
    example: '["1dd608f2-c6a1-11e3-851d-000c2940e62c"]',
  })
  include_player_ids: Array<string> = new Array<string>();

  // @ApiProperty({
  //   description: '푸시 데이터(개별)',
  //   required: true,
  //   example: 'en, type, his_hsp_tp_cd',
  // })
  // contents: string;

  @ApiProperty({
    description: '푸시 데이터(객체)',
    required: true,
    example: '',
  })
  contents: PatientCallContent | string;
}
// ONESIGNAL RESP JSON
// {"SYSTEM":1,"CMD":"CALL2", "K_IP":"10.10.210.66", "MENU":1, "PATIENT":12009954, "CALL_NO":291, "DESK":22}
