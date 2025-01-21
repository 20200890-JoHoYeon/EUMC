import { useCallback, useContext, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Modal,
  Pressable,
  ImageBackground,
  RefreshControl,
  Linking,
  SafeAreaView,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import {
  getWaitingListSeoul,
  getWaitingListMokdong,
  requestWaitingNumberSeoul,
  requestWaitingNumberMokdong,
} from '../api/v1/ticket';
import { EumcText, TopBarSimple, TicketList } from '../components';
import { RoundBtn } from '../components/Buttons';
import { RoundBorderBtn } from '../components/Buttons';
import { Color, Typography } from '../styles';
import { UserContext } from '../context';
import { DEPT_NAME, FLOOR_ORDER, ALLOWED_SSID } from '../constants';
import AlertOutline from '../assets/icon/alert-outline';
import { checkLocationPermission } from '../utils';
import { ERROR_OUTSIDE_SERVICE_AREA, SHOW_GRANT_PERMISSION } from '../popup-templates';

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifiyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 8,
    margin: 0,
    flex: 1,
  },
  emptyContainer: {
    // flexGrow: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerText: {
    fontSize: 16,
    color: '#231f20',
  },
  /* MODAL */
  ...Color.ticketListColor,
  waitingCount: {
    fontSize: 24,
    lineHeight: 28,
  },
  modalBgColor: {
    zIndex: 3,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalWrap: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Color.homeColor.primaryWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  peopleIconArea: {
    // marginVertical: 8,
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 111,
    height: 72,
  },
  peopleIcon: {
    width: '100%',
    height: '100%',
  },
  modalInfoText: {
    marginBottom: 8,
    marginTop: 6, // 적당한 길이 수정중
    fontSize: 24,
    color: '#00583f',
    lineHeight: 36,
  },
  defaultText: {
    color: '#231f20',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 27,
  },
  waitingListArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 28,
  },
  boldText: {
    color: '#231f20',
    fontSize: 18,
    letterSpacing: -0.72,
    lineHeight: 24,
  },
  buttonArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  buttonModal: {
    flex: 1,
    borderRadius: 24,
    textAlign: 'center',
    height: 48,
  },
  buttonCancel: {
    flex: 1,
    marginRight: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#939598',
    boxSizing: 'border-box',
  },
  // buttonConfirm: {
  //   backgroundColor: '#16aea6',
  // },
  modalInfoTextArea: {
    alignItems: 'center',
    //marginTop: 30,
  },
  modalTicketArea: {
    alignItems: 'center',
    marginBottom: 64,
  },
  ticketNumber: {
    color: '#231f20',
    fontSize: 50,
    lineHeight: 70,
    marginTop: 30,
  },
  waitText: {
    color: '#231f20',
    fontSize: 21,
    letterSpacing: -1.26,
    lineHeight: 30,
    marginTop: 7,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#eee',
  },
  buttonConfirm: {
    flex: 1,
    marginLeft: 4,
    backgroundColor: Color.homeColor.primaryRed,
  },
  backgroundColorTeal: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  buttonClose: {
    zIndex: 1000,
    alignItems: 'flex-end',
    marginRight: 18,
    marginTop: 20,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },

  /* modal */
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 25,
  },
  modalText2: {
    fontSize: 18,
    lineHeight: 40,
    textAlign: 'center',
    letterSpacing: -0.45,
    color: '#333333',
  },
  ...Typography,
});

