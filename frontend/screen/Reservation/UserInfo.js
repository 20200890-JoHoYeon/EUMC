import { View, Pressable, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { EumcText } from '../../components';
import { UserContext } from '../../context';
import { Color } from '../../styles';
import { SquareRoundLabelBtn } from '../../components/Buttons';
import { labelStyle } from '../../utils';

const UserInfo = ({ navigation }) => {
  const { code, rsvInfo } = useContext(UserContext);
  const { name, patientNumber, relationship } = rsvInfo;
  const labelProps = labelStyle(relationship);
  return (
    rsvInfo && (
      <View style={styles.userContainer}>
        <View style={styles.userTopContainer}>
          <EumcText fontWeight="regular" style={styles.userText1}>
            환자명
          </EumcText>
          <EumcText fontWeight="regular" style={styles.userText2}>
            {name}({patientNumber})
          </EumcText>
          {relationship && <SquareRoundLabelBtn {...labelProps} title={relationship} />}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Pressable
              style={{ borderRadius: 10, backgroundColor: '#939598' }}
              onPress={() => navigation.navigate('MedicalCardList', { mode: 'change' })}
            >
              <EumcText fontWeight="regular" style={styles.userText3}>
                진료카드변경
              </EumcText>
            </Pressable>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <EumcText fontWeight="regular" style={styles.userText1}>
            병원
          </EumcText>
          <EumcText fontWeight="regular" style={styles.userText2}>
            {code === '01' ? '이대서울병원' : '이대목동병원'}
          </EumcText>
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 26,
    paddingVertical: 18,
  },
  userTopContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center',
  },
  userText1: {
    fontSize: 14,
    color: '#939598',
    width: 59,
    textAlign: 'left',
    lineHeight: 20,
  },
  userText2: {
    fontSize: 14,
    color: '#231f20',
    paddingRight: 5,
    lineHeight: 20,
  },
  userText3: {
    fontSize: 10,
    color: Color.homeColor.primaryWhite,
    paddingHorizontal: 9,
    paddingVertical: 3,
    lineHeight: 15,
  },
  userSelfContainer: {
    backgroundColor: 'rgba(177,236,233, 0.5)',
    paddingHorizontal: 13,
    paddingVertical: 3,
    borderRadius: 3,
  },
  userSelf: {
    fontSize: 10,
    color: '#0e6d68',
    lineHeight: 15,
  },
});

export default UserInfo;
