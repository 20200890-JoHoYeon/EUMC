import { useContext, useState } from 'react';
import { Dimensions, Linking, View, StyleSheet, ImageBackground, Pressable, ScrollView, StatusBar } from 'react-native';
import { SideBar, TimeInfo, BtnType02, CallBtn, EumcText } from '../components';
import { APP_INQURY_PHONE, MAIN_PHONE } from '../constants';
import { Color } from '../styles';
import { UserContext } from '../context/UserContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
    height: '100%',
    backgroundColor: Color.homeColor.primaryWhite,
    paddingBottom: 0,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 46,
    paddingTop: 37,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 18,
    borderTopWidth: 2,
    borderTopColor: '#16aea6',
  },
  footerWidth: {
    width: '50%',
  },

  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addrBtn: {
    maxWidth: 37,
    marginTop: 10,
    marginBottom: 4,
  },
  addrText: {
    color: '#231f20',
    fontSize: 12,
    lineHeight: 18,
  },
  callBtn: {
    marginTop: 10,
    marginBottom: 4,
  },
  callText: {
    fontSize: 20,
    color: '#16aea6',
    lineHeight: 29,
  },
  footerAfter: {
    position: 'relative',
    paddingTop: 9,
    paddingRight: 16,
    paddingBottom: 22,
    paddingLeft: 16,
    backgroundColor: '#f5f5f5',
  },
  appCallText: {
    marginTop: 4,
    color: '#666',
    fontSize: 20,
    lineHeight: 29,
  },
  channerIconArea: {
    width: 27,
    height: 27,
  },
  channerIcon: {
    width: '100%',
    height: '100%',
  },
  channerText: {
    color: '#666',
    fontSize: 12,
    letterSpacing: -0.3,
    lineHeight: 17,
  },
  channerTextArea: {
    position: 'relative',
    paddingTop: 9,
    paddingRight: 40,
    paddingBottom: 9,
    paddingLeft: 9,
    maxWidth: 152,
    width: '100%',
    backgroundColor: Color.homeColor.primaryWhite,
    borderRadius: 17,
    opacity: 0.98,
  },
  channerContent: {
    position: 'absolute',
    top: -3,
    right: -6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowRadius: 17,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  channerArea: {
    position: 'absolute',
    top: 37,
    right: 21,
  },
  header: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#ddd',
  },
  headerImgArea: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
  },
  headerSettingImgArea: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
  },
  backIcon: {
    width: '100%',
    height: '100%',
  },
  ptd0: {
    paddingBottom: 0,
    paddingTop: 0,
  },

  menuListArea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unknown: {
    width: '100%',
    height: 5,
    backgroundColor: '#f5f5f5',
  },
  hospitalText: {
    width: 184,
    height: 26,
    position: 'absolute',
    left: windowWidth / 2 - 92,
    bottom: 192 / 2 - 13,
  },
});

