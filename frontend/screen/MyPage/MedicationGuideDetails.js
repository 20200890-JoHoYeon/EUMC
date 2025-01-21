import { View, StyleSheet, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { EumcText } from '../../components';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  textArea: {
    marginVertical: 20,
    marginHorizontal: 16,
  },
  guideText: {
    fontSize: 16,
    letterSpacing: -0.96,
    color: '#333',
  },
  pd20: {
    paddingBottom: 20,
  },
  borderText: {
    paddingBottom: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    lineHeight: 24,
  },
  menuIconArea: {
    width: 24,
    height: 24,
  },
  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  menuIcon: {
    width: '100%',
    height: '100%',
  },
  menuText: {
    color: '#000000',
    letterSpacing: -0.84,
    marginBottom: 4,
    lineHeight: 20,
  },
  menuSubText: {
    color: '#666666',
    letterSpacing: -0.84,
    marginBottom: 14,
    marginHorizontal: 24,
    lineHeight: 20,
  },
});

const MedicationGuideDetails = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.textArea}>
          <EumcText style={[styles.guideText, styles.pd20]}>
            본 안내문은 FirstDIS에서 제공 받은 정보로 병원 또는 외부 약국에서 받으신 복약 안내문의 내용과 약간의 차이가
            있을 수 있습니다.
          </EumcText>
          <EumcText style={[styles.guideText, styles.borderText]}>스카이셀플루 4가 프리필드시린지 (주사제)</EumcText>

          <Image
            style={[{ height: 160, width: windowWidth - 48, marginBottom: 10, marginHorizontal: 8 }]}
            source={require('../../assets/sample/img_sample.png')}
          />

          <View style={styles.flexLayout}>
            <View style={styles.menuIconArea}>
              <ImageBackground style={styles.menuIcon} source={require('../../assets/ic_point_muru.png')} />
            </View>
            <EumcText style={styles.menuText}>성분 정보</EumcText>
          </View>
          <EumcText style={styles.menuSubText}>에스케이바이오사이언스(주)</EumcText>

          <View style={styles.flexLayout}>
            <View style={styles.menuIconArea}>
              <ImageBackground style={styles.menuIcon} source={require('../../assets/ic_point_muru.png')} />
            </View>
            <EumcText style={styles.menuText}>효능·효과</EumcText>
          </View>
          <EumcText style={styles.menuSubText}>백신류</EumcText>

          <View style={styles.flexLayout}>
            <View style={styles.menuIconArea}>
              <ImageBackground style={styles.menuIcon} source={require('../../assets/ic_point_muru.png')} />
            </View>
            <EumcText style={styles.menuText}>보관 방법</EumcText>
          </View>
          <EumcText style={styles.menuSubText}>밀봉용기, 차광하여 2~8℃에서 동결을 피하여 보관</EumcText>

          <View style={styles.flexLayout}>
            <View style={styles.menuIconArea}>
              <ImageBackground style={styles.menuIcon} source={require('../../assets/ic_point_muru.png')} />
            </View>
            <EumcText style={styles.menuText}>복약 안내</EumcText>
          </View>
          <EumcText style={styles.menuSubText}>
            1. 이 약은 전문 의료진에 의해 근육에 투여합니다.{'\n'}
            2. 두통, 근육통, 피로감, 무력감, 주사 부위 통증/붉어짐 등이 나타날수 있습니다.
          </EumcText>
        </View>
      </ScrollView>
    </View>
  );
};

export default MedicationGuideDetails;
