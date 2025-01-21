import { useContext } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { EumcText } from '../../components';
import { MenuRowBoxItem } from '../../components/List';
import { Color, Typography } from '../../styles';
import { UserContext } from '../../context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
  },
  paddingTop: {
    paddingTop: 30,
  },
  contentBody: {
    paddingHorizontal: 10,
  },
  colorBlack: {
    color: Color.homeColor.primaryBlack,
  },
  ...Typography,
  headerText: {
    ...Typography.mediumXXBold,
  },
  rowItem: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regularImg: {
    width: 36,
    height: 36,
    marginRight: 6,
  },
});

const FavoriteMenu = () => {
  const { selectMenus, setSelectMenus, unselectMenus, setUnselectMenus } = useContext(UserContext);
  const orderMenu = menu => menu.map((val, i) => ({ ...val, key: i }));

  const selectMenu = item => {
    const tmpSelected = [...selectMenus];
    const tmpUnselected = [...unselectMenus];
    tmpUnselected.splice(item.key, 1);
    tmpSelected.push(item);
    setSelectMenus(orderMenu(tmpSelected));
    setUnselectMenus(orderMenu(tmpUnselected));
  };
  const unSelectMenu = item => {
    const tmpSelected = [...selectMenus];
    const tmpUnselected = [...unselectMenus];
    tmpSelected.splice(item.key, 1);
    tmpUnselected.push(item);
    setSelectMenus(orderMenu(tmpSelected));
    setUnselectMenus(orderMenu(tmpUnselected));
  };

  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <MenuRowBoxItem
        {...(item.text === '진료\n예약' && { isRequired: true })}
        drag={drag}
        isActiveDrag={isActive}
        isSelectedMenu={true}
        pressEvent={() => unSelectMenu(item)}
      >
        <View style={styles.regularImg}>
          <Image style={styles.regularImg} source={item.img} />
        </View>
        <EumcText style={[styles.smallXXBoldCenter, styles.colorBlack]}>{item.text.replace('\n', '')}</EumcText>
      </MenuRowBoxItem>
    </ScaleDecorator>
  );

  return (
    <View style={styles.container}>
      <DraggableFlatList
        ListHeaderComponent={() => (
          <View style={styles.contentHeader}>
            <EumcText style={[styles.mediumXXBold, styles.colorBlack]}>선택된 메뉴</EumcText>
          </View>
        )}
        data={selectMenus}
        renderItem={renderItem}
        keyExtractor={item => item.key + 1}
        onDragEnd={({ data }) => setSelectMenus(orderMenu(data))}
        renderPlaceholder={() => (
          <View style={{ flex: 1, backgroundColor: '#eee', borderStyle: 'dashed', borderWidth: 3, margin: 10 }} />
        )}
        ListFooterComponent={() => (
          <>
            <View style={styles.contentHeader}>
              <EumcText style={[styles.mediumXXBold, styles.colorBlack]}>추가할 메뉴 선택</EumcText>
            </View>
            {unselectMenus.map((item, i) => (
              <MenuRowBoxItem pressEvent={() => selectMenu(item)} key={i}>
                <View style={styles.regularImg}>
                  <Image style={styles.regularImg} source={item.img} />
                </View>
                <EumcText style={[styles.smallXXBoldCenter, styles.colorBlack]}>{item.text.replace('\n', '')}</EumcText>
              </MenuRowBoxItem>
            ))}
            <View style={{ paddingBottom: 40 }}></View>
          </>
        )}
      />
    </View>
  );
};
export default FavoriteMenu;
