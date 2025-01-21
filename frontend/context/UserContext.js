import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { selectMenus as initialSelectMenu, unselectMenus as initialUnselectMenu } from '../constants';
export const UserContext = createContext();

const windowSize = Dimensions.get('window');
const getStoreData = async key => {
  try {
    const data = await EncryptedStorage.getItem(key);
    return data;
  } catch (e) {
    console.log('failed to retrieve:', key, 'error:', e);
    return null;
  }
};
const setStoreData = async (key, data) => {
  try {
    await EncryptedStorage.setItem(key, typeof data === 'object' ? JSON.stringify(data) : data);
  } catch (e) {
    console.log('failed to store:', key);
  }
};
const updateStateAndStorage = (key, data, setState) => {
  setStoreData(key, typeof data !== 'string' ? JSON.stringify(data) : data);
  setState(data);
};

export const UserContextProvider = ({ init, children }) => {
  const [code, setCode] = useState(init.code);
  const [notifications, setNotifications] = useState([]);
  const [selectMenus, _setSelectMenus] = useState(initialSelectMenu);
  const [unselectMenus, _setUnselectMenus] = useState(initialUnselectMenu);
  const [kcpTrade, setKcpTrade] = useState([]);
  const [cardLists, setCardLists] = useState([]);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [medicalCards, _setMedicalCards] = useState([]);
  const [easyPin, _setEasyPin] = useState();
  const [currentMedicalCardIndex, _setCurrentMedicalCardIndex] = useState(0);
  const [reservations, setReservations] = useState([]);
  const [arrivalConfirmEnabled, setArrivalConfirmationEnabled] = useState(false);
  const [toast, setToast] = useState();
  const [schedule, setSchedule] = useState([]);
  const [scheduleToday, setScheduleToday] = useState([]);
  const [pushKey, setPushKey] = useState();
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [rsvInfo, setRsvInfo] = useState();
  const [appLocked, _setAppLocked] = useState(false);
  const [switchNotifications, _setSwitchNotifications] = useState(false);
  const _scheduleUpdated = useRef(0);

  const scheduleUpdated = _scheduleUpdated.current;
  const setScheduleUpdated = time => {
    _scheduleUpdated.current = time;
  };

  const setMedicalCards = cards => updateStateAndStorage('medicalCards', cards, _setMedicalCards);
  const setSelectMenus = data => updateStateAndStorage('selectMenus', data, _setSelectMenus);
  const setUnselectMenus = data => updateStateAndStorage('unselectMenus', data, _setUnselectMenus);
  const setCurrentMedicalCardIndex = index =>
    updateStateAndStorage('currentMedicalCardIndex', index, _setCurrentMedicalCardIndex);
  const setEasyPin = pin => updateStateAndStorage('easyPin', pin, _setEasyPin);
  const setAppLocked = appLocked => updateStateAndStorage('appLock', appLocked, _setAppLocked);
  const setSwitchNotifications = switchNotifications =>
    updateStateAndStorage('switchNotifications', switchNotifications, _setSwitchNotifications);

  useEffect(() => {
    getStoreData('currentMedicalCardIndex').then(num => _setCurrentMedicalCardIndex(isNaN(num) ? undefined : +num));
    getStoreData('easyPin').then(pin => _setEasyPin(pin));
    getStoreData('medicalCards').then(cards => _setMedicalCards(JSON.parse(cards || null) || []));
    getStoreData('selectMenus').then(menu => setSelectMenus(JSON.parse(menu || null) || initialSelectMenu));
    getStoreData('unselectMenus').then(menu => setUnselectMenus(JSON.parse(menu) || null || initialUnselectMenu));
    getStoreData('appLock').then(appLocked => _setAppLocked(JSON.parse(appLocked || null)));
    getStoreData('switchNotifications').then(switchNotifications =>
      _setSwitchNotifications(JSON.parse(switchNotifications || null) || false)
    );

    //
    //
    // //Method for handling notifications received while app in foreground
    // OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    //   const notification = notificationReceivedEvent.getNotification();
    //   console.log(notification);
    //   const msg = notification.body;
    //
    //   setToast({
    //     type: 'error', text1: '알림', text2: msg,
    //     onConfirm: ({ navigation }) => {
    //
    //       navigation.navigate('Ticket');
    //     },
    //   });
    //
    //   // Complete with null means don't show a notification.
    //   notificationReceivedEvent.complete(notification);
    // });
  }, []);

  //컨텍스트 추가될때마다 setting 페이지 로그아웃 기능에서 삭제할 데이터는 업데이트 해주세요
  return (
    <UserContext.Provider
      value={useMemo(
        () => ({
          code,
          setCode,
          notifications,
          setNotifications,
          selectMenus,
          setSelectMenus,
          unselectMenus,
          setUnselectMenus,
          cardLists,
          setCardLists,
          getStoreData,
          setStoreData,
          loadingVisible,
          setLoadingVisible,
          medicalCards,
          setMedicalCards,
          currentMedicalCardIndex,
          setCurrentMedicalCardIndex,
          arrivalConfirmEnabled,
          setArrivalConfirmationEnabled,
          easyPin,
          setEasyPin,
          toast,
          setToast,
          reservations,
          setReservations,
          windowSize,
          scheduleToday,
          setScheduleToday,
          schedule,
          setSchedule,
          pushKey,
          setPushKey,
          kcpTrade,
          setKcpTrade,
          refreshToggle,
          setRefreshToggle,
          rsvInfo,
          setRsvInfo,
          appLocked,
          setAppLocked,
          switchNotifications,
          setSwitchNotifications,
          scheduleUpdated,
          setScheduleUpdated,
        }),
        [
          code,
          notifications,
          selectMenus,
          unselectMenus,
          cardLists,
          getStoreData,
          loadingVisible,
          medicalCards,
          currentMedicalCardIndex,
          arrivalConfirmEnabled,
          easyPin,
          toast,
          reservations,
          schedule,
          scheduleToday,
          pushKey,
          kcpTrade,
          refreshToggle,
          rsvInfo,
          appLocked,
          switchNotifications,
        ]
      )}
    >
      {children}
    </UserContext.Provider>
  );
};
