import { Body, Controller, Get, InternalServerErrorException, Logger, Param, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PatientApiService } from "./patient-api.service";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { ReqHomepagePtTelInsert } from "../emr-soap-api/dto/req-homepage-pt-tel-insert.interface";
import { ReqPatientInfo } from "./dto/req-patient-info.dto";

@Controller('api/v1/patient')
@ApiTags('환자 API')
export class PatientApiController {
  private readonly logger = new Logger(PatientApiController.name);

  constructor(private patientApiService: PatientApiService) {
  }


  @Get('/info/:patNo')
  @ApiOperation({ summary: '환자 정보 조회' })
  async getPatientInfoByPatNo(@Param('patNo') patNo: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`환자 정보 조회 START`)
      const result = await this.patientApiService.getPatientInfo(patNo);
      if( typeof(result.out_ssn) !== 'undefined' ) {
        resp.setSuccess(result);
      }else{
        resp.setError(ApiResult.UNKNOWN_ERROR)
      }
    } catch (e) {
      this.logger.error(`환자 정보 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Post('/chk-info')
  @ApiOperation({ summary: '환자 정보 조회' })
  @ApiBody({
    description: '환자 정보 조회',
    required: true,
    type: ReqPatientInfo,
  })
  async chkPatientInfo(@Body() body: ReqPatientInfo) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`환자 정보 조회 START`)

      const result = await this.patientApiService.checkPatientInfo(body.nm, body.birth, body.pt_no);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`환자 정보 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Get('/check-holiday/:hisHspTpCd')
  @ApiOperation({ summary: '휴일 조회' })
  async checkHoliday(@Param('hisHspTpCd')  hisHspTpCd: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`휴일 조회 START`)

      const result = await this.patientApiService.checkHoliday(hisHspTpCd, null);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`휴일 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }

  @Get('/check-holiday/:hisHspTpCd/:checkDate')
  @ApiOperation({ summary: '휴일 조회-날짜' })
  async checkHolidayWithDate(@Param('hisHspTpCd')  hisHspTpCd: string, @Param('checkDate')  checkDate: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`휴일 조회-날짜 START`)

      const result = await this.patientApiService.checkHoliday(hisHspTpCd, checkDate);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`휴일 조회-날짜 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Get('/email')
  @ApiOperation({ summary: '환자 이메일 조회' })
  async getEmail(@Query('hisHspTpCd')  hisHspTpCd: string, @Query('rrn')  rrn: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`환자 이메일 조회 START`)

      const result = await this.patientApiService.getEmail(hisHspTpCd, rrn);
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


  @Post('/email')
  @ApiOperation({ summary: '환자 이메일 수정' })
  async updateEmail(@Body('his_hsp_tp_cd') hisHspTpCd: string,
                    @Body('pt_no') pt_no: string,
                    @Body('email') email: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`환자 이메일 수정 START`)

      const result = await this.patientApiService.updateEmail(hisHspTpCd, pt_no, email);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`환자 이메일 수정 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Post('/tel')
  @ApiOperation({ summary: '환자 전화번호 수정' })
  async updateTelNo(@Body('his_hsp_tp_cd') hisHspTpCd: string,
                    @Body('pt_no') pt_no: string,
                    @Body('tel_no') tel_no: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`환자 전화번호 수정 START`)

      const result = await this.patientApiService.updateTelNo(hisHspTpCd, pt_no, tel_no);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`환자 전화번호 수정 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



//   @RequestMapping(value = "/getEmail", method = RequestMethod.POST)
//   public ResponseDTO getEmail(@RequestParam String his_hsp_tp_cd,
//   @RequestParam String rrn){
//   return patientService.getEmail(his_hsp_tp_cd, rrn);
// }
//
// @RequestMapping(value = "/updateEmail", method = RequestMethod.POST)
// public ResponseDTO updateEmail(@RequestParam String hsp_tp_cd,
// @RequestParam String pt_no,
// @RequestParam String email){
//   return patientService.updateEmail(hsp_tp_cd, pt_no, email);
// }
//
// @RequestMapping(value = "/updateTelNo", method = RequestMethod.POST)
// public ResponseDTO updateTelNo(@RequestParam String hsp_tp_cd,
// @RequestParam String pt_no,
// @RequestParam String tel_no
// ){
//   return patientService.updateTelNo(hsp_tp_cd, pt_no, tel_no);
// }









}


