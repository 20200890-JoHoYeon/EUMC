export class WaittingNumberSeoul {
  TASK: string;
  AREA: number;
  GROUP: string;
  DIV_ID: number;
  DESCRIPT: string;
  WAITING: number;

  constructor(
    TASK: string,
    AREA: number,
    GROUP: string,
    DIV_ID: number,
    DESCRIPT: string,
    WAITING: number,
  ) {
    this.TASK     = TASK    ;
    this.AREA     = AREA    ;
    this.GROUP    = GROUP   ;
    this.DIV_ID   = DIV_ID  ;
    this.DESCRIPT = DESCRIPT;
    this.WAITING  = WAITING ;
  }
}
