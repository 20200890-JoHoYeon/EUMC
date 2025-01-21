import { Overlay } from '@rneui/themed';
import { StyleSheet, View } from 'react-native';
import EumcText from '../EumcText';
import { regularBold } from '../../styles/typography';
import { primaryDarkgreen2, primaryGray, primaryWhite } from '../../styles/colors';

const styles = StyleSheet.create({
  modalContent: {
    paddingTop: 32,
    paddingBottom: 24, //아래쪽 하얀줄 없도록
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  title: {
    color: primaryDarkgreen2,
    marginBottom: 16,
    textAlign: 'center',
    ...regularBold,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,.8)',
  },
});

const BaseModal = ({
  visible,
  onBackdropPress,
  overlayStyle = {
    width: '75%',
    backgroundColor: primaryWhite,
    borderColor: primaryGray,
    borderRadius: 8,
    overflow: 'hidden',
    padding: -10,
    marginBottom: -1,
  },
  title,
  buttonComponent,
  children,
}) => {
  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={onBackdropPress}
      overlayStyle={overlayStyle}
      backdropStyle={styles.backdrop}
    >
      <View style={styles.modalContent}>
        {title && <EumcText style={styles.title}>{title}</EumcText>}
        {children}
      </View>
      {buttonComponent}
    </Overlay>
  );
};

export default BaseModal;
