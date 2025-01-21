import { StyleSheet, View, Pressable, ImageBackground, Image, Text, RefreshControl } from 'react-native';
import { Color } from '../styles';
import EumcText from './EumcText';
import { useContext } from 'react';
import { UserContext } from '../context';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: Color.homeColor.primaryWhite,
  },
  listContent: {
    flexDirection: 'row',
  },
  shapeArea: {
    alignItems: 'center',
  },
  circleShape: {
    width: 11,
    height: 11,
    borderRadius: 10,
    backgroundColor: Color.homeColor.primaryWhite,
    borderWidth: 2,
    borderColor: '#16aea6',
  },
  lineShape: {
    width: 1,
    flex: 1,
    backgroundColor: '#c5c5c5',
  },
  infoContent: {
    flex: 1,
    marginLeft: 8,
  },
  timeText: {
    fontSize: 14,
    lineHeight: 15,
    paddingBottom: 9,
  },
  infoArea: {
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: Color.homeColor.primaryWhite,
    shadowColor: '#222222',
    shadowRadius: 10,
    shadowOpacity: 0.11,
    elevation: 5,
  },
  infoFlexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  professorInfoArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  professorImgArea: {
    marginRight: 17,
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#eeeeee',
    borderRadius: 6,
  },
  professorImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeText: {
    color: '#231f20',
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'NotoSansKR-Bold',
  },
  professorText: {
    color: '#231f20',
    fontSize: 14,
    lineHeight: 20,
  },
  medicalConditionArea: {
    marginBottom: 3,
    paddingTop: 3,
    paddingLeft: 13,
    paddingBottom: 3,
    paddingRight: 13,
    borderRadius: 3,
  },
  medicalConditionText: {
    fontSize: 10,
    lineHeight: 15,
  },
  patientText: {
    color: '#a2a2a2',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  arrivalStateBtn: {
    marginTop: 12,
    paddingTop: 9,
    paddingBottom: 9,
    borderRadius: 20,
    textAlign: 'center',
    alignItems: 'center',
  },
  arrivalStateText: {
    fontSize: 14,
    lineHeight: 20,
  },
  todayText: {
    paddingTop: 19,
    paddingRight: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  colorGray: {
    color: Color.homeColor.primaryGray,
  },
  disabled: {
    backgroundColor: Color.homeColor.primaryGray,
  },
  ...Color.ticketListColor,
  ...Color.opacityColor,
  ...Color.borderColor,
});

/**
 *   data
 *   DEPT_NM : string;//진료과명
 *   MEDR_NM : string;//진료의명
 *   MED_DT : string;//진료일자
 *   MED_TM : string;//진료일시
 *   SEL_TYPE : string;//진료/검사 구분
 */

