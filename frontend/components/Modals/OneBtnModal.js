import { StyleSheet, View, Pressable } from 'react-native';
import BaseModal from './BaseModal';
import EumcText from '../EumcText';
import { primaryTurquoise, primaryWhite } from '../../styles/colors';
import { mediumXXBold } from '../../styles/typography';

const styles = StyleSheet.create({
  modalButtonArea: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: primaryTurquoise,
  },
  modalConfirmText: {
    color: primaryWhite,
    textAlign: 'center',
    lineHeight: 29,
    ...mediumXXBold,
  },
});

const OneBtnModal = ({ children, visible, onConfirm, confirmText = '확인', title }) => {
  return (
    <BaseModal
      visible={visible}
      buttonComponent={
        <View style={styles.modalButtonArea}>
          <Pressable style={styles.modalButton} onPress={onConfirm}>
            <EumcText style={styles.modalConfirmText}>{confirmText}</EumcText>
          </Pressable>
        </View>
      }
      title={title}
    >
      {children}
    </BaseModal>
  );
};

export default OneBtnModal;
