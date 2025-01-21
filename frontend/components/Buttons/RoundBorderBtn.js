import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';
import { RoundBorderBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    ...RoundBorderBtnStyle,
    borderColor: Color.homeColor.primaryGray,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  midMenuText: {
    ...Typography.buttonTypo.regularBold,
    //...Typography.smallXXBoldCenter,
    color: Color.homeColor.primaryGray,
    // letterSpacing: -0.96,
  },
});

const RoundBorderBtn = ({ title, onPress, style, titleStyle }) => {
  return (
    <TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
      <EumcText style={[styles.midMenuText, titleStyle]} fontWeight="bold">
        {title}
      </EumcText>
    </TouchableOpacity>
  );
};

RoundBorderBtn.prototype = {
  title: PropTypes.string.isRequired,
};

export default RoundBorderBtn;
