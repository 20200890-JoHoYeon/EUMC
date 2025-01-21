import { useState, useContext } from 'react';
import { ScrollView } from 'react-native';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { BottomOneBtn } from '../../components/Buttons';
import { EumcText } from '../../components';
import { UserContext } from '../../context/UserContext';
import { SimpleInput } from '../../components/Inputs';
import { regTrade, regTradeNormal } from '../../api/v1/eumc-pay';
import WebView from 'react-native-webview';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },

  userFormAsked: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  notification: {
    fontSize: 16,
    color: '#7670b3',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  pd16: {
    paddingHorizontal: 16,
  },
  backgroundColorGray: {
    backgroundColor: '#f2f2f2',
    color: '#ccc',
    borderRadius: 4,
  },
});


const getOrderId = () => {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var date = today.getDate();
  var time = today.getTime();

  if (parseInt(month) < 10) {
    month = '0' + month;
  }

  var vOrderID = year + '' + month + '' + date + '' + time;
  return vOrderID;
};

const Initial = ({ navigation, route }) => {
  const { medicalCards, currentMedicalCardIndex, setKcpTrade, code } = useContext(UserContext);
  if (!(currentMedicalCardIndex >= 0)) return <View></View>;

  const type = route.params?.type;


  /* ============================================================================== */
  /* = g_conf_site_cd, g_conf_site_key 설정                                       = */
  /* = 실결제시 KCP에서 발급한 사이트코드(site_cd), 사이트키(site_key)를 반드시   = */
  /* = 변경해 주셔야 결제가 정상적으로 진행됩니다.                                = */
  /* =----------------------------------------------------------------------------= */
  /* = 테스트 시 : 사이트코드(T0000)와 사이트키(3grptw1.zW0GSo4PQdaGvsF__)로      = */
  /* =            설정해 주십시오.                                                = */
  /* = 실결제 시 : 사이트코드(A8DZT)와 사이트키(2zFYprYnOQvafYDf03YNdm1__)로  = */
  /* =            설정해 주십시오. 이대목동                                            = */
  /* = 실결제 시 : 사이트코드(A8DZL)와 사이트키(47DPYaW97iazHr-lkxyshnY__)로  = */
  /* =            설정해 주십시오. 이대서울                                          = */
  /* ============================================================================== */
  // public String g_conf_site_cd   = "A8DZT";
  // public String g_conf_site_key  = "2zFYprYnOQvafYDf03YNdm1__";
  //
  // public String g_conf_site_cd_seoul   = "A8DZL";
  // public String g_conf_site_key_seoul  = "47DPYaW97iazHr-lkxyshnY__";
  // 그룹아이디 BA0011000348 살제 A8B2Z1002682 PG A8DZR1002800 : PG 사용
  const orderId = getOrderId();
  const siteCode = (code === "01" ? "A8DZL" : "A8DZT")

  return (
    <View style={styles.container}>
      <BottomOneBtn
        rightTitle="확인"
        onNext={() => {

          if(type == 'SMART') {
            //TODO: 카드 추가 동작
            regTrade(orderId, siteCode)
              .then(res => {
                const { PayUrl, approvalKey, traceNo } = res.data;
                console.log(res.data);
                setKcpTrade(res.data);

                navigation.navigate('OrderReg')
              })
              .catch(e => console.log(e));
          }else{
            //TODO: 카드 추가 동작
            regTradeNormal(orderId, siteCode)
              .then(res => {
                const { PayUrl, approvalKey, traceNo } = res.data;
                console.log(res.data);
                setKcpTrade(res.data);

                navigation.navigate('OrderNormalReg')
              })
              .catch(e => console.log(e));
          }

        }}
      />
    </View>
  );
};
export default Initial;
