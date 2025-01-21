import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import isaac from 'isaac';
import { BottomTwoBtn, RoundBtn } from '../../components/Buttons';
import { Color } from '../../styles';
import { CalendarRangeSelect, EumcText } from '../../components';
import { formatDate } from '../../utils';
import { ALLOWED_SCREENS } from '../../constants';
import { UserContext } from '../../context';
import { ScrollView } from 'react-native';

const width = Dimensions.get('window').width;

const defaultCalendarStyle = {
  selected: true,
  text: { color: '#fff' },
  container: { backgroundColor: Color.calendar.darkgreen2 },
};

const styles = StyleSheet.create({
  container: { backgroundColor: Color.homeColor.primaryWhite },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 8,
  },
  rangeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Color.calendar.teal,
    paddingVertical: 10,
  },
  rangeTextContainerActive: {
    backgroundColor: Color.calendar.darkgreen2,
    borderColor: Color.calendar.darkgreen2,
  },
  rangeText: {
    color: Color.calendar.darkgreen2,
    fontSize: 14,
    lineHeight: 20,
  },
  blackText: {
    color: '#000000',
    fontSize: 14,
    lineHeight: 20,
  },
  colorWhite: {
    color: Color.homeColor.primaryWhite,
  },
  rangeTextNull: {
    color: Color.homeColor.primaryBlack,
  },
  rangeTextActive: {
    color: Color.calendar.darkgreen2,
  },
  quickSelectContainer: {
    paddingHorizontal: 16,
  },
  calendarContainer: {
    paddingHorizontal: 10,
  },
  button: {
    width: width / 4 - 12,
    backgroundColor: Color.calendar.lightGray,
    borderRadius: 4,
  },
  buttonActive: {
    borderWidth: 1,
    borderColor: '#494b4e',
    backgroundColor: '#fff',
  },
  buttonTextActive: {
    color: '#231f20',
  },
  buttonText: {
    textAlign: 'center',
    color: Color.calendar.gray,
    fontSize: 14,
    fontWeight: 'normal',
  },
  unknow: {
    marginTop: 12,
    height: 8,
    backgroundColor: '#f5f5f5',
  },
});

