import { Pressable, StyleSheet, View, Image } from 'react-native';
// import { UserContext } from '../context';
// import { useContext } from 'react';
import Hamburger from '../assets/icon/hamburger';

const styles = StyleSheet.create({
  rightMenu: {
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
  },
  /*
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    fontSize: 12,
  },
  */
});

const Notification = ({ navigation }) => {
  // const { notifications } = useContext(UserContext);
  return (
    <View style={styles.rightMenu}>
      {/* <Pressable style={{ position: 'relative' }} onPress={() => navigation.navigate('Notification')}>
        <Image style={styles.iconImg} source={require('../assets/icon/ic_basic_alarm.png')} />
        {notifications.length > 0 && <Text>{notifications.length}</Text>}
      </Pressable> */}
      <Pressable onPress={() => navigation.navigate('SideMenu')}>
        <Hamburger />
      </Pressable>
    </View>
  );
};

export default Notification;
