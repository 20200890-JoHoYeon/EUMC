import { StyleSheet, View, ImageBackground, Pressable } from 'react-native';
import EumcText from '../EumcText';
import { Color, Typography } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  titleArea: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    paddingLeft: 8,
  },
  menuIconArea: {
    width: 24,
    height: 24,
  },
  menuIcon: {
    width: '100%',
    flex: 1,
  },
  colorBlack: {
    color: Color.homeColor.primaryBlack,
  },
  ...Typography,
});

const MenuItem = props => {
  return (
    <Pressable style={styles.container} onPress={props.nav}>
      <View style={styles.titleArea}>
        <View style={styles.menuIconArea}>
          <ImageBackground style={styles.menuIcon} source={props.img} />
        </View>
        <EumcText style={[styles.small, styles.title, styles.colorBlack]}>{props.title}</EumcText>
      </View>
      <View style={styles.menuIconArea}>
        <ImageBackground source={require('../../assets/ico_arrow_right.png')} style={styles.menuIcon} />
      </View>
    </Pressable>
  );
};

export default MenuItem;
