import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  listContainer: { flex: 1 },

  textListArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 7,
    paddingTop: 7,
    paddingHorizontal: 15,
  },
  fixedTitle: {
    color: '#939598',
    fontSize: 14,
    fontWeight: 500,
  },
  valueText: {
    color: '#333333',
    fontSize: 14,
    fontWeight: 500,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  radioArea: {
    flex: 1,
    justifyContent: 'center',
  },
});

const LabelListItem = ({ LeftText, RightText }) => {
  return (
    <View style={styles.listContainer}>
      <View style={[styles.textListArea, styles.borderBottom]}>
        <Text style={styles.fixedTitle}>{LeftText}</Text>
        <Text style={styles.valueText}>{RightText}</Text>
      </View>
    </View>
  );
};
export default LabelListItem;
