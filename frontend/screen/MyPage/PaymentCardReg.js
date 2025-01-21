import { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Color, Typography } from '../../styles';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { RadioButton, SimpleInput } from '../../components/Inputs';

import { useInterval } from '../../utils';
import {
  CONFIRM_VALIDATION_NUMBER_SENT,
  ERROR_GENERIC_MISSING_VALUE, ERROR_GENERIC_NOT_EQUAL_VALUE,
  PROMPT_DELETE_PAYMENT_CARD,
} from '../../popup-templates';
import { UserContext } from '../../context';
import { regTrade, reqAuthConfirm, reqAuthNumber } from '../../api/v1/eumc-pay';
import { KCP_INFO } from '../../constants';

const windowWidth = Dimensions.get('window').width;
const childWidth = (windowWidth - 42) / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentWrap: {
    paddingHorizontal: 17,
  },
  contentTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: Color.myPageColor.darkGray,
    ...Typography.smallBold,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnContainer: {
    flexDirection: 'column',
    alignContent: 'space-between',
    flexWrap: 'wrap',
    height: 100,
    width: '100%',
  },
  inputAlignLayout: {
    width: '69%',
  },
  btn: {
    flex: 1,
    height: 41,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  btnHalf: {
    maxWidth: childWidth,
    minWidth: 160,
  },
  btnBorder: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  btnBorderGreen: {
    borderColor: Color.homeColor.primaryTurquoise,
    marginLeft: 8,
  },
  btnBorderGreenText: {
    color: Color.homeColor.primaryTurquoise,
  },
  btnBorderGray: {
    borderColor: Color.myPageColor.gray,
    color: Color.inputColor.black,
  },
  btnDarkGreen: {
    backgroundColor: Color.homeColor.primaryDarkgreen2,
  },
  btnDarkGreenText: {
    color: Color.homeColor.primaryWhite,
  },
  //Modal
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: -0.45,
  },
  infoText: {
    marginTop: 16,
    paddingHorizontal: 3,
    color: Color.homeColor.primaryDarkPurple,
    lineHeight: 28,
    //letterSpacing: -0.59,
  },
  ...Typography,
});

const SquareSwitchBtn = ({ title, checked, onPress, style, titleStyle }) => {
  if (checked === true) {
    style = [styles.btnDarkGreen, styles.btnHalf];
    titleStyle = styles.btnDarkGreenText;
  } else if (checked === false) {
    style = [styles.btnBorder, styles.btnBorderGray, styles.btnHalf];
    titleStyle = styles.btnBorderGray;
  }
  return (
    <TouchableOpacity style={[styles.btn, style]} activeOpacity={0.4} onPress={onPress}>
      <EumcText style={[titleStyle, styles.small]}>{title}</EumcText>
    </TouchableOpacity>
  );
};

