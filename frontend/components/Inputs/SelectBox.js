import { StyleSheet, Image, View } from 'react-native';
import { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Color, Typography } from '../../styles';

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    height: 42,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    borderColor: Color.myPageColor.gray,
    borderStyle: 'solid',
    backgroundColor: Color.homeColor.primaryWhite,
    marginVertical: 4,
    paddingHorizontal: 0,
  },
  inputText: {
    textAlign: 'left',
    fontSize: 14,
    color: Color.inputColor.gray2,
    marginHorizontal: 10,
  },
  inputSelectedText: {
    color: Color.inputColor.black,
  },
  optionRow: { height: 40, backgroundColor: Color.inputColor.lightGray2, borderBottomColor: Color.inputColor.gray3 },
  optionRowText: { textAlign: 'left', color: Color.homeColor.primaryBlack, marginHorizontal: 10 },
  selectedOptionRow: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  selectedOptionRowText: {
    color: Color.homeColor.primaryWhite,
  },
  arrowBtn: {
    fontSize: 24,
    marginRight: 0,
    color: Color.myPageColor.gray,
  },
  arrowBtnColor: {
    color: Color.myPageColor.gray,
  },
  arrowActiveBtnColor: {
    color: Color.homeColor.primaryTurquoise,
  },
  arrowBorderColor: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Color.myPageColor.gray,
  },
  arrowActiveBorderColor: {
    borderWidth: 1,
    borderColor: Color.homeColor.primaryTurquoise,
  },
  ...Typography,
});

const SelectBox = ({ data, setSelect, selectBoxText }) => {
  const [style, setStyle] = useState();
  const [arrowColor, setArrowColor] = useState();
  const [borderColor, setBorderColor] = useState();
  return (
    <View style={styles.container}>
      <SelectDropdown
        data={data}
        buttonStyle={[styles.inputContainer, borderColor]}
        buttonTextStyle={[styles.inputText, styles.small, style]}
        rowStyle={styles.optionRow}
        rowTextStyle={[styles.optionRowText, styles.small]}
        selectedRowStyle={styles.selectedOptionRow}
        selectedRowTextStyle={styles.selectedOptionRowText}
        renderDropdownIcon={isOpened => <Icon name="menu-down" style={[styles.arrowBtn, arrowColor]} />}
        dropdownIconPosition="right"
        defaultButtonText={selectBoxText ? selectBoxText : '선택'}
        dropdownOverlayColor="rgba(0,0,0,0)"
        onFocus={() => {
          setArrowColor(styles.arrowActiveBtnColor);
          setBorderColor(styles.arrowActiveBorderColor);
        }}
        onBlur={() => {
          setArrowColor(styles.arrowBtnColor);
          setBorderColor(styles.arrowBorderColor);
        }}
        onSelect={(selectedItem, index) => {
          setStyle(styles.inputSelectedText);
          setSelect(selectedItem);
        }}
      />
    </View>
  );
};

export default SelectBox;
