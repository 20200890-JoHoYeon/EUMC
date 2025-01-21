import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, StatusBar, Platform, UIManager, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LocaleConfig } from 'react-native-calendars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
bcrypt.setRandomFallback(len => new Uint8Array(len).map(() => Math.floor(isaac.random() * 256)));

import {
  Splash,
  Ticket,
  SideMenu,
  ConfirmationOfArrival,
  SecurePinScreen,
  ConfirmScreen,
  CardDelConfirm,
  WebViewPage,
} from './screen';
import { Home, FavoriteMenu, Setting, PersonalInformation } from './screen/Home';
import {
  MyPage,
  PaymentCardMain,
  PaymentCardInfoAdd,
  PaymentCardReg,
  PaymentCardRegTerms,
  History,
  HistoryDetail,
  MobilePayment,
  MobilePaymentDetail,
  SmartPayment,
  MedicationGuideDetails,
  ProxyPayment,
  ExamDetail,
} from './screen/MyPage';
import {
  MedicalCardMain,
  MedicalCardRegTerms,
  MedicalCardReg,
  MedicalCardList,
  MedicalCardAdd,
} from './screen/MedicalCard';
import {
  ReserveMain,
  ReserveNoticeSeoul,
  ReserveNoticeMokdong,
  ReserveStep,
  ReserveSuccess,
  SelectDepartment,
  ReservationOther,
  SelectDoctor,
  SelectDate,
  SelectTime,
} from './screen/Reservation';
import {
  MbExamineTerms,
  ServiceTerms,
  PersonalInfoTerms,
  UniqueInfoTerms,
  PhoneIdentificationTerms,
} from './screen/Terms';
import { ProofNew, ProofCalendarSelect, ProofSelect, ProofPayment } from './screen/Proof';

import { UserContextProvider, UserContext } from './context';
import Loading from './components/Loading';
import { EumcText } from './components';
import { Color } from './styles';

import Back from './assets/icon/back';

import './api/onesignal';
import OneSignal from 'react-native-onesignal';
import { storePush } from './api/v1/app';
import { Initial, OrderReg, OrderNormalReg, KcpAuth } from './screen/Payment';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ERROR_NO_PATIENT } from './popup-templates';
import OrderKakao from './screen/Payment/OrderKakao';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Stack = createNativeStackNavigator();
const MyPageStack = createNativeStackNavigator();
const ReservationStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  tabBarIcon: { marginVertical: 0, padding: 0, flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabBarLabel: {
    fontFamily: 'NotoSansKR-Medium',
    color: Color.homeColor.primaryBlack,
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 2,
    //color: '#222',
  },
  tabBarLabelActive: {
    color: '#222',
  },
  tabBarLabelInactive: {
    color: '#939598',
  },
  defaultBackButton: {
    paddingVertical: 8,
    paddingRight: 40,
  },
});

LocaleConfig.locales['kr'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

// 헤더 스타일
const headerStyle = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerTitleStyle: { fontFamily: 'NotoSansKR-Bold', fontSize: 18, color: '#231f20' },
  title: '진료예약',
  headerStyle: {
    shadowColor: 'transparent', // ios 타이틀 그림자 제거
    elevation: 0, // android 타이틀 그림자 제거
  },
  animation: 'slide_from_right',
  animationDuration: 100
};

const getHomeIcon = (type, active) => {
  switch (type) {
    case 'home':
      return active ? require('./assets/icon/ic_nav_home_active.png') : require('./assets/icon/ic_nav_home.png');
    case 'ticket':
      return active ? require('./assets/icon/ic_nav_ticket_active.png') : require('./assets/icon/ic_nav_ticket.png');
    case 'medicalcard':
      return active ? require('./assets/icon/ic_nav_barcode_active.png') : require('./assets/icon/ic_nav_barcode.png');
    case 'reservation':
      return active
        ? require('./assets/icon/ic_nav_calendar_active.png')
        : require('./assets/icon/ic_nav_calendar.png');
    case 'mypage':
      return active ? require('./assets/icon/ic_nav_person_active.png') : require('./assets/icon/ic_nav_person.png');
  }
};

