import { StyleSheet, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useState, useContext } from 'react';
import bcrypt from 'react-native-bcrypt';
import { EumcText } from '../../components';
import { BottomOneBtn } from '../../components/Buttons';
import { SelectBox, SimpleInput } from '../../components/Inputs';
import { Typography, Color } from '../../styles';
import { UserContext } from '../../context';
import { getPatientInfo } from '../../api/v1/patient';
import {
  CONFIRM_ADD_MEDICAL_CARD,
  ERROR_BIRTHDATE_LENGTH,
  ERROR_ENTER_ALL_INFORMATION,
  ERROR_GENERIC_ADD_MEDICAL_CARD,
  ERROR_PHONENUMBER_LENGTH,
  PROMPT_ADD_MEDICAL_CARD,
} from '../../popup-templates';

const MedicalCardReg = ({ navigation }) => {
  const [relationship, setRelationship] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirth] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [patientNumber, setPatientNumber] = useState('');
  const [easyPin, _setEasyPin] = useState('');
  const [checkEasyPin, setCheckEasyPin] = useState('');
  const { medicalCards, setMedicalCards, setCurrentMedicalCardIndex, setLoadingVisible, setEasyPin, setToast } =
    useContext(UserContext);
  const relations = ['본인'];

  const validateMedicalInfo = () => {
    const userData = [name, birthDate, phoneNumber, patientNumber, relationship, easyPin, checkEasyPin];
    for (let value of userData) {
      if (!value) {
        setToast(ERROR_ENTER_ALL_INFORMATION);
        return;
      }
    }
    const passwordExp = /[0-9]{6,}$/;
    if (!passwordExp.test(easyPin)) {
      setToast(ERROR_BIRTHDATE_LENGTH);
      return;
    }

    const phoneExp = /\d{11}/g;
    if (!phoneExp.test(phoneNumber)) {
      setToast(ERROR_PHONENUMBER_LENGTH);
      return;
    }

    if (checkEasyPin != easyPin) {
      setToast({ type: 'error', text1: '모바일 진료카드 발급 오류', text2: '간편비밀번호가 일치하지 않습니다' });
      return;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentWrap} keyboardDismissMode="interactive">
        <KeyboardAvoidingView behavior="padding">
          <EumcText style={[styles.contentTitle, styles.smallBold]}>관계</EumcText>
          <SelectBox data={relations} setSelect={setRelationship} />
          <EumcText style={[styles.contentTitle, styles.smallBold]}>이름</EumcText>
          <SimpleInput placeHolder="홍길동" type="text" setValue={setName} />
          <EumcText style={[styles.contentTitle, styles.smallBold]}>생년월일</EumcText>
          <SimpleInput placeHolder="19920911 (8자리)" type="numeric" maxLength={8} setValue={setBirth} />
          <EumcText style={[styles.contentTitle, styles.smallBold]}>휴대폰번호</EumcText>
          <SimpleInput placeHolder="01012345678" type="numeric" maxLength={11} setValue={setPhone} />
          <EumcText style={[styles.contentTitle, styles.smallBold]}>환자번호</EumcText>
          <SimpleInput placeHolder="12345678 (8자리)" type="numeric" maxLength={8} setValue={setPatientNumber} />
          <EumcText style={[styles.contentTitle, styles.smallBold]}>간편비밀번호</EumcText>
          <SimpleInput placeHolder="123456 (6자리)" type="numeric" maxLength={6} setValue={_setEasyPin} mask={true} />
          <EumcText style={[styles.contentTitle, styles.smallBold]}>간편비밀번호 확인</EumcText>
          <SimpleInput
            placeHolder="비밀번호를 다시 입력해주세요."
            type="numeric"
            maxLength={6}
            setValue={setCheckEasyPin}
            mask={true}
          />
          <EumcText style={styles.inputDesc}>카드등록 결제, 삭제, 예약 취소 변경시 필요합니다.</EumcText>
        </KeyboardAvoidingView>
      </ScrollView>
      <BottomOneBtn
        rightTitle="확인"
        onNext={() => {
          validateMedicalInfo() &&
            setToast(
              Object.assign(PROMPT_ADD_MEDICAL_CARD, {
                onConfirm: () => {
                  setLoadingVisible(true);
                  getPatientInfo(name, birthDate, patientNumber)
                    .then(res => {
                      const { ok, data } = res.data;
                      if (ok && data) {
                        const obj = {
                          name,
                          birthDate,
                          phoneNumber,
                          patientNumber,
                          relationship,
                        };
                        setMedicalCards([...medicalCards, obj]);
                        setCurrentMedicalCardIndex(0);
                        setEasyPin(bcrypt.hashSync(easyPin, 10));
                        setToast(
                          Object.assign(CONFIRM_ADD_MEDICAL_CARD, {
                            redirect: () => navigation.navigate('HomeTab', { screen: 'MedicalCard' }),
                          })
                        );
                      } else setToast(ERROR_GENERIC_ADD_MEDICAL_CARD);
                    })
                    .catch(e => {
                      console.log(e);
                      setToast(ERROR_GENERIC_ADD_MEDICAL_CARD);
                    })
                    .finally(() => setLoadingVisible(false));
                },
              })
            );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.homeColor.primaryWhite,
    flex: 1,
  },
  contentWrap: {
    paddingHorizontal: 17,
  },
  contentTitle: {
    marginTop: 12,
    marginBottom: 4,
    color: Color.myPageColor.darkGray,
  },
  inputDesc: {
    fontSize: 14,
    letterSpacing: -0.59,
    color: Color.homeColor.primaryDarkPurple,
  },
  ...Typography,
});

export default MedicalCardReg;
