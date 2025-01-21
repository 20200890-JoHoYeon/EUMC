import { Linking, Image, Pressable, StyleSheet, View, SafeAreaView } from 'react-native';
import { useState, useContext, useCallback } from 'react';
import Barcode from 'react-native-barcode-builder';
import { EumcText, TopBarSimple } from '../../components';
import { EmptyModal } from '../../components/Modals';
import { RoundBtn, RoundBorderGreenBtn, RoundLabelBtn, SquareRoundLabelBtn } from '../../components/Buttons';
import { Typography, Color } from '../../styles';
import { UserContext } from '../../context';
import { labelStyle } from '../../utils';
import EumcSeoul from '../../assets/hi_eumc_seoul_select';
import EumcMokdong from '../../assets/hi_eumc_mokdong_select';
import { MAIN_PHONE } from '../../constants';
import { ERROR_MAX_MEDICAL_CARDS_REACHED } from '../../popup-templates';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  card_layout: {
    minHeight: 253,
    maxHeight: 500,
    backgroundColor: Color.homeColor.primaryWhite,
    marginVertical: 30,
    marginHorizontal: 17,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    shadowColor: Color.medicalCardColor.black,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 9.84,
    elevation: 5,
  },
  bottom_layout: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  empty_label: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
    color: Color.homeColor.primaryGray,
  },
  deletedCardContainer: {},
  deleted_label: {
    marginTop: 11,
    marginBottom: 2,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'center',
    color: Color.homeColor.primaryGray,
  },
  btnRegLayout: {
    marginHorizontal: 0,
  },
  btnReg: {
    marginTop: 9,
    textAlign: 'center',
    paddingVertical: 12,
  },
  btnNew: {
    backgroundColor: Color.homeColor.primaryDarkgreen2,
  },
  btnAdd: {
    backgroundColor: Color.homeColor.primaryDarkgreen2,
  },
  lbCallLayout: {
    height: 26,
    flexDirection: 'row',
    borderRadius: 4,
    backgroundColor: Color.medicalCardColor.mintCream,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginRight: 17,
  },
  lbCallTitle: {
    color: Color.medicalCardColor.gray,
    letterSpacing: -0.6,
    paddingLeft: 8,
    justifyContent: 'center',
    lineHeight: 18,
  },
  lbCallNumber: {
    color: Color.homeColor.primaryDarkgreen,
    marginHorizontal: 5,
    lineHeight: 23,
  },
  iconCall: {
    width: 12,
    height: 12,
  },
  /* normal */
  greeting: {
    flex: 1,
    color: Color.homeColor.primaryBlack,
  },
  greetingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold: {
    fontFamily: 'NotoSansKR-Bold',
  },
  btnBarcode: {
    width: '100%',
  },
  barcodeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  cardInfoArea: { flexDirection: 'row', width: '100%', alignItems: 'center' },
  cardNumText: { flex: 1, color: Color.homeColor.primaryBlack, textAlign: 'right' },
  ...Typography,
});

// 빈카드 레이아웃
const EmptyCard = ({ navigation }) => {
  return (
    <View style={styles.card_layout}>
      <EumcText style={[styles.empty_label, styles.small, { lineHeight: 28 }]}>
        등록된 환자카드가 없습니다.{'\n'}
        모바일진료카드(환자번호)를 등록해주세요.
      </EumcText>
      <View style={styles.btnRegLayout}>
        <RoundBtn
          style={[styles.btnReg, styles.btnNew]}
          titleStyle={styles.bold}
          title="모바일진료카드 등록"
          onPress={() => navigation.navigate('MedicalCardRegTerms')}
        />
      </View>
    </View>
  );
};

