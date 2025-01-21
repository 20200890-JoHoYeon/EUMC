import { useContext } from 'react';
import { WebView } from 'react-native-webview';
import { UserContext } from '../../context';

const ReserveStep = () => {
  const { code } = useContext(UserContext);
  return (
    <WebView
      source={{
        uri:
          code === '01'
            ? 'https://seoul.eumc.ac.kr/guide/reservationInfo.do'
            : 'https://mokdong.eumc.ac.kr/guide/reservationInfo.do',
      }}
    />
  );
};

export default ReserveStep;
