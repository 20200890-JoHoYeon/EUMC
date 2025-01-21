import { useState, useContext, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import { Dimensions, View, StyleSheet, Image } from 'react-native';
import { Color, Typography } from '../../styles';
import { BottomTwoBtn } from '../../components/Buttons';
import { EumcText } from '../../components';
import { UserContext } from '../../context';
import EumcSeoul from '../../assets/hi_eumc_seoul_select';
import EumcMokdong from '../../assets/hi_eumc_mokdong_select';
import { TwoBtnModal, OneBtnModal } from '../../components/Modals';
import { getPaymentList, paymentSmart, reqAuthHash } from '../../api/v1/eumc-pay';
import { getRequestMakeCertPDF } from '../../api/v1/cert';
import { ERROR_MISSING_PAYMENT_CARD } from '../../popup-templates';

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
    backgroundColor: '#00583f',
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
    minHeight: (178 / 328) * (windowWidth - 32) + 255,
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
    paddingTop: 35,
    color: Color.homeColor.primaryDarkPurple,
    paddingHorizontal: 22,
    //letterSpacing: -0.56,
    lineHeight: 22,
  },
  modalBgColor: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9,
  },
  confirmBtnColor: {
    backgroundColor: Color.modalColor.red,
  },
  pd: {
    paddingHorizontal: 16,
  },
  modalContentText: {
    fontSize: 18,
    color: '#333',
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

const SmartPayment = ({ navigation, route }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

  // target: selected, money: money, type: 'PROOF', target_data
  const { target, money, type, target_data } = route.params;

  console.log(`route.params : ${JSON.stringify(route.params)}`);

  const {
    code,
    cardLists,
    setCardLists,
    medicalCards,
    currentMedicalCardIndex,
    loadingVisible,
    setLoadingVisible,
    setToast,
    reservations,
    setReservations,
  } = useContext(UserContext);


  const getCardList = () => {
    if (currentMedicalCardIndex >= 0) {
      setLoadingVisible(true);
      const { patientNumber } = medicalCards[currentMedicalCardIndex];

      console.log(`CARD LIST REQ : code: ${code}, pat_no: ${patientNumber}`);



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
                batchKey: card.batchkey,
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
  }, []);

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

  /**
   *     body.his_hsp_tp_cd,
   *     body.patno,
   *     body.rcptype,
   *     body.certname,
   *     body.deptname,
   *     body.fromdate,
   *     body.todate,
   *     body.date,
   *     body.data,
   *     body.email,
   * @param body
   */
  const genCertPdf = function(body) {
    getRequestMakeCertPDF(
      body.his_hsp_tp_cd,
      body.patno,
      body.rcptype,
      body.certname,
      body.deptname,
      body.fromdate,
      body.todate,
      body.date,
      body.data,
      body.email,
    )
      .then(res => {
        console.log(res);
        navigation.navigate('ConfirmScreen', {
          headerShown: true,
          btnUse: true,
          bottomBtn: '',
          headerTitle: '증명서 신청',
          content: '증명서 발급이 완료되었습니다.',
          target: 'MyPageTab',
        });
      })
      .catch(e => {
        console.log(e);
        navigation.navigate('ConfirmScreen', {
          headerShown: true,
          btnUse: true,
          headerTitle: '증명서 신청',
          content: '증명서 발급에 실패했습니다.',
          target: 'MyPageTab',
        });
      })
      .finally(() => {
        setLoadingVisible(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.swiperWrap}>
          {cardLists.length > 0 ? (
            <>
              <Swiper
                loop={false}
                showsPagination={true}
                paginationStyle={styles.pagination}
                dot={<View style={styles.dot} />}
                activeDot={<View style={[styles.dot, styles.activeDot]} />}
                onIndexChanged={index => setCurrentIndex(index)}
                style={styles.pd}
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
                        <EumcText style={styles.cardName} fontWeight='bold'>
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
              <EumcText style={[styles.small, styles.infoText]}>
                결제 하실 카드를 선택하시고 결제 버튼을 누르시면{'\n'}
                결제가 진행 됩니다.{'\n'} {'\n'}* 현재 하나카드(외환카드)는 결제가 불가능하오니,{'\n'}
                다른결제수단을 이용하시기 바랍니다.{'\n'}
                불편을 드려 죄송합니다.{'\n'}
              </EumcText>
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
                결제 하실 카드를 선택하시고 결제 버튼을 누르시면{'\n'}
                결제가 진행 됩니다.{'\n'} {'\n'}* 현재 하나카드(외환카드)는 결제가 불가능하오니,{'\n'}
                다른결제수단을 이용하시기 바랍니다.{'\n'}
                불편을 드려 죄송합니다.{'\n'}
              </EumcText>
            </>
          )}
        </View>
      </View>
      <TwoBtnModal
        visible={showConfirm}
        confirmText='결제'
        onCancel={() => {
          setShowConfirm(false);
          //navigation.goBack();
        }}
        onConfirm={() => {
          setShowConfirm(false);

          let sel_card = cardLists[currentIndex];
          const { patientNumber } = medicalCards[currentMedicalCardIndex];

          let payment_info = target_data;

          setLoadingVisible(true);

          //type : 6 - 재증명 ,
          let type_code = 6;
          if (type === 'PROOF') {
            type_code = 6;
          } else if (type === 'PAY') {
            type_code = target.rcptype; //TODO :: 확인필요
          }

          paymentSmart(code, patientNumber, sel_card.batchKey, type_code, money, JSON.stringify(payment_info))
            .then(pay_res => {
              const { ok, data } = pay_res.data;
              if (ok) {
                if (type === 'PROOF') {
                  genCertPdf(target_data);
                } else if (type === 'PAY') {
                  //TODO :: 수납프로세스 추가 여부 확인
                  navigation.navigate('SecurePinScreen', {
                    mode: 'identify',
                    userData: JSON.stringify({ currentIndex }),
                    successParams: JSON.stringify({
                      headerShown: true,
                      btnUse: true,
                      headerTitle: '모바일 수납',
                      content: '모바일 수납이 완료 되었습니다.',
                      // target: 'MobilePayment',
                      target: 'MyPageTab',
                      bottomBtn: 'bottomTwoBtn',
                      bottomText: true,
                    }),
                  });
                }
              } else {
                navigation.navigate('ConfirmScreen', {
                  headerShown: true,
                  btnUse: true,
                  headerTitle: '간편 결제',
                  content: '결제에 실패했습니다.다시 시도해주세요.',
                  target: 'MyPageTab',
                });
              }
            })
            .catch(err => {
              console.error(err);
              //this.logger.error(`:::::: ${err}`);
              navigation.navigate('ConfirmScreen', {
                headerShown: true,
                btnUse: true,
                headerTitle: '간편 결제',
                content: '결제에 실패했습니다.다시 시도해주세요.',
                target: 'MyPageTab',
              });
            })
            .finally(() => {
              setLoadingVisible(false);
            });
        }}
        title='결제 확인'
      >
        <EumcText style={[styles.modalContentText, styles.medium, { paddingBottom: 4 }]} fontWeight='regular'>
          해당 카드로 결제를
        </EumcText>
        <EumcText style={[styles.modalContentText, styles.medium]} fontWeight='regular'>
          진행하시겠습니까?
        </EumcText>
      </TwoBtnModal>

      <BottomTwoBtn
        leftTitle='취소'
        rightTitle='결제'
        rightTitleColor='primaryDarkgreen'
        onCancel={() => {
          setShowConfirm(false);
          navigation.goBack();
        }}
        onNext={() => (cardLists.length > 0 ? setShowConfirm(true) : setToast(ERROR_MISSING_PAYMENT_CARD))}
      />
    </View>
  );
};
export default SmartPayment;
