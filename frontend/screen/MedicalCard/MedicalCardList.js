import { useState, useContext } from 'react';
import { Image, StyleSheet, View, ScrollView } from 'react-native';
import { EumcText } from '../../components';
import RoundCard from '../../components/RoundCard';
import { SquareRoundLabelBtn, BottomOneBtn, RoundBorderInnerBtn } from '../../components/Buttons';
import { BottomModal } from '../../components/Modals';
import { Typography, Color } from '../../styles';
import { UserContext } from '../../context';
import { labelStyle } from '../../utils';
import {
  ERROR_MAX_MEDICAL_CARDS_REACHED,
  ERROR_MEDICAL_CARD_WITH_EXISTING_CHILD,
  ERROR_SELECT_MEDICAL_CARD,
  PROMPT_CHANGE_MEDICAL_CARD,
  PROMPT_DELETE_MEDICAL_CARD,
} from '../../popup-templates';

const MedicalCardItem = ({ isSelected, item, index, setIndex }) => {
  const labelProps = labelStyle(!isSelected ? item.relationship : '선택');
  const birth = item.birthDate && item.birthDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');

  return (
    <RoundCard
      innerRender={
        <View style={styles.medicalCardContainer}>
          <View style={styles.row}>
            <EumcText
              style={[styles.medicalCardName, !isSelected && { color: Color.homeColor.primaryBlack }]}
              fontWeight="bold"
            >
              {item.name}
            </EumcText>
            <EumcText style={[styles.medicalCardBirth, !isSelected && { color: Color.homeColor.primaryBlack }]}>
              {birth}
            </EumcText>
            <SquareRoundLabelBtn {...labelProps} title={item.relationship} />
          </View>
          <EumcText style={[styles.medicalCardInfo, !isSelected && { color: Color.homeColor.primaryGray }]}>
            환자번호 {item.patientNumber}
          </EumcText>
        </View>
      }
      isSelected={isSelected}
      selectedColor={Color.homeColor.primaryDarkgreen2}
      onPress={() => setIndex(index)}
    />
  );
};

