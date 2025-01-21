import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { EumcText } from '../../components';
import { Color, Typography } from '../../styles';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 4,
    borderStyle: 'solid',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    borderColor: Color.myPageColor.gray,
  },
  innerLabel: {
    width: '27%',
    height: 40,
    justifyContent: 'center',
    paddingLeft: 14,
  },
  innerLabelCount: {
    height: 40,
    justifyContent: 'center',
    paddingRight: 10,
  },
  innerLabelText: {
    color: Color.myPageColor.darkGray,
  },
  countText: {
    color: Color.inputColor.darkGray,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    height: 40,
    paddingHorizontal: 7,
    color: Color.inputColor.black,
  },
  inputFocus: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: Color.homeColor.primaryTurquoise,
    paddingLeft: 10,
    borderRadius: 4,
  },
  ...Typography,
});

const SimpleInput = ({ label, countText, placeHolder, type, maxLength, setValue, editable, style, value, mask }) => {
  const [text, setText] = useState(value || '');
  const [focusStyle, setFocusStyle] = useState(null);
  const allowedKey = 'Backspace';
  let inputKey = null;

  let textFormatHandling = input => setText(input);

  let keypressHandling = null;
  if (type === 'creditCard') {
    textFormatHandling = input => handleCardNumber(input);
    type = 'numeric';
  } else if (type === 'expiryDate') {
    keypressHandling = event => (inputKey = event.nativeEvent.key);
    textFormatHandling = input => handleExDate(input);
    type = 'numeric';
  }

  const onFocus = () => setFocusStyle(styles.inputFocus);

  const onBlur = () => setFocusStyle();

  const handleCardNumber = number =>
    setText(
      number
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
    );

  const handleExDate = value => {
    setText(value);
    if (inputKey === allowedKey) {
      return;
    }
    setText(
      value
        .replace(
          /^([1-9]\/|[2-9])$/g,
          '0$1/' // 3 > 03/
        )
        .replace(
          /^(0[1-9]|1[0-2])$/g,
          '$1/' // 11 > 11/
        )
        .replace(
          /^([0-1])([3-9])$/g,
          '0$1/$2' // 13 > 01/3
        )
        .replace(
          /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
          '$1/$2' // 141 > 01/41
        )
        .replace(
          /^([0]+)\/|[0]+$/g,
          '0' // 0/ > 0 and 00 > 0
        )
        .replace(
          /[^\d\/]|^[\/]*$/g,
          '' // To allow only digits and `/`
        )
        .replace(
          /\/\//g,
          '/' // Prevent entering more than 1 `/`
        )
    );
  };

  setValue &&
    useEffect(() => {
      setValue(text);
    }, [text]);
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.innerLabel}>
          <Pressable style={[styles.innerLabelText, styles.small]}>
            <EumcText style={[styles.small]}>{label}</EumcText>
          </Pressable>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          onFocus={onFocus}
          onBlur={onBlur}
          style={[styles.input, styles.small, focusStyle]}
          onChangeText={textFormatHandling}
          placeholder={placeHolder}
          placeholderTextColor={Color.myPageColor.gray}
          maxLength={maxLength}
          inputMode={type}
          editable={editable}
          value={text}
          secureTextEntry={mask === true}
          {...(keypressHandling && { onKeyPress: keypressHandling })}
        />
      </View>
      {countText && (
        <View style={[styles.innerLabelCount]}>
          <EumcText style={[styles.countText, styles.small, { textAlign: 'left' }]}>{countText}</EumcText>
        </View>
      )}
    </View>
  );
};

export default SimpleInput;
