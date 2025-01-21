import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { useState, useContext, useEffect, useRef } from 'react';
import Swiper from 'react-native-swiper';
import { EumcText } from '../../components';
import { UserContext } from '../../context';
import { Color, Typography } from '../../styles';
import { BottomTwoBtn, BottomOneBtn } from '../../components/Buttons';
import { BottomModal, OneBtnModal } from '../../components/Modals';
import EumcSeoul from '../../assets/hi_eumc_seoul_select';
import EumcMokdong from '../../assets/hi_eumc_mokdong_select';
import { getPaymentList, reqAuthHash } from '../../api/v1/eumc-pay';
import { useIsFocused } from '@react-navigation/native';
import { CONFIRM_ADD_PAYMENT_CARD } from '../../popup-templates';

const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentWrap: {
    flex: 1,
  },
  cardLayout: {
    justifyContent: 'space-around',
    position: 'relative',
    width: windowWidth - 32,
    minHeight: 178,
    backgroundColor: '#fff',
    marginTop: 30,
    paddingHorizontal: 20,
    //paddingTop: 28,
    shadowColor: Color.inputColor.black,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 9.84,
    elevation: 5,
    borderRadius: 10,
  },
  cardEmptyLayout: {
    marginHorizontal: 16,
  },
  cardWrap: {
    paddingTop: 67,
    paddingBottom: 60,
    alignItems: 'center',
  },
  cardText: {
    color: Color.homeColor.primaryGray,
    margin: 5,
  },
  logoImg: {
    width: 180,
    height: 26,
  },
  cardLogoImg: {
    // marginTop: 10,
    width: 85,
    height: 30,
  },
  swiperWrap: {
    minHeight: (178 / 328) * (windowWidth - 32) + 145,
  },
  cardImg: {
    // width: windowWidth - 32,
    // height: (178 / 328) * (windowWidth - 32),
    // borderRadius: 10,
    width: 78,
    height: 12,
  },
  pagination: {
    bottom: 0,
  },
  dot: {
    marginHorizontal: 3.5,
    width: 12,
    height: 12,
    borderRadius: 50,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Color.homeColor.primaryTurquoise,
  },
  activeDot: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  infoText: {
    paddingTop: 20,
    color: Color.homeColor.primaryDarkPurple,
    paddingHorizontal: 22,
    //letterSpacing: -0.56,
    lineHeight: 28,
  },
  pd: {
    paddingHorizontal: 16,
  },
  circle: {
    backgroundColor: '#fff',
    width: 31,
    height: 31,
    borderRadius: 4,
  },
  cardName: {
    fontSize: 20,
    lineHeight: 29,
    color: '#fff',
  },
  ...Typography,
});

/* modal */
const style2 = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 24,
  },
  boxContainer: {
    flexDirection: 'row',
    borderColor: '#e3e4e5',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  boxContainerEnd: {
    flexDirection: 'row',
    paddingTop: 10,
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
});

