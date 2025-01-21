import { Dimensions, View, StyleSheet, ImageBackground, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import ReserveInfo from './ReserveInfo';
import { BottomOneBtn } from '../../components/Buttons';
import EumcText from '../../components//EumcText';
import { Color, Typography } from '../../styles';
import { UserContext } from '../../context';
import { getScheduleDateList } from '../../api/v1/reservation';

const width = Dimensions.get('window').width - 20;
const SelectDate = ({ navigation }) => {
  const today = new Date();
  const now = Date.now();
  const [ym, setYm] = useState(`${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dates, setDates] = useState([]);
  const { code, loadingVisible, setLoadingVisible, setToast, rsvInfo, setRsvInfo } = useContext(UserContext);
  const { department, doctor } = rsvInfo;

  const refresh = () => {
    if (code && department.cdcode && ym) {
      setLoadingVisible(true);
      setSelectedDate(null);
      // setDates([{ MED_DT: '2023-03-29', HOLY_YN: 'N' }]); // 샘플 확인 후 삭제
      getScheduleDateList(code, department.cdcode,doctor.DR_SID, ym)
        .then(res => {
          const { ok, data } = res.data;
          if (ok)
            setDates(
              data.filter(val => val.MEDR_SID === doctor.DR_SID && val.MED_RSV_YN === 'Y' && val.NSP_RSN_TP_CD === 'N')
            );
        })
        .catch(e => {
          console.log(e.response.data);
          setToast({ type: 'error', text1: '서버 에러', text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.' });
        })
        .finally(() => setLoadingVisible(false));
    } else console.log(code, department.cdcode, ym);
  };

  const onRefresh = useCallback(() => {
    refresh();
  }, []);

  useEffect(() => {
    refresh();
  }, [ym]);

  return (
    <View style={styles.container}>
      <ReserveInfo />
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={loadingVisible} onRefresh={onRefresh} />}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <Calendar
            markingType="period"
            monthFormat="yyyy년 M월"
            markedDates={
              selectedDate
                ? Object.assign(
                    dates.reduce(
                      (obj, val) =>
                        new Date(val.MED_DT).getTime() > now &&
                        val.HOLY_YN === 'N' &&
                        Object.assign(obj, {
                          [val.MED_DT]: {
                            container: {
                              backgroundColor: '#b1ece9',
                              borderWidth: 2,
                              borderColor: '#d7fff4',
                            },
                            text: { color: Color.calendar.mintCream },
                          },
                        }),
                      {}
                    ),
                    { [selectedDate.dateString]: { selected: true, text: { color: Color.calendar.darkgreen2 } } }
                  )
                : dates.reduce(
                    (obj, val) =>
                      new Date(val.MED_DT).getTime() > now &&
                      val.HOLY_YN === 'N' &&
                      Object.assign(obj, {
                        [val.MED_DT]: {
                          container: {
                            backgroundColor: '#b1ece9',
                            borderWidth: 2,
                            borderColor: '#d7fff4',
                          },
                        },
                      }),
                    {}
                  )
            }
            onMonthChange={mon =>
              mon.timestamp + 86400000 > now && setYm(`${mon.year}${String(mon.month).padStart(2, '0')}`)
            }
            renderArrow={dir =>
              dir === 'left' ? (
                <View style={[styles.arrowIconArea, styles.arrowLeft]}>
                  <ImageBackground
                    source={require('../../assets/ic_keyboard_left.png')}
                    style={styles.arrowIcon}
                  ></ImageBackground>
                </View>
              ) : (
                <View style={[styles.arrowIconArea, styles.arrowRight]}>
                  <ImageBackground
                    source={require('../../assets/ic_keyboard_right.png')}
                    style={styles.arrowIcon}
                  ></ImageBackground>
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
              else {
                Object.assign(textStyle, { color: '#000' });
              }

              return (
                <Pressable
                  style={[
                    styles.dayContainer,
                    containerStyle,
                    marking?.selected === true ? { backgroundColor: '#0e6d68' } : '',
                  ]}
                  onPress={() => {
                    if (
                      date.timestamp > now &&
                      dates.findIndex(val => val.HOLY_YN === 'N' && val.MED_DT === date.dateString) >= 0
                    )
                      setSelectedDate(date);
                  }}
                >
                  <EumcText style={[styles.day, textStyle]}>{date.day}</EumcText>
                </Pressable>
              );
            }}
          />
        </View>
        <View
          style={{
            paddingTop: 18,
            paddingBottom: 43,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ width: 14, height: 14, backgroundColor: '#b1ece9', borderColor: '#d7fff4', borderWidth: 1 }} />
          <EumcText
            style={{ fontSize: 12, color: Color.homeColor.primaryTurquoise, lineHeight: 18, marginLeft: 7 }}
            fontWeight="regular"
          >
            예약 가능
          </EumcText>
        </View>
      </ScrollView>

      <BottomOneBtn
        disabled={selectedDate ? false : true}
        rightTitle={`${
          (selectedDate &&
            new Date(selectedDate?.dateString).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })) ||
          ''
        } 예약하기`}
        onNext={() => {
          if (selectedDate) {
            setRsvInfo(
              Object.assign(rsvInfo, {
                date: selectedDate.dateString,
                schedule: dates.filter(val => val.MED_DT === selectedDate.dateString),
              })
            );
            navigation.navigate('SelectTime');
          } else setToast({ type: 'error', text1: '필수 선택', text2: '날짜를 선택하셔야 합니다.' });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  bottomButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
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
  day: { marginLeft: 6, /*marginTop: -13,*/ fontSize: 12, lineHeight: 12, color: '#231f20' },
  dayContainer: {
    height: width / 7,
    width: width / 7,
    marginVertical: -7,
    //  width: '100%',
    paddingTop: 6,
  },
  /* modal */
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    marginBottom: 5,
  },
  ...Typography,
});

export default SelectDate;
