import { useState, useContext } from 'react';
import { Pressable, View, StyleSheet, ScrollView, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { Color } from '../../styles';
import { BottomTwoBtn } from '../../components/Buttons';
import { LabelListItem, CheckBoxItem } from '../../components/List';
import { SimpleInput, SelectBox } from '../../components/Inputs';
import { UserContext } from '../../context/UserContext';
import { EumcText } from '../../components';
import moment from 'moment/moment';
import { regTradeNormal } from '../../api/v1/eumc-pay';
import { formatDate3 } from '../../utils';
import { KCP_INFO } from '../../constants';
import { ERROR_GENERIC_MISSING_VALUE } from '../../popup-templates';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 10,
  },
  pdt30: {
    paddingTop: 30,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  amountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 5,
    backgroundColor: Color.homeColor.primaryDarkgreen,
  },
  textColorWhite: {
    color: Color.homeColor.primaryWhite,
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 24,
  },
  textColorYellow: {
    color: '#ffe600',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 27,
  },
  carefulText: {
    marginVertical: 25,
    fontSize: 12,
    lineHeight: 24,
    fontWeight: 500,
    color: '#818181',
  },
  paymentText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    lineHeight: 20,
  },
  paymentButton: {
    flex: 1 / 3,
    marginRight: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#bcbec0',
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentKpayButton: {
    width: 56,
    height: 23,
  },
  paymentNpayImgArea: {
    width: 58,
    height: 22.8,
  },
  paymentSpayImgArea: {
    width: 29.6,
    height: 29.6,
  },
  paymentImg: {
    width: '100%',
    height: '100%',
  },
  radioButtonArea: {
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'flex-end',
  },
  selectedPayment: {
    borderWidth: 1,
    borderColor: Color.homeColor.primaryTurquoise,
  },
  margin0: {
    marginRight: 0,
  },
  colorTurquoise: {
    color: Color.homeColor.primaryTurquoise,
  },
  emailBtn: {
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#16aea6',
    borderRadius: 5,
  },
  emailBtnText: {
    color: '#16aea6',
    textAlign: 'center',
    lineHeight: 20,
    //lineHeight:
  },
});