const MedicalCardList = ({ navigation, route }) => {
  const { medicalCards, currentMedicalCardIndex, setCurrentMedicalCardIndex, rsvInfo, setRsvInfo, setToast } =
    useContext(UserContext);
  const [selectCardIndex, setSelectCardIndex] = useState(); //useState(currentMedicalCardIndex);
  const [modalDeleteCardVisible, setModalDeleteCardVisible] = useState(false);
  const currentMedicalCard = medicalCards[currentMedicalCardIndex];
  const selectCard = medicalCards[selectCardIndex];
  const selectCardBirth = selectCard && selectCard.birthDate.replace(/(\d{4})(\d{2})(\d{2})/g, '$1.$2.$3');
  const mode = route.params?.mode;

  const relationshipTypeCheck = () => {
    for (let i = 0; i < medicalCards.length; i++) {
      if (medicalCards[i].relationship === '자녀') {
        return false;
      }
    }
    return true;
  };

  const confirmChange = () => {
    setCurrentMedicalCardIndex(selectCardIndex);
    const { name, patientNumber, relationship } = medicalCards[selectCardIndex];
    if (rsvInfo && rsvInfo.department) {
      setRsvInfo({
        name: name,
        patientNumber: patientNumber,
        relationship: relationship,
        department: rsvInfo.department,
      });
    } else {
      setRsvInfo({ name, patientNumber, relationship });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.medicalCardListContainer}>
        {medicalCards.map((item, index) => (
          <MedicalCardItem
            key={index}
            setIndex={setSelectCardIndex}
            index={index}
            item={item}
            isSelected={selectCardIndex === index}
          />
        ))}
        {/*<RoundBorderInnerBtn*/}
        {/*  style={styles.addCard}*/}
        {/*  onPress={() => {*/}
        {/*    medicalCards.length >= 5*/}
        {/*      ? setToast(ERROR_MAX_MEDICAL_CARDS_REACHED)*/}
        {/*      : navigation.navigate('MedicalCardAdd');*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <View style={{ width: '100%' }}>*/}
        {/*    <Image*/}
        {/*      style={{ width: 24, height: 24, resizeMode: 'contain', alignSelf: 'center' }}*/}
        {/*      source={require('../../assets/icon/ic_add.png')}*/}
        {/*    />*/}
        {/*    <EumcText style={styles.addCardText} fontWeight="bold">*/}
        {/*      진료카드 추가 발급*/}
        {/*    </EumcText>*/}
        {/*  </View>*/}
        {/*</RoundBorderInnerBtn>*/}
        {/*<EumcText style={styles.medicalCardAddDesc}>※진료카드는 5명 이내로 등록 가능합니다.</EumcText>*/}
      </ScrollView>

      <BottomOneBtn
        rightTitle="확인"
        onNext={() => {
          switch (mode) {
            case 'change':
              if (!selectCard) setToast(Object.assign(ERROR_SELECT_MEDICAL_CARD, { title: '모바일진료카드 변경' }));
              else if (rsvInfo && rsvInfo.patientNumber !== selectCard.patientNumber)
                setToast(
                  Object.assign(PROMPT_CHANGE_MEDICAL_CARD(rsvInfo, selectCard), {
                    onConfirm: confirmChange,
                    redirect: () => navigation.replace('HomeTab', { screen: 'MedicalCard' }),
                  })
                );
              else if (currentMedicalCard?.patientNumber === selectCard.patientNumber) navigation.goBack();
              else
                setToast(
                  Object.assign(PROMPT_CHANGE_MEDICAL_CARD(rsvInfo, selectCard), {
                    onConfirm: confirmChange,
                    redirect: () => navigation.replace('HomeTab', { screen: 'MedicalCard' }),
                  })
                );
              break;
            case 'delete':
              selectCardIndex !== undefined ? setModalDeleteCardVisible(true) : setToast(ERROR_SELECT_MEDICAL_CARD);
              break;
          }
        }}
      />
      {/* 삭제 모달 1*/}
      <BottomModal
        visible={modalDeleteCardVisible}
        onCancel={() => setModalDeleteCardVisible(false)}
        onConfirm={() => {
          setModalDeleteCardVisible(false);
          if (selectCard?.relationship === '본인' && relationshipTypeCheck() === false) {
            setToast(ERROR_MEDICAL_CARD_WITH_EXISTING_CHILD);
          } else {
            setToast(
              Object.assign(PROMPT_DELETE_MEDICAL_CARD, {
                redirect: () =>
                  navigation.navigate('CardDelConfirm', {
                    mode: '진료카드',
                    currentIndex: selectCardIndex,
                  }),
              })
            );
          }
        }}
        title="모바일 진료카드를 삭제하시겠습니까?"
      >
        <View style={style2.contentContainer}>
          <View style={style2.boxContainer}>
            <EumcText fontWeight="regular" style={[styles.smallXX, style2.boxTitle]}>
              성명
            </EumcText>
            <EumcText style={[styles.smallXXBold, style2.boxContent]}>{selectCard?.name}</EumcText>
          </View>
          <View style={style2.boxContainer}>
            <EumcText fontWeight="regular" style={[styles.smallXX, style2.boxTitle]}>
              생년월일
            </EumcText>
            <EumcText style={[styles.smallXXBold, style2.boxContent]}>{selectCardBirth}</EumcText>
          </View>
          <View style={style2.boxContainer}>
            <EumcText fontWeight="regular" style={[styles.smallXX, style2.boxTitle]}>
              환자번호
            </EumcText>
            <EumcText style={[styles.smallXXBold, style2.boxContent]}>{selectCard?.patientNumber}</EumcText>
          </View>
          <View style={style2.boxContainer}>
            <EumcText fontWeight="regular" style={[styles.smallXX, style2.boxTitle]}>
              핸드폰 번호
            </EumcText>
            <EumcText style={[styles.smallXXBold, style2.boxContent]}>{selectCard?.phoneNumber}</EumcText>
          </View>
          <View style={style2.boxContainerEnd}>
            <EumcText fontWeight="regular" style={[styles.smallXX, style2.boxTitle]}>
              관계
            </EumcText>
            <EumcText style={[styles.smallXXBold, style2.boxContent]}>{selectCard?.relationship}</EumcText>
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  medicalCardListContainer: {
    flex: 1,
    marginTop: 10,
  },
  medicalCardContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 17,
    justifyContent: 'space-between',
    flex: 1,
    borderRadius: 10,
  },
  medicalCardName: {
    fontSize: 20,
    lineHeight: 26,
    color: Color.homeColor.primaryWhite,
    letterSpacing: -1.2,
  },
  medicalCardBirth: {
    fontSize: 14,
    lineHeight: 16,
    color: Color.homeColor.primaryWhite,
    paddingLeft: 8,
    alignSelf: 'flex-end',
    flex: 1,
  },
  medicalCardInfo: {
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'bottom',
    alignSelf: 'flex-start',
    color: Color.homeColor.primaryWhite,
  },
  medicalCardAddDesc: {
    fontSize: 14,
    lineHeight: 17,
    color: Color.homeColor.primaryDarkPurple,
    marginTop: 16,
    alignSelf: 'center',
  },
  addCard: {
    marginTop: 10,
    marginHorizontal: 17,
    paddingTop: 15,
    paddingBottom: 19,
  },
  addCardText: {
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -0.96,
    color: Color.homeColor.primaryGray,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  ...Typography,
});

/* modal */
const style2 = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 24,
    marginTop: 11,
  },
  boxContainer: {
    flexDirection: 'row',
    borderColor: Color.modalColor.gray,
    borderBottomWidth: 1,
    paddingTop: 8,
    paddingBottom: 3,
  },
  boxContainerEnd: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  boxTitle: {
    color: Color.homeColor.primaryGray,
    width: 100,
    height: 24,
    marginRight: 32,
    marginLeft: 8,
    lineHeight: 20,
  },
  boxContent: {
    color: Color.homeColor.primaryBlack,
    lineHeight: 20,
  },
});

export default MedicalCardList;
