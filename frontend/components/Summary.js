import { ActivityIndicator, StyleSheet, View, Pressable, RefreshControl } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Color } from '../styles';
import EumcText from './EumcText';
import { getRsvList, getRsvListInner, getTodaySchedule, getTodayScheduleInner } from '../api/v1/reservation';
import { SORT_DATETIME, SORT_DATE } from '../utils';
import { largeBoldXX, regularXBold, small } from '../styles/typography';

const styles = StyleSheet.create({
  userNameTextBox: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  scheduleBox: {
    flexDirection: 'row',
    borderColor: Color.homeColor.primaryLightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderBottomWidth: 10,
  },
  daySchedule: {
    paddingTop: 7,
    paddingBottom: 4,
    flex: 1,
    borderRightWidth: 1,
    borderColor: Color.homeColor.primaryLightGray,
    paddingHorizontal: 8,
  },
  upcomSchedule: {
    paddingTop: 7,
    paddingBottom: 4,
    flex: 1,
    paddingHorizontal: 8,
  },
  dayNum: {
    ...largeBoldXX,
    textAlign: 'right',
    color: Color.homeColor.primaryTurquoise,
    lineHeight: 43,
    paddingRight: 2,
  },
  upcomNum: {
    ...largeBoldXX,
    textAlign: 'right',
    lineHeight: 43,
  },
  upcomSpinner: {
    alignItems: 'flex-end',
    paddingTop: 7,
  },
  title: { ...small, lineHeight: 17 },
  patientName: {
    ...regularXBold,
    lineHeight: 38,
  },
});

const Summary = ({ navigation }) => {
  const {
    code,
    medicalCards,
    currentMedicalCardIndex,
    schedule,
    scheduleToday,
    setSchedule,
    setScheduleToday,
    scheduleUpdated,
    setScheduleUpdated,
  } = useContext(UserContext);
  const [loadingVisible, setLoadingVisible] = useState(false);

  const index = currentMedicalCardIndex ? currentMedicalCardIndex : 0;

  const getSchd = async () => {
    if (currentMedicalCardIndex >= 0) {
      setScheduleUpdated(Date.now());
      const { patientNumber } = medicalCards[currentMedicalCardIndex];

      try {
        // 예약 내역 범위는 서버에서 지정
        setLoadingVisible(true);
        // const res = await getRsvList(code, patientNumber, patientNumber, todayDate, toDate);
        // const res = await getRsvListInner(code, patientNumber, patientNumber);
        const res = await getRsvList(code, patientNumber, patientNumber, null, null);

        console.log(`res2 : ${JSON.stringify(res)}`);

        // const resToday = await getTodayScheduleInner(code, patientNumber, patientNumber);
        const resToday = await getTodaySchedule(code, patientNumber);

        console.log(`today : ${JSON.stringify(resToday)}`);

        if (res.data.ok) {
          setSchedule(res.data.data.sort((a, b) => SORT_DATETIME(a.MED_DT, b.MED_DT, a.MED_TM, b.MED_TM)));
        }
        if (resToday.data.ok) {
          setScheduleToday(resToday.data.data.sort((a, b) => SORT_DATE(a.MED_TM, b.MED_TM)));
        }
      } catch (e) {
        console.error(e.request);
      } finally {
        setLoadingVisible(false);
      }
    }
  };

  useEffect(() => {
    // 마지막 업데이트가 10초 이상일 경우에만 업데이트
    if (scheduleUpdated + 10000 < Date.now()) getSchd();
  }, [code]);

  // KCP 새로고침 문제로 주석처리
  // 1분에 한번씩 자동으로 업데이트
  // useEffect(() => {
  //   const updateScheduleTimer = setTimeout(() => {
  //     getSchd();
  //   }, 60000);
  //   return () => clearTimeout(updateScheduleTimer);
  // }, [scheduleUpdated]);

  return (
    index >= 0 && (
      <View refreshControl={<RefreshControl refreshing={loadingVisible} />}>
        <View style={styles.userNameTextBox}>
          <EumcText style={styles.patientName}>{medicalCards[index]?.name} 님</EumcText>
        </View>
        <View style={styles.scheduleBox}>
          <Pressable style={styles.daySchedule} onPress={() => navigation.push('ConfirmationOfArrival')}>
            <EumcText style={styles.title}>당일 일정</EumcText>
            {loadingVisible ? (
              <ActivityIndicator size="large" style={styles.upcomSpinner} />
            ) : (
              <EumcText style={styles.dayNum}>{scheduleToday.length}</EumcText>
            )}
          </Pressable>
          <Pressable
            style={styles.upcomSchedule}
            onPress={() => navigation.push('ConfirmationOfArrival', { screen: 'UpcomingScheduleTab' })}
          >
            <EumcText style={styles.title}>다가오는 일정</EumcText>
            {loadingVisible ? (
              <ActivityIndicator size="large" style={styles.upcomSpinner} />
            ) : (
              <EumcText style={styles.upcomNum}>{schedule.length}</EumcText>
            )}
          </Pressable>
        </View>
      </View>
    )
  );
};
export default Summary;
