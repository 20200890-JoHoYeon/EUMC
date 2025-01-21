/**
 * 진료비세부내역서(외래) - CASQ_S170 응답
 */
export class McstDtoPtclInfoDto {
  orddate2: string;//오더일자 - 예."20190125"
  codename: string;//항목 - 예."진 찰 료"
  meddept: string;//진료과명
  rcpseq: string;
  sortseq: string;
  patname: string;//환자성명
  orddate: string;//오더일자 - 예."2019-01-25"
  meddr: string;//진료의사사번 - 예."00224"
  pattype: string;//급종구분 - 예."BB-000"
  sugacode: string;//수가코드 - 예.원본"AL020      A5020"->set함수결과"A5020"
  useqty: string;//사용수량(횟수) - 예."1.0"
  useday: string;//처방일수 - 예."1"
  price: string;//단가(금액)
  spctype: string;//선택진료비 - 예." " 또는 ""
  instype: string;
  sumprice1: string;//총액(=totamt+spcamt)
  insyn: string;
  insamt: string;//급여_본인부담금
  insreq: string;//급여_공단부담금
  insall: string;//급여_전액본인부담
  uncamt: string;//비급여
  spcamt: string;//비급여_선택진료료(=0)
  uinamt: string;//비급여_선택진료료이외(=uncamt-spcamt)
  totamt: string;//총액
  insownamt: string;
  toinsreq: string;
  toinsall: string;
  touncamt: string;
  korname: string;//EDI그룹명 - 예."초진료(6세이상)(가1가(4))"
  edicode: string;//EDI코드 - 예."AA156"
  lcns_no: string;//의사면허번호
  dr_nm: string;//진료의사명
  accucd: string;//수가누적분류코드 - 예."18"

  public static fromXml(target: McstDtoPtclInfoDto, xmlData){
    target.orddate2 = xmlData.ORDDATE2;
    target.codename =  xmlData.CODENAME;
    target.meddept =  xmlData.MEDDEPT;
    target.rcpseq =  xmlData.RCPSEQ;
    target.sortseq =  xmlData.SORTSEQ;
    target.patname =  xmlData.PATNAME;
    target.orddate =  xmlData.ORDDATE;
    target.meddr =  xmlData.MEDDR;
    target.pattype =  xmlData.PATTYPE;
    target.sugacode =  xmlData.SUGACODE;
    target.useqty =  xmlData.USEQTY;
    target.useday =  xmlData.USEDAY;
    target.price =  xmlData.PRICE;
    target.spctype =  xmlData.SPCTYPE;
    target.instype =  xmlData.INSTYPE;
    target.sumprice1 =  xmlData.SUMPRICE1;
    target.insamt =  xmlData.INSAMT;
    target.insreq =  xmlData.INSREQ;
    target.insall =  xmlData.INSALL;
    target.uncamt =  xmlData.UNCAMT;
    target.totamt =  xmlData.TOTAMT;
    target.insownamt =  xmlData.INSOWNAMT;
    target.toinsreq =  xmlData.TOINSREQ;
    target.toinsall =  xmlData.TOINSALL;
    target.touncamt =  xmlData.TOUNCAMT;
    target.korname =  xmlData.KORNAME;
    target.edicode =  xmlData.EDICODE;
    target.lcns_no =  xmlData.LCNS_NO;
    target.dr_nm =  xmlData.DR_NM;
    target.accucd = xmlData.ACCUCD;

    return target;
  }


  public setSpcamt(spcamt: string) {
    if(spcamt != null) {
      this.spcamt = '0';
    }
  }



  public setUinamt(uinamt: string) {
    if (uinamt != null) {
      let temp = Number(uinamt) - Number(this.spcamt);
      this.uinamt = temp.toString();
    }
  }


  public setInsyn(insyn: string) {
    if (insyn != null) {
      let ynflag = 'Y';
      let temp = Number(this.uncamt);
      if (temp > 0) {
        ynflag = 'N';
      }
      this.insyn = ynflag;
    }
  }

  public setSugacode(sugacode: string) {
    if (sugacode != null) {
      let temp = sugacode;
      try{
        let codes = sugacode.split(' ');
        temp = codes[1];
        temp = temp.replace("\\p{Z}", "")

        this.sugacode = temp;
      }catch (e) {
        this.sugacode = temp;
      }
    }
  }








  }
