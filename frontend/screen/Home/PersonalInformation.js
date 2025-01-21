import { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import bcrypt from 'react-native-bcrypt';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { BottomOneBtn } from '../../components/Buttons';
import { EumcText } from '../../components';
import { UserContext } from '../../context/UserContext';
import { SimpleInput } from '../../components/Inputs';
import { OneBtnModal } from '../../components/Modals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },

  userFormAsked: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  notification: {
    fontSize: 16,
    color: '#7670b3',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  pd16: {
    paddingHorizontal: 16,
  },
  backgroundColorGray: {
    backgroundColor: '#f2f2f2',
    color: '#ccc',
    borderRadius: 4,
  },
});

const PersonalInformation = ({ navigation }) => {
  const { medicalCards, currentMedicalCardIndex, setMedicalCards, setToast, setEasyPin, appLocked, setAppLocked } =
    useContext(UserContext);
  if (!(currentMedicalCardIndex >= 0)) return <View></View>;
  const { name, birthDate, phoneNumber, patientNumber } = medicalCards[currentMedicalCardIndex];
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [newEasyPin, setNewEasyPin] = useState('');

  const formatDate = str => `${str.substring(0, 4)}.${str.substring(4, 6)}.${str.substring(6, 8)}`;
  const formatPhone = str => `${str.substring(0, 3)}-${str.substring(3, 7)}-${str.substring(7, 11)}`;
  const formatNum = str => `${str.substring(0, 3)}-${str.substring(3, 6)}-${str.substring(6)}`;

  const findErrorName = errorEnName => {
    switch (errorEnName) {
      case 'newPhoneNumber':
        return '휴대폰 번호';
      case 'newEasyPin':
        return '간편비밀번호';
      default:
        return '값';
    }
  };

  const validateCardInfo = () => {
    const userData = {
      newPhoneNumber,
      newEasyPin,
    };
    for (key of Object.keys(userData)) {
      if (!userData[key]) {
        const errorName = findErrorName(key);
        setToast(ERROR_GENERIC_MISSING_VALUE(errorName));
        return false;
      }
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false} keyboardDismissMode="interactive">
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.userForm}>
            <EumcText style={styles.userFormAsked} fontWeight="bold">
              이름
            </EumcText>
            <View style={styles.pd16}>
              <SimpleInput editable={false} placeHolder={name} style={styles.backgroundColorGray} type="text" />
            </View>
          </View>
          <View style={styles.userForm}>
            <EumcText style={styles.userFormAsked} fontWeight="bold">
              생년월일
            </EumcText>
            <View style={styles.pd16}>
              <SimpleInput
                editable={false}
                placeHolder={formatDate(birthDate)}
                style={styles.backgroundColorGray}
                type="text"
              />
            </View>
          </View>
          <View style={styles.userForm}>
            <EumcText style={styles.userFormAsked} fontWeight="bold">
              휴대폰 번호
            </EumcText>
            <View style={styles.pd16}>
              <SimpleInput
                value={formatPhone(newPhoneNumber)}
                setValue={setNewPhoneNumber}
                type="text"
                maxLength={13}
              />
            </View>
          </View>
          <View style={styles.userForm}>
            <EumcText style={styles.userFormAsked} fontWeight="bold">
              등록번호
            </EumcText>
            <View style={styles.pd16}>
              <SimpleInput
                editable={false}
                placeHolder={formatNum(patientNumber)}
                style={styles.backgroundColorGray}
                type="text"
              />
            </View>
          </View>
          <View style={styles.userForm}>
            <EumcText style={styles.userFormAsked} fontWeight="bold">
              간편비밀번호
            </EumcText>
            <View style={styles.pd16}>
              <SimpleInput value={newEasyPin} setValue={setNewEasyPin} maxLength={6} type="numeric" mask={true} />
            </View>
          </View>
          <EumcText style={styles.notification} fontWeight="regular">
            카드 등록 결제, 삭제, 예약 취소시 필요합니다.
          </EumcText>
        </KeyboardAvoidingView>
      </ScrollView>

      <BottomOneBtn
        rightTitle="확인"
        onNext={() => {
          const newArray = [...medicalCards];
          let goHome = false;
          newArray[currentMedicalCardIndex].phoneNumber = newPhoneNumber.replace(/-/g, '');
          setMedicalCards(newArray);
          if (validateCardInfo()) {
            if (newEasyPin) {
              setEasyPin(bcrypt.hashSync(newEasyPin, 10));
              if (appLocked === true) {
                setAppLocked(false);
                goHome = true;
              } else goHome = false;
            }
            setToast({ type: 'error', text1: '설정 완료', text2: '수정이 완료되었습니다.' });
            if (goHome) navigation.navigate('HomeTab');
            else navigation.goBack();
          }
        }}
      />
    </View>
  );
};
export default PersonalInformation;
