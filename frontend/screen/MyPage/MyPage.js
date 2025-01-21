import { useContext } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { TopBar, Summary } from '../../components';
import MenuItem from '../../components/List/MenuItem';
import { Color } from '../../styles';
import { UserContext } from '../../context';
import { getHospitalName } from '../../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentBody: {
    paddingBottom: 50,
  },
});

const mypageMenuArray = [
  {
    title: '모바일수납',
    img: require('../../assets/mypage/ic_sub_payment.png'),
    screen: 'MobilePayment',
  },
  {
    title: '수납 내역 조회',
    img: require('../../assets/mypage/ic_sub_payment_history.png'),
    screen: 'PaymentHistory',
  },
  {
    title: '결제 카드 관리',
    img: require('../../assets/mypage/ic_sub_payment.png'),
    screen: 'PaymentCardTab',
  },
  {
    title: '대리 결제',
    img: require('../../assets/mypage/ic_sub_proxy_payment.png'),
    screen: 'ProxyPayment',
  },
  {
    title: '진료내역조회',
    img: require('../../assets/mypage/ic_sub_diagnosis_history.png'),
    screen: 'TreatmentHistory',
  },
  {
    title: '검사내역조회',
    img: require('../../assets/mypage/ic_sub_test_history.png'),
    screen: 'DiagnosisHistory',
  },
  {
    title: '약 처방 조회',
    img: require('../../assets/mypage/ic_sub_medicine.png'),
    screen: 'PrescriptionHistory',
  },
  {
    title: '증명서 신청',
    img: require('../../assets/mypage/ic_sub_document.png'),
    screen: 'Proof',
  },
  // {
  //   title: '결제',
  //   img: require('../../assets/mypage/ic_sub_document.png'),
  //   screen: 'KPCPPayment',
  // },
];

const MyPage = ({ navigation }) => {
  const { code } = useContext(UserContext);
  const hospitalName = getHospitalName(code);
  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <TopBar hospitalName={hospitalName} navigation={navigation} showSetting={true} />
      {/* 콘텐트  */}
      <ScrollView>
        <Summary navigation={navigation} />
        <View style={styles.contentBody}>
          {mypageMenuArray &&
            mypageMenuArray.map((item, index) => (
              <MenuItem
                title={item.title}
                key={index}
                img={item.img}
                nav={() =>
                  item.navigator
                    ? navigation.navigate(item.navigator, { screen: item.screen, initial: false })
                    : navigation.navigate(item.screen)
                }
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default MyPage;
