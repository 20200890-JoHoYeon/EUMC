import { Body, Controller, InternalServerErrorException, Logger, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ReceiptApiService } from "./receipt-api.service";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { ReqReceipt } from "./dto/req-receipt.interface";
import { ReqReceiptDetail } from "./dto/req-receipt-detail.interface";
import { CureLinkCertification } from "../cert-api/dto/cure-link-certification.interface";

@Controller('api/v1/receipt')
@ApiTags('영수증 API')
export class ReceiptApiController {
  private readonly logger = new Logger(ReceiptApiController.name);


  constructor(private receiptApiService: ReceiptApiService) {
  }


  @Post('/history')
  @ApiBody({
    description: '요청값',
    required: true,
    type: ReqReceipt,
  })
  @ApiOperation({ summary: '환자 진료 기록 조회' })
  async getMedicalHistory(@Body() body: ReqReceipt) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`${body.patno} 환자 ${body.startDate} ~ ${body.endDate} 진료 기록 조회 START`);
      const result = await this.receiptApiService.getMedicalHistory(body);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`${body.patno} 환자 ${body.startDate} ~ ${body.endDate} 진료 기록 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Post('/header-info')
  @ApiOperation({ summary: '영수증 정보 조회' })
  @ApiBody({
    description: '요청값',
    required: true,
    type: ReqReceipt,
  })
  async getReceiptInfo(@Body() body: ReqReceipt) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`${body.patno} 환자 영수증 정보 조회 START`)
      const result = await this.receiptApiService.getReceiptInfo(body);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`${body.patno} 환자 영수증 정보 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Post('/detail-info')
  @ApiOperation({ summary: '영수증 세부정보 조회' })
  @ApiBody({
    description: '요청값',
    required: true,
    type: ReqReceiptDetail,
  })
  async getReceiptDetailInfo(@Body() body: ReqReceiptDetail) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`영수증 ${body.rcptno} 세부정보 조회`)
      const result = await this.receiptApiService.getReceiptDetailInfo(body);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`영수증 ${body.rcptno} 세부정보 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }
}