const PaymentCardMain = ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState(null);
  const isFocused = useIsFocused();
  const swiperRef = useRef(null);

  const { code, cardLists, setCardLists, medicalCards, currentMedicalCardIndex, setLoadingVisible, setToast } =
    useContext(UserContext);

  const siteCode = 'A8EI7';

  const reqAuth = () => {
    reqAuthHash(siteCode)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          console.log(JSON.stringify(data));

          navigation.navigate('KcpAuth', {
            data: data.data,
            ordr_idxx: data.ordr_idxx,
            web_siteid: data.web_siteid,
            web_siteid_hashYN: data.web_siteid_hashYN,
            up_hash: data.up_hash,
          });
        }
      });
  }


  const getCardList = () => {
    if (currentMedicalCardIndex >= 0) {
      setLoadingVisible(true);
      const { patientNumber } = medicalCards[currentMedicalCardIndex];

      console.log(`CARD LIST REQ : code: ${code}, pat_no: ${patientNumber}`);


      // reqAuth();

      getPaymentList(code, patientNumber)
        .then(res => {
          const { ok, data } = res.data;
          console.log(`CARD LIST : ${JSON.stringify(data)}`);
          if (ok) {
            const arr = [];
            for (const card of data) {
              arr.push({
                seq: card.seq,
                nickname: card.cardname,
                cardNum: card.userKey,
              });
            }

            setCardLists(arr);

            if (arr.length > 0) {
              setCurrentIndex(0);
            }
          }
        })
        .catch(e => {
          setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
          console.log(e);
        })
        .finally(() => setLoadingVisible(false));
    }
  };

  useEffect(() => {
    getCardList();



    setState(route.params?.ok);
  }, [isFocused]);

  useEffect(() => {
    state === 'true' && setToast(CONFIRM_ADD_PAYMENT_CARD);


  }, [state]);

  const cardImgList = [
    '#00583f',
    '#f7941e',
    '#7670b3',
    // require('../../assets/payment_card/card_img.png'),
    // require('../../assets/payment_card/card_img.png'),
    // require('../../assets/payment_card/card_img.png'),
    // require('../../assets/payment_card/card_img2.png'),
    // require('../../assets/payment_card/card_img3.png'),
  ]; // 배너 리스트

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.swiperWrap}>
          {cardLists.length > 0 ? (
            <>
              {cardLists.length > 0 && (
                <Swiper
                  {...(Platform.OS === 'ios' && { bounces: true })}
                  loop={false}
                  showsPagination={true}
                  paginationStyle={styles.pagination}
                  dot={<View style={styles.dot} />}
                  activeDot={<View style={[styles.dot, styles.activeDot]} />}
                  onIndexChanged={index => {
                    setCurrentIndex(index);
                    if (index === cardLists.length - 1) {
                      console.log(`현재 카드 IDX : ${index}`);
                      //swiperRef.current?.scrollBy(cardLists.length - 1, false);
                    }
                  }}
                  style={styles.pd}
                  ref={swiperRef}
                >
                  {cardLists.map(card => {
                    return (
                      <View
                        style={[styles.cardLayout, { backgroundColor: cardImgList[Number(card.seq) % 3] }]}
                        key={card.seq}
                      >
                        <View style={{ position: 'absolute', left: 20, top: 28 }}>
                          <Image style={styles.cardLogoImg} source={require('../../assets/ico_hi_eumc.png')} />
                        </View>
                        <View></View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View style={styles.circle}></View>
                          <EumcText style={styles.cardName} fontWeight="bold">
                            {cardLists[currentIndex]?.nickname.split('|')[0]}
                          </EumcText>
                        </View>
                        <View></View>
                        <View
                          style={{
                            // alignItems: 'flex-end',
                            position: 'absolute',
                            right: 20,
                            bottom: 13,
                          }}
                        >
                          <Image style={styles.cardImg} source={require('../../assets/ico_hi_center.png')} />
                        </View>
                        {/* <Image style={styles.cardImg} source={cardImgList[Number(card.seq) % 3]} /> */}
                      </View>
                    );
                  })}
                </Swiper>
              )}
              <EumcText style={[styles.small, styles.infoText]}>
                결제 하실 카드를 선택하시고 결제 버튼을 누르시면{'\n'}
                결제가 진행 됩니다.
              </EumcText>
              <BottomModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onConfirm={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    navigation.push('CardDelConfirm', {
                      currentIndex: currentIndex,
                      selectedSeq: cardLists[currentIndex]?.seq,
                      mode: '결제카드',
                    });
                  }, 1000);

                }}
                title={`등록하신 결제카드를\n삭제하시겠습니까?`}
              >
                <View style={style2.contentContainer}>
                  <View style={style2.boxContainer}>
                    <EumcText style={style2.boxTitle}>카드닉네임</EumcText>
                    <EumcText style={style2.boxContent} fontWeight="bold">
                      {cardLists[currentIndex]?.nickname}
                    </EumcText>
                  </View>
                  <View style={style2.boxContainer}>
                    <EumcText style={style2.boxTitle}>카드번호</EumcText>
                    <EumcText style={style2.boxContent} fontWeight="bold">
                      {cardLists[currentIndex]?.cardNum}
                    </EumcText>
                  </View>
                </View>
              </BottomModal>
            </>
          ) : (
            <>
              <View style={[styles.cardLayout, styles.cardEmptyLayout]}>
                <View style={styles.cardWrap}>
                  <View style={styles.logoImg}>{code === '01' ? <EumcSeoul /> : <EumcMokdong />}</View>
                  <EumcText style={[styles.cardText, styles.small]}>등록하신 카드가 없습니다.</EumcText>
                </View>
              </View>
              <EumcText style={[styles.small, styles.infoText]}>
                현재 하나카드(외환카드)는 결제가 불가능하오니,{'\n'}
                다른결제수단을 이용하시기 바랍니다.
                {'\n'}
                불편을 드려 죄송합니다.
              </EumcText>
            </>
          )}
        </View>
      </View>

      {cardLists.length > 0 ? (
        <BottomTwoBtn
          leftTitle="카드 삭제"
          onCancel={() => setModalVisible(true)}
          rightTitle="카드 추가"
          onNext={() => navigation.navigate('PaymentCardRegTerms')}
        />
      ) : (
        <BottomOneBtn rightTitle="카드등록" onNext={() => navigation.navigate('PaymentCardRegTerms')} />
      )}
    </View>
  );
};
export default PaymentCardMain;
