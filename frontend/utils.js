import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { ErrorToast } from 'react-native-toast-message';
import { ANDROID_LOCATION_PERMISSION_TEXT } from './constants';

const getHospitalName = (code, type = 'full') => {
  switch (code) {
    case '01':
      return type === 'short' ? '이대서울' : '이대서울병원';
    case '02':
      return type === 'short' ? '이대목동' : '이대목동병원';
    default:
      return '';
  }
};

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// 2023-01-01 포맷으로 반환
const formatDate = date => date.toISOString().substring(0, 10);
const TOAST_TEMPLATE_CONFIG = {
  error: props => <ErrorToast {...props} text1Style={{ fontSize: 17 }} text2Style={{ fontSize: 15 }} />,
};

/*
 * 2023-02-27 -> 2023.04.27 (월)
 */
const formatDate2 = date => {
  var d = new Date(date);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} (${'일월화수목금토'.charAt(d.getUTCDay())})`;
};

/*
 * 2023년 02월 27일 -> 2023.04.27 (월)
 */
const formatDate3 = date => {
  const result = date.replace(/[^0-9]/g, '');
  return formatDate2(`${result.slice(0, 4)}-${result.slice(4, 6)}-${result.slice(6, 8)}`);
};

/*
 * 20230207 -> 2023-02-07
 */
const formatDate4 = str => `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;

/*
 * 2023-02-27 -> 2023-04-27 (월)
 */
const formatDate5 = date => {
  var d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} (${'일월화수목금토'.charAt(d.getUTCDay())})`;
};

/*
 * 2023-02-27 -> 2023-04-27 (월)
 */
const formatDate6 = date => {
  var d = new Date(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${'일월화수목금토'.charAt(d.getUTCDay())})`;
};

/*
 * 문자열 시간값을 오전/오후 포맷으로 변환
 * 15:40 , 15 시 40분 -> 오후 3시 45분
 */

const formatTime = time => {
  if (typeof time === 'string') {
    if(time === '') return '';
    const result = time.replace(/[^0-9]/g, '');
    if (result >= 1300) return `오후 ${Math.floor(result / 100) - 12}시 ${result.slice(2)}분 `;
    else return `오전 ${Math.floor(result / 100)}시 ${result.slice(2)}분`;
  } else return time;
};

const labelStyle = relationship => {
  switch (relationship) {
    case '본인':
      return {
        style: { backgroundColor: '#b1ece9', height: 20 },
        titleStyle: { color: '#0e6d68' },
      };
    case '자녀':
      return {
        style: { backgroundColor: '#fce0e8', height: 20 },
        titleStyle: { color: '#f1668d' },
      };
    case '선택':
      return {
        style: { backgroundColor: '#3e8a86' },
        titleStyle: { color: '#fff' },
      };
  }
};

const checkLocationPermission = (granted, denied, onFinally) => {
  switch (Platform.OS) {
    case 'ios':
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(res => {
          if (res === RESULTS.GRANTED) granted();
          else if (res === RESULTS.BLOCKED) denied();
          else {
            request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result =>
              result === RESULTS.GRANTED ? granted() : denied()
            );
          }
        })
        .catch(e => console.log(e))
        .finally(onFinally);
      break;
    case 'android':
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, ANDROID_LOCATION_PERMISSION_TEXT)
        .then(res => (res === PermissionsAndroid.RESULTS.GRANTED ? granted() : denied()))
        .catch(e => {
          denied();
          console.log(e);
        })
        .finally(onFinally);
      break;
    default:
      console.log('unsupported device os');
  }
};

const SORT_DATETIME = (d1, d2, t1, t2) => {
  const cmpDate = parseInt(d1.replace(/\D/g, ''), 10) - parseInt(d2.replace(/\D/g, ''), 10);
  if (cmpDate !== 0) return cmpDate;
  return parseInt(t1.replace(/\D/g, ''), 10) - parseInt(t2.replace(/\D/g, ''), 10);
};

const SORT_DATE = (a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10);

export {
  getHospitalName,
  useInterval,
  formatDate,
  formatDate2,
  formatDate3,
  formatDate4,
  formatDate5,
  formatDate6,
  formatTime,
  TOAST_TEMPLATE_CONFIG,
  labelStyle,
  checkLocationPermission,
  SORT_DATETIME,
  SORT_DATE,
};
