import { useContext } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { UserContext } from '../../context';
import { EumcText } from '../../components';
import { BottomOneBtn } from '../../components/Buttons';
import { Color } from '../../styles';
import { formatDate2, formatTime } from '../../utils';

const ReserveSuccess = ({ navigation }) => {
  const { code, refreshToggle, setRefreshToggle, rsvInfo } = useContext(UserContext);
  const { name, department, doctor, date, time } = rsvInfo;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.boxContainer}>
            <EumcText style={styles.boxTitle}>성명</EumcText>
            <EumcText style={styles.boxContent}>{name}</EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText style={styles.boxTitle}>병원</EumcText>
            <EumcText style={styles.boxContent}>{code === '01' ? '이대서울병원' : '이대목동병원'}</EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText style={styles.boxTitle}>진료과</EumcText>
            <EumcText style={styles.boxContent}>{department.cdvalue}</EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText style={styles.boxTitle}>진료의</EumcText>
            <EumcText style={styles.boxContent}>{doctor.DR_NM}</EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText style={styles.boxTitle}>진료일</EumcText>
            <EumcText style={styles.boxContent}>{formatDate2(date)}</EumcText>
          </View>
          <View style={{ flexDirection: 'row', paddingTop: 8 }}>
            <EumcText style={styles.boxTitle}>진료시간</EumcText>
            <EumcText style={styles.boxContent}>{formatTime(time)}</EumcText>
          </View>
        </View>
        <View style={styles.checkContainer}>
          <View style={styles.completeImgArea}>
            <Image style={styles.completeImg} source={require('../../assets/payment_card/ic_bic_check.png')} />
          </View>

          <EumcText style={styles.checkTitle} fontWeight="bold">
            진료예약이 완료 되었습니다.
          </EumcText>
        </View>
        <View style={styles.noticeContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <EumcText fontWeight="regular" style={styles.noticeText}>
              * 신환,초진 진료시 보험자격이 건강보험인 경우 1차,2차(의원,병원)진료기관에서 발급한 요양급여의뢰서나 검사결과지를 지참해야 건강보험 적용을 받을수 있습니다.{'\n'}
              단, 의료급여환자는 2차기관(병원급)에서 발급한 의료 급여의뢰서를 지참해야 의료급여적용을 받을수 있습니다.
            </EumcText>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <EumcText fontWeight="regular" style={styles.noticeText}>
              * 진료 예약시간 30분 전까지는 원무팀으로 방문하여 주세요.
            </EumcText>
          </View>
        </View>
      </ScrollView>
      <BottomOneBtn
        buttonStyle={{
          backgroundColor: Color.homeColor.primaryWhite,
          borderColor: Color.homeColor.primaryTurquoise,
          borderWidth: 1,
          alignItems: 'center',
        }}
        titleStyle={{ color: Color.homeColor.primaryTurquoise }}
        rightTitle="홈으로 돌아가기"
        onNext={() => {
          navigation.navigate('ReserveMain');
          setRefreshToggle(!refreshToggle);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 10,
    backgroundColor: Color.homeColor.primaryWhite,
    ...Color.shadowColor.menuBox,
    ...Color.shadowColor.card2,
  },
  boxContainer: {
    flexDirection: 'row',
    borderColor: '#e3e4e5',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  boxTitle: {
    alignItems: 'center',
    textAlign: 'left',
    fontSize: 14,
    color: '#939598',
    width: 55,
    lineHeight: 20,
    marginRight: 32,
    marginLeft: 8,
  },
  boxContent: {
    alignItems: 'center',
    fontSize: 14,
    color: '#231f20',
    textAlign: 'left',
    lineHeight: 20,
  },
  checkContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    marginTop: 19,
    marginBottom: 62,
  },
  checkTitle: {
    marginTop: 7,

    fontSize: 16,
    color: '#231f20',
  },

  noticeContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 22,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  noticeText: {
    fontSize: 12,
    color: '#231f20',
    paddingBottom: 7,
    lineHeight: 18,
  },
});
export default ReserveSuccess;
