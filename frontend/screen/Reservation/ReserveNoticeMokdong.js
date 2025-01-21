import { StyleSheet, View } from 'react-native';
import { EumcText } from '../../components';
import { Color } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  text1: {
    fontSize: 16,
    textAlign: 'left',
    color: '#231f20',
    lineHeight: 25,
    marginTop: 16,
    marginHorizontal: 16,
  },
  text2: {
    fontSize: 16,
    textAlign: 'left',
    color: '#7670b3',
    marginHorizontal: 16,
    lineHeight: 25,
    marginVertical: 21,
  },
  text3: {
    fontSize: 16,
    textAlign: 'left',
    color: '#231f20',
    marginHorizontal: 16,
    lineHeight: 25,
  },
});

const ReserveNoticeMokdong = () => {
  return (
    <View style={styles.container}>
      <EumcText fontWeight="regular" style={styles.text1}>
        이대목동병원은 의료전달체계가 필요한 종합전문요양기관(3차 진료기관)으로 1차 또는 2차(의원, 병원)진료기관에서
        발급한 요양급여의뢰서(진료의뢰서)나 건강검진, 건강진단결과서를 제출해야 건강보험 적용을 받을 수 있습니다. 단,
        의료급여환자는 모든 진료과에 대해 2차기관(병원급)에서 발급한 의료급여의뢰서를 제출해야 의료급여 적용을 받을 수
        있습니다.
      </EumcText>
      {/*<EumcText fontWeight="regular" style={styles.text2}>*/}
      {/*  정신건강의학과, 방사선종양학과는 전화 예약을 이용해 주시기 바랍니다.{'\n'}*/}
      {/*  치과는 초진환자만 예약 가능하며, 치과 문의는 각 분과별로 전화 바랍니다.*/}
      {/*</EumcText>*/}
      <EumcText fontWeight="regular" style={styles.text3}>
        * 진료예약 시간 20분 전까지 병원에 도착하시기 바랍니다.{'\n'}* 외래 진료를 예약하신 분이 부득이한 사정 등으로
        당일 진료를 받으실 수 없을 경우는 1일 전까지 진료 일자를 연기하거나 취소하셔야 합니다.{'\n'}* 자세한 사항은
        예약절차안내를 참고하시기 바랍니다.
      </EumcText>
    </View>
  );
};

export default ReserveNoticeMokdong;
