import { Dimensions, StyleSheet, View, ImageBackground, Pressable } from 'react-native';
import React from 'react';
import { Color } from '../styles';
import EumcText from './EumcText';

const windowWidth = Dimensions.get('window').width;
const childWidth = windowWidth / 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: childWidth,
    minWidth: childWidth,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    paddingLeft: 8,
    fontSize: 14,
    color: '#231f20',
    letterSpacing: -0.84,
    lineHeight: 20,
  },
  menuIconArea: {
    width: 24,
    height: 24,
  },
  menuIcon: {
    width: '100%',
    height: '100%',
  },
  lightGrayBackGroudColor: {
    backgroundColor: '#fff',
  },
  whiteBackGroudColor: {
    backgroundColor: Color.homeColor.white,
  },
});

const SideBar = props => {
  return (
    <Pressable
      style={[styles.container, props.link === '' ? styles.lightGrayBackGroudColor : styles.whiteBackGroudColor]}
      onPress={() => {
        if (props.link) {
          props.navigation.navigate('WebViewPage', {
            title: props.title,
            link: props.link,
          });
        }
      }}
    >
      <View style={styles.titleArea}>
        <View style={styles.menuIconArea}>
          {props.icon && <ImageBackground source={props.icon} style={styles.menuIcon} />}
        </View>
        <EumcText style={styles.title}>{props.title}</EumcText>
      </View>
    </Pressable>
  );
};

export default SideBar;
