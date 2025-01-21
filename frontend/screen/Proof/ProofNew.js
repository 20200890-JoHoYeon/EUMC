import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { CheckBoxItem } from '../../components/List';
import { UserContext } from '../../context';
import { Color } from '../../styles';

const windowHeight = Dimensions.get('window').height - 80 - 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  containerNext: {},
  content: {
    flex: 1,
    paddingTop: 30,
  },
  agreement: {
    flex: 4,
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    marginHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  warning: {
    marginLeft: 20,
    marginTop: 17,
  },
  text: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 50,
  },
  warningText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  termText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 32,
  },
  containerAgree: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mb20: {
    marginBottom: 20,
  },
});

const ProofNew = ({ navigation }) => {
  const { setToast } = useContext(UserContext);
  const [selected, setSelected] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <ScrollView
          style={[styles.agreement, { height: (windowHeight / 3) * 1.9 }]}
          contentContainerStyle={{}}
          indicatorStyle="white"
        >
          <EumcText fontWeight="regular" style={styles.text}>
            제1조 (개인정보의 처리 목적)
            {'\n'}"(주)큐어링크"는 다음 각 호에서 열거한 목적을 위하여 최소한의 개인정보를 처리하고 있습니다. 처리한 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 '개인정보 보호법' 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행하고 있습니다.
            {'\n\n'}회원가입 및 관리{'\n'}
            회원가입, 회원제 서비스 이용 및 제한적 본인확인 절차에 따른 본인 확인, 가입 의사 확인, 원활한 고객상담, 회원 자격 유지 및 관리, 분쟁 조정을 위한 기록보존, 각종 고지 및 통지 등
            {'\n\n'}증명서 서비스 제공{'\n'}
            이용자의 신원 및 민원사항 확인, 사실 조사를 위한 연락, 처리결과 통지, 제증명 신청·발급 장애 등이 발생 할 경우 연락, 증명서 전송 서비스 이용시 수신자·송신자 명 기재, 메일 전송·전송 내역을 SMS로 전송 등
            {'\n\n'}(주)큐어링크 서비스 향상 및 정책평가{'\n'}
            신규 서비스 및 맞춤형 서비스 개발, 서비스 분석 및 이용 통계 확인 등
            {'\n\n'}자동수집{'\n'}
            서비스 이용과정에서 원활한 증명서 발급 및 민원처리를 위해 자동으로 정보 생성되어 수집
          </EumcText>
          <EumcText fontWeight="regular" style={styles.text}>
            제2조 (처리하는 개인정보 항목 )
            {'\n'}"(주)큐어링크"이 처리하는 개인정보 항목은 다음 각 호와 같습니다.
            {'\n\n'}회원 정보{'\n'}
            성명(법인명), 비밀번호, 연락처, 이메일, 생년월일
            {'\n\n'}비회원 정보{'\n'}
            성명(법인명), 생년월일 (본인인증을 통하여 자동수집)
            {'\n\n'}증명서 전송(메일) 서비스{'\n'}
            송신자 연락처, 수신자명 또는 수신기관명, 수신자 연락처, 수신자 메일 주소
            {'\n\n'}자동 수집항목{'\n'}
            서비스 이용기록, 접속 로그, 결제기록, 세션
          </EumcText>
          <EumcText fontWeight="regular" style={styles.text}>
            제3조 (개인정보의 처리 및 보유 기간)
            {'\n'}"(주)큐어링크"은 법령의 규정과 정보 주체의 동의에 의해서만 최소한의 개인정보를 수집·보유하며, 또한, 보유하고 있는 회원의 개인정보를 관계 법령에 따라 적법하고 적정하게 처리하여 정보주체의 권익이 부당하게 침해받지 않도록 노력할 것입니다. 개인정보 보유 기간은 다음 각 호와 같습니다.
            {'\n\n'}계약 또는 청약철회 등에 관한 기록{'\n'}
            보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
            보존 기간 : 5년
            {'\n\n'}대금결제 및 재화 등의 공급에 관한 기록{'\n'}
            보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
            보존 기간 : 5년
            {'\n\n'}전자금융 거래에 관한 기록{'\n'}
            보존 이유 : 전자금융거래법
            보존 기간 : 5년
            {'\n\n'}소비자의 불만 또는 분쟁처리에 관한 기록{'\n'}
            보존 이유 : 전자상거래 등에서의 소비자보호에 관한 법률
            보존 기간 : 3년
            {'\n\n'}서비스 이용기록{'\n'}
            보존 이유 : 통신비밀보호법, 원본 문서 인증 효력기간
            보존 기간 : 3개월
          </EumcText>
          <EumcText fontWeight="regular" style={styles.text}>
            제4조 (동의를 거부할 권리가 있다는 사실과 동의 거부에 따른 불이익 내용)
            {'\n'}이용자는 "(주)큐어링크"에서 수집하는 개인정보에 대해 동의를 거부할 권리가 있으며, 동의 거부 시에는 회원가입을 할 수 없습니다.
          </EumcText>
        </ScrollView>
        <View style={styles.warning}>
          <EumcText fontWeight="regular" style={styles.warningText}>
            *{' '}
            <EumcText fontWeight="regular" style={{ color: 'red', fontSize: 14 }}>
              본인확인이 가능한 경우에만 증명서 신청
            </EumcText>
            이 가능합니다.
          </EumcText>
          <EumcText fontWeight="regular" style={[styles.warningText, styles.mb20]}>
            * 대리인(위임장)을 통한 대리발급은 불가능합니다.
          </EumcText>
          <CheckBoxItem
            marginEmpty={0}
            title={
              <EumcText fontWeight="bold" style={styles.termText}>
                개인정보 수집 및 이용 동의 (필수)
              </EumcText>
            }
            checked={selected}
            onCheckPress={() => setSelected(!selected)}
            hideArrow={true}
          />
        </View>
      </ScrollView>
      <View style={styles.containerNext}>
        <BottomTwoBtn
          leftTitle="취소"
          rightTitle="다음"
          onNext={() =>
            selected
              ? navigation.navigate('ProofCalendarSelect')
              : setToast({ type: 'error', text1: '필수 선택', text2: '개인정보 수집 및 이용 동의가 필요합니다.' })
          }
          onCancel={() => navigation.goBack()}
        />
      </View>
    </View>
  );
};

export default ProofNew;
