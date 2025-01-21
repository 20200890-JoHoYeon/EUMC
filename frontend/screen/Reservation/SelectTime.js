import { Dimensions, View, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useCallback, useState, useContext, useEffect } from 'react';
import { EmptyList, EumcText } from '../../components';
import { UserContext } from '../../context';
import ReserveInfo from './ReserveInfo';
import { BottomOneBtn } from '../../components/Buttons';
import BottomModal from '../../components/Modals/BottomModal';
import { Color } from '../../styles';
import { getDoctorScheduleList, requestRsvInfom } from '../../api/v1/reservation';
import { formatTime, formatDate2 } from '../../utils';
import { ERROR_RESERVATION_NOTIFICATION } from '../../popup-templates';

const SelectTime = ({ navigation }) => {
  const {
    code,
    loadingVisible,
    setLoadingVisible,
    currentMedicalCardIndex,
    medicalCards,
    setToast,
    rsvInfo,
    setRsvInfo,
  } = useContext(UserContext);
  const [selected, setSelected] = useState(-1);
  const [modalVisible, setModalVisible] = useState(false);
  const [time, setTime] = useState([]);
  const { name: reservationName, date, department, doctor, patientNumber: rsv_patno } = rsvInfo;
  const refresh = () => {
    setLoadingVisible(true);
    // setTime([{ MED_TM: '10:30' }]); // 샘플 확인 후 삭제
    getDoctorScheduleList(code, department.cdcode, date.replace(/-/g, ''), doctor.DR_SID)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) setTime(data || []);
      })
      .catch(e => {
        setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
        console.log(e.response);
      })
      .finally(() => setLoadingVisible(false));
  };
  const onRefresh = useCallback(() => {
    refresh();
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const resultCode = (code) => {
    if (code === '0999') {
      setToast(ERROR_RESERVATION_NOTIFICATION(`죄송합니다.${'\n'}현재 서비스가 원활하지 않습니다.`));
      // showToast("죄송합니다. 현재 서비스가 원활하지 않습니다.");
    } else if (code === '0989') {
      setToast(ERROR_RESERVATION_NOTIFICATION(`같은 날 같은 과${'\n'}진료가 예약되어 있습니다.`));
    } else if (code === '0988') {
      setToast(ERROR_RESERVATION_NOTIFICATION(`선택하신 시간의 다른 과 진료가 예약되어 있습니다.`));
    } else if (code === '4999') {
      setToast(ERROR_RESERVATION_NOTIFICATION(`초진정원이 초과되었습니다.`));
    } else {
      setToast(ERROR_RESERVATION_NOTIFICATION(`모바일 예약 대상이 아닙니다.${'\n'}전화 예약을 이용해주시기 바랍니다.`));
    }
  };

  return (
    <View style={styles.container}>
      <ReserveInfo />
      <View style={styles.titleContainer}>
        <EumcText style={styles.titleText} fontWeight="bold">
          예약 가능 시간
        </EumcText>
      </View>
      <View style={styles.flatListConatiner}>
        {time.length > 0 ? (
          <FlatList
            data={time}
            renderItem={({ item, index }) => (
              <TimeBox item={item} index={index} selected={selected} setSelected={setSelected} />
            )}
            numColumns={3}
            // refreshControl={<RefreshControl refreshing={loadingVisible} onRefresh={onRefresh} />}
          />
        ) : (
          <EmptyList
            refreshControl={<RefreshControl refreshing={loadingVisible} onRefresh={onRefresh} />}
            emptyText={<EumcText>예약 가능한 시간을 찾을 수 없습니다.</EumcText>}
          />
        )}
      </View>
      <BottomOneBtn
        disabled={!(selected >= 0)}
        rightTitle={`${selected >= 0 ? time[selected].MED_TM : ''}  예약하기`}
        onNext={() => {
          selected >= 0
            ? setModalVisible(true)
            : setToast({ type: 'error', text1: '필수 선택', text2: '시간을 선택하셔야 합니다.' });
        }}
      />

      <BottomModal
        confirmStyle={{ backgroundColor: '#16aea6' }}
        visible={modalVisible}
        confirmText="예약"
        onCancel={() => setModalVisible(false)}
        onConfirm={() => {
          const { patientNumber } = medicalCards[currentMedicalCardIndex];
          if(loadingVisible) {
            return false;
          }

          setLoadingVisible(true);

          requestRsvInfom(
            code,
            patientNumber,
            rsv_patno,
            patientNumber,
            department.cdcode,
            doctor.DR_SID,
            date.replace(/-/g, ''),
            time[selected].MED_TM.replace(/:/g, '')
          )
            .then(res => {
              const { ok, data } = res.data;
              // console.log('okokokokok', ok);
              // console.log('datadata', data);
              setRsvInfo(Object.assign(rsvInfo, { time: time[selected].MED_TM }));
              navigation.navigate('ReserveSuccess');
            })
            .catch(e => {
              resultCode(e.response.data.resultCode);
              console.log(e.response.data);
            })
            .finally(() => {
              setLoadingVisible(false);
              setModalVisible(false);
            });
        }}
        title="해당 내용으로 예약 하시겠습니까?"
      >
        <View style={styles.contentContainer}>
          <View style={styles.boxContainer}>
            <EumcText fontWeight="regular" style={styles.boxTitle}>
              성명
            </EumcText>
            <EumcText fontWeight="bold" style={styles.boxContent}>
              {reservationName}
            </EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText fontWeight="regular" style={styles.boxTitle}>
              병원
            </EumcText>
            <EumcText fontWeight="bold" style={styles.boxContent}>
              {code === '01' ? '이대서울병원' : '이대목동병원'}
            </EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText fontWeight="regular" style={styles.boxTitle}>
              진료과
            </EumcText>
            <EumcText fontWeight="bold" style={styles.boxContent}>
              {department.cdvalue}
            </EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText fontWeight="regular" style={styles.boxTitle}>
              진료의
            </EumcText>
            <EumcText fontWeight="bold" style={styles.boxContent}>
              {doctor.DR_NM}
            </EumcText>
          </View>
          <View style={styles.boxContainer}>
            <EumcText fontWeight="regular" style={styles.boxTitle}>
              진료일
            </EumcText>
            <EumcText fontWeight="bold" style={styles.boxContent}>
              {formatDate2(date)}
            </EumcText>
          </View>
          <View style={[styles.boxContainer, styles.borderNone]}>
            <EumcText fontWeight="regular" style={styles.boxTitle}>
              진료 시간
            </EumcText>
            <EumcText fontWeight="bold" style={styles.boxContent}>
              {selected >= 0 && formatTime(time[selected].MED_TM)}
            </EumcText>
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

const TimeBox = ({ item, index, selected, setSelected }) => {
  return (
    <Pressable
      style={index === selected ? styles.TimeContainerSelected : styles.TimeContainer}
      onPress={() => setSelected(index)}
    >
      <EumcText style={index === selected ? styles.TimeSelected : styles.Time} fontWeight="bold">
        {item.MED_TM}
      </EumcText>
    </Pressable>
  );
};

const windowWidth = Dimensions.get('window').width;
const childWidth = windowWidth / 3 - 18;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  bottomButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  titleText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#231f20',
  },
  flatListConatiner: {
    flex: 1,
    marginTop: 2,
    marginHorizontal: 16,
  },
  TimeContainer: {
    flex: 1 / 3,
    maxWidth: childWidth,
    minWidth: childWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#e3e4e5',
    marginHorizontal: 4,
    marginBottom: 8,
    paddingVertical: 12,
  },
  TimeContainerSelected: {
    maxWidth: childWidth,
    minWidth: childWidth,
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#16b1a9',
    marginHorizontal: 4,
    marginBottom: 8,
    paddingVertical: 12,
    backgroundColor: '#f1fffb',
  },
  Time: {
    fontSize: 16,
    color: '#6d6e71',
    lineHeight: 24,
  },
  TimeSelected: {
    fontSize: 16,
    color: '#0e6d68',
    lineHeight: 24,
  },
  modalText: {
    marginTop: 7,
    marginHorizontal: 16,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 29,
    color: '#0e6d68',
  },
  contentContainer: {
    marginTop: 24,
    marginHorizontal: 24,
  },
  boxContainer: {
    flexDirection: 'row',
    borderColor: '#e3e4e5',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  borderNone: {
    borderBottomColor: '#fff',
  },
  boxTitle: {
    alignItems: 'center',
    textAlign: 'left',
    fontSize: 16,
    color: '#939598',
    width: 100,
    lineHeight: 24,
    flex: 1,
    marginLeft: 8,
  },
  boxContent: {
    alignItems: 'center',
    fontSize: 16,
    color: '#231f20',
    lineHeight: 24,
    flex: 2,
  },
});

export default SelectTime;
