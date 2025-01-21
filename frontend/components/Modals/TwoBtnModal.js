import { StyleSheet, View, Pressable } from 'react-native';
import { EumcText } from '../../components';
import { mediumXXBold } from '../../styles/typography';
import { darkGray, primaryDarkgreen2 } from '../../styles/colors';
import BaseModal from './BaseModal';

const styles = StyleSheet.create({
  modalButtonArea: {
    flexDirection: 'row',
    borderColor: '#ddd',
    //  margin: -10,
  },
  modalButton: {
    flex: 1,
    paddingTop: 16,
    paddingBottom: 16,
    borderColor: '#ddd',
    borderWidth: 1,
    borderTopWidth: 2,
    alignItems: 'center',
  },
  modalCancleText: {
    color: darkGray,
    textAlign: 'center',
    ...mediumXXBold,
  },
  modalConfirmText: {
    color: primaryDarkgreen2,
    textAlign: 'center',
    ...mediumXXBold,
  },
});

const TwoBtnModal = ({
  children,
  visible,
  onConfirm,
  onCancel,
  leftTitle,
  cancelText = '취소',
  confirmText = '확인',
  title,
}) => {
  return (
    <BaseModal
      visible={visible}
      buttonComponent={
        <View style={styles.modalButtonArea}>
          <Pressable style={styles.modalButton} onPress={onCancel}>
            <EumcText style={styles.modalCancleText} fontWeight="bold">
              {leftTitle ? leftTitle : cancelText}
            </EumcText>
          </Pressable>
          <Pressable style={styles.modalButton} onPress={onConfirm}>
            <EumcText style={styles.modalConfirmText} fontWeight="bold">
              {confirmText}
            </EumcText>
          </Pressable>
        </View>
      }
      title={title}
    >
      {children}
    </BaseModal>
  );
};

export default TwoBtnModal;
