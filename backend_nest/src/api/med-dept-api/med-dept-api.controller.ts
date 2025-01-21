import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { MedDeptApiService } from "./med-dept-api.service";

@Controller('api/v1/med-dept')
@ApiTags('부서 API')
export class MedDeptApiController {
  private readonly logger = new Logger(MedDeptApiController.name);

  constructor(private medDeptApiService: MedDeptApiService) {
  }



  @Get('/waitingList')
  @ApiOperation({ summary: '부서별 대기리스트 조회' })
  async requestWaitingMeddeptList(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('rpy_pact_id') rpy_pact_id: string,
  ) {
    const resp = new ResponseDto();
    try {
      const waitNumberResp = await this.medDeptApiService.getMeddeptWaitList(his_hsp_tp_cd, pt_no, rpy_pact_id);
      resp.setSuccess(waitNumberResp);
    } catch (e) {
      this.logger.error(`부서별 대기리스트 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




}