const tabBarButton = (props, icon, label) => (
  <TouchableOpacity {...props} style={styles.tabBarIcon}>
    <Image style={styles.icon} source={getHomeIcon(icon, props.accessibilityState.selected)} />
    <EumcText
      style={[
        styles.tabBarLabel,
        props.accessibilityState.selected ? styles.tabBarLabelActive : styles.tabBarLabelInactive,
      ]}
    >
      {label}
    </EumcText>
  </TouchableOpacity>
);

const defaultBackButton = navigation => () =>
  (
    <TouchableOpacity style={styles.defaultBackButton} onPress={() => navigation.goBack()}>
      <Back />
    </TouchableOpacity>
  );

// 메인 메뉴
const MainTabs = ({ navigation }) => {
  const { medicalCards, currentMedicalCardIndex, setPushKey, appLocked, setToast } = useContext(UserContext);
  const currentMedicalCard = medicalCards && medicalCards[currentMedicalCardIndex];

  const updatePushKey = () => {
    // 푸시 알림 등록
    OneSignal.getDeviceState()
      .then(device => {
        storePush(currentMedicalCard?.patientNumber, device.userId);
        setPushKey(device.userId);
        console.log('PUSH KEY : ' + device.userId);
      })
      .catch(e => console.log(e));
  };

  useEffect(() => {
    updatePushKey();
    if (appLocked === true) navigation.replace('PersonalInformation');
  }, []);

  const bottomTabListener = ({ navigation, route }) => ({
    tabPress: e => {
      if (medicalCards.length === 0) {
        setToast(Object.assign(ERROR_NO_PATIENT, { redirect: () => navigation.navigate('MedicalCardRegTerms') }));
        e.preventDefault();
      }
      if (route?.state?.index > 0) navigation.popToTop();
    },
  });

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: Platform.OS === 'ios' ? 84 : 64 },
        tabBarLabelStyle: { paddingBottom: 16 },
      }}
    >
      <Tab.Screen
        name="MainHome"
        component={Home}
        options={{
          tabBarButton: props => tabBarButton(props, 'home', '홈'),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={Ticket}
        options={{ tabBarButton: props => tabBarButton(props, 'ticket', '번호표발급'), unmountOnBlur: true }}
        listeners={bottomTabListener}
      />
      <Tab.Screen
        name="MedicalCard"
        component={CardTabs}
        options={{
          tabBarButton: props => tabBarButton(props, 'medicalcard', currentMedicalCard?.relationship || '진료카드'),
          unmountOnBlur: true,
        }}
      />
      <Tab.Screen
        name="Reservation"
        component={Reservation}
        options={{ tabBarButton: props => tabBarButton(props, 'reservation', '진료예약'), unmountOnBlur: true }}
        listeners={bottomTabListener}
      />
      <Tab.Screen
        name="MyPageTab"
        component={MyPageTab}
        options={{ tabBarButton: props => tabBarButton(props, 'mypage', '마이페이지'), unmountOnBlur: true }}
        listeners={bottomTabListener}
      />
    </Tab.Navigator>
  );
};

// 진료카드
const CardTabs = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="MedicalCardMain"
      component={MedicalCardMain}
      options={{ headerTitle: '진료카드', headerShown: false, presentation: 'fullScreenModal' }}
    />
  </Stack.Navigator>
);

// 결제카드 뒤로가기를 위한 탭
const PaymentCardTabs = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerBackTitleVisible: false,
      headerLeft: defaultBackButton(navigation),
    })}
  >
    <Stack.Screen
      name="PaymentCardMain"
      component={PaymentCardMain}
      options={Object.assign({}, headerStyle, {
        title: '결제카드관리',
        headerShadowVisible: false,
        headerShown: false,
      })}
    />
    <Stack.Screen
      name="PaymentCardRegTerms"
      component={PaymentCardRegTerms}
      options={Object.assign({}, headerStyle, {
        title: '결제카드관리',
        headerShadowVisible: false,
        headerShown: false,
      })}
    />

    <Stack.Screen
      name="PaymentCardReg"
      component={PaymentCardReg}
      options={Object.assign({}, headerStyle, {
        title: '본인인증',
        headerShadowVisible: false,
        headerShown: false,
      })}
    />

    <Stack.Screen
      name="PaymentCardInfoAdd"
      component={PaymentCardInfoAdd}
      options={Object.assign({}, headerStyle, {
        title: '결제카드관리',
        headerShadowVisible: false,
        headerShown: false,
      })}
    />

    <Stack.Screen
      name="ConfirmScreenPayment"
      component={ConfirmScreen}
      options={Object.assign({}, headerStyle, {
        title: '결제카드관리',
        headerShadowVisible: false,
        headerShown: false,
      })}
    />
  </Stack.Navigator>
);