const ScheduleList = ({ data, modal, type, cancelState, callText, callStatus, disabled = false }) => {
  // console.log(`DATA : ${JSON.stringify(data)}`)



  const { code, loadingVisible } = useContext(UserContext);

  /**
   * @param {도착여부} arrival
   */
  const arrivalButtonType = (arrival, placeText, id) => {

    let msg = callText.get(id);
    let status = callStatus.get(id);
    if(typeof(msg) == 'undefined'){
      msg = '도착확인 요청이 완료되었습니다.';
    }else{
      if(!arrival) {
        arrival = true;
      }
    }

    if (type === 'today') {
      if ( Number(status) > 1) {
        return (
          <Pressable style={[styles.backGroundTeal, styles.arrivalStateBtn, styles.borderRed]}>
            <EumcText style={[styles.arrivalStateText, styles.colorRed]} fontWeight="bold">
              {msg}
            </EumcText>
          </Pressable>
        );
      } else {
        return (
          <Pressable
            //  disabled={disabled}
            style={[styles.arrivalStateBtn, disabled ? styles.disabled : styles.backGroundTeal]}
            onPress={() => modal(placeText, id)}
          >
            <EumcText style={[styles.arrivalStateText, styles.colorWhite]} fontWeight="bold">
              도착 확인하기
            </EumcText>
          </Pressable>
        );
      }
    } else {
      return <EumcText></EumcText>;
    }
  };

  const cancelButtonType = (id, dept_cd, dept_nm, sel_type) => {
    if (type === 'upcoming' && sel_type === '진료') {
      return (
        <Pressable style={[styles.borderGray, styles.arrivalStateBtn]} onPress={() => modal(id, dept_cd, dept_nm)}>
          <EumcText style={[styles.arrivalStateText, styles.colorGray]} fontWeight="bold">
            예약 취소
          </EumcText>
        </Pressable>
      );
    } else {
      return <EumcText></EumcText>;
    }
  };

  /**
   * @param {진료타입} diagnoseElement
   * 검사, 진료
   */
  const diagnoseElement = diagnose => {
    switch (diagnose) {
      case '검사':
        return (
          <View style={[styles.medicalConditionArea, styles.backGroundOpacityTeal, styles.transparency]}>
            <EumcText style={[styles.medicalConditionText, styles.colorTeal]}>{diagnose}</EumcText>
          </View>
        );
      case '진료':
        return (
          <View style={[styles.medicalConditionArea, styles.backGroundOpacityOrange, styles.transparency]}>
            <EumcText style={[styles.medicalConditionText, styles.colorOrange]}>{diagnose}</EumcText>
          </View>
        );
      default:
        return <EumcText></EumcText>;
    }
  };

  // /**
  //  * @param {일정타입} type
  //  * upcoming : 다가오는 일정
  //  */
  // const reservationDate = type => {
  //   if (data.length === 0) {
  //     return;
  //   }
  //   const yearMonthDate = data[0].MED_DT;
  //
  //   if (type === 'upcoming')
  //     return (
  //       <EumcText style={styles.todayText} fontWeight="bold">
  //         {yearMonthDate}
  //       </EumcText>
  //     );
  //   else return;
  // };

  const scheduleDataList = [];
  let date = '';

  data.map((scheduleData, index) => {
    if (type === 'upcoming' && date !== scheduleData.MED_DT) {
      date = scheduleData.MED_DT;
      scheduleDataList.push(
        <EumcText key={`t${index}`} style={styles.todayText} fontWeight="bold">
          {date}
        </EumcText>
      );
    }

    let buttonLayout;
    if (type === 'upcoming') {
      buttonLayout = cancelButtonType(scheduleData.RPY_PACT_ID, scheduleData.MED_DEPT_CD, scheduleData.DEPT_NM, scheduleData.SEL_TYPE);
    } else if ('today') {
      if (code == '02') {
        buttonLayout = arrivalButtonType(
          scheduleData.ARRIVED_YN === 'Y',
          scheduleData.DEPT_NM,
          scheduleData.RPY_PACT_ID
        );
      }
    }

    scheduleDataList.push(
      <View key={index} style={styles.listContent}>
        <View style={styles.shapeArea}>
          <View style={styles.circleShape}></View>
          <View style={styles.lineShape}></View>
        </View>

        <View style={styles.infoContent}>
          <EumcText style={styles.timeText}>{scheduleData.MED_TM}</EumcText>
          <View style={styles.infoArea}>
            <View style={styles.infoFlexLayout}>
              <View style={styles.professorInfoArea}>
                <View style={styles.professorImgArea}>
                  {scheduleData.PROFILE && <Image src={scheduleData.PROFILE} style={styles.professorImg} />}
                </View>
                <View>
                  <EumcText style={styles.placeText}>{scheduleData.DEPT_NM}</EumcText>
                  <EumcText style={styles.professorText}>{scheduleData.MEDR_NM || scheduleData.MED_NM} 교수</EumcText>
                </View>
              </View>

              <View>
                {diagnoseElement(scheduleData.SEL_TYPE)}
                <EumcText style={styles.patientText}>{scheduleData.patientType || '본인'}</EumcText>
              </View>
            </View>

            {buttonLayout}
          </View>
        </View>
      </View>
    );
  });

  return (
    data && (
      <View style={styles.container} refreshControl={<RefreshControl refreshing={loadingVisible} />}>
        {scheduleDataList}
      </View>
    )
  );
};
export default ScheduleList;
