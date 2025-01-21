import { View, StyleSheet, Image } from 'react-native';
import { useContext } from 'react';
import { EumcText } from '../../components';
import { UserContext } from '../../context';

const ReserveInfo = () => {
  const { code, rsvInfo } = useContext(UserContext);
  const date = rsvInfo.date?.replace(/-/g, '.');

  return (
    <View style={styles.boxContainer}>
      <View style={styles.faceBox}>
        {rsvInfo.doctor.PROFILE && <Image src={rsvInfo.doctor.PROFILE} style={styles.faceBoxImg} />}
      </View>
      <View style={styles.description}>
        <EumcText style={styles.name} fontWeight="bold">
          {rsvInfo.doctor.DR_NM} 교수
        </EumcText>
        <View style={styles.boxTitleContainer}>
          <EumcText fontWeight="regular" style={styles.boxTitle}>
            병원
          </EumcText>
          <EumcText fontWeight="regular" style={styles.boxItem}>
            {code === '01' ? '이대서울병원' : '이대목동병원'}
          </EumcText>
        </View>
        <View style={styles.boxTitleContainer}>
          <EumcText fontWeight="regular" style={styles.boxTitle}>
            진료과
          </EumcText>
          <EumcText fontWeight="regular" style={styles.boxItem}>
            {rsvInfo.department.cdvalue}
          </EumcText>
        </View>
        <View style={styles.boxTitleContainer}>
          <EumcText fontWeight="regular" style={styles.boxTitle}>
            진료분야
          </EumcText>
          <EumcText fontWeight="regular" style={styles.boxItem} textEclipse={2}>
            {rsvInfo.doctor.DESC}
          </EumcText>
        </View>
        {rsvInfo.date && (
          <View style={styles.boxTitleContainer}>
            <EumcText style={styles.boxTitle}>날짜</EumcText>
            <EumcText style={styles.boxItem}>{date}</EumcText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 19,
    paddingBottom: 18,
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
  boxTitleContainer: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  boxTitle: {
    width: 60,
    lineHeight: 20,
    fontSize: 14,
    color: '#939598',
  },
  boxItem: {
    width: 183,
    lineHeight: 20,
    fontSize: 14,
    color: '#231f20',
  },
});

export default ReserveInfo;
