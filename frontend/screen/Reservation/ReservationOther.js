import { useContext, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Pressable, Linking } from 'react-native';
import { UserContext } from '../../context';
import { EumcText } from '../../components';
import { BottomOneBtn } from '../../components/Buttons';
import { SimpleInput } from '../../components/Inputs';
import { Color, Typography } from '../../styles';
import { getPatientInfo } from '../../api/v1/patient';
import { MAIN_PHONE } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userForm: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  userFormAsked: {
    fontSize: 14,
    color: '#231f20',
    paddingBottom: 8,
    lineHeight: 20,
  },
  notification: {
    fontSize: 14,
    color: '#231f20',
    letterSpacing: -0.56,
  },
  callNumber: {
    marginLeft: 20,
    fontSize: 22,
    color: '#004F34',
  },
  bottom_layout: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 26,
    marginBottom: 26,
  },
  lbCallLayout: {
    height: 26,
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Color.medicalCardColor.mintCream,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 17,
  },
  iconCall: {
    width: 12,
    height: 12,
  },
  lbCallTitle: {
    fontSize: 12,
    color: Color.medicalCardColor.gray,
    letterSpacing: -0.6,
    paddingLeft: 8,
    justifyContent: 'center',
    lineHeight: 18,
  },
  lbCallNumber: {
    fontSize: 20,
    color: Color.homeColor.primaryDarkgreen,
    marginHorizontal: 5,
    lineHeight: 23,
  },
  pddingText: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footerText: {
    paddingHorizontal: 16,
  },
  ...Typography,
});

const ReservationOther = ({ navigation }) => {
  const { code, setLoadingVisible, setRsvInfo, setToast } = useContext(UserContext);
  const [name, setName] = useState('');
  const [patientNumber, setPatientNumber] = useState('');
  const [birth, setBirth] = useState('');

  const findErrorName = errorEnName => {
    switch (errorEnName) {
      case 'patientNumber':
        return '환자번호';
      case 'name':
        return '환자명';
      case 'birth':
        return '생년월일';
      default:
        return '값';
    }
  };

  const validateInfo = () => {
    const userData = {
      name,
      patientNumber,
      birth,
    };
    for (key of Object.keys(userData)) {
      if (!userData[key]) {
        const errorName = findErrorName(key);
        setToast({
          type: 'error',
          text1: errorName,
          text2: `${errorName === '환자번호' ? errorName + '를' : errorName}을 입력해주시기 바랍니다.`,
        });
        return false;
      }
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView style={styles.container}>
        <EumcText style={[styles.notification, styles.pddingText]} fontWeight="regular">
          개인정보보호 정책으로 인하여 인터넷 예약 시 주민등록번호를 입력 받습니다.{'\n'}반드시 아래의 내용을
          입력해주시기 바랍니다.
        </EumcText>
        <View style={styles.userForm}>
          <EumcText style={styles.userFormAsked} fontWeight="bold">
            환자명
          </EumcText>
          <SimpleInput style={styles.whiteInput} placeHolder="홍길동" type="text" setValue={setName} />
        </View>
        <View style={styles.userForm}>
          <EumcText style={styles.userFormAsked} fontWeight="bold">
            환자번호
          </EumcText>
          <SimpleInput
            placeHolder="환자번호를 입력해주세요."
            Value={name}
            type="numeric"
            maxLength={8}
            setValue={setPatientNumber}
          />
        </View>
        <View style={styles.userForm}>
          <EumcText style={styles.userFormAsked} fontWeight="bold">
            생년월일
          </EumcText>
          <SimpleInput placeHolder="생년월일(8자리)을 입력해주세요." type="numeric" maxLength={8} setValue={setBirth} />
        </View>
        <EumcText style={[styles.notification, styles.footerText, { paddingTop: 6 }]} fontWeight="regular">
          - 처음 진료를 받으시는 분께서는 건강보험증과 신분증을 지참하여 외래접수・수납창구에 제출하셔야 건강보험혜택을
          받으실 수 있습니다.{'\n'}
        </EumcText>
        <EumcText style={[styles.notification, styles.footerText]} fontWeight="regular">
          - 의료급요환자분은 모든 지료과 처음 진료시에 1차 요양기관에서 발근한 요양급여(진료)의뢰서를 지참하셔야
          급여혜택을 받으실 수 있습니다.
        </EumcText>
        <View style={styles.bottom_layout}>
          <Pressable style={styles.lbCallLayout} onPress={() => navigation.navigate('ReserveStep')}>
            <Image style={styles.iconCall} source={require('../../assets/icon/Ic_call.png')} />
            <EumcText style={styles.lbCallTitle} fontWeight="bold">
              해피콜 센터(진료예약 및 조회)
            </EumcText>
          </Pressable>
          <Pressable onPress={() => Linking.openURL(`tel:${MAIN_PHONE(code)}`)}>
            <EumcText style={styles.lbCallNumber} fontWeight="bold">
              {MAIN_PHONE(code)}
            </EumcText>
          </Pressable>
        </View>
      </ScrollView>
      <BottomOneBtn
        onNext={() => {
          if (validateInfo()) {
            // 맞는 정보인지 확인하기
            // 다음 페이지에 환자정보 바꾸기
            setLoadingVisible(true);
            //setModalCreateVisible(false);

            getPatientInfo(name, birth, patientNumber)
              .then(res => {
                console.log(res.data);
                const { ok, data } = res.data;
                if (ok && data) {
                  setRsvInfo({ name, patientNumber });
                  navigation.navigate('SelectDepartment');
                  // const obj = {
                  //   name,
                  //   birth,
                  //   phoneNumber,
                  //   patientNumber,
                  //   relationship,
                  // };
                  // setMedicalCards([...medicalCards, obj]);
                  //setModalCompleteVisible(true);
                }
              })
              .catch(e => {
                console.log(e);
                setToast({
                  type: 'error',
                  text1: '본인 외 예약 오류',
                  text2: '입력값이 환자정보와 일치하지 않습니다.',
                });
              })
              .finally(() => setLoadingVisible(false));
          }
        }}
        rightTitle={'다음'}
      />
    </View>
  );
};
export default ReservationOther;
