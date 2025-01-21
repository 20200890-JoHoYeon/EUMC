import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ListItem } from '@rneui/themed';
import { EmptyList, EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { Color, Typography } from '../../styles';
import { getCertificationList } from '../../api/v1/cert';
import { UserContext } from '../../context';
import { formatDate4 } from '../../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  containerNext: {
    shadowColor: Color.homeColor.primaryBlack,
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -9 },
    elevation: -10,
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  agreement: {
    flex: 4,
    backgroundColor: '#eee',
  },
  warning: {
    marginLeft: 20,
    marginTop: 30,
  },
  text: {
    color: '#000',
    ...Typography.small,
  },
  containerAgree: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#939598',
  },
  btnEnabled: {
    backgroundColor: Color.homeColor.primaryTurquoise,
  },
});

const ProofSelect = ({ navigation, route }) => {
  const { code, medicalCards, currentMedicalCardIndex, setLoadingVisible } = useContext(UserContext);

  const { calData } = route.params;
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState();


  if (currentMedicalCardIndex >= 0) {
    const { patientNumber } = medicalCards[currentMedicalCardIndex];
    useEffect(() => {
      setLoadingVisible(true);
      getCertificationList(
        code,
        patientNumber,
        calData.start.date.replace(/-/g, ''),
        calData.end.date.replace(/-/g, '')
      )
        .then(res => {
          const { ok, data } = res.data;
          if (ok) {
            setList(data);
            if (data.length > 0) setSelected(0);

            console.log(`RESULT : ${JSON.stringify(data)}`);
          }
        })
        .catch(e => console.log(e))
        .finally(() => setLoadingVisible(false));
      // setList(dummy); // 확인 후 삭제
    }, []);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={list.length > 0 ? { paddingBottom: 30 } : { flex: 1 }}>
        {list.length > 0 ? (
          list.map((val, index) => {
            return (
              <ListItem
                onPress={() => setSelected(index)}
                key={index}
                containerStyle={{ margin: 0, paddingBottom: 10 }}
              >
                <ListItem.Content
                  style={{
                    backgroundColor:
                      selected === index ? Color.homeColor.primaryDarkgreen2 : Color.homeColor.primaryWhite,
                    padding: 16,
                    borderRadius: 4,
                    elevation: 8,
                    shadowColor: Color.homeColor.primaryBlack,
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 0 },
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderBottomWidth: 1,
                      borderColor: selected === index ? '#ffF' : '#eee',
                      width: '100%',
                      paddingHorizontal: 10,
                      paddingBottom: 5,
                    }}
                  >
                    <View style={{ paddingVertical: 5 }}>
                      <EumcText
                        style={{
                          color: selected === index ? '#fff' : '#333',
                          fontSize: 16,
                          lineHeight: 24,
                          marginBottom: 2,
                        }}
                        fontWeight="bold"
                      >
                        {val.certname} {val.certname === '통원진료확인서' ? '(병명없음)' : ''}
                      </EumcText>
                      <EumcText
                        style={{ color: selected === index ? '#fff' : '#333', fontSize: 12, lineHeight: 18 }}
                        fontWeight="regular"
                      >{`${formatDate4(val.fromdate)} ~ ${formatDate4(val.todate)}`}</EumcText>
                    </View>
                    <View
                      style={{
                        borderRadius: 24,
                        backgroundColor: '#fff',
                        width: 48,
                        height: 48,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 4,
                        borderWidth: 1,
                        borderColor: selected === index ? '#fff' : '#707070',
                      }}
                    >
                      <EumcText style={{ color: Color.homeColor.primaryDarkgreen2, fontSize: 16 }} fontWeight="bold">
                        1 매
                      </EumcText>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 10,
                      paddingTop: 11,
                      paddingBottom: 8,
                    }}
                  >
                    <EumcText style={{ color: selected === index ? '#fff' : '#333', lineHeight: 18 }}>
                      발급 수수료
                    </EumcText>
                    <EumcText style={{ color: selected === index ? '#fff' : '#333', lineHeight: 20 }} fontWeight="bold">
                      {new Intl.NumberFormat().format(val.price)}원
                    </EumcText>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 10,
                    }}
                  >
                    <EumcText style={{ color: selected === index ? '#fff' : '#333', lineHeight: 24 }}>
                      대행 수수료
                    </EumcText>
                    <EumcText style={{ color: selected === index ? '#fff' : '#333', lineHeight: 24 }} fontWeight="bold">
                      1,100원
                    </EumcText>
                  </View>
                </ListItem.Content>
              </ListItem>
            );
          })
        ) : (
          <EmptyList
            emptyText={
              <EumcText style={{ fontSize: 16 }} fontWeight="bold">
                조회 기간에 따른 증명서가 없습니다.
              </EumcText>
            }
          />
        )}
      </ScrollView>
      {selected >= 0 && (
        <View style={{ paddingHorizontal: 16, paddingTop: 15, borderTopWidth: 8, borderColor: '#f5f5f5' }}>
          <EumcText style={{ fontSize: 16, color: '#333', lineHeight: 24 }} fontWeight="bold">
            수납 내용
          </EumcText>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderColor: '#ddd',
                paddingVertical: 9,
              }}
            >
              <EumcText style={{ lineHeight: 20 }} fontWeight="regular">
                총계
              </EumcText>
              <EumcText style={{ lineHeight: 24 }}>1 매</EumcText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 10,
                borderBottomWidth: 1,
                borderColor: '#ddd',
                paddingVertical: 9,
              }}
            >
              <EumcText style={{ lineHeight: 20 }} fontWeight="regular">
                발급 수수료
              </EumcText>
              <EumcText style={{ lineHeight: 24 }}>
                {selected >= 0 ? new Intl.NumberFormat().format(list[selected]?.price) : 0}원
              </EumcText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 10,
                paddingVertical: 9,
              }}
            >
              <EumcText style={{ lineHeight: 20 }} fontWeight="regular">
                대행 수수료
              </EumcText>
              <EumcText style={{ lineHeight: 24 }}>{selected >= 0 ? '1,100원' : '0원'}</EumcText>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
                paddingHorizontal: 10,
                borderRadius: 6,
                backgroundColor: Color.homeColor.primaryDarkgreen2,
                paddingVertical: 12,
                marginTop: 16,
              }}
            >
              <EumcText fontWeight="regular" style={{ color: '#fff', lineHeight: 20 }}>
                최종 결제 금액
              </EumcText>
              <EumcText style={{ color: '#ffe600', lineHeight: 24 }} fontWeight="bold">
                {selected >= 0 ? new Intl.NumberFormat().format(+list[selected].price + 1100) : 0}원
              </EumcText>
            </View>
            <EumcText
              fontWeight="regular"
              style={{ color: '#7670b3', paddingTop: 15, paddingBottom: 26, fontSize: 14, lineHeight: 17 }}
            >
              * 모든 수수료는 부가세 포함 금액입니다.
            </EumcText>
          </View>
        </View>
      )}
      <BottomTwoBtn
        rightTitle="다음"
        leftTitle="취소"
        onNext={() =>
          selected >= 0 &&

          navigation.navigate('PaymentCardReg', {
            type: 'PROOF',
            selected: list[selected],
            money: Number(list[selected].price) + 1100
          })

          // navigation.navigate('ProofPayment', { selected: list[selected], money: Number(list[selected].price) + 1100 })
        }
        onCancel={() => navigation.goBack()}
        rightDisabled={!(selected >= 0)}
      />
    </View>
  );
};

export default ProofSelect;
