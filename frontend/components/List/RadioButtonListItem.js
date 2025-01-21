import { useContext } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Color } from '../../styles';
import { UserContext } from '../../context/UserContext';
import { CheckBox } from '@rneui/themed';
import RadioUnChecked from '../../assets/icon/dot-circle';
import moment from 'moment/moment';

const styles = StyleSheet.create({
  listBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 16,

    shadowOffset: { width: 0, height: 4 },
    backgroundColor: '#fff',
    elevation: 10,
    shadowRadius: 5,
    shadowColor: '#231f20',
    shadowOpacity: 0.15,
  },
  backgroundDarkGreenColor: {
    backgroundColor: Color.homeColor.primaryDarkgreen2,
  },
  textListContent: {
    flex: 14,
    marginRight: 12,
  },
  textListArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 7,
    paddingTop: 7,
    paddingHorizontal: 4,
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
  darkGreen: {
    backgroundColor: Color.darkGreen,
  },
  whiteColor: {
    color: '#fff',
  },
  lightGreenColor: {
    color: '#9ed1ce',
  },
});

const RadioButtonListItem = ({ data, dataIndex, selectIndex, onPress }) => {
  const { code } = useContext(UserContext);
  const treatmentDay = data.treatmentDay;

  return (
    <CheckBox
      title={
        <View style={styles.textListContent}>
          <View style={[styles.textListArea, styles.borderBottom]}>
            <Text style={[styles.fixedTitle, selectIndex === dataIndex && styles.lightGreenColor]}>병원</Text>
            <Text style={[styles.valueText, selectIndex === dataIndex && styles.whiteColor]}>
              {code === '01' ? '이대서울병원' : '이대목동병원'}
            </Text>
          </View>

          <View style={[styles.textListArea, styles.borderBottom]}>
            <Text style={[styles.fixedTitle, selectIndex === dataIndex && styles.lightGreenColor]}>진료과</Text>
            <Text style={[styles.valueText, selectIndex === dataIndex && styles.whiteColor]}>
              {data.deptname}
            </Text>
          </View>

          <View style={[styles.textListArea, styles.borderBottom]}>
            <Text style={[styles.fixedTitle, selectIndex === dataIndex && styles.lightGreenColor]}>진료일</Text>
            <Text style={[styles.valueText, selectIndex === dataIndex && styles.whiteColor]}>
              {moment(data.meddate).format('yyyy년 MM월 DD일')}
            </Text>
          </View>

          <View style={styles.textListArea}>
            <Text style={[styles.fixedTitle, selectIndex === dataIndex && styles.lightGreenColor]}>금액</Text>
            <Text
              style={[styles.valueText, selectIndex === dataIndex ? styles.whiteColor : { color: '#16b1a9' }]}
            >{`${new Intl.NumberFormat().format(data.rcpamt)}원`}</Text>
          </View>
        </View>
      }
      containerStyle={{ backgroundColor: '#fff', borderWidth: 0 }}
      wrapperStyle={[styles.listBox, selectIndex === dataIndex && styles.backgroundDarkGreenColor]}
      checkedIcon={<Image source={require('../../assets/rdo-white.png')} />}
      uncheckedIcon={<RadioUnChecked />}
      iconRight={true}
      checked={selectIndex === dataIndex}
      onPress={() => onPress(dataIndex)}
    />
  );
};
export default RadioButtonListItem;
