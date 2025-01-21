import { StyleSheet, Pressable, View, Image } from 'react-native';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';

const styles = StyleSheet.create({
  menuContainer: {
    width: 60,
    marginRight: 16,
    justifyContent: 'center',
  },
  menuBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 4 },
    ...Color.shadowColor.menuBox,
  },
  regImg: {
    width: 36,
    height: 36,
    alignSelf: 'center',
  },
  contentText: {
    color: Color.homeColor.primaryBlack,
    textAlign: 'center',
    lineHeight: 20,
  },
  ...Typography,
});

const MenuBoxItem = ({ content, onPress }) => {
  let textStyle = styles.smallXX;
  if (content.text.length > 6) {
    textStyle = styles.smallX;
  }
  return (
    <Pressable style={styles.menuContainer} onPress={onPress}>
      <View style={[styles.menuBox]}>
        <Image style={styles.regImg} source={content.img} />
      </View>
      <EumcText style={[textStyle, styles.contentText]}>{content.text}</EumcText>
    </Pressable>
  );
};
export default MenuBoxItem;
