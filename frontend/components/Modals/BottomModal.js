import { StyleSheet, View, Modal, Pressable, Image } from 'react-native';
import RoundBtn from '../Buttons/RoundBtn';
import RoundBorderBtn from '../Buttons/RoundBorderBtn';
import { Color } from '../../styles';
import { BottomSheet } from '@rneui/themed';
import EumcText from '../EumcText';
import { mediumXXBold } from '../../styles/typography';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    backgroundColor: Color.homeColor.primaryWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 18,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#eee',
    paddingBottom: 30,
    paddingTop: 20,
  },
  buttonCancel: {
    flex: 1,
    marginRight: 4,
    paddingVertical: 12,
  },
  buttonConfirm: {
    flex: 1,
    marginLeft: 4,
    paddingVertical: 12,
    backgroundColor: Color.homeColor.primaryRed,
  },
  backgroundColorTeal: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  buttonClose: {
    zIndex: 1000,
    alignItems: 'flex-end',
    marginTop: 18,
    marginBottom: 13,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  titleText: {
    textAlign: 'center',
    color: Color.homeColor.primaryDarkgreen2,
    ...mediumXXBold,
    lineHeight: 28,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,.8)',
  },
});

const BottomModal = ({
  visible,
  cancelText = '취소',
  confirmText = '확인',
  confirmStyle,
  onConfirm,
  onCancel,
  children,
  onBackdropPress,
  title,
}) => (
  <BottomSheet
    isVisible={visible}
    onBackdropPress={onBackdropPress}
    modalProps={{ animationType: 'slide' }}
    backdropStyle={styles.backdrop}
  >
    <View style={styles.modalView}>
      <Pressable style={styles.buttonClose} onPress={onCancel}>
        <Image source={require('../../assets/ico_close.png')} style={styles.closeIcon} />
      </Pressable>
      <EumcText style={styles.titleText}>{title}</EumcText>
      {children}
      <View style={styles.buttonContainer}>
        <RoundBorderBtn title={cancelText} style={styles.buttonCancel} onPress={onCancel} />
        <RoundBtn title={confirmText} style={[styles.buttonConfirm, confirmStyle]} onPress={onConfirm} />
      </View>
    </View>
  </BottomSheet>
);

export default BottomModal;
