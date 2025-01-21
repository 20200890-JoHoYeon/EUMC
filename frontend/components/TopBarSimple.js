import { StyleSheet, View, Pressable } from 'react-native';
// import Notification from './Notification';
import EumcText from './EumcText';
import Hamburger from '../assets/icon/hamburger';
const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    position: 'relative',
    backgroundColor: '#fff',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
  },
  notification: {
    flex: 0,
  },
  menuIcon: {
    position: 'absolute',
    right: 16,
  },
});

const TopBarSimple = ({ navigation, title }) => {
  return (
    <View style={styles.container}>
      <EumcText style={styles.title} fontWeight="bold">
        {title}
      </EumcText>
      <Pressable style={styles.menuIcon} onPress={() => navigation.navigate('SideMenu')}>
        <Hamburger />
      </Pressable>
      {/*<Notification style={styles.notification} navigation={navigation} />*/}
    </View>
  );
};

export default TopBarSimple;
