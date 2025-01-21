import { ScrollView, StyleSheet, View } from 'react-native';
import AlertOutline from '../assets/icon/alert-outline';

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const EmptyList = ({ emptyText, refreshControl }) => {
  return (
    <View style={[styles.listContainer]}>
      <AlertOutline />
      {emptyText}
    </View>
  );
};

export default EmptyList;