const PaymentCardReg = ({ navigation, route }) => {
  const [inp_name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [selectGender, setSelectGender] = useState('01');
  const [selectNation, setSelectNation] = useState('01');
  const [selectTelecom, setSelectTelecom] = useState('SKT');
  const [telNumber, setTelNumber] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [authData, setAuthData] = useState('');
  const telecomGroup = ['SKT', 'SKM', 'KT', 'KTM', 'LGT', 'LGM'];
  const [countSecond, setCountSecond] = useState(180); //카운트 초 지정
  const [isRunning, setIsRunning] = useState(false);
  const { code, medicalCards, currentMedicalCardIndex, setKcpTrade, setToast } = useContext(UserContext);
  const { name, birthDate, patientNumber, phoneNumber, email } = medicalCards[currentMedicalCardIndex];

  let isChildCard = false;
  if(medicalCards.length > 1 && currentMedicalCardIndex !== 0) {
    isChildCard = true;
  }

  // console.log(`card info : ${JSON.stringify(medicalCards[currentMedicalCardIndex])}`)
  console.log(`patient number : ${patientNumber}`)

  const type = route.params?.type;
  const selected = route.params?.selected;
  const money = route.params?.money;


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

  const validateCardInfo = () => {
    const userData = {
      telNumber,
      inp_name,
      birth,
    };
    for (key of Object.keys(userData)) {
      if (!userData[key]) {
        switch (key) {
          case 'inp_name':
            setToast(ERROR_GENERIC_MISSING_VALUE('이름'));
            break;
          case 'birth':
            setToast(ERROR_GENERIC_MISSING_VALUE('생년월일'));
            break;
          case 'telNumber':
            setToast(ERROR_GENERIC_MISSING_VALUE('휴대폰번호'));
            break;
        }
        return false;
      }
    }

    if(isChildCard && type == 'PROOF'){
      // 본인 회원 정보와 비교
      const { name, birthDate, phoneNumber } = medicalCards[0];


      if (inp_name !== name
        || birth !== birthDate
        || telNumber !== phoneNumber)
      {
        setToast(ERROR_GENERIC_NOT_EQUAL_VALUE('인증에러 알림', '부모카드의 회원정보와'));
        return false;
      }
    }else{
      // 회원 정보와 비교
      if (inp_name !== name
        || birth !== birthDate
        || telNumber !== phoneNumber)
      {
        setToast(ERROR_GENERIC_NOT_EQUAL_VALUE('인증에러 알림', '회원정보와'));
        return false;
      }
    }

    return true;
  };

  useInterval(
    () => {
      if(countSecond > 1) {
        setCountSecond(countSecond - 1);
      }else{
        setIsRunning(false);
        setAuthData(null);
        setCountSecond(180);
        setToast({ type: 'error', text1: '인증오류', text2: '인증번호 요청이\n만료되었습니다.' });
      }

    },
    isRunning && countSecond > 0 ? 1000 : null,
  );


  const callReqAuthNumber = () => {
    const site_cd = KCP_INFO.AUTH_SITE_CD;
    const media_type = 'MC01';
    const cp_sms_msg = '[NHNKCP SHOP]이용자번호는[000000]입니다';
    const cp_callback = '15448661';
    const user_name = inp_name;
    const phone_no = telNumber;
    const comm_id = selectTelecom;
    const birth_day = birth;
    const sex_code = selectGender;
    const local_code = selectNation;

    if(authData === '' || authData == null) {
      reqAuthNumber(
        site_cd,
        patientNumber,
        media_type,
        user_name,
        phone_no,
        comm_id,
        birth_day,
        sex_code,
        local_code,
        cp_sms_msg,
        cp_callback,
        null
      ).then(res => {
        const { ok, data } = res.data;
        if (ok) {
          console.log(JSON.stringify(data));
          setAuthData(JSON.stringify(data));
          setCountSecond(180);
        }
      });
    }
    else{
      const reqData = JSON.parse(authData);

      reqAuthNumber(
        site_cd,
        patientNumber,
        media_type,
        user_name,
        phone_no,
        comm_id,
        birth_day,
        sex_code,
        local_code,
        cp_sms_msg,
        cp_callback,
        reqData.per_cert_no
      ).then(res => {
        const { ok, data } = res.data;
        if (ok) {
          console.log(JSON.stringify(data));
          setAuthData(JSON.stringify(data));
          setCountSecond(180);
        }
      });
    }
  };

  const callReqAuthConfirm = () => {
    if(authData === '' || authData == null) {
      setToast({ type: 'error', text1: '인증오류', text2: '인증번호 요청이\n진행되지 않았습니다.' });
      return false;
    }

    if(authNumber === '' || authNumber == null) {
      setToast(ERROR_GENERIC_MISSING_VALUE('인증번호'));
      return false;
    }


    let reqData = JSON.parse(authData).res_data;
    reqData = JSON.parse(reqData);
    const site_cd = KCP_INFO.AUTH_SITE_CD;

    console.log(`otp confirm : ${authData}`)
    console.log(`otp confirm : ${reqData}`)
    console.log(`otp confirm : ${reqData.comm_id}`)
    console.log(`otp confirm : ${reqData.per_cert_no}`)


    reqAuthConfirm(site_cd, reqData.comm_id, reqData.per_cert_no, authNumber,'Y')
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          console.log(JSON.stringify(data));
          if (type == 'REG_SMART') {
            const orderId2 = getOrderId() + patientNumber;
            const siteCode2 = (code === '01' ? KCP_INFO.PAY_SEOUL_SMART_SITE_CD : KCP_INFO.PAY_MOKDONG_SMART_SITE_CD);

            console.log(`siteCode : ${siteCode2}`);

            //TODO: 카드 추가 동작
            regTrade(orderId2, siteCode2)
              .then(res2 => {
                // const { PayUrl, approvalKey, traceNo } = res.data;
                console.log(res2.data);
                setKcpTrade(res2.data);

                navigation.navigate('OrderReg');
              })
              .catch(e => console.log(e));
          } else if (type == 'PROOF') {
            navigation.navigate('ProofPayment', { selected: selected, money: money });
          }
        }else{
          console.error(JSON.stringify(data));
          setToast({ type: 'error', text1: '인증오류', text2: '본인인증이\n실패하였습니다.' });
        }
      })
      .catch(err=>{
        console.error(err);
        setToast({ type: 'error', text1: '인증오류', text2: '본인인증이\n실패하였습니다.' });
      })
      .finally(()=>{
        // 타이머 초기화
        setIsRunning(false);
        setAuthData(null);
        setAuthNumber(null);
        setCountSecond(180);
      })
    ;
  }


  return (
    <View style={styles.container}>
      {/* contentwrap */}
      <ScrollView contentContainerStyle={styles.contentWrap} keyboardDismissMode='interactive'>
        <KeyboardAvoidingView behavior='padding'>
          <EumcText style={styles.contentTitle}>이름</EumcText>
          <SimpleInput placeHolder='홍길동' type='text' setValue={setName} />
          <EumcText style={styles.contentTitle}>생년월일</EumcText>
          <SimpleInput placeHolder='19920911 (8자리)' type='numeric' maxLength={8} setValue={setBirth} />
          <EumcText style={styles.contentTitle}>성별</EumcText>
          <View style={styles.rowContainer}>
            <SquareSwitchBtn
              title='남자'
              checked={selectGender === '01'}
              onPress={() => setSelectGender('01')}
            />
            <SquareSwitchBtn
              title='여자'
              checked={selectGender === '02'}
              onPress={() => setSelectGender('02')}
            />
          </View>
          <EumcText style={styles.contentTitle}>국적</EumcText>
          <View style={styles.rowContainer}>
            <SquareSwitchBtn
              title='내국인'
              checked={selectNation === '01'}
              onPress={() => setSelectNation('01')}
            />
            <SquareSwitchBtn
              title='외국인'
              checked={selectNation === '02'}
              onPress={() => setSelectNation('02')}
            />
          </View>
          <EumcText style={styles.contentTitle}>이동통신사</EumcText>
          <View style={styles.columnContainer}>
            {telecomGroup &&
              telecomGroup.map((item, index) => (
                <RadioButton
                  key={index}
                  label={item}
                  checked={item === selectTelecom}
                  onPress={() => setSelectTelecom(item)}
                />
              ))}
          </View>
          <EumcText style={styles.contentTitle}>휴대폰번호</EumcText>
          <View style={styles.rowContainer}>
            <View style={styles.inputAlignLayout}>
              <SimpleInput type='numeric' setValue={setTelNumber} maxLength={11} />
            </View>
            <SquareSwitchBtn
              title='인증요청'
              style={[styles.btnBorder, styles.btnBorderGreen]}
              titleStyle={[styles.btnBorderGreenText, styles.small]}
              onPress={() => {
                if(validateCardInfo()) {
                  callReqAuthNumber();

                  setToast(
                    Object.assign(CONFIRM_VALIDATION_NUMBER_SENT, {
                      onConfirm: () => {
                        setIsRunning(true);
                      },
                    }),
                  );
                }
              }}
            />
          </View>
          {isRunning === true && (
            <>
              <View style={styles.rowContainer}>
                <View style={styles.inputAlignLayout}>
                  <SimpleInput
                    placeHolder=''
                    type='numeric'
                    setValue={setAuthNumber}
                    countText={`${Math.floor(countSecond / 60)}분 ${countSecond % 60}초`}
                  />
                </View>
                <SquareSwitchBtn
                  title='입력시간연장'
                  style={[styles.btnBorder, styles.btnBorderGreen]}
                  titleStyle={[styles.btnBorderGreenText, styles.small]}
                  onPress={() => {
                    setCountSecond(180);
                  }}
                />
              </View>
              <EumcText style={[styles.small, styles.infoText]}>※본인 명의의 휴대폰만 인증 가능합니다.</EumcText>
            </>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
      {/* contentwrap end */}
      {/* Floating */}
      <BottomTwoBtn
        leftTitle='취소'
        onCancel={() =>
          setToast(
            Object.assign(PROMPT_DELETE_PAYMENT_CARD, { redirect: () => navigation.navigate('PaymentCardMain') }),
          )
        }
        rightTitle='다음'
        onNext={() => callReqAuthConfirm()}
      />
    </View>
  );
};
export default PaymentCardReg;
