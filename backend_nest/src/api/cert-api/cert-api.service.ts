import { Injectable, Logger, Query } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import {
  ReqInternetCrtfSelectMedicalFormInfo
} from "../emr-soap-api/dto/req-internet-crtf-select-medical-form-info.dto";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { MedicalCertificate } from "./dto/medical-certificate.interface";
import { CommonCodeConst, PDF_GEN_API_TYPE, MEDICAL_FORM_CODE, RCP_TYPE } from "../../const/common-code.const";
import { MailSenderService } from "../../common/services/mail-sender.service";
import { PdfGenerateService } from "../../common/services/pdf-generate.service";
import { MedicalOpinion } from "./dto/medical-opinion.interface";
import {
  ReqInternetCrtfSelectMedicalFormRecordList
} from "../emr-soap-api/dto/req-internet-crtf-select-medical-form-record-list.interface";
import { CrtfMedicalFormDto } from "./dto/crtf-medical-form.dto";
import { CtfsAdsInfoDto } from "./dto/ctfs-ads-info.dto";
import { ReqInternetCtfsAdsInfom } from "../emr-soap-api/dto/req-internet-ctfs-ads-infom.interface";
import { McstPymcFmtDto } from "./dto/mcst-pymc-fmt.dto";
import { ReqInternetCtfsOtptInfom } from "../emr-soap-api/dto/req-internet-ctfs-otpt-infom.interface";
import { ReqInternetMcstPymcFmt } from "../emr-soap-api/dto/req-internet-mcst-pymc-fmt.interface";
import { CtfsOtptInfoDto } from "./dto/ctfs-otpt-info.dto";
import { ReqInternetMcstDtlPtclFom } from "../emr-soap-api/dto/req-internet-mcst-dtl-ptcl-fom.interface";
import { McstDtlPtclInfoDto } from "./dto/mcst-dtl-ptcl-info.dto";
import { ReqInternetMcstDtoPtclFom } from "../emr-soap-api/dto/req-internet-mcst-dto-ptcl-fom.interface";
import { McstDtoPtclInfoDto } from "./dto/mcst-dto-ptcl-info.dto";
import * as moment from "moment-timezone";
import { CureLinkCertification } from "./dto/cure-link-certification.interface";
import { CurelinkType } from "../../const/curelink-type.const";
import { getArrFirstData, stringHashCode } from "../../utils/string.util";
import { KioskWebServiceApiService } from "./kiosk-web-service-api.service";
import { DepartmentType } from "../../const/department-type.const";
import { MedicalCertificateInsurance } from "./dto/medical-certificate-insurance.interface";
import { CrytoUtil } from "../../utils/cryto.util";
import { ImgUtil } from "../../utils/img.util";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EumcCertEumcEntity } from "../../entities/eumc-cert.eumc-entity";
import { PatientInfo } from "../patient-api/dto/patient-info.interface";
import { ReqBillService15X } from "./dto/req-bill-service-15x.interface";
import { PaymentReceiptDetail } from "./dto/payment-receipt-detail.interface";
import { PaymentListItem } from "./dto/payment-list-item.dto";
import { PatientApiService } from "../patient-api/patient-api.service";
import { PaymentO } from "../payment-api/dto/payment-o.interface";
import { PaymentODetail } from "../payment-api/dto/payment-o-detail.interface";
import { PaymentI } from "../payment-api/dto/payment-i.interface";
import { CertList } from "./dto/cert-list.interface";
import { ReqMakeCertPdf } from "./dto/req-make-cert.pdf";


@Injectable()
export class CertApiService {
  private readonly logger = new Logger(CertApiService.name);

  readonly MEDICAL_FORM_CD_JINDAN = "00100";

  constructor(
    private httpService: HttpService,
    private cryUtil: CrytoUtil,
    private imgUtil: ImgUtil,
    private patientApiService: PatientApiService,
    private mailSenderService: MailSenderService,
    private pdfGenerateService: PdfGenerateService,
    private emrSoapApiService: EmrSoapApiService,
    private kioskWebServiceApiService: KioskWebServiceApiService,
    @InjectRepository(EumcCertEumcEntity, "eumc_pay")
    private certEumcEntityRepo: Repository<EumcCertEumcEntity>
  ) {
  }


  async getCertificationListSummary(body: ReqMakeCertPdf) {
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
      this.logger.debug("date : " + body.date.trim());
      this.logger.debug("data : " + body.data);

      this.logger.debug("fromdate : " + body.date.trim());
      this.logger.debug("todate : " + body.date.trim());



      let result = null;
      let password = '';
      const patientInfo = await this.patientApiService.getPatientInfo(body.patno);
      if(patientInfo != null) {

        password = patientInfo.resno1;
        this.logger.debug('PASSWORD : ' + password)

        if( body.certname.trim() == "일반진단서[재발급]" ){
          result = await this.reqMedicalFormInfoPDF(patientInfo, {
            his_hsp_tp_cd: body.his_hsp_tp_cd,
            mdrc_id: body.data.trim(),
            mdfm_cls_dtl_cd: MEDICAL_FORM_CODE.JINDAN,
            email: ''
          }, body.email, password);

        }else if( body.certname.trim() == "소견서[재발급]" ) {
          result = await this.reqMedicalFormInfoPDF(patientInfo, {
            his_hsp_tp_cd: body.his_hsp_tp_cd,
            mdrc_id: body.data.trim(),
            mdfm_cls_dtl_cd: MEDICAL_FORM_CODE.SOGYEON,
            email: ''
          }, body.email, password);

        }else if( body.certname.trim() == "입퇴원사실확인서" ) {
          try {
            result = await this.getAdsinfom({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.date,
              todate: body.date,
              meddept: ""
            } as ReqInternetCtfsAdsInfom);
          }catch (e) {

          }

          if(result != null) {
            result = await this.pdfAdsInfom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }

        }else if( body.certname.trim() == "진료비납입확인서(연말정산용)" ) {
          try {
            result = await this.getMcsPymCfmt({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.date,
              todate: body.date,
            } as ReqInternetMcstPymcFmt);
          }catch (e) {

          }

          if(result != null) {
            result = await this.pdfMcstPymCfmt(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }

        }else if( body.certname.trim() == "통원진료확인서" ) {
          try {
            result = await this.getCtfsOtptInfom({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.date,
              todate: body.date,
              meddept: '',
            } as ReqInternetCtfsOtptInfom);
          }catch (e) {

          }

          if(result != null) {
            result = await this.pdfCtfsOtptInfom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }


        }else if( body.certname.trim() == "진료비세부내역서(외래)" ) {
          try {
            result = await this.getMcstDtOPtclFom({
              his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
              pt_no: patientInfo.out_pt_no,
              fromdate: body.date,
              todate: body.date,
              meddept: '',
            } as ReqInternetMcstDtoPtclFom);
          }catch (e) {

          }

          if(result != null) {
            result = await this.pdfMcstDtOPtclFom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }


        }else if( body.certname.trim() == "진료비세부내역서(입원)" ) {
          try {
            result = await this.getMcstDtlPtclFomBillTypeI(
              body.his_hsp_tp_cd,
              body.data.trim(),
              body.date.replace("-", "").substring(0, 8).trim(),
              body.date,
              body.date);
          }catch (e) {

          }

          if(result != null) {
            result = await this.pdfMcstDtlPtclFom(body.his_hsp_tp_cd, patientInfo, result, password, body.email);
          }

        }else if( body.certname.trim() == "진료비계산영수증" ) {
          if(body.rcptype == RCP_TYPE.INOUT_MID){
            result = await this.getReceiptTypeIBList(
              body.his_hsp_tp_cd,
              patientInfo.out_pt_no,
              body.date,
              moment().format("yyyyMMDD"));
          }else{
            result = await this.getReceiptList(
              body.his_hsp_tp_cd,
              patientInfo.out_pt_no,
              body.rcptype,
              body.deptname,
              '1',
              body.date);
          }

          this.logger.debug(`진료비계산영수증 = ${JSON.stringify(result)}`);

          if(result != null) {
            if(result.Table0 != null && result.Table0.length > 0) {
              for (const item of result.Table0) {
                for (let el in item) {
                  item[el] = getArrFirstData(item[el]);
                }
              }
            }
            if(result.Table01 != null && result.Table01.length > 0) {
              for (const item of result.Table01) {
                for (let el in item) {
                  item[el] = getArrFirstData(item[el]);
                }
              }
            }
            if(result.Table03 != null && result.Table03.length > 0) {
              for (const item of result.Table03) {
                for (let el in item) {
                  result.Table03[el] = getArrFirstData(item[el]);
                }
              }
            }
            this.logger.debug(`진료비계산영수증2 = ${JSON.stringify(result)}`);


            result = await this.pdfBillInfo(body.his_hsp_tp_cd, body.rcptype, patientInfo, result, password, body.email);
          }
        }
      }
      return result;
    } catch (e) {
      this.logger.error(`제증명 PDF 요청 ERR : ${e}`);
      throw e;
    }
  }

