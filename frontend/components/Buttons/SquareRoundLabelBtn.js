import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';
import { SquareRoundLabelBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Color.homeColor.primaryGray,
    alignSelf: 'flex-end',
    ...SquareRoundLabelBtnStyle,
  },
  midMenuWhiteText: {
    ...Typography.buttonTypo.labelBtn,
    color: Color.homeColor.primaryWhite,
    paddingHorizontal: 6,
    lineHeight: 13,
  },
});

const SquareRoundLabelBtn = ({ title, onPress, style, titleStyle }) => {
  return (
    <Pressable style={[styles.btn, style]} onPress={onPress}>
      <EumcText style={[styles.midMenuWhiteText, titleStyle]}>{title}</EumcText>
    </Pressable>
  );
};

SquareRoundLabelBtn.prototype = {
  title: PropTypes.string.isRequired,
};

export default SquareRoundLabelBtn;
