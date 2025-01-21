import { CommonCodeConst } from "./common-code.const";

export class DepartmentTypeData {
  readonly code: string;
  readonly name: string;
  readonly hospital: string;

  constructor(hospital: string, code: string, desc: string) {
    this.hospital = hospital;
    this.code = code;
    this.name = desc;
  }

  toString(): string {
    return `hospital: ${this.hospital}, code: ${this.code}, desc: ${this.name}`;
  }
}


export class DepartmentType {
  static readonly DIMG_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "DIMG", "소화기내과(소화기센터)");
  static readonly DGS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "DGS", "외과(소화기센터)");
  static readonly CCIMG_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "CCIMG", "소화기내과(암센터)");
  static readonly CCGS_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "CCGS", "외과(암센터)");
  static readonly CCIMH_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "CCIMH", "혈액종양내과(암센터)");
  static readonly CCUR_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "CCUR", "비뇨의학과(암센터)");
  static readonly JSC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "JSC", "관절척추센터");
  static readonly JIMR_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL, "JIMR", "류마티스내과(관절척추센터)");
  static readonly JOS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "JOS", "정형외과(관절척추센터)");
  static readonly JAN_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "JAN", "통증의학과(관절척추센터)");
  static readonly JNS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "JNS", "신경외과(관절척추센터)");
  static readonly CCV_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CCV", "심뇌혈관센터");
  static readonly VNS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "VNS", "신경외과(심뇌혈관센터)");
  static readonly VIMC_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "VIMC", "순환기내과(심뇌혈관센터)");
  static readonly VNR_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "VNR", "신경과(심뇌혈관센터)");
  static readonly VCS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "VCS", "흉부외과(심뇌혈관센터)");
  static readonly RC_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "RC", "폐센터");
  static readonly LIMD_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "LIMD", "감염내과(폐센터)");
  static readonly LIMA_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "LIMA", "알레르기내과(폐센터)");
  static readonly LIMP_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "LIMP", "호흡기내과(폐센터)");
  static readonly CCNS_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CCNS", "신경외과(암센터)");
  static readonly VPGE_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "VPGE", "소아청소년과(심뇌혈관센터)");
  static readonly LCS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "LCS", "흉부외과(폐센터)");
  static readonly CCS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CCS", "흉부외과(암센터)");
  static readonly IM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IM", "내과");
  static readonly IMD_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMD", "감염내과");
  static readonly PV_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PV", "예방접종과");
  static readonly IME_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IME", "내분비내과");
  static readonly IMR_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMR", "류마티스내과");
  static readonly IMG_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMG", "소화기내과");
  static readonly IMC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMC", "순환기내과");
  static readonly IMN_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMN", "신장내과");
  static readonly IMA_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMA", "알레르기내과");
  static readonly IMH_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMH", "혈액종양내과");
  static readonly HP_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HP", "호스피스");
  static readonly IMP_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IMP", "호흡기내과");
  static readonly QC_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "QC", "금연클리닉");
  static readonly GS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "GS", "외과");
  static readonly GSZ_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "GSZ", "비만수술센터");
  static readonly CS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CS", "흉부외과");
  static readonly NS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "NS", "신경외과");
  static readonly OS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OS", "정형외과");
  static readonly HS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HS", "수부외과");
  static readonly PS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PS", "성형외과");
  static readonly OG_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OG", "산부인과");
  static readonly OGHP_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OGHP", "건강여성백신");
  static readonly PED_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PED", "소아청소년과(종합)");
  static readonly PGE_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PGE", "소아청소년과");
  static readonly PID_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PID", "소아청소년과(감염면역)");
  static readonly PTB_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PTB", "소아청소년과(결핵예방)");
  static readonly PEN_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PEN", "소아청소년과(내분비)");
  static readonly PGN_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PGN", "소아청소년과(소화기영양)");
  static readonly PNR_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PNR", "소아청소년과(신경)");
  static readonly PNB_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PNB", "소아청소년과(신생아)");
  static readonly PKD_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PKD", "소아청소년과(신장)");
  static readonly PCV_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PCV", "소아청소년과(심장)");
  static readonly PHO_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PHO", "소아청소년과(혈액종양)");
  static readonly PAP_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PAP", "소아청소년과(호흡알레르기)");
  static readonly HPPD_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HPPD", "유두종백신");
  static readonly DM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DM", "피부과");
  static readonly HPOG_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HPOG", "건진의학과(여성클리닉)");
  static readonly DNR_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DNR", "연명의료자문팀");
  static readonly DDC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DDC", "소화기센터");
  static readonly SLE_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "SLE", "수면센터(임)");
  static readonly GMBC_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "GMBC", "국제진료");
  static readonly JRH_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "JRH", "재활의학과(관절척추센터)");
  static readonly UR_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "UR", "비뇨의학과");
  static readonly EY_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "EY", "안과");
  static readonly EN_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "EN", "이비인후과");
  static readonly NP_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "NP", "정신건강의학과");
  static readonly NR_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "NR", "신경과");
  static readonly AN_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "AN", "마취통증의학과");
  static readonly ANO_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "ANO", "마취통증의학과통증크리닉");
  static readonly DS_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DS", "치과(종합)");
  static readonly DT_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DT", "치과");
  static readonly PERIO_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PERIO", "치과치주과");
  static readonly ORTHO_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "ORTHO", "치과교정과");
  static readonly CONSE_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CONSE", "치과보존과");
  static readonly PROST_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PROST", "치과보철과");
  static readonly DA_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DA", "예진 및 스켈링");
  static readonly CDC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CDC", "소아치과");
  static readonly DIC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DIC", "구강검진");
  static readonly OMS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OMS", "구강악안면외과");
  static readonly FM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "FM", "가정의학과");
  static readonly EM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "EM", "응급의학과");
  static readonly EMO_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "EMO", "응급의학과외래");
  static readonly DR_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "DR", "영상의학과");
  static readonly TR_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "TR", "방사선종양학과");
  static readonly NM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "NM", "핵의학과");
  static readonly LM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "LM", "진단검사의학과");
  static readonly PA_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PA", "병리과");
  static readonly RH_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "RH", "재활의학과");
  static readonly OEM_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OEM", "직업환경의학과");
  static readonly OM_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OM", "특수검진");
  static readonly PHC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "PHC", "소아청소년검진");
  static readonly CCM_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CCM", "응급중환자진료과");
  static readonly NSC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "NSC", "영양집중지원팀");
  static readonly ER_1      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "ER", "지역응급의료센터");
  static readonly AER_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "AER", "응급실");
  static readonly IHC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "IHC", "국제협력파트");
  static readonly CRISD_1   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CRISD", "임상시험(CRIS)");
  static readonly CTC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CTC", "임상시험센터(임)");
  static readonly CTS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CTS", "임상연구지원부(임)");
  static readonly CTR_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CTR", "임상의학연구센터(임)");
  static readonly RCT_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "RCT", "호흡치료팀");
  static readonly MDT_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "MDT", "다학제진료(암센터)");
  static readonly ICS_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "ICS", "감염관리실");
  static readonly VDR_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "VDR", "영상의학과(심뇌혈관센터)");
  static readonly WHC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "WHC", "웰에이징센터");
  static readonly CCC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "CCC", "암센터");
  static readonly HPC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HPC", "웰니스 건강증진센터");
  static readonly HIMG_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HIMG", "건진의학과(소화기클리닉)");
  static readonly HFM_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HFM", "건진의학과(가정의학클리닉)");
  static readonly HPIM_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "HPIM", "건진의학과외래");
  static readonly OTC_1     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OTC", "장기이식센터");
  static readonly OTGS_1    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_SEOUL,  "OTGS", "외과(장기이식센터)");

  static readonly IMC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "HPIM", "건강증진센터외래");
  static readonly IMN_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "CNSC", "뇌신경센터");
  static readonly IMA_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "SNR", "뇌졸중센터");
  static readonly IMH_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "PED", "소아청소년과(종합)");
  static readonly HP_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "PID", "소아청소년과(감염면역)");
  static readonly IMP_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "PTB", "소아청소년과(결핵예방)");
  static readonly QC_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "PEN", "소아청소년과(내분비)");
  static readonly GS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG, "PGN", "소아청소년과(소화기영양)");
  static readonly HPIM_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PNR", "소아청소년과(신경)");
  static readonly CNSC_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PNB", "소아청소년과(신생아)");
  static readonly SNR_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PKD", "소아청소년과(신장)");
  static readonly PED_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PCV", "소아청소년과(심장)");
  static readonly PID_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PHO", "소아청소년과(혈액종양)");
  static readonly PTB_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PAP", "소아청소년과(호흡알레르기)");
  static readonly PEN_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "HPPD", "유두종백신");
  static readonly PGN_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DM", "피부과");
  static readonly PNR_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "UR", "비뇨의학과");
  static readonly PNB_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "TR", "방사선종양학과");
  static readonly PKD_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "NM", "핵의학과");
  static readonly PCV_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "LM", "진단검사의학과");
  static readonly PHO_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "EWC", "여성암병원");
  static readonly PAP_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WGO", "부인종양센터");
  static readonly HPPD_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WBT", "유방갑상선암센터");
  static readonly DM_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WEN", "이비인후과(유방갑상선암센터)");
  static readonly UR_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WGS", "외과(유방갑상선암센터)");
  static readonly TR_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "RH", "재활의학과");
  static readonly NM_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "HL", "간센터/췌장담도센터");
  static readonly LM_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OEM", "직업환경의학과");
  static readonly EWC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OM", "특수검진");
  static readonly WGO_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PHC", "소아청소년검진");
  static readonly WBT_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CCM", "응급중환자진료과");
  static readonly WEN_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "ICS", "감염관리실");
  static readonly WGS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WOG", "부인종양OG");
  static readonly RH_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PS", "성형외과");
  static readonly HL_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OG", "산부인과");
  static readonly OEM_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OGHP", "건강여성백신");
  static readonly OM_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "UII", "위대장센터");
  static readonly PHC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WTR", "여성암TR");
  static readonly CCM_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WDR", "여성암협진DR");
  static readonly ICS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WFM", "여성암협진FM");
  static readonly WOG_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WIME", "여성암협진IME");
  static readonly PS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WIMH", "여성암협진IMH");
  static readonly OG_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WNM", "여성암협진NM");
  static readonly OGHP_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WNP", "여성암협진NP");
  static readonly UII_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WPS", "여성암협진PS");
  static readonly WTR_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "WRH", "여성암협진RH");
  static readonly WDR_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CRI", "융합의학연구원");
  static readonly WFM_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CTC", "임상시험센터");
  static readonly WIME_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CTS", "임상연구지원부");
  static readonly WIMH_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CTR", "임상의학연구센터");
  static readonly WNM_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IHC", "국제협력파트");
  static readonly WNP_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "HGS", "외과(간센터/췌장담도센터)");
  static readonly WPS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "GSZ", "비만수술센터");
  static readonly WRH_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CS", "흉부외과");
  static readonly CRI_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "NS", "신경외과");
  static readonly CTC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OS", "정형외과");
  static readonly CTS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "HS", "수부외과");
  static readonly CTR_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SNRNR", "신경과(뇌졸중센터)");
  static readonly IHC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SNRCS", "흉부외과(뇌졸중센터)");
  static readonly HGS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SNRDR", "영상의학과(뇌졸중센터)");
  static readonly GSZ_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SNRNS", "신경외과(뇌졸중센터)");
  static readonly CS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SNRRH", "재활의학과(뇌졸중센터)");
  static readonly NS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CVC", "심장혈관센터");
  static readonly OS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "JRC", "인공관절센터");
  static readonly HS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "NSC", "영양집중지원팀");
  static readonly SNRNR_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "EMO", "응급의학과외래");
  static readonly SNRCS_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DT", "치과");
  static readonly SNRDR_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "EY", "안과");
  static readonly SNRNS_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "EN", "이비인후과");
  static readonly SNRRH_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "NP", "정신건강의학과");
  static readonly CVC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CCC", "통합암센터");
  static readonly JRC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CGS", "외과(위대장센터)");
  static readonly NSC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CIMG", "소화기내과(위대장센터)");
  static readonly EMO_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CIMP", "호흡기내과(통합암센터)");
  static readonly DT_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "MDT", "다학제진료(통합암센터)");
  static readonly EY_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SC", "척추센터");
  static readonly EN_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SNS", "신경외과(척추센터)");
  static readonly NP_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SOS", "정형외과(척추센터)");
  static readonly CCC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SAN", "마취통증의학과(척추센터)");
  static readonly CGS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OTC", "장기이식센터");
  static readonly CIMG_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OTCS", "흉부외과(장기이식센터)");
  static readonly CIMP_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OTGS", "외과(장기이식센터)");
  static readonly MDT_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CGP", "가족암케어센터");
  static readonly SC_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "GC", "노인의학센터");
  static readonly SNS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "SLE", "수면센터");
  static readonly SOS_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IM", "내과");
  static readonly SAN_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IMO", "내과(일반)");
  static readonly OTC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IMD", "감염내과");
  static readonly OTCS_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PV", "예방접종과");
  static readonly OTGS_2    = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IME", "내분비내과");
  static readonly CGP_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IMR", "류마티스내과");
  static readonly GC_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "IMG", "소화기내과");
  static readonly SLE_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "NR", "신경과");
  static readonly IM_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "AN", "마취통증의학과");
  static readonly IMO_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "ANO", "마취통증의학과통증크리닉");
  static readonly IMD_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DS", "치과(종합)");
  static readonly PV_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PERIO", "치과치주과");
  static readonly IME_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "ORTHO", "치과교정과");
  static readonly IMR_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CONSE", "치과보존과");
  static readonly IMG_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PROST", "치과보철과");
  static readonly NR_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DA", "예진 및 스켈링");
  static readonly AN_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "ER", "권역응급의료센터");
  static readonly ANO_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "AER", "응급실");
  static readonly DS_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "HPC", "건강증진센터");
  static readonly PERIO_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PGE", "소아청소년과");
  static readonly ORTHO_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "PA", "병리과");
  static readonly CONSE_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CDC", "소아치과");
  static readonly PROST_2   = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DIC", "구강검진");
  static readonly DA_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "OMS", "구강악안면외과");
  static readonly ER_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "FM", "가정의학과");
  static readonly AER_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "EM", "응급의학과");
  static readonly HPC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DR", "영상의학과");
  static readonly PGE_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "DNR", "연명의료자문팀");
  static readonly PA_2      = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "GMBC", "국제진료");
  static readonly CDC_2     = new DepartmentTypeData(   CommonCodeConst.HIS_HSP_TP_CD_MOCKDONG,  "CRISD", "임상시험(CRIS)");





  static readonly LIST = [
    DepartmentType.DIMG_1   ,
    DepartmentType.DGS_1    ,
    DepartmentType.CCIMG_1  ,
    DepartmentType.CCGS_1   ,
    DepartmentType.CCIMH_1  ,
    DepartmentType.CCUR_1   ,
    DepartmentType.JSC_1    ,
    DepartmentType.JIMR_1   ,
    DepartmentType.JOS_1    ,
    DepartmentType.JAN_1    ,
    DepartmentType.JNS_1    ,
    DepartmentType.CCV_1    ,
    DepartmentType.VNS_1    ,
    DepartmentType.VIMC_1   ,
    DepartmentType.VNR_1    ,
    DepartmentType.VCS_1    ,
    DepartmentType.RC_1     ,
    DepartmentType.LIMD_1   ,
    DepartmentType.LIMA_1   ,
    DepartmentType.LIMP_1   ,
    DepartmentType.CCNS_1   ,
    DepartmentType.VPGE_1   ,
    DepartmentType.LCS_1    ,
    DepartmentType.CCS_1    ,
    DepartmentType.IM_1     ,
    DepartmentType.IMD_1    ,
    DepartmentType.PV_1     ,
    DepartmentType.IME_1    ,
    DepartmentType.IMR_1    ,
    DepartmentType.IMG_1    ,
    DepartmentType.IMC_1    ,
    DepartmentType.IMN_1    ,
    DepartmentType.IMA_1    ,
    DepartmentType.IMH_1    ,
    DepartmentType.HP_1     ,
    DepartmentType.IMP_1    ,
    DepartmentType.QC_1     ,
    DepartmentType.GS_1     ,
    DepartmentType.GSZ_1    ,
    DepartmentType.CS_1     ,
    DepartmentType.NS_1     ,
    DepartmentType.OS_1     ,
    DepartmentType.HS_1     ,
    DepartmentType.PS_1     ,
    DepartmentType.OG_1     ,
    DepartmentType.OGHP_1   ,
    DepartmentType.PED_1    ,
    DepartmentType.PGE_1    ,
    DepartmentType.PID_1    ,
    DepartmentType.PTB_1    ,
    DepartmentType.PEN_1    ,
    DepartmentType.PGN_1    ,
    DepartmentType.PNR_1    ,
    DepartmentType.PNB_1    ,
    DepartmentType.PKD_1    ,
    DepartmentType.PCV_1    ,
    DepartmentType.PHO_1    ,
    DepartmentType.PAP_1    ,
    DepartmentType.HPPD_1   ,
    DepartmentType.DM_1     ,
    DepartmentType.HPOG_1   ,
    DepartmentType.DNR_1    ,
    DepartmentType.DDC_1    ,
    DepartmentType.SLE_1    ,
    DepartmentType.GMBC_1   ,
    DepartmentType.JRH_1    ,
    DepartmentType.UR_1     ,
    DepartmentType.EY_1     ,
    DepartmentType.EN_1     ,
    DepartmentType.NP_1     ,
    DepartmentType.NR_1     ,
    DepartmentType.AN_1     ,
    DepartmentType.ANO_1    ,
    DepartmentType.DS_1     ,
    DepartmentType.DT_1     ,
    DepartmentType.PERIO_1  ,
    DepartmentType.ORTHO_1  ,
    DepartmentType.CONSE_1  ,
    DepartmentType.PROST_1  ,
    DepartmentType.DA_1     ,
    DepartmentType.CDC_1    ,
    DepartmentType.DIC_1    ,
    DepartmentType.OMS_1    ,
    DepartmentType.FM_1     ,
    DepartmentType.EM_1     ,
    DepartmentType.EMO_1    ,
    DepartmentType.DR_1     ,
    DepartmentType.TR_1     ,
    DepartmentType.NM_1     ,
    DepartmentType.LM_1     ,
    DepartmentType.PA_1     ,
    DepartmentType.RH_1     ,
    DepartmentType.OEM_1    ,
    DepartmentType.OM_1     ,
    DepartmentType.PHC_1    ,
    DepartmentType.CCM_1    ,
    DepartmentType.NSC_1    ,
    DepartmentType.ER_1     ,
    DepartmentType.AER_1    ,
    DepartmentType.IHC_1    ,
    DepartmentType.CRISD_1  ,
    DepartmentType.CTC_1    ,
    DepartmentType.CTS_1    ,
    DepartmentType.CTR_1    ,
    DepartmentType.RCT_1    ,
    DepartmentType.MDT_1    ,
    DepartmentType.ICS_1    ,
    DepartmentType.VDR_1    ,
    DepartmentType.WHC_1    ,
    DepartmentType.CCC_1    ,
    DepartmentType.HPC_1    ,
    DepartmentType.HIMG_1   ,
    DepartmentType.HFM_1    ,
    DepartmentType.HPIM_1   ,
    DepartmentType.OTC_1    ,
    DepartmentType.OTGS_1   ,
    DepartmentType.IMC_2    ,
    DepartmentType.IMN_2    ,
    DepartmentType.IMA_2    ,
    DepartmentType.IMH_2    ,
    DepartmentType.HP_2     ,
    DepartmentType.IMP_2    ,
    DepartmentType.QC_2     ,
    DepartmentType.GS_2     ,
    DepartmentType.HPIM_2   ,
    DepartmentType.CNSC_2   ,
    DepartmentType.SNR_2    ,
    DepartmentType.PED_2    ,
    DepartmentType.PID_2    ,
    DepartmentType.PTB_2    ,
    DepartmentType.PEN_2    ,
    DepartmentType.PGN_2    ,
    DepartmentType.PNR_2    ,
    DepartmentType.PNB_2    ,
    DepartmentType.PKD_2    ,
    DepartmentType.PCV_2    ,
    DepartmentType.PHO_2    ,
    DepartmentType.PAP_2    ,
    DepartmentType.HPPD_2   ,
    DepartmentType.DM_2     ,
    DepartmentType.UR_2     ,
    DepartmentType.TR_2     ,
    DepartmentType.NM_2     ,
    DepartmentType.LM_2     ,
    DepartmentType.EWC_2    ,
    DepartmentType.WGO_2    ,
    DepartmentType.WBT_2    ,
    DepartmentType.WEN_2    ,
    DepartmentType.WGS_2    ,
    DepartmentType.RH_2     ,
    DepartmentType.HL_2     ,
    DepartmentType.OEM_2    ,
    DepartmentType.OM_2     ,
    DepartmentType.PHC_2    ,
    DepartmentType.CCM_2    ,
    DepartmentType.ICS_2    ,
    DepartmentType.WOG_2    ,
    DepartmentType.PS_2     ,
    DepartmentType.OG_2     ,
    DepartmentType.OGHP_2   ,
    DepartmentType.UII_2    ,
    DepartmentType.WTR_2    ,
    DepartmentType.WDR_2    ,
    DepartmentType.WFM_2    ,
    DepartmentType.WIME_2   ,
    DepartmentType.WIMH_2   ,
    DepartmentType.WNM_2    ,
    DepartmentType.WNP_2    ,
    DepartmentType.WPS_2    ,
    DepartmentType.WRH_2    ,
    DepartmentType.CRI_2    ,
    DepartmentType.CTC_2    ,
    DepartmentType.CTS_2    ,
    DepartmentType.CTR_2    ,
    DepartmentType.IHC_2    ,
    DepartmentType.HGS_2    ,
    DepartmentType.GSZ_2    ,
    DepartmentType.CS_2     ,
    DepartmentType.NS_2     ,
    DepartmentType.OS_2     ,
    DepartmentType.HS_2     ,
    DepartmentType.SNRNR_2  ,
    DepartmentType.SNRCS_2  ,
    DepartmentType.SNRDR_2  ,
    DepartmentType.SNRNS_2  ,
    DepartmentType.SNRRH_2  ,
    DepartmentType.CVC_2    ,
    DepartmentType.JRC_2    ,
    DepartmentType.NSC_2    ,
    DepartmentType.EMO_2    ,
    DepartmentType.DT_2     ,
    DepartmentType.EY_2     ,
    DepartmentType.EN_2     ,
    DepartmentType.NP_2     ,
    DepartmentType.CCC_2    ,
    DepartmentType.CGS_2    ,
    DepartmentType.CIMG_2   ,
    DepartmentType.CIMP_2   ,
    DepartmentType.MDT_2    ,
    DepartmentType.SC_2     ,
    DepartmentType.SNS_2    ,
    DepartmentType.SOS_2    ,
    DepartmentType.SAN_2    ,
    DepartmentType.OTC_2    ,
    DepartmentType.OTCS_2   ,
    DepartmentType.OTGS_2   ,
    DepartmentType.CGP_2    ,
    DepartmentType.GC_2     ,
    DepartmentType.SLE_2    ,
    DepartmentType.IM_2     ,
    DepartmentType.IMO_2    ,
    DepartmentType.IMD_2    ,
    DepartmentType.PV_2     ,
    DepartmentType.IME_2    ,
    DepartmentType.IMR_2    ,
    DepartmentType.IMG_2    ,
    DepartmentType.NR_2     ,
    DepartmentType.AN_2     ,
    DepartmentType.ANO_2    ,
    DepartmentType.DS_2     ,
    DepartmentType.PERIO_2  ,
    DepartmentType.ORTHO_2  ,
    DepartmentType.CONSE_2  ,
    DepartmentType.PROST_2  ,
    DepartmentType.DA_2     ,
    DepartmentType.ER_2     ,
    DepartmentType.AER_2    ,
    DepartmentType.HPC_2    ,
    DepartmentType.PGE_2    ,
    DepartmentType.PA_2     ,
    DepartmentType.CDC_2    ,
  ];

  static getTypeByDeptCode(his_hsp_tp_cd: string, dept_code: string): DepartmentTypeData {
    const arr = DepartmentType.LIST.filter((val, idx)=>{
      return (val.hospital == his_hsp_tp_cd && val.code == dept_code);
    });

    if(arr.length > 0){ return arr[0]; }
    else { return null }
  }

  static getTypeByDeptName(his_hsp_tp_cd: string, dept_name: string): DepartmentTypeData {
    const arr = DepartmentType.LIST.filter((val, idx)=>{
      return (val.hospital == his_hsp_tp_cd && val.name == dept_name);
    });

    if(arr.length > 0){ return arr[0]; }
    else { return null }
  }


}
