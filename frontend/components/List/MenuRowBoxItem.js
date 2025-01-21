import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Color, Typography } from '../../styles';
import Drag from '../../assets/icon/drag';

const styles = StyleSheet.create({
  menuContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 1,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: '#fff',
    elevation: 3,
    shadowRadius: 1,
    shadowColor: '#231f20',
    shadowOpacity: 0.15,
  },
  menuActiveContainer: {
    backgroundColor: 'rgba(190, 190, 190, 0.4)',
    shadowOpacity: 0,
    elevation: 0,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnArea: {
    paddingHorizontal: 7,
  },
  none: {
    opacity: 0,
  },
  ...Typography,
});

const MenuRowBoxItem = ({ isSelectedMenu, isActiveDrag, isRequired, children, drag, pressEvent }) => {
  return (
    <View style={[styles.menuContainer, isActiveDrag && styles.menuActiveContainer]}>
      <View style={styles.leftRow}>{children}</View>
      <View style={styles.rightRow}>
        <Pressable style={styles.btnArea} onPress={pressEvent}>
          {!isRequired &&
            (isSelectedMenu ? (
              <Image style={styles.iconImg} source={require('../../assets/icon/ic_del.png')} />
            ) : (
              <Image style={styles.iconImg} source={require('../../assets/icon/ic_add_green.png')} />
            ))}
        </Pressable>
        <Pressable style={styles.btnArea} onLongPress={drag}>
          <View style={!isSelectedMenu && styles.none}>
            <Drag />
          </View>
        </Pressable>
      </View>
    </View>
  );
};
export default MenuRowBoxItem;
