import { StyleSheet, TouchableOpacity } from 'react-native';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';
import { RoundLabelBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Color.homeColor.primaryGray,
    ...RoundLabelBtnStyle,
  },
  midMenuWhiteText: {
    ...Typography.buttonTypo.labelBtn,
    color: Color.homeColor.primaryWhite,
    lineHeight: 13,
  },
});

const RoundLabelBtn = ({ title, onPress, style, titleStyle }) => {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <EumcText style={[styles.midMenuWhiteText, titleStyle]}>{title}</EumcText>
    </TouchableOpacity>
  );
};

export default RoundLabelBtn;
