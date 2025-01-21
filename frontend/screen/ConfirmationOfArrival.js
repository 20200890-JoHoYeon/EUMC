import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useContext, useEffect } from 'react';
import { UserContext } from '../context';
import TodaySchedule from './TodaySchedule';
import UpcomingSchedule from './UpcomingSchedule';
import { getRsvList, getRsvListInner, getTodaySchedule, getTodayScheduleInner } from '../api/v1/reservation';
import { SORT_DATETIME, SORT_DATE } from '../utils';

const Tab = createMaterialTopTabNavigator();
const ConfirmationOfArrival = (navigation, route) => {
  const now = new Date(); // 내일 날짜를 구하기 위한 현재 날짜 및 시간
  let nextday = new Date(now.getTime() + 86400000);
  nextday.setHours(0, 0, 0, 0);

  const {
    code,
    medicalCards,
    currentMedicalCardIndex,
    refreshToggle,
    setLoadingVisible,
    setSchedule,
    setScheduleToday,
  } = useContext(UserContext);

  const refresh = () => {
    if (currentMedicalCardIndex >= 0) {
      const { patientNumber } = medicalCards[currentMedicalCardIndex];
      setLoadingVisible(true);

      // 예약 내역 범위는 서버에서 지정
      // getRsvListInner(code, patientNumber, patientNumber)
      getRsvList(code, patientNumber, patientNumber, null, null)
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            setSchedule(data.sort((a, b) => SORT_DATETIME(a.MED_DT, b.MED_DT, a.MED_TM, b.MED_TM)));
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => setLoadingVisible(false));

      // getTodayScheduleInner(code, patientNumber, patientNumber)
      getTodaySchedule(code, patientNumber)
        // getTodayScheduleInner(code, '10783804', '10783804')
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            setScheduleToday(data.sort((a, b) => SORT_DATE(a.MED_TM, b.MED_TM)));
          }
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => setLoadingVisible(false));
    }
  };

  useEffect(() => {
    refresh();
  }, [refreshToggle]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 16,
          lineHeight: 24,
          fontFamily: 'NotoSansKR-Bold',
        },
        tabBarIndicatorStyle: {
          height: 2,
          backgroundColor: '#16aea6',
        },
      }}
      backBehavior="none"
    >
      <Tab.Group>
        <Tab.Screen name="TodayScheduleTab" component={TodaySchedule} options={{ tabBarLabel: '당일 일정' }} />
        <Tab.Screen
          name="UpcomingScheduleTab"
          component={UpcomingSchedule}
          options={{ tabBarLabel: '다가오는 일정' }}
        />
      </Tab.Group>
    </Tab.Navigator>
  );
};

export default ConfirmationOfArrival;
