import { Body, Controller, Get, InternalServerErrorException, Logger, Post, Query } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PrescriptionApiService } from "../prescription-api/prescription-api.service";
import { PaymentApiService } from "./payment-api.service";
import { ResponseDto } from "../../common/dto/response.dto";
import { ApiResult } from "../../const/api-result.const";
import { ReqRsvToday } from "../reservation-api/dto/req-rsv-today.interface";

@Controller('api/v1/payment')
@ApiTags('결재/수납 API')
export class PaymentApiController {
  private readonly logger = new Logger(PaymentApiController.name);

  constructor(
    private paymentApiService: PaymentApiService,
  ) {
  }




  @Get('/history')
  @ApiOperation({ summary: '수납이력 일자별 조회' })
  async paymentHistory(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`수납이력 일자별 조회 START`);
      const result = await this.paymentApiService.getPayHistory({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt,
        IN_TO_DT: to_dt,
      } as ReqRsvToday);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`수납이력 일자별 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/paymentDetail')
  @ApiOperation({ summary: '수납이력 상세 조회' })
  async paymentDetail(
    @Query('pact_id') pact_id: string
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`수납이력 상세 START`);
      const result = await this.paymentApiService.getPayDetail(pact_id);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`수납이력 상세 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Get('/historyDtl')
  @ApiOperation({ summary: '수납이력 일자별 조회' })
  async paymentHistoryDtl(
    @Query('his_hsp_tp_cd') his_hsp_tp_cd: string,
    @Query('pt_no') pt_no: string,
    @Query('from_dt') from_dt: string,
    @Query('to_dt') to_dt: string,

  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`수납이력 일자별 조회 START`);
      const result = await this.paymentApiService.getPayHistoryDtl({
        IN_HSP_TP_CD: his_hsp_tp_cd,
        IN_PT_NO: pt_no,
        IN_FROM_DT: from_dt,
        IN_TO_DT: to_dt,
      } as ReqRsvToday);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`수납이력 일자별 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }



  @Post('/checkPaymentList')
  @ApiOperation({ summary: '수납리스트 조회' })
  @ApiBody({
    description: '요청값',
    required: true,
    schema: {
      properties: {
        his_hsp_tp_cd: { type: 'string' },
        pat_no: { type: 'string' },
      },
    },
  })
  async checkPaymentList(
    @Body("his_hsp_tp_cd") his_hsp_tp_cd: string,
    @Body("pat_no") pat_no: string,
  ) {
    const resp = new ResponseDto();
    try {
      this.logger.debug(`수납리스트 조회 START`)
      const result = await this.paymentApiService.getPaymentList(his_hsp_tp_cd, pat_no);
      resp.setSuccess(result);
    } catch (e) {
      this.logger.error(`수납리스트 조회 ERR : ${e}`);
      resp.setError(ApiResult.UNKNOWN_ERROR);
      throw new InternalServerErrorException(resp, {
        cause: e,
        description: resp.resultMsg,
      });
    }
    return resp;
  }




//
//   @RequestMapping(value = "getBillInfoB", method = RequestMethod.POST)
//   public ResponseDTO getBillInfoB(
//     @RequestParam String his_hsp_tp_cd,
//   @RequestParam String patno,
//   @RequestParam String admDate,
//   @RequestParam String paymentDate
// ){
//   return paymentService.getBillDataB(his_hsp_tp_cd, patno, admDate, paymentDate);
// }
//
// @RequestMapping(value = "getBillInfoS", method = RequestMethod.POST)
// public ResponseDTO getBillInfoS(
//   @RequestParam String his_hsp_tp_cd,
// @RequestParam String patno
// ){
//   return paymentService.getBillDataS(his_hsp_tp_cd, patno);
// }
//
// @RequestMapping(value = "/getBillInfo", method = RequestMethod.POST)
// public ResponseDTO getBillInfo(
//   @RequestParam String his_hsp_tp_cd,
// @RequestParam String patno,
// @RequestParam String meddept,
// @RequestParam String pay_complete,
// @RequestParam (value = "rcptype", required = false, defaultValue = "") String rcptype){
//   return paymentService.getBillData(his_hsp_tp_cd, patno, rcptype, meddept, pay_complete, null);
// }
//
//
//   /**
//    * App Main PaymentODTO List
//    * @param patno
//    * @return
//    */
//   @RequestMapping(value = "/checkPaymentList", method = RequestMethod.POST)
//   public Object checkPayment(
//     @RequestParam String his_hsp_tp_cd,
//   @RequestParam String patno
// ){
//   ResponseDTO result = new ResponseDTO();
//   logger.info("checkPayment in : " + patno);
//
//   // 환자 조회
//   ResponseDTO resPatient = patientService.getPatientInfo(patno);
//
//   if(resPatient.getResultCode().equals(ErrorResult.RESULT_OK.getCode())){
//   logger.info("checkPayment pat info ok : " + patno);
//
//   PatientDTO patientDTO = (PatientDTO) resPatient.getData();
//
//   // 수납내역 받아오기
// //            patientDTO.setPatno("96476189");
//   ArrayList<PaymentODTO> arrResPaymentO = (ArrayList<PaymentODTO>) paymentService.getPaymentList(his_hsp_tp_cd, patientDTO, Common.SERVICE_PAYMENT_TYPE_O).getData();
//
// //            patientDTO.setPatno("10628653");
//   ArrayList<PaymentIDTO> arrResPaymentI = (ArrayList<PaymentIDTO>) paymentService.getPaymentListI(his_hsp_tp_cd, patientDTO.getPatno(), "S", Common.SERVICE_PAYMENT_TYPE_I).getData();
//
//   ArrayList<PaymentSimpleDTO> arrResPayment = new ArrayList<>();
//   for(int i = 0; i < arrResPaymentO.size(); i++){
//   PaymentSimpleDTO paymentSimpleDTO = new PaymentSimpleDTO();
//   paymentSimpleDTO.setDeptname(arrResPaymentO.get(i).getDeptname().trim());
//   paymentSimpleDTO.setRcpamt(arrResPaymentO.get(i).getRcpamt());
//   paymentSimpleDTO.setMeddate(arrResPaymentO.get(i).getMeddate());
//
//   arrResPayment.add(paymentSimpleDTO);
// }
// for(int i = 0; i < arrResPaymentI.size(); i++){
//   PaymentSimpleDTO paymentSimpleDTO = new PaymentSimpleDTO();
//   paymentSimpleDTO.setDeptname(arrResPaymentI.get(i).getDeptname().trim());
//   paymentSimpleDTO.setRcpamt(arrResPaymentI.get(i).getRcpamt());
//   paymentSimpleDTO.setAdmdate(arrResPaymentI.get(i).getAdmdate());
//
//   arrResPayment.add(paymentSimpleDTO);
// }
//
// PaymentListDTO resReturnData = paymentService.getReturnCheckPaymentList(patientDTO, arrResPayment);
// //            result.setData(resReturnData.getData());
// result.setResultData(resReturnData);
//
// return result;
// }
// else {
//   resPatient.setError(new ErrorMapperValue(ErrorResult.NONE_PATIENT));
//   return resPatient;
// }
//
//
// }
//
//   /**
//    * 수납 내역 조회
//    * 1. 환자 조회
//    * 2. 수납내역 받아오기
//    * 3. 수납내역 받아오기 (상세)
//    *
//    * @return 수납 정보
//    */
//   @RequestMapping(value = "/paymentList", method = RequestMethod.POST)
//   public Object getPaymentList(
// //            @RequestParam(value = "patno") String patno
// @RequestBody ReqPaymentDTO req
// ){
//   ResponseDTO result = new ResponseDTO();
//
//   // 환자 조회
//   ResponseDTO resPatient = patientService.getPatientInfo(req.getPatno());
//
//   // 환자 조회 성공 시, 수납 금액 조회
//   if(resPatient.getResultCode().equals(ErrorResult.RESULT_OK.getCode())){
//   PatientDTO patientDTO = (PatientDTO) resPatient.getData();
//
//   ResponseDTO resPaymentO = null;
//   ResponseDTO resPaymentI = null;
//   String paygubn = "B";
//
//   // 수납내역 받아오기
//   switch (req.getRcp_type()){
//   case 1 :
//     resPaymentO = paymentService.getPaymentList(req.getHis_hsp_tp_cd(), patientDTO, Common.SERVICE_PAYMENT_TYPE_O);
//   break;
//   case 2 :
//     resPaymentI = paymentService.getPaymentListI(req.getHis_hsp_tp_cd(), patientDTO.getPatno(), paygubn, Common.SERVICE_PAYMENT_TYPE_I);
//   break;
//   case 3 :
//     paygubn = "S";
//   resPaymentI = paymentService.getPaymentListI(req.getHis_hsp_tp_cd(), patientDTO.getPatno(), paygubn, Common.SERVICE_PAYMENT_TYPE_I);
//   break;
// }
//
// PaymentDTO resReturnData = paymentService.getReturnPayment(resPatient, resPaymentO, resPaymentI);
// //            result.setData(resReturnData.getData());
//
// logger.info("resReturnData : " + resReturnData.toString());
//
// return resReturnData;
// }
// else{
//   resPatient.setError(new ErrorMapperValue(ErrorResult.NONE_PATIENT));
//   return resPatient;
// }
// }
//
// // live
// @RequestMapping(value = "/paymentList_I", method = RequestMethod.POST)
// public Object getPaymentList_I(
//   @RequestParam(value = "his_hsp_tp_cd") String his_hsp_tp_cd,
// @RequestParam(value = "patno") String patno,
// @RequestParam(value = "rcp_type") String rcpType
// ){
//   ResponseDTO result = new ResponseDTO();
//
//   // 환자 조회
//   ResponseDTO resPatient = patientService.getPatientInfo(patno);
//
//   if(resPatient.getResultCode().equals(ErrorResult.RESULT_OK.getCode())){
//     String paygubn = "B";
//     if(rcpType.equals("3")){
//       paygubn = "S";
//     }
//
//     PatientDTO patientDTO = (PatientDTO) resPatient.getData();
//
//     // 수납내역 받아오기
//     ResponseDTO resPayment = paymentService.getPaymentListI(his_hsp_tp_cd, patientDTO.getPatno(), paygubn, Common.SERVICE_PAYMENT_TYPE_I);
//
//     PaymentDTO resReturnData = paymentService.getReturnPayment(resPatient, null, resPayment);
// //            result.setData(resReturnData.getData());
//
//     return resReturnData;
//   }
//   else{
//     resPatient.setError(new ErrorMapperValue(ErrorResult.NONE_PATIENT));
//     return resPatient;
//   }
// }
//
// /**
//  * 수납 내역 저장
//  *
//  * @param saveData (JsonObject)
//  * @return 저장 결과
//  */
// @RequestMapping(value = "/paymentSave", method = RequestMethod.POST)
// public Object paymentSave(
//   @RequestParam String saveData
// ){
//   logger.info("savedata : " + saveData);
//   JSONObject jObj = new JSONObject(saveData);
//   if(jObj.getInt("rcptype") == 1 || jObj.getInt("rcptype") == 3) {
//     logger.info("rcptype is " + jObj.getInt("rcptype"));
//     return saveService.requestSave(saveData, jObj.getInt("rcptype"));
//   }
//   else{
//     logger.info("rcptype is not 1");
//     return saveService.requestSaveI(saveData);
//   }
// }
//
//









}
