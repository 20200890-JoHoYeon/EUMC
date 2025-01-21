import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ImageBackground,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import bcrypt from 'react-native-bcrypt';
import { CallBtn, EumcText } from '../../components';
import { SimpleInput } from '../../components/Inputs';
import { RoundBorderBtn, BottomTwoBtn } from '../../components/Buttons';
import { BottomModal } from '../../components/Modals';
import { Color, Typography } from '../../styles';
import AlertOutline from '../../assets/icon/alert-outline';
import { deleteReservation, getRsvList, getRsvListInner } from '../../api/v1/reservation';
import { UserContext } from '../../context';
import { getHospitalName, formatDate3, formatTime } from '../../utils';
import { APP_INQURY_PHONE } from '../../constants';

// 예약현황 스타일
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
    paddingTop: 19,
  },
  contentContainer: {
    marginHorizontal: 16,
    // marginVertical: 19,
    marginBottom: 15,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    backgroundColor: Color.homeColor.primaryWhite,
    ...Color.shadowColor.card2,
  },
  boxContainer: {
    flexDirection: 'row',
    borderColor: '#e3e4e5',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  boxTitle: {
    alignItems: 'center',
    textAlign: 'left',
    fontSize: 14,
    color: '#939598',
    width: 55,
    lineHeight: 20,
    marginRight: 32,
    marginLeft: 8,
  },
  boxContent: {
    alignItems: 'center',
    lineHeight: 20,
    fontSize: 14,
    color: '#231f20',
    textAlign: 'left',
  },
  cancelButton: {
    marginTop: 9,
    marginHorizontal: 12,
    paddingVertical: 9,
  },
  borderNone: {
    borderColor: '#fff',
  },
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    lineHeight: 26,
  },
  modalContentText2: {
    color: Color.homeColor.primaryDarkPurple,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 11,
    lineHeight: 26,
  },
  ...Typography,
});

// 예약취소 비밀번호 확인 스타일
const style2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
    //backgroundColor: '#ff0000',
    justifyContent: 'space-between',
    //alignItems: 'center',
    //justifyContent: 'space-evenly',
    // flexDirection: 'row',
  },
  mainText: {
    fontSize: 16,
    color: '#7670b3',
    lineHeight: 24,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginHorizontal: 16,
  },
  pressableContainer: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  font: {
    fontSize: 14,
    color: '#939598',
  },
  callBtn: {
    marginTop: 10,
    marginBottom: 4,
  },
  channerArea: {
    position: 'absolute',
    top: 37,
    right: 21,
  },
  channerTextArea: {
    position: 'relative',
    paddingTop: 9,
    paddingRight: 40,
    paddingBottom: 9,
    paddingLeft: 9,
    maxWidth: 152,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 17,
    opacity: 0.98,
  },
  channerIconArea: {
    width: 27,
    height: 27,
  },
  channerText: {
    color: '#666',
    fontSize: 12,
    letterSpacing: -0.3,
  },
  channerContent: {
    position: 'absolute',
    top: -3,
    right: -6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  appCallText: {
    marginTop: 4,
    color: '#666666',
    fontSize: 20,
    letterSpacing: -0.1,
  },
  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channerIcon: {
    width: '100%',
    flex: 1,
  },
  footerAfter: {
    position: 'absolute',
    width: '100%',
    bottom: 80,
    paddingTop: 19,
    paddingRight: 16,
    paddingBottom: 22,
    paddingLeft: 16,
  },
  buttonContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  buttonCancel: {
    flex: 1,
    marginRight: 4,
  },
  buttonConfirm: {
    flex: 1,
    marginLeft: 4,
  },
  loadingIndicator: {
    flex: 1,
    alignItems: 'center',
  },
});

