import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';
import { RoundBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    ...RoundBtnStyle,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  midMenuBlackText: {
    ...Typography.smallXXBoldCenter,
  },
});

const RoundWhiteBtn = ({ title, onPress, style }) => (
  <Pressable style={[styles.btn, style]} onPress={onPress}>
    <EumcText style={styles.midMenuBlackText}>{title}</EumcText>
  </Pressable>
);

RoundWhiteBtn.prototype = {
  title: PropTypes.string.isRequired,
};

export default RoundWhiteBtn;
