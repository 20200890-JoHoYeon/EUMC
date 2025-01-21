import { Pressable, StyleSheet } from 'react-native';
import React from 'react';
import { Color } from '../styles';
const RoundCard = ({ innerRender, isSelected, selectedColor, onPress }) => {
  // const [text, onChangeText] = React.useState(value);

  return (
    <Pressable style={[styles.container, isSelected && { backgroundColor: selectedColor }]} onPress={onPress}>
      {innerRender}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 79,
    borderRadius: 10,
    backgroundColor: Color.homeColor.primaryWhite,
    ...Color.shadowColor.card2,
    elevation: 3,
    marginVertical: 8,
    marginHorizontal: 17,
  },
});

export default RoundCard;
