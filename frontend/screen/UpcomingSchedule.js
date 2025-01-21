import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { useContext, useState } from 'react';
import { EumcText, ScheduleList } from '../components';
import AlertOutline from '../assets/icon/alert-outline';
import { deleteReservation, getRsvList, getRsvListInner } from '../api/v1/reservation';
import { UserContext } from '../context';
import { CANCEL_RESERVATION, ERROR_SERVER_REFRESH } from '../popup-templates';
import { SORT_DATETIME } from '../utils';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },

  /* 일정 없을 경우 */
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  notificationIcon: {
    fontSize: 128,
    opacity: 0.3,
    marginBottom: 20,
  },
  centerText: {
    fontSize: 16,
    color: '#231f20',
  },
});

const UpcomingSchedule = () => {
  const {
    code,
    medicalCards,
    currentMedicalCardIndex,
    loadingVisible,
    setLoadingVisible,
    setToast,
    schedule,
    setSchedule,
    setScheduleUpdated,
  } = useContext(UserContext);
  const { patientNumber } = medicalCards[currentMedicalCardIndex];

  const modalState = (id, dept_cd, dept_nm) => {
    console.log(`DELETE PARM ${id}, ${dept_cd}`);
    setToast(
      Object.assign(CANCEL_RESERVATION(dept_nm), {
        onConfirm: () => {
          if(loadingVisible) {
            return false;
          }

          setLoadingVisible(true);

          deleteReservation(code, patientNumber, id, patientNumber, dept_cd)
            .then(res => {
              setLoadingVisible(false);
              console.log(`DELETE RESULT : ${JSON.stringify(res.data)}`);
              setToast({ type: 'error', text1: '예약 취소', text2: '예약이 취소되었습니다.' });
            })
            .catch(e => {
              console.log(e.response);
              setToast(ERROR_SERVER_REFRESH);
            })
            .finally(() => {
              setLoadingVisible(false);
              refresh();
            });
        },
      })
    );
  };

  const refresh = async () => {
    try {
      setLoadingVisible(true);
      // const res = await getRsvListInner(code, patientNumber, patientNumber);
      const res = await getRsvList(code, patientNumber, patientNumber, null, null);
      setScheduleUpdated(Date.now());
      const { ok, data } = res.data;
      if (ok) setSchedule(data.sort((a, b) => SORT_DATETIME(a.MED_DT, b.MED_DT, a.MED_TM, b.MED_TM)));
    } catch (e) {
      console.log(e);
      setToast(ERROR_SERVER_REFRESH);
    } finally {
      setLoadingVisible(false);
    }
  };

  return schedule.length > 0 ? (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={loadingVisible} onRefresh={refresh} />}
    >
      <ScheduleList modal={modalState} data={schedule} type="upcoming" />
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <View style={styles.emptyNotifications}>
        <AlertOutline />
        <EumcText fontWeight="bold" style={styles.centerText}>
          일정이 없습니다.
        </EumcText>
      </View>
    </View>
  );
};

export default UpcomingSchedule;
