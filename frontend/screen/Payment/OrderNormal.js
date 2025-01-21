import { useContext, useRef } from 'react';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import { UserContext } from '../../context/UserContext';
import WebView from 'react-native-webview';
import { Color } from '../../styles';
import { getRequestMakeCertPDF } from '../../api/v1/cert';
import { CONFIRM_NORMAL_ORDER, ERROR_KAKAO_FAIL } from '../../popup-templates';
import SendIntentAndroid from 'react-native-send-intent';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
});

/***
 * ordr_idxx: TEST202303221679442296345
 * good_name: 운동화
 * good_mny: 1004
 * buyr_name: 홍길동
 * buyr_tel2: 010-0000-0000
 * buyr_mail: test@test.co.kr
 * kcp_group_id: A52Q71000489
 * req_tx: pay
 * shop_name: TEST SITE
 * site_cd: A52Q7
 * currency: 410
 * escw_used: N
 * pay_method: AUTH
 * ActionResult: batch
 * Ret_URL: http://.../mobile_request/order_mobile
 * tablet_size: 1.0
 * approval_key: k/Che+IOTaHYK33mhgeVNAcHyKIPdQ/iE35VBPEo1cQ=
 * traceNo: A52Q7LFIWKZTPUKQ
 * PayUrl: https://testsmpay.kcp.co.kr/pay/mobileGW.kcp
 */



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

let webRef = null;

const handleSetRef = _ref => {
  webRef = _ref;
};

