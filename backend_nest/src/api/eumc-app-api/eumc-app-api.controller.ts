import {
  Body,
  Controller, Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post, Put, Query
} from "@nestjs/common";
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto/response.dto';
import { ApiResult } from '../../const/api-result.const';
import { EumcAppApiService } from './eumc-app-api.service';
import { ReqChkAppVersionDto } from './dto/req-chk-app-version.dto';
import { ReqSetAppPushDto } from "./dto/req-set-app-push.dto";

@Controller('api/v1/app')
@ApiTags('APP관련 API')
export class EumcAppApiController {
  private readonly logger = new Logger(EumcAppApiController.name);

  constructor(private readonly eumcAppApiService: EumcAppApiService) {}

  @Post('/chk-version')
  @ApiOperation({
    summary: '앱 버전체크',
  })
  async checkUpdateVersion(@Body() body: ReqChkAppVersionDto) {
    const resp = new ResponseDto();
    try {
      const resultData = await this.eumcAppApiService.getAppVersionInfo(
        body.userVersion,
        body.osType,
      );
      if (resultData == null) {
        resp.setSuccess(body, '현재버전이 최신상태입니다.');
      } else {
        resp.setSuccess(resultData);
      }
    } catch (e) {
      this.logger.error(`앱 버전체크 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Get('/push')
  @ApiOperation({
    summary: '앱 푸시 정보 조회',
  })
  async getPush(@Query('patno') patno: string) {
    const resp = new ResponseDto();
    try {
      const resultData = await this.eumcAppApiService.getPushInfo(patno);
      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`앱 푸시 정보 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Post('/push')
  @ApiOperation({
    summary: '앱 푸시 정보 조회',
  })
  async updatePush(@Body() body: ReqSetAppPushDto) {
    const resp = new ResponseDto();
    try {
      const resultData = await this.eumcAppApiService.updatePushInfo(body);
      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`앱 푸시 정보 갱신 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




  @Get('/alimtalk')
  @ApiOperation({
    summary: '앱 푸시 정보 조회',
  })
  async alimtalk() {
    const resp = new ResponseDto();
    try {
      const resultData = await this.eumcAppApiService.getAlimtalk();
      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`앱 푸시 정보 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }







}