const SideMenu = ({ navigation }) => {
  const { code } = useContext(UserContext);

  const seoulData = [
    [
      {
        icon: require('../assets/ico_sub_chart.png'),
        title: '각 진료과 리스트',
        link: 'https://seoul.eumc.ac.kr/medical/dept/deptList.do',
      },
      {
        icon: require('../assets/ico_sub_hospital.png'),
        title: '각 센터 리스트',
        link: 'https://seoul.eumc.ac.kr/medical/dept/centerList.do',
      },
      {
        icon: require('../assets/ico_sub_calendar.png'),
        title: '예약 안내',
        link: 'https://seoul.eumc.ac.kr/guide/reservationInfo.do',
      },
      {
        icon: require('../assets/ico_sub_process.png'),
        title: '진료절차 안내',
        link: 'https://seoul.eumc.ac.kr/guide/procedureInfo.do',
      },
      {
        icon: require('../assets/ico_sub_emc.png'),
        title: '응급진료 안내',
        link: 'https://seoul.eumc.ac.kr/medical/emergency.do',
      },
      {
        icon: require('../assets/ico_sub_global.png'),
        title: '국제진료 안내',
        link: 'https://seoul.eumc.ac.kr/guide/internationalMediInfo.do',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_location.png'),
        title: '오시는 길',
        link: 'https://seoul.eumc.ac.kr/guide/directions.do',
      },
      {
        icon: require('../assets/ico_sub_parking.png'),
        title: '주차 안내',
        link: 'https://seoul.eumc.ac.kr/guide/parking.do',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_hospitalization.png'),
        title: '입원/퇴원 안내',
        link: 'https://seoul.eumc.ac.kr/medical/procedure1.do',
      },
      {
        icon: require('../assets/ico_sub_visit.png'),
        title: '병문안 안내',
        link: 'https://seoul.eumc.ac.kr/guide/visitInfo.do',
      },
      {
        icon: require('../assets/ico_sub_issue.png'),
        title: '신청/발급 안내',
        link: 'https://seoul.eumc.ac.kr/guide/proofInfo.do',
      },
      {
        icon: require('../assets/ico_sub_floor.png'),
        title: '층별 안내',
        link: 'https://seoul.eumc.ac.kr/guide/preview.do?floor=B2',
      },
      {
        icon: require('../assets/ico_sub_convenience.png'),
        title: '편의시설',
        link: 'https://seoul.eumc.ac.kr/guide/convenience1.do',
      },
      {
        icon: require('../assets/ico_sub_tel.png'),
        title: '안내전화',
        link: 'https://seoul.eumc.ac.kr/guide/infoTel.do',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_health.png'),
        title: '웰니스 건강증진센터',
        link: 'https://seoul.eumc.ac.kr/wellness/main.do',
      },
      {
        icon: require('../assets/ico_sub_funeral.png'),
        title: '장례식장',
        link: 'https://seoul.eumc.ac.kr/funeral/main.do',
      },
    ],
  ];

  const mokDongData = [
    [
      {
        icon: require('../assets/ico_sub_chart.png'),
        title: '각 진료과 리스트',
        link: 'https://mokdong.eumc.ac.kr/medical/dept/deptList.do',
      },
      {
        icon: require('../assets/ico_sub_hospital.png'),
        title: '각 센터 리스트',
        link: 'https://mokdong.eumc.ac.kr/medical/dept/centerList.do',
      },
      {
        icon: require('../assets/ico_sub_calendar.png'),
        title: '예약 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/reservationInfo.do',
      },
      {
        icon: require('../assets/ico_sub_process.png'),
        title: '진료절차 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/procedureInfo.do',
      },
      {
        icon: require('../assets/ico_sub_system.png'),
        title: '의료전달체계 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/medicalSystemInfo.do',
      },
      {
        icon: require('../assets/ico_sub_emc.png'),
        title: '응급진료 안내',
        link: 'https://mokdong.eumc.ac.kr/medical/emergency.do',
      },
      {
        icon: require('../assets/ico_sub_global.png'),
        title: '국제진료 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/internationalMediInfo.do',
      },
      {
        icon: '',
        title: '',
        link: '',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_location.png'),
        title: '오시는 길',
        link: 'https://mokdong.eumc.ac.kr/guide/directions.do',
      },
      {
        icon: require('../assets/ico_sub_parking.png'),
        title: '주차 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/parking.do',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_hospitalization.png'),
        title: '입원/퇴원 안내',
        link: 'https://mokdong.eumc.ac.kr/medical/procedure1.do',
      },
      {
        icon: require('../assets/ico_sub_visit.png'),
        title: '병문안 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/visitInfo.do',
      },
      {
        icon: require('../assets/ico_sub_issue.png'),
        title: '신청/발급 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/proofInfo.do',
      },
      {
        icon: require('../assets/ico_sub_floor.png'),
        title: '층별 안내',
        link: 'https://mokdong.eumc.ac.kr/guide/preview.do?floor=B1',
      },
      {
        icon: require('../assets/ico_sub_convenience.png'),
        title: '편의시설',
        link: 'https://mokdong.eumc.ac.kr/guide/convenience1.do',
      },
      {
        icon: require('../assets/ico_sub_tel.png'),
        title: '안내전화',
        link: 'https://mokdong.eumc.ac.kr/guide/infoTel.do',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_chekup.png'),
        title: '국가건강검진',
        link: 'https://mokdong.eumc.ac.kr/guide/national.do',
      },
      {
        icon: require('../assets/ico_sub_special.png'),
        title: '특수건강검진',
        link: 'https://mokdong.eumc.ac.kr/guide/special.do',
      },
      {
        icon: require('../assets/ico_sub_exact.png'),
        title: '정밀검진 프로그램',
        link: 'https://mokdong.eumc.ac.kr/guide/precision.do',
      },
      {
        icon: '',
        title: '',
        link: '',
      },
    ],
    [
      {
        icon: require('../assets/ico_sub_funeral.png'),
        title: '장례식장',
        link: 'https://mokdong.eumc.ac.kr/funeral/main.do',
      },
      {
        icon: '',
        title: '',
        link: '',
      },
    ],
  ];

  const list = listData =>
    listData.map(data =>
      data.map((data, index) => (
        <SideBar key={index} title={data.title} icon={data.icon} link={data.link} navigation={navigation} />
      ))
    );

  const footerElement = () => {
    switch (code) {
      case '01':
        return (
          <View style={styles.footer}>
            <View style={styles.footerWidth}>
              <TimeInfo title="접수 시간" weekDate="08:00 ~ 16:45" WeekendDate="(오전) 08:30 ~ 11:30"></TimeInfo>

              <View style={styles.addrBtn}>
                <BtnType02 text="주소"></BtnType02>
              </View>
              <EumcText style={styles.addrText}>서울특별시 강서구 공항대로{`\n`}260 (우 07804)</EumcText>
            </View>
            <View style={styles.footerWidth}>
              <TimeInfo
                title="진료 시간"
                weekDate={'(오전) 08:30 ~ 12:00\n(오후) 13:00 ~ 17:00'}
                WeekendDate="(오전) 09:00 ~ 12:00"
              ></TimeInfo>
              <View style={[styles.callBtn, styles.flexLayout]}>
                <CallBtn text="대표 전화(진료 예약)"></CallBtn>
              </View>
              <EumcText style={styles.callText} fontWeight="bold">
                {MAIN_PHONE(code)}
              </EumcText>
            </View>
          </View>
        );
      case '02':
        return (
          <View style={styles.footer}>
            <View style={styles.footerWidth}>
              <TimeInfo title="접수 시간" weekDate={"(오전) 07:40 ~ 11:45\n(오후) 13:00 ~ 16:45"} WeekendDate="(오전) 08:30 ~ 11:30"></TimeInfo>

              <View style={styles.addrBtn}>
                <BtnType02 text="주소"></BtnType02>
              </View>
              <EumcText style={styles.addrText}>서울특별시 양천구 안양천로{`\n`}1071(우 07895)</EumcText>
            </View>
            <View style={styles.footerWidth}>
              <TimeInfo title="진료 시간" weekDate={'(오전) 08:00 ~ 12:00\n(오후) 13:00 ~ 17:00'} WeekendDate="(오전) 09:00 ~ 12:00"></TimeInfo>
              <View style={[styles.callBtn, styles.flexLayout]}>
                <CallBtn text="대표 전화(진료 예약)"></CallBtn>
              </View>
              <Pressable onPress={() => Linking.openURL(`tel:${MAIN_PHONE(code)}`)}>
                <EumcText style={styles.callText} fontWeight="bold">
                  {MAIN_PHONE(code)}
                </EumcText>
              </Pressable>
            </View>
          </View>
        );
      default:
        <EumcText></EumcText>;
    }
  };

  const backgroundImg = code === '01' ? require('../assets/visual_seoul.png') : require('../assets/visual_mokdong.png');
  const { top, left, right, bottom } = useSafeAreaInsets();
  const DEFAULT_IMG_HEIGHT = 192 + top;
  const [imgHeight, setImgHeight] = useState({ height: DEFAULT_IMG_HEIGHT });
  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ marginBottom: bottom, marginLeft: left, marginRight: right }}
      onScroll={evt => {
        const y = evt.nativeEvent.contentOffset.y;
        if (y > 0 && y < top) setImgHeight({ height: Math.max(top * 2, DEFAULT_IMG_HEIGHT - y * 2) });
      }}
      scrollEventThrottle={32}
    >
      <StatusBar barStyle="default" />
      <View style={[styles.header, imgHeight]}>
        <ImageBackground source={backgroundImg} style={styles.backIcon}>
          <Pressable style={[styles.headerImgArea, { marginTop: top }]} onPress={() => navigation.goBack()}>
            <ImageBackground source={require('../assets/ico_back_white.png')} style={styles.backIcon} />
          </Pressable>
        </ImageBackground>
      </View>

      <View style={[styles.menuContainer, styles.ptd0]}>
        <View style={styles.menuListArea}>{code === '01' ? list(seoulData) : list(mokDongData)}</View>
        <View style={styles.footerWrap}>
          {footerElement()}
          <View style={styles.footerAfter}>
            <View style={[styles.callBtn, styles.flexLayout]}>
              <CallBtn text="앱 사용 전화문의"></CallBtn>
            </View>
            <Pressable onPress={() => Linking.openURL(`tel:${APP_INQURY_PHONE}`)}>
              <EumcText style={styles.appCallText} fontWeight="bold">
                {APP_INQURY_PHONE}
              </EumcText>
            </Pressable>

            <Pressable
              style={styles.channerArea}
              onPress={() =>
                navigation.navigate('WebViewPage', {
                  title: '채널톡 문의',
                  link: 'https://4cgate.channel.io/support-bots/24393',
                })
              }
            >
              <View style={styles.channerTextArea}>
                <EumcText style={styles.channerText}>채널톡 문의</EumcText>
                <View style={styles.channerContent}>
                  <View style={styles.channerIconArea}>
                    <ImageBackground
                      source={require('../assets/ico_channertalk_purple.png')}
                      style={styles.channerIcon}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SideMenu;
