import { StyleSheet, View, Image } from 'react-native';
import { useLayoutEffect } from 'react';
import { EumcText, TopBarSimple } from '../components';
import { BottomOneBtn, BottomTwoBtn } from '../components/Buttons';
import { Color, Typography } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    color: Color.homeColor.primaryBlack,
    ...Typography.smallXXBoldCenter,
  },
  logoImg: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
  },
});

const ConfirmScreen = ({ navigation, route }) => {
  const btnUse = route.params.btnUse;
  const headerShown = route.params.headerShown;
  const bottomText = route.params.bottomText;
  const bottomBtn = route.params.bottomBtn;
  console.log(bottomBtn);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.headerTitle,
      headerShadowVisible: false,
    });
  }, [navigation]);

  let btnType = '';
  const bttomBtnType = () => {
    if (btnUse === true) {
      btnType = <BottomOneBtn rightTitle="확인" onNext={() => navigation.navigate(route.params.target)} />;
    } else if (bottomBtn === 'bottomTwoBtn') {
      btnType = (
        <BottomTwoBtn
          leftTitle="홈으로 이동"
          rightTitle="증명서 신청"
          onNext={() => navigation.navigate('Proof')}
          onCancel={() => navigation.navigate('MainHome')}
        />
      );
    } else {
      btnType = false;
    }
    return btnType;
  };

  return (
    <View style={styles.container}>
      {headerShown === false && <TopBarSimple title="진료카드" navigation={navigation} />}
      <View style={styles.contentWrap}>
        <Image style={styles.logoImg} source={require('../assets/payment_card/ic_bic_check.png')} />
        <EumcText style={styles.contentText}>{route.params.content}</EumcText>
      </View>
      {bottomText === true ? (
        <EumcText style={{ marginHorizontal: 16, color: '#818181' }}>
          * 수납 결제 취소는 창구에서만 가능 합니다.{'\n'}* 원하시는 모든 증명서는 본인 및 위임자 확인 불가능할 경우
          발급에 제한이 있을 수 있습니다. 또한 발급시에는 발급 비용이 발생되며 담당 의사 진료일에만 발급이 가능합니다.
        </EumcText>
      ) : (
        ''
      )}
      {/* {btnUse === true ? (
        <BottomOneBtn rightTitle="확인" onNext={() => navigation.navigate(route.params.target)} />
      ) : bottomBtn === 'bottomTwoBtn' ? (
        <BottomTwoBtn
          leftTitle="취소"
          rightTitle="조회"
          onNext={() => {
            if (calData.start.date && calData.end.date) {
              setLoadingVisible(true);
              navigation.navigate(`${type}HistoryDetail`, { calData });
            }
          }}
          onCancel={() => navigation.goBack()}
        />
      ) : (
        ''
      )} */}
      {bttomBtnType()}
    </View>
  );
};

export default ConfirmScreen;
