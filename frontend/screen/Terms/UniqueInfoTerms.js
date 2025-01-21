import { Dimensions, StyleSheet, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const UniqueInfoTerms = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <FastImage
        resizeMode={FastImage.resizeMode.stretch}
        style={{ width: windowWidth, height: 4000 }}
        source={require('../../assets/terms_of_use.png')}
      />
    </ScrollView>
  );
};
export default UniqueInfoTerms;
