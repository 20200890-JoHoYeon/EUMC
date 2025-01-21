import { useLayoutEffect } from 'react';
import { WebView } from 'react-native-webview';

const WebViewPage = ({ navigation, route }) => {
  const { title, link } = route.params;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { fontFamily: 'NotoSansKR-Bold', fontSize: 18, color: '#231f20' },
      title: title,
      headerShown: true,
      headerTitleAlign: 'center',
      headerShadowVisible: false,
    });
  }, [navigation]);

  return <WebView source={{ uri: link }} />;
};

export default WebViewPage;
