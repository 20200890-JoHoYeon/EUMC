import { useContext, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { CheckBoxItem } from '../../components/List';
import { Color, Typography } from '../../styles';
import { UserContext } from '../../context';
import { regTrade } from '../../api/v1/eumc-pay';
import { ERROR_TERMS_AGREEMENT } from '../../popup-templates';
import { KCP_INFO } from '../../constants';
import PaymentCardReg from './PaymentCardReg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentWrap: {
    width: '100%',
    paddingBottom: 40,
  },
  contenrHeader: {
    paddingTop: 80,
    paddingBottom: 50,
    paddingHorizontal: 17,
  },
  contenBody: {
    marginHorizontal: 16,
  },
  applyAllLayout: {
    flexDirection: 'row',
    marginHorizontal: 5,
    marginVertical: 10,
  },
  applyLayout: {
    paddingVertical: 10,
    borderColor: Color.inputColor.lightGray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  applyAllCheckbox: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  applyAllCheckboxLabel: {
    alignSelf: 'center',
    color: Color.homeColor.primaryDarkgreen2,
    paddingLeft: 8,
  },
  logoImg: {
    width: 95,
    height: 95,
    alignSelf: 'center',
  },
  infoText: {
    paddingHorizontal: 27,
    marginTop: 23,
    letterSpacing: -0.59,
    color: Color.homeColor.primaryDarkPurple,
    lineHeight: 28,
  },
  ...Typography,
});

const images = {
  chkOff: require('../../assets/chk_off.png'),
  chkOn: require('../../assets/chk_green_on.png'),
};
const menuName = [
  { title: '서비스 이용약관', nav: 'CardServiceTerms' },
  { title: '개인정보 수집·이용 안내', nav: 'PersonalInfoTerms' },
  { title: '고유식별 수집·이용 안내', nav: 'UniqueInfoTerms' },
  { title: '휴대폰 본인확인 이용', nav: 'PhoneIdentificationTerms' },
];
const allChkOff = [false, false, false, false];
const allChkOn = [true, true, true, true];

const PaymentCardRegTerms = ({ navigation }) => {
  const { code, medicalCards, currentMedicalCardIndex, setKcpTrade, setToast } = useContext(UserContext);
  //  if (!(currentMedicalCardIndex >= 0)) return <View></View>;
  const { patientNumber } = medicalCards[currentMedicalCardIndex];

  const [chkAllChecked, setChkAllChecked] = useState(false);
  const [chkArray, setChkArray] = useState(allChkOff);

  const handleClickCheckAll = () => {
    if (chkAllChecked === false) {
      setChkAllChecked(true);
      setChkArray(allChkOn);
    } else {
      setChkAllChecked(false);
      setChkArray(allChkOff);
    }
  };

  const handleClickCheckSingle = index => {
    const newArr = [...chkArray];
    if (chkArray[index] === false) {
      newArr[index] = true;
      if (JSON.stringify(newArr) === JSON.stringify(allChkOn)) {
        setChkAllChecked(true);
      }
    } else {
      newArr[index] = false;
      setChkAllChecked(false);
    }
    setChkArray(newArr);
  };

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
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentWrap}
      >
        <View style={styles.contenrHeader}>
          <Image style={styles.logoImg} source={require('../../assets/payment_card/ic_main_payment_card.png')} />
        </View>
        <View style={styles.contenBody}>
          <View style={styles.applyAllLayout}>
            <Pressable onPress={handleClickCheckAll}>
              <Image style={styles.applyAllCheckbox} source={chkAllChecked ? images.chkOn : images.chkOff} />
            </Pressable>
            <EumcText style={[styles.applyAllCheckboxLabel, styles.smallXXBold]}>전체동의</EumcText>
          </View>
          <View style={styles.applyLayout}>
            {menuName &&
              menuName.map((item, index) => (
                <CheckBoxItem
                  key={index}
                  title={item.title}
                  checked={chkArray[index]}
                  onCheckPress={() => handleClickCheckSingle(index)}
                  onArrowPress={() => navigation.navigate(item.nav)}
                />
              ))}
          </View>
        </View>
        <EumcText style={[styles.small, styles.infoText]}>
          스마트결제 서비스는 카드번호, 카드인증방식 없이{'\n'}
          결제 비밀번호만으로도 결제가 가능한 안전하고 편리한{'\n'}
          서비스입니다.
        </EumcText>
      </ScrollView>
      <BottomTwoBtn
        leftTitle="취소"
        onCancel={() => navigation.goBack()}
        rightTitle="다음"
        onNext={() => {
          if (chkAllChecked) {
            navigation.navigate('PaymentCardReg', {
              type: 'REG_SMART',
            });




            // const orderId = getOrderId() + patientNumber;
            // const siteCode = (code === '01' ? KCP_INFO.PAY_SEOUL_SMART_SITE_CD : KCP_INFO.PAY_MOKDONG_SMART_SITE_CD);
            //
            // console.log(`siteCode : ${siteCode}`);
            //
            // //TODO: 카드 추가 동작
            // regTrade(orderId, siteCode)
            //   .then(res => {
            //     // const { PayUrl, approvalKey, traceNo } = res.data;
            //     console.log(res.data);
            //     setKcpTrade(res.data);
            //
            //     navigation.navigate('OrderReg');
            //   })
            //   .catch(e => console.log(e));
          } else setToast(Object.assign(ERROR_TERMS_AGREEMENT, { title: '카드 등록' }));
        }}
      />
    </View>
  );
};
export default PaymentCardRegTerms;