const MobilePaymentDetail = ({ navigation, route }) => {
  const selected = route.params.payList;
  // console.log(`PAY LIST2 : ${JSON.stringify(selected)} `);
  /**
   *   deptname: '' + data.OUT_DEPTNAME.trim(),
   *   rcpamt: data.OUT_RCPAMT,
   *   meddate: data.OUT_ADMDATE,
   *   raw: data
   */
  const { code, medicalCards, currentMedicalCardIndex, setKcpTrade, setToast } = useContext(UserContext);
  const { name, birthDate, patientNumber, email } = medicalCards[currentMedicalCardIndex];

  const [radioChecked, setRadioChecked] = useState(false);
  const [inpEmail, setInpEmail] = useState(email || '');
  const [saveEmail, setSaveEmail] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('smart');
  const [selectEmailActive, setSelectEmailActive] = useState('');

  if (!(currentMedicalCardIndex >= 0)) {
    return <View />;
  }

  const birthDateForm = birthDate.toString().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
  const selectEmail = ['naver.com', 'daum.net', 'gmail.com'];
  let amount = selected.rcpamt;

  const getOrderId = () => {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var date = today.getDate();
    var time = '' + today.getHours() + '' + today.getMinutes();

    if (parseInt(month) < 10) {
      month = '0' + month;
    }

    var vOrderID = year + '' + month + '' + date + '' + time;
    return vOrderID;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardDismissMode="interactive">
        <KeyboardAvoidingView behavior="padding">
          <EumcText style={styles.title}>환자 정보</EumcText>
          <LabelListItem LeftText="환자명" RightText={name} />
          <LabelListItem LeftText="생년월일" RightText={birthDateForm} />
          <LabelListItem LeftText="환자 번호" RightText={patientNumber} />

          <EumcText style={[styles.title, styles.pdt30]}>수납 내용</EumcText>
          <LabelListItem LeftText="진료과" RightText={selected.deptname} />
          <LabelListItem LeftText="진료일" RightText={moment(selected.meddate).format('yyyy년 MM월 DD일')} />
          <LabelListItem LeftText="진료과" RightText={selected.deptname} />
          <LabelListItem LeftText="진료일" RightText={formatDate3(selected.meddate)} />
          <LabelListItem LeftText="수납 금액" RightText={`${new Intl.NumberFormat().format(amount)} 원`} />

          <View style={styles.amountButton}>
            <EumcText style={styles.textColorWhite}>총 수납 금액</EumcText>
            <EumcText style={styles.textColorYellow}>{`${new Intl.NumberFormat().format(amount)} 원`}</EumcText>
          </View>

          <EumcText style={[styles.title, styles.pdt30]}>영수증 받으실 이메일 주소</EumcText>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <SimpleInput
              placeHolder="메일 주소를 입력해주세요."
              value={inpEmail}
              setValue={setInpEmail}
              type="text"
              style={{ flex: 7, marginRight: 6, marginBottom: 38 }}
            />
            <View style={{ flexDirection: 'column', flex: 3 }}>
              <SelectBox data={selectEmail} setSelect={setSelectEmailActive} />
              {/* <Pressable style={[styles.emailBtn, { height: 42 }]}>
                <EumcText fontWeight="bold" style={styles.emailBtnText}>
                  메일 확인
                </EumcText>
              </Pressable> */}

              <View style={{ marginTop: 9, marginLeft: -3 }}>
                <CheckBoxItem
                  title="이메일 저장"
                  checked={saveEmail}
                  onCheckPress={() => setSaveEmail(!saveEmail)}
                  hideArrow={true}
                  marginEmpty={0}
                  titleStyle="right"
                  checkBoxSize="small"
                />
              </View>
            </View>
          </View>

          <EumcText style={[styles.title, { paddingTop: 12 }]}>결제 방법 선택</EumcText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
            <Pressable
              style={[styles.paymentButton, paymentMethod === 'smart' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('smart')}
            >
              <EumcText style={[styles.paymentText]} numberOfLines={1}>
                스마트결제
              </EumcText>
            </Pressable>
            <Pressable
              style={[styles.paymentButton, paymentMethod === 'kakao' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('kakao')}
            >
              <View style={styles.paymentKpayButton}>
                <ImageBackground source={require('../../assets/ico_kpay.png')} style={styles.paymentImg} />
              </View>
            </Pressable>
            <Pressable
              style={[styles.paymentButton, paymentMethod === 'cc' && styles.selectedPayment, styles.margin0]}
              onPress={() => setPaymentMethod('cc')}
            >
              <EumcText style={[styles.paymentText]} numberOfLines={1}>
                신용카드결제
              </EumcText>
            </Pressable>
          </View>

          <EumcText fontWeight="regular" style={styles.carefulText}>
            * 수납 결제 취소는 창구에서만 가능 합니다.
            {'\n'}* 증명서 신청 서비스는 수납 완료 후 이용 가능 합니다.
          </EumcText>

          <View style={styles.radioButtonArea}>
            <CheckBoxItem
              checkBoxSize="small"
              title="결제조건 확인 및 결제진행 동의(필수)"
              titleStyle="right"
              checked={radioChecked}
              onCheckPress={() => setRadioChecked(!radioChecked)}
              hideArrow={true}
              marginEmpty={0}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <BottomTwoBtn
        leftTitle="취소"
        onCancel={() => navigation.navigate('MyPage')}
        rightTitle="수납"
        onNext={() => {
          if(inpEmail === '') {
            setToast(ERROR_GENERIC_MISSING_VALUE('이메일'));
            return false;
          }
          if(!radioChecked) {
            setToast({ type: 'error', text1: '약관동의', text2: '결제조건 확인 및 결제진행 동의\n항목을 체크해주십시오.' });
            return false;
          }




          let target_email = inpEmail + '@' + selectEmailActive;

          // target_data
          // deptCode: string;    // 7 : 진료과코드
          // medType: string;     // 11 : 초재진구분
          // drcode: string;      // 12 : 의사코드
          // patType: string;     // 13 : 급여종별
          // typeCd: string;      // 14 : 유형보조
          switch (paymentMethod) {
            case 'smart':
              {
                // target: selected, money: money, type: 'PROOF', target_data
                navigation.navigate('SmartPayment', {
                  target: selected,
                  money: selected?.rcpamt,
                  type: 'PAY',
                  target_data: {
                    deptCode: selected.raw?.OUT_MEDDEPT1,
                    medType: selected.raw?.OUT_MEDTYPE1,
                    patType: selected.raw?.OUT_PATTYPE1,
                    typeCd: selected.raw?.OUT_TYPECD1,
                    drcode: selected.raw?.OUT_MEDDR1,
                    email: target_email,
                  },
                });
              }
              break;
            case 'kakao':
              {
                const money = selected?.rcpamt;
                const rcptype = selected?.rcptype;

                navigation.navigate('OrderKakao', {
                  target: selected,
                  type: 'PAY',
                  money: selected?.rcpamt,
                  target_data: { type: 'PAY', selected: selected, money: money, rcptype, target_email: target_email },
                  target_email: target_email,
                });
              }
              break;
            case 'cc':
              {
                const orderId = getOrderId() + patientNumber;
                const siteCode = (code === '01' ? KCP_INFO.PAY_SEOUL_NORMAL_SITE_CD : KCP_INFO.PAY_MOKDONG_NORMAL_SITE_CD); //(code === '01' ? 'A8DZL' : 'A8DZT');

                regTradeNormal(orderId, siteCode, selected?.deptname, selected?.rcpamt)
                  .then(res => {
                    // const { PayUrl, approvalKey, traceNo } = res.data;
                    console.log(res.data);
                    res.data.title = selected?.deptname;
                    res.data.money = selected?.rcpamt;
                    res.data.type = 'PAY';
                    setKcpTrade(res.data);

                    const money = selected?.rcpamt;

                    navigation.navigate('OrderNormalReg', {
                      selected: selected,
                      money: money,
                      type: 'PAY',
                      siteCode: siteCode,
                      target_data: {
                        deptCode: selected.raw?.OUT_MEDDEPT1,
                        medType: selected.raw?.OUT_MEDTYPE1,
                        patType: selected.raw?.OUT_PATTYPE1,
                        typeCd: selected.raw?.OUT_TYPECD1,
                        drcode: selected.raw?.OUT_MEDDR1,
                        email: target_email,
                        rcp_type: selected?.rcptype
                      },
                    });
                  })
                  .catch(e => console.log(e));
              }
              break;
          }
        }}
      />
    </View>
  );
};
export default MobilePaymentDetail;
