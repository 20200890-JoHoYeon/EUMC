import { useState, useLayoutEffect, useContext } from 'react';
import { View, StyleSheet, FlatList, Vibration, ImageBackground, TouchableOpacity, Pressable } from 'react-native';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
import { EumcText } from '../components';
import { TwoBtnModal } from '../components/Modals';
import { UserContext } from '../context';
import { Color, Typography } from '../styles';
import { ERROR_PASSWORD_MISMATCH, ERROR_PIN_VALIDATION, RESET_SMART_PAYMENT } from '../popup-templates';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  center: {
    flex: 1,
    textAlign: 'center',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImg: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  noImg: {
    width: 23,
    height: 23,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  hide: {
    display: 'none',
    opacity: 0,
  },
  maskingPins: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'center',
  },
  mask: {
    width: 23,
    height: 23,
    borderRadius: 50,
    marginHorizontal: 5.5,
  },
  inputNormal: {
    backgroundColor: Color.homeColor.primaryGray,
  },
  inputOnAtive: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  keyboardContainer: {
    height: 230,
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
  keyboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    paddingLeft: 15,
  },
  keyboardHeaderText: {
    fontSize: 13,
    lineHeight: 16,
    color: Color.homeColor.primaryLightGray,
    marginHorizontal: 5,
  },
  keyboardBody: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
  keyWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  forgetText: {
    borderWidth: 2,
    borderColor: Color.homeColor.primaryGray,
    borderRadius: 15,
    color: Color.homeColor.primaryGray,
    paddingHorizontal: 25,
    paddingVertical: 3,
    textAlign: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
  },
  /* Key */
  key: {
    flex: 1,
    padding: 15,
    textAlign: 'center',
    justifyContent: 'center',
    color: Color.homeColor.primaryWhite,
  },
  keyText: {
    fontSize: 20,
    lineHeight: 23,
    color: Color.homeColor.primaryWhite,
    textAlign: 'center',
    // justifyContent:'center',
    alignItems: 'center',
  },
  ...Typography,
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 5,
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  ...Typography,
});

let forgetCount = 0;
const ONE_SECOND_IN_MS = 1000;
const PATTERN = [0 * ONE_SECOND_IN_MS, 0.02 * ONE_SECOND_IN_MS];

const KeyBtn = ({ title, onPress, index }) => (
  <TouchableOpacity style={styles.key} activeOpacity={0.4} onPress={onPress}>
    {index === 11 ? (
      <ImageBackground style={styles.iconImg} source={require('../assets/ic_back_key.png')} resizeMode="cover" />
    ) : (
      <EumcText style={styles.keyText}>
        {title.length === 1 ? (
          title
        ) : title === '공백' ? (
          <ImageBackground style={[styles.noImg]} source={require('../assets/transparent.png')} resizeMode="cover" />
        ) : (
          <ImageBackground style={[styles.iconImg]} source={require('../assets/ic_back_key.png')} resizeMode="cover" />
        )}
      </EumcText>
    )}
  </TouchableOpacity>
);

/**
 * mode 상태 종류 identify / setup / setupRepeat
 *
 */
