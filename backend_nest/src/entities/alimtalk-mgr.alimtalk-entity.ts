import { Column, DataSource, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('ATA_MMT_TRAN', { database: 'ewsms' })
export class AlimtalkMgrEntity {
  @PrimaryGeneratedColumn({
    name : "MT_PR"
  })
  mtPr: number;

  @Column({ name: "MT_REFKEY" })
  mtRefkey: string;

  @Column({ name: "ADD_REFKEY" })
  addRefkey: string;

  @Column({ name: "DATE_CLIENT_REQ" })
  dateClientReq: Date;

  @Column({ name: "SUBJECT" })
  subject: string;

  @Column({ name: "CONTENT" })
  content: string;

  @Column({ name: "CALLBACK" })
  callback: string;

  @Column({ name: "MSG_STATUS" })
  msgStatus: string;

  @Column({ name: "RECIPIENT_NUM" })
  recipientNum: string;

  @Column({ name: "COUNTRY_CODE" })
  countryCode: string;

  @Column({ name: "MSG_TYPE" })
  msgType: string;

  @Column({ name: "SENDER_KEY" })
  senderKey: string;

  @Column({ name: "TEMPLATE_CODE" })
  templateCode: string;

  @Column({ name: "RESPONSE_METHOD" })
  responseMethod: string;

  @Column({ name: "ATTACHMENT_TYPE" })
  attachmentType: string;

  @Column({ name: "ATTACHMENT_NAME" })
  attachmentName: string;

  @Column({ name: "ATTACHMENT_URL" })
  attachmentUrl: string;

  @Column({ name: "ETC_TEXT_1" })
  etc_text_1: string;

  @Column({ name: "HSP_TP_CD" })
  hsp_tp_cd: string;
}


/**
 *  {
 *       "mtPr": 28026028,
 *       "mtRefkey": "02",
 *       "addRefkey": "16112294",
 *       "dateClientReq": "2023-04-10T23:48:00.000Z",
 *       "subjent": "알림문자",
 *       "content": "안녕하세요, 이대목동병원 이비인후과 음성언어클리닉입니다. 한경조님 4월 13일 1시에 음성치료 예약되었습니다. 2층 이비인후과 내 음성언어치료실 1번 방으로 오시면 됩니다. 감사합니다.\r\n",
 *       "callback": "16665000",
 *       "msgStatus": "1",
 *       "recipientNum": "01028031407",
 *       "countryCode": "82",
 *       "msgType": 1008,
 *       "senderKey": "c641b14044bab959693be7e1023d89cc95252d35",
 *       "templateCode": "템플릿",
 *       "responseMethod": "push",
 *       "attachmentType": null,
 *       "attachmentName": null,
 *       "attachmentUrl": null,
 *       "etc_text_1": null,
 *       "hsp_tp_cd": "02"
 *     },
 */