  async getCertificationList(body: CureLinkCertification): Promise<Array<CureLinkCertification>> {
    const result = [] as Array<CureLinkCertification>;

    const medicalFormList: Array<CrtfMedicalFormDto> = await this.getMedicalFormInfoList({
      his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
      in_pt_no: body.pat_no
    });

    // if(medicalFormList == null){
    //   return result;
    // }
    let certSeq = 0;


    try {
      for (let i = 0; i < medicalFormList.length; i++) {
        // 진단서/소견서 목록
        let fromDate = Number(body.fromdate.replace("-", ""));
        let toDate = Number(body.todate.replace("-", ""));
        let certDate = Number(medicalFormList[i].rec_dtm.replace("-", ""));

        if (certDate < fromDate || certDate > toDate) continue;

        const tmpObj = {
          certSeq: certSeq++,
          hospital: "EUMC",
          his_hsp_tp_cd: body.his_hsp_tp_cd,
          pat_no: body.pat_no,
          fromdate: body.fromdate,
          todate: body.todate,
          deptCode: DepartmentType.getTypeByDeptName(body.his_hsp_tp_cd, medicalFormList[i].pt_med_dept_nm).code,// service call
          meddept: medicalFormList[i].pt_med_dept_nm,
          certDate: medicalFormList[i].rec_dtm,
          certPrice: CommonCodeConst.CERTIFICATION_PRICE_MEDICAL_INFORMATION
        } as CureLinkCertification;

        let dummies = [
          medicalFormList[i].mdfm_cls_dtl_cd,
          medicalFormList[i].mdr_id
        ];
        //crtfSelectMedicalFormInfos.get(i).getMdfm_cls_dtl_cd
        //crtfSelectMedicalFormInfos.get(i).getMdr_id();
        tmpObj.dummies = dummies[0];
        tmpObj.dummyData = dummies[1];

        // 소견서
        if (dummies[0] == "00107") {
          tmpObj.certCode = CurelinkType.OPINION.code;
          tmpObj.certName = CurelinkType.OPINION.name;
        }
        // 진단서
        else {
          tmpObj.certCode = CurelinkType.DIAGNOSIS.code;
          tmpObj.certName = CurelinkType.DIAGNOSIS.name;
        }

        result.push(tmpObj);
      }
    } catch (e) {
      this.logger.error(e);
    }


    /**
     * his_hsp_tp_cd: string;
     *   pt_no: string;
     *   fromdate: string;
     *   todate: string;
     *   meddept: string;
     */

      //   certSeq = 0;
    const ctfsAdsInfoList: Array<CtfsAdsInfoDto> = await this.getAdsinfom({
        his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
        pt_no: body.pat_no,
        fromdate: body.fromdate,
        todate: body.todate,
        meddept: ""
      } as ReqInternetCtfsAdsInfom);

    // 입퇴원확인서
    try {
      for (let i = 0; i < ctfsAdsInfoList.length; i++) {

        const tmpObj = {
          certSeq: certSeq++,
          hospital: "EUMC",
          his_hsp_tp_cd: body.his_hsp_tp_cd,
          pat_no: body.pat_no,
          fromdate: body.fromdate,
          todate: body.todate,
          deptCode: DepartmentType.getTypeByDeptName(body.his_hsp_tp_cd, ctfsAdsInfoList[i].outdeptname).code,// service call
          meddept: ctfsAdsInfoList[i].outdeptname,
          certDate: ctfsAdsInfoList[i].inoutdate
            .replace("년", "-").replace("월", "-")
            .replace("일", "").replace(" ", ""),
          certPrice: CommonCodeConst.CERTIFICATION_PRICE_ADS_INFORMATION
        } as CureLinkCertification;

        tmpObj.dummies = null;
        tmpObj.dummyData = null;

        tmpObj.certCode = CurelinkType.IN_CONFIRMATION.code;
        tmpObj.certName = CurelinkType.IN_CONFIRMATION.name;

        result.push(tmpObj);
      }
    } catch (e) {
      this.logger.error(e);
    }


    // 진료비납입확인서(연말정산용) (선택한 기간 전체를 한 건으로 표기)
    // certSeq = 0;
    const mcsPymCfmtList: Array<McstPymcFmtDto> = await this.getMcsPymCfmt({
      his_hsp_tp_cd: body.his_hsp_tp_cd, // 병원코드
      pt_no: body.pat_no,
      fromdate: body.fromdate,
      todate: body.todate
    } as ReqInternetMcstPymcFmt);

    try {
      for (let i = 0; i < mcsPymCfmtList.length; i++) {
        const tmpObj = {
          certSeq: certSeq++,
          hospital: "EUMC",
          his_hsp_tp_cd: body.his_hsp_tp_cd,
          pat_no: body.pat_no,
          fromdate: body.fromdate,
          todate: body.todate,
          certName: CurelinkType.PAYMENT_CONFIRMATION.name,
          certCode: CurelinkType.PAYMENT_CONFIRMATION.code,
          deptCode: "",
          meddept: "",
          certPrice: CommonCodeConst.CERTIFICATION_PRICE_PAYMENT_INFORMATION,
          dummyData: null
        } as CureLinkCertification;

        result.push(tmpObj);
      }
    } catch (e) {
      this.logger.error(e);
    }

    // 통원진료확인서
    //  certSeq = 0;
    const ctfsOtptInfomList: Array<CtfsOtptInfoDto> = await this.getCtfsOtptInfom({
      his_hsp_tp_cd: body.his_hsp_tp_cd,
      pt_no: body.pat_no,
      fromdate: body.fromdate,
      todate: body.todate,
      meddept: body.meddept
    } as ReqInternetCtfsOtptInfom);
    try {
      for (let i = 0; i < ctfsOtptInfomList.length; i++) {
        const tmpObj = {
          certSeq: certSeq++,
          hospital: "EUMC",
          his_hsp_tp_cd: body.his_hsp_tp_cd,
          pat_no: body.pat_no,
          fromdate: body.fromdate,
          todate: body.todate,
          certName: CurelinkType.OUT_CONFIRMATION.name,
          certCode: CurelinkType.OUT_CONFIRMATION.code,
          deptCode: DepartmentType.getTypeByDeptName(body.his_hsp_tp_cd, ctfsOtptInfomList[i].deptname).code,
          meddept: "",
          certPrice: CommonCodeConst.CERTIFICATION_PRICE_OTPT_INFORMATION,
          dummies: null
        } as CureLinkCertification;

        result.push(tmpObj);
      }
    } catch (e) {
      this.logger.error(e);
    }


    // 진료비세부내역서(입원)
    // certSeq = 0;
    try {
      for (let i = 0; i < ctfsAdsInfoList.length; i++) {
        body.adsdate = ctfsAdsInfoList[i].inoutdate.replace("년", "").replace("월", "").replace("일", "").replace(" ", "").substring(0, 8);

        const respList
          = await this.kioskWebServiceApiService.getMcsPymCfmtDtl(body.his_hsp_tp_cd, body.pat_no, body.fromdate, body.todate);
        let billServiceList = respList.string.NewDataSet[0].Table0;

        for (let j = 0; j < billServiceList.length; j++) {
          for (let el in billServiceList[j]) {
            billServiceList[j][el] = getArrFirstData(billServiceList[j][el]);
          }
          const tmpObj = {
            certSeq: certSeq++,
            hospital: "EUMC",
            his_hsp_tp_cd: body.his_hsp_tp_cd,
            pat_no: body.pat_no,
            fromdate: body.fromdate,
            todate: body.todate,
            deptCode: billServiceList[j].MED_DEPT_CD,// service call
            meddept: DepartmentType.getTypeByDeptCode(body.his_hsp_tp_cd, billServiceList[j].MED_DEPT_CD).name,
            certDate: ctfsAdsInfoList[i].inoutdate
              .replace("년", "-").replace("월", "-")
              .replace("일", "").replace(" ", ""),
            certPrice: CommonCodeConst.CERTIFICATION_PRICE_PAYMENT_DETAIL_INFORMATION
          } as CureLinkCertification;

          tmpObj.dummies = JSON.stringify([
            "",
            billServiceList[j].RPY_PACT_ID
          ]);
          tmpObj.dummyData = billServiceList[j].RPY_PACT_ID;

          tmpObj.certCode = CurelinkType.PAYMENT_DETAIL_IN.code;
          tmpObj.certName = CurelinkType.PAYMENT_DETAIL_IN.name;

          result.push(tmpObj);
        }


      }
    } catch (e) {
      this.logger.error(e);
    }

    // certSeq = 0;
    try {
      // 진료비세부내역서(외래) (선택한 기간 전체를 한 건으로 표기)
      const mcstDtOPtclFomsList = await this.getMcstDtOPtclFom({
        his_hsp_tp_cd: body.his_hsp_tp_cd,
        pt_no: body.pat_no,
        fromdate: body.fromdate,
        todate: body.todate,
        meddept: body.meddept
      } as ReqInternetMcstDtoPtclFom) as Array<McstDtoPtclInfoDto>;

      for (let i = 0; i < mcstDtOPtclFomsList.length; i++) {
        const tmpObj = {
          certSeq: certSeq++,
          hospital: "EUMC",
          his_hsp_tp_cd: body.his_hsp_tp_cd,
          pat_no: body.pat_no,
          fromdate: body.fromdate,
          todate: body.todate,
          deptCode: null,// service call
          meddept: null,
          certPrice: CommonCodeConst.CERTIFICATION_PRICE_PAYMENT_DETAIL_INFORMATION
        } as CureLinkCertification;

        tmpObj.dummyData = null;
        tmpObj.certCode = CurelinkType.PAYMENT_DETAIL_OUT.code;
        tmpObj.certName = CurelinkType.PAYMENT_DETAIL_OUT.name;

        result.push(tmpObj);
      }
    } catch (e) {

    }
    return result;
  }


