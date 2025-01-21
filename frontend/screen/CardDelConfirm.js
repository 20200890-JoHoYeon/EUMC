import { useState, useContext, useLayoutEffect } from 'react';
import { View, StyleSheet, ImageBackground, Pressable, ScrollView, Linking } from 'react-native';
import bcrypt from 'react-native-bcrypt';
import { Typography, Color } from '../styles';
import { UserContext } from '../context';
import { CallBtn, EumcText } from '../components';
import { BottomTwoBtn } from '../components/Buttons';
import { SimpleInput } from '../components/Inputs';
import { APP_INQURY_PHONE } from '../constants';
import { deletePaymentCard } from '../api/v1/eumc-pay';
import { selectMenus as initialSelectMenu, unselectMenus as initialUnselectMenu } from '../constants';

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
    marginVertical: 4,
    color: Color.myPageColor.darkGray,
  },
  infoText: {
    marginTop: 16,
    color: Color.homeColor.primaryDarkPurple,
    marginBottom: 16,
    lineHeight: 28,
  },
  ...Typography,

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
    position: 'relative',
    paddingTop: 19,
    paddingRight: 16,
    paddingBottom: 22,
    paddingLeft: 16,
  },
  appCallText: {
    marginTop: 4,
    color: Color.inputColor.darkGray,
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
    borderRadius: 17,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  channerArea: {
    position: 'absolute',
    top: 37,
    right: 21,
  },
  bottomText: {
    marginTop: 20,
    color: '#939598',
  },
});

const CardDelConfirm = ({ navigation, route }) => {
  // console.error(`PARAM : ${JSON.stringify(route.params)}`);
  const mode = route.params?.mode;
  const index = route.params?.currentIndex;
  const seq = route.params?.selectedSeq;

  const [passwordValue, setPasswordValue] = useState(null);
  const {
    medicalCards,
    setMedicalCards,
    currentMedicalCardIndex,
    setCurrentMedicalCardIndex,
    cardLists,
    setCardLists,
    reservations,
    setReservations,
    easyPin,
    setSelectMenus,
    setUnselectMenus,
    setAppLocked,
    setToast,
    setRsvInfo,
  } = useContext(UserContext);
  const [failCount, setFailCount] = useState(0);

  let itemArray = [];
  let setArray = null;
  let target = '';
  let editPage = 'PersonalInformation';

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: mode === '결제카드' ? '결제카드관리' : `${mode} 목록`,
      headerShadowVisible: false,
    });
  }, [navigation]);

  switch (mode) {
    case '진료카드':
      target = 'MedicalCardMain';
      itemArray = medicalCards;
      setArray = setMedicalCards;
      break;
    case '결제카드':
      target = 'PaymentCardMain';
      itemArray = cardLists;
      setArray = setCardLists;
      break;
    case '진료예약':
      target = 'ReserveMain';
      itemArray = reservations;
      setArray = setReservations;
      break;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentWrap}>
        <EumcText style={[styles.smallXX, styles.infoText]}>
          모바일 {mode === '결제카드' ? mode : '진료카드'} 등록시 설정하셨던 비밀번호를 입력해주세요.
        </EumcText>
        <EumcText style={[styles.contentTitle, styles.smallBold]}>간편비밀번호</EumcText>
        <SimpleInput placeHolder="비밀번호를 입력해주세요." type="numeric" setValue={setPasswordValue} mask={true} />
        <Pressable onPress={() => navigation.navigate(editPage)}>
          <EumcText style={[styles.bottomText, styles.smallBold]}>비밀번호 재설정</EumcText>
        </Pressable>
      </ScrollView>

      <View style={styles.footerWrap}>
        <View style={styles.footerAfter}>
          <View style={[styles.callBtn, styles.flexLayout]}>
            <CallBtn text="앱 사용 전화문의" />
          </View>
          <Pressable onPress={() => Linking.openURL(`tel:${APP_INQURY_PHONE}`)}>
            <EumcText style={[styles.appCallText, styles.mediumXXBold]}>{APP_INQURY_PHONE}</EumcText>
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
              <EumcText style={styles.channerText} fontWeight="bold">
                채널톡 문의
              </EumcText>
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

      <BottomTwoBtn
        leftTitle="취소"
        onCancel={() => navigation.goBack()}
        rightTitle="확인"
        onNext={() => {
          if (bcrypt.compareSync(passwordValue, easyPin)) {
            const newLists = [...itemArray];
            newLists.splice(index, 1);
            setArray(newLists);

            switch (mode) {
              case '진료카드':
                if (medicalCards.length > 1) {
                  const newIndex = index === currentMedicalCardIndex ? 0 : Math.max(0, currentMedicalCardIndex - 1);
                  const { name, patientNumber, relationship } = medicalCards[newIndex];
                  setCurrentMedicalCardIndex(newIndex);
                  setRsvInfo({ name, patientNumber, relationship });
                } else {
                  console.log('삭제중');
                  //setCurrentMedicalCardIndex(null); //CHECK: toString 오류 나서 주석함
                  setSelectMenus(initialSelectMenu);
                  setUnselectMenus(initialUnselectMenu);
                }
                // 마지막 카드 삭제중에는 현재길이가 1이기 떄문에 1로 수정함
                // if (medicalCards.length > 0)
                //   setCurrentMedicalCardIndex(
                //     index === currentMedicalCardIndex ? 0 : Math.max(0, currentMedicalCardIndex - 1)
                //   );
                // else {
                //   setCurrentMedicalCardIndex(null);
                //   setSelectMenus(initialSelectMenu);
                //   setUnselectMenus(initialUnselectMenu);
                // }
                navigation.replace('ConfirmScreenTab', {
                  headerShown: false,
                  btnUse: true,
                  headerTitle: mode,
                  content: `${mode}가 삭제 완료되었습니다.`,
                  target: target,
                });
                break;
              case '결제카드':
                {
                  if (typeof seq != 'undefined' && seq != null) {
                    deletePaymentCard(seq)
                      .then(res => {
                        navigation.navigate('ConfirmScreen', {
                          headerShown: true,
                          btnUse: true,
                          headerTitle: '결제카드관리',
                          content: `${mode}가 삭제 되었습니다.`,
                          target: target,
                        });
                      })
                      .catch(err => {
                        console.error(err);
                      })
                      .finally(() => {});
                  }
                }
                break;
              case '진료예약':
                navigation.navigate('ConfirmScreen', {
                  headerShown: true,
                  btnUse: true,
                  headerTitle: mode,
                  content: '진료예약이 정상적으로 취소 되었습니다.',
                  target: target,
                });
                break;
            }
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
          }
        }}
      />
    </View>
  );
};
export default CardDelConfirm;
