import { StyleSheet, View, Pressable, Modal } from 'react-native';
import { Typography, Color } from '../../styles';
import { EumcText } from '../../components';

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalView: {
    width: '78%',
    backgroundColor: Color.homeColor.primaryWhite,
    borderColor: Color.homeColor.primaryGray,
    borderRadius: 8,
    overflow: 'hidden',
  },
  modalContent: {
    paddingTop: 34,
    paddingBottom: 29,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  modalButtonArea: {
    flexDirection: 'row',
    width: '100%',
    borderColor: '#ddd',
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
    color: Color.modalColor.darkGray,
    fontSize: 20,
    lineHeight: 29,
  },
  modalConfirmText: {
    color: Color.homeColor.primaryDarkgreen,
    fontSize: 20,
    lineHeight: 29,
  },
  ...Typography,

  /** */

  modalHeaderText: {
    color: Color.homeColor.primaryDarkgreen2,
    lineHeight: 50,
    textAlign: 'center',
  },
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
});

const TwoBtnModalStyled = ({
  children,
  width,
  modalSizeStyle,
  visible,
  setVisible,
  onConfirm,
  onCancel,
  leftTitle = '취소',
  rightTitle = '확인',
  rightTextType,

  title,
  content
}) => {
  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={() => setVisible(!visible)}>
      <View style={styles.modalWrap}>
        <View style={[styles.modalView, modalSizeStyle, { minWidth: width }]}>
          <View style={styles.modalContent}>
            <EumcText style={[styles.regularBold, styles.modalHeaderText]} fontWeight="bold">
              {title}
            </EumcText>
            <EumcText style={[styles.medium, styles.modalContentText]}>
              {content}
            </EumcText>
          </View>
          <View style={styles.modalButtonArea}>
            <Pressable
              style={[styles.modalButton]}
              onPress={() => {
                onCancel && onCancel();
                setVisible(!visible);
              }}
            >
              <EumcText style={[styles.modalCancleText]} fontWeight="bold">
                {leftTitle}
              </EumcText>
            </Pressable>
            <Pressable
              style={[styles.modalButton]}
              onPress={() => {
                setVisible(!visible);
                onConfirm && onConfirm();
              }}
            >
              <EumcText style={[styles.modalConfirmText]} fontWeight="bold">
                {rightTextType === '결제' ? '결제' : rightTitle}
              </EumcText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TwoBtnModalStyled;
