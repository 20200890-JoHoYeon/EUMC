import { Dimensions, StyleSheet, View, Modal, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  centeredView: {
    margin: 16,
    borderRadius: 20,
    transform: 'rotate(90deg)',
    width: windowHeight - 32,
    height: windowWidth - 32,
    backgroundColor: '#fff',
    position: 'absolute',
    left: windowWidth / 2 - windowHeight / 2,
    top: windowHeight / 2 - windowWidth / 2,
  },
  buttonClose: {
    zIndex: 1000,
    marginLeft: 16,
    marginTop: 16,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
});

const EmptyModal = ({ modalVisible, setModalVisible, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', width: '100%', height: '100%' }}>
        <View style={styles.centeredView}>
          <Pressable style={styles.buttonClose} onPress={() => setModalVisible(!modalVisible)}>
            <Image source={require('../../assets/ico_close.png')} style={styles.closeIcon} />
          </Pressable>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default EmptyModal;
