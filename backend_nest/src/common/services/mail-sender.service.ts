import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { CommonCodeConst } from "../../const/common-code.const";

@Injectable()
export class MailSenderService {
  private readonly logger = new Logger(MailSenderService.name);

  constructor(private httpService: HttpService) {
  }


  /**
   * 이메일 전송 요청
   *
   * TODO: 메일전송 부분 공통으로 변경예정
   * @param email
   * @param subject
   * @param filePath
   * @param content
   */
  async reqSendMail(email: string, subject: string, filePath: string, content: string, his_hsp_tp_cd: string) {
    this.logger.debug("cert-pdf로 pdf 보내기" + filePath);

    const send_data = {
      to: email,
      subject: subject,
      contents: content,
      filePath: filePath,
      his_hsp_tp_cd: his_hsp_tp_cd,
    };

    this.logger.debug(`send data : ${JSON.stringify(send_data)}`)
    return this.httpService.post(CommonCodeConst.EMAIL_SENDER_API_URL, JSON.stringify(send_data), {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      }
    });
  }
}
