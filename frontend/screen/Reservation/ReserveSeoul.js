import { Linking, Pressable, View, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';
import { EumcText, TimeInfo } from '../../components';
import { Color } from '../../styles';
import { useContext } from 'react';
import { UserContext } from '../../context';

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Color.homeColor.primaryWhite,
  },
  // 진료예약, 본인 외 예약 등 버튼 컨테이너
  content1: {
    backgroundColor: '#0e6d68',
    marginTop: 18,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  content2: {
    backgroundColor: Color.homeColor.primaryWhite,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  content3: {
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  // 아이콘 공통 마진
  icon1: {
    width: 36,
    height: 36,
    marginVertical: 12,
    marginLeft: 10,
    marginRight: 8,
  },
  //여러 폰트 스타일
  fontStyle1: {
    fontSize: 16,
    color: '#000',
  },
  fontStyle2: {
    fontSize: 16,
    color: Color.homeColor.primaryWhite,
  },
  //진료시간
  timeContainer: {
    marginTop: 5,
    marginLeft: 16,
  },
  timeMargin: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  timeTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6d6e71',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f1fffb',
    letterSpacing: -0.6,
  },
  timeWeek: {
    // fontSize: 10,
    // color: '#999',
    paddingHorizontal: 9,
    borderRadius: 2,
    backgroundColor: Color.homeColor.primaryWhite,
    // borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#939598',
    marginRight: 6,
    // lineHeight: 16,
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: -0.6,
    color: '#939598',
    lineHeight: 15,
  },
  timeWeekend: {
    fontSize: 10,
    color: Color.homeColor.primaryWhite,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
    backgroundColor: '#939598',
    borderStyle: 'solid',
    marginRight: 6,
  },
  timeFont: {
    fontSize: 12,
    color: '#231f20',
  },
  //오시는길 채널톡부분
  wayContainer: {
    position: 'relative',
    marginHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 48,
    //marginTop: 24,
    // marginBottom: 60,
  },
  buttonWrap: {
    flex: 1,
  },
  way: {
    maxWidth: 145,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.98,
    borderRadius: 17,
    backgroundColor: '#f5f5f5',
  },
  wayImage: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: Color.homeColor.primaryWhite,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  wayText: {
    paddingLeft: 9,
    paddingRight: 31,
    paddingVertical: 8,
    lineHeight: 20,
  },

  question: {
    maxWidth: 145,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.98,
    borderRadius: 17,
    backgroundColor: '#f5f5f5',
  },
  questionImage: {
    padding: 7,
    borderRadius: 20,
    backgroundColor: Color.homeColor.primaryWhite,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  questionText: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    lineHeight: 20,
  },
  //유의사항 부분
  noticeContainer: {
    //marginTop: 35,
    backgroundColor: Color.homeColor.primaryWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  notice: {
    fontSize: 14,
    color: '#16aea6',
    lineHeight: 20,
  },
  arrowIconArea: {
    width: 23,
    height: 23,
  },
  arrowIcon: {
    width: '100%',
    height: '100%',
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
    color: '#333333',
    fontSize: 14,
    letterSpacing: -0.35,
    lineHeight: 17,
  },
  channerTextArea: {
    position: 'relative',
    paddingTop: 9,
    paddingBottom: 9,
    paddingLeft: 40,
    width: 136,
    marginLeft: 6,
    paddingRight: 4,
    backgroundColor: ' rgba(245,245,245,0.98)',
    borderRadius: 17,
    opacity: 0.98,
  },
  channerContent: {
    position: 'absolute',
    top: -3,
    left: -6,
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
  findArea: {
    marginRight: 29,
  },
});

const ReserveSeoul = ({ navigation }) => {
  const { medicalCards, currentMedicalCardIndex, setRsvInfo } = useContext(UserContext);
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', position: 'relative' }}>
      <ScrollView contentContainerStyle={{}} style={styles.contentContainer}>
        <Pressable
          style={styles.content1}
          onPress={() => {
            const { name, patientNumber, relationship } = medicalCards[currentMedicalCardIndex];
            setRsvInfo({ name, patientNumber, relationship });
            navigation.navigate('SelectDepartment');
          }}
        >
          <Image style={styles.icon1} source={require('../../assets/reservation/ic_mainMenu_calendar.png')} />
          <EumcText style={styles.fontStyle2}>진료 예약</EumcText>
        </Pressable>
        <Pressable style={styles.content2} onPress={() => navigation.navigate('ReservationOther')}>
          <Image style={styles.icon1} source={require('../../assets/reservation/ic_mainMenu_calendarOther.png')} />
          <EumcText style={styles.fontStyle1}>본인 외 예약</EumcText>
        </Pressable>
        <Pressable style={styles.content2} onPress={() => navigation.navigate('ReserveNoticeSeoul')}>
          <Image style={styles.icon1} source={require('../../assets/reservation/ic_mainMenu_guide.png')} />
          <EumcText style={styles.fontStyle1}>진료 예약 전 안내 유의사항</EumcText>
        </Pressable>
        <Pressable style={styles.content2} onPress={() => Linking.openURL('tel:1522-7000')}>
          <Image style={styles.icon1} source={require('../../assets/reservation/ic_mainMenu_phoneCall.png')} />
          <EumcText style={styles.fontStyle1}>전화 예약 1522-7000</EumcText>
        </Pressable>
        <Pressable style={styles.content3} onPress={() => navigation.navigate('ReserveStep')}>
          <Image style={styles.icon1} source={require('../../assets/reservation/ic_mainMenu_guide.png')} />
          <EumcText style={styles.fontStyle1}>예약 절차 안내</EumcText>
        </Pressable>
        <View style={styles.timeContainer}>
          <TimeInfo
            backgroundColor="lightTeal"
            title="진료 시간"
            weekDate="08:30 ~ 17:00"
            WeekendDate="09:00 ~ 12:00"
          ></TimeInfo>
        </View>
        <View style={styles.wayContainer}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <Pressable
              style={styles.findArea}
              onPress={() =>
                navigation.navigate('WebViewPage', {
                  title: '찾아오시는 길',
                  link: 'https://seoul.eumc.ac.kr/guide/directions.do',
                })
              }
            >
              <View style={styles.channerTextArea}>
                <EumcText style={styles.channerText}>찾아오시는 길</EumcText>
                <View style={styles.channerContent}>
                  <View style={styles.channerIconArea}>
                    <Image
                      style={{ width: 27, height: 27 }}
                      source={require('../../assets/ic_info_location_purple.png')}
                    />
                  </View>
                </View>
              </View>
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
                      source={require('../../assets/ico_channertalk_purple.png')}
                      style={styles.channerIcon}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/*<Pressable style={styles.noticeContainer} onPress={() => navigation.navigate('ReserveNoticeSeoul')}>*/}
      {/*  <EumcText style={styles.notice}>진료 예약 전 안내 유의사항</EumcText>*/}
      {/*  <View style={styles.arrowIconArea}>*/}
      {/*    <ImageBackground*/}
      {/*      source={require('../../assets/icon/ic_dtl_arrow_right.png')}*/}
      {/*      style={styles.arrowIcon}*/}
      {/*    ></ImageBackground>*/}
      {/*  </View>*/}
      {/*</Pressable>*/}
    </View>
  );
};

export default ReserveSeoul;
