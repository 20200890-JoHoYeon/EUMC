import { useContext, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { UserContext } from '../../context/UserContext';
import WebView from 'react-native-webview';
import { CONFIRM_CARD_REGISTRATION } from '../../popup-templates';
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

let webRef = useRef(null);

const handleSetRef = _ref => {
  webRef = _ref;
};

const OrderReg = ({ navigation, route }) => {
  const { code, medicalCards, currentMedicalCardIndex, kcpTrade, setToast } = useContext(UserContext);

  if (!(currentMedicalCardIndex >= 0)) return <View></View>;
  const { name, phoneNumber, patientNumber } = medicalCards[currentMedicalCardIndex];

  const orderId = getOrderId() + patientNumber;
  const siteCode = route.params?.siteCode ?? (code === '01' ? 'A8DZI' : 'A8DZR');
  // 그룹아이디 BA0011000348 살제 A8B2Z1002682 PG A8DZR1002800 : PG 사용

  const good_name = 'TEST_PRODUCT';
  const good_mny = '100';
  const buyr_name = name;
  const buyr_tel2 = phoneNumber;
  const buyr_mail = '';
  // const kcp_group_id = 'A52Q71000489'; //'A8DZR1002800';
  const kcp_group_id = 'A8DZR1002800';
  const hsp_tp_cd = code;
  const pat_no = patientNumber;
  const ret_url = 'https://test-pay.eumc.ac.kr/api/v1/eumc-pay/callback_kcp_batch';

  console.log(
    `ORDER PARAM : ${orderId}, ${buyr_name}, ${buyr_tel2}, ${hsp_tp_cd}, ${pat_no}, ${JSON.stringify(kcpTrade)}`
  );

  return (
    <View style={styles.container}>
      <WebView
        ref={handleSetRef}
        javaScriptEnabled={true}
        source={{
          html: `<body onload='document.FormName.submit()' style='display: none;'>
                    <form name='FormName' method='POST' action='${kcpTrade.PayUrl}'>
                    <input name='good_name' value='${good_name}'>
                    <input name='good_mny' value='${good_mny}'>
                    <input name='buyr_name' value='${buyr_name}'>
                    <input name='buyr_tel2' value='${buyr_tel2}'>
                    <input name='buyr_mail' value='${buyr_mail}'>
                    <input name='kcp_group_id' value='${kcp_group_id}'>
                    
                    <input name='param_opt_1' value='${hsp_tp_cd}'>
                    <input name='param_opt_2' value='${pat_no}'>
                    <input name='param_opt_3' value=''>
                    
                    <input name='batch_cardno_return_yn' value='Y'>
                    
                    <input name='req_tx' value='pay'>
                    <input name='shop_name' value='EUMC_APP'>
                    <input name='site_cd' value='${siteCode}'>
                    <input name='currency' value='410'>
                    <input name='escw_used' value='N'>
                    <input name='pay_method' value='AUTH'>
                    <input name='ActionResult' value='batch'>
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
          console.log(`onMessage2 ok=${ok}, msg=${msg}`);
          if (ok == 'false') {
            setToast(
              Object.assign(CONFIRM_CARD_REGISTRATION(msg), { redirect: () => navigation.navigate('PaymentCardMain') })
            );
          } else navigation.navigate('PaymentCardMain');
        }}
        onNavigationStateChange={getUrl => {
          console.log('getUrl', getUrl);
        }}
      />
    </View>
  );
};
export default OrderReg;
