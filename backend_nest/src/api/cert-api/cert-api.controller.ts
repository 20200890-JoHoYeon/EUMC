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
import { CureLinkCertification } from "./dto/cure-link-certification.interface";
import { ReqMakeCertPdf } from "./dto/req-make-cert.pdf";
import { PatientApiService } from "../patient-api/patient-api.service";
import { CommonCodeConst, MEDICAL_FORM_CODE } from "../../const/common-code.const";
import { ReqInternetCtfsOtptInfom } from "../emr-soap-api/dto/req-internet-ctfs-otpt-infom.interface";
import * as moment from "moment-timezone";


@Controller('api/v1/cert')
@ApiTags('진료 제증명 API')
export class CertApiController {
  private readonly logger = new Logger(CertApiController.name);

  constructor(private certApiService: CertApiService,
              private patientApiService: PatientApiService,

              ) {
  }

  @Get('/reqMedicalFormInfo')
  @ApiOperation({ summary: '의료문서(진단서/소견서) 요청' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'mdrc_id',
    description: '',
    required: true,
    example: '',
  })
  @ApiQuery({
    name: 'mdfm_cls_dtl_cd',
    description: '',
    required: true,
    example: '',
  })
  @ApiQuery({
    name: 'email',
    description: '',
    required: true,
    example: '',
  })
  async reqMedicalFormInfo(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                           @Query('mdrc_id') mdrc_id: string,
                           @Query('mdfm_cls_dtl_cd') mdfm_cls_dtl_cd: string,
                           @Query('email') email: string,
                           ) {
    const resp = new ResponseDto();
    try {

      // const resultData = await this.certApiService.reqMedicalFormInfoPDF({
      //   his_hsp_tp_cd: his_hsp_tp_cd,
      //   mdrc_id: mdrc_id,
      //   mdfm_cls_dtl_cd: mdfm_cls_dtl_cd,
      // } as ReqInternetCrtfSelectMedicalFormInfo, email);

      // resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`의료문서(진단서/소견서) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/medicalFormInfoList')
  @ApiOperation({ summary: '소견서, 진단서 목록 조회' })
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
  async getMedicalFormInfoList(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                           @Query('pt_no') pt_no: string
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getMedicalFormInfoList({
        his_hsp_tp_cd: his_hsp_tp_cd,
        in_pt_no: pt_no,
      });

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`의료문서(진단서/소견서) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Get('/adsInfom')
  @ApiOperation({ summary: '입퇴원확인서 조회' })
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
    name: 'meddept',
    description: '부서',
    required: false,
    example: '',
  })
  @ApiQuery({
    name: 'fromdate',
    description: '조회시작일자',
    required: true,
    example: '20180101',
  })
  @ApiQuery({
    name: 'todate',
    description: '조회종료일자',
    required: true,
    example: '20230101',
  })
  async getAdsinfom(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                    @Query('pt_no') pt_no: string,
                    @Query('meddept') meddept: string,
                    @Query('fromdate') fromdate: string,
                    @Query('todate') todate: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getAdsinfom({
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        meddept: meddept == null ? '' : meddept,
        fromdate: fromdate,
        todate: todate,
      } as ReqInternetCtfsAdsInfom);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`의료문서(진단서/소견서) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/mcstPymCfmt')
  @ApiOperation({ summary: '진료비납입확인서(연말정산용)' })
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
    example: '20180101',
  })
  @ApiQuery({
    name: 'todate',
    description: '조회종료일자',
    required: true,
    example: '20230101',
  })
  async getMcsPymCfmt(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                    @Query('pt_no') pt_no: string,
                    @Query('fromdate') fromdate: string,
                    @Query('todate') todate: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getMcsPymCfmt({
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        fromdate: fromdate,
        todate: todate,
      } as ReqInternetMcstPymcFmt);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`의료문서(진단서/소견서) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/ctfsOtptInfom')
  @ApiOperation({ summary: '통원진료확인서' })
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
    example: '10628653',
  })
  @ApiQuery({
    name: 'fromdate',
    description: '조회시작일자',
    required: true,
    example: '20180427',
  })
  @ApiQuery({
    name: 'todate',
    description: '조회종료일자',
    required: true,
    example: '20180831',
  })
  @ApiQuery({
    name: 'meddept',
    description: '부서',
    required: false,
    example: '',
  })
  async getCtfsOtptInfom(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                      @Query('pt_no') pt_no: string,
                      @Query('meddept') meddept: string,
                      @Query('todate') fromdate: string,
                      @Query('todate') todate: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getCtfsOtptInfom({
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        fromdate: fromdate,
        todate: todate,
        meddept: meddept == null ? '' : meddept,
      } as ReqInternetCtfsAdsInfom);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`통원진료확인서 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/mcstDtlPtclFom')
  @ApiOperation({ summary: '진료비세부내역서(입원)' })
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
    example: '20180802',
  })
  @ApiQuery({
    name: 'ads_dt',
    description: '',
    required: true,
    example: '20180801',
  })
  async getMcstDtlPtclFom(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                         @Query('pt_no') pt_no: string,
                         @Query('fromdate') fromdate: string,
                         @Query('todate') todate: string,
                          @Query('ads_dt') ads_dt: string,
  ) {
    const resp = new ResponseDto();
    try {

      const resultData = await this.certApiService.getMcstDtlPtclFom({
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        fromdate: fromdate,
        todate: todate,
        ads_dt: ads_dt,
      } as ReqInternetMcstDtlPtclFom);

      resp.setSuccess(resultData);
    } catch (e) {
      this.logger.error(`진료비세부내역서(입원) 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Get('/mcstDtOPtclFom')
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
    example: '20200802',
  })
  @ApiQuery({
    name: 'meddept',
    description: '부서',
    required: false,
    example: '',
  })
  async getMcstDtOPtclFom(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
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
        meddept: meddept == null ? '' : meddept,
      } as ReqInternetMcstDtoPtclFom);

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













  @Post('/certificationListOld')
  @ApiOperation({ summary: '제증명서리스트 조회' })
  @ApiBody({
    description: '요청값',
    required: true,
    type: CureLinkCertification,
  })
  async certificationListOld(@Body() body: CureLinkCertification) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`제증명서리스트 조회 START`)

      body.meddept = body.meddept == null ? '' : body.meddept;

      const waitNumberResp = await this.certApiService.getCertificationList(body);
      resp.setSuccess(waitNumberResp);
    } catch (e) {
      this.logger.error(`제증명서리스트 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }


  @Get('/certificationList')
  @ApiOperation({ summary: '제증명서리스트 조회' })
  @ApiQuery({
    name: 'his_hsp_tp_cd',
    description: '병원코드(01: 서울, 02: 목동)',
    required: true,
    example: '01',
  })
  @ApiQuery({
    name: 'pt_no',
    description: '',
    required: true,
    example: '',
  })
  @ApiQuery({
    name: 'fromdate',
    description: '',
    required: true,
    example: '',
  })
  @ApiQuery({
    name: 'todate',
    description: '',
    required: true,
    example: '',
  })
  @ApiQuery({
    name: 'meddept',
    description: '',
    required: false,
    example: '',
  })
  async certificationList(@Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
                          @Query('pt_no') pt_no: string,
                          @Query('fromdate') fromdate: string,
                          @Query('todate') todate: string,
                          @Query('meddept') meddept: string) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`제증명서리스트 조회 START`)

      meddept = meddept == null ? '' : meddept;

      const waitNumberResp = await this.certApiService.getCertificationList_USE(his_hsp_tp_cd, pt_no, fromdate, todate, meddept);
      resp.setSuccess(waitNumberResp);
    } catch (e) {
      this.logger.error(`제증명서리스트 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }





  @Post('/requestMakeCertPdf')
  @ApiOperation({ summary: '제증명 PDF 요청' })
  @ApiBody({
    description: '요청값',
    required: true,
    type: ReqMakeCertPdf,
  })
  async requestMakeCertPdf(@Body() body: ReqMakeCertPdf) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`제증명 PDF 요청 START ${JSON.stringify(body)}`);


      body.data = body.data.replace("\\n", "");
      body.data = body.data.replace("\"", "");
      this.logger.debug("-------------------");
      this.logger.debug("his_hsp_tp_cd : " + body.his_hsp_tp_cd.trim());
      this.logger.debug("patno : " + body.patno.trim());
      this.logger.debug("rcptype : " + body.rcptype);
      this.logger.debug("certname : " + body.certname.trim());
      this.logger.debug("deptname : " + body.deptname.trim());
      this.logger.debug("fromdate : " + body.fromdate.trim());
      this.logger.debug("todate : " + body.todate.trim());
      this.logger.debug("date : " + body.date.trim());
      this.logger.debug("data : " + body.data);

      let result = null;
      let password = '';
      const patientInfo = await this.patientApiService.getPatientInfo(body.patno);
      if(patientInfo != null) {

        password = patientInfo.resno1;
        this.logger.debug('PASSWORD : ' + password)

        if( body.certname.trim() == "일반진단서[재발급]" ){
          result = await this.certApiService.reqMedicalFormInfoPDF(patientInfo, {
            his_hsp_tp_cd: body.his_hsp_tp_cd,
            mdrc_id: body.data.trim(),
            mdfm_cls_dtl_cd: MEDICAL_FORM_CODE.JINDAN,
            email: ''
          }, body.email, password);

        }else if( body.certname.trim() == "소견서[재발급]" ) {
          result = await this.certApiService.reqMedicalFormInfoPDF(patientInfo, {
            his_hsp_tp_cd: body.his_hsp_tp_cd,
            mdrc_id: body.data.trim(),
            mdfm_cls_dtl_cd: MEDICAL_FORM_CODE.SOGYEON,
            email: ''
          }, body.email, password);

        }else if( body.certname.trim() == "입퇴원사실확인서" ) {
          try {
            result = await this.certApiService.getAdsinfom({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.fromdate,
              todate: body.todate,
              meddept: ""
            } as ReqInternetCtfsAdsInfom);
          }catch (e) {

          }

          if(result != null) {
            result = await this.certApiService.pdfAdsInfom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }

        }else if( body.certname.trim() == "진료비납입확인서(연말정산용)" ) {
          try {
            result = await this.certApiService.getMcsPymCfmt({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.fromdate,
              todate: body.todate,
            } as ReqInternetMcstPymcFmt);
          }catch (e) {

          }

          if(result != null) {
            result = await this.certApiService.pdfMcstPymCfmt(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }

        }else if( body.certname.trim() == "통원진료확인서" ) {
          try {
            result = await this.certApiService.getCtfsOtptInfom({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.fromdate,
              todate: body.todate,
              meddept: '',
            } as ReqInternetCtfsOtptInfom);
          }catch (e) {

          }

          if(result != null) {
            result = await this.certApiService.pdfCtfsOtptInfom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }


        }else if( body.certname.trim() == "진료비세부내역서(외래)" ) {
          try {
            result = await this.certApiService.getMcstDtOPtclFom({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.fromdate,
              todate: body.todate,
              meddept: '',
            } as ReqInternetMcstDtoPtclFom);
          }catch (e) {

          }

          if(result != null) {
            result = await this.certApiService.pdfMcstDtOPtclFom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }


        }else if( body.certname.trim() == "진료비세부내역서(입원)" ) {
          try {
            result = await this.certApiService.getMcstDtlPtclFomBillTypeI(
              body.his_hsp_tp_cd,
              body.data.trim(),
              body.date.replace("-", "").substring(0, 8).trim(),
              body.fromdate,
              body.todate);
          }catch (e) {

          }

          if(result != null) {
            result = await this.certApiService.pdfMcstDtlPtclFom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }

        }else if( body.certname.trim() == "진료비계산영수증" ) {
          if(body.rcptype == "2"){
            result = this.certApiService.getReceiptTypeIBList(
              body.his_hsp_tp_cd,
              patientInfo.out_pt_no,
              body.date,
              moment().format("yyyyMMDD"));
          }else{
            result = this.certApiService.getReceiptList(
              body.his_hsp_tp_cd,
              patientInfo.out_pt_no,
              body.rcptype,
              body.deptname,
              body.data,
              body.date);
          }

          if(result != null) {
            result = await this.certApiService.pdfBillInfo(body.his_hsp_tp_cd, body.rcptype, patientInfo, result, password, body.email);
          }
        }
      }

      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`제증명 PDF 요청 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }













}
