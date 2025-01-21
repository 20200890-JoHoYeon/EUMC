import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { EumcText } from '../../components';
import { Color, Typography } from '../../styles';
import { SimpleInput } from '../../components/Inputs';
import { BottomOneBtn } from '../../components/Buttons';
import { OneBtnModal } from '../../components/Modals';
import { getPatientInfo } from '../../api/v1/patient';
import { UserContext } from '../../context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
    paddingTop: 4,
  },
  textContainer: {
    marginHorizontal: 16,
    flex: 1,
  },
  proxyText: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  ...Typography,
});

const ProxyPayment = ({ navigation }) => {
  const { setLoadingVisible, setToast } = useContext(UserContext);
  const [patientNumber, setPatientNumber] = useState('');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');

  const validateCardInfo = () => {
    const userData = {
      patientNumber,
      name,
      birth,
    };
    for (key of Object.keys(userData)) {
      if (!userData[key]) {
        switch (key) {
          case 'patientNumber':
            setToast(ERROR_GENERIC_MISSING_VALUE('환자번호'));
            break;
          case 'name':
            setToast(ERROR_GENERIC_MISSING_VALUE('환자명'));
            break;
          case 'birth':
            setToast(ERROR_GENERIC_MISSING_VALUE('생년월일'));
            break;
        }
        return false;
      }
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <EumcText style={styles.proxyText} fontWeight="bold">
          환자번호
        </EumcText>
        <SimpleInput setValue={setPatientNumber} placeHolder="환자번호를 입력해주세요." maxLength={8} type="numeric" />
        <EumcText style={styles.proxyText} type="text" fontWeight="bold">
          환자명
        </EumcText>
        <SimpleInput setValue={setName} placeHolder="이름을 입력해주세요." type="text" />
        <EumcText style={styles.proxyText} fontWeight="bold">
          생년월일
        </EumcText>
        <SimpleInput setValue={setBirth} placeHolder="예) 19901221" maxLength={8} type="numeric" />
      </View>
      <BottomOneBtn
        rightTitle="조회"
        onNext={() => {
          setLoadingVisible(true);
          if (validateCardInfo()) {
            getPatientInfo(name, birth, patientNumber)
              .then(res => {
                const { ok, data } = res.data;
                if (ok && data) navigation.navigate('MobilePayment', {proxyPtNo: patientNumber});
                else
                  setToast({
                    type: 'error',
                    text1: '대리결제 대상 환자 조회 오류',
                    text2: '정보를 다시 확인해주세요.',
                  });
              })
              .catch(e => {
                console.log(e);
                setToast({ type: 'error', text1: '대리결제 대상 환자 조회 오류', text2: '정보를 다시 확인해주세요.' });
              })
              .finally(() => setLoadingVisible(false));
          } else setLoadingVisible(false);
        }}
      />
    </View>
  );
};

export default ProxyPayment;
