import { useEffect, useContext, useState, useCallback, useRef } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Linking, AppState } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { Color } from '../styles';
import { EumcText, ScheduleList } from '../components';
import AlertOutline from '../assets/icon/alert-outline';
import { ALLOWED_SSID } from '../constants';
import { UserContext } from '../context';
import { requestArrive } from '../api/v1/reservation';
import { getDeptWaitingList } from '../api/v1/meddept';
import { checkLocationPermission } from '../utils';
import { ERROR_OUTSIDE_SERVICE_AREA, SHOW_GRANT_PERMISSION } from '../popup-templates';
import { useFocusEffect } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: { backgroundColor: Color.homeColor.primaryWhite },
  todayText: {
    lineHeight: 24,
    paddingTop: 19,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    backgroundColor: Color.homeColor.primaryWhite,
    color: Color.homeColor.primaryBlack,
    fontSize: 16,
    borderTopWidth: 8,
    borderColor: '#f5f5f5',
  },

  /* MODAL */
  modalWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },

  modalView: {
    alignItems: 'center',
    width: 280,
    backgroundColor: Color.homeColor.primaryWhite,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
  },
  modalPlaceText: {
    marginTop: 30,
    marginBottom: 16,
    color: Color.homeColor.primaryDarkgreen,
    fontSize: 24,
  },
  modalButtonArea: {
    flexDirection: 'row',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#dddddd',
  },
  modalButton: {
    paddingTop: 16,
    paddingBottom: 16,
    width: '50%',
    textAlign: 'center',
    alignItems: 'center',
  },
  modalConfirmButton: {
    borderLeftWidth: 1,
    borderColor: '#dddddd',
  },
  modalConfirmText: {
    color: Color.homeColor.primaryDarkgreen,
    fontSize: 20,
  },
  modalCancelText: {
    color: '#333333',
    fontSize: 20,
  },
  borderColorRed: {
    backgroundColor: Color.homeColor.primaryWhite,
    borderWidth: 1,
    borderColor: Color.homeColor.primaryRed,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    paddingTop: 16,
    letterSpacing: -0.45,
    marginBottom: 30,
    color: '#333333',
  },
  modalTitleText: {
    color: '#0e6d68',
    fontSize: 24,
    letterSpacing: -1.2,
  },
  line36: {
    lineHeight: 36,
  },
  line29: {
    lineHeight: 29,
  },

  /* 일정 없을 경우 */
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerText: {
    fontSize: 16,
    color: '#231f20',
  },

  ///////
  listContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  shapeArea: {
    alignItems: 'center',
  },
  circleShape: {
    width: 11,
  },
  lineShape: {
    width: 1,
    flex: 1,
    backgroundColor: '#c5c5c5',
  },
});

