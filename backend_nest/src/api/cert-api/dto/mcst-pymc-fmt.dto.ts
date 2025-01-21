/**
 * 진료비납입확인서(연말정산용)
 */
export interface McstPymcFmtDto {
  orddate: string;
  patsite: string;
  deptname: string;
  totamt: string;
  reqamt: string;
  ownamt: string;
  cardamt: string;
  cashamt: string;
  rcpamt: string;
}
