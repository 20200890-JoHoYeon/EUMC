import { View, StyleSheet, TextInput } from 'react-native';
import { EumcText } from '../../components';
import GreenBtn from '../../components/GreenBtn';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 3,
    height: '100%',
  },
  greenBtnContainer: {
    padding: 10,
    marginTop: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  whiteInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bcbec0',
    padding: 10,
    fontSize: 13,
    height: 40,
    marginHorizontal: 10,
    marginTop: 5,
  },
  userForm: {
    marginBottom: 10,
  },
  userFormAsked: {
    fontSize: 14,
    color: '#000',
    marginRight: 20,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
});

const PaymentProxy = () => {
  return (
    <View style={styles.container}>
      <View style={styles.userForm}>
        <EumcText style={styles.userFormAsked} fontWeight="bold">
          환자번호
        </EumcText>
        <TextInput style={styles.whiteInput} placeholder="환자번호를 입력해주세요." placeholderTextColor="#bcbec0" />
      </View>
      <View style={styles.userForm}>
        <EumcText style={styles.userFormAsked} fontWeight="bold">
          환자명
        </EumcText>
        <TextInput style={styles.whiteInput} placeholder="이름을 입력해주세요." placeholderTextColor="#bcbec0" />
      </View>
      <View style={styles.userForm}>
        <EumcText style={styles.userFormAsked} fontWeight="bold">
          생년월일
        </EumcText>
        <TextInput style={styles.whiteInput} placeholder="예) 19901221" placeholderTextColor="#bcbec0" />
      </View>

      <View style={styles.greenBtnContainer}>
        <GreenBtn style={styles.midMenuWiteText}>조회</GreenBtn>
      </View>
    </View>
  );
};
export default PaymentProxy;