  async getCertificationList_USE(his_hsp_tp_cd: string, pt_no: string, fromdate: string, todate: string, meddept: string): Promise<Array<CertList>> {
    const result = [] as Array<CertList>;

    const patient_info = await this.patientApiService.getPatientInfo(pt_no);


    const medicalFormList: Array<CrtfMedicalFormDto> = await this.getMedicalFormInfoList({
      his_hsp_tp_cd: his_hsp_tp_cd, // 병원코드
      in_pt_no: pt_no
    });

    if(medicalFormList != null) {
      for (const crtfMedicalFormDto of medicalFormList) {
        try{
          let certName = crtfMedicalFormDto.mdfm_cls_nm.trim();
          if(certName == '진단서 국문') {
            certName = '일반진단서[재발급]';
          }else if(certName == '소견서') {
            certName = '소견서[재발급]';
          }

          let certDate = crtfMedicalFormDto.rec_dtm.trim();
          if(Number(fromdate) <= Number(certDate) && Number(todate) >= Number(certDate)) {
            result.push({
              certname: certName,
              deptname: crtfMedicalFormDto.pt_med_dept_nm,
              date: crtfMedicalFormDto.rec_dtm,
              his_hsp_tp_cd: his_hsp_tp_cd,
              fromdate: fromdate,
              todate: todate,
              price: '1000',
              data: crtfMedicalFormDto.mdr_id
            } as CertList);
          }
        }catch (e) {
          this.logger.error(`진단/소견서 조회 에러 : ${e}`);
        }
      }
    }




    /**
     * his_hsp_tp_cd: string;
     *   pt_no: string;
     *   fromdate: string;
     *   todate: string;
     *   meddept: string;
     */

      //   certSeq = 0;
    const ctfsAdsInfoList: Array<CtfsAdsInfoDto> = await this.getAdsinfom({
        his_hsp_tp_cd: his_hsp_tp_cd, // 병원코드
        pt_no: pt_no,
        fromdate: fromdate,
        todate: todate,
        meddept: meddept,
        password: patient_info.birth.substring(0, 6)
      } as ReqInternetCtfsAdsInfom);

    // 입퇴원확인서
    try {
      if(ctfsAdsInfoList != null && ctfsAdsInfoList.length > 0) {
        result.push({
          his_hsp_tp_cd: his_hsp_tp_cd,
          fromdate: fromdate,
          todate: todate,
          certname: '입퇴원 사실 확인서',
          deptname: '',
          date: '',
          price: '3000',
          data: ''
        } as CertList)
      }
    } catch (e) {
      this.logger.error(`입퇴원 확인서 조회 에러 : ${e}`);
    }


    // 진료비납입확인서(연말정산용) (선택한 기간 전체를 한 건으로 표기)
    // certSeq = 0;
    const mcsPymCfmtList: Array<McstPymcFmtDto> = await this.getMcsPymCfmt({
      his_hsp_tp_cd: his_hsp_tp_cd, // 병원코드
      pt_no: pt_no,
      fromdate: fromdate,
      todate: todate
    } as ReqInternetMcstPymcFmt);
    try {
      if(mcsPymCfmtList != null && mcsPymCfmtList.length > 0) {
        result.push({
          his_hsp_tp_cd: his_hsp_tp_cd,
          fromdate: fromdate,
          todate: todate,
          certname: '진료비 납입 확인서(연말정산용)',
          deptname: '',
          date: '',
          price: '0',
          data: ''
        } as CertList)
      }
    } catch (e) {
      this.logger.error(`진료비납입확인서(연말정산용) 조회 에러 : ${e}`);
    }

    // 통원진료확인서
    const ctfsOtptInfomList: Array<CtfsOtptInfoDto> = await this.getCtfsOtptInfom({
      his_hsp_tp_cd: his_hsp_tp_cd,
      pt_no: pt_no,
      fromdate: fromdate,
      todate: todate,
      meddept: '',
      password: patient_info.birth.substring(0, 6)
    } as ReqInternetCtfsOtptInfom);
    try {
      if(ctfsOtptInfomList != null && ctfsOtptInfomList.length > 0) {
        result.push({
          his_hsp_tp_cd: his_hsp_tp_cd,
          fromdate: fromdate,
          todate: todate,
          certname: '통원진료확인서',
          deptname: '',
          date: '',
          price: '3000',
          data: ''
        } as CertList)
      }
    } catch (e) {
      this.logger.error(`진료비납입확인서(연말정산용) 조회 에러 : ${e}`);
    }

    //
    // // 진료비세부내역서(입원)
    // // certSeq = 0;
    // try {
    //   for (let i = 0; i < ctfsAdsInfoList.length; i++) {
    //     body.adsdate = ctfsAdsInfoList[i].inoutdate.replace("년", "").replace("월", "").replace("일", "").replace(" ", "").substring(0, 8);
    //
    //     const respList
    //       = await this.kioskWebServiceApiService.getMcsPymCfmtDtl(body.his_hsp_tp_cd, body.pat_no, body.fromdate, body.todate);
    //     let billServiceList = respList.string.NewDataSet[0].Table0;
    //
    //     for (let j = 0; j < billServiceList.length; j++) {
    //       for (let el in billServiceList[j]) {
    //         billServiceList[j][el] = getArrFirstData(billServiceList[j][el]);
    //       }
    //       const tmpObj = {
    //         certSeq: certSeq++,
    //         hospital: "EUMC",
    //         his_hsp_tp_cd: body.his_hsp_tp_cd,
    //         pat_no: body.pat_no,
    //         fromdate: body.fromdate,
    //         todate: body.todate,
    //         deptCode: billServiceList[j].MED_DEPT_CD,// service call
    //         meddept: DepartmentType.getTypeByDeptCode(body.his_hsp_tp_cd, billServiceList[j].MED_DEPT_CD).name,
    //         certDate: ctfsAdsInfoList[i].inoutdate
    //           .replace("년", "-").replace("월", "-")
    //           .replace("일", "").replace(" ", ""),
    //         certPrice: CommonCodeConst.CERTIFICATION_PRICE_PAYMENT_DETAIL_INFORMATION
    //       } as CureLinkCertification;
    //
    //       tmpObj.dummies = JSON.stringify([
    //         "",
    //         billServiceList[j].RPY_PACT_ID
    //       ]);
    //       tmpObj.dummyData = billServiceList[j].RPY_PACT_ID;
    //
    //       tmpObj.certCode = CurelinkType.PAYMENT_DETAIL_IN.code;
    //       tmpObj.certName = CurelinkType.PAYMENT_DETAIL_IN.name;
    //
    //       result.push(tmpObj);
    //     }
    //
    //
    //   }
    // } catch (e) {
    //   this.logger.error(e);
    // }

    try {
      // 진료비세부내역서(외래) (선택한 기간 전체를 한 건으로 표기)
      const mcstDtOPtclFomsList = await this.getMcstDtOPtclFom({
        his_hsp_tp_cd: his_hsp_tp_cd,
        pt_no: pt_no,
        fromdate: fromdate,
        todate: todate,
        meddept: meddept,
        password: patient_info.birth.substring(0, 6)
      } as ReqInternetMcstDtoPtclFom) as Array<McstDtoPtclInfoDto>;

      try {
        if(mcstDtOPtclFomsList != null && mcstDtOPtclFomsList.length > 0) {
          result.push({
            his_hsp_tp_cd: his_hsp_tp_cd,
            fromdate: fromdate,
            todate: todate,
            certname: '진료비 세부 내역서(외래)',
            deptname: '',
            date: `~ ${moment(todate).format('yyyy년 MM월 DD일')}`,
            price: '0',
            data: ''
          } as CertList)
        }
      } catch (e) {
        this.logger.error(`진료비세부내역서(외래) 조회 에러 : ${e}`);
      }
    } catch (e) {
      this.logger.error(``)
      throw e;
    }
    return result;
  }




  async reqMedicalFormInfo(body: ReqInternetCrtfSelectMedicalFormInfo): Promise<MedicalCertificate | MedicalOpinion> {
    this.logger.error(`진단서/소견서 요청 START ${body}`);
    try {
      const resp = await this.emrSoapApiService.internetCrtfSelectMedicalFormInfo(body);

      let result = resp.Table;

      if (result != null) {
        result.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
        });
      }

      result = result[0];