const TodaySchedule = () => {
  const {
    code,
    loadingVisible,
    setLoadingVisible,
    arrivalConfirmEnabled,
    medicalCards,
    currentMedicalCardIndex,
    setArrivalConfirmationEnabled,
    setToast,
    scheduleToday,
  } = useContext(UserContext);
  const [id, setId] = useState(1);
  const [callText, setCallText] = useState(new Map());
  const [callStatus, setCallStatus] = useState(new Map());
  const askPermission = useRef(false);

  const { patientNumber } = medicalCards[currentMedicalCardIndex];
  const nowDate = new Date();
  const todayDateString = `${nowDate.getFullYear()}년 ${nowDate.getMonth() + 1}월 ${nowDate.getDate()}일`;

  const checkSSID = () => {
    WifiManager.getCurrentWifiSSID()
      .then(ssid =>
        ALLOWED_SSID.filter(val => ssid.toUpperCase().startsWith(val)).length > 0
          ? setArrivalConfirmationEnabled(true)
          : setArrivalConfirmationEnabled(false)
      )
      .catch(e => {
        if (e.code === 'couldNotDetectSSID') setToast(ERROR_OUTSIDE_SERVICE_AREA);
        else console.log(e);
      })
      .finally(() => setLoadingVisible(false));
  };

  useFocusEffect(
    useCallback(() => {
      if (code === '02') {
        askPermission.current = false;
        checkLocationPermission(
          checkSSID,
          () => setToast(Object.assign(SHOW_GRANT_PERMISSION, { redirect: () => Linking.openSettings() })),
          () => {
            setLoadingVisible(false);
            askPermission.current = true;
          }
        );
      }
    }, [])
  );

  useEffect(() => {
    if (code === '02') loadDeptWaitingList();
    const appListener = AppState.addEventListener('change', state => {
      if (code === '02' && state === 'active' && askPermission.current) {
        askPermission.current = false;
        checkLocationPermission(
          checkSSID,
          () => setToast(Object.assign(SHOW_GRANT_PERMISSION, { redirect: () => Linking.openSettings() })),
          () => {
            setLoadingVisible(false);
            askPermission.current = true;
          }
        );
      }
    });
    return () => appListener.remove();
  }, []);

  const modalState = (title, id) => {
    if (!arrivalConfirmEnabled) {
      setToast({ type: 'error', text1: '원내 서비스 알림', text2: '원내에서만 사용가능한 서비스 입니다.' });
      return;
    }
    setToast(Object.assign(ARRIVAL_CONFIRMATION(title), { redirect: () => arrivalTypeChange(id) }));
    setId(id);
  };

  const loadDeptWaitingList = () => {
    getDeptWaitingList(code, patientNumber, '')
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          for (const datum of data) {
            let msg = '';
            // 0 : 접수, 1 : 도착확인, 2 : 진료실앞 대기, 3 : 진료실 호출, 4 : 진료 완료
            // if(data.status === '0') {
            //   setCallText('접수가 완료되었습니다.');
            // }else
            if (datum.status === '1') {
              msg = `도착확인 요청이 완료되었습니다.`;
            } else if (datum.status === '2') {
              msg = `${datum.deptname} 진료실 앞에서 대기해주세요.`;
            } else if (datum.status === '3') {
              msg = `${datum.deptname} 진료실에서 호출입니다.`;
            } else {
              //  setCallText(`${data.deptname}에서 호출이 되었습니다.`);
            }
            if (datum.pact_id != null) {
              callText.set(datum.pact_id, msg);
              setCallText(callText);
            }
          }
        }
      })
      .catch(e => {
        console.log(e.response.data);
      });
  };

  const arrivalTypeChange = id => {
    requestArrive(code, id)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          callText.set(id, '도착확인 요청이 완료되었습니다.');
          setCallText(callText);

          /**
           *   patno   : string;
           *   pact_id : string;
           *   deptcode: string;
           *   deptname: string;
           *   status  : string;
           */
          return getDeptWaitingList(code, patientNumber, id);
        } else {
          throw '도착확인 실패';
        }
      })
      .then(res => {
        const { ok, data } = res.data;
        if (ok) {
          console.log(`MED WAIT LIST : ${JSON.stringify(data)}`);

          for (const datum of data) {
            let msg = '';
            // 0 : 접수, 1 : 도착확인, 2 : 진료실앞 대기, 3 : 진료실 호출, 4 : 진료 완료
            // if(data.status === '0') {
            //   setCallText('접수가 완료되었습니다.');
            // }else
            if (datum.status === '1') {
              msg = `도착확인 요청이 완료되었습니다.`;
            } else if (datum.status === '2') {
              msg = `${data.deptname} 진료실 앞에서 대기해주세요.`;
            } else if (datum.status === '3') {
              msg = `${datum.deptname} 진료실에서 호출입니다.`;
            } else {
              //  setCallText(`${data.deptname}에서 호출이 되었습니다.`);
            }
            if (datum.pact_id != null) {
              callText.set(datum.pact_id, msg);
              callStatus.set(datum.pact_id, datum.status);
              setCallText(callText);
              setCallStatus(callStatus);
            }
          }

          console.log(`CALLTEXT LEN : ${callText.size}`);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <>
      {scheduleToday.length > 0 ? (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={loadingVisible} />}>
          <EumcText style={[styles.todayText]} fontWeight="bold">
            {todayDateString}
          </EumcText>
          <ScheduleList
            data={scheduleToday}
            type="today"
            callText={callText}
            callStatus={callStatus}
            modal={modalState}
            disabled={!arrivalConfirmEnabled}
          />
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
      )}
    </>
  );
};

export default TodaySchedule;