const NormalCard = ({ code, navigation, currentCard, isFull, showFullBarcode, setShowFullBarcode }) => {
  const labelProps = labelStyle(currentCard?.relationship);
  const [barcode, setBarcode] = useState();

  return (
    <View style={styles.card_layout}>
      {/* {!isDeleted && (
          <> */}
      <View style={styles.greetingsContainer}>
        <EumcText style={[styles.greeting, styles.mediumXXBold]} fontWeight="bold">
          {currentCard?.name}님 안녕하세요.
        </EumcText>
        <RoundLabelBtn
          title="진료카드 삭제"
          onPress={() => navigation.navigate('MedicalCardList', { mode: 'delete' })}
        />
      </View>
      {/*바코드*/}
      <View style={styles.barcodeContainer}>
        <Pressable
          style={styles.btnBarcode}
          onPress={() => {
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
            setShowFullBarcode(true);
          }}
        >
          <View style={{ position: 'relative', marginHorizontal: 16 }}>
            <View
              onLayout={({ nativeEvent }) => {
                setBarcode(
                  <Barcode value={currentCard?.patientNumber} width={nativeEvent.layout.width / (6.5 * 11)} />
                );
              }}
              style={{ width: '100%' }}
            >
              {barcode}
            </View>
          </View>
        </Pressable>
        <View style={styles.cardInfoArea}>
          <SquareRoundLabelBtn {...labelProps} title={currentCard?.relationship} />
          <EumcText style={[styles.cardNumText, styles.mediumBold]}>{currentCard?.patientNumber}</EumcText>
        </View>
      </View>
      {/* 전체 스크린 바코드 팝업 */}

      <EmptyModal setModalVisible={setShowFullBarcode} modalVisible={showFullBarcode}>
        <Barcode value={currentCard?.patientNumber} width={6} background="transparent" height={112} />
        <View style={{ alignItems: 'center' }}>
          <View style={{ width: 474, justifyContent: 'space-between', marginHorizontal: 40, flexDirection: 'row' }}>
            <EumcText style={[styles.largeBoldXX, { paddingTop: 16 }]}>{currentCard?.name}</EumcText>
            <EumcText style={[styles.largeBoldXX, { paddingTop: 16 }]}>{currentCard?.patientNumber}</EumcText>
          </View>
        </View>
        <View style={{ flex: 1, transform: 'scale(.4)', marginLeft: 10 }}>
          {code === '01' ? <EumcSeoul /> : <EumcMokdong />}
        </View>
      </EmptyModal>
      {/* </>
        )} */}
      {/* {isDeleted && (
          <View style={styles.deletedCardContainer}>
            <View style={{ textAlign: 'center', alignItems: 'center' }}>
              <AlertOutline />
            </View>

            <EumcText style={styles.deleted_label}>
              선택하신 진료카드가 삭제되었습니다.
              {'\n'}
              사용하실 모바일진료카드(환자번호)로 변경해주세요.
            </EumcText>
          </View>
        )} */}

      {/*<View style={styles.btnRegLayout}>*/}
      {/*  <RoundBorderGreenBtn*/}
      {/*    style={styles.btnReg}*/}
      {/*    titleStyle={styles.bold}*/}
      {/*    title="모바일진료카드 변경"*/}
      {/*    onPress={() => navigation.navigate('MedicalCardList', { mode: 'change' })}*/}
      {/*  />*/}
      {/*  <RoundBtn*/}
      {/*    style={[styles.btnReg, styles.btnAdd]}*/}
      {/*    titleStyle={styles.bold}*/}
      {/*    title="모바일진료카드 추가 발급"*/}
      {/*    onPress={() => {*/}
      {/*      isFull ? setToast(ERROR_MAX_MEDICAL_CARDS_REACHED) : navigation.navigate('MedicalCardAdd');*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</View>*/}
    </View>
  );
};

const MedicalCardMain = ({ navigation }) => {
  const { code, medicalCards, currentMedicalCardIndex } = useContext(UserContext);
  const currentMedicalCard = medicalCards[currentMedicalCardIndex];
  const isEmpty = medicalCards ? medicalCards.length <= 0 : true;
  //const isDeleted = medicalCards.findIndex(item => item.patientNumber === currentMedicalCard?.patientNumber) === -1;
  const isFull = medicalCards.length >= 5;
  const [showFullBarcode, setShowFullBarcode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TopBarSimple title="진료카드" navigation={navigation} />
      {/*카드 레이아웃*/}
      {isEmpty && <EmptyCard navigation={navigation} />}
      {!isEmpty && (
        <NormalCard
          code={code}
          currentCard={currentMedicalCard}
          navigation={navigation}
          //  isDeleted={isDeleted}
          isFull={isFull}
          showFullBarcode={showFullBarcode}
          setShowFullBarcode={setShowFullBarcode}
        />
      )}
      <View style={styles.bottom_layout}>
        <View style={styles.lbCallLayout}>
          <Image style={styles.iconCall} source={require('../../assets/icon/Ic_call.png')} />
          <EumcText style={[styles.lbCallTitle, styles.microX]} fontWeight="bold">
            대표 전화/진료 예약
          </EumcText>
        </View>
        <Pressable onPress={() => Linking.openURL(`tel:${MAIN_PHONE(code)}`)}>
          <EumcText style={[styles.lbCallNumber, styles.mediumXX]} fontWeight="bold">
            {MAIN_PHONE(code)}
          </EumcText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default MedicalCardMain;