      // 진단서 타입
      if (body.mdfm_cls_dtl_cd == this.MEDICAL_FORM_CD_JINDAN) {
        return {
          pt_no: result.PT_NO,
          pt_nm: result.PT_NM,
          rrn1: result.RRN1,
          rrn2: result.RRN2,
          addr: result.ADDR,
          tel: result.TEL,
          dg_option1_yn: result.DG_OPTION1_YN,
          dg_nm: result.DG_NM,
          dsoc_year: result.DSOC_YEAR,
          dsoc_month: result.DSOC_MONTH,
          dsoc_day: result.DSOC_DAY,
          opinion: result.OPINION,
          upur_gov_yn: result.UPUR_GOV_YN,
          upur_etc_yn: result.UPUR_ETC_YN,
          upur_etc_cnte: result.UPUR_ETC_CNTE,
          wrt_year: result.WRT_YEAR,
          wrt_month: result.WRT_MONTH,
          wrt_day: result.WRT_DAY,
          mdins_nm: result.MDINS_NM,
          mdins_addr: result.MDINS_ADDR,
          doc_yn: result.DOC_YN,
          lcns_no: result.LCNS_NO,
          wrtr_nm: result.WRTR_NM,
          dgns_rer_rcdc_no: result.DGNS_RER_RCDC_NO
        } as MedicalCertificate;
      }
      // 소견서 타입
      else {
        return {
          pt_no: result.PT_NO,
          pt_nm: result.PT_NM,
          rrn1: result.RRN1,
          rrn2: result.RRN2,
          addr: result.ADDR,
          tel: result.TEL,
          dg_nm: result.DG_NM,
          i_chk: result.I_CHK,
          o_from_dt: result.O_FROM_DT,
          pasthistory: result.PASTHISTORY,
          result: result.RESULT,
          opinion: result.OPINION,
          upur_iscm_yn: result.UPUR_ISCM_YN,
          rmk: result.RMK,
          wrt_year: result.WRT_YEAR,
          wrt_month: result.WRT_MONTH,
          wrt_day: result.WRT_DAY,
          lcns_no: result.LCNS_NO,
          wrtr_nm: result.WRTR_NM,
          mdins_addr: result.MDINS_ADDR,
          mdins_nm: result.MDINS_NM,
          dgns_rer_rcdc_no: result.DGNS_RER_RCDC_NO
        } as MedicalOpinion;
      }
    } catch (e) {
      this.logger.error(`진단서/소견서 요청 ERR : ${e}`);
      throw e;
    }
  }


  async reqMedicalFormInfoPDF(paitentInfo: PatientInfo, body: ReqInternetCrtfSelectMedicalFormInfo, email: string, password: string) {
    this.logger.error(`진단서/소견서 요청 START ${body}`);
    try {
      const result = await this.reqMedicalFormInfo(body);

      // 진단서 타입
      if (body.mdfm_cls_dtl_cd == this.MEDICAL_FORM_CD_JINDAN) {
        return await this.pdfMedicalCertificate(body.his_hsp_tp_cd, paitentInfo, result as MedicalCertificate, password, email);
      }
      // 소견서 타입
      else {
        return await this.pdfMedicalOpinion(body.his_hsp_tp_cd, paitentInfo, result as MedicalOpinion, password, email);
      }
    } catch (e) {
      this.logger.error(`진단서/소견서 요청 ERR : ${e}`);
      throw e;
    }
  }

  async sendMedicalCertificate(medicalCert: MedicalCertificate, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + medicalCert.pt_no, PDF_GEN_API_TYPE.JINDAN + now);
      const fileName = now + medicalCert.pt_no;


      this.logger.debug("[진단서 발급시작] - [환자번호 : " + medicalCert.dg_nm + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.JINDAN, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(medicalCert)
      });

      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 진단서] - [resultCode :" + resultPDF + "] - 성공");
        return await this.sendCertificateMail(email, fileName, "진단서");
      } else { // 실패
        this.logger.error("[MAKE_PDF : 진단서] - [resultCode :" + resultPDF + "] - 실패");
        throw `진단서 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`진단서 요청 ERR : ${e}`);
      throw e;
    }
  }


  async sendMedicalOpinion(medicalCert: MedicalOpinion, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + medicalCert.pt_no, PDF_GEN_API_TYPE.SOGYEONSEO  + now);
      const fileName = now + medicalCert.pt_no;

      this.logger.debug("[소견서 발급시작] - [환자번호 : " + medicalCert.dg_nm + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.SOGYEONSEO, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(medicalCert)
      });

      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 소견서] - [resultCode :" + resultPDF + "] - 성공");
        return await this.sendCertificateMail(email, fileName, "소견서");
      } else { // 실패
        this.logger.error("[MAKE_PDF : 소견서] - [resultCode :" + resultPDF + "] - 실패");
        throw `소견서 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`소견서 요청 ERR : ${e}`);
      throw e;
    }
  }


  async pdfMedicalCertificate(his_hsp_tp_cd: string, paitentInfo: PatientInfo, medicalCert: MedicalCertificate, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + medicalCert.pt_no, PDF_GEN_API_TYPE.JINDAN + now);
      const fileName = now + medicalCert.pt_no;

      this.logger.debug("[진단서 발급시작] - [환자번호 : " + medicalCert.dg_nm + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.JINDAN, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(medicalCert),

        his_hsp_tp_cd: his_hsp_tp_cd,
        hospital_name: his_hsp_tp_cd == "01" ? "이화여자대학교 의과대학부속 서울병원" : "이화여자대학교 의과대학부속 목동병원",
        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        rrn1: paitentInfo.resno1,//.replace('-','').substring(0, 6),

        address: medicalCert.addr.replace("(", "\n("),
        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + medicalCert.pt_nm + "|" + medicalCert.pt_no + "|" + medicalCert.rrn1 + "-" + medicalCert.rrn2 + "|" + JSON.stringify(medicalCert);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 진단서] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "일반진단서[재발급]",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`진단서 발급데이터 DB저장 ERR : ${e}`);
          throw `진단서 발급데이터 DB저장 ERR : ${e}`;
        }


        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })

        return newOne;
      } else { // 실패
        this.logger.error("[MAKE_PDF : 진단서] - [resultCode :" + resultPDF + "] - 실패");
        throw `진단서 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`소견서 요청 ERR : ${e}`);
      throw e;
    }
  }




  async pdfMedicalOpinion(his_hsp_tp_cd: string, paitentInfo: PatientInfo,medicalOpinion: MedicalOpinion, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + medicalOpinion.pt_no, PDF_GEN_API_TYPE.SOGYEONSEO + now);
      const fileName = now + medicalOpinion.pt_no;

      this.logger.debug("[소견서 발급시작] - [환자번호 : " + medicalOpinion.dg_nm + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.SOGYEONSEO, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(medicalOpinion),

        hospital_name: his_hsp_tp_cd == "01" ? "이화여자대학교 의과대학부속 서울병원" : "이화여자대학교 의과대학부속 목동병원",
        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        rrn1: paitentInfo.resno1,//.replace('-','').substring(0, 6),

        his_hsp_tp_cd: his_hsp_tp_cd,
        address: medicalOpinion.addr.replace("(", "\n("),
        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + medicalOpinion.pt_nm + "|" + medicalOpinion.pt_no + "|" + medicalOpinion.rrn1 + "-" + medicalOpinion.rrn2 + "|" + JSON.stringify(medicalOpinion);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 소견서] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "소견서[재발급]",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`소견서 발급데이터 DB저장 ERR : ${e}`);
          throw `진단서 발급데이터 DB저장 ERR : ${e}`;
        }

        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })
        return newOne;

      } else { // 실패
        this.logger.error("[MAKE_PDF : 진단서] - [resultCode :" + resultPDF + "] - 실패");
        throw `진단서 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`소견서 요청 ERR : ${e}`);
      throw e;
    }
  }



  // 입퇴원확인서
  async pdfAdsInfom(his_hsp_tp_cd: string, paitentInfo: PatientInfo, arrCtfsAdsInfom: Array<CtfsAdsInfoDto>, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + paitentInfo.out_pt_no, PDF_GEN_API_TYPE.IN_OUT_CERT + now);
      const fileName = now + paitentInfo.out_pt_no;

      this.logger.debug("[입퇴원확인서 발급시작] - [환자번호 : " + paitentInfo.out_pt_no + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");


      const securityData = fileCode + "|" + fileName + "|" + paitentInfo.out_patname + "|" + paitentInfo.out_pt_no + "|" + paitentInfo.birth.replace('-','').substring(0, 6) + "-" + paitentInfo.birth.replace('-','').substring(6) + "|" + JSON.stringify(arrCtfsAdsInfom);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }


      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.IN_OUT_CERT, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(arrCtfsAdsInfom),

        his_hsp_tp_cd: his_hsp_tp_cd,
        hospital_name: his_hsp_tp_cd == "01" ? "이화여자대학교 의과대학부속 서울병원" : "이화여자대학교 의과대학부속 목동병원",
        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        rrn1: paitentInfo.resno1,//.replace('-','').substring(0, 6),

        qrName: fileCode,
        password: password
      });

      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 입퇴원확인서] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "입퇴원확인서",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`입퇴원확인서 발급데이터 DB저장 ERR : ${e}`);
          throw `입퇴원확인서 발급데이터 DB저장 ERR : ${e}`;
        }

        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })

        return newOne;
      } else { //실패
        this.logger.error("[MAKE_PDF : 입퇴원확인서] - [resultCode :" + resultPDF + "] - 실패");
        throw `입퇴원확인서 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`입퇴원확인서 요청 ERR : ${e}`);
      throw e;
    }
  }



  // 통원진료확인서
  async pdfCtfsOtptInfom(his_hsp_tp_cd: string, paitentInfo: PatientInfo, arrCtfsAdsInfom: Array<CtfsOtptInfoDto>, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + paitentInfo.out_pt_no, PDF_GEN_API_TYPE.TONGWON_CERT + now);
      const fileName = now + paitentInfo.out_pt_no;

      this.logger.debug("[통원진료확인서 발급시작] - [환자번호 : " + paitentInfo.out_pt_no + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.TONGWON_CERT, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(arrCtfsAdsInfom).replace("\\r", ""),

        his_hsp_tp_cd: his_hsp_tp_cd,
        hospital_name: his_hsp_tp_cd == "01" ? "이화여자대학교 의과대학부속 서울병원" : "이화여자대학교 의과대학부속 목동병원",
        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        rrn1: paitentInfo.resno1,//.replace('-','').substring(0, 6),
        rrn2: paitentInfo.birth.replace('-','').substring(6),

        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + paitentInfo.out_patname + "|" + paitentInfo.out_pt_no + "|" + paitentInfo.birth.replace('-','').substring(0, 6) + "-" + paitentInfo.birth.replace('-','').substring(6) + "|" + JSON.stringify(arrCtfsAdsInfom);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 통원진료확인서] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "통원진료확인서",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`통원진료확인서 발급데이터 DB저장 ERR : ${e}`);
          throw `통원진료확인서 발급데이터 DB저장 ERR : ${e}`;
        }


        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
            this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })
        return newOne;

      } else { // 실패
        this.logger.error("[MAKE_PDF : 입퇴원확인서] - [resultCode :" + resultPDF + "] - 실패");
        throw `입퇴원확인서 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`통원진료확인서 요청 ERR : ${e}`);
      throw e;
    }
  }



  // 진료비납입확인서(연말정산용)
  async pdfMcstPymCfmt(his_hsp_tp_cd: string, paitentInfo: PatientInfo, arrMcstMcstPymCfmt: Array<McstPymcFmtDto>, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      const fileCode = await this.generateFileCode("EUMC" + paitentInfo.out_pt_no, PDF_GEN_API_TYPE.MEDICAL_PAY_CERT + now);
      const fileName = now + paitentInfo.out_pt_no;

      this.logger.debug("[진료비납입확인서(연말정산용) 발급시작] - [환자번호 : " + paitentInfo.out_pt_no + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");


      let companyNumber = "";
      let hospitalName = "";
      let hospitalAddress = "";
      let ownerName = "";

      if(his_hsp_tp_cd == "01"){
        companyNumber = "366-82-00250";
        hospitalName = "이화여자대학교 의과대학부속 서울병원";
        hospitalAddress = "서울특별시 강서구 공항대로 260";
        ownerName = "유 경 하";
      }
      else{
        companyNumber = "117-82-01074";
        hospitalName = "이화여자대학교 의과대학부속 목동병원";
        hospitalAddress = "서울특별시 양천구 안양천로 1071";
        ownerName = "유 경 하";
      }


      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.MEDICAL_PAY_CERT, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(arrMcstMcstPymCfmt),

        his_hsp_tp_cd: his_hsp_tp_cd,

        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        rrn1: paitentInfo.resno1,//.replace('-','').substring(0, 6),
        rrn2: paitentInfo.birth.replace('-','').substring(6),

        companyNumber: companyNumber,
        hospitalName: hospitalName,
        hospitalAddress: hospitalAddress,
        ownerName: ownerName,

        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + paitentInfo.out_patname + "|" + paitentInfo.out_pt_no + "|" + paitentInfo.birth.replace('-','').substring(0, 6) + "-" + paitentInfo.birth.replace('-','').substring(6) + "|" + JSON.stringify(arrMcstMcstPymCfmt);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 진료비납입확인서(연말정산용)] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "진료비납입확인서(연말정산용)",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`진료비납입확인서(연말정산용) 발급데이터 DB저장 ERR : ${e}`);
          throw `진료비납입확인서(연말정산용) 발급데이터 DB저장 ERR : ${e}`;
        }

        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })
        return newOne;
      } else { // 실패
        this.logger.error("[MAKE_PDF : 진료비납입확인서(연말정산용)] - [resultCode :" + resultPDF + "] - 실패");
        throw `진료비납입확인서(연말정산용) 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`진료비납입확인서(연말정산용) 요청 ERR : ${e}`);
      throw e;
    }
  }


  // 진료비세부내역서(입원)
  async pdfMcstDtlPtclFom(his_hsp_tp_cd: string, paitentInfo: PatientInfo, arrMcstDtlPtclFom: Array<McstDtlPtclInfoDto>, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      //FIXME: 파일경로의 문자열과 다름.......... 하..
      const fileCode = await this.generateFileCode("EUMC" + paitentInfo.out_pt_no, PDF_GEN_API_TYPE.MEDICAL_PAY_DTL_IN_CERT + now);
      const fileName = now + paitentInfo.out_pt_no;

      this.logger.debug("[진료비세부내역서(입원) 발급시작] - [환자번호 : " + paitentInfo.out_pt_no + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      for (let i = 0; i < arrMcstDtlPtclFom.length; i++) {
        if(arrMcstDtlPtclFom[i].codename.includes("끝수처리 조정금액")){
          arrMcstDtlPtclFom[i].codename = arrMcstDtlPtclFom[i].codename.replace("끝수처리 조정금액", "합계");
        }
      }


      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.MEDICAL_PAY_DTL_IN_CERT, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(arrMcstDtlPtclFom),

        his_hsp_tp_cd: his_hsp_tp_cd,

        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        hospital_name: his_hsp_tp_cd == "01" ? "이화여자대학교 의과대학부속 서울병원" : "이화여자대학교 의과대학부속 목동병원",
        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + paitentInfo.out_patname + "|" + paitentInfo.out_pt_no + "|" + paitentInfo.birth.replace('-','').substring(0, 6) + "-" + paitentInfo.birth.replace('-','').substring(6) + "|" + JSON.stringify(arrMcstDtlPtclFom);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 진료비세부내역서(입원)] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "진료비세부내역서(입원)",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`진료비세부내역서(입원) 발급데이터 DB저장 ERR : ${e}`);
          throw `진료비세부내역서(입원) 발급데이터 DB저장 ERR : ${e}`;
        }

        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })
        return newOne;

      } else { // 실패
        this.logger.error("[MAKE_PDF : 진료비세부내역서(입원)] - [resultCode :" + resultPDF + "] - 실패");
        throw `진료비세부내역서(입원) 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`진료비세부내역서(입원) 요청 ERR : ${e}`);
      throw e;
    }
  }


  // 진료비세부내역서(외래)
  async pdfMcstDtOPtclFom(his_hsp_tp_cd: string, paitentInfo: PatientInfo, arrMcstDtOPtclFom: Array<McstDtoPtclInfoDto>, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      //FIXME: 파일경로의 문자열과 다름.......... 하..
      const fileCode = await this.generateFileCode("EUMC" + paitentInfo.out_pt_no, PDF_GEN_API_TYPE.MEDICAL_PAY_DTL_OUT_CERT + now);
      const fileName = now + paitentInfo.out_pt_no;

      this.logger.debug("[진료비세부내역서(외래) 발급시작] - [환자번호 : " + paitentInfo.out_pt_no + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");

      for (let i = 0; i < arrMcstDtOPtclFom.length; i++) {
        if(arrMcstDtOPtclFom[i].codename.includes("끝수처리 조정금액")){
          arrMcstDtOPtclFom[i].codename = arrMcstDtOPtclFom[i].codename.replace("끝수처리 조정금액", "합계");
        }
      }


      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.MEDICAL_PAY_DTL_OUT_CERT, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: JSON.stringify(arrMcstDtOPtclFom),

        his_hsp_tp_cd: his_hsp_tp_cd,

        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        hospital_name: his_hsp_tp_cd == "01" ? "이화여자대학교 의과대학부속 서울병원" : "이화여자대학교 의과대학부속 목동병원",
        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + paitentInfo.out_patname + "|" + paitentInfo.out_pt_no + "|" + paitentInfo.birth.replace('-','').substring(0, 6) + "-" + paitentInfo.birth.replace('-','').substring(6) + "|" + JSON.stringify(arrMcstDtOPtclFom);

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 진료비세부내역서(외래)] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "진료비세부내역서(외래)",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);

        } catch (e) {
          this.logger.error(`진료비세부내역서(외래) 발급데이터 DB저장 ERR : ${e}`);
          throw `진료비세부내역서(외래) 발급데이터 DB저장 ERR : ${e}`;
        }

        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })
        return newOne;

      } else { // 실패
        this.logger.error("[MAKE_PDF : 진료비세부내역서(외래)] - [resultCode :" + resultPDF + "] - 실패");
        throw `진료비세부내역서(외래) 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`진료비세부내역서(입원) 요청 ERR : ${e}`);
      throw e;
    }
  }



  // 영수증
  async pdfBillInfo(his_hsp_tp_cd: string, rcptype: string, paitentInfo: PatientInfo, data: string, password: string, email: string) {
    try {
      const now = moment().format("yyyyMMDDHHmmss");
      //FIXME: 파일경로의 문자열과 다름.......... 하..
      const fileCode = await this.generateFileCode("EUMC" + paitentInfo.out_pt_no, PDF_GEN_API_TYPE.BILL_INFO + now);
      const fileName = now + paitentInfo.out_pt_no;

      this.logger.debug("[영수증 발급시작] - [환자번호 : " + paitentInfo.out_pt_no + "] - [fileName : " + fileName + "] - [fileCopde : " + fileCode + "]");


      const resultPDF = await this.pdfGenerateService.reqMakeCertPdf(PDF_GEN_API_TYPE.BILL_INFO, {
        fileCode: fileCode,
        fileName: fileName,
        pdfInfo: data,
        his_hsp_tp_cd: his_hsp_tp_cd,
        pat_nm: paitentInfo.out_patname,
        pat_no: paitentInfo.out_pt_no,
        rcptype: rcptype,
        qrName: fileCode,
        password: password
      });

      const securityData = fileCode + "|" + fileName + "|" + paitentInfo.out_patname + "|" + paitentInfo.out_pt_no + "|" + paitentInfo.birth.replace('-','').substring(0, 6) + "-" + paitentInfo.birth.replace('-','').substring(6) + "|" + data;

      const key = this.cryUtil.generateRandomString(32);
      const encoded = this.cryUtil.encodeAesToBase64WithKey(securityData, key);

      const qrCode = "CURE" + this.cryUtil.generateRandomString(30) + fileCode.replace("-", "").substring(0, 8)
        + key + fileCode.replace("-", "").substring(8, 16) + this.cryUtil.generateRandomString(30);

//             qrgen 정보 가로 세로 저장경로+이름
      try {
        const qrResult = await this.imgUtil.generateQRCodeImage(qrCode, CommonCodeConst.QR_CODE_FILE_PATH + '/' + fileCode + ".png");
      } catch (e) {
        this.logger.error(e);
      }
      if (resultPDF != null && resultPDF != '') { // 성공
        this.logger.debug("[MAKE_PDF : 영수증] - [resultCode :" + resultPDF + "] - 성공");

        // // db 저장
        let newOne = {
          file_code: fileCode,
          cert_type: "진료비계산영수증",
          data: encoded
        } as EumcCertEumcEntity;

        try {
          await this.certEumcEntityRepo.save(newOne);
        } catch (e) {
          this.logger.error(`영수증 발급데이터 DB저장 ERR : ${e}`);
          throw `영수증 발급데이터 DB저장 ERR : ${e}`;
        }

        let sub = await this.sendCertificateMailPDF(his_hsp_tp_cd, email, resultPDF, newOne.cert_type)
        sub.subscribe(email_sended=>{
          this.logger.error(`진단서 발급데이터 이메일 전송 결과 : ${JSON.stringify(email_sended.data)}`);
        })

        return newOne;

      } else { // 실패
        this.logger.error("[MAKE_PDF : 진료비세부내역서(외래)] - [resultCode :" + resultPDF + "] - 실패");
        throw `영수증 발급 실패 resultCode : ${resultPDF}`;
      }
    } catch (e) {
      this.logger.error(`영수증 요청 ERR : ${e}`);
      throw e;
    }
  }











  makeFileName(patNo: string) {
    return moment().format("yyyyMMDDHHmmss") + patNo;
  }

  //TODO: 아래 코드 참고하여 구현
  async generateFileCode(str1: string, str2: string): Promise<string> {
    let no = 0;
    let result = '';

    let base1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'A'];
    let base2 = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
    let base3 = ['M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'];
    let base4 = ['X', 'Y', 'Z', '9', 'K', '6', 'J', '3', 'S', 'H'];

    let text1 = Math.abs(stringHashCode(str1)) + '';
    let text2 = Math.abs(stringHashCode(str2)) + '';
    let str_ = text1.substring(0, 8) + text2.substring(0, 8);

    for (let i = 0; i < str_.length; i++) {
      let j = "" + str_.charAt(i);

      if (no == 0) {
        result = result + base1[Number(j)];
        no = 1;
      } else if (no == 1) {
        result = result + base2[Number(j)];
        no = 2;
      } else if (no == 2) {
        result = result + base3[Number(j)];
        no = 3;
      } else if (no == 3) {
        result = result + base4[Number(j)] + "-";
        no = 0;
      }
    }
    result = result.substring(0, 19);
    return result;
  }

//
//   private String convert(String str1, String str2) {
//   no = 0;
//   String result = "";
//
//   char[] base1 = new char[]{'1', '2', '3', '4', '5', '6', '7', '8', '9', 'A'};
// char[] base2 = new char[]{'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'};
// char[] base3 = new char[]{'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'};
// char[] base4 = new char[]{'X', 'Y', 'Z', '9', 'K', '6', 'J', '3', 'S', 'H'};
//
// System.out.println(String.valueOf((str1.getBytes()).hashCode()));
// String str_ = String.valueOf((str1.getBytes()).hashCode()).substring(0, 8) + String.valueOf((str2.getBytes()).hashCode()).substring(0, 8);
// for (int i = 0; i < str_.length(); i++) {
//
//   String j = "" + str_.charAt(i);
//
//   if (no == 0) {
//     result = result + base1[Integer.parseInt(j)];
//     no = 1;
//   } else if (no == 1) {
//     result = result + base2[Integer.parseInt(j)];
//     no = 2;
//   } else if (no == 2) {
//     result = result + base3[Integer.parseInt(j)];
//     no = 3;
//   } else if (no == 3) {
//     result = result + base4[Integer.parseInt(j)] + "-";
//     no = 0;
//   }
// }
// result = result.substring(0, 19);
//
// System.out.println(result);
//
// return result;
// }

  async getMedicalFormInfo(body: ReqInternetCrtfSelectMedicalFormRecordList, med_dept: string, cert_date: string): Promise<MedicalCertificateInsurance> {
    this.logger.debug(`진단서/소견서 START ${body}`);
    try {
      let list = await this.getMedicalFormInfoList(body);

      // 수납 일자와 진단서 발급 일자가 동일한 케이스만 발급 가능
      let foundOne = list.filter((item) => {
        return (item.pt_med_dept_nm == med_dept
          && item.rec_dtm.replace("-", "").trim() == cert_date);
      }).pop();

      let finalOne = await this.reqMedicalFormInfo({
        his_hsp_tp_cd: body.his_hsp_tp_cd,
        mdrc_id: foundOne.mdr_id.trim(),
        mdfm_cls_dtl_cd: foundOne.mdfm_cls_dtl_cd.trim()
      } as ReqInternetCrtfSelectMedicalFormInfo);

      if (finalOne == null) throw `진단서/소견서 정보 없음`;

      return new MedicalCertificateInsurance(body.his_hsp_tp_cd, body.in_pt_no, med_dept, cert_date, finalOne.dg_nm);
    } catch (e) {
      this.logger.error(`진단서/소견서 ERR : ${e}`);
      throw e;
    }
  }


  async getMedicalFormInfoList(body: ReqInternetCrtfSelectMedicalFormRecordList): Promise<Array<CrtfMedicalFormDto>> {
    this.logger.debug(`진단서/소견서 목록 START ${body}`);
    const result = [] as Array<CrtfMedicalFormDto>;

    try {
      const resp = await this.emrSoapApiService.internetCrtfSelectMedicalRecordList(body as ReqInternetCrtfSelectMedicalFormRecordList);
      const processed = resp.Table;

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
          let tmp = {
            // @ts-ignore
            mdfm_cls_nm: data.MDFM_CLS_NM,
            // @ts-ignore
            mdfm_cls_dtl_cd: data.MDFM_CLS_DTL_CD,
            // @ts-ignore
            mdr_id: data.MDR_ID,
            // @ts-ignore
            rec_dtm: data.REC_DTM,
            // @ts-ignore
            pt_med_dept_nm: data.PT_MED_DEPT_NM
          } as CrtfMedicalFormDto;
          result.push(tmp);
        });
      }
    } catch (e) {
      this.logger.error(`진단서/소견서 목록 ERR : ${e}`);
      throw e;
    }
    return result;
  }


  async getAdsinfom(body: ReqInternetCtfsAdsInfom): Promise<Array<CtfsAdsInfoDto>> {
    this.logger.debug(`진단서/소견서 목록 START ${body}`);
    const result = [] as Array<CtfsAdsInfoDto>;

    try {
      const resp = await this.emrSoapApiService.internetCtfsAdsInfom(body as ReqInternetCtfsAdsInfom);
      /**
       * 원본코드에 아래 부분있으나 사용하지 않고 있음
       *   PatientService patientService = new PatientService();
       *   ResponseDTO resPatient = patientService.getPatientInfoRRN(pt_no);
       *   String rrn = "";
       *
       *   if(resPatient.getResultCode().equals(ErrorResult.RESULT_OK.getCode())) {
       *
       *       PatientDTO patientDTO = (PatientDTO) resPatient.getData();
       *
       *       try {
       *           rrn = patientDTO.getBirth();
       *       } catch (Exception e) {
       *
       *       }
       *   }
       */

      const processed = resp.ArrayOfInternetCtfsAdsInfom.InternetCtfsAdsInfom;

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
          let tmp = {
            // @ts-ignore
            indeptname: data.INDEPTNAME,
            // @ts-ignore
            outdeptname: data.OUTDEPTNAME,
            // @ts-ignore
            inoutdate: data.INOUTDATE
          } as CtfsAdsInfoDto;
          result.push(tmp);
        });
      }
    } catch (e) {
      this.logger.error(`진단서/소견서 목록 ERR : ${e}`);
      throw e;
    }
    return result;
  }


  async getMcsPymCfmt(body: ReqInternetMcstPymcFmt): Promise<Array<McstPymcFmtDto>> {
    this.logger.debug(`진료비납입확인서(연말정산용) START ${body}`);
    const result = [] as Array<McstPymcFmtDto>;

    try {
      const resp = await this.emrSoapApiService.internetMcstMcstPymCfmt(body as ReqInternetMcstPymcFmt);
      const processed = resp.ArrayOfInternetMcstMcstPymCfmt.InternetMcstMcstPymCfmt;

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
          let tmp = {
            // @ts-ignore
            orddate: data.ORDDATE,
            // @ts-ignore
            patsite: data.PATSITE,
            // @ts-ignore
            deptname: data.DEPTNAME,
            // @ts-ignore
            totamt: data.TOTAMT,
            // @ts-ignore
            reqamt: data.REQAMT,
            // @ts-ignore
            ownamt: data.OWNAMT,
            // @ts-ignore
            cardamt: data.CARDAMT,
            // @ts-ignore
            cashamt: data.CASHAMT,
            // @ts-ignore
            rcpamt: data.RCPAMT
          } as McstPymcFmtDto;
          result.push(tmp);
        });
      }
    } catch (e) {
      this.logger.error(`진료비납입확인서(연말정산용) ERR : ${e}`);
      throw e;
    }
    return result;
  }


  async getCtfsOtptInfom(body: ReqInternetCtfsOtptInfom): Promise<Array<CtfsOtptInfoDto>> {
    this.logger.debug(`통원진료확인서 START ${body}`);
    const result = [] as Array<CtfsOtptInfoDto>;


    try {
      const resp = await this.emrSoapApiService.internetCtfsOtptInfom(body as ReqInternetCtfsOtptInfom);
      const processed = resp.ArrayOfInternetCtfsOtptInfom.InternetCtfsOtptInfom;

      // <DEPTNAME>정형외과</DEPTNAME>
      // <FROMDATE>2018년 06월 15일 </FROMDATE>
      // <TODATE>X</TODATE>
      // <DEPTCD>OS</DEPTCD>
      // <MEDDR>윤여헌</MEDDR>

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
          let tmp = {
            deptname: data.DEPTNAME,
            todate: data.TODATE,
            fromdate: data.FROMDATE,
            meddr: data.MEDDR,
            deptcd: data.DEPTCD,
          } as CtfsOtptInfoDto;
          result.push(tmp);
        });
      }
    } catch (e) {
      this.logger.error(`통원진료확인서 ERR : ${e}`);
      throw e;
    }
    return result;
  }


  /**
   * 예시 데이터
   * his_hsp_tp_cd = "02";
   * pt_no = "10453963";
   * ads_dt = "20180801";
   * fromdate = "20180801";
   * todate = "20180802";
   * @param body
   */
  async getMcstDtlPtclFom(body: ReqInternetMcstDtlPtclFom): Promise<Array<McstDtlPtclInfoDto>> {
    this.logger.debug(`진료비세부내역서(입원) START ${body}`);
    const result = [] as Array<McstDtlPtclInfoDto>;

    try {
      const resp = await this.emrSoapApiService.internetMcstDtlPtclFom(body as ReqInternetMcstDtlPtclFom);
      const processed = resp.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table;

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
          let tmp = {
            // @ts-ignore
            instype: data.INSTYPE,
            // @ts-ignore
            accucd: data.TODATE,
            // @ts-ignore
            codename: data.FROMDATE,
            // @ts-ignore
            edicode: data.EDICODE,
            // @ts-ignore
            korsuga: data.KORSUGA,
            // @ts-ignore
            korname: data.KORNAME,
            // @ts-ignore
            useday: data.USEDAY,
            // @ts-ignore
            useqty: data.USEQTY,
            // @ts-ignore
            price: data.PRICE,
            // @ts-ignore
            sumprice: data.SUMPRICE,
            // @ts-ignore
            insamt: data.INSAMT,
            // @ts-ignore
            inreamt: data.INREAMT,
            // @ts-ignore
            insall: data.INSALL,
            // @ts-ignore
            uncamt: data.UNCAMT,
            // @ts-ignore
            tosumprice: data.TOSUMPRICE,
            // @ts-ignore
            toinsamt: data.TOINSAMT,
            // @ts-ignore
            toinreamt: data.TOINREAMT,
            // @ts-ignore
            toinsall: data.TOINSALL,
            // @ts-ignore
            touncamt: data.TOUNCAMT,
            // @ts-ignore
            fromdate: data.FROMDATE,
            // @ts-ignore
            todate: data.TODATE,
            // @ts-ignore
            meddept: data.MEDDEPT,
            // @ts-ignore
            orddate: data.ORDDATE
          } as McstDtlPtclInfoDto;
          result.push(tmp);
        });
      }
    } catch (e) {
      this.logger.error(`진료비세부내역서(입원) ERR : ${e}`);
      throw e;
    }
    return result;
  }


  async getMcstDtOPtclFom(body: ReqInternetMcstDtoPtclFom): Promise<Array<McstDtoPtclInfoDto>> {
    this.logger.debug(`진료비 세부산정내역 - 외래 START ${body}`);
    const result = [] as Array<McstDtoPtclInfoDto>;

    try {
      const resp = await this.emrSoapApiService.internetMcstDtOPtclFom(body as ReqInternetMcstDtoPtclFom);
      const processed = resp.DataSet["diffgr:diffgram"][0].NewDataSet[0].Table;

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }
          let tmp = McstDtoPtclInfoDto.fromXml(new McstDtoPtclInfoDto(), data);

          // tmp.setInsyn(tmp.insyn);
          tmp.setSugacode(tmp.sugacode);
          // tmp.setSpcamt(tmp.spcamt);
          // tmp.setUinamt(tmp.uinamt);

          result.push(tmp);
        });
      }
    } catch (e) {
      this.logger.error(`진료비 세부산정내역 - 외래 ERR : ${e}`);
     // throw e;
    }
    return result;
  }

  async getMcstDtlPtclFomBillTypeI(hsp_tcp_cd: string, rpy_pact_id: string, med_rsv_dtm: string, from_date: string, to_date: string) {
    this.logger.debug(`진료비 세부산정내역 - 입원 START`);
    const result = [] as Array<McstDtlPtclInfoDto>;

    try {

      const resp = await this.kioskWebServiceApiService.getMcsPymCfmtDtlTypeI(hsp_tcp_cd, rpy_pact_id, med_rsv_dtm, from_date, to_date);
      const processed = resp;

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el] = getArrFirstData(data[el]);
          }

          result.push(data);
        });
      }
    } catch (e) {
      this.logger.error(`진료비 세부산정내역 - 입원 ERR : ${e}`);
      throw e;
    }
    return result;
  }


  async getReceiptTypeIBList(hsp_tcp_cd: string, pat_no: string, adm_date: string, payment_date: string) {
    this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 START`);
    const result = [] as Array<McstDtlPtclInfoDto>;

    try {


      const resp = await this.kioskWebServiceApiService.getReceiptTypeIBList(hsp_tcp_cd, pat_no, adm_date, payment_date);
      const processed = resp;
      // const processed = resp.NewDataSet.Table0;


      this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 DESC : ${JSON.stringify(resp)}`);
      this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 DESC : ${JSON.stringify(processed)}`);

      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in processed) {
            processed[el] = getArrFirstData(processed[el]);
          }

          result.push(processed);
        });
      }
    } catch (e) {
      this.logger.error(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 ERR : ${e}`);
      throw e;
    }
    return result;
  }



  async getReceiptList(hsp_tp_cd: string, patno: string, rcptype: string, meddept: string, pay_complete: string, date: string) {
    this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 START`);
    let result = null;

    try {
//    his_hsp_tp_cd, patno, rcptype, deptname, data, date
      const resp = await this.kioskWebServiceApiService.getReceiptListPDF(hsp_tp_cd, patno, rcptype, meddept, pay_complete, date);
      const processed = resp.NewDataSet.Table0;

      this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 DESC1 : ${JSON.stringify(resp)}`);
      this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 DESC2 : ${JSON.stringify(processed)}`);


      if (processed != null) {
        processed.forEach(function(data) {
          for (let el in data) {
            data[el.toLowerCase()] = getArrFirstData(data[el]);
          }
        });

        this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 DESC3 : ${JSON.stringify(processed)}`);

        if(rcptype == '1') {

            for(var i = 0; i < processed.length; i++){
              if(processed[i].med_dt == date + "0000"){ //&& processed[i].med_dept_cd == meddept){
                this.logger.debug(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 DESC4 : ${JSON.stringify(processed[i])}`);

                let req2 = processed[i] as ReqBillService15X;
                result = await this.kioskWebServiceApiService.getReceiptTypeOList(req2) as PaymentReceiptDetail;
                break;
              }
            }
          }else{
                let req2 = processed[0] as ReqBillService15X;
                result = await this.kioskWebServiceApiService.getReceiptTypeIList(req2) as PaymentReceiptDetail;
          }
      }
    } catch (e) {
      this.logger.error(`입퇴원-입원중간비 영수증 full(header+detail) 데이터 요청 ERR : ${e}`);
      throw e;
    }
    return result;
  }



  /**
   * 증명서 이메일 전송
   *
   * TODO: 메일전송 부분 공통으로 변경예정
   * @param his_hsp_tp_cd
   * @param email
   * @param fileName
   * @param certKind
   */
  async sendCertificateMailPDF(his_hsp_tp_cd: string, email: string, fileName: string, certKind: string) {

    let subject = "";
    let tagTitle = "";
    let tagLogo = "";
    if(his_hsp_tp_cd.trim() == "01"){
      tagTitle = "<title>[이대서울병원]신청하신 증명서가 발급 되었습니다.</title>";
      tagLogo = "<a href='http://seoul.eumc.ac.kr' target='_blank'><img src='cid:image' width='149' alt='N Pay' style='border:0; margin-right:5px;'></a>";
      subject = "이대서울병원 " + certKind;
    }
    else{
      tagTitle = "<title>[이대목동병원]신청하신 증명서가 발급 되었습니다.</title>";
      tagLogo = "<a href='https://www.eumc.ac.kr/mokdong' target='_blank'><img src='cid:image' width='149' alt='N Pay' style='border:0; margin-right:5px;'></a>";
      subject = "이대목동병원 " + certKind;
    }

    const filePath = fileName;

    let content = "<!doctype html>" +
      "<html lang='ko'>" +
      "<head>" +
      "<meta http-equiv='X-UA-Compatible' content='IE=edge'>" +
      "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>" +
      tagTitle +
      "</head>" +
      "<body>" +
      "<div>" +
      "<table align='center' border='0' cellpadding='0' cellspacing='0' style='width:100%; letter-spacing:-1px'>" +
      "<tbody><tr><td align='center'>" +
      "<!-- 아웃룩용 max-width 핵 -->" +
      "<!--[if (gte mso 9)|(IE)]>" +
      "<table border='0' cellpadding='0' cellspacing='0'>" +
      "<tr><td width='595'>" +
      "<![endif]-->" +
      "<div style='max-width:595px; margin:0 auto'>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; margin:0 auto; background-color:#fff; -webkit-text-size-adjust:100%; text-align:left;'>" +
      "<tbody>" +
      "<tr>" +
      "<td colspan='3' height='30'></td>" +
      "</tr>" +
      "<tr>" +
      "<td width='21'></td>" +
      "<td>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; margin:0; padding:0'> " +
      "<tbody>" +
      "<tr>" +
      "<td style='margin:0; padding:0'>" +
      tagLogo +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td height='11'></td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</td>" +
      "<td width='21'></td>" +
      "</tr>" +
      "<tr>" +
      "<td width='21'></td>" +
      "<td>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; margin:0; padding:0'> " +
      "<tbody>" +
      "<tr>" +
      "<td style='font-size:28px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; line-height:34px; vertical-align:top'>" +
      "신청하신<br /><span style='color:#00aca7'>증명서가 발급</span>되었습니다." +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td height='13'></td>" +
      "</tr>" +
      "<tr>" +
      "<td style='font-size:14px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; line-height:24px; vertical-align:top'>증명서 발급 신청일 : <span>" + moment().format('yyyyMMDD') + "</span>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td height='22'></td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td colspan='3' height='1' style='background:#a2a2a2'></td>" +
      "</tr>" +
      "<tr>" +
      "<td colspan='3' height='26' style='background-color:#f7f7f7;'></td>" +
      "</tr>" +
      "<tr>" +
      "<td width='21' style='background-color:#f7f7f7;'></td>" +
      "<td>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; height:100px; margin:0; padding:0; background-color:#f7f7f7;'> " +
      "<tbody>" +
      "<tr>" +
      "<td width='100%' style='padding-bottom:9px; font-size:16px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; vertical-align:top;'>증명서 발급 내역</td>" +
      "</tr>" +
      "<tr>" +
      "<td width='100%' style='padding-bottom:9px; font-size:16px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; vertical-align:top;'>" +
      "<div style='width:551px; height:100%; border-radius:4px; background:#ffffff;box-shadow:0 1px 4px #c9c9c9;'>" +
      "<div style='width:90%; margin-left:5%; padding-top:5%; padding-bottom:5%;'>" +
      "<span style='line-height:20px;'> "+ certKind+" </span>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td style='padding-top:30px; padding-bottom:30px; font-size:16px; font-weight:bold; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; vertical-align:top; text-align:center;'>첨부된 증명서를 확인하시려면 생년월일 6자리를 입력해주세요.<br />\n" +
      "                                        예시) 880516" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</td>" +
      "<td width='21' style='background-color:#f7f7f7;'></td>" +
      "</tr>" +
      "<!-- footer-->" +
      "<tr>" +
      "<td colspan='3' style='padding-top:26px;padding-left:21px;padding-right:21px;padding-bottom:13px;background:#e5e5e5;font-size:12px;font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif;color:#696969;line-height:17px'>" +
      "본 메일은 발신전용입니다.<br /><br />" +
      "Copyright 2018 by ehwa womans university medical center. all rights reserved." +
      "</td>" +
      "</tr>" +
      "<!--// footer-->" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "<!--[if mso]>" +
      "</td></tr>" +
      "</table>" +
      "<![endif]-->" +
      "</body>" +
      "</html>";

    return await this.mailSenderService.reqSendMail(email, subject, filePath, content, his_hsp_tp_cd)
  }



  /**
   * 증명서 이메일 전송
   *
   * TODO: 메일전송 부분 공통으로 변경예정
   * @param email
   * @param fileName
   * @param certKind
   */
  async sendCertificateMail(email: string, fileName: string, certKind: string) {

    const subject = `이대목동병원 ${certKind} 제증명`;
    const filePath = `${CommonCodeConst.CERT_PDF_FILE_PATH}/${fileName}.pdf`;

    const content = "<!doctype html>" +
      "<html lang='ko'>" +
      "<head>" +
      "<meta http-equiv='X-UA-Compatible' content='IE=edge'>" +
      "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>" +
      "<title>[이대목동병원]신청하신 증명서가 발급 되었습니다.</title>" +
      "</head>" +
      "<body>" +
      "<div>" +
      "<table align='center' border='0' cellpadding='0' cellspacing='0' style='width:100%; letter-spacing:-1px'>" +
      "<tbody><tr><td align='center'>" +
      "<!-- 아웃룩용 max-width 핵 -->" +
      "<!--[if (gte mso 9)|(IE)]>" +
      "<table border='0' cellpadding='0' cellspacing='0'>" +
      "<tr><td width='595'>" +
      "<![endif]-->" +
      "<div style='max-width:595px; margin:0 auto'>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; margin:0 auto; background-color:#fff; -webkit-text-size-adjust:100%; text-align:left;'>" +
      "<tbody>" +
      "<tr>" +
      "<td colspan='3' height='30'></td>" +
      "</tr>" +
      "<tr>" +
      "<td width='21'></td>" +
      "<td>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; margin:0; padding:0'> " +
      "<tbody>" +
      "<tr>" +
      "<td style='margin:0; padding:0'>" +
      "<a href='https://www.eumc.ac.kr/mokdong' target='_blank'><img src='cid:image' width='149' alt='N Pay' style='border:0; margin-right:5px;'></a>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td height='11'></td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</td>" +
      "<td width='21'></td>" +
      "</tr>" +
      "<tr>" +
      "<td width='21'></td>" +
      "<td>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; margin:0; padding:0'> " +
      "<tbody>" +
      "<tr>" +
      "<td style='font-size:28px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; line-height:34px; vertical-align:top'>" +
      "신청하신<br /><span style='color:#00aca7'>증명서가 발급</span>되었습니다." +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td height='13'></td>" +
      "</tr>" +
      "<tr>" +
      "<td style='font-size:14px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; line-height:24px; vertical-align:top'>증명서 발급 신청일 : <span>2018-12-18</span>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td height='22'></td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td colspan='3' height='1' style='background:#a2a2a2'></td>" +
      "</tr>" +
      "<tr>" +
      "<td colspan='3' height='26' style='background-color:#f7f7f7;'></td>" +
      "</tr>" +
      "<tr>" +
      "<td width='21' style='background-color:#f7f7f7;'></td>" +
      "<td>" +
      "<table cellpadding='0' cellspacing='0' style='width:100%; height:100px; margin:0; padding:0; background-color:#f7f7f7;'> " +
      "<tbody>" +
      "<tr>" +
      "<td width='100%' style='padding-bottom:9px; font-size:16px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; vertical-align:top;'>증명서 발급 및 결제 내역</td>" +
      "</tr>" +
      "<tr>" +
      "<td width='100%' style='padding-bottom:9px; font-size:16px; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; vertical-align:top;'>" +
      "<div style='width:551px; height:100%; border-radius:4px; background:#ffffff;box-shadow:0 1px 4px #c9c9c9;'>" +
      "<div style='width:90%; margin-left:5%; padding-top:5%; padding-bottom:5%;'>" +
      "<span style='line-height:20px;'> " + certKind + " </span>" +
      "</div>" +
      "<div style='width:90%; margin-left:5%; padding-top:5%; margin-bottom:10%; border-top:1px solid #a2a2a2;'>" +
      "<span style='float:left; color:#66cdca;'>결제금액</span>" +
      "<span style='float:right; color:#66cdca;'>???????원</span>" +
      "</div>" +
      "</div>" +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<td style='padding-top:30px; padding-bottom:30px; font-size:16px; font-weight:bold; font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif; color:#3f3f3f; vertical-align:top; text-align:center;'>첨부된 증명서를 확인하시려면 생년월일 6자리를 입력해주세요.<br />\n" +
      "                                        예시) 880516" +
      "</td>" +
      "</tr>" +
      "</tbody>" +
      "</table>" +
      "</td>" +
      "<td width='21' style='background-color:#f7f7f7;'></td>" +
      "</tr>" +
      "<!-- footer-->" +
      "<tr>" +
      "<td colspan='3' style='padding-top:26px;padding-left:21px;padding-right:21px;padding-bottom:13px;background:#e5e5e5;font-size:12px;font-family:'나눔고딕',NanumGothic,'맑은고딕',Malgun Gothic,'돋움',Dotum,Helvetica,'Apple SD Gothic Neo',Sans-serif;color:#696969;line-height:17px'>" +
      "본 메일은 발신전용입니다.<br /><br />" +
      "* 발급이 완료된 증명서는 이용약관에 따라 환불되지 않습니다.<br /><br /><br />" +
      "Copyright 2018 by ehwa womans university medical center. all rights reserved." +
      "</td>" +
      "</tr>" +
      "<!--// footer-->" +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "<!--[if mso]>" +
      "</td></tr>" +
      "</table>" +
      "<![endif]-->" +
      "</body>" +
      "</html>";


    const email_send_resp = await this.mailSenderService.reqSendMail(email, subject, filePath, content, CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG);

    return email_send_resp;
  }






}
