import { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Overlay } from '@rneui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EumcText from './EumcText';
import { Color, Typography } from '../styles';
import EumcSeoul from '../assets/hi_eumc_seoul_select';
import EumcMokdong from '../assets/hi_eumc_mokdong_select';
import { TwoBtnModal } from './Modals';
import { getHospitalName } from '../utils';
import { UserContext } from '../context';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    position: 'relative',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 54,
    left: 16,
    borderRadius: 20,
    backgroundColor: Color.homeColor.primaryWhite,
    paddingHorizontal: 15,
    paddingVertical: 8,
    //overflow: 'hidden',
    shadowColor: Color.inputColor.black,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 20,
  },
  notch: {
    top: 115,
  },
  dropdownItem: {
    paddingTop: 13,
    paddingBottom: 9,
    paddingHorizontal: 24,
    backgroundColor: Color.homeColor.primaryWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.topBar.gray,
    marginVertical: 8,
  },
  dropdownItemHover: {
    borderColor: Color.homeColor.primaryOrange,
    borderWidth: 2,
  },
  arrow: {
    paddingHorizontal: 4,
    color: Color.homeColor.primaryBlack,
    fontSize: 24,
  },
  logoImg: {
    width: 180,
    height: 26,
  },
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  ...Typography,
});

const SelectHospital = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { code, setCode, setScheduleUpdated } = useContext(UserContext);

  useEffect(() => {
    setShowDropdown(false);
    return () => setShowDropdown(false);
  }, []);

  const toggleHospital = () => {
    setShowConfirm(false);
    setShowDropdown(false);
    setScheduleUpdated(0);
    setCode(code === '01' ? '02' : '01');
  };
  const hasNotch = DeviceInfo.hasNotch();

  return (
    <>
      <Pressable style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
        <View style={styles.logoImg}>{code == '01' ? <EumcSeoul /> : <EumcMokdong />}</View>
        <Icon name="keyboard-arrow-down" style={styles.arrow} />
      </Pressable>
      <Overlay
        isVisible={showDropdown}
        onBackdropPress={() => setShowDropdown(false)}
        backdropStyle={{ opacity: 0 }}
        overlayStyle={[styles.dropdownContainer, hasNotch === true ? styles.notch : '']}
      >
        <Pressable
          style={({ hovered, pressed }) => [styles.dropdownItem, (pressed || hovered) && styles.dropdownItemHover]}
          onPress={() => (code !== '01' ? setShowConfirm(true) : setShowDropdown(false))}
        >
          <View style={styles.logoImg}>
            <EumcSeoul />
          </View>
        </Pressable>
        <Pressable
          style={({ hovered, pressed }) => [styles.dropdownItem, (pressed || hovered) && styles.dropdownItemHover]}
          onPress={() => (code !== '02' ? setShowConfirm(true) : setShowDropdown(false))}
        >
          <View style={styles.logoImg}>
            <EumcMokdong />
          </View>
        </Pressable>
        <TwoBtnModal
          visible={showConfirm}
          cancelText="아니오"
          confirmText="예"
          onCancel={() => {
            setShowConfirm(false);
            setShowDropdown(false);
          }}
          onConfirm={toggleHospital}
          title={`${getHospitalName(code === '01' ? '02' : '01')}으로\n전환 하시겠습니까?`}
        >
          <EumcText style={[styles.medium, styles.modalContentText]}>
            원내 서비스를 원활하게 이용하시려면 해당 병원에 방문하여 이용하시기 바랍니다.
          </EumcText>
        </TwoBtnModal>
      </Overlay>
    </>
  );
};
export default SelectHospital;
