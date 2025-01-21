import { Pressable, StyleSheet, View, ImageBackground } from 'react-native';
import EumcText from './EumcText';

const styles = StyleSheet.create({
  btnType01: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#939598',
    borderRadius: 2,
    boxSizing: 'border-box',
  },
  btnType01Text: {
    color: '#939598',
    letterSpacing: -0.6,
  },
  btnType02: {
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#e3e4e5',
    borderRadius: 2,
  },
  btnType02Text: {
    color: '#6d6e71',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 17,
  },
  callIconArea: {
    width: 12,
    height: 12,
  },
  callIcon: {
    width: '100%',
    height: '100%',
  },
  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdL6: {
    paddingLeft: 6,
  },
  pdRL7: {
    paddingRight: 7,
    paddingLeft: 7,
  },
});

const BtnType01 = props => {
  return (
    <Pressable style={styles.btnType01}>
      <EumcText style={styles.btnType01Text}>{props.text}</EumcText>
    </Pressable>
  );
};

const BtnType02 = props => {
  return (
    <Pressable style={styles.btnType02}>
      <EumcText style={styles.btnType02Text} fontWeight="bold">
        {props.text}
      </EumcText>
    </Pressable>
  );
};

const CallBtn = props => {
  return (
    <Pressable style={[styles.btnType02, styles.flexLayout, styles.pdRL7]}>
      <View style={styles.callIconArea}>
        <ImageBackground source={require('../assets/ico_call.png')} style={styles.callIcon}></ImageBackground>
      </View>
      <EumcText fontWeight="bold" style={[styles.btnType02Text, styles.pdL6]}>
        {props.text}
      </EumcText>
    </Pressable>
  );
};

export { BtnType01, BtnType02, CallBtn };
