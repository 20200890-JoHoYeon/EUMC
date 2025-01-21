import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PrescriptionApiService } from "./prescription-api.service";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";

@Controller('api/v1/prescription')
@ApiTags('처방전 API')
export class PrescriptionApiController {
  private readonly logger = new Logger(PrescriptionApiController.name);

  constructor(
    private prescriptionApiService: PrescriptionApiService,
  ) {
  }

  @Get('/header-info')
  @ApiOperation({ summary: '처방전 기본 정보 조회' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '02',
  })
  @ApiQuery({
    name: 'pt_no',
    description: '환자번호',
    required: true,
    example: '11875538',
  })
  async getPrescriptionHeader(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string, @Query('pt_no') patno: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`처방전 기본 정보 조회 START`);
      const result = await this.prescriptionApiService.getPharmInfo(his_hsp_tp_cd, patno);
      resp.setSuccess(result);

      return resp;
    } catch (e) {
      this.logger.error(`처방전 기본 정보 조회  ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
  }

  @Get('/detail-info')
  @ApiOperation({ summary: '처방전 상세 정보 조회' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '02',
  })
  @ApiQuery({
    name: 'pt_no',
    description: '환자번호',
    required: true,
    example: '11875538',
  })
  @ApiQuery({
    name: 'ams_no',
    description: '교부번호',
    required: true,
    example: '10001',
  })
  @ApiQuery({
    name: 'ord_dt',
    description: '요청일자?',
    required: true,
    example: '2019-07-03',
  })
  @ApiQuery({
    name: 'pact_id',
    description: '',
    required: true,
    example: '1000807481',
  })
  async getPrescriptionDetail(@Query('his_hsp_tp_cd') hsp_tcp_cd: string,
                              @Query('pt_no') pt_no: string,
                              @Query('ord_dt') ord_dt: string,
                              @Query('ams_no') ams_no: string,
                              @Query('pact_id') pact_id: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`처방전 상세 정보 조회 START`);
      const result = await this.prescriptionApiService.getPharmDetail(hsp_tcp_cd, pt_no, ord_dt, ams_no, pact_id);
      resp.setSuccess(result);

      return resp;
    } catch (e) {
      this.logger.error(`처방전 상세 정보 조회  ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
  }


  @Post('/e-prescription')
  @ApiOperation({ summary: '전자 처방전 API 요청' })
  async requestPharmData(    @Body("patno") patno: string,
                             @Body("his_hsp_tp_cd") his_hsp_tp_cd: string,
                             @Body("ord_dt") ord_dt: string,
                             @Body("ams_no") ams_no: string,
                             @Body("pact_id") pact_id: string,
                             @Body("pharmName") pharmName: string,
                             @Body("pharmId") pharmId: string,) {


    const resp = new ResponseDto();
    try {
      this.logger.debug(`전자 처방전 요청 START`);
      const result = await this.prescriptionApiService.getEPharmDetail(patno, his_hsp_tp_cd, ord_dt, ams_no, pact_id, pharmName, pharmId);
      resp.setSuccess(result);

      return resp;
    } catch (e) {
      this.logger.error(`전자 처방전 요청 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
  }






}
