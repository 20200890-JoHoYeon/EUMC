import { useContext, useState } from 'react';
import { Image, Pressable, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { EumcText } from '../../components';
import { Color, Typography } from '../../styles';
import BottomTwoBtn from '../../components/Buttons/BottomTwoBtn';
import { CheckBoxItem } from '../../components/List';
import { OneBtnModal } from '../../components/Modals';
import { UserContext } from '../../context';

const windowHeight = Dimensions.get('window').height - 80 - 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  contentWrap: {
    width: '100%',
    paddingBottom: 40,
  },
  contenrHeader: {
    height: (windowHeight / 3) * 2,
    paddingHorizontal: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenBody: {
    marginHorizontal: 16,
    marginBottom: 40,
  },
  applyAllLayout: {
    flexDirection: 'row',
    marginHorizontal: 5,
    lineHeight: 33,
  },
  applyLayout: {
    paddingVertical: 10,
    borderColor: Color.inputColor.lightGray,
    borderTopWidth: 1,
  },
  applyAllCheckbox: {
    width: 33,
    height: 33,
    resizeMode: 'contain',
    justifyContent: 'center',
  },
  applyAllCheckboxLabel: {
    alignSelf: 'center',
    color: Color.homeColor.primaryDarkgreen2,
    paddingLeft: 8,
    lineHeight: 27,
  },
  logoImg: {
    width: 95,
    height: 95,
    alignSelf: 'center',
  },
  /* modal */
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
  },
  ...Typography,
  applyAllDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: Color.homeColor.primaryDarkPurple,
    marginStart: 33,
    marginTop: 5,
    marginBottom: 16,
  },
});

const images = {
  regImg: require('../../assets/icon/ic_uplode.png'),
  chkOn: require('../../assets/chk_green_on.png'),
  chkOff: require('../../assets/chk_off.png'),
  dtlArrow: require('../../assets/icon/ic_dtl_arrow_right.png'),
};
const menuName = [
  { title: '개인정보 수집 및 이용 동의', nav: 'MedicalServiceTerms' },
  { title: '모바일 진찰권 이용약관 동의', nav: 'MbExamineTerms' },
];
const allChkOff = [false, false];
const allChkOn = [true, true];

const MedicalCardRegTerms = ({ navigation }) => {
  const { setToast } = useContext(UserContext);
  const [chkAllChecked, setChkAllChecked] = useState(false);
  const [chkArray, setChkArray] = useState(allChkOff);

  const handleClickCheckAll = () => {
    if (chkAllChecked === false) {
      setChkAllChecked(true);
      setChkArray(allChkOn);
    } else {
      setChkAllChecked(false);
      setChkArray(allChkOff);
    }
  };

  const handleClickCheckSingle = index => {
    const newArr = [...chkArray];
    if (chkArray[index] === false) {
      newArr[index] = true;
      if (JSON.stringify(newArr) === JSON.stringify(allChkOn)) {
        setChkAllChecked(true);
      }
    } else {
      newArr[index] = false;
      setChkAllChecked(false);
    }
    setChkArray(newArr);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentWrap}
      >
        <View style={styles.contenrHeader}>
          <Image style={styles.logoImg} source={images.regImg} />
        </View>
        <View style={styles.contenBody}>
          <View style={styles.applyAllLayout}>
            <Pressable style={{ flexDirection: 'row' }} onPress={handleClickCheckAll}>
              <Image style={styles.applyAllCheckbox} source={chkAllChecked ? images.chkOn : images.chkOff} />

              <EumcText style={[styles.applyAllCheckboxLabel, styles.mediumBold]} fontWeight="black">
                전체동의
              </EumcText>
            </Pressable>
          </View>
          <EumcText style={styles.applyAllDesc}>아래의 모든 항목을 확인하였으며, 동의합니다.</EumcText>
          <View style={styles.applyLayout}>
            {menuName &&
              menuName.map((item, index) => (
                <CheckBoxItem
                  key={index}
                  title={item.title}
                  checked={chkArray[index]}
                  onCheckPress={() => handleClickCheckSingle(index)}
                  onArrowPress={() => navigation.navigate(item.nav)}
                />
              ))}
          </View>
        </View>
      </ScrollView>

      <BottomTwoBtn
        leftTitle="취소"
        onCancel={() => navigation.goBack()}
        rightTitle="다음"
        onNext={() =>
          chkAllChecked === true
            ? navigation.navigate('MedicalCardReg')
            : setToast({ type: 'error', text1: '모바일 진료카드 발급', text2: '이용 약관에 동의해주세요' })
        }
      />
    </View>
  );
};

export default MedicalCardRegTerms;
