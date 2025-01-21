export class MedicalCertificateInsurance{
  his_hsp_tp_cd: string;
  patno: string;
  meddept: string;
  certdate: string;
  mainKcd: string;
  mainKcdName: string;
  noMainKcd: string;
  noMainKcdName: string;

  constructor(his_hsp_tp_cd: string, patno: string, med_dept: string, cert_date: string, dg_nm: string) {
    const result = {} as MedicalCertificateInsurance;

    let dgnm = dg_nm.replace("\\n", "");
    let mainKcdData = null;
    let mainKcd = null;
    let mainKcdName = null;
    let noMainKcdData = null;
    let noMainKcd = null;
    let noMainKcdName = null;

    if(dgnm.includes('[부]')) {
      mainKcdData = dgnm.substring(dgnm.indexOf("[주]"), dgnm.indexOf("[부]"));
      mainKcd = mainKcdData.substring(mainKcdData.lastIndexOf("{"))
        .replace("{", "").replace("}", "").trim();
      mainKcdName = mainKcdData.substring(0, mainKcdData.lastIndexOf("{")).replace("[주]", "").trim();

      noMainKcdData = dgnm.substring(dgnm.indexOf("[부]"));
      noMainKcd = noMainKcdData.substring(noMainKcdData.lastIndexOf("{")).replace("{", "").replace("}", "").trim();
      noMainKcdName = noMainKcdData.substring(0, noMainKcdData.lastIndexOf("{")).replace("[부]", "").trim();
    }else{
      mainKcdData = dgnm.substring(dgnm.indexOf('[주]'));
      mainKcd = mainKcdData.substring(mainKcdData.lastIndexOf('{'))
        .replace('{','').replace('}', '').trim();
      mainKcdName = mainKcdData.substring(0, mainKcdData.lastIndexOf('{')).replace('[주]','').trim();
    }

    result.mainKcd = mainKcd;
    result.mainKcdName = mainKcdName;
    result.noMainKcd = noMainKcd;
    result.noMainKcdName = noMainKcdName;

    result.his_hsp_tp_cd = his_hsp_tp_cd;
    result.patno = patno;
    result.meddept = med_dept;
    result.certdate = cert_date;

    return result;
  }


}
