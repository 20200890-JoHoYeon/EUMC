import { StyleSheet, View, Pressable } from 'react-native';
import { useContext, useEffect } from 'react';
import OneSignal from 'react-native-onesignal';
import { EumcText } from '../components';
import { UserContext } from '../context';
import EumcLogo from '../assets/hi_eumc';
import EumcSeoul from '../assets/hi_eumc_seoul';
import EumcMokdong from '../assets/hi_eumc_mokdong';
import { version } from '../package.json';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingTop: 50,
  },
  header: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'scale(1.1)',
  },
  btnContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnSeoul: {
    width: '90%',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#16AEA6',
    marginBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 74,
    paddingBottom: 14,
    shadowRadius: 4,
    elevation: 5,
  },
  btnMokdong: {
    width: '90%',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#00583F',
    paddingTop: 20,
    paddingHorizontal: 74,
    paddingBottom: 14,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    height: 20,
    fontSize: 9,
    textAlign: 'center',
    color: '#999',
    marginHorizontal: 30,
    marginBottom: 16,
  },
  version: {
    position: 'absolute',
    bottom: 0,
    color: '#ddd',
    fontSize: 8,
  },
});

const Splash = ({ navigation }) => {
  const { setCode, appLocked, setSwitchNotifications } = useContext(UserContext);
  const navigateHome = (navigation, code) => {
    setCode(code);
    navigation.replace('HomeTab');
  };

  useEffect(() => {
    if (appLocked === true) navigation.replace('PersonalInformation');
    OneSignal.promptForPushNotificationsWithUserResponse(res => setSwitchNotifications(res));
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <EumcLogo />
      </View>
      <View style={styles.btnContainer}>
        <Pressable style={styles.btnSeoul} onPress={() => navigateHome(navigation, '01')}>
          <EumcSeoul />
        </Pressable>
        <Pressable style={styles.btnMokdong} onPress={() => navigateHome(navigation, '02')}>
          <EumcMokdong />
        </Pressable>
      </View>
      <EumcText style={styles.version}>v.{version}</EumcText>
      <EumcText style={styles.text}>
        Copyright 2022 by ehwa womans university medical center. all rights reserved.
      </EumcText>
    </View>
  );
};

export default Splash;
