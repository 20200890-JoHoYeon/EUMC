import { useContext, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Color, Typography } from '../../styles';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { OneBtnModal } from '../../components/Modals';
import { SimpleInput } from '../../components/Inputs';
import { CONFIRM_ADD_PAYMENT_CARD, ERROR_GENERIC_MISSING_VALUE } from '../../popup-templates';
import { UserContext } from '../../context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 17,
    paddingVertical: 6,
  },
  contentTitle: {
    marginTop: 4,
    marginBottom: 4,
    color: Color.myPageColor.darkGray,
  },
  infoText: {
    marginTop: 16,
    paddingHorizontal: 5,
    color: Color.homeColor.primaryDarkPurple,
    lineHeight: 28,
    //letterSpacing: -0.59,
  },
  ...Typography,
});

const PaymentCardInfoAdd = ({ navigation }) => {
  const { setToast } = useContext(UserContext);

  const [cardNum, setCardNum] = useState();
  const [exDate, setExDate] = useState();
  const [certNum, setCertNum] = useState();
  const [nickname, setNickname] = useState();

  const trimSetCardNum = text => {
    setCardNum(text.replace(/ /g, ''));
  };

  const validateCardInfo = () => {


    //const userData = [cardNum, exDate, certNum, nickname];
    const userData = {
      cardNum: cardNum,
      exDate: exDate,
      certNum: certNum,
      nickname: nickname,
    };
    for (key of Object.keys(userData)) {
      // console.log(userData[key]);
      if (!userData[key]) {
        switch (key) {
          case 'cardNum':
            setToast(ERROR_GENERIC_MISSING_VALUE('카드번호'));
            break;
          case 'exDate':
            setToast(ERROR_GENERIC_MISSING_VALUE('유효기간'));
            break;
          case 'certNum':
            setToast(ERROR_GENERIC_MISSING_VALUE('카드인증번호'));
            break;
          case 'nickname':
            setToast(ERROR_GENERIC_MISSING_VALUE('카드 닉네임'));
            break;
        }
        return false;
      }
    }
    //console.log(userData[key].value);

    // for (let value of userData) {
    //   if (!value) {
    //     errorName =
    //     setModalCreateVisible(true)
    //     return false;
    //   }
    // }
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <EumcText style={[styles.contentTitle, styles.smallBold]}>신용카드 정보 등록</EumcText>
        <SimpleInput
          label="카드번호"
          placeHolder="카드 번호"
          type="creditCard"
          maxLength={19}
          setValue={trimSetCardNum}
        />
        <SimpleInput label="유효기간" placeHolder="MM/YY" type="expiryDate" maxLength={5} setValue={setExDate} />
        <SimpleInput label="카드비밀번호" placeHolder="앞 2자리" type="numeric" maxLength={2} />
        <SimpleInput
          label="카드인증번호"
          placeHolder="생년월일(6자리) 입력"
          type="numeric"
          maxLength={6}
          setValue={setCertNum}
        />
        <SimpleInput label="카드닉네임" placeHolder="카드 구분 닉네임 입력" type="text" setValue={setNickname} />
        <EumcText style={[styles.small, styles.infoText]}>
          ※휴대폰 명의와 등록할 카드의 명의가 동일해야{'\n'}
          간편결제 등록이 가능합니다.
        </EumcText>
      </View>
      <BottomTwoBtn
        leftTitle="취소"
        onCancel={() => navigation.goBack()}
        rightTitle="다음"
        onNext={() => {
          validateCardInfo() &&
            setToast(
              Object.assign(CONFIRM_ADD_PAYMENT_CARD, {
                redirect: () =>
                  navigation.navigate('SecurePinScreen', {
                    mode: 'identify',
                    userData: JSON.stringify({
                      cardNum: cardNum,
                      exDate: exDate,
                      certNum: certNum,
                      nickname: nickname,
                    }),
                    successParams: JSON.stringify({
                      headerShown: true,
                      btnUse: true,
                      headerTitle: '결제카드관리',
                      content: `결제카드 등록이 완료 되었습니다.`,
                      target: 'PaymentCardMain',
                    }),
                  }),
              })
            );
        }}
      />
    </View>
  );
};
export default PaymentCardInfoAdd;