// 예약취소 모달 스타일
const style3 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 16,
    color: '#231f20',
  },
  titleText: {
    marginHorizontal: 16,
    lineHeight: 29,
    textAlign: 'center',
    fontSize: 20,
    color: '#00583f',
  },
  contentContainer: {
    marginTop: 24,
    marginHorizontal: 24,
  },
  shdowStyle: {
    shadowColor: Color.homeColor.primaryBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 3,
    backgroundColor: '#fff',
  },
  boxContainer: {
    flexDirection: 'row',
    borderColor: '#e3e4e5',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  boxTitle: {
    alignItems: 'center',
    textAlign: 'left',
    fontSize: 16,
    color: '#939598',
    width: 100,
    marginRight: 18,
    marginLeft: 8,
    lineHeight: 20,
  },
  boxContent: {
    alignItems: 'center',
    fontSize: 16,
    color: '#231f20',
    textAlign: 'left',
    lineHeight: 20,
  },
  infoText: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
    color: Color.homeColor.primaryDarkPurple,
  },
  smallXX: {
    fontSize: 16,
    lineHeight: 19,
  },
  smallBold: {
    fontSize: 14,
    textAlign: 'left',
    alignSelf: 'flex-start',
    fontFamily: 'NotoSansKR-Bold',
    lineHeight: 20,
  },
  contentTitle: {
    marginBottom: 8,
    color: Color.myPageColor.darkGray,
  },
  bottomText: {
    marginTop: 20,
  },
  font: {
    color: '#939598',
    lineHeight: 20,
  },
  /* footer */
  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callBtn: {
    marginTop: 10,
    marginBottom: 4,
  },
  footerAfter: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingRight: 16,
    paddingBottom: 20,
    paddingLeft: 16,
  },
  appCallText: {
    marginTop: 4,
    color: Color.inputColor.darkGray,
    lineHeight: 24,
    fontSize: 20,
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
    color: Color.inputColor.darkGray,
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: -0.3,
  },
  channerTextArea: {
    position: 'relative',
    paddingTop: 8,
    paddingRight: 40,
    paddingBottom: 10,
    paddingLeft: 12,
    maxWidth: 152,
    width: '100%',
    backgroundColor: Color.homeColor.primaryLightGray,
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
    shadowColor: Color.inputColor.black,
    shadowOpacity: 0.16,
    shadowRadius: 17,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  bottomText: {
    marginTop: 20,
    color: '#939598',
  },
  marginHorizontal16: {
    marginHorizontal: 16,
  },
  serviceText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

/*
const formatTime = time => {
  if (typeof time === 'string' && time.length === 4) {
    const timeNum = +time;
    if (timeNum >= 1200) return `오후 ${Math.floor(timeNum / 100) - 12}:${time.slice(2)}`;
    else return `오전 ${Math.floor(timeNum / 100)}:${time.slice(2)}`;
  } else return time;
};
*/

const ReserveCheck = ({ modalVisible, setModalVisible, navigation }) => {
  const [index, setIndex] = useState(0);

  const { code, medicalCards, currentMedicalCardIndex, setToast, reservations, setReservations, refreshToggle } =
    useContext(UserContext);
  const [cancel, setCancel] = useState(true);
  const [loadingVisible, setLoadingVisible] = useState(false);
  // const isFocused = useIsFocused();

  const refresh = () => {
    if (currentMedicalCardIndex >= 0) {
      setLoadingVisible(true);
      const { patientNumber } = medicalCards[currentMedicalCardIndex];
      // 예약 내역 범위는 서버에서 지정
      // getRsvListInner(code, patientNumber, patientNumber)
      getRsvList(code, patientNumber, patientNumber, null, null)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) setReservations(data.sort((a, b) => +a.MED_DT.replace(/\D+/g, '') - +b.MED_DT.replace(/\D+/g, '')));
        })
        .catch(e => {
          setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
          console.log(e);
        })
        .finally(() => setLoadingVisible(false));
    }
  };

  const onRefresh = useCallback(() => {
    refresh();
  }, []);

  useEffect(() => {
    refresh();
  }, [code, refreshToggle]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={loadingVisible} onRefresh={onRefresh} />}
    >
      {loadingVisible ? (
        <ActivityIndicator style={style2.loadingIndicator} />
      ) : cancel ? (
        <ReserveCheckContainer
          code={code}
          setCancel={setCancel}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          index={index}
          setIndex={setIndex}
          reservations={reservations}
        />
      ) : (
        <ReserveCancelPw
          cancel={cancel}
          setCancel={setCancel}
          index={index}
          navigation={navigation}
          setIndex={setIndex}
          reservations={reservations}
        />
      )}
    </ScrollView>
  );
};

