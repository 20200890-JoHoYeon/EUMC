import { StyleSheet, Pressable } from 'react-native';
const styles = StyleSheet.create({
  listItem: {
    flex: 1,
  },
});

const ListItem = ({ children, secondary }) => {
  return (
    <Pressable style={styles.listItem} secondary={secondary}>
      {children}
    </Pressable>
  );
};

export default ListItem;
