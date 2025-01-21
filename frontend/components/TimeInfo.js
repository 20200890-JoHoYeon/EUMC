import { StyleSheet, View } from 'react-native';
import EumcText from './EumcText';

const styles = StyleSheet.create({
  type01: {
    marginBottom: 5,
    maxWidth: 60,
    backgroundColor: '#e3e4e5',
    borderRadius: 4,
  },
  textType01: {
    paddingTop: 4,
    paddingBottom: 4,
    fontSize: 12,
    color: '#6d6e71',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 17,
  },
  type02: {
    width: 36,
    marginRight: 6,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#939598',
    borderRadius: 2,
    boxSizing: 'border-box',
  },
  textType02: {
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: -0.6,
    color: '#939598',
    lineHeight: 15,
  },
  type03: {
    width: 36,
    marginRight: 6,
    paddingTop: 1,
    paddingBottom: 1,
    backgroundColor: '#939598',
    borderWidth: 1,
    borderColor: '#939598',
    borderRadius: 2,
    boxSizing: 'border-box',
  },
  textType03: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 17,
  },
  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeText: {
    color: '#231f20',
    fontSize: 12,
    lineHeight: 17,
  },
  lightTealColor: {
    backgroundColor: '#f1fffb',
  },
});

const TimeInfo = props => {
  return (
    <View>
      <View style={[styles.type01, props.backgroundColor === 'lightTeal' ? styles.lightTealColor : ' ']}>
        <EumcText style={styles.textType01} fontWeight="bold">
          {props.title}
        </EumcText>
      </View>
      <View style={styles.flexLayout}>
        <View style={styles.type02}>
          <EumcText style={styles.textType02} fontWeight="Regular">
            평일
          </EumcText>
        </View>
        <EumcText style={styles.timeText} fontWeight="">
          {props.weekDate}
        </EumcText>
      </View>
      <View style={styles.flexLayout}>
        <View style={styles.type03}>
          <EumcText style={styles.textType03} fontWeight="Regular">
            토요일
          </EumcText>
        </View>
        <EumcText style={styles.timeText} fontWeight="">
          {props.WeekendDate}
        </EumcText>
      </View>
    </View>
  );
};

export default TimeInfo;
