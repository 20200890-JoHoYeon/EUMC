import { useContext, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, View } from 'react-native';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { Color, Typography } from '../../styles';
import { getRequestMakeCertPDF } from '../../api/v1/cert';
import { UserContext } from '../../context';
import { SimpleInput, SelectBox } from '../../components/Inputs';
import { TwoBtnModal } from '../../components/Modals';
import moment from 'moment/moment';
import { regTradeNormal, reqAuthHash } from '../../api/v1/eumc-pay';
import { KCP_INFO } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  containerNext: {
    shadowColor: Color.homeColor.primaryBlack,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -9 },
    elevation: -10,
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  agreement: {
    flex: 4,
    backgroundColor: '#eee',
  },
  warning: {
    marginLeft: 20,
    marginTop: 30,
  },
  text: {
    color: '#000',
    ...Typography.small,
  },
  paymentKpayButton: {
    width: 56,
    height: 23,
  },

  paymentText: {
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    lineHeight: 20,
  },
  paymentButton: {
    flex: 1 / 3,
    marginRight: 7,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#bcbec0',
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentNpayImgArea: {
    width: 58,
    height: 22.8,
  },
  paymentSpayImgArea: {
    width: 29.6,
    height: 29.6,
  },
  paymentImg: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 16,
    lineHeight: 24,
    marginTop: 14,
    marginBottom: 8,
  },
  proofTitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: '#333',
    marginHorizontal: 16,
  },
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    marginBottom: 10,
  },
  selectedPayment: {
    borderWidth: 1,
    borderColor: Color.homeColor.primaryTurquoise,
  },
  margin0: {
    marginRight: 0,
  },
  colorTurquoise: {
    color: Color.homeColor.primaryTurquoise,
  },
  ...Typography,
});

