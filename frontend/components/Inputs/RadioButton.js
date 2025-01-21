import { Pressable, StyleSheet, View } from 'react-native';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  radioWrap: {
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'solid',
    marginVertical: 14,
    padding: 3,
    width: 20,
    height: 20,
    borderColor: Color.homeColor.primaryDarkgreen2,
  },
  radioWhiteWrap: {
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: 'solid',
    //marginVertical: 14,
    padding: 3,
    width: 20,
    height: 20,
    borderColor: Color.homeColor.primaryWhite,
  },
  radioBorderGray: {
    borderColor: Color.inputColor.gray,
  },
  radioCheckColor: {
    borderRadius: 50,
    flex: 1,
    backgroundColor: Color.homeColor.primaryDarkgreen2,
  },
  radioCheckWhiteColor: {
    borderRadius: 50,
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  radioLabel: {
    paddingLeft: 10,
    color: Color.myPageColor.darkGray,
    width: 80,
    alignSelf: 'center',
  },
  labelWidth: {
    width: '100%',
  },

  ...Typography,
});

const RadioButton = ({ label, checked, onPress, type, widthType, radioStyle, textStyle }) => {
  const borderStyle = checked ? '' : styles.radioBorderGray;
  const widthStyle = widthType === 'fullWidth' ? styles.labelWidth : '';

  const borderType = type => {
    if (type === 'radioListItem') {
      if (checked) {
        return <View style={styles.radioCheckWhiteColor} />;
      }
    } else {
      if (checked) {
        return <View style={styles.radioCheckColor} />;
      }
    }
  };

  return (
    <Pressable style={styles.rowContainer} onPress={onPress}>
      <View style={[type === 'radioListItem' ? styles.radioWhiteWrap : styles.radioWrap, borderStyle, radioStyle]}>
        {borderType(type)}
      </View>
      <EumcText style={[styles.radioLabel, styles.smallXXBold, widthStyle, textStyle]}>{label}</EumcText>
    </Pressable>
  );
};

export default RadioButton;
