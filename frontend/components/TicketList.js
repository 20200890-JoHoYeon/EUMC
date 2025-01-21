import { Dimensions, StyleSheet, View, Pressable } from 'react-native';
import { DEPT_NAME } from '../constants';
import { Color } from '../styles';
import EumcText from './EumcText';
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  ticketArea: {
    width: width / 2 - 18,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...Color.shadowColor.card2,
    minHeight: 125,
  },
  empty: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  floorArea: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 0,
    height: 0,
    borderTopWidth: 80,
    borderColor: '#f5f5f5',
    borderRightWidth: 80,
    borderRightColor: 'rgba(0, 0, 0, 0)',
    transform: 'rotate(135deg)',
  },
  floorText: {
    position: 'absolute',
    top: -4,
    left: 7,
    fontSize: 14,
    lineHeight: 40,
    textAlign: 'left',
  },
  ticketTitle: {
    paddingTop: 18,
    color: '#231f20',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 17,
    letterSpacing: -0.84,
    marginTop: 5,
  },
  waitingArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: 4,
  },
  waitingCount: {
    fontSize: 32,
    lineHeight: 45,
  },
  waitingStatus: {
    paddingBottom: 5,
    color: '#231f20',
    fontSize: 14,
    lineHeight: 30,
    marginTop: 10,
  },
  waitingLineHeight: {
    lineHeight: 20,
    marginLeft: -2,
  },
  NumberTicket: {
    backgroundColor: '#f7941e',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  NumberTicketText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingVertical: 9,
  },
  ticketNumber: {
    color: '#ffffff',
    fontSize: 50,
    lineHeight: 69,
  },
  ...Color.ticketListColor,
});

const ticketStyle = color =>
  StyleSheet.create({
    waitingCount: {
      color,
    },
  });

