import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MedDeptApiService } from "../med-dept-api/med-dept-api.service";
import { OneSignalPushApiService } from "./one-signal-push-api.service";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { ReqPatientCallDto } from "./dto/req-patient-call.dto";

@Controller('api/v1/one-signal')
@ApiTags('원시그널 API')
export class OneSignalPushApiController {
  private readonly logger = new Logger(OneSignalPushApiController.name);
  constructor(private oneSignalPushApiService: OneSignalPushApiService) {
  }


  @Post('/sendTest')
  @ApiOperation({ summary: '환자 이메일 조회' })
  async sendTest(@Body()  body: ReqPatientCallDto) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`환자 이메일 조회 START`)

      const result = await this.oneSignalPushApiService.patientCall(body);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`환자 이메일 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




}
