import { StyleSheet, View } from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const List = props => {
  return <View style={styles.container}>{props.children}</View>;
};

export default List;
