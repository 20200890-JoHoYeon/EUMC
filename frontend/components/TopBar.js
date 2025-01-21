import { StyleSheet, View, Pressable } from 'react-native';
import Notification from './Notification';
import SelectHospital from './SelectHospital';
import { Color } from '../styles';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    backgroundColor: Color.homeColor.primaryWhite,
    marginHorizontal: 16,
  },
});

const TopBar = ({ navigation, showSetting = false }) => {
  return (
    <View style={styles.container}>
      <SelectHospital />
      {showSetting ? (
        <Pressable onPress={() => navigation.navigate('Setting')} >
          <Icon name="settings" style={{ fontSize: 24, color: '#000' }} />
        </Pressable>
      ) : (
        <Notification navigation={navigation} />
      )}
    </View>
  );
};

export default TopBar;
