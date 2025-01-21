import { View, StyleSheet, ImageBackground, Dimensions, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import EumcText from './EumcText';
const width = Dimensions.get('window').width - 20;

const styles = StyleSheet.create({
  arrowIconArea: {
    width: 24,
    height: 24,
  },
  arrowIcon: {
    width: '100%',
    height: '100%',
  },
  arrowLeft: {
    marginLeft: 50,
  },
  arrowRight: {
    marginRight: 50,
  },
  disabled: { color: '#bcbec0' },
  day: { marginLeft: 6, fontSize: 12, lineHeight: 12, color: '#231f20' },
  dayContainer: {
    height: width / 7,
    width: width / 7,
    marginVertical: -7,
    width: '100%',
    paddingTop: 6,
  },
});

const CalendarRangeSelect = ({ focusDate, forceUpdate, markedDates, onDayPress }) => {
  return (
    <Calendar
      markingType="period"
      monthFormat="yyyy년 M월"
      markedDates={markedDates}
      current={focusDate || ''}
      key={forceUpdate}
      renderArrow={dir =>
        dir === 'left' ? (
          <View style={[styles.arrowIconArea, styles.arrowLeft]}>
            <ImageBackground source={require('../assets/ic_keyboard_left.png')} style={styles.arrowIcon} />
          </View>
        ) : (
          <View style={[styles.arrowIconArea, styles.arrowRight]}>
            <ImageBackground source={require('../assets/ic_keyboard_right.png')} style={styles.arrowIcon} />
          </View>
        )
      }
      theme={{
        'stylesheet.calendar.header': {
          dayHeader: {
            alignItems: 'flex-start',
            fontSize: 12,
            height: width / 7,
            width: width / 7,
            marginVertical: -7.5,
            marginLeft: 14,
            paddingVertical: 7,
          },
          dayTextAtIndex0: { color: '#f1668d' },
          dayTextAtIndex1: { color: '#231f20' },
          dayTextAtIndex2: { color: '#231f20' },
          dayTextAtIndex3: { color: '#231f20' },
          dayTextAtIndex4: { color: '#231f20' },
          dayTextAtIndex5: { color: '#231f20' },
          dayTextAtIndex6: { color: '#3cb4e7' },
        },
        textMonthFontFamily: 'NotoSansKR-Bold',
        textMonthFontSize: 18,
        textDayHeaderFontSize: 12,
      }}
      dayComponent={({ date, state, marking }) => {
        const day = new Date(date.timestamp).getDay();
        const containerStyle = marking?.container || {};
        const textStyle = marking?.text || {};
        if (marking?.selected === true) Object.assign(textStyle, { color: '#fff' });
        else if (state === 'disabled') Object.assign(textStyle, styles.disabled);
        else if (day === 0) Object.assign(textStyle, { color: '#f1668d' });
        else if (day === 6) Object.assign(textStyle, { color: '#3cb4e7' });

        return (
          <Pressable style={[styles.dayContainer, containerStyle]} onPress={() => onDayPress(date)}>
            <EumcText style={[styles.day, textStyle]}>{date.day}</EumcText>
          </Pressable>
        );
      }}
    />
  );
};

export default CalendarRangeSelect;
