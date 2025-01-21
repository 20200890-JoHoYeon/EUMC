import { StyleSheet, SafeAreaView } from 'react-native';
import { TopBarSimple } from '../../components';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReserveSeoul from './ReserveSeoul';
import ReserveMokdong from './ReserveMokdong';
import { useContext, useState } from 'react';
import { UserContext } from '../../context';
import ReserveCheck from './ReserveCheck';

const styles = StyleSheet.create({ container: { flex: 1 } });
const Tab = createMaterialTopTabNavigator();

const ReserveMain = ({ navigation }) => {
  const { code } = useContext(UserContext);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TopBarSimple title="진료예약" navigation={navigation} />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 16,
            lineHeight: 24,
            fontFamily: 'NotoSansKR-Bold',
          },
          tabBarIndicatorStyle: {
            height: 2,
            backgroundColor: '#16aea6',
          },
        }}
        backBehavior="none"
      >
        <Tab.Screen name="예약">
          {props =>
            code === '01' ? (
              <ReserveSeoul {...props} navigation={navigation} />
            ) : (
              <ReserveMokdong {...props} navigation={navigation} />
            )
          }
        </Tab.Screen>
        <Tab.Screen name="예약 확인/취소">
          {props => (
            <ReserveCheck
              {...props}
              navigation={navigation}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default ReserveMain;
