export class ReqRsvToday {
  IN_QUREY_TYPE: string;//조회구분	3 : 당일 일정
  IN_HSP_TP_CD: string;//병원구분	서울(01), 목동(02)
  IN_PT_NO: string;//환자번호
  IN_FROM_DT: string;//조회 시작일자	YYYYMMDD
  IN_TO_DT: string = '';//사용 안함.	빈값
  IN_DUMMY1: string;//당일 / 다가오는 일정 조회 구분자	1 : 다가오는 일정 / 2 : 당일 일정
}


