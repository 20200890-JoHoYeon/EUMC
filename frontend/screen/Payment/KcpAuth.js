import { useContext, useRef, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { UserContext } from '../../context/UserContext';
import WebView from 'react-native-webview';
import { CONFIRM_CARD_REGISTRATION } from '../../popup-templates';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
});


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

const KcpAuth = ({ navigation, route }) => {
  const { code, currentMedicalCardIndex, setToast } = useContext(UserContext);

  if (!(currentMedicalCardIndex >= 0)) return <View></View>;


  const reqUrl = 'https://cert.kcp.co.kr/kcp_cert/cert_view.jsp';
  const reqUrl2 = 'https://test-pay.eumc.ac.kr/api/v1/eumc-pay/view_kcp_auth';


  // const orderId = getOrderId();
  const siteCode = 'A8EI7';

  const { data, ordr_idxx, web_siteid, web_siteid_hashYN, up_hash } = route.params;

  console.log(`route.params : ${JSON.stringify(route.params)}`);

  return (
    <View style={styles.container}>
      <WebView
        ref={handleSetRef}
        javaScriptEnabled={true}
        source={{
          html: `<body onload='document.FormName.submit()' style=''>
                    
                    <form name='FormName' method='POST' action='${reqUrl}'>
                    <!-- 요청종류 -->
                    <input type="hidden" name="req_tx"       value="cert"/>
                    <!-- 요청구분 -->
                    <input type="hidden" name="cert_method"  value="01"/>
                    <input type="hidden" name="web_siteid"   value="${web_siteid}"/> 
                    <input type="hidden" name="site_cd"      value="${siteCode}" />               
                    <input type="hidden" name="Ret_URL"      value="${reqUrl2}" />
                    <input type="hidden" name="ordr_idxx"      value="${ordr_idxx}" />
                    <!-- cert_otp_use 필수 ( 메뉴얼 참고)
                    Y : 실명 확인 + OTP 점유 확인 -->
                    <input type="hidden" name="cert_otp_use" value="Y"/>
              
                    <!-- 리턴 암호화 고도화 -->
                    <input type="hidden" name="cert_enc_use_ext" value="Y"/>
                    <input type="hidden" name="res_cd"       value=""/>
                    <input type="hidden" name="res_msg"      value=""/>
              
                    <!-- web_siteid 검증 을 위한 필드 -->
                    <input type="hidden" name="web_siteid_hashYN" value="${web_siteid_hashYN}"/>
                
              <!-- up_hash 검증 을 위한 필드 -->
                    <input type="hidden" name="veri_up_hash" value="${up_hash}"/>
                    <input type="hidden" name="up_hash" value="${up_hash}"/>
                    
                  
                    <input type="hidden" name="kcp_merchant_time"  value="${data.kcp_merchant_time}"/> 
                    <input type="hidden" name="kcp_cert_lib_ver"  value="${data.kcp_cert_lib_ver}"/>
                    <input type="hidden" name="kcp_cert_pass_use" value="Y"/>
                    
                    <!-- 가맹점 사용 필드 (인증완료시 리턴)-->
                    <input type="hidden" name="param_opt_1"  value="${ordr_idxx}"/> 
                    <input type="hidden" name="param_opt_2"  value="${up_hash}"/> 
                    <input type="hidden" name="param_opt_3"  value="opt3"/>
                    </form>
                    <iframe id="kcp_cert" name="kcp_cert" width="100%" height="700" frameborder="0" style=""></iframe>
                </body>
`,
        }}
        onMessage={e => {
          const { ok, msg, data } = JSON.parse(e.nativeEvent.data);
          console.log('onMessage', JSON.stringify(e.nativeEvent.data));
          console.log(`onMessage2 ok=${ok}, msg=${msg}, data=${JSON.stringify(data)}`);
          if (ok == 'false') {
            setToast(
              Object.assign(CONFIRM_CARD_REGISTRATION(msg), { redirect: () => navigation.navigate('PaymentCardMain') })
            );
          }
          else navigation.navigate('PaymentCardMain');
        }}
        onNavigationStateChange={getUrl => {
          console.log('getUrl', getUrl);
        }}
      />
    </View>
  );
};
export default KcpAuth;