const History = ({ navigation, type }) => {
  if (!ALLOWED_SCREENS.includes(type)) {
    throw new Error('알 수 없는 조회 페이지 유형입니다.');
  }

  const dayFormat = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const yearMonthDate = `${year}년 ${month}월 ${day}일`;
    return yearMonthDate;
  };

  const now = new Date();
  const todayStr = formatDate(now);
  const [calData, setCalData] = useState({ start: { date: null, active: true }, end: { date: null, active: false } });
  const [dateRange, setDateRange] = useState();
  const [focusDate, setFocusDate] = useState({ date: todayStr, key: 0 });
  const { setLoadingVisible } = useContext(UserContext);

  const dayGroup = ['당일', '1주일', '1개월', '3개월'];
  const [selectedDay, setSelectedDay] = useState('');
  //console.log(dayFormat(new Date(calData.start.date)));

  const setMonthCal = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    setCalData({
      start: { date: formatDate(monthAgo), active: false },
      end: { date: todayStr, active: false },
    });
    const range = { [formatDate(monthAgo)]: { ...defaultCalendarStyle } };
    for (let i = 1; i < 31; i++) {
      monthAgo.setDate(monthAgo.getDate() + 1);
      range[formatDate(monthAgo)] = {
        container: { backgroundColor: Color.calendar.mintCream, borderWidth: 2, borderColor: '#d7fff4' },
      };
      if (monthAgo.getDate() === now.getDate()) break;
    }
    range[todayStr] = { ...defaultCalendarStyle };
    setFocusDate({ date: todayStr, key: isaac.random() });
    setDateRange(range);
    setSelectedDay(dayGroup[2]);
  };

  useEffect(() => {
    setMonthCal();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.quickSelectContainer}>
          <View style={styles.buttonContainer}>
            <RoundBtn
              style={[styles.button, selectedDay === '당일' ? styles.buttonActive : '']}
              titleStyle={[styles.buttonText, selectedDay === '당일' ? styles.buttonTextActive : '']}
              buttonType="calendar"
              title="당일"
              fontWeight="Medium"
              onPress={() => {
                setFocusDate({ date: todayStr, key: isaac.random() });
                setDateRange({
                  [todayStr]: {
                    // startingDay: true,
                    // endingDay: true,
                    ...defaultCalendarStyle,
                  },
                });
                setCalData({
                  start: { date: todayStr, active: false },
                  end: { date: todayStr, active: false },
                });
                setSelectedDay(dayGroup[0]);
              }}
            />
            <RoundBtn
              style={[styles.button, selectedDay === '1주일' ? styles.buttonActive : '']}
              titleStyle={[styles.buttonText, selectedDay === '1주일' ? styles.buttonTextActive : '']}
              title="1주일"
              buttonType="calendar"
              fontWeight="Medium"
              onPress={() => {
                const weekAgo = new Date(now.getTime() - 86400000 * 6);
                setCalData({
                  start: { date: formatDate(weekAgo), active: false },
                  end: { date: todayStr, active: false },
                });
                const range = { [formatDate(weekAgo)]: { ...defaultCalendarStyle } };
                for (let i = 1; i < 7; i++) {
                  weekAgo.setDate(weekAgo.getDate() + 1);
                  range[formatDate(weekAgo)] = {
                    container: { backgroundColor: Color.calendar.mintCream, borderWidth: 2, borderColor: '#d7fff4' },
                  };
                }
                range[todayStr] = { ...defaultCalendarStyle };
                setFocusDate({ date: todayStr, key: isaac.random() });
                setDateRange(range);
                setSelectedDay(dayGroup[1]);
              }}
            />
            <RoundBtn
              style={[styles.button, selectedDay === '1개월' ? styles.buttonActive : '']}
              titleStyle={[styles.buttonText, selectedDay === '1개월' ? styles.buttonTextActive : '']}
              title="1개월"
              buttonType="calendar"
              fontWeight="Medium"
              onPress={() => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                setCalData({
                  start: { date: formatDate(monthAgo), active: false },
                  end: { date: todayStr, active: false },
                });
                const range = { [formatDate(monthAgo)]: { ...defaultCalendarStyle } };
                for (let i = 1; i < 31; i++) {
                  monthAgo.setDate(monthAgo.getDate() + 1);
                  range[formatDate(monthAgo)] = {
                    container: { backgroundColor: Color.calendar.mintCream, borderWidth: 2, borderColor: '#d7fff4' },
                  };
                  if (monthAgo.getDate() === now.getDate()) break;
                }
                range[todayStr] = { ...defaultCalendarStyle };
                setFocusDate({ date: todayStr, key: isaac.random() });
                setDateRange(range);
                setSelectedDay(dayGroup[2]);
              }}
            />
            <RoundBtn
              style={[styles.button, selectedDay === '3개월' ? styles.buttonActive : '']}
              titleStyle={[styles.buttonText, selectedDay === '3개월' ? styles.buttonTextActive : '']}
              title="3개월"
              buttonType="calendar"
              fontWeight="Medium"
              onPress={() => {
                const monthsAgo = new Date();
                monthsAgo.setMonth(monthsAgo.getMonth() - 3);
                setCalData({
                  start: { date: formatDate(monthsAgo), active: false },
                  end: { date: todayStr, active: false },
                });
                const range = {
                  [formatDate(monthsAgo)]: {
                    selected: true,
                    ...defaultCalendarStyle,
                  },
                };
                for (let i = 1; i < 100; i++) {
                  monthsAgo.setDate(monthsAgo.getDate() + 1);
                  range[formatDate(monthsAgo)] = {
                    container: { backgroundColor: Color.calendar.mintCream, borderWidth: 2, borderColor: '#d7fff4' },
                  };
                  if (monthsAgo.getMonth() === now.getMonth() && monthsAgo.getDate() === now.getDate()) break;
                }
                range[todayStr] = { ...defaultCalendarStyle };
                setFocusDate({ date: todayStr, key: isaac.random() });
                setDateRange(range);
                setSelectedDay(dayGroup[3]);
              }}
            />
          </View>
          <View
            style={[
              styles.rangeTextContainer,
              calData.start.date && calData.end.date ? styles.rangeTextContainerActive : null,
            ]}
          >
            <Pressable
              onPress={() => {
                setCalData({
                  start: { date: null, active: true },
                  end: { date: null, active: false },
                });
                setDateRange({});
              }}
            >
              <EumcText
                style={[
                  styles.rangeText,
                  calData.start?.active
                    ? styles.rangeTextActive
                    : calData.start.date && calData.end.date
                    ? { color: Color.homeColor.primaryWhite }
                    : styles.rangeTextNull,
                ]}
              >
                {calData.start.date ? dayFormat(new Date(calData.start.date)) : '시작일 선택'}
              </EumcText>
            </Pressable>
            <EumcText style={[styles.blackText, calData.start.date && calData.end.date ? styles.colorWhite : null]}>
              -
            </EumcText>
            <Pressable
              onPress={() => {
                setCalData({
                  start: { date: calData.start.date, active: false },
                  end: { date: null, active: true },
                });
                setDateRange({ [calData.start.date]: { ...defaultCalendarStyle } });
              }}
            >
              <EumcText
                style={[
                  styles.rangeText,
                  calData.end?.active
                    ? styles.rangeTextActive
                    : calData.start.date && calData.end.date
                    ? { color: Color.homeColor.primaryWhite }
                    : styles.rangeTextNull,
                ]}
              >
                {calData.end.date ? dayFormat(new Date(calData.end.date)) : '종료일 선택'}
              </EumcText>
            </Pressable>
          </View>
        </View>
        <View style={styles.unknow}></View>
        <View style={styles.calendarContainer}>
          <CalendarRangeSelect
            initialDate={now}
            focusDate={focusDate.date}
            forceUpdate={focusDate.key}
            markedDates={dateRange}
            onDayPress={day => {
              setSelectedDay('');
              if (calData.end.active) {
                // 끝 날짜 선택
                setCalData({
                  ...calData,
                  end: { date: day.dateString, active: false },
                });
                const newRange = {};
                const [dateString] = Object.entries(dateRange)[0];
                const date = new Date(dateString);
                if (calData.start.date === day.dateString) {
                  setDateRange({ [formatDate(date)]: { ...defaultCalendarStyle } });
                  return;
                }
                // 선택한 끝 날짜가 시작 날짜보다 클 때
                if (day.timestamp - date.getTime() > 0) {
                  // 시작 날짜 설정
                  newRange[formatDate(date)] = { ...defaultCalendarStyle };
                  // 시작 날짜부터 끝 날짜까지 하루씩 더해가며 날짜 선택/추가
                  while (day.timestamp - date.getTime() > 0) {
                    date.setDate(date.getDate() + 1);
                    newRange[formatDate(date)] = {
                      container: { backgroundColor: Color.calendar.mintCream, borderWidth: 2, borderColor: '#d7fff4' },
                    };
                  }
                  // 끝 날짜 생성
                  newRange[formatDate(date)] = { ...defaultCalendarStyle };
                } else {
                  // 선택한 끝 날짜가 시작 날짜보다 작을 때
                  // 시작 날짜와 끝 날짜를 바꿔(swap) 시작 날짜가 적게 설정
                  setCalData({
                    start: { date: day.dateString, active: false },
                    end: { date: calData.start.date, active: false },
                  });
                  newRange[formatDate(date)] = { ...defaultCalendarStyle };
                  // 시작 날짜가 크기때문에 하루씩 빼가며 날짜 선택/추가
                  while (day.timestamp - date.getTime() < 0) {
                    date.setDate(date.getDate() - 1);
                    newRange[formatDate(date)] = {
                      container: { backgroundColor: Color.calendar.mintCream, borderWidth: 2, borderColor: '#d7fff4' },
                    };
                  }
                  newRange[formatDate(date)] = {
                    ...newRange[formatDate(date)],
                    ...defaultCalendarStyle,
                  };
                }
                setDateRange(newRange);
              } else {
                setCalData({
                  start: { date: day.dateString, active: false },
                  end: { date: null, active: true },
                });
                setDateRange({ [day.dateString]: { ...defaultCalendarStyle } });
              }
            }}
          />
        </View>
      </ScrollView>
      <View style={{}}>
        {calData.start.date && calData.end.date ? (
          <BottomTwoBtn
            leftTitle="취소"
            rightTitle="조회"
            onNext={() => {
              if (calData.start.date && calData.end.date) {
                setLoadingVisible(true);
                navigation.push(`${type}HistoryDetail`, { calData });
              }
            }}
            onCancel={() => navigation.goBack()}
          />
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};
export default History;