const SecurePinScreen = ({ navigation, route }) => {
  const { cardLists, setCardLists, easyPin, setToast } = useContext(UserContext);
  const [mode, setMode] = useState(route.params.mode);
  const userData = JSON.parse(route.params.userData || null);
  const successParams = JSON.parse(route.params.successParams || null);
  const [title, setTitle] = useState('결제 비밀번호를 입력해주세요.');
  const [initialPin, setInitialPin] = useState(easyPin);
  const [PinArray, setPinArray] = useState([]);
  const [keypadArray, setKeypadArray] = useState([
    {
      title: '0',
    },
    {
      title: '1',
    },
    {
      title: '2',
    },
    {
      title: '3',
    },
    {
      title: '4',
    },
    {
      title: '5',
    },
    {
      title: '6',
    },
    {
      title: '7',
    },
    {
      title: '8',
    },
    {
      title: '9',
    },
    {
      title: '공백',
    },
    {
      title: '삭제',
    },
  ]);
  const onSuccess = () => {
    const obj = {
      img: require('../assets/payment_card/card_img.png'),
      id: 1,
      ...userData,
    };
    const newCardLists = [...cardLists];
    newCardLists.push(obj);
    setCardLists(newCardLists);
    navigation.navigate('ConfirmScreen', successParams);
  };
  const forgetTextActiveStyle = mode === 'identify' ? (forgetCount > 3 ? undefined : styles.hide) : styles.hide;
  const pinActiveStyle = index => {
    return PinArray[index] ? styles.inputOnAtive : styles.inputNormal;
  };

  const shuffle = () => {
    const newArr = [...keypadArray];
    for (let i = newArr.length - 2; i > 0; i--) {
      const j = Math.floor(isaac.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    setKeypadArray(newArr);
  };

  const isABC = numArr => {
    for (let i = 0; i < numArr.length - 1; i++) {
      if (parseInt(numArr[i], 10) + 1 === numArr[i + 1]) {
        return true;
      }
    }
    return false;
  };

  const isAAA = numArr => {
    for (let i = 0; i < numArr.length - 1; i++) {
      if (numArr[i] === numArr[i + 1]) {
        return true;
      }
    }
    return false;
  };

  const verifyPin = array => {
    if (bcrypt.compareSync(array.join(''), initialPin)) {
      if (mode === 'setupRepeat' || mode === 'identify') {
        onSuccess();
      }
    } else {
      if (mode === 'identify') {
        setToast(ERROR_PASSWORD_MISMATCH);
      }
      forgetCount = forgetCount + 1;
    }
    setPinArray([]);
  };

  const onInput = title => {
    /* 빈버튼 */
    if (title === '공백') {
      return;
    }
    /* 딜레트버튼 */
    if (title === '삭제') {
      const array = [...PinArray];
      array.pop();
      setPinArray(array);
      return;
    }

    const array = [...PinArray];
    array.push(title);
    setPinArray(array);
    // shuffle();
    /* 마지막 차례 */
    if (PinArray.length >= 5) {
      const numPin = PinArray.map(i => Number(i));
      //const numPin = PinArray.map(n => parseInt(n, 10));
      Vibration.vibrate();

      if (mode === 'setup') {
        if (isABC(numPin) || isAAA(numPin)) {
          forgetCount = forgetCount + 1;
          setToast(ERROR_PIN_VALIDATION);
          setPinArray([]);
        } else {
          setInitialPin(array.join(''));
          setPinArray([]);
          setMode('setupRepeat');
          setTitle('결제 비밀번호를 한번 더 입력해주세요.');
        }
      } else {
        verifyPin(array);
      }

      return;
    }
    Vibration.vibrate(PATTERN);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { fontFamily: 'NotoSansKR-Bold', fontSize: 18, color: '#231f20' },
      title: successParams.headerTitle,
      btnUse: true,
      headerTitleAlign: 'center',
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <EumcText style={styles.smallBold}>{title}</EumcText>
        <View style={styles.maskingPins}>
          <View style={[pinActiveStyle(0), styles.mask]} />
          <View style={[pinActiveStyle(1), styles.mask]} />
          <View style={[pinActiveStyle(2), styles.mask]} />
          <View style={[pinActiveStyle(3), styles.mask]} />
          <View style={[pinActiveStyle(4), styles.mask]} />
          <View style={[pinActiveStyle(5), styles.mask]} />
        </View>
        <Pressable
          onPress={() => {
            setToast(
              Object.assign(RESET_SMART_PAYMENT, { redirect: () => navigation.navigate('PersonalInformation') })
            );
          }}
        >
          <EumcText style={[styles.microXBold, styles.forgetText, forgetTextActiveStyle]} fontWeight="regular">
            결제 비밀번호를 잊어버리셨나요?
          </EumcText>
        </Pressable>
      </View>

      <View style={styles.keyboardContainer}>
        <View style={styles.keyboardHeader}>
          <ImageBackground style={styles.iconImg} source={require('../assets/ic_secure.png')} resizeMode="cover" />
          <EumcText style={styles.keyboardHeaderText}>보안 키보드 작동 중</EumcText>
        </View>
        <View style={styles.keyboardBody}>
          <FlatList
            data={keypadArray}
            columnWrapperStyle={styles.keyWrapper}
            numColumns={4}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => (
              <KeyBtn index={index} title={item.title} onPress={() => onInput(item.title)} />
            )}
          ></FlatList>
        </View>
      </View>
    </View>
  );
};
export default SecurePinScreen;