// 마이페이지
const MyPageTab = () => (
  <MyPageStack.Navigator
    screenOptions={({ navigation }) => ({
      headerBackTitleVisible: false,
      headerLeft: defaultBackButton(navigation),
      unmountOnBlur: true,
    })}
  >
    <MyPageStack.Screen name="MyPage" component={MyPage} options={{ headerShown: false }} />
    <MyPageStack.Screen
      name="ConfirmationOfArrival"
      component={ConfirmationOfArrival}
      options={Object.assign({}, headerStyle, { title: '도착확인', headerShadowVisible: false })}
    />
  </MyPageStack.Navigator>
);

const Reservation = () => (
  <ReservationStack.Navigator
    screenOptions={({ navigation }) => ({
      headerBackTitleVisible: false,
      headerLeft: defaultBackButton(navigation),
    })}
  >
    <ReservationStack.Screen name="ReserveMain" component={ReserveMain} options={{ headerShown: false }} />
    <ReservationStack.Screen
      name="ReserveNoticeSeoul"
      component={ReserveNoticeSeoul}
      options={Object.assign({}, headerStyle, {
        title: '진료 예약 전 안내 유의사항',
        headerShadowVisible: false,
      })}
    />
    <ReservationStack.Screen
      name="ReserveNoticeMokdong"
      component={ReserveNoticeMokdong}
      options={Object.assign({}, headerStyle, {
        title: '진료 예약 전 안내 유의사항',
        headerShadowVisible: false,
      })}
    />
  </ReservationStack.Navigator>
);

// OneSignal Initialization
// OneSignal.setAppId('35fc5199-88d5-45c8-8874-1d25cadce866');
OneSignal.setAppId('a5f70288-e31f-4a3b-8fc6-79e8ebf91293');
// OneSignal.setAppId('197dab30-414f-4b9d-9051-fc1fe327491b');

// promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
OneSignal.promptForPushNotificationsWithUserResponse();

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {});

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />
        <UserContextProvider init={{ code: '' }}>
          <NavigationContainer>
            {/* 스플래시 메뉴 */}
            <Stack.Navigator
              screenOptions={({ navigation }) => ({
                headerShown: false,
                headerBackTitleVisible: false,
                headerLeft: defaultBackButton(navigation),
              })}
            >
              <Stack.Screen name="Splash" component={Splash} />
              <Stack.Screen name="HomeTab" component={MainTabs} />
              <Stack.Screen name="SecurePinScreen" component={SecurePinScreen} options={{ headerShown: true }} />
              <Stack.Screen
                name="ConfirmScreen"
                component={ConfirmScreen}
                options={Object.assign({}, headerStyle, { title: 'ConfirmScreen', headerShadowVisible: false })}
              />
              {/*   options={{ headerShown: true }} */}
              <Stack.Screen
                name="ReserveStep"
                component={ReserveStep}
                options={Object.assign({}, headerStyle, {
                  title: '예약 절차 안내',
                  headerShadowVisible: false,
                })}
              />

              <Stack.Screen
                name="CardDelConfirm"
                component={CardDelConfirm}
                options={Object.assign({}, headerStyle, { title: '카드 삭제 확인', headerShadowVisible: false })}
              />
              <Stack.Screen name="SideMenu" component={SideMenu}  />
              <Stack.Screen
                name="FavoriteMenu"
                component={FavoriteMenu}
                options={Object.assign({}, headerStyle, {
                  title: '자주 이용하는 메뉴',
                  headerShadowVisible: false,
                  headerShown: true,
                })}
              />
              <Stack.Screen
                name="Setting"
                component={Setting}
                options={Object.assign({}, headerStyle, {
                  title: '설정',
                  headerShadowVisible: false,
                  headerShown: true,
                })}
              />
              <Stack.Screen
                name="PersonalInformation"
                component={PersonalInformation}
                options={Object.assign({}, headerStyle, {
                  title: '개인 기본 정보',
                  headerShadowVisible: false,
                  headerShown: true,
                })}
              />
              <Stack.Screen
                name="MobilePayment"
                component={MobilePayment}
                options={Object.assign({}, headerStyle, {
                  title: '모바일 수납',
                  headerShadowVisible: false,
                  headerShown: true,
                })}
              />
              <Stack.Screen
                name="MobilePaymentDetail"
                component={MobilePaymentDetail}
                options={Object.assign({}, headerStyle, {
                  title: '모바일 수납',
                  headerShadowVisible: false,
                  headerShown: true,
                })}
              />
              <Stack.Screen
                name="SmartPayment"
                component={SmartPayment}
                options={Object.assign({}, headerStyle, {
                  title: '모바일 수납',
                  headerShadowVisible: false,
                  headerShown: true,
                })}
              />
              {/* 결제카드 관리 */}
              <Stack.Screen
                name="PaymentCardTab"
                component={PaymentCardTabs}
                options={Object.assign({}, headerStyle, { title: '결제카드관리', headerShadowVisible: false })}
              />
              {/*<Stack.Screen*/}
              {/*  name="KPCPPayment"*/}
              {/*  component={Initial}*/}
              {/*  options={Object.assign({}, headerStyle, { title: '결제', headerShadowVisible: false })}*/}
              {/*/>*/}
              <Stack.Screen
                name="OrderReg"
                component={OrderReg}
                options={Object.assign({}, headerStyle, { title: '결제', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="OrderNormalReg"
                component={OrderNormalReg}
                options={Object.assign({}, headerStyle, { title: '결제', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="OrderKakao"
                component={OrderKakao}
                options={Object.assign({}, headerStyle, { title: '결제', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="KcpAuth"
                component={KcpAuth}
                options={Object.assign({}, headerStyle, { title: '인증', headerShadowVisible: false })}
              />
              {/* 진료카드 등록 */}
              <Stack.Screen
                name="MedicalCardRegTerms"
                component={MedicalCardRegTerms}
                options={Object.assign({}, headerStyle, {
                  title: '진료카드 등록',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="MedicalCardReg"
                component={MedicalCardReg}
                options={Object.assign({}, headerStyle, {
                  title: '진료카드 등록',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="MedicalCardAdd"
                component={MedicalCardAdd}
                options={Object.assign({}, headerStyle, {
                  title: '진료카드 추가 발급',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="MedicalCardList"
                component={MedicalCardList}
                options={Object.assign({}, headerStyle, {
                  title: '진료카드 목록',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="PaymentHistory"
                options={Object.assign({}, headerStyle, { title: '수납 내역 조회', headerShadowVisible: false })}
              >
                {props => <History {...props} type="Payment" />}
              </Stack.Screen>
              <Stack.Screen
                name="PaymentHistoryDetail"
                options={Object.assign({}, headerStyle, { title: '수납 내역 조회', headerShadowVisible: false })}
              >
                {props => <HistoryDetail {...props} type="Payment" />}
              </Stack.Screen>
              <Stack.Screen
                name="TreatmentHistory"
                options={Object.assign({}, headerStyle, { title: '진료 내역 조회', headerShadowVisible: false })}
              >
                {props => <History {...props} type="Treatment" />}
              </Stack.Screen>
              <Stack.Screen
                name="TreatmentHistoryDetail"
                options={Object.assign({}, headerStyle, { title: '진료 내역 조회', headerShadowVisible: false })}
              >
                {props => <HistoryDetail {...props} type="Treatment" />}
              </Stack.Screen>
              <Stack.Screen
                name="DiagnosisHistory"
                options={Object.assign({}, headerStyle, { title: '검사 내역 조회', headerShadowVisible: false })}
              >
                {props => <History {...props} type="Diagnosis" />}
              </Stack.Screen>
              <Stack.Screen
                name="DiagnosisHistoryDetail"
                options={Object.assign({}, headerStyle, { title: '검사 내역 조회', headerShadowVisible: false })}
              >
                {props => <HistoryDetail {...props} type="Diagnosis" />}
              </Stack.Screen>
              <Stack.Screen
                name="ExamDetail"
                options={Object.assign({}, headerStyle, { title: '검사 내역 조회', headerShadowVisible: false })}
                component={ExamDetail}
              />
              <Stack.Screen
                name="PrescriptionHistory"
                options={Object.assign({}, headerStyle, { title: '약 처방 조회', headerShadowVisible: false })}
              >
                {props => <History {...props} type="Prescription" />}
              </Stack.Screen>
              <Stack.Screen
                name="PrescriptionHistoryDetail"
                options={Object.assign({}, headerStyle, { title: '약 처방 조회', headerShadowVisible: false })}
              >
                {props => <HistoryDetail {...props} type="Prescription" />}
              </Stack.Screen>
              <Stack.Screen
                name="MedicationGuideDetails"
                component={MedicationGuideDetails}
                options={Object.assign({}, headerStyle, {
                  title: '복약 안내',
                  headerShadowVisible: false,
                })}
              />

              <Stack.Screen
                name="Proof"
                component={ProofNew}
                options={Object.assign({}, headerStyle, { title: '증명서 신청', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="ProofCalendarSelect"
                component={ProofCalendarSelect}
                options={Object.assign({}, headerStyle, { title: '증명서 신청', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="ProofSelect"
                component={ProofSelect}
                options={Object.assign({}, headerStyle, { title: '증명서 신청', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="PaymentCardReg"
                component={PaymentCardReg}
                options={Object.assign({}, headerStyle, {
                  title: '본인인증',
                  // headerShadowVisible: false,
                  // headerShown: false,
                })}
              />

              <Stack.Screen
                name="ProofPayment"
                component={ProofPayment}
                options={Object.assign({}, headerStyle, { title: '증명서 신청', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="ReservationOther"
                component={ReservationOther}
                options={Object.assign({}, headerStyle, { title: '본인 외 예약', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="SelectDepartment"
                component={SelectDepartment}
                options={Object.assign({}, headerStyle, { headerShadowVisible: false })}
              />
              <Stack.Screen
                name="SelectDoctor"
                component={SelectDoctor}
                options={Object.assign({}, headerStyle, { headerShadowVisible: false })}
              />
              <Stack.Screen
                name="SelectDate"
                component={SelectDate}
                options={Object.assign({}, headerStyle, { headerShadowVisible: false })}
              />
              <Stack.Screen
                name="SelectTime"
                component={SelectTime}
                options={Object.assign({}, headerStyle, { headerShadowVisible: false })}
              />
              <Stack.Screen
                name="ReserveSuccess"
                component={ReserveSuccess}
                options={Object.assign({}, headerStyle, {
                  headerShadowVisible: false,
                  headerBackVisible: false,
                  headerLeft: () => null,
                })}
              />

              <Stack.Screen
                name="CardServiceTerms"
                component={ServiceTerms}
                options={Object.assign({}, headerStyle, {
                  title: '서비스 이용약관',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="PersonalInfoTerms"
                component={PersonalInfoTerms}
                options={Object.assign({}, headerStyle, {
                  title: '서비스 이용약관',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="UniqueInfoTerms"
                component={UniqueInfoTerms}
                options={Object.assign({}, headerStyle, {
                  title: '서비스 이용약관',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="PhoneIdentificationTerms"
                component={PhoneIdentificationTerms}
                options={Object.assign({}, headerStyle, {
                  title: '서비스 이용약관',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="MedicalServiceTerms"
                component={ServiceTerms}
                options={Object.assign({}, headerStyle, { title: '서비스 이용약관', headerShadowVisible: false })}
              />
              <Stack.Screen
                name="MbExamineTerms"
                component={MbExamineTerms}
                options={Object.assign({}, headerStyle, {
                  title: '모바일 진찰권 이용약관 동의',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="WebViewPage"
                component={WebViewPage}
                options={Object.assign({}, headerStyle, {
                  title: '찾아오시는 길',
                })}
              />
              <Stack.Screen
                name="ProxyPayment"
                component={ProxyPayment}
                options={Object.assign({}, headerStyle, {
                  title: '대리결제 대상 환자 조회',
                  headerShadowVisible: false,
                })}
              />
              <Stack.Screen
                name="ConfirmationOfArrival"
                component={ConfirmationOfArrival}
                options={Object.assign({}, headerStyle, { title: '도착확인', headerShadowVisible: false })}
              />
              <Stack.Screen name="ConfirmScreenTab" component={ConfirmScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
            <Loading />
          </NavigationContainer>
        </UserContextProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
