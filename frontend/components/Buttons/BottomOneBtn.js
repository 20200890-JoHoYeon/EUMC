import { useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard, Platform } from 'react-native';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';
import { Color } from '../../styles';
import RoundBtn from './RoundBtn';

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: Color.homeColor.primaryWhite,
    padding: 16,
  },
  btnRight: {
    flex: 1,
  },
});

const BottomOneBtn = ({ rightTitle, onNext, disabled, style, buttonStyle, titleStyle }) => {
  const [marginBottom, setMarginBottom] = useState(0);

  // ios 하단 버튼 위치 수정을 위한 키보드 켜짐/꺼짐 리스너
  Platform.OS === 'ios' &&
    useEffect(() => {
      const keyboardListener1 = Keyboard.addListener('keyboardDidShow', e =>
        setMarginBottom({ marginBottom: e.endCoordinates.height })
      );
      const keyboardListener2 = Keyboard.addListener('keyboardDidHide', () => setMarginBottom({ marginBottom: 0 }));
      return () => {
        keyboardListener1.remove();
        keyboardListener2.remove();
      };
    }, []);

  return (
    <ShadowedView style={[{ width: '100%' }, shadowStyle({ opacity: 0.15, radius: 6, offset: [0, -3] })]}>
      <View style={[styles.footer, style, Platform.OS === 'ios' && marginBottom]}>
        <RoundBtn
          titleStyle={titleStyle}
          style={[styles.btnRight, buttonStyle]}
          onPress={onNext}
          title={rightTitle}
          disabled={disabled}
        />
      </View>
    </ShadowedView>
  );
};
export default BottomOneBtn;