const Ticket = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false); // 팝업 상태(true, false)
  const [modalChange, setModalChange] = useState(false); //팝업 -> '번호표발급' 버튼 상태(true, false)

  const { code, medicalCards, currentMedicalCardIndex, loadingVisible, setLoadingVisible, setToast, pushKey } =
    useContext(UserContext);
  const [desks, setDesks] = useState([]);
  const [ticketNumber, setTicketNumber] = useState('');

  //floor: 층수, name: 장소, ticketNumber: 호출 번호, waitingCount: 대기 인원, index: index, ticketType: 번호표 발급 여부(TicketReject, TicketAccept)
  const [modal, setModal] = useState({
    floor: '',
    name: '',
    ticketNumber: '',
    waitingCount: '',
    index: '',
    ticketType: '',
    locationName: '',
    myNumber: '',
  });

  /**
   * floor: 층수, name: 장소, ticketNumber: 호출 번호, waitingCount: 대기 인원, index: index
   */
  const modalState = (floor, name, waitingCount, index, locationName, myNumber) => {
    setModalVisible(true);
    setModal({ floor, name, waitingCount, index, locationName, myNumber });
  };

  const floor = modal.floor;
  let floorInfoText,
    refreshTimer,
    failCount = 0;

  const refresh = err => {
    if (currentMedicalCardIndex >= 0) {
      const { patientNumber } = medicalCards[currentMedicalCardIndex];
      if (code === '01') {
        getWaitingListSeoul(patientNumber)
          .then(res => {
            const { ok, data } = res.data;
            if (ok)
              setDesks(
                data
                  .filter(kiosk => !(kiosk.kioskIp === '61' || kiosk.kioskIp === '57'))
                  .map(kiosk => Object.assign(kiosk, DEPT_NAME[code][kiosk.kioskIp]))
                  .sort((a, b) => {
                    if (!a.floor) return 1;
                    if (!b.floor) return -1;
                    return FLOOR_ORDER.indexOf(a.floor) - FLOOR_ORDER.indexOf(b.floor);
                  })
                  .map(kiosk => {
                    if (kiosk.kioskIp === '1') { // B1 원무과 A
                      kiosk.locationName += '(A)';
                    } else if (kiosk.kioskIp === '54') {  // B1 원무과 관절
                      kiosk.locationName += '(관절·척추)';
                    } else if (kiosk.kioskIp === '3') { // 2F 원무과A
                      kiosk.locationName += '(A)';
                    } else if (kiosk.kioskIp === '4') {// 2F 원무과B
                      kiosk.locationName += '(B)';
                    } else if (kiosk.kioskIp === '5') {// 3F 원무과A
                      kiosk.locationName += '(A)';
                    } else if (kiosk.kioskIp === '6') {// 3F 원무과B
                      kiosk.locationName += '(B)';
                    }
                    console.log('kiosk name : ' + JSON.stringify(kiosk));
                    return kiosk;
                  })
              );
            else setDesks([]);
            failCount = 0;
          })
          .catch(err)
          .finally(() => setLoadingVisible(false));
      } else if (code === '02') {
        getWaitingListMokdong(patientNumber, pushKey)
          .then(res => {
            const { ok, data } = res.data;
            console.log(data);
            if (ok)
              setDesks(
                data
                  .map(kiosk => Object.assign(kiosk, DEPT_NAME[code][kiosk.kioskIp + '-' + kiosk.menu]))
                  .sort((a, b) => {
                    if (!a.floor) return 1;
                    if (!b.floor) return -1;
                    return FLOOR_ORDER.indexOf(a.floor) - FLOOR_ORDER.indexOf(b.floor);
                  })
              );
            else setDesks([]);
            failCount = 0;
          })
          .catch(err)
          .finally(() => setLoadingVisible(false));
      } else {
        setDesks([]);
        setToast({ type: 'error', text1: '앱 에러', text2: '알 수 없는 병원 코드입니다.' });
        setLoadingVisible(false);
      }
    } else {
      failCount++;
      setLoadingVisible(false);
    }
  };

  const refreshBackground = () => {
    refresh(e => {
      if (e.response) console.log('response', e.response);
      else if (e.request) console.log('request', e.request);
      else console.log(e);
      failCount++;
    });
    if (failCount > 2) {
      setToast({ type: 'error', text1: '서버 상태 불안정', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
      clearTimeout(refreshTimer);
    } else refreshTimer = setTimeout(() => refreshBackground(), 20000);
  };

  const checkSSID = () => {
    WifiManager.getCurrentWifiSSID()
      .then(ssid => {
        if (ALLOWED_SSID.filter(val => ssid.toUpperCase().startsWith(val)).length > 0) {
          refresh(e => {
            if (e.response) console.log('response', e.response);
            else if (e.request) console.log('request', e.request);
            else console.log(e);
            failCount++;
            setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
          });
          if (refreshTimer) clearTimeout(refreshTimer);
          refreshTimer = setTimeout(() => refreshBackground(), 20000);
        } else showWifiPopup();
      })
      .catch(e => {
        if (e.code === 'couldNotDetectSSID') showWifiPopup();
        else console.log(e);
      })
      .finally(() => setLoadingVisible(false));
  };

  const onRefresh = useCallback(() => {
    checkLocationPermission(
      checkSSID,
      () =>
        setToast(
          Object.assign(SHOW_GRANT_PERMISSION, {
            redirect: () => Linking.openSettings(),
            redirectCancel: () => navigation.navigate('MainHome'),
          })
        ),
      () => setLoadingVisible(false)
    );
  }, []);

  useEffect(() => {
    checkLocationPermission(
      checkSSID,
      () =>
        setToast(
          Object.assign(SHOW_GRANT_PERMISSION, {
            redirect: () => Linking.openSettings(),
            redirectCancel: () => navigation.navigate('MainHome'),
          })
        ),
      () => setLoadingVisible(false)
    );
    return () => refreshTimer && clearTimeout(refreshTimer);
  }, []);

  switch (floor) {
    case 'B1':
      floorInfoText = '지하1층';
      break;
    case '1F':
      floorInfoText = '1층';
      break;
    case '2F':
      floorInfoText = '2층';
      break;
    case '3F':
      floorInfoText = '3층';
      break;
    case '4F':
      floorInfoText = '4층';
      break;
    default:
      floorInfoText = '';
      break;
  }

  const showWifiPopup = () =>
    setToast(
      Object.assign(ERROR_OUTSIDE_SERVICE_AREA, {
        redirect: () => navigation.navigate('MainHome'),
      })
    );

  return (
    <SafeAreaView style={styles.wrap}>
      {modalVisible === true ? <View style={styles.modalBgColor}></View> : <View></View>}

      {desks.length > 0 ? (
        <FlatList
          numColumns={2}
          columnWrapperStyle={styles.container}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => <TicketList index={index} modal={modalState} data={item} />}
          data={desks}
          refreshControl={<RefreshControl refreshing={loadingVisible} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 30 }}
          StickyHeaderComponent={<TopBarSimple title="번호표 발급" navigation={navigation} />}
          stickyHeaderHiddenOnScroll={true}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyNotifications}>
            <AlertOutline />
            <EumcText fontWeight="bold" style={styles.centerText}>
              원내 서비스를 이용할 수 없습니다
            </EumcText>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        useNativeDriver={true}
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrap}>
          <View style={styles.modalContainer}>
            <View>
              {modalChange === false ? (
                <>
                  <Pressable style={styles.buttonClose} onPress={() => setModalVisible(!modalVisible)}>
                    <ImageBackground source={require('../assets/ico_close.png')} style={styles.closeIcon} />
                  </Pressable>
                  <View style={styles.modalInfoTextArea}>
                    <EumcText style={styles.modalInfoText} fontWeight="bold">
                      {floorInfoText} {modal.locationName || modal.name}
                    </EumcText>
                    <EumcText fontWeight="regular" style={styles.defaultText}>
                      번호표 발급을 진행하시겠습니까?
                    </EumcText>
                  </View>
                  {modal.waitingCount >= 10 ? (
                    <>
                      <View style={styles.peopleIconArea}>
                        <ImageBackground source={require('../assets/Icon_people_many.png')} style={styles.peopleIcon} />
                      </View>
                      <View style={styles.waitingListArea}>
                        <EumcText style={styles.boldText} fontWeight="bold">
                          현재 인원{' '}
                        </EumcText>
                        <EumcText style={[styles.waitingCount, styles.colorRed]} fontWeight="bold">
                          {modal.waitingCount}명{' '}
                        </EumcText>
                        <EumcText style={[styles.boldText, styles.waitTextLineHeight]} fontWeight="bold">
                          대기
                        </EumcText>
                      </View>
                    </>
                  ) : modal.waitingCount >= 6 ? (
                    <>
                      <View style={styles.peopleIconArea}>
                        <ImageBackground
                          source={require('../assets/Icon_people_middle.png')}
                          style={styles.peopleIcon}
                        />
                      </View>
                      <View style={styles.waitingListArea}>
                        <EumcText style={styles.boldText} fontWeight="bold">
                          현재 인원{' '}
                        </EumcText>
                        <EumcText style={[styles.waitingCount, styles.colorOrange]} fontWeight="bold">
                          {modal.waitingCount}명{' '}
                        </EumcText>
                        <EumcText style={[styles.boldText, styles.waitTextLineHeight]} fontWeight="bold">
                          대기
                        </EumcText>
                      </View>
                    </>
                  ) : modal.waitingCount <= 5 ? (
                    <>
                      <View style={styles.peopleIconArea}>
                        <ImageBackground
                          source={require('../assets/Icon_people_not_many.png')}
                          style={styles.peopleIcon}
                        />
                      </View>

                      <View style={styles.waitingListArea}>
                        <EumcText style={styles.boldText} fontWeight="bold">
                          현재 인원{' '}
                        </EumcText>
                        <EumcText style={[styles.waitingCount, styles.colorBlue]} fontWeight="bold">
                          {modal.waitingCount}명{' '}
                        </EumcText>
                        <EumcText style={[styles.boldText, styles.waitTextLineHeight]} fontWeight="bold">
                          대기
                        </EumcText>
                      </View>
                    </>
                  ) : (
                    <EumcText></EumcText>
                  )}
                </>
              ) : (
                <>
                  <Pressable
                    style={styles.buttonClose}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setModalChange(false);
                    }}
                  >
                    <ImageBackground source={require('../assets/ico_close.png')} style={styles.closeIcon} />
                  </Pressable>
                  <View style={styles.modalInfoTextArea}>
                    <EumcText style={styles.modalInfoText} fontWeight="bold">
                      {floorInfoText} {modal.locationName || modal.name}
                    </EumcText>
                  </View>
                  <View style={styles.modalTicketArea}>
                    <EumcText style={styles.ticketNumber} fontWeight="bold">
                      {ticketNumber}
                    </EumcText>
                    <EumcText fontWeight="regular" style={styles.waitText}>
                      호출을 잠시만 기다려 주세요.
                    </EumcText>
                  </View>
                </>
              )}
            </View>
            <View style={styles.buttonArea}>
              {modalChange === false ? (
                <>
                  <View style={styles.buttonContainer}>
                    <RoundBorderBtn
                      title="취소"
                      style={styles.buttonCancel}
                      onPress={() => setModalVisible(!modalVisible)}
                    />
                    <RoundBtn
                      title="번호표 발급"
                      style={[styles.buttonConfirm, styles.backgroundColorTeal]}
                      onPress={() => {
                        setModalChange(true);
                        const { patientNumber } = medicalCards[currentMedicalCardIndex];
                        if (code === '01') {
                          requestWaitingNumberSeoul(desks[modal.index].divId, patientNumber)
                            .then(res => {
                              setTicketNumber(res.data.data.myNumber);
                              refresh();
                            })
                            .catch(e => console.log(e));
                        } else if (code === '02') {
                          requestWaitingNumberMokdong(
                            desks[modal.index].kioskIp,
                            patientNumber,
                            desks[modal.index].menu
                          )
                            .then(res => {
                              console.log(res);
                              setTicketNumber(res.data.data.myNumber);

                              refresh();
                            })
                            .catch(e => console.log(e));
                        }
                      }}
                    />
                  </View>
                </>
              ) : (
                <RoundBtn
                  title="확인"
                  style={[styles.buttonConfirm, styles.backgroundColorTeal]}
                  onPress={() => {
                    setModalVisible(false);
                    setModalChange(false);
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default Ticket;
