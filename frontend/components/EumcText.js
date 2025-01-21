import { StyleSheet, Text } from 'react-native';
import { Color } from '../styles';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'NotoSansKR-Medium',
    color: Color.homeColor.primaryBlack,
  },
  bold: {
    fontFamily: 'NotoSansKR-Bold',
    color: Color.homeColor.primaryBlack,
  },
  black: {
    fontFamily: 'NotoSansKR-Black',
    color: Color.homeColor.primaryBlack,
  },
  regular: {
    fontFamily: 'NotoSansKR-Regular',
    color: Color.homeColor.primaryBlack,
  },
});

const EumcText = ({ children, style, fontWeight, textEclipse }) => (
  <Text
    numberOfLines={textEclipse}
    style={[['bold', 'black', 'regular'].includes(fontWeight) ? styles[fontWeight] : styles.text, style]}
  >
    {children}
  </Text>
);

export default EumcText;