const TicketList = ({ data, modal, index }) => {
  const { kioskIp, name, locationName, floor, myNumber, waitingCount, ticketType } = data;

  const floorElement = floor => {
    switch (floor) {
      case 'B1':
        return (
          <EumcText style={[styles.floorText, styles.colorOrange]} fontWeight="bold">
            {floor}
          </EumcText>
        );
      case '1F':
        return (
          <EumcText style={[styles.floorText, styles.colorPurple]} fontWeight="bold">
            {floor}
          </EumcText>
        );
      case '2F':
        return (
          <EumcText style={[styles.floorText, styles.colorTeal]} fontWeight="bold">
            {floor}
          </EumcText>
        );
      case '3F':
        return (
          <EumcText style={[styles.floorText, styles.colorBlue]} fontWeight="bold">
            {floor}
          </EumcText>
        );
      case '4F':
        return (
          <EumcText style={[styles.floorText, styles.colorYellow]} fontWeight="bold">
            {floor}
          </EumcText>
        );
      default:
        return (
          <EumcText style={[styles.floorText, styles.colorDarkGreen]} fontWeight="bold">
            {floor}
          </EumcText>
        );
    }
  };

  const waitingCountElement = (floor, waitingCount) => {
    switch (floor) {
      case 'B1':
        return (
          <EumcText style={[styles.waitingCount, styles.colorOrange]} fontWeight="bold">
            {waitingCount}명{' '}
          </EumcText>
        );
      case '1F':
        return (
          <EumcText style={[styles.waitingCount, styles.colorPurple]} fontWeight="bold">
            {waitingCount}명{' '}
          </EumcText>
        );
      case '2F':
        return (
          <EumcText style={[styles.waitingCount, styles.colorTeal]} fontWeight="bold">
            {waitingCount}명{' '}
          </EumcText>
        );
      case '3F':
        return (
          <EumcText style={[styles.waitingCount, styles.colorBlue]} fontWeight="bold">
            {waitingCount}명{' '}
          </EumcText>
        );
      case '4F':
        return (
          <EumcText style={[styles.waitingCount, styles.colorYellow]} fontWeight="bold">
            {waitingCount}명{' '}
          </EumcText>
        );
      default:
        return (
          <EumcText style={[styles.waitingCount, styles.colorDarkGreen]} fontWeight="bold">
            {waitingCount}명{' '}
          </EumcText>
        );
    }
  };

  const ticketButtonElement = (floor, title, waitingCount, index) => {
    switch (floor) {
      case 'B1':
        return (
          <Pressable
            style={[styles.NumberTicket, styles.backGroundOrange]}
            onPress={() => modal(floor, title, waitingCount, index, locationName, myNumber)}
          >
            <EumcText style={styles.NumberTicketText} fontWeight="bold">
              번호표 발급
            </EumcText>
          </Pressable>
        );
      case '1F':
        return (
          <Pressable
            style={[styles.NumberTicket, styles.backGroundPurple]}
            onPress={() => modal(floor, title, waitingCount, index, locationName, myNumber)}
          >
            <EumcText style={styles.NumberTicketText} fontWeight="bold">
              번호표 발급
            </EumcText>
          </Pressable>
        );
      case '2F':
        return (
          <Pressable
            style={[styles.NumberTicket, styles.backGroundTeal]}
            onPress={() => modal(floor, title, waitingCount, index, locationName, myNumber)}
          >
            <EumcText style={styles.NumberTicketText} fontWeight="bold">
              번호표 발급
            </EumcText>
          </Pressable>
        );
      case '3F':
        return (
          <Pressable
            style={[styles.NumberTicket, styles.backgroundBlue]}
            onPress={() => modal(floor, title, waitingCount, index, locationName, myNumber)}
          >
            <EumcText style={styles.NumberTicketText} fontWeight="bold">
              번호표 발급
            </EumcText>
          </Pressable>
        );
      case '4F':
        return (
          <Pressable
            style={[styles.NumberTicket, styles.backgroundYellow]}
            onPress={() => modal(floor, title, waitingCount, index, locationName, myNumber)}
          >
            <EumcText style={styles.NumberTicketText} fontWeight="bold">
              번호표 발급
            </EumcText>
          </Pressable>
        );
      default:
        return '';
    }
  };

  const ticketAcceptElement = (floor, title, ticketNumber) => {
    switch (floor) {
      case 'B1':
        return (
          <View style={[styles.ticketArea, styles.backGroundOrange]}>
            <EumcText style={[styles.floorText, styles.colorWhite]} fontWeight="bold">
              {floor}
            </EumcText>
            <EumcText fontWeight="" style={[styles.ticketTitle, styles.colorWhite]}>
              {title}
            </EumcText>
            <View style={styles.waitingArea}>
              <EumcText style={styles.ticketNumber} fontWeight="bold">
                {ticketNumber}
              </EumcText>
              <EumcText fontWeight="" style={[styles.waitingStatus, styles.colorWhite]}>
                {' '}
                번
              </EumcText>
            </View>
          </View>
        );
      case '1F':
        return (
          <View style={[styles.ticketArea, styles.backGroundPurple]}>
            <EumcText style={[styles.floorText, styles.colorWhite]} fontWeight="bold">
              {floor}
            </EumcText>
            <EumcText style={[styles.ticketTitle, styles.colorWhite]}>{title}</EumcText>
            <View style={styles.waitingArea}>
              <EumcText style={styles.ticketNumber} fontWeight="bold">
                {ticketNumber}
              </EumcText>
              <EumcText style={[styles.waitingStatus, styles.colorWhite]}> 번</EumcText>
            </View>
          </View>
        );
      case '2F':
        return (
          <View style={[styles.ticketArea, styles.backGroundTeal]}>
            <EumcText style={[styles.floorText, styles.colorWhite]} fontWeight="bold">
              {floor}
            </EumcText>
            <EumcText style={[styles.ticketTitle, styles.colorWhite]}>{title}</EumcText>
            <View style={styles.waitingArea}>
              <EumcText style={styles.ticketNumber} fontWeight="bold">
                {ticketNumber}
              </EumcText>
              <EumcText style={[styles.waitingStatus, styles.colorWhite]}> 번</EumcText>
            </View>
          </View>
        );
      case '3F':
        return (
          <View style={[styles.ticketArea, styles.backgroundBlue]}>
            <EumcText style={[styles.floorText, styles.colorWhite]} fontWeight="bold">
              {floor}
            </EumcText>
            <EumcText style={[styles.ticketTitle, styles.colorWhite]}>{title}</EumcText>
            <View style={styles.waitingArea}>
              <EumcText style={styles.ticketNumber} fontWeight="bold">
                {ticketNumber}
              </EumcText>
              <EumcText style={[styles.waitingStatus, styles.colorWhite]}> 번</EumcText>
            </View>
          </View>
        );
      case '4F':
        return (
          <View style={[styles.ticketArea, styles.backgroundYellow]}>
            <EumcText style={[styles.floorText, styles.colorWhite]} fontWeight="bold">
              {floor}
            </EumcText>
            <EumcText style={[styles.ticketTitle, styles.colorWhite]}>{title}</EumcText>
            <View style={styles.waitingArea}>
              <EumcText style={styles.ticketNumber} fontWeight="bold">
                {ticketNumber}
              </EumcText>
              <EumcText style={[styles.waitingStatus, styles.colorWhite]}> 번</EumcText>
            </View>
          </View>
        );
      default:
        return '';
    }
  };

  return myNumber > 0 ? (
    ticketAcceptElement(floor, locationName || name, myNumber)
  ) : (
    <View style={styles.ticketArea}>
      <View style={{ overflow: 'hidden' }}>
        {floor && <View style={styles.floorArea} />}
        {floorElement(floor)}
        <EumcText style={styles.ticketTitle}>{locationName || name}</EumcText>
        <View style={styles.waitingArea}>
          {waitingCountElement(floor, waitingCount)}
          <EumcText style={[styles.waitingStatus, styles.waitingLineHeight]}>대기</EumcText>
        </View>
        {ticketButtonElement(floor, locationName || name, waitingCount, index)}
      </View>
    </View>
  );
};

export default TicketList;
