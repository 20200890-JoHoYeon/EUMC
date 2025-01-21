import { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { AccordionList } from 'accordion-collapse-react-native';
import { ListItem } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { Color, Typography } from '../../styles';
import { ALLOWED_SCREENS } from '../../constants';
import { getExamHistory, getMedicalHistory, getDrugHistory } from '../../api/v1/reservation';
import { UserContext } from '../../context';
import { SORT_DATE, formatDate5 } from '../../utils';
import { EmptyList } from '../../components';
import { getPaymentListDtl } from '../../api/v1/payment';
import { primaryDarkgreen2, primaryTurquoise } from '../../styles/colors';
import { microXX, small, smallXX, smallXXBold } from '../../styles/typography';
import { Accordion } from '../../components/List';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  rangeTextContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Color.calendar.darkgreen2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',

    backgroundColor: Color.calendar.darkgreen2,
    marginHorizontal: 16,
    height: 42,
  },
  rangeText: {
    paddingVertical: 10,
    fontSize: 16,
    lineHeight: 19,
    color: Color.homeColor.primaryWhite,
  },
  quickSelectContainer: {
    //flex: 1,
    paddingVertical: 12,
    width: '100%',
    margin: 0,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  examHeader: {
    justifyContent: 'center',
    flexDirection: 'row',
    borderColor: '#dddddd',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  examHeaderText: {
    flex: 1,
    //textAlign:'left',
    fontSize: 16,
    lineHeight: 19,
    color: '#0e6d68',
    marginTop: 2,
    marginBottom: 14,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  staticHeader: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    backgroundColor: '#eee',
    marginTop: 32,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 4,
    fontSize: 14,
  },
  examBody: {
    marginTop: 15,
    paddingTop: 2,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingBottom: 5,
    marginHorizontal: 10,
  },
  body: {
    padding: 10,
    margin: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  bodyTextContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  bodyNolineTextContainer: {
    //marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  examBodyTextContainer: {
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  prescriptionDetailContainer: {
    marginHorizontal: 5,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  paymentTotalContainer: {
    marginHorizontal: 16,
    flexDirection: 'column',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  paymentTotalSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginVertical: 0,
  },
  paymentDetailContainer: {
    marginHorizontal: 16,
    flexDirection: 'column',
  },
  paymentTotalText: {
    marginTop: 6,
    lineHeight: 22,
    letterSpacing: -0.56,
  },
  paymentTotalSubText: {
    color: '#666',
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.48,
  },
  bodyText: {
    textAlign: 'center',
    fontSize: 14,
    //  lineHeight: 17,
  },
  examTitleText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#777',
    lineHeight: 20,
  },
  examBodyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  fineText: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -1,
    textAlign: 'right',
    color: '#000',
    marginRight: 8,
  },
  fineTitleText: {
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: -1,
    textAlign: 'center',
    color: '#666',
  },
  diagnosisPaymentView: {
    flex: 1,
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  rowSpaceEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  /** */
  contentTextMicro: {
    ...microXX,
    fontWeight: 500,
    color: '#555',
    paddingVertical: 5,
    lineHeight: 18,
  },
  contentTextSmall: {
    ...small,
    fontWeight: 500,
    color: '#555',
    paddingVertical: 5,
    lineHeight: 18,
  },
  contentDetailTextMicro: {
    ...microXX,
    fontWeight: 500,
    color: Color.darkGray,
    paddingVertical: 5,
    lineHeight: 18,
  },
  contentDetailTextSmall: {
    ...small,
    fontWeight: 500,
    color: Color.darkGray,
    paddingVertical: 5,
    lineHeight: 18,
  },
  emptyListText: {
    ...smallXX,
    color: Color.homeColor.primaryBlack,
    lineHeight: 20,
    marginTop: 16,
  },
  cardLayout: {
    marginTop: 15,
    paddingHorizontal: 16,
    // width: windowWidth - 32,
    minHeight: 100,
    backgroundColor: Color.homeColor.primaryWhite,
    shadowColor: Color.inputColor.black,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 9.84,
    elevation: 5,
    borderRadius: 10,
  },
  cardLayoutTitle: {
    ...smallXXBold,
    color: primaryDarkgreen2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
  },
  ...Typography,
  infoText: {
    ...small,
    fontSize: 12,
    color: Color.homeColor.primaryDarkPurple,
    lineHeight: 28,
    marginTop: 1,
    marginHorizontal: 6,
  },
  examList: { marginTop: 8, backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 16 },
  prescriptionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    width: '100%',
    backgroundColor: Color.homeColor.primaryWhite,
    borderRadius: 10,
    marginBottom: 10,
  },
  drugTitle: { flex: 1, fontSize: 14, color: '#000', lineHeight: 26 },
  drugText: {
    flex: 2.5,
    color: '#000',
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 24,
    letterSpacing: -0.72,
  },
  drugDetailText: { fontSize: 14, color: '#000', lineHeight: 31, letterSpacing: -0.56 },
  examTypeLabel: { justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
  examDetail: {
    borderColor: '#16b1a9',
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    paddingHorizontal: 9,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const HistoryDetail = ({ navigation, route, type }) => {
  if (!ALLOWED_SCREENS.includes(type)) {
    throw new Error('알 수 없는 조회 페이지 유형입니다.');
  }
  const { calData } = route.params;

  const [history, setHistory] = useState([]);
  const { loadingVisible, setLoadingVisible, code, medicalCards, currentMedicalCardIndex } = useContext(UserContext);
  const { patientNumber } = medicalCards[currentMedicalCardIndex];
  useEffect(() => {
    switch (type) {
      case 'Diagnosis':
        getExamHistory(
          code,
          patientNumber,
          patientNumber,
          calData.start.date.replace(/-/g, ''),
          calData.end.date.replace(/-/g, '')
        )
          .then(res => {
            const { ok, data, resultCode, resultMsg } = res.data;
            console.log(JSON.stringify(res.data));
            if (ok) {
              setHistory(data.sort((a, b) => SORT_DATE(a.ACPT_DT, b.ACPT_DT)) || []);
            } else {
            }
            setLoadingVisible(false);
          })
          .catch(e => console.log('err', e));

        // getExamRsvList(
        //   patientNumber,
        //   code
        // )
        //   .then(res => {
        //     const { ok, data, resultCode, resultMsg } = res.data;
        //     console.log(`getExamRsvList : ${JSON.stringify(res.data)}`)
        //     if (ok) setHistory(data || []);
        //     else {
        //     }
        //     setLoadingVisible(false);
        //   })
        //   .catch(e => console.log('err', e));

        break;
      case 'Payment':
        getPaymentListDtl(code, patientNumber, calData.start.date.replace(/-/g, ''), calData.end.date.replace(/-/g, ''))
          .then(res => {
            const { ok, data, resultCode, resultMsg } = res.data;
            // console.log(`getPaymentList : ${JSON.stringify(res.data)}`);
            if (ok) setHistory(data || []);
            else {
            }
            setLoadingVisible(false);
          })
          .catch(e => console.log(e));
        break;
      case 'Prescription':
        getDrugHistory(
          code,
          patientNumber,
          patientNumber,
          calData.start.date.replace(/-/g, ''),
          calData.end.date.replace(/-/g, '')
        )
          // getPrescriptionnHistory(code, patientNumber, calData.start.date.replace(/-/g, ''), '10001', '')
          .then(res => {
            const { ok, data, resultCode, resultMsg } = res.data;
            // console.log(`getPrescriptionnHistory : ${JSON.stringify(res.data)}`);
            if (ok) setHistory(data || []);
            else {
            }
            setLoadingVisible(false);
          })
          .catch(e => console.log(e));
        break;
      case 'Treatment':
        getMedicalHistory(
          code,
          patientNumber,
          patientNumber,
          calData.start.date.replace(/-/g, ''),
          calData.end.date.replace(/-/g, '')
        )
          .then(res => {
            const { ok, data, resultCode, resultMsg } = res.data;
            if (ok) setHistory(data || []);
            else {
            }
            setLoadingVisible(false);
          })
          .catch(e => console.log('err', e));
        break;
    }
    //     const xmls = `<?xml version="1.0" encoding="utf-8"?>
    // <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://schemas.xmlsoap.org/soap/envelope/">
    //   <soap12:Body>
    //     <MOBILEINTERFACE_SEL_RPYLIST xmlns="http://tempuri.org/">
    //       <IN_QUREY_TYPE>2</IN_QUREY_TYPE>
    //       <IN_HSP_TP_CD>01</IN_HSP_TP_CD>
    //       <IN_PT_NO>96476189</IN_PT_NO>
    //       <IN_FROM_DT>${calData.start.date.replace(/-/g, '')}</IN_FROM_DT>
    //       <IN_TO_DT>${calData.end.date.replace(/-/g, '')}</IN_TO_DT>
    //       <IN_DUMMY1></IN_DUMMY1>
    //     </MOBILEINTERFACE_SEL_RPYLIST>
    //   </soap12:Body>
    // </soap12:Envelope>`;
    //     axios
    //       .post('https://esysinf.eumc.ac.kr/PA/Paking/Service1.asmx', xmls, { headers: { 'Content-Type': 'text/xml' } })
    //       .then(res => {
    //         const xml = new XMLParser().parseFromString(res.data);
    //         const rpyPactId = {};
    //         setHistory(
    //           xml
    //             .getElementsByTagName('MOBILEINTERFACE_SEL_RPYLIST')
    //             .map(val => val.children.reduce((r, v) => Object.assign(r, { [v.name]: v.value })))
    //             .filter((val, i, self) => {
    //               if (rpyPactId[val.RPY_PACT_ID]) {
    //                 self[rpyPactId[val.RPY_PACT_ID]].RCPAMT += `=>${val.RCPAMT}`;
    //                 return false;
    //               }
    //               self[i][val.name] = val.value;
    //               delete self[i].name;
    //               delete self[i].value;
    //               delete self[i].attributes;
    //               delete self[i].children;
    //               delete self[i].getElementsByTagName;
    //               return (rpyPactId[val.RPY_PACT_ID] = i);
    //             })
    //             .sort((a, b) => new Date(a.RPY_DT).getTime() - new Date(b.RPY_DT).getTime())
    //         );
    //})
    // .catch(err => console.log(err));
    setTimeout(() => loadingVisible && setLoadingVisible(false), 5000);
  }, []);

  const getEmptyText = type => {
    switch (type) {
      case 'Diagnosis':
        return (
          <EumcText fontWeight="bold" style={styles.emptyListText}>
            조회 기간에 따른 검사내역이 없습니다.
          </EumcText>
        );
      case 'Payment':
        return (
          <EumcText fontWeight="bold" style={styles.emptyListText}>
            조회 기간에 따른 결제내역이 없습니다.
          </EumcText>
        );
      case 'Prescription':
        return (
          <EumcText fontWeight="bold" style={styles.emptyListText}>
            조회 기간에 따른 처방내역이 없습니다.
          </EumcText>
        );
      case 'Treatment':
        return (
          <EumcText fontWeight="bold" style={styles.emptyListText}>
            진료이력이 없습니다.
          </EumcText>
        );
    }
  };

  const DetailText = ({ children }) => <EumcText style={styles.paymentTotalText}>{children}</EumcText>;
  const SubText = ({ children }) => <EumcText style={styles.paymentTotalSubText}>{children}</EumcText>;
  const DrugCardText = ({ title, value }) => (
    <View style={styles.bodyNolineTextContainer}>
      <EumcText style={styles.drugDetailText}>{title}</EumcText>
      <EumcText style={styles.drugDetailText}>{value}</EumcText>
    </View>
  );
  const FineTitleText = ({ children, style }) => <EumcText style={[styles.fineTitleText, style]}>{children}</EumcText>;
  const FineText = ({ children }) => <EumcText style={[styles.fineText]}>{children}</EumcText>;
  const DiagnosisPaymentView = ({ children }) => <View style={styles.diagnosisPaymentView}>{children}</View>;
  const PaymentList = () => {
    /**
     * [{"HSP_TP_NM":"이대서울","DEPT_NM":"피부과","RPY_DT":"2023-04-11","RCPAMT":"102,850","RPY_PACT_ID":"1011546741",
     * "DETAIL":[
     * {"DEPT_NM":"피부과","RPY_DT":"2023-04-11","MED_DT":"2023-04-11","MEDR_NM":"노주영","TOTAMT":"346073","REQAMT":"159073","OWNAMT":"187000","RCPAMT":"102850"}]}
     */

    return (
      <View style={{ backgroundColor: '#fff', height: '100%', paddingHorizontal: 16 }}>
        <View style={styles.staticHeader}>
          <EumcText style={styles.headerText} fontWeight="bold">
            병원
          </EumcText>
          <EumcText style={styles.headerText} fontWeight="bold">
            진료과
          </EumcText>
          <EumcText style={styles.headerText} fontWeight="bold">
            결제 일시
          </EumcText>
          <EumcText style={styles.headerText} fontWeight="bold">
            결제 금액
          </EumcText>
        </View>
        <AccordionList
          list={history}
          header={item => (
            <View style={styles.header}>
              <EumcText style={styles.headerText} fontWeight="regular">
                {item.HSP_TP_NM}
              </EumcText>
              <EumcText style={styles.headerText} fontWeight="regular" numberOfLines={1}>
                {item.DEPT_NM}
              </EumcText>
              <EumcText style={styles.headerText} fontWeight="regular">
                {item.RPY_DT}
              </EumcText>
              <EumcText
                style={[styles.headerText, { borderColor: '#dddddd' }]}
                fontWeight="regular"
              >{`${item.RCPAMT}원`}</EumcText>
            </View>
          )}
          body={item => (
            <View style={[styles.body, { borderWidth: 0, borderBottomWidth: 0 }]}>
              <View style={styles.bodyTextContainer}>
                <EumcText>진료 일자</EumcText>
                <EumcText style={styles.bodyText}>{item.DETAIL[0].MED_DT}</EumcText>
              </View>
              <View style={styles.bodyTextContainer}>
                <EumcText>진료과</EumcText>
                <EumcText style={styles.bodyText}>{item.DETAIL[0].DEPT_NM}</EumcText>
              </View>
              <View style={styles.bodyTextContainer}>
                <EumcText>의사명</EumcText>
                <EumcText style={styles.bodyText}>{item.DETAIL[0].MEDR_NM}</EumcText>
              </View>
              <View style={styles.paymentTotalContainer}>
                <View style={styles.paymentTotalSubContainer}>
                  <DetailText>진료비 총액</DetailText>
                  <DetailText>{`${new Intl.NumberFormat().format(item.DETAIL[0].TOTAMT)}원`}</DetailText>
                </View>
                <View style={styles.paymentTotalSubContainer}>
                  <SubText>· 공단부담금액</SubText>
                  <SubText>{`${new Intl.NumberFormat().format(item.DETAIL[0].REQAMT)}원`}</SubText>
                </View>
                <View style={styles.paymentTotalSubContainer}>
                  <SubText>· 환자부담총액</SubText>
                  <SubText>{`${new Intl.NumberFormat().format(item.DETAIL[0].OWNAMT)}원`}</SubText>
                </View>
              </View>
              <View style={styles.bodyTextContainer}>
                <EumcText>영수액</EumcText>
                <EumcText style={styles.bodyText}>{`${new Intl.NumberFormat().format(
                  item.DETAIL[0].RCPAMT
                )}원`}</EumcText>
              </View>
              <View style={styles.paymentDetailContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <EumcText>감액/미수</EumcText>
                  <EumcText style={styles.bodyText}>{`${new Intl.NumberFormat().format(
                    item.DETAIL[0].ROOE_AMT ?? 0
                  )}원`}</EumcText>
                </View>
                {/* 4.24 상세보기 기능 삭제
                {detailVisible && (
                  <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#666',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <EumcText style={{ color: '#fff' }}>항목</EumcText>
                      </View>
                      <View style={{ flexDirection: 'column', flex: 3 }}>
                        <View style={{ backgroundColor: '#0e6d68', alignItems: 'center', justifyContent: 'center' }}>
                          <FineTitleText style={{ color: '#fff', marginVertical: 10 }}>급여</FineTitleText>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            paddingVertical: 8,
                            backgroundColor: '#ddd',
                          }}
                        >
                          <View>
                            <FineTitleText>본인{'\n'}부담금</FineTitleText>
                          </View>
                          <View>
                            <FineTitleText>공단{'\n'}부담금</FineTitleText>
                          </View>
                          <View>
                            <FineTitleText>전액{'\n'}본인부담</FineTitleText>
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 2 }}>
                        <View style={{ backgroundColor: '#16aea6', alignItems: 'center', justifyContent: 'center' }}>
                          <FineTitleText style={{ color: '#fff', marginVertical: 10 }}>비급여</FineTitleText>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            paddingVertical: 8,
                            backgroundColor: '#ddd',
                          }}
                        >
                          <View>
                            <FineTitleText>선택{'\n'}진료료</FineTitleText>
                          </View>
                          <View>
                            <FineTitleText>선택{'\n'}진료료 이외</FineTitleText>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.rowSpaceEvenly}>
                      <View
                        style={{
                          backgroundColor: '#ddd',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          marginBottom: 10,
                        }}
                      >
                        <FineTitleText style={{ color: '#666', paddingVertical: 16 }}>검사료</FineTitleText>
                      </View>
                      <DiagnosisPaymentView>
                        <FineText>{new Intl.NumberFormat().format(item.custom_out_tot_insown)}</FineText>
                      </DiagnosisPaymentView>
                      <DiagnosisPaymentView>
                        <FineText>{new Intl.NumberFormat().format(item.custom_out_tot_insreq)}</FineText>
                      </DiagnosisPaymentView>
                      <DiagnosisPaymentView>
                        <FineText>{new Intl.NumberFormat().format(item.custom_out_tot_insall)}</FineText>
                      </DiagnosisPaymentView>
                      <DiagnosisPaymentView>
                        <FineText>{new Intl.NumberFormat().format(item.custom_out_tot_spc)}</FineText>
                      </DiagnosisPaymentView>
                      <DiagnosisPaymentView>
                        <FineText>{new Intl.NumberFormat().format(item.custom_out_tot_rpy_amt)}</FineText>
                      </DiagnosisPaymentView>
                    </View>
                  </View>
                )}
                <RoundBorderInnerBtn
                  onPress={() => setDetailVisible(!detailVisible)}
                  style={{
                    borderColor: '#16b1a9',
                    marginTop: 15,
                    paddingVertical: 8,
                    backgroundColor: '#16b1a9',
                    borderRadius: 6,
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      textAlign: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EumcText style={{ fontSize: 16, lineHeight: 19, textAlign: 'center', color: '#fff' }}>
                      {!detailVisible ? '상세보기' : '상세 접기'}
                    </EumcText>
                  </View>
                </RoundBorderInnerBtn> */}
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  };
  const MedicalList = () => (
    <ScrollView
      height={'100%'}
      style={{ marginTop: 8, backgroundColor: '#fff' }}
      contentContainerstyle={{ marginHorizontal: 0 }}
    >
      {history ? (
        history.map((item, index) => (
          <ListItem
            key={item.PACT_ID}
            containerStyle={{ margin: 0, padding: 0, backgroundColor: index % 2 === 0 ? '#fff' : '#f5f5f5' }}
          >
            <ListItem.Content>
              <View style={{ flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 20 }}>
                <View style={{ flex: 1.2 }}>
                  <EumcText style={styles.contentTextSmall} fontWeight="bold">
                    병원
                  </EumcText>
                  <EumcText style={styles.contentTextSmall} fontWeight="bold">
                    진료과
                  </EumcText>
                  <EumcText style={styles.contentTextSmall} fontWeight="bold">
                    진료의
                  </EumcText>
                  {/*<EumcText style={styles.contentTextSmall} fontWeight="bold">*/}
                  {/*  검사 항목*/}
                  {/*</EumcText>*/}
                  <EumcText style={styles.contentTextSmall} fontWeight="bold">
                    진료 일자
                  </EumcText>
                </View>
                <View style={{ flex: 3 }}>
                  <EumcText style={styles.contentDetailTextSmall}>{item.HSP_TP_NM}</EumcText>
                  <EumcText style={styles.contentDetailTextSmall}>{item.DEPT_NM}</EumcText>
                  <EumcText style={styles.contentDetailTextSmall}>{item.MEDR_NM}</EumcText>
                  {/*<EumcText style={styles.contentDetailTextSmall}> </EumcText>*/}
                  <EumcText style={styles.contentDetailTextSmall}>{item.MED_DT}</EumcText>
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        ))
      ) : (
        <EmptyList emptyText={getEmptyText(type)} />
      )}
    </ScrollView>
  );
  const ExamList = () => {
    const examGroup = history.reduce((obj, item) => {
      const key = item.ACPT_DT.substring(0, 10);
      if (obj[key]) obj[key].push(item);
      else return Object.assign(obj, { [key]: [item] });
      return obj;
    }, {});
    const groupKeys = Object.keys(examGroup);
    return (
      <ScrollView contentContainerStyle={styles.examList}>
        {groupKeys.length > 0 &&
          groupKeys.map((date, index) => (
            <View key={index} style={styles.cardLayout}>
              <EumcText style={styles.cardLayoutTitle}>{formatDate5(date)}</EumcText>
              <View style={{ paddingVertical: 6 }}>
                {examGroup[date].length > 0 &&
                  examGroup[date].map((exam, index) => (
                    <Accordion
                      key={index}
                      title={exam.EXM_CTG_ABBR_NM}
                      activeTitleStyle={{
                        color: primaryTurquoise,
                        fontSize: 14,
                        letterSpacing: -0.56,
                      }}
                      titleStyle={{
                        color: '#333',
                        fontSize: 14,
                        letterSpacing: -0.56,
                      }}
                    >
                      <ListItem
                        containerStyle={{
                          backgroundColor: '#f5f5f5',
                          borderRadius: 10,
                          marginBottom: 14,
                        }}
                      >
                        <ListItem.Content style={{ flexDirection: 'row' }}>
                          <View style={{ flex: 1 }}>
                            <EumcText style={styles.contentTextMicro} fontWeight="bold">
                              병원
                            </EumcText>
                            <EumcText style={styles.contentTextMicro} fontWeight="bold">
                              진료과
                            </EumcText>
                            <EumcText style={styles.contentTextMicro} fontWeight="bold">
                              검사실
                            </EumcText>
                            <EumcText style={styles.contentTextMicro} fontWeight="bold">
                              검사 항목
                            </EumcText>
                            <EumcText style={styles.contentTextMicro} fontWeight="bold">
                              검사 구분
                            </EumcText>
                            <EumcText style={styles.contentTextMicro} fontWeight="bold">
                              진료 일자
                            </EumcText>
                          </View>
                          <View style={{ flex: 3 }}>
                            <EumcText style={styles.contentDetailTextMicro}>{exam.HSP_TP_NM ?? '-'}</EumcText>
                            <EumcText style={styles.contentDetailTextMicro}>{exam.DEPT_NM ?? '-'}</EumcText>
                            <EumcText style={styles.contentDetailTextMicro}>
                              {exam.TYPE === 'DIAG' ? '체혈실' : exam.EXM_CTG_ABBR_NM}
                            </EumcText>
                            <View style={styles.examTypeLabel}>
                              <EumcText style={styles.contentDetailTextMicro}>{exam.EXRM_TYPE ?? '-'}</EumcText>
                              {exam.TYPE === 'DIAG' && (
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.push('ExamDetail', { date: exam.ACPT_DT, data: exam.DETAIL })
                                  }
                                  style={styles.examDetail}
                                >
                                  <EumcText style={{ fontSize: 13, color: '#16b1a9', marginVertical: -5 }}>
                                    검사내역 보기
                                  </EumcText>
                                  <Icon
                                    name="navigate-next"
                                    style={{ fontSize: 20, color: '#16b1a9', padding: 0, marginRight: -8 }}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                            <EumcText style={styles.contentDetailTextMicro}>{exam.EXRM_GRP ?? '-'}</EumcText>
                            <EumcText style={styles.contentDetailTextMicro}>{exam.ACPT_DT ?? '-'}</EumcText>
                          </View>
                        </ListItem.Content>
                      </ListItem>
                    </Accordion>
                  ))}
              </View>
            </View>
          ))}
      </ScrollView>
    );
  };
  const PrescriptionList = () => {
    const historyData = [
      {
        index: 0,
        data: '2022-03-12',
        medicalDepartment: '마취통증의학과 / 이비인후과',
        drugName: '스카이셀플루4가프리필드시린지0.5ml (SK/4가/직원용)(Influenza vaccine inj (SK/4가/직원용))',
        prescription: 1,
        number: '의사 지시대로 주사해 주세요',
        usage: 1,
        numberDays: '원내약',
      },
      {
        index: 1,
        data: '2022-03-22',
        medicalDepartment: '이비인후과 / 이비인후과',
        drugName: '스카이셀플루4가프리필드시린지0.5ml (SK/4가/직원용)(Influenza vaccine inj (SK/4가/직원용))',
        prescription: 2,
        number: '의사 지시대로 주사해 주세요',
        usage: 3,
        numberDays: '원내약',
      },
    ];

    return (
      <View style={{ backgroundColor: '#fff', flex: 1, paddingHorizontal: 16 }}>
        <View style={styles.staticHeader}>
          <EumcText style={styles.headerText} fontWeight="bold">
            병원
          </EumcText>
          <EumcText style={styles.headerText} fontWeight="bold">
            진료과
          </EumcText>
          <EumcText style={styles.headerText} fontWeight="bold">
            진료의
          </EumcText>
          <EumcText style={styles.headerText} fontWeight="bold">
            처방일
          </EumcText>
        </View>
        <AccordionList
          list={history}
          header={item => (
            <View style={styles.header}>
              <EumcText style={styles.headerText} fontWeight="regular">
                {item.HSP_TP_NM}
              </EumcText>
              <EumcText style={styles.headerText} fontWeight="regular" numberOfLines={1}>
                {item.PT_HME_DEPT_CD_NM}
              </EumcText>
              <EumcText style={styles.headerText} fontWeight="regular">
                {item.LGL_KOR_NM}
              </EumcText>
              <EumcText style={styles.headerText} fontWeight="regular">
                {item.ORD_DT}
              </EumcText>
            </View>
          )}
          body={item => (
            <View style={styles.examBody}>
              <View style={styles.examBodyTextContainer}>
                <EumcText style={styles.examTitleText}>병원</EumcText>
                <EumcText style={styles.examBodyText}>{item.HSP_TP_NM}</EumcText>
              </View>
              <View style={styles.examBodyTextContainer}>
                <EumcText style={styles.examTitleText}>진료과</EumcText>
                <EumcText style={styles.examBodyText}>
                  {item.PT_HME_DEPT_CD_NM} - {item.LGL_KOR_NM}
                </EumcText>
              </View>
              <View style={styles.examBodyTextContainer}>
                <EumcText style={styles.examTitleText}>처방일</EumcText>
                <EumcText style={styles.examBodyText}>{item.ORD_DT}</EumcText>
              </View>
              <View style={styles.prescriptionDetailContainer}>
                {item.DETAIL.map((item, index) => (
                  <View key={index} style={styles.prescriptionContainer}>
                    <View style={styles.bodyNolineTextContainer}>
                      <EumcText style={styles.drugTitle}>약품명</EumcText>
                      <EumcText style={styles.drugText}>{item.KPEM_MDPR_NM}</EumcText>
                    </View>
                    <DrugCardText
                      title="· 처방량"
                      value={`${item.PHA_QTY}${item.MDPR_UNIT_CD && `(단위: ${item.MDPR_UNIT_CD})`}`}
                    />
                    <DrugCardText title="· 횟수" value={item.PRPD_NOTM} />
                    <DrugCardText title="· 용법" value={item.ABBR} />
                    <DrugCardText title="· 일수" value={item.WHL_PRD_DYS} />
                    <EumcText style={styles.infoText}>* 외용약의 경우, 용법을 확인 후 사용하십시오</EumcText>
                  </View>
                ))}
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  };

  const HistoryList = ({ type }) => {
    switch (type) {
      case 'Diagnosis':
        return <ExamList />;
      case 'Payment':
        return <PaymentList />;
      case 'Prescription':
        return <PrescriptionList />;
      case 'Treatment':
        return <MedicalList />;
      default:
        return <EmptyList emptyText={getEmptyText(type)} />;
    }
  };
  const dayFormat = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const yearMonthDate = `${year}년 ${month}월 ${day}일`;
    return yearMonthDate;
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.quickSelectContainer} onPress={() => navigation.goBack()}>
        <View
          style={[
            styles.rangeTextContainer,
            calData.start.date && calData.end.date ? styles.rangeTextContainerActive : null,
          ]}
        >
          <EumcText style={styles.rangeText}>
            {calData.start.date ? dayFormat(new Date(calData.start.date)) : ''}
          </EumcText>
          <EumcText style={styles.rangeText} fontWeight="bold">
            -
          </EumcText>
          <EumcText style={styles.rangeText}> {calData.end.date ? dayFormat(new Date(calData.end.date)) : ''}</EumcText>
        </View>
      </Pressable>
      <View style={[styles.historyContainer, !type === 'Diagnosis' && { marginTop: 8 }]}>
        {history.length > 0 ? <HistoryList type={type} /> : <EmptyList emptyText={getEmptyText(type)} />}
      </View>
      <BottomTwoBtn
        leftTitle="홈으로"
        rightTitle="다른 날짜 조회"
        onNext={() => navigation.goBack()}
        onCancel={() => navigation.navigate('HomeTab')}
        // onCancel={() => navigation.navigate('MyPage')}
      />
    </View>
  );
};

export default HistoryDetail;
