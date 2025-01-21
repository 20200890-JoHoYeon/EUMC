import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';
import { RoundBorderBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    ...RoundBorderBtnStyle,
    borderColor: Color.homeColor.primaryTurquoise,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  midMenuText: {
    ...Typography.buttonTypo.regularBold,
    color: Color.homeColor.primaryTurquoise,
    fontSize: 16,
    letterSpacing: -0.96,
  },
});

const RoundBorderGreenBtn = ({ title, onPress, style, titleStyle }) => {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <EumcText style={[styles.midMenuText, titleStyle]} fontWeight="bold">
        {title}
      </EumcText>
    </TouchableOpacity>
  );
};

RoundBorderGreenBtn.prototype = {
  title: PropTypes.string.isRequired,
};

export default RoundBorderGreenBtn;
