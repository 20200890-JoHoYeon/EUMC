import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Logger, Post, Query } from "@nestjs/common";
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath
} from "@nestjs/swagger";
import { ReqSetAppPushDto } from "../eumc-app-api/dto/req-set-app-push.dto";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { CertApiService } from "./cert-api.service";
import {
  ReqInternetCrtfSelectMedicalFormInfo
} from "../emr-soap-api/dto/req-internet-crtf-select-medical-form-info.dto";
import { ReqInternetCtfsAdsInfom } from "../emr-soap-api/dto/req-internet-ctfs-ads-infom.interface";
import { ReqInternetMcstPymcFmt } from "../emr-soap-api/dto/req-internet-mcst-pymc-fmt.interface";
import { ReqInternetMcstDtlPtclFom } from "../emr-soap-api/dto/req-internet-mcst-dtl-ptcl-fom.interface";
import { ReqInternetMcstDtoPtclFom } from "../emr-soap-api/dto/req-internet-mcst-dto-ptcl-fom.interface";
import { McstDtlPtclInfoDto } from "./dto/mcst-dtl-ptcl-info.dto";
import { refs } from "@nestjs/swagger/dist/utils/get-schema-path.util";
import { SuccessCommonResponseDto } from "../../common/decorator/SuccessResponse.decorator";
import { CureLinkCertification } from "./dto/cure-link-certification.interface";
import { PaymentApiService } from "../payment-api/payment-api.service";

@Controller('api/v1/insurance')
@ApiTags('보험 API')
export class InsuranceApiController {
  private readonly logger = new Logger(InsuranceApiController.name);

  constructor(private paymentApiService: PaymentApiService,
              private certApiService: CertApiService
              ) {
  }

  @Get('/paymentList')
  @ApiOperation({ summary: '제증명-재출력 영수증 내역 데이터 요청' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'pt_no',
    description: '환자번호',
    required: true,
    example: '10453963',
  })
  @ApiQuery({
    name: 'fromdate',
    description: '조회시작일자',
    required: true,
    example: '20180801',
  })
  @ApiQuery({
    name: 'todate',
    description: '조회종료일자',
    required: true,
    example: '20180802',
  })
  async paymentList(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                           @Query('pt_no') pt_no: string,
                           @Query('fromdate') fromdate: string,
                           @Query('todate') todate: string,
                           ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.paymentApiService.getBillList(his_hsp_tp_cd, pt_no, fromdate, todate);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`진료비 계산 영수증 (외래) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/paymentDetail')
  @ApiOperation({ summary: '진료비세부내역서 출력대상 조회' })
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
    example: '10453963',
  })
  @ApiQuery({
    name: 'fromdate',
    description: '조회시작일자',
    required: true,
    example: '20180801',
  })
  @ApiQuery({
    name: 'todate',
    description: '조회종료일자',
    required: true,
    example: '20200801',
  })
  @ApiQuery({
    name: 'meddept',
    description: '부서',
    required: false,
    example: '',
  })
  async paymentDetail(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                           @Query('pt_no') pt_no: string,
                           @Query('fromdate') fromdate: string,
                           @Query('todate') todate: string,
                           @Query('meddept') meddept: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getMcstDtOPtclFom({
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        fromdate: fromdate,
        todate: todate,
        meddept: meddept,
      });

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`진료비세부내역서 출력대상 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Get('/expenseDetail')
  @ApiOperation({ summary: '진료비 세부산정내역 - 외래' })
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
    example: '12112191',
  })
  @ApiQuery({
    name: 'pact_id',
    description: '',
    required: true,
    example: '1001717518',
  })
  @ApiQuery({
    name: 'salary_type',
    description: '급여구분 - "0":전체,"1":비급여만',
    required: false,
    example: '0',
  })
  async expenseDetail(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                      @Query('pt_no') pt_no: string,
                      @Query('pact_id') pact_id: string,
                      @Query('salary_type') salary_type: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.paymentApiService.getMcsPymCfmtDtlType170(his_hsp_tp_cd, pt_no, pact_id, salary_type);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`진료비 세부산정내역 - 외래 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




  @Get('/medicalCertificate')
  @ApiOperation({ summary: '진단서/소견서 목록' })
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
    example: '12112191',
  })
  @ApiQuery({
    name: 'meddept',
    description: '부서',
    required: false,
    example: '',
  })
  @ApiQuery({
    name: 'cert_date',
    description: '진단서 발급 일자',
    required: false,
    example: '',
  })

  async medicalCertificate(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                      @Query('pt_no') pt_no: string,
                           @Query('meddept') meddept: string,
                           @Query('cert_date') cert_date: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getMedicalFormInfo({
        his_hsp_tp_cd: his_hsp_tp_cd,
          in_pt_no: pt_no,
      }, meddept, cert_date);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`진단서/소견서 목록 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




//   @RequestMapping(value = "/insurance/paymentList", method = RequestMethod.POST)
//   public ResponseEntity<ResponseDTO> insurancePaymentList(@RequestBody ReqPaymentList req){
//
//   ResponseDTO res = paymentService.getBillList(req);
//
//   return new ResponseEntity<>(res, HttpStatus.OK);
// }
//
// @RequestMapping(value = "/insurance/paymentDetail", method = RequestMethod.POST)
// public ResponseEntity<ResponseDTO> insurancePaymentDetail(@RequestBody CurelinkCertification req){
//
//   log.info("CurelinkCertification = {}", req);
//
//   ArrayList<McstDtOPtclFom> mcstDtOPtclFoms = curelinkCertService.getMcstDtOPtclFom(req);
//
//   ResponseDTO res = new ResponseDTO();
//   res.setResultData(mcstDtOPtclFoms);
//
//   return new ResponseEntity<>(res, HttpStatus.OK);
// }
//
// @RequestMapping(value = "/insurance/expenseDetail", method = RequestMethod.POST)
// public ResponseEntity<ResponseDTO> insuranceExpenseDetail(@RequestBody CurelinkCertification req){
//
//   log.info("CurelinkCertification = {}", req);
//
//   ArrayList<ExpdInfoDTO> expdInfoList = curelinkCertService.getExpdInfo(req);
//
//   ResponseDTO res = new ResponseDTO();
//   res.setResultData(expdInfoList);
//
//   return new ResponseEntity<>(res, HttpStatus.OK);
// }
//
// @RequestMapping(value = "/insurance/medicalCertificate", method = RequestMethod.POST)
// public ResponseEntity<ResponseDTO> medicalCertificate(@RequestBody CurelinkCertification req){
//
//   InsuranceMedicalCertificate insuranceMedicalCertificate = reqCertDataService.getMedicalCerticateInfo(req);
//
//   ResponseDTO res = new ResponseDTO();
//   if(insuranceMedicalCertificate != null){
//     res.setResultData(insuranceMedicalCertificate);
//   }
//   else{
//     res.setError(new ErrorMapperValue(ErrorResult.UNKOWN_ERROR));
//   }
//
//   return new ResponseEntity<>(res, HttpStatus.OK);
// }




}
