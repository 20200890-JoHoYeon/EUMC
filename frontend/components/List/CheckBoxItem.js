import { StyleSheet, View, Pressable, Image } from 'react-native';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    position: 'relative',
  },
  checkbox: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  checkboxLabel: {
    paddingLeft: 5,
    alignSelf: 'center',
    color: Color.myPageColor.darkGray,
    lineHeight: 33,
  },
  arrowArea: {
    width: 24,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    height: '100%',
  },
  arrow: {
    width: 24,
    height: 24,
    marginVertical: 5,
  },
  marginEmpty: {
    marginHorizontal: 0,
    marginVertical: 0,
  },
  smallCheckbox: {
    width: 25,
    height: 25,
  },
  ...Typography,
});

const images = {
  chkOn: require('../../assets/chk_green_on.png'),
  chkOff: require('../../assets/chk_off.png'),
};

const CheckBoxItem = ({
  title,
  checked,
  onCheckPress,
  onArrowPress,
  hideArrow,
  marginEmpty,
  titleStyle,
  checkBoxSize,
}) => {
  return (
    <View style={[styles.container, marginEmpty === 0 ? styles.marginEmpty : '']}>
      <Pressable onPress={onCheckPress} style={{ flexDirection: 'row' }}>
        <Image
          style={[styles.checkbox, checkBoxSize === 'small' ? styles.smallCheckbox : '']}
          source={checked ? images.chkOn : images.chkOff}
        />
        <EumcText
          style={[
            styles.checkboxLabel,
            titleStyle === 'right' ? styles.smallMedium : styles.smallBold,
            titleStyle === 'right' ? '' : { flex: 1, color: '#333', fontSize: 14 },
          ]}
        >
          {title}
        </EumcText>
      </Pressable>
      {!hideArrow && (
        <Pressable style={styles.arrowArea} onPress={onArrowPress}>
          <Image style={styles.arrow} source={require('../../assets/icon/ic_dtl_arrow_right.png')} />
        </Pressable>
      )}
    </View>
  );
};

export default CheckBoxItem;
