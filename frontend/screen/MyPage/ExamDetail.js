import { ScrollView, StyleSheet, View } from 'react-native';
import { EumcText } from '../../components';
import { BottomTwoBtn } from '../../components/Buttons';
import { Color } from '../../styles';
import { small, smallXX, smallXXBold } from '../../styles/typography';
import { primaryDarkgreen2 } from '../../styles/colors';
import { formatDate6 } from '../../utils';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cardLayout: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    minHeight: 100,
    backgroundColor: Color.homeColor.primaryWhite,
    shadowColor: Color.inputColor.black,
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 9.84,
    elevation: 5,
    borderRadius: 10,
  },
  titleView: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  title: { ...smallXXBold, color: primaryDarkgreen2 },
  contentView: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 14 },
  dateView: {
    borderRadius: 4,
    backgroundColor: primaryDarkgreen2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    height: 42,
  },
  unit: { ...small, color: '#888', letterSpacing: -0.56 },
  labelText: { color: '#777' },
  resultText: { color: '#333' },
  dateText: { ...smallXX, color: '#fff', letterSpacing: -0.7 },
});

const ExamDetail = ({ navigation, route }) => {
  const { data, date } = route.params;
  return (
    <View style={styles.container}>
      {date && (
        <>
          <View style={styles.dateView}>
            <EumcText style={styles.dateText}>{formatDate6(date.substring(0, 10))}</EumcText>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            {data?.length > 0 &&
              data.map((exam, index) => (
                <View key={index} style={styles.cardLayout}>
                  <View style={styles.titleView}>
                    <EumcText style={styles.title}>{exam.EITM_ABBR}</EumcText>
                    {exam.EXRS_UNIT && <EumcText style={styles.unit}>단위: {exam.EXRS_UNIT}</EumcText>}
                  </View>
                  <View style={styles.contentView}>
                    <View style={{ flex: 1 }}>
                      <EumcText style={styles.labelText}>결과</EumcText>
                      <EumcText style={styles.labelText}>정상범위</EumcText>
                    </View>
                    <View style={{ flex: 4 }}>
                      <EumcText style={styles.resultText}>{exam.EXRS_CNTE}</EumcText>
                      <EumcText style={styles.resultText}>{exam.SREFVAL}</EumcText>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        </>
      )}
      <BottomTwoBtn
        leftTitle="이전"
        rightTitle="다른 날짜 조회"
        onNext={() => navigation.pop(2)}
        onCancel={() => navigation.goBack()}
      />
    </View>
  );
};

export default ExamDetail;
