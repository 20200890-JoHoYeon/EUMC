import { useContext, useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { getPatientInfo } from '../../api/v1/patient';
import { EumcText } from '../../components';
import { BottomOneBtn } from '../../components/Buttons';
import { SelectBox, SimpleInput } from '../../components/Inputs';
import { UserContext } from '../../context';
import { Color, Typography } from '../../styles';
import {
  CONFIRM_ADD_MEDICAL_CARD,
  ERROR_BIRTHDATE_LENGTH,
  ERROR_GENERIC_ADD_MEDICAL_CARD,
  ERROR_MISSING_REQUIRED,
  ERROR_PATIENT_NUMBER_ALREADY_EXIST,
  ERROR_PHONENUMBER_LENGTH,
  ERROR_TERMS_AGREEMENT,
  PROMPT_ADD_MEDICAL_CARD,
} from '../../popup-templates';

const images = {
  chkOn: require('../../assets/chk_green_on.png'),
  chkOff: require('../../assets/chk_off.png'),
};

const MedicalCardAdd = ({ navigation }) => {
  const { medicalCards, setMedicalCards, setLoadingVisible, setToast } = useContext(UserContext);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [birthDate, setBirth] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [patientNumber, setPatientNum] = useState('');
  const [termChecked, setTermChecked] = useState(false);
  const [showTerms, setShowTerms] = useState(true);
  const haveOwnCard = medicalCards.findIndex(item => item.relationship === '본인') !== -1;
  const relations = haveOwnCard ? ['자녀'] : ['본인'];

  const checkUnderAge = birthDate => {
    const birthYear = parseInt(birthDate.substring(0, 4), 10);
    const underAge = new Date().getFullYear() - birthYear;
    return underAge < 14;
  };

  const validateMedicalInfo = () => {
    const userData = [name, birthDate, phoneNumber, patientNumber, relationship];
    for (let value of userData) {
      if (!value) {
        setToast(ERROR_MISSING_REQUIRED);
        return false;
      }
    }

    for (const el of medicalCards) {
      if (el.patientNumber === patientNumber) {
        setToast(ERROR_PATIENT_NUMBER_ALREADY_EXIST);
        return false;
      }
    }

    const ageExp = /\d{8}/g;
    if (!ageExp.test(birthDate)) {
      setToast(ERROR_BIRTHDATE_LENGTH);
      return false;
    }
    const phoneExp = /\d{11}/g;
    if (!phoneExp.test(phoneNumber)) {
      setToast(ERROR_PHONENUMBER_LENGTH);
      return false;
    }
    if (checkUnderAge(birthDate) && !termChecked) {
      setToast(ERROR_TERMS_AGREEMENT);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (birthDate.length >= 4) {
      if (checkUnderAge(birthDate)) setShowTerms(true);
      else setShowTerms(false);
    } else setShowTerms(true);
  }, [birthDate]);

  return (
    <>
      <ScrollView style={styles.container} keyboardDismissMode="interactive">
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.inputContainer}>
            <EumcText style={styles.contentTitle} fontWeight="bold">
              관계
            </EumcText>
            <SelectBox data={relations} setSelect={setRelationship} />
            <EumcText style={styles.contentTitle} fontWeight="bold">
              이름
            </EumcText>
            <SimpleInput placeHolder="홍길동" type="text" setValue={setName} />
            <EumcText style={styles.contentTitle} fontWeight="bold">
              생년월일
            </EumcText>
            <SimpleInput placeHolder="19920911 (8자리)" type="numeric" maxLength={8} setValue={setBirth} />
            <EumcText style={styles.contentTitle} fontWeight="bold">
              휴대폰번호
            </EumcText>
            <SimpleInput placeHolder="예) 01012345678" type="numeric" maxLength={11} setValue={setPhone} />
            <EumcText style={styles.contentTitle} fontWeight="bold">
              환자번호
            </EumcText>
            <SimpleInput placeHolder="12345678 (8자리)" type="numeric" maxLength={8} setValue={setPatientNum} />
          </View>
          {showTerms && (
            <View style={styles.applyTermContainer}>
              <View style={styles.apply14TermsLayout}>
                <View style={styles.row}>
                  <Pressable
                    style={{ flexDirection: 'row', paddingVertical: 4 }}
                    onPress={() => setTermChecked(!termChecked)}
                  >
                    <Image style={styles.applyTermChkImg} source={termChecked ? images.chkOn : images.chkOff} />
                    <EumcText style={styles.applyTermTitle} fontWeight="bold">
                      만 14세 미만 등록 동의(필수)
                    </EumcText>
                  </Pressable>
                </View>
                <View style={styles.row}>
                  <EumcText style={[styles.applyTermDesc, styles.bar]} fontWeight="regular">
                    -
                  </EumcText>
                  <EumcText style={[styles.applyTermDesc, styles.bar]} fontWeight="regular">
                    만 14세 미만소아/청소년 등록시 등록하는 법정 대리 인의 위임을 받았음을 확인합니다.
                  </EumcText>
                </View>
                <View style={styles.row}>
                  <EumcText style={[styles.applyTermDesc, styles.bar]} fontWeight="regular">
                    -
                  </EumcText>
                  <EumcText style={[styles.applyTermDesc, styles.bar]} fontWeight="regular">
                    무단으로 대리 접수 등 병원 정보 활용 시, 개인정보 처리에 관한 법률에 위배될 수 있습니다.
                  </EumcText>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </ScrollView>
      <BottomOneBtn
        rightTitle="확인"
        onNext={() =>
          validateMedicalInfo() === true &&
          setToast(
            Object.assign(PROMPT_ADD_MEDICAL_CARD, {
              onConfirm: () => {
                setLoadingVisible(true);
                getPatientInfo(name, birthDate, patientNumber)
                  .then(res => {
                    console.log(res);
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
                      setToast(
                        Object.assign(CONFIRM_ADD_MEDICAL_CARD, {
                          redirect: () => navigation.replace('MedicalCardList', { mode: 'change' }),
                        })
                      );
                    }
                  })
                  .catch(e => {
                    console.log(e);
                    setToast(ERROR_GENERIC_ADD_MEDICAL_CARD);
                  })
                  .finally(() => setLoadingVisible(false));
              },
            })
          )
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    paddingRight: 1,
    paddingLeft: 3,
  },
  container: {
    backgroundColor: Color.homeColor.primaryWhite,
    flex: 1,
  },
  contentTitle: {
    fontSize: 14,
    lineHeight: 17,
    color: Color.homeColor.primaryBlack,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    marginHorizontal: 14,
    marginBottom: 24,
  },
  applyTermContainer: {
    width: '100%',
    borderTopColor: '#e3e4e5',
    borderTopWidth: 1,
    color: '#000',
  },
  apply14TermsLayout: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
  },
  applyTermChkImg: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  applyTermTitle: {
    fontSize: 16,
    color: Color.homeColor.primaryBlack,
    alignSelf: 'center',
    paddingLeft: 5,
    lineHeight: 22,
  },
  applyTermDesc: {
    fontSize: 14,
    lineHeight: 19,
    color: Color.homeColor.primaryBlack,
    marginTop: 4,
  },
  /* modal */
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 25,
  },
  ...Typography,
});

export default MedicalCardAdd;
