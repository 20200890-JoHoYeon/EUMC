import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Switch, View, Pressable, ScrollView, Platform } from 'react-native';
import { UserContext } from '../../context';
import { selectMenus as initialSelectMenu, unselectMenus as initialUnselectMenu } from '../../constants';
import { EumcText } from '../../components';
import { version } from '../../package.json';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import OneSignal from 'react-native-onesignal';
import { LOGOUT } from '../../popup-templates';

const inAppUpdates = new SpInAppUpdates(true);

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  greenBtnContainer: {
    padding: 10,
    marginTop: 20,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  whiteInput: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#bcbec0',
    padding: 10,
    fontSize: 13,
    height: 40,
    marginHorizontal: 10,
    marginTop: 5,
  },
  userForm: {
    marginBottom: 40,
  },
  userFormAsked: {
    fontSize: 16,
    color: '#231f20',
    // marginRight: 20,
    paddingBottom: 16,
  },
  explanationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 16,
  },
  pdt16: {
    paddingTop: 16,
  },
  userFormExplanation: {
    fontSize: 14,
    color: '#333333',
  },
  updateButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  updateText: {
    color: '#000',
  },
  etcExplanation: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 2,
  },

  //Modal
  line32: {
    lineHeight: 32,
  },
  line20: {
    lineHeight: 20,
  },
  updtText: {
    fontSize: 14,
    color: '#333',
  },
});

const Setting = ({ navigation }) => {
  const {
    setSelectMenus,
    setUnselectMenus,
    setCardLists,
    setMedicalCards,
    setCurrentMedicalCardIndex,
    setEasyPin,
    setReservations,
    appLocked,
    setAppLocked,
    setToast,
    switchNotifications,
    setSwitchNotifications,
  } = useContext(UserContext);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (appLocked === true)
      setToast({ type: 'error', text1: '앱을 사용할 수 없음', text2: '비밀번호 오류 횟수 초과로\n앱이 잠겼습니다.' });
    // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    inAppUpdates.checkNeedsUpdate({ curVersion: version }).then(result => {
      if (result.shouldUpdate) setUpdateAvailable(true);
    });
  }, []);

  const toggleSwitch = () => {
    setSwitchNotifications(switchNotifications => {
      if (!switchNotifications) OneSignal.promptForPushNotificationsWithUserResponse();
      else OneSignal.disablePush(switchNotifications);
      return !switchNotifications;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.userForm}>
          <EumcText style={[styles.userFormAsked, styles.line32]} fontWeight="bold">
            푸시 알림
          </EumcText>
          <View style={styles.explanationContainer}>
            <EumcText style={[styles.userFormExplanation, styles.line20]}>알림 푸시 이용</EumcText>
            <Switch
              trackColor={{ false: '#ddd', true: '#16aea6' }}
              thumbColor={'#fff'}
              ios_backgroundColor="#ddd"
              onValueChange={toggleSwitch}
              value={switchNotifications}
              style={styles.switchSize}
            />
          </View>
        </View>
        <View style={styles.userForm}>
          <EumcText style={[styles.userFormAsked, styles.line32]} fontWeight="bold">
            결제 수단 관리
          </EumcText>
          <Pressable style={styles.explanationContainer} onPress={() => navigation.navigate('PaymentCardTab')}>
            <EumcText style={[styles.userFormExplanation, styles.line20]}>결제 카드 관리</EumcText>
          </Pressable>
        </View>
        <View style={styles.userForm}>
          <EumcText style={[styles.userFormAsked, styles.line32]} fontWeight="bold">
            개인 기본 정보
          </EumcText>
          <Pressable style={styles.explanationContainer} onPress={() => navigation.navigate('PersonalInformation')}>
            <EumcText style={[styles.userFormExplanation, styles.line20]}>개인 기본 정보</EumcText>
          </Pressable>

          <Pressable
            style={[styles.explanationContainer, styles.pdt16]}
            onPress={() =>
              setToast(
                Object.assign(LOGOUT, {
                  onConfirm: () => {
                    setSelectMenus(initialSelectMenu);
                    setUnselectMenus(initialUnselectMenu);
                    setCardLists([]);
                    setMedicalCards([]);
                    setCurrentMedicalCardIndex(0);
                    setEasyPin();
                    setReservations([]);
                    setAppLocked(false);
                  },
                  redirect: () => navigation.navigate('MainHome'),
                })
              )
            }
          >
            <EumcText style={[styles.userFormExplanation, styles.line20]}>로그아웃</EumcText>
          </Pressable>
        </View>
        <View style={styles.userForm}>
          <EumcText style={[styles.userFormAsked, styles.line32]} fontWeight="bold">
            기타
          </EumcText>
          <View style={styles.explanationContainer}>
            <View>
              <EumcText style={[styles.userFormExplanation, styles.line20]}>앱 버전 정보 ({version})</EumcText>
              {!updateAvailable && (
                <EumcText style={[styles.etcExplanation, styles.line20]}>최신 버전을 사용 중입니다.</EumcText>
              )}
            </View>
            {/* https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78 */}
            {updateAvailable && (
              <Pressable
                style={styles.updateButton}
                onPress={() =>
                  inAppUpdates.startUpdate(Platform.OS === 'android' ? { updateType: IAUUpdateKind.FLEXIBLE } : {})
                }
              >
                <EumcText style={[styles.line20, styles.updtText]}>업데이트</EumcText>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Setting;
