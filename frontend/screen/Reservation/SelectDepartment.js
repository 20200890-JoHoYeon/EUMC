import { Dimensions, View, FlatList, StyleSheet, Pressable, TextInput } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserInfo from './UserInfo';
import { EumcText } from '../../components';
import { getRsvDeptList } from '../../api/v1/reservation';
import { UserContext, ReservationContext } from '../../context';
import { Color } from '../../styles';
import { BottomOneBtn } from '../../components/Buttons';

const windowWidth = Dimensions.get('window').width;
const childWidth = windowWidth / 2 - 16;

const SelectDepartment = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { code, setLoadingVisible, setToast, rsvInfo, setRsvInfo } = useContext(UserContext);

  const search = searchText => {
    if (!data) return [];
    let result = data;
    //검색을 했을때 필터 적용용
    if (searchText.length > 0) result = data.filter(word => word.cdvalue.includes(searchText));

    return result.length > 0 ? result.reduce((arr, val) => arr.push(val) && arr, []) : [];
  };

  useEffect(() => {
    setLoadingVisible(true);
    // setData([{ cdcode: 'EY', cdvalue: '안과' }]); // 샘플 확인 후 삭제
    getRsvDeptList(code)
      .then(res => {
        const { ok, data } = res.data;
        if (ok) setData(data);
      })
      .catch(e => {
        console.log(e);
        setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
      })
      .finally(() => setLoadingVisible(false));
  }, []);

  return (
    <View style={styles.container}>
      <UserInfo navigation={navigation} />
      <View style={styles.inputbox}>
        <Icon style={{ marginLeft: 8, fontSize: 25, color: Color.inputColor.gray2 }} name="search" />
        <TextInput
          placeholder="검색할 진료과명을 입력하세요."
          placeholderTextColor="#bcbec0"
          style={styles.textInput}
          onChangeText={text => setSearchText(text)}
        />
      </View>
      <FlatList
        data={search(searchText)}
        renderItem={({ item }) => <DepartmentBox data={item} selected={selected} setSelected={setSelected} />}
        numColumns={2}
        style={{ marginHorizontal: 16 }}
      />
      <BottomOneBtn
        rightTitle="다음"
        onNext={() => {
          if (selected) {
            setRsvInfo(Object.assign(rsvInfo, { department: selected }));
            navigation.navigate('SelectDoctor');
          } else setToast({ type: 'error', text1: '필수 선택', text2: '진료과를 선택하셔야 합니다.' });
        }}
      />
    </View>
  );
};

const DepartmentBox = ({ data, selected, setSelected }) => {
  let dept = data?.cdvalue;
  const newLineIdx = dept.indexOf('(');
  const btnText = newLineIdx > 0 ? `${dept.slice(0, newLineIdx)}\n${dept.slice(newLineIdx, dept.length)}` : dept;

  return (
    <View style={styles.btnStyle}>
      <Pressable
        style={[styles.btnFlex, data?.cdcode === selected?.cdcode ? styles.textContainerChecked : styles.textContainer]}
        onPress={() => setSelected(data)}
      >
        <EumcText style={styles.text} fontWeight="bold">
          {btnText}
        </EumcText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  btnStyle: {
    height: 75,
    maxWidth: childWidth,
    minWidth: childWidth,
    padding: 4,
  },
  btnFlex: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    borderColor: '#e3e4e5',
    borderWidth: 1,
  },
  textContainerChecked: {
    backgroundColor: '#f1fffb',
    borderColor: '#16b1a9',
    borderWidth: 2,
  },
  text: {
    fontSize: 14,
    color: '#6d6e71',
    textAlign: 'center',
  },
  bottomButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputbox: {
    marginTop: 30,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    borderRadius: 17.5,
    alignItems: 'center',
    height: 35,
  },
  textInput: {
    color: '#bcbec0',
    fontSize: 12,
  },
});

export default SelectDepartment;
