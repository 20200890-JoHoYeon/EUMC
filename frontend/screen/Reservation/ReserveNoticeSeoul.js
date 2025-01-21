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
    color: '#7670b3',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 25,
  },
  text2: {
    fontSize: 16,
    color: '#231f20',
    marginHorizontal: 16,
    lineHeight: 25,
  },
});

const ReserveNoticeSeoul = () => {
  return (
    <View style={styles.container}>
      <EumcText fontWeight="regular" style={styles.text1}>
        정신건강의학과, 방사선종양학과는 전화예약을 이용해주시기 바랍니다.{'\n'}
        치과는 초진환자만 예약 가능하며, 치과 문의는 각 분과별로 전화바랍니다.{'\n'}
        예약검사가 있는 경우 콜센터(1522-7000)를 통해 진료 및 검사일정을 변경하시기 바랍니다.
      </EumcText>
      <EumcText fontWeight="regular" style={styles.text2}>
        * 진료예약 시간 20분 전까지 병원에 도착하시기 바랍니다.{'\n'}* 외래 진료를 예약하신 분이 부득이한 사정 등으로
        당일 진료를 받으실 수 없을 경우는 1일 전까지 진료 일자를 연기하거나 취소하셔야 합니다.{'\n'}* 자세한 사항은
        예약절차안내를 참고하시기 바랍니다.
      </EumcText>
    </View>
  );
};

export default ReserveNoticeSeoul;
