import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import EumcText from '../EumcText';
import { Color } from '../../styles';

const TitleInput = ({ title, placeHolder, value }) => {
  const [text, onChangeText] = useState(value);

  return (
    <View style={styles.container}>
      <EumcText style={styles.title} fontWeight="bold">
        {title}
      </EumcText>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        placeholder={placeHolder}
        placeholderTextColor={'#bcbec0'}
        value={text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
    color: Color.homeColor.primaryBlack,
  },
  input: {
    height: 40,
    marginVertical: 8,
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#bcbec0',
  },
});

export default TitleInput;
