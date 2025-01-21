import { CommonCodeConst } from "./common-code.const";

export class InsuranceTypeData {
  readonly code: string;
  readonly name: string;

  constructor(code: string, desc: string) {
    this.code = code;
    this.name = desc;
  }

  toString(): string {
    return `code: ${this.code}, desc: ${this.name}`;
  }
}


export class InsuranceType {
  static readonly AA  = new InsuranceTypeData(    "AA",  "일반환자");
  static readonly BB  = new InsuranceTypeData(    "BB",   "국민건강보험공단");
  static readonly CB  = new InsuranceTypeData(    "CB",  "의학연구소");
  static readonly CD  = new InsuranceTypeData(    "CD",  "자비연구용");
  static readonly E1  = new InsuranceTypeData(    "E1",  "의료급여1종");
  static readonly E2  = new InsuranceTypeData(    "E2",  "의료급여2종");
  static readonly E6  = new InsuranceTypeData(    "E6",   "의료급여장애인");
  static readonly GG  = new InsuranceTypeData(    "GG",  "학구환자");
  static readonly KA  = new InsuranceTypeData(     "KA", "건진센터");
  static readonly LA  = new InsuranceTypeData(     "LA", "수탁(일반환자)");
  static readonly LB  = new InsuranceTypeData(     "LB", "수탁공단(보험)");
  static readonly LE  = new InsuranceTypeData(     "LE", "수탁(의료급여)");
  static readonly SA  = new InsuranceTypeData(     "SA", "산재환자");
  static readonly TD  = new InsuranceTypeData(     "TD", "자동차보험");


  static readonly LIST = [
    InsuranceType.AA  ,
    InsuranceType.BB  ,
    InsuranceType.CB  ,
    InsuranceType.CD  ,
    InsuranceType.E1  ,
    InsuranceType.E2  ,
    InsuranceType.E6  ,
    InsuranceType.GG  ,
    InsuranceType.KA  ,
    InsuranceType.LA  ,
    InsuranceType.LB  ,
    InsuranceType.LE  ,
    InsuranceType.SA  ,
    InsuranceType.TD  ,
  ];

  static getTypeByCode(code: string): InsuranceTypeData {
    const arr = InsuranceType.LIST.filter((val, idx)=>{
      return (val.code == code);
    });

    if(arr.length > 0){ return arr[0]; }
    else { return null }
  }

  static getTypeByName(name: string): InsuranceTypeData {
    const arr = InsuranceType.LIST.filter((val, idx)=>{
      return (val.name == name);
    });

    if(arr.length > 0){ return arr[0]; }
    else { return null }
  }


}
