import { StyleSheet, TouchableOpacity } from 'react-native';
import { Color } from '../../styles';
import { RoundBorderBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    ...RoundBorderBtnStyle,
    borderRadius: 10,
    borderColor: '#bcbec0',
    backgroundColor: Color.homeColor.primaryWhite,
  },
});

const RoundBorderInnerBtn = ({ onPress, style, children }) => {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default RoundBorderInnerBtn;
