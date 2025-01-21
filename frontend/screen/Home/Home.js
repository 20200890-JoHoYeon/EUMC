import { Pressable, View, ScrollView, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { Color, Typography } from '../../styles';
import { EumcText, Summary, TopBar } from '../../components';
import { MenuBoxItem } from '../../components/List';
import { RoundBtn } from '../../components/Buttons';
import { ERROR_NO_PATIENT } from '../../popup-templates';

const homeColor = Color.homeColor;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeColor.primaryWhite,
  },
  contentWrap: {
    width: '100%',
  },
  contentHeader: {
    paddingTop: 36,
    paddingBottom: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentBody: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
  },
  midImg: {
    width: 32,
    height: 32,
    alignSelf: 'center',
    marginRight: 9,
  },
  layoutPd: {
    paddingHorizontal: 16,
  },
  ...Typography,

  /* 자주 이용 서비스 섹션 */
  smallButtonArea: {
    backgroundColor: homeColor.primaryGray,
    borderRadius: 10,
    paddingHorizontal: 13,
    height: 20,
    justifyContent: 'center',
  },
  smallButtonText: {
    color: homeColor.primaryWhite,
  },

  /*안내 서비스 섹션 */
  menuBoxGray: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: 8,
    backgroundColor: homeColor.primaryLightGray,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 8,
    alignItems: 'center',
  },
  menuBoxGrayRight: {
    marginLeft: 8,
  },

  /*버튼 */
  btnShadow: {
    shadowColor: homeColor.primaryBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 10,
  },
});

const FirstEnter = ({ onPress }) => {
  return (
    <View style={[styles.contentBody, styles.layoutPd, { marginTop: 6 }]}>
      <EumcText style={[styles.regularX, { letterSpacing: -1.56, lineHeight: 35, marginBottom: 20 }]}>
        <EumcText fontWeight="bold">첫 방문이시네요.</EumcText>
        {'\n'}모바일 진료카드 발급을 {'\n'}진행해 주세요.
      </EumcText>
      <RoundBtn title="진료카드 발급" style={styles.btnShadow} onPress={onPress} />
    </View>
  );
};

const Home = ({ navigation }) => {
  const { selectMenus, code, medicalCards, setToast } = useContext(UserContext);

  return (
    <View style={[styles.container]}>
      <SafeAreaView>
        <TopBar navigation={navigation} />
      </SafeAreaView>
      {/* 콘텐트  */}
      <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contentWrap}>
        {medicalCards.length > 0 ? (
          <Summary navigation={navigation} />
        ) : (
          <FirstEnter onPress={() => navigation.push('MedicalCardRegTerms')} />
        )}
        <View style={styles.layoutPd}>
          <View style={styles.contentHeader}>
            <EumcText style={[styles.mediumXXBold, { lineHeight: 23 }]}>자주 이용하는 메뉴</EumcText>
            {medicalCards?.length > 0 && (
              <Pressable onPress={() => navigation.push('FavoriteMenu')} style={styles.smallButtonArea}>
                <EumcText style={[styles.smallButtonText, styles.micro]}>설정</EumcText>
              </Pressable>
            )}
          </View>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: 16 }}
          contentContainerStyle={[styles.contentBody, { paddingHorizontal: 5 }]}
          PagingEnable={true}
        >
          {selectMenus &&
            selectMenus.map((item, index) => {
              const { navigator, screen } = item;
              if (item.key === 3 && medicalCards?.length === 0) {
                item = {
                  key: 3,
                  img: require('../../assets/ic_main_ticket.png'),
                  navigator: 'MainTabs',
                  text: '번호표\n발급',
                  screen: 'MyPageTab',
                };
              }
              return (
                <MenuBoxItem
                  idx={index}
                  key={item.key}
                  content={item}
                  onPress={() => {
                    if (medicalCards?.length === 0) {
                      setToast(
                        Object.assign(ERROR_NO_PATIENT, { redirect: () => navigation.navigate('MedicalCardRegTerms') })
                      );
                    } else {
                      if (item.text === '입퇴원\n안내') {
                        navigation.push('WebViewPage', {
                          title: '입퇴원 안내',
                          link:
                            code === '01'
                              ? 'https://seoul.eumc.ac.kr/medical/procedure1.do'
                              : 'https://mokdong.eumc.ac.kr/medical/procedure1.do',
                        });
                      } else if (item.navigator && item.screen)
                        navigation.navigate(navigator, { screen, initial: false });
                      else navigation.push(screen);
                    }
                  }}
                />
              );
            })}
        </ScrollView>
        <View style={styles.layoutPd}>
          <View style={styles.contentHeader}>
            <EumcText style={[styles.mediumXXBold, { lineHeight: 23 }]}>안내 서비스</EumcText>
          </View>
          <View style={styles.contentBody}>
            <View style={styles.row}>
              <Pressable
                style={styles.menuBoxGray}
                onPress={() =>
                  navigation.push('WebViewPage', {
                    title: '진료 안내',
                    link:
                      code === '01'
                        ? 'https://seoul.eumc.ac.kr/guide/procedureInfo.do'
                        : 'https://mokdong.eumc.ac.kr/guide/procedureInfo.do',
                  })
                }
              >
                <Image style={styles.midImg} source={require('../../assets/ic_info_hospital.png')} />
                <EumcText style={styles.smallXXBold}>진료 안내</EumcText>
              </Pressable>
              <Pressable
                style={[styles.menuBoxGray, styles.menuBoxGrayRight]}
                onPress={() =>
                  navigation.push('WebViewPage', {
                    title: '진료과 안내',
                    link:
                      code === '01'
                        ? 'https://seoul.eumc.ac.kr/medical/dept/deptList.do'
                        : 'https://mokdong.eumc.ac.kr/medical/dept/deptList.do',
                  })
                }
              >
                <Image style={styles.midImg} source={require('../../assets/ic_info_chart.png')} />
                <EumcText style={styles.smallXXBold}>진료과 안내</EumcText>
              </Pressable>
            </View>
            <View style={styles.row}>
              <Pressable
                style={styles.menuBoxGray}
                onPress={() =>
                  navigation.push('WebViewPage', {
                    title: '찾아오시는 길',
                    link:
                      code === '01'
                        ? 'https://seoul.eumc.ac.kr/guide/directions.do'
                        : 'https://mokdong.eumc.ac.kr/guide/directions.do',
                  })
                }
              >
                <Image style={styles.midImg} source={require('../../assets/ic_info_location.png')} />
                <EumcText style={styles.smallXXBold}>찾아오시는 길</EumcText>
              </Pressable>
              <Pressable
                style={[styles.menuBoxGray, styles.menuBoxGrayRight]}
                onPress={() =>
                  navigation.push('WebViewPage', {
                    title: '채널톡 문의',
                    link: 'https://4cgate.channel.io/support-bots/24393',
                  })
                }
              >
                <Image style={styles.midImg} source={require('../../assets/ic_channeltalk.png')} />
                <EumcText style={styles.smallXXBold}>채널톡 문의</EumcText>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* contentwrap end */}
    </View>
  );
};
export default Home;
