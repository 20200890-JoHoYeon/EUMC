import { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
// import Toast from 'react-native-toast-message';
import { OneBtnModal, TwoBtnModal } from './Modals';
import { UserContext } from '../context';
// import { TOAST_TEMPLATE_CONFIG } from '../utils';
import EumcText from './EumcText';
import { Color, Typography } from '../styles';
import { useNavigation } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';

const styles = StyleSheet.create({
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 25,
  },
  modalContentText2: {
    color: Color.homeColor.primaryDarkPurple,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 11,
    lineHeight: 26,
  },
});

const Loading = () => {
  const { loadingVisible, toast, setToast } = useContext(UserContext);
  const [popupVisible, setPopupVisible] = useState(false);

  const navigation = useNavigation();

  const showPopup = () => {
    const { type, title, children, onConfirm, redirect, text1, text2, text3, cancelText, confirmText, redirectCancel } =
      toast;
    switch (type) {
      case 'ok':
        return (
          <OneBtnModal
            visible={popupVisible}
            onConfirm={() => {
              setPopupVisible(false);
              onConfirm && onConfirm();
              redirect && redirect();
              setToast();
            }}
            title={title}
          >
            {children}
          </OneBtnModal>
        );
      case 'okCancel':
        return (
          <TwoBtnModal
            visible={popupVisible}
            cancelText={cancelText || '취소'}
            confirmText={confirmText || '확인'}
            onCancel={() => {
              setPopupVisible(false);
              redirectCancel && redirectCancel();
              setToast();
            }}
            onConfirm={() => {
              setPopupVisible(false);
              onConfirm && onConfirm();
              redirect && redirect();
              setToast();
            }}
            title={title}
          >
            {children}
          </TwoBtnModal>
        );
      default:
        return (
          <OneBtnModal
            visible={popupVisible}
            onConfirm={() => {
              setPopupVisible(false);
              onConfirm && onConfirm();
              redirect && redirect();
              setToast();
            }}
            title={text1}
          >
            <EumcText style={[styles.modalContentText, Typography.medium]}>{text2}</EumcText>
            {text3 && <EumcText style={[styles.modalContentText2, Typography.medium]}>{text3}</EumcText>}
          </OneBtnModal>
        );
    }
  };

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    const notification = notificationReceivedEvent.getNotification();
    console.log(notification);
    const msg = notification.body;
    setToast({
      type: 'error',
      text1: '알림',
      text2: msg,
      redirect: () => navigation.navigate('Ticket'),
    });

    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  useEffect(() => {
    if (toast && !popupVisible) {
      // 토스트는 팝업으로 대체합니다.
      // Toast.show(toast);
      setPopupVisible(true);
    }
  }, [toast]);

  return (
    <>
      {toast && showPopup(toast)}
      {/* 토스트는 앱 마지막 부분에 위치해야함 (https://github.com/calintamas/react-native-toast-message/blob/HEAD/docs/navigation-usage.md) */}
      {/* <Toast config={TOAST_TEMPLATE_CONFIG} /> */}
      {loadingVisible && <Spinner visible={loadingVisible} overlayColor="rgba(0,0,0,.85)" size="large" />}
    </>
  );
};

export default Loading;
