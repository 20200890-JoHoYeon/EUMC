import { StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';
import { RoundBtnStyle } from '../../styles/button';

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  btnRoundType: {
    ...RoundBtnStyle,
  },
  calendarBtnType: {
    paddingVertical: 8,
    borderRadius: 4,
  },
  midMenuWhiteText: {
    ...Typography.buttonTypo.regularBold,
    color: Color.homeColor.primaryWhite,
  },
  backgroundGrayColor: {
    backgroundColor: '#ddd',
  },
  fontMedium: {
    fontFamily: 'NotoSansKR-Medium',
    fontSize: 14,
  },
});

const RoundBtn = ({ title, onPress, style, titleStyle, disabled, fontWeight, buttonType }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.btn,
        style,
        disabled === true ? styles.backgroundGrayColor : '',
        buttonType === 'calendar' ? styles.calendarBtnType : styles.btnRoundType,
      ]}
      onPress={onPress}
    >
      <EumcText style={[styles.midMenuWhiteText, titleStyle, fontWeight === 'Medium' ? styles.fontMedium : '']}>
        {title}
      </EumcText>
    </TouchableOpacity>
  );
};

RoundBtn.prototype = {
  title: PropTypes.string.isRequired,
};

export default RoundBtn;
