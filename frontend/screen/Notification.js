import { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EumcText } from '../components';

import { UserContext } from '../context/UserContext';

const styles = StyleSheet.create({
  emptyNotifications: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  notificationIcon: {
    fontSize: 128,
    opacity: 0.3,
    marginBottom: 20,
  },
});

const Notification = () => {
  const { notifications } = useContext(UserContext);
  return notifications.length > 0 ? (
    <View>
      <EumcText>알림</EumcText>
    </View>
  ) : (
    <View style={styles.emptyNotifications}>
      <Icon name="alert-circle-outline" style={styles.notificationIcon} />
      <EumcText>알림 내역이 없습니다.</EumcText>
    </View>
  );
};
export default Notification;
