import { useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard, Platform } from 'react-native';
import { ShadowedView, shadowStyle } from 'react-native-fast-shadow';
import { Color } from '../../styles';
import { homeColor } from '../../styles/colors';
import RoundBorderBtn from './RoundBorderBtn';
import RoundBtn from './RoundBtn';

const layoutPadding = 16;
const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: Color.homeColor.primaryWhite,
    shadowColor: homeColor.primaryBlack,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -2 },
    elevation: 40,
    padding: layoutPadding,
  },
  btnLeft: {
    flex: 1,
    height: 48,
    marginRight: 4,
  },
  btnRight: {
    flex: 1,
    height: 48,
    marginLeft: 4,
  },
  darkGreen: {
    color: Color.homeColor.primaryWhite,
  },
});

const BottomTwoBtn = ({ onCancel, leftTitle, rightTitle, onNext, rightDisabled, rightStyle }) => {
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
    <ShadowedView style={shadowStyle({ opacity: 0.15, radius: 6, offset: [0, -3] })}>
      <View style={[styles.footer, Platform.OS === 'ios' && marginBottom]}>
        <RoundBorderBtn style={styles.btnLeft} title={leftTitle} onPress={onCancel} />
        <RoundBtn disabled={rightDisabled} style={[styles.btnRight, rightStyle]} onPress={onNext} title={rightTitle} />
      </View>
    </ShadowedView>
  );
};
export default BottomTwoBtn;
