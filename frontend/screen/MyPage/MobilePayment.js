import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RadioButtonListItem } from '../../components/List';
import { BottomTwoBtn } from '../../components/Buttons';
import { UserContext } from '../../context';
import { getRsvList } from '../../api/v1/reservation';
import { checkPaymentList, getPaymentList } from '../../api/v1/payment';
import AlertOutline from '../../assets/icon/alert-outline';
import { EumcText } from '../../components';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 16,
    color: '#231f20',
  },
});

const MobilePayment = ({ navigation,route }) => {
  const [selectIndex, setSelectIndex] = useState();
  const [payList, setPayList] = useState([]);
  const [centerModalVisible, setCenterModalVisible] = useState(false);

  const proxyPtNo = route.params?.proxyPtNo ?? null;


  const {
    code,
    medicalCards,
    currentMedicalCardIndex,
    loadingVisible,
    setLoadingVisible,
    setToast,
    reservations,
    setReservations,
  } = useContext(UserContext);
  const [cancel, setCancel] = useState(true);

  const refresh = () => {
    if (currentMedicalCardIndex >= 0) {
      setLoadingVisible(true);
      const { patientNumber } = medicalCards[currentMedicalCardIndex];
      // 예약 내역 범위는 서버에서 지정
      console.log(`수납리스트 REQ ${code}, ${patientNumber}`);
      checkPaymentList(code, (proxyPtNo != null ? proxyPtNo : patientNumber))
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            /**
             *   deptname: '' + data.OUT_DEPTNAME.trim(),
             *   rcpamt: data.OUT_RCPAMT,
             *   meddate: data.OUT_ADMDATE,
             *   raw: data
             */
            console.log(`수납리스트 : ${JSON.stringify(data.arrPayment)}`);
            setPayList(data.arrPayment);
          }
        })
        .catch(e => {
          setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
          console.log(e);
        })
        .finally(() => setLoadingVisible(false));
    }
  };

  const onRefresh = useCallback(() => {
    refresh();
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  return payList.length > 0 ? (
    <View style={styles.container}>
      <ScrollView>
        {payList.map((data, index) => (
          <RadioButtonListItem
            key={index}
            data={data}
            dataIndex={index}
            onPress={i => setSelectIndex(i)}
            selectIndex={selectIndex}
          />
        ))}
      </ScrollView>
      <BottomTwoBtn
        leftTitle="취소"
        onCancel={() => navigation.goBack()}
        rightTitle="수납"
        onNext={() =>
          selectIndex >= 0
            ? navigation.navigate('MobilePaymentDetail', { payList: payList[selectIndex] })
            : setToast({ type: 'error', text1: '필수 선택', text2: '수납 항목을 선택하세요.' })
        }
      />
    </View>
  ) : (
    <View style={emptyStyles.container}>
      <AlertOutline />
      <EumcText style={emptyStyles.centerText} fontWeight="bold">
        수납가능한 내역이 없습니다.
      </EumcText>
    </View>
  );
};

export default MobilePayment;