const formatDate = str => `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;

const ProofPayment = ({ navigation, route }) => {
  // selected: "his_hsp_tp_cd":"01","fromdate":"20230312","todate":"20230412","certname":"진료비 납입 확인서(연말정산용)","deptname":"","date":"","price":"0","data":""}
  const { selected, money } = route.params;
  const { code, medicalCards, currentMedicalCardIndex, setToast, setKcpTrade } = useContext(UserContext);
  const { patientNumber, email } = medicalCards[currentMedicalCardIndex];
  const [inpEmail, setInpEmail] = useState(email || '');
  const [confirmSend, setConfirmSend] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const selectEmail = ['naver.com', 'daum.net', 'gmail.com'];
  const [selectEmailActive, setSelectEmailActive] = useState('');

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
      <View style={{ flex: 1 }}>
        <EumcText style={styles.proofTitle} fontWeight='bold'>
          증명서 받으실 이메일 주소
        </EumcText>
        <View style={{ marginHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <View style={{ flex: 2 }}>
              <SimpleInput placeHolder='메일 주소를 입력하세요.' value={inpEmail} type='text' setValue={setInpEmail} />
            </View>

            <View
              style={{
                flex: 1,
                marginLeft: 6,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <SelectBox selectBoxText='직접 선택' data={selectEmail} setSelect={setSelectEmailActive} />
            </View>
            {/* <Pressable
              style={{
                flex: 1,
                height: 40,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 4,
                backgroundColor: '#16aea6',
                //maxWidth: 74,
                //minWidth: 160,
              }}
            >
              <EumcText style={[styles.small, { color: Color.homeColor.primaryWhite }]}>메일 확인</EumcText>
            </Pressable> */}
          </View>
          <View style={{ marginTop: 16 }}>
            <EumcText fontWeight='bold' style={{ lineHeight: 20, color: '#7670b3', fontSize: 14 }}>
              * 메일 등록시 주의 사항
            </EumcText>
            <EumcText fontWeight='regular' style={{ lineHeight: 20, color: '#7670b3', fontSize: 14 }}>
              '직접 선택'에서 선택가능한 메일 서비스 이외에는 발급이 불가합니다.
            </EumcText>
          </View>
        </View>
        <EumcText style={styles.title} fontWeight='bold'>
          결제 방법 선택
        </EumcText>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden', paddingHorizontal: 12 }}>
          {/*<Pressable*/}
          {/*  style={[styles.paymentButton, paymentMethod === 'smart' && styles.selectedPayment]}*/}
          {/*  onPress={() => setPaymentMethod('smart')}*/}
          {/*>*/}
          {/*  <EumcText style={[styles.paymentText]} numberOfLines={1}>*/}
          {/*    스마트결제*/}
          {/*  </EumcText>*/}
          {/*</Pressable>*/}
          <Pressable
            style={[styles.paymentButton, paymentMethod === 'kakao' && styles.selectedPayment]}
            onPress={() => setPaymentMethod('kakao')}
          >
            <View style={styles.paymentKpayButton}>
              <ImageBackground source={require('../../assets/ico_kpay.png')} style={styles.paymentImg} />
            </View>
          </Pressable>
          <Pressable
            style={[styles.paymentButton, paymentMethod === 'cc' && styles.selectedPayment, styles.margin0]}
            onPress={() => setPaymentMethod('cc')}
          >
            <EumcText style={[styles.paymentText]} numberOfLines={1}>
              신용카드결제
            </EumcText>
          </Pressable>
        </View>
      </View>
      <BottomTwoBtn
        leftTitle='취소'
        rightTitle='결제'
        onNext={() =>
          selectEmailActive === ''
            ? setToast({
              type: 'error',
              text1: '형식에 맞지 않는 메일주소',
              text2: '이메일은 gmail.com, naver.com, 또는 daum.net으로 끝나야 합니다.',
            })
            : setConfirmSend(true)
        }
        onCancel={() => navigation.navigate('MyPageTab')}
      />
      <TwoBtnModal
        leftTitle='아니오'
        visible={confirmSend}
        onCancel={() => setConfirmSend(false)}
        onConfirm={() => {
          if (selectEmailActive !== '') {
            setConfirmSend(false);

            console.log(`제증명 신청 : ${JSON.stringify(selected)}`);

            const target_email = inpEmail + '@' + selectEmailActive;

            const makeCertInfo = {
              his_hsp_tp_cd: selected.his_hsp_tp_cd,
              patno: patientNumber,
              rcptype: '6',
              certname: selected.certname.trim().replace(/\s/g, ''),
              deptname: selected.deptname,
              fromdate: selected.fromdate,
              todate: selected.todate,
              date: '',
              data: selected.certname.trim() === '일반진단서[재발급]' ? selected.dummyData : '',
              email: target_email,
            };


            const authSiteCode = (code === '01' ? 'A8DZI' : 'A8DZR');

            // if (paymentMethod == 'smart') {
            //   // 여기서 카드 리스트 -> 선택 후
            //   navigation.navigate('SmartPayment', {
            //     target: selected,
            //     type: 'PROOF',
            //     money: money,
            //     target_data: makeCertInfo,
            //   });
            // } else
              if (paymentMethod == 'kakao') {

              navigation.navigate('OrderKakao', {
                target: selected,
                type: 'PROOF',
                money: money,
                target_data: {
                  type: 'PAY',
                  selected: selected,
                  money: money,
                  rcptype: '6',
                  target_email: target_email,
                },
                target_email: target_email,
              });

            } else if (paymentMethod == 'cc') {
              const orderId = getOrderId() + patientNumber;
              const siteCode = KCP_INFO.PROOF_SITE_CD;

              regTradeNormal(orderId, siteCode, selected?.certname, money)
                .then(res => {
                  // const { PayUrl, approvalKey, traceNo } = res.data;
                  console.log('regTradeNormal resp : ' + JSON.stringify(res.data));
                  res.data.title = selected?.certname;
                  res.data.money = money;
                  res.data.type = 'PROOF';
                  setKcpTrade(res.data);

                  navigation.navigate('OrderNormalReg', {
                    type: 'PROOF', selected, money, rcptype: '6', target_email, siteCode,
                    target_data: { type: 'PROOF', selected, money, target_email, rcptype: '6' },
                  });
                })
                .catch(e => console.log(e));
            }


          }
        }}
        title={inpEmail + '@' + selectEmailActive}
      >
        <EumcText style={[styles.modalContentText, { fontSize: 18, lineHeight: 28 }]} fontWeight='regular'>
          으로 증명서가 발급됩니다.{'\n'}입력하신 이메일 주소가{'\n'}맞습니까?
        </EumcText>
        <EumcText
          style={{ fontSize: 14, lineHeight: 20, color: Color.homeColor.primaryRed, textAlign: 'center' }}
          fontWeight='regular'
        >
          입력하신 이메일 주소로 발급 요청 하신 증명서가 전송되며, 이메일 서비스 업체에 따라 받은메일함에 없는경우,
          스펨메일함까지 꼭 확인해주세요.
        </EumcText>
      </TwoBtnModal>
    </View>
  );
};

export default ProofPayment;
