import { View, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { EumcText } from '../../components';
import UserInfo from './UserInfo';
import { BottomOneBtn } from '../../components/Buttons';
import { Color } from '../../styles';
import { getDocList } from '../../api/v1/reservation';
import { UserContext } from '../../context';

const SelectDoctor = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const [searchText, setSearchText] = useState('');
  const { code, setLoadingVisible, setToast, rsvInfo, setRsvInfo } = useContext(UserContext);
  const [doctors, setDoctors] = useState([]);
  const {
    department: { cdcode, cdvalue },
  } = rsvInfo;

  useEffect(() => {
    setLoadingVisible(true);
    // setDoctors([{ DR_NM: '손윤민', MED_DEPT_CD: '안과' }]); // 샘플 확인 후 삭제
    getDocList(code, cdcode)
      .then(res => {
        const { ok, data } = res.data;
        console.log(`DOCTORS : ${ok}, ${JSON.stringify(doctors)}`);
        if (ok) setDoctors(data);
      })
      .catch(e => {
        setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
        console.log(e);
      })
      .finally(() => setLoadingVisible(false));
  }, []);

  const search = searchText => {
    //검색을 하지 않았을때
    if (searchText.length <= 0) {
      if (typeof doctors == 'undefined') {
        return [];
      } else {
        return doctors;
      }
    }

    //검색했을때
    return doctors.filter(doctor => doctor.DR_NM.includes(searchText));
  };

  return (
    <View style={styles.container}>
      <UserInfo navigation={navigation} />
      <View style={styles.inputbox}>
        <Icon style={{ marginLeft: 8, fontSize: 25, color: Color.inputColor.gray2 }} name="search" />
        <TextInput
          placeholder="검색할 진료의명을 입력하세요."
          placeholderTextColor="#bcbec0"
          style={styles.textInput}
          onChangeText={text => setSearchText(text)}
        />
      </View>
      <ScrollView contentContainerStyle={{ marginBottom: 40, paddingHorizontal: 16 }}>
        {search(searchText).map((item, index) => (
          <DoctorBox
            item={item}
            key={index}
            index={index}
            selected={selected}
            setSelected={setSelected}
            department={cdvalue}
          />
        ))}
      </ScrollView>
      <BottomOneBtn
        rightTitle="다음"
        onNext={() => {
          if (selected) {
            setRsvInfo(Object.assign(rsvInfo, { doctor: selected }));
            navigation.navigate('SelectDate');
          } else setToast({ type: 'error', text1: '필수 선택', text2: '진료의를 선택하셔야 합니다.' });
        }}
      />
    </View>
  );
};

const DoctorBox = ({ item, selected, setSelected, department }) => {
  const { DR_NM } = item;

  // if (typeof item.DESC != 'undefined') {
  //   item.DESC = item.DESC.substring(0, 14) + '...';
  // }

  return (
    <Pressable style={styles.boxContainer} onPress={() => setSelected(item)}>
      <View style={styles.faceBox}>{item.PROFILE && <Image src={item.PROFILE} style={styles.faceBoxImg} />}</View>
      <View style={styles.description}>
        <EumcText style={[DR_NM === selected?.DR_NM ? styles.nameChecked : styles.name]} fontWeight="bold">
          {DR_NM} 교수
        </EumcText>
        <View style={styles.boxTitleContainer}>
          <EumcText fontWeight="regular" style={styles.boxTitle}>
            진료과
          </EumcText>
          <EumcText fontWeight="regular" style={DR_NM === selected?.DR_NM ? styles.boxItemChecked : styles.boxItem}>
            {/*{item.MED_DEPT_CD}*/}
            {department}
          </EumcText>
        </View>
        <View style={styles.boxTitleContainer}>
          <EumcText fontWeight="regular" style={styles.boxTitle}>
            진료분야
          </EumcText>
          <EumcText
            fontWeight="regular"
            style={DR_NM === selected?.DR_NM ? styles.boxItemChecked : styles.boxItem}
            textEclipse={2}
          >
            {item.DESC}
          </EumcText>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={
            DR_NM === selected?.DR_NM ? require('../../assets/chk_green_on.png') : require('../../assets/chk_off.png')
          }
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
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
  bottomButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 11,
    paddingBottom: 15,
    borderColor: '#e3e4e5',
    borderBottomWidth: 1,
  },
  faceBox: {
    width: 51,
    height: 51,
    backgroundColor: '#eee',
    borderRadius: 25.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  faceBoxImg: {
    width: 51,
    height: 51,
    borderRadius: 25.5,
    resizeMode: 'cover',
  },
  description: {
    paddingLeft: 8,
  },
  name: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'left',
    marginBottom: 5,
    color: '#231f20',
  },
  nameChecked: {
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'left',
    marginBottom: 5,
    color: '#0e6d68',
  },
  boxTitleContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  boxTitle: {
    width: 55,
    lineHeight: 20,
    fontSize: 14,
    color: '#bcbec0',
  },
  boxItem: {
    width: 183,
    lineHeight: 20,
    fontSize: 14,
    color: '#231f20',
  },
  boxItemChecked: {
    width: 183,
    lineHeight: 20,
    fontSize: 14,
    color: '#0e6d68',
  },
});
export default SelectDoctor;
