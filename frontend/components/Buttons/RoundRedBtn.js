import { Pressable, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import EumcText from '../EumcText';
import { Typography } from '../../styles';
import { homeColor } from '../../styles/colors';
import { RoundBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    ...RoundBtnStyle,
    backgroundColor: homeColor.primaryRed,
  },
  midMenuWhiteText: {
    ...Typography.smallXXBoldCenter,
  },
});

const RoundWhiteBtn = ({ title, onPress, style }) => {
  return (
    <Pressable style={[styles.btn, style]} onPress={onPress}>
      <EumcText style={styles.midMenuWhiteText}>{title}</EumcText>
    </Pressable>
  );
};

RoundWhiteBtn.prototype = {
  title: PropTypes.string.isRequired,
};

export default RoundWhiteBtn;
