import { Body, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { CommonConfService } from "../../config/common-conf.service";
import { EmrSoapApiService } from "../emr-soap-api/emr-soap-api.service";
import { KioskWebServiceApiService } from "../cert-api/kiosk-web-service-api.service";
import { PharmInfo } from "../cert-api/dto/pharm-info.interface";
import { PharmDetail } from "../cert-api/dto/pharm-detail.interface";
import { CommonCodeConst } from "../../const/common-code.const";
import { ReqInternetCtfsModifyTelno } from "../emr-soap-api/dto/req-internet-ctfs-modify-telno.interface";
import { getArrFirstData } from "../../utils/string.util";

@Injectable()
export class PrescriptionApiService {
  private readonly logger = new Logger(PrescriptionApiService.name);


  constructor(private httpService: HttpService,
              private commonConfService: CommonConfService,
              private emrSoapApiService: EmrSoapApiService,
              private kioskWebServiceApiService: KioskWebServiceApiService,
  ) {
  }


  /**
   *
   */
  async getPharmInfo(his_hsp_tp_cd: string, patno: string): Promise<PharmInfo>{
    this.logger.debug(`처방전 정보 조회 START : ${his_hsp_tp_cd}, ${patno}`);
    try{
      const result = {} as PharmInfo ;
      const resp = await this.kioskWebServiceApiService.getPharmInfo(his_hsp_tp_cd, patno);
      const resList = resp.string.NewDataSet[0].Table00;
      for (const item of resList) {
        for (let el in item) {
          result[el] = getArrFirstData(item[el]);
        }




      }





      return result;
    }catch (e) {
      this.logger.error(`처방전 정보 조회 ERR : ${e}`);
      throw e;
    }
  }

  /**
   * 처방전 상세
   */
  async getPharmDetail(hsp_tcp_cd: string, pat_no: string, ord_dt: string, ams_no: string, pact_id: string): Promise<Array<PharmDetail>>{
    this.logger.debug(`처방전 정보 상세 조회 START`);
    try{
      const result: Array<PharmDetail> = [];
      const resp = await this.kioskWebServiceApiService.getPharmDetail(hsp_tcp_cd, pat_no, ord_dt, ams_no, pact_id);
      const resList = resp.Table0;
      for (const item of resList) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }

        result.push(item);
      }
      return result;
    }catch (e) {
      this.logger.error(`처방전 정보 상세 조회 ERR : ${e}`);
      throw e;
    }
  }

  /**
   * 전자 처방전 전문 생성 요청
   */
  async getEPharmDetail(patno: string,
                        his_hsp_tp_cd: string,
                        ord_dt: string,
                        ams_no: string,
                        pact_id: string,
                        pharmName: string,
                        pharmId: string,) {

    this.logger.debug(`전자 처방전 전문 생성 요청 START`);
    try{
      const result: Array<PharmDetail> = [];
      const resp = await this.kioskWebServiceApiService.getPharmDetail(his_hsp_tp_cd, patno, ord_dt, ams_no, pact_id);
      const resList = resp.NewDataSet.Table0;
      for (const item of resList) {
        for (let el in item) {
          item[el] = getArrFirstData(item[el]);
        }

        result.push(item);
      }












      return result;
    }catch (e) {
      this.logger.error(`전자 처방전 전문 생성 요청 ERR : ${e}`);
      throw e;
    }



  }


  generatePrescription() {
//     String responseCode = "";
//
//     List<PharmDetail> pharmDetails = new ArrayList<>();
//     try{
//       logger.info(xml);
//       for(int i = 0; i < root.children.size(); i ++){
//         if(root.children.get(i).children.size() > 0){
//           logger.info(simple.domToXml(root.children.get(i).children.get(i)));
//           PharmDetail pharmDetail;
//           pharmDetail = simple.fromXml(root.children.get(i).children.get(i), PharmDetail.class);
//           pharmDetails.add(pharmDetail);
//           logger.info(pharmDetail.getOrd_dt() + ", " + pharmDetail.getAms_no());
//           SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
//           Date date = new Date();
//           logger.info(dateFormat.format(date));
//           String today = dateFormat.format(date);
// //                    String fileName = today + pharmDetail.getAms_no();
//           String fileName = today + "19999";
//           SimpleDateFormat df = new SimpleDateFormat("hhmmss");
//           String time = df.format(date);
//
//           logger.info("전문 생성");
//           File filePath = new File("/home/manager/test/" + fileName + ".txt");
//           if(filePath.exists()){
//             logger.info("파일 존재로 인한 종료");
//           }
//           //전문작성 NPDS_KIOSK 확인결과 길이, 값 다 맞음
//
//           String kioskTime = String.format("%6s", time);
//           String kioskFlag = "AA";                                                                                //KIOSK FLAG : AA 고정
//           String kioskId = "172017001114";                                                                        //KIOSK ID :  IP (1자리 또는 2자리일 경우 앞에 0을 붙힘)
// //                    String prescriptionDate = dateFormat.format(date) + pharmDetail.getAms_no();                            //처방전교부번호(AMS_NO) : YYYYMMDD+일련번호 5자리 ex)yyyyMMdd + AMS_NO
//           String prescriptionDate = dateFormat.format(date) + "19999";
//           String paymentType = "01";                                                                              //지불수단분류 : 00:현금, 01:신용카드
//           String SunapFlag = "N";                                                                                 //수납여부 : Default:Y
//           String printFlag = "N"; // 키오스크 Y, 모바일 N (포씨게이트 인상현 부장 확인함)                                    //인쇄여부 : Default:Y 모바일:N
//
//           SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
//           String dateTime = sdf.format(date);                                                                     //날짜시간 : 현재 기기 시간 YYYYMMDDHHNNSS
//
//           String tid = String.format("%16s", " ");                                                                //신용카드 승인번호 : 결제를 하지 않음 따라서 Space16자
//           String amount = String.format("%09d", 0000);                                                            //결제금액 : Defalut:000000000
//           String rcvType = String.format("%-2s", "01");                                                           //의약품 수취방법 : Default: 01
//           String pharmacyId = String.format("%-12s", pharmId);                                                    //약국ID :
//
// //                    String pharmacyName = String.format("%-40s", pharmName);                                                //약국명 :
//           String pharmacyName = pharmName;                                                //약국명 :
//           String temp = getbates(pharmacyName, 40);
//           String pharmacyNameTemp = new String(temp.getBytes("euc-kr"), "iso-8859-1");
//
//           String onlineType = String.format("%-2s", "03");                                                        //ONLINE 수단: Default: 03
//           String giho = String.format("%4s", " ");                                                                //특정기호: Space4자리
//           String ptnm = pharmDetail.getPtnm().replace(" ", "");
//
// //                    String insuredPerson = String.format("%-16s", ptnm);                                                    //피보험자 성명(PTNM): 피보험자명 16자리 Left Allign, 빈칸은 Space
//           String nameTemp = getbates(ptnm, 16);
//           String nameTemp2 = new String(nameTemp.getBytes("euc-kr"), "iso-8859-1");
//
//           String reserve = String.format("%-20s", " ");                                                           //Resaerved : Space20자리
//
//           String NPDS_KIOSK = kioskTime + kioskFlag + kioskId + prescriptionDate + paymentType + SunapFlag + printFlag +
//             dateTime + tid + amount + rcvType + pharmacyId + pharmacyNameTemp + onlineType + giho +
//             nameTemp2 + reserve;
//           logger.info("NPDS_KIOSK = " + NPDS_KIOSK);
//           //end
//
//           //전문작성 NPDS_HEAD 확인결과 길이, 값 다 맞음 전문 전체길이만 확인하면 됨.
//           String prescriptionFlag = "KP";                                                                         //처방전 FLAG : KP 고정
//           String prescription = "";                                                                               //전문 전체길이 NPDS_HEAD포함한 전체 길이, 오른쪽 정렬,남는부분은 "0"
//           String prescriptionInfo = "01";                                                                         //처방전 정보 : Default: 01
//           //end
//
//           //전문작성 NPDS_PRINFO
//           String his_hsp_tp_cd = "02";                                                                            //병원코드가 존재하면 넘기고 없을땐 제거해도 무방
//
//           String prescriptionDate1 = prescriptionDate;                                                            //교부번호(AMS_NO) : YYYYMMDD+일련번호 5자리 ex)yyyyMMdd + AMS_NO
//           String medicalType = "0" + pharmDetail.getPattype().substring(0, 1);                                    //의료구분(유형)(PATTYPE) : 전 병원 빈값( 01:국민건강보험, 02:의료보호, 03:산재보험, 04:자동차보험, :05:기타
//                                                                                                                   //11:국민건강보험100%,12:공단공상,13:공상(계약공상) 21:보호1종,22:보호2종,31:산재공상,32:산재본인 100%,33:선박보험,41:자보책임 42:자손,43:자보본인 100%,51:일반(전액본인부담)
//                                                                                                                   //60:행려,61:성병 입원진료,62:2종대상자 장애인의 2차진료 63:2종대상자 장애인의 1차진료,64:보훈감면 50%,65:보훈감면 60%,66:보훈감면 100% 67:보훈국비 100%,68:군요양기관 이용시(군인가족),69:군요약기관 이용시(현역군인) 없을 경우 Space)
//           String medicalType2 = String.format("%-2s", " ");                                                       //의료구분(보조) : 전 병원 빈값
//           String insuranceType = String.format("%-2s", " ");                                                                            //보험특기사항 : Space2자리
//
//           String nursingSign = "";                                                                                //요양기관번호 : 병원코드가 존재하면 해당 코드에 맞춰 처리 없으면 단일처리
//           if(his_hsp_tp_cd.equals("01")){
//             nursingSign = String.format("%-15s", "11101369");
//           }else{
//             nursingSign = String.format("%-15s", "11100915");
//           }
//
//           String medicalName = "";                                                                                //의료기관명칭 : 병원코드가 존재하면 해당 코드에 맞춰 처리 없으면 단일처리
//           String medicalPhoneNumber = "";                                                                         //전화번호 : 병원코드가 존재하면 해당 코드에 맞춰 처리 없으면 단일처리
//           String medicalFaxNumber = "";                                                                           //FAX번호 : 병원코드가 존재하면 해당 코드에 맞춰 처리 없으면 단일처리
//           String medicalEmail = "";                                                                               //병원 이메일 : 병원코드가 존재하면 해당 코드에 맞춰 처리 없으면 단일처리
//           String medicalNameTemp = "";
//           String medicalNameTemp2 = "";
//           if (his_hsp_tp_cd.equals("01")){
//             medicalName = "이화여자대학교의과대학부속서울병원";
//             medicalPhoneNumber = "";
//             medicalFaxNumber = "";
//             medicalEmail = "";
//           }else{
// //                        medicalName = String.format("%-50s", "이화여자대학교의과대학부속목동병원");
//             medicalName = "이화여자대학교의과대학부속목동병원";
//             medicalNameTemp = getbates(medicalName, 50);
//             medicalNameTemp2 = new String(medicalNameTemp.getBytes("euc-kr"), "iso-8859-1");
//             medicalPhoneNumber = String.format("%-20s", "02) 650-6191");
//             medicalFaxNumber = String.format("%-20s", "02) 650-6191");
//             medicalEmail = String.format("%-35s", "ehpharm@eumc.co.kr");
//           }
//
// //                    String prescriptionDoctor = String.format("%-20s", pharmDetail.getJucdr_nm());                          //처방의 성명(JUCDR_NM)
//           String prescriptionDoctor = pharmDetail.getJucdr_nm();
//           String prescriptionDoctorTemp = getbates(prescriptionDoctor, 20);
//           String prescriptionDoctorTemp2 = new String(prescriptionDoctorTemp.getBytes("euc-kr"), "iso-8859-1");
//
// //                    String licenseType = String.format("%-20s", pharmDetail.getLcns_no().replace("면허", ""));    //면허종별(LCNS_NO): 면허라는 글자 삭제
//           String licenseType = pharmDetail.getLcns_no().replace("면허", "");            //면허종별(LCNS_NO): 면허라는 글자 삭제
//           String licenseTypeTemp = getbates(licenseType, 20);
//           String licenseTypeTemp2 = new String(licenseTypeTemp.getBytes("euc-kr"), "iso-8859-1");
//
//           String licenseNumber = String.format("%-20s", pharmDetail.getJucdr_sid());                              //면허번호(JUCDR_SID)
// //                    String patName = String.format("%-20s", ptnm);                                                          //환자성명(PTNM)
//           String patName = ptnm;                                                          //환자성명(PTNM)
//           String patNameTemp = getbates(ptnm, 20);
//           String patNameTemp2 = new String(patNameTemp.getBytes("euc-kr"), "iso-8859-1");
//
//           String residentRegistrationNumber = "";                                                                 //환자주민등록번호(SSN) : 없을경우 000000-0000000
//           if(pharmDetail.getSsn().equals("") || pharmDetail.getSsn().equals("null")){
//             residentRegistrationNumber = "000000-0000000";
//           }else{
//             residentRegistrationNumber = String.format("%-13s", pharmDetail.getSsn());
//           }
//
//           String VeteransNumber = String.format("%-13s", " ");                                                    //보훈번호 : 없을경우 Space13자리
//           String deptCd = pharmDetail.getBarcode_dept_cd();                                                       //진료과코드(BARCODE_DEPT_CD)
//
//           String diseaseClassifier = String.format("%-5s", pharmDetail.getDissdesc()).trim().substring(0, 4);     //질병분류기호1 : 없을경우 Space5자리
//           if(diseaseClassifier == null || diseaseClassifier.equals("") || diseaseClassifier.equals("null")){
//             diseaseClassifier = String.format("%-5s", " ");
//           }
//
//           String diseaseClassifier2 = String.format("%-5s", " ");                                                 //질병분류기호2 : 없을경우 Space5자리
//           String giho1 = giho;                                                                                    // NPDS_KIOSK에 giho가져다 쓸것.
//           String pharmacyDetails = String.format("%-140s", " ");                                                  //조제내역사항 용법 : Space140자리
//           String pharmacyNotify = String.format("%-350s", " ");                                                   //조제시 참고사항 : Space350자리
//
//           LocalDate currentDate = LocalDate.now().plusDays(13);
//           DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
//           String periodUse = currentDate.format(formatter);                                                       //사용기간 : YYYYMMDD (교부일+처방전 사용기간(일반적으로 7일))
//
//           String healthInsuranceInfo = "01";                                                                      //보험증정보 : 01로 보내야만 한통으로 전송됨 추가 Check 필요 보험/보호/자보/산재일 경우 보험증정보 및 조합기호가 없을경우 00으로 Setting 하는데 이럴경우에는 한통으로 전송 안됨
//
//
//           String NPDS_PRINFO = prescriptionDate1 + medicalType + medicalType2 + insuranceType + nursingSign +
//             medicalNameTemp2 + medicalPhoneNumber + medicalFaxNumber + medicalEmail + prescriptionDoctorTemp2 +
//             licenseTypeTemp2 + licenseNumber + patNameTemp2 + residentRegistrationNumber + VeteransNumber +
//             deptCd + diseaseClassifier + diseaseClassifier2 + giho1 + pharmacyDetails + pharmacyNotify +
//             periodUse + healthInsuranceInfo;
//
//           logger.info("NPDS_PRINFO = " + NPDS_PRINFO);
//           //end
//
//           //전문작성 NPDS_INS
//           String industrialProductionNumber = String.format("%-13s", "00");                                       //증번호, 산재성립번호 : 00+Space11자리 (보험일 경우 증번호,산재일경우 산재성립번호 자동차 보험일 경우 Space, 없을 경우 Space)
//           String industrialAccidentMedicalInstitution = String.format("%-16s", "00");                             //조합기호, 산재지정의료기관기호 : 00+Space16자리 (보험일 경우 조합기호,산재일 경우 지정의료 기관 번호,자동차 보험일 경우에도 조합기호가 별도로 있음)
//           String businessName = String.format("%-64s", "00");                                                     //조합명칭, 사업장명칭 : 00+Space62자리 (보험일 경우 조합명칭,산재일 경우 사업장 명칭)
//           String combinationDivision = String.format("%-16s", "00");                                              //조합구분 : 00+Space14자리 (Space로 채워서 보냄)
//           String insuranceName = String.format("%-20s", " ");                                                 //피보험자명, 근로사업자명(PTNM) : 보험일 경우 피보험자명, 산재일 경우 근로사 사업자명
//           String insuranceSsn = String.format("%-14s", "000000-0000000");                                     //피보험자 주민등록번호
//           String insuranceRelation = String.format("%-2s", "05");                                                 //피보험자와의관계 : Default:05 (01:본인,02:배우자,03:자녀,04:부모,05:기타)
//           String disasterDate = String.format("%-8s", " ");                                                       //재해발상일 : Space8자리
//
//           String NPDS_INS = industrialProductionNumber + industrialAccidentMedicalInstitution + businessName +
//             combinationDivision + insuranceName + insuranceSsn + insuranceRelation + disasterDate;
//           logger.info("NPDS_INS = " + NPDS_INS);
//           //end
//
//           //NPDS_DRUGPTR
//
//           int rCount = 0;
//           String rxdInfo = pharmDetail.getRxdinfo();                                                              //처방의약품(RXDINFO) : 처방의약품 개수
//           for(int rxd = 0; rxd < rxdInfo.length(); rxd++){
//             rCount = rxd;
//           }
//           String NPDS_DRUGPTR = String.valueOf("0" + root.children.get(i).children.size());
//           logger.info("NPDS_DRUGPTR = " + NPDS_DRUGPTR);
//           //end
//
//           //NPDS_DRUG
//           String salaryAndUnpaid = pharmDetail.getMed_mifi_tp_cd();                                               //급여, 비급여 구분(MED_MIFI_TP_CD) : D:본인부담, S:비급여, 나머지:급여 (급여:01,비급여:02,일반:03)
//           try{
//             if(salaryAndUnpaid.equals("D")){
//               salaryAndUnpaid = "03";
//             }else if(salaryAndUnpaid.equals("S")){
//               salaryAndUnpaid = "02";
//             }else {
//               salaryAndUnpaid = "01";
//             }
//           }catch (Exception e){
//             logger.info("salaryAndUnpaid null로 인한 exception 처리");
//             salaryAndUnpaid = "01";
//           }
//
//
//           String ampthTpCd = pharmDetail.getAmpth_tp_cd();                                                        //약품분류코드 : 내복:01,외용:02 AMPTH_TP_CD 0:주사, 1:먹거나 바르는약 주사일때 IORD_PSB_YN값이 Y면 01 N 02 그외 01
//           if(ampthTpCd.equals("0")){
//             if(pharmDetail.getIord_psb_yn().equals("Y")){
//               ampthTpCd = "01";
//             }else if(pharmDetail.getIord_psb_yn().equals("N")){
//               ampthTpCd = "02";
//             }else{
//               ampthTpCd = "01";
//             }
//           }else if(ampthTpCd.equals("1")){
//             ampthTpCd = "02";
//           }
//
//           String kdCd = String.format("%-9s", pharmDetail.getKd_cd());                                            //처방의약품코드(KD_CD) : EDI 약품 코드
//
// //                    String kpemName = String.format("%-70s", pharmDetail.getKpem_mdpr_nm());                                //처방의약품명칭(KPEM_MDPR_NM)
//           String kpemName = pharmDetail.getKpem_mdpr_nm();                                //처방의약품명칭(KPEM_MDPR_NM)
//           String kpemNameTemp = getbates(kpemName, 70);
//           String kpemNameTemp2 = new String(kpemNameTemp.getBytes("euc-kr"), "iso-8859-1");
//
//           String drugBaseContent = String.format("%-9s", " ");                                                    //약품기본함량 : Space9자리
//           String drugBaseContentUnit = String.format("%-2s", " ");                                                //약품기본함량의단위 : Space2자리
//           String basicCapacityMedicine = String.format("%-9s", " ");                                              //약품기본용량 : Space9자리
//           String basicCapacityMedicineUnit = String.format("%-2s", " ");                                          //약품기본용량의단위 : Space2자리
//
//           String putquy = String.format("%9s", String.format("%.3f", pharmDetail.getPutqty()));                   //1회투여량(PUTQTY) : 0.000양식으로 오른쪽정렬 왼쪽은 Space채움, 절사/절상 없음
//           String mdprUnitCd = "  ";                                                                                 //1회투여량단위(MDPR_UNIT_CD) : 없을 경우 Space
// //                    if(pharmDetail.equals("")){
// //                        mdprUnitCd = String.format("%2s", " ");
// //                    }else{
// //                        mdprUnitCd = String.format("%2s", pharmDetail.getMdpr_unit_cd());
// //                    }
//
//           String prpdNotm = String.format("%2s", pharmDetail.getPrpd_notm());                                     //1일투여횟수(PRPD_NOTM) : 숫자 한자리일 경우 오른쪽 정렬해서 Space채움
//           String prpdNotmTemp = "";
//           String sTemp = "";
//           String pTemp = "";
//           if(pharmDetail.getPrpd_notm().length() == 2){
//             for(int a = 0; a < prpdNotm.length(); a++){
//               sTemp = prpdNotm.substring(a, a+1);
//               if(sTemp.equals("0")){
//                 pTemp += "0";
//               }else if(sTemp.equals("1")){
//                 pTemp += "1";
//               }else if(sTemp.equals("2")){
//                 pTemp += "2";
//               }else if(sTemp.equals("3")){
//                 pTemp += "3";
//               }else if(sTemp.equals("4")){
//                 pTemp += "4";
//               }else if(sTemp.equals("5")){
//                 pTemp += "5";
//               }else if(sTemp.equals("6")){
//                 pTemp += "6";
//               }else if(sTemp.equals("7")){
//                 pTemp += "7";
//               }else if(sTemp.equals("8")){
//                 pTemp += "8";
//               }else if(sTemp.equals("9")){
//                 pTemp += "9";
//               }
//             }
//             prpdNotmTemp = String.format("%2s", pTemp);
//           }
//           String whlPrdDys = String.format("%3s", pharmDetail.getWhl_prd_dys());                                  //총투약일수(WHL_PRD_DYS) : 숫자 한자리일 경우 오른쪽 정렬해서 Space채움
//           String whlPrdDysTemp = "";
//           String aTemp = "";
//           String bTemp = "";
//           for(int a = 0; a < whlPrdDys.length(); a++){
//             aTemp = whlPrdDys.substring(a, a+1);
//             if(aTemp.equals("0")){
//               bTemp += "0";
//             }else if(aTemp.equals("1")){
//               bTemp += "1";
//             }else if(aTemp.equals("2")){
//               bTemp += "2";
//             }else if(aTemp.equals("3")){
//               bTemp += "3";
//             }else if(aTemp.equals("4")){
//               bTemp += "4";
//             }else if(aTemp.equals("5")){
//               bTemp += "5";
//             }else if(aTemp.equals("6")){
//               bTemp += "6";
//             }else if(aTemp.equals("7")){
//               bTemp += "7";
//             }else if(aTemp.equals("8")){
//               bTemp += "8";
//             }else if(aTemp.equals("9")){
//               bTemp += "9";
//             }
//             whlPrdDysTemp = String.format("%3s", bTemp);
//           }
//
//           String rmk = pharmDetail.getRmk();
// //                    String abbr = "";                                                                                       //용법(USG_CD + ABBR) : 용법코드 :왼쪽에서 10자리 왼쪽정렬 나머지 Space+@+용법 나머지는 Space 채움
// //                    String abbrTemp = "";
// //                    String rmkTemp = "";
// //                    String abbrTemp2 = "";
// //                    String rmkTemp2 = "";
// //                    if(rmk == null || rmk.equals("") || rmk.equals("null")){
// //                        abbrTemp = getbates(pharmDetail.getAbbr(), 10);
// //                        abbrTemp2 = new String(abbrTemp.getBytes("euc-kr"), "iso-8859-1");
// //                        abbr = String.format("%-130s", " ") + abbrTemp2;
// //                    }else{
// //                        abbrTemp = getbates(pharmDetail.getAbbr(), 10);
// //                        abbrTemp2 = new String(abbrTemp.getBytes("euc-kr"), "iso-8859-1");
// //                        rmkTemp = getbates(rmk, 130);
// //                        rmkTemp2 = new String(rmkTemp.getBytes("euc-kr"), "iso-8859-1");
// //                        abbr = abbrTemp2 + rmkTemp2;
// //                    }
//           String usgCd = String.format("%-9s", pharmDetail.getUsg_cd());
//           String gubun = String.format("%-1s", "@");
//           String abbrTemp = getbates(pharmDetail.getAbbr(), 130);
//           String abbrTemp2 = new String(abbrTemp.getBytes("euc-kr"), "iso-8859-1");
//           String abbr = usgCd + gubun + abbrTemp2;
//
//
//           String NPDS_DRUG = salaryAndUnpaid + ampthTpCd + kdCd + kpemNameTemp2 + drugBaseContent +
//             drugBaseContentUnit + basicCapacityMedicine + basicCapacityMedicineUnit + putquy +
//             mdprUnitCd + prpdNotmTemp + whlPrdDysTemp + abbr;
//           logger.info("NPDS_DRUG = " + NPDS_DRUG);
//           //end
//
//           //NPDS_JDRUGPTR
//           int pre = Integer.parseInt(ampthTpCd.trim());
//
//           String prescriptionMedicine = String.format("%-2s", pre);
//
//           String NPDS_JDRUGPTR = "";
//           //end
//
//           //NPDS_CREDITPTR
//           String npdsCreditptr = String.format("%-2s", "00");                                                     //수납할 과 갯수 : Default:00
//
//           String NPDS_CREDITPTR = npdsCreditptr;
//           //end
//
//           //NPDS_CREDIT
//           String npdsCredit = String.format("%-2s", "00");                                                         //지불수단분류 : Default:00
//
//           String NPDS_CREDIT = npdsCredit;
//           //end
//
//           String NPDS_HEAD = prescriptionFlag + prescription + prescriptionInfo;
//
//           String msg = NPDS_KIOSK + NPDS_HEAD + NPDS_PRINFO + NPDS_INS + NPDS_DRUGPTR + NPDS_DRUG + NPDS_JDRUGPTR + NPDS_CREDITPTR + NPDS_CREDIT;
//           logger.info("msg length = " + msg.getBytes().length);
//
//           prescription = String.valueOf(msg.getBytes().length);
//
//           String NPDS_HEAD1 = prescriptionFlag + prescription + prescriptionInfo;
//
//           String msg1 = NPDS_KIOSK + NPDS_HEAD1 + NPDS_PRINFO + NPDS_INS + NPDS_DRUGPTR + NPDS_DRUG + NPDS_JDRUGPTR + NPDS_CREDITPTR + NPDS_CREDIT + "\n";
//
//           FileWriter fileWriter = null;
//           BufferedWriter writer = null;
//
//           try {
//             // 기존 파일의 내용에 이어서 쓰려면 true를, 기존 내용을 없애고 새로 쓰려면 false를 지정한다.
//             fileWriter = new FileWriter(filePath, true);
//             writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filePath), "Cp1252"));
//             writer.write(msg1);
//             writer.flush();
// //                        fileWriter.write(msg1);
// //                        fileWriter.flush();
//
//             logger.info("파일생성.....");
//             responseDTO.setResultCode("0000");
//             responseDTO.setResultMsg(fileName);
//           }catch (Exception e){
//             logger.info("동일 파일이름 존재로 인한 파일생성 실패 = " + e.toString());
//             responseDTO.setResultCode("9999");
//           }finally {
//             try{
//               if (fileWriter != null){
//                 fileWriter.close();
//               }
//             }catch (Exception e){
//               logger.info(e.toString());
//             }
//           }
// //                    try{
// //                        sftpUpload.upload(new File("/home/manager/test/"+ fileName + ".txt"));
// //                    }catch (Exception e){
// //                        logger.info("전자처방전 전송 실패 = " + e.toString());
// //                    }
//           return responseDTO;
//         }
//       }
//     }catch (Exception e){
//       logger.info("전문생성 실패 = " + e.toString());
//       responseDTO.setResultCode("1891");
//     }
//     return null;

  }

}