const OrderNormalReg = ({ navigation, route }) => {
  const { code, medicalCards, currentMedicalCardIndex, kcpTrade, setToast } = useContext(UserContext);

  const selected = route.params?.selected;
  const email = route.params?.target_email;
  const type = route.params?.type;
  const siteCode = route.params?.siteCode ?? (code === '01' ? 'A8DZL' : 'A8DZT');
  const target_data = route.params?.target_data;

  if (!(currentMedicalCardIndex >= 0)) return <View></View>;
  const { name, phoneNumber, patientNumber } = medicalCards[currentMedicalCardIndex];

  const orderId = getOrderId() + patientNumber;
  // 그룹아이디 BA0011000348 살제 A8B2Z1002682 PG A8DZR1002800 : PG 사용

  // const good_name = selected?.certname.trim().replace(/\s/g, '');
  // const good_mny = '100';
  const buyr_name = name;
  const buyr_tel2 = phoneNumber;
  const buyr_mail = '';
  // const kcp_group_id = 'A52Q71000489'; //'A8DZR1002800';
  const kcp_group_id = 'A8DZR1002800';
  const hsp_tp_cd = code;
  const pat_no = patientNumber;
  const ret_url = 'https://test-pay.eumc.ac.kr/api/v1/eumc-pay/callback_kcp_normal'; //TODO:실서버변경포인트


    // kcpTrade.PayUrl = kcpTrade.PayUrl.substring(0,kcpTrade.PayUrl.lastIndexOf("/"))  + "/jsp/encodingFilter/encodingFilter.jsp";


  console.log(
    `ORDER PARAM : ${orderId}, ${buyr_name}, ${buyr_tel2}, ${hsp_tp_cd}, ${pat_no}, ${JSON.stringify(kcpTrade)}`
  );

  /**
   * ordr_idxx: TEST1234213412
   * good_name: 운동화
   * good_mny: 1004
   * buyr_name: 홍길동
   * buyr_tel1: 02-0000-0000
   * buyr_tel2: 010-0000-0000
   * buyr_mail: test@test.co.kr
   * req_tx: pay
   * shop_name: TEST SITE
   * site_cd: T0000
   * currency: 410
   * escw_used: N
   * pay_method: CARD
   * ActionResult: card
   * van_code:
   * quotaopt: 12
   * ipgm_date:
   * Ret_URL: http://.../mobile_sample/order_mobile
   * tablet_size: 1.0
   * param_opt_1:
   * param_opt_2:
   * param_opt_3:
   * approval_key: +tZk+GiMhWBWtKn9WIohIAcHyKIPdQ/iE35VBPEo1cQ=
   * traceNo: T0000LGEAH9JHYT4
   * PayUrl: https://testsmpay.kcp.co.kr/pay/mobileGW.kcp
   */

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

  const onShouldStartLoadWithRequest = (event) => {
    console.log('onShouldstart22');
    if (
      event.url.startsWith('http://') ||
      event.url.startsWith('https://') ||
      event.url.startsWith('about:blank')
    ) {
      return true;
    }
    if (Platform.OS === 'android') {
      const SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.openChromeIntent(event.url)
        .then(isOpened => {
          if (!isOpened) { alert('앱 실행이 실패했습니다'); }
        })
        .catch(err => {
          console.log(err);
        });

      return false;

    } else {
      Linking.openURL(event.url)
        .catch(err => {
          alert('앱 실행이 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
        });
      return false;
    }
  };

  const genCertPdf = function (body) {
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
      body.email
    )
      .then(res => {
        console.log(res);
        navigation.navigate('ConfirmScreen', {
          headerShown: true,
          btnUse: true,
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
      });
  };

  var makeCertInfo = {};
  if (type === 'PROOF') {
    makeCertInfo = {
      his_hsp_tp_cd: code,
      patno: patientNumber,
      rcptype: '1',
      certname: selected.certname.trim().replace(/\s/g, ''),
      deptname: selected.deptname,
      fromdate: selected.fromdate,
      todate: selected.todate,
      date: '',
      data: selected.certname.trim() === '일반진단서[재발급]' ? selected.dummyData : '',
      email: email,
    };
  }

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
  const mobilePayment = function (body) {
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
      body.email
    )
      .then(res => {
        console.log(res);
        navigation.navigate('ConfirmScreen', {
          headerShown: true,
          btnUse: true,
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
      });
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={handleSetRef}
        source={{
          html: `<body onload='document.FormName.submit()' style='display: none;'>
                    <form name='FormName' method='POST' action='${kcpTrade.PayUrl}'>
                    <input name='good_name' value='EUMC PAY'>
                    <input name='good_mny' value='${kcpTrade.money}'>
                    <input name='buyr_name' value='${buyr_name}'>
                    <input name='buyr_tel2' value='${buyr_tel2}'>
                    <input name='buyr_mail' value='${buyr_mail}'>
                    <input name='kcp_group_id' value='${kcp_group_id}'>
                    <input name='rcp_type' value='${type === 'PAY' ? '1' : '6'}'>
                    <input type="hidden" name="encoding_trans" value="UTF-8" /> -->

                    <input name='param_opt_1' value='${hsp_tp_cd}'>
                    <input name='param_opt_2' value='${pat_no}'>
                    <input name='param_opt_3' value='${JSON.stringify(target_data)}'>
                    
<!--                    <input name='batch_cardno_return_yn' value='Y'>-->
                    
                    <input name='req_tx' value='pay'>
                    <input name='shop_name' value='EUMC_APP'>
                    <input name='site_cd' value='${siteCode}'>
                    <input name='currency' value='410'>
                    <input name='escw_used' value='N'>
                    <input name='pay_method' value='CARD'>
<!--                    <input name='van_code' value=''>-->
                    <input name='ActionResult' value='card'>
                    <input name='tablet_size' value='1.0'>
                    <input name='ordr_idxx' value='${orderId}'>
                    <input name='Ret_URL' value='${ret_url}'>

                      <input name='approval_key' value='${kcpTrade.approvalKey}'>
                      <input name='traceNo' value='${kcpTrade.traceNo}'>
                      <input name='PayUrl' value='${kcpTrade.PayUrl}'>
                    </form>
                </body>`,
        }}
        onMessage={e => {
          const { ok, msg } = JSON.parse(e.nativeEvent.data);
          console.log('onMessage', JSON.stringify(e.nativeEvent.data));

          if (ok == 'false') {
            navigation.navigate('ConfirmScreen', {
              headerShown: true,
              btnUse: true,
              headerTitle: '신용카드 결제',
              content: '결제에 실패했습니다.다시 시도해주세요.',
              target: 'MyPageTab',
            });
          } else {
            if (type === 'PROOF') {
              genCertPdf(makeCertInfo);
            } else if (type === 'PAY') {
              navigation.navigate('ConfirmScreen', {
                headerShown: true,
                btnUse: true,
                headerTitle: '모바일 수납',
                content: '모바일 수납이 완료 되었습니다.',
                target: 'MyPageTab',
              });
              //TODO :: 수납프로세스 추가 여부 확인
              // navigation.navigate('SecurePinScreen', {
              //   mode: 'identify',
              //   userData: JSON.stringify({ currentIndex }),
              //   successParams: JSON.stringify({
              //     headerShown: true,
              //     btnUse: true,
              //     headerTitle: '모바일 수납',
              //     content: '모바일 수납이 완료 되었습니다.',
              //     // target: 'MobilePayment',
              //     target: 'MyPageTab',
              //     bottomBtn: 'bottomTwoBtn',
              //     bottomText: true,
              //   }),
              // });
            }
          }
          setToast(
            Object.assign(CONFIRM_NORMAL_ORDER(msg), { redirect: () => navigation.navigate('PaymentCardMain') })
          );
        }}
        // onNavigationStateChange={getUrl => {
        //   console.log('getUrl', getUrl);
        // }}
      />
    </View>
  );
};
export default OrderNormalReg;