const ReserveCheckContainer = ({ code, modalVisible, setModalVisible, index, setIndex, reservations, setCancel }) => {
  const { currentMedicalCardIndex, setToast } = useContext(UserContext);

  return (
    currentMedicalCardIndex >= 0 && (
      <View style={style.container}>
        {reservations.length > 0 ? (
          <>
            {reservations.map((arr, number) => (
              <View style={[style.contentContainer, style.shdowStyle]} key={number}>
                <View style={style.boxContainer}>
                  <EumcText style={style.boxTitle}>성명</EumcText>
                  <EumcText style={style.boxContent}>{arr.PT_NM}</EumcText>
                </View>
                <View style={style.boxContainer}>
                  <EumcText style={style.boxTitle}>병원</EumcText>
                  <EumcText style={style.boxContent}>{getHospitalName(code)}</EumcText>
                </View>
                <View style={style.boxContainer}>
                  <EumcText style={style.boxTitle}>진료과</EumcText>
                  <EumcText style={style.boxContent}>{arr.DEPT_NM}</EumcText>
                </View>
                <View style={style.boxContainer}>
                  <EumcText style={style.boxTitle}>진료의</EumcText>
                  <EumcText style={style.boxContent}>{arr.MEDR_NM}</EumcText>
                </View>
                <View style={style.boxContainer}>
                  <EumcText style={style.boxTitle}>진료일</EumcText>
                  <EumcText style={style.boxContent}>{formatDate3(arr.MED_DT)}</EumcText>
                </View>
                <View style={[style.boxContainer, style.borderNone]}>
                  <EumcText style={style.boxTitle}>진료시간</EumcText>
                  <EumcText style={style.boxContent}>{formatTime(arr.MED_TM)}</EumcText>
                </View>
                {arr.SEL_TYPE === '진료' ?
                  <RoundBorderBtn
                    title="예약취소"
                    style={style.cancelButton}
                    onPress={() => {
                      setIndex(number);
                      setModalVisible(true);
                    }}
                  />
                  : <View></View>}
              </View>
            ))}
            <BottomModal
              visible={modalVisible}
              onCancel={() => setModalVisible(false)}
              onConfirm={() => {
                setCancel(false);
                setModalVisible(false);
              }}
              title="예약을 취소하시겠습니까?"
            >
              <View style={style3.contentContainer}>
                <View style={style3.boxContainer}>
                  <EumcText style={style3.boxTitle}>성명</EumcText>
                  <EumcText fontWeight="bold" style={style3.boxContent}>
                    {reservations[index]?.PT_NM}
                  </EumcText>
                </View>
                <View style={style3.boxContainer}>
                  <EumcText style={style3.boxTitle}>병원</EumcText>
                  <EumcText fontWeight="bold" style={style3.boxContent}>
                    {getHospitalName(code)}
                  </EumcText>
                </View>
                <View style={style3.boxContainer}>
                  <EumcText style={style3.boxTitle}>진료과</EumcText>
                  <EumcText fontWeight="bold" style={style3.boxContent}>
                    {reservations[index]?.DEPT_NM}
                  </EumcText>
                </View>
                <View style={style3.boxContainer}>
                  <EumcText style={style3.boxTitle}>진료의</EumcText>
                  <EumcText fontWeight="bold" style={style3.boxContent}>
                    {reservations[index]?.MEDR_NM}
                  </EumcText>
                </View>
                <View style={style3.boxContainer}>
                  <EumcText style={style3.boxTitle}>진료일</EumcText>
                  <EumcText fontWeight="bold" style={style3.boxContent}>
                    {formatDate3(reservations[index]?.MED_DT)}
                  </EumcText>
                </View>
                <View style={style3.boxContainer}>
                  <EumcText style={style3.boxTitle}>진료시간</EumcText>
                  <EumcText fontWeight="bold" style={style3.boxContent}>
                    {formatTime(reservations[index]?.MED_TM)}
                  </EumcText>
                </View>
              </View>
            </BottomModal>
          </>
        ) : (
          <View style={style3.container}>
            <AlertOutline />
            <EumcText style={style3.centerText} fontWeight="bold">
              진료예약 내역이 없습니다.
            </EumcText>
          </View>
        )}
      </View>
    )
  );
};
// 예약취소 비밀번호 확인
const ReserveCancelPw = ({ setCancel, index, setIndex, reservations, navigation }) => {
  const {
    code,
    medicalCards,
    currentMedicalCardIndex,
    easyPin,
    setLoadingVisible,
    setToast,
    loadingVisible,
    refreshToggle,
    setRefreshToggle,
    setAppLocked,
  } = useContext(UserContext);
  const [passwordValue, setPasswordValue] = useState(null);
  const [failCount, setFailCount] = useState(0);

  return (
    <View style={style2.container} refreshControl={<RefreshControl refreshing={loadingVisible} />}>
      <View>
        <EumcText fontWeight="regular" style={[style3.infoText, style3.smallXX]}>
          모바일 진료카드 등록시 설정하셨던 비밀번호를 입력해주세요.
        </EumcText>
        <View style={style3.marginHorizontal16}>
          <EumcText style={[style3.contentTitle, style3.smallBold]}>간편비밀번호</EumcText>
          <SimpleInput placeHolder="비밀번호를 입력해주세요." type="numeric" setValue={setPasswordValue} mask={true} />
        </View>

        <Pressable
          style={[style3.bottomText, style3.smallBold, style3.marginHorizontal16]}
          onPress={() => navigation.navigate('PersonalInformation')}
        >
          <EumcText style={style3.font}>비밀번호 재설정</EumcText>
        </Pressable>
      </View>
      <View>
        <View style={style3.footerWrap}>
          <View style={style3.footerAfter}>
            <View>
              <View style={[style3.callBtn, style3.flexLayout]}>
                <CallBtn text="앱 사용 전화문의" />
              </View>
              <Pressable onPress={() => Linking.openURL(`tel:${APP_INQURY_PHONE}`)}>
                <EumcText fontWeight="bold" style={style3.appCallText}>
                  {APP_INQURY_PHONE}
                </EumcText>
              </Pressable>
            </View>
            <Pressable
              style={style3.channerArea}
              onPress={() =>
                navigation.navigate('WebViewPage', {
                  title: '채널톡 문의',
                  link: 'https://4cgate.channel.io/support-bots/24393',
                })
              }
            >
              <View style={style3.channerTextArea}>
                <EumcText style={style3.channerText} fontWeight="bold">
                  채널톡 문의
                </EumcText>
                <View style={style3.channerContent}>
                  <View style={style3.channerIconArea}>
                    <ImageBackground
                      source={require('../../assets/ico_channertalk_purple.png')}
                      style={style3.channerIcon}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
        <BottomTwoBtn
          leftTitle="취소"
          rightTitle="확인"
          onNext={() => {
            if(loadingVisible) {
              return false;
            }

            setLoadingVisible(true);
            if (passwordValue.length > 0 && bcrypt.compareSync(passwordValue, easyPin)) {
              const { RPY_PACT_ID, MED_DEPT_CD } = reservations[index];
              const { patientNumber } = medicalCards[currentMedicalCardIndex];
              reservations.splice(index, 1);

              deleteReservation(code, patientNumber, RPY_PACT_ID, patientNumber, MED_DEPT_CD)
                .then(() => {
                  setToast({
                    type: 'error',
                    text1: '예약 취소',
                    text2: '진료예약이 정상적으로\n취소되었습니다.',
                  });
                  setIndex(0);
                  setCancel(true);
                })
                .catch(e => {
                  console.log(e.response);
                  setToast({
                    type: 'error',
                    text1: '서버 에러',
                    text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.',
                  });
                })
                .finally(() => {
                  setLoadingVisible(false);
                  setRefreshToggle(!refreshToggle);
                });
            } else {
              setFailCount(failCount + 1);
              if (failCount >= 2) {
                setAppLocked(true);
                navigation.replace('PersonalInformation');
              } else
                setToast({
                  type: 'error',
                  text1: '비밀번호 확인',
                  text2: '비밀번호를 잘못 입력했습니다.\n입력하신 내용을 다시 확인해주세요.',
                  text3: '3회 이상 실패할 경우 로그인이\n차단되오니 비밀번호를\n재설정해주세요.',
                });
              setLoadingVisible(false);
            }
          }}
          onCancel={() => setCancel(true)}
        />
      </View>
    </View>
  );
};

export default ReserveCheck;
