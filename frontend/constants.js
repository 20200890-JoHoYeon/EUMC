const selectMenus = [
  {
    key: 0,
    img: require('./assets/ic_main_calendar.png'),
    text: '진료\n예약',
    navigator: 'Reservation',
    screen: 'ReserveMain',
  },
  {
    key: 1,
    img: require('./assets/ic_main_arrival.png'),
    text: '도착\n확인',
    screen: 'ConfirmationOfArrival',
  },
  {
    key: 2,
    img: require('./assets/ic_main_payment.png'),
    text: '모바일\n수납',
    screen: 'MobilePayment',
  },
  {
    key: 3,
    img: require('./assets/ic_main_document.png'),
    text: '증명서\n신청',
    screen: 'Proof',
  },
  {
    key: 4,
    img: require('./assets/ic_main_testHistory.png'),
    text: '검사내역\n조회',
    screen: 'DiagnosisHistory',
  },
];
const unselectMenus = [
  {
    key: 0,
    img: require('./assets/ic_main_diagnosisHistory.png'),
    text: '진료내역\n조회',
    screen: 'TreatmentHistory',
  },
  {
    key: 1,
    img: require('./assets/ic_main_paymentHistory.png'),
    text: '수납내역\n조회',
    screen: 'PaymentHistory',
  },
  {
    key: 2,
    img: require('./assets/ic_main_cards.png'),
    text: '결제카드\n관리',
    screen: 'PaymentCardTab',
  },
  {
    key: 3,
    img: require('./assets/ic_main_medicineHistory.png'),
    text: '약처방\n조회',
    screen: 'PrescriptionHistory',
  },
  {
    key: 4,
    img: require('./assets/ic_main_proxyPayment.png'),
    text: '대리\n결제',
    screen: 'ProxyPayment',
  },
  {
    key: 5,
    img: require('./assets/ic_main_hospitalization.png'),
    text: '입퇴원\n안내',
  },
];

// 스크린 이름과 설명
const SCREEN_NAMES = {
  splash: { name: 'Splash' },
  home: { name: 'Home' },
  mcrt: { name: 'MedicalCardRegTerms', title: '진료카드 등록' },
  met: { name: 'MbExamineTerms', title: '모바일 진찰권 이용약관 동의' },
  mcr: { name: 'MedicalCardReg', title: '진료카드 등록' },
};

// 사용 가능한 조회 페이지 목록
const ALLOWED_SCREENS = ['Diagnosis', 'Payment', 'Prescription', 'Treatment'];

// 대표전화
const MAIN_PHONE = code => (code === '01' ? '1522-7000' : '1666-5000');
// 앱사용문의 전화(포씨게이트)
const APP_INQURY_PHONE = '1577-7729';

const ALLOWED_SSID = ['EUMC', 'EWHA', 'KT'];

const KCP_INFO = {
  PROOF_SITE_CD: 'A8IE7',
  PROOF_SITE_KEY: '',
  AUTH_SITE_CD: 'A8EI7',
  AUTH_SITE_ID: 'J19021203192',

  PAY_SEOUL_NORMAL_SITE_CD: 'A8DZL',
  PAY_SEOUL_SMART_SITE_CD: 'A8DZI',
  PAY_MOKDONG_NORMAL_SITE_CD: 'A8DZT',
  PAY_MOKDONG_SMART_SITE_CD: 'A8DZR',

  PAY_SEOUL_NORMAL_SITE_KEY: '47DPYaW97iazHr-lkxyshnY__',
  PAY_SEOUL_SMART_SITE_KEY: '1Svl2j2jHmzFMlYgMffcOzN__',
  PAY_MOKDONG_NORMAL_SITE_KEY: '2zFYprYnOQvafYDf03YNdm1__',
  PAY_MOKDONG_SMART_SITE_KEY: '2ezDpvHk0WvvABIQRgDQFX4__',
};

const DEPT_NAME = {
  '01': {
    1: { name: '원무과', floor: 'B1', divId: 1 },
    2: { name: '원무과', floor: '1F', divId: 2 },
    3: { name: '원무과', floor: '2F', divId: 3 },
    4: { name: '원무과', floor: '2F', divId: 4 },
    5: { name: '원무과', floor: '3F', divId: 5 },
    6: { name: '원무과', floor: '3F', divId: 6 },
    7: { name: '원무과 제증명', floor: '1F', divId: 7 },
    8: { name: '원무과 의무기록', floor: '1F', divId: 8 },
    9: { name: '원무과 입퇴원', floor: '1F', divId: 9 },
    11: { name: '내분비과', floor: '3F', divId: 11 },
    12: { name: '심뇌혈관센터', floor: '3F', divId: 12 },
    28: { name: '비뇨의학과', floor: '2F', divId: 28 },
    45: { name: '관절척추센터', floor: 'B1', divId: 45 },
    46: { name: '핵의학과', floor: 'B1', divId: 46 },
    47: { name: '산부인과', floor: '2F', divId: 47 },
    48: { name: '안과', floor: '2F', divId: 48 },
    49: { name: '피부과', floor: '3F', divId: 49 },
    50: { name: '가정의학과', floor: '3F', divId: 50 },
    54: { name: '원무과 관절', floor: 'B1', divId: 54 },
    64: { name: '채혈실', floor: '3F', divId: 64 },
    66: { name: '성형외과', floor: '3F', divId: 66 },
    69: { name: '일반 영상의학과', floor: '1F', divId: 69 },
    78: { name: '소아청소년과', floor: 'B1', divId: 78 },
    85: { name: '소아청소년과 진정실', floor: 'B1', divId: 85 },
    86: { name: '영상의학과', floor: '2F', divId: 86 },
  },
  '02': {
    '10.10.205.57-1': { kioskIp: '10.10.205.57', menu: 1, floor: '1F', locationName: '1층 외래수납' },
    '10.10.210.66-1': { kioskIp: '10.10.210.66', menu: 1, floor: '2F', locationName: '2층 외래수납' },
    '10.10.219.53-1': { kioskIp: '10.10.219.53', menu: 1, floor: '4F', locationName: '4층여성암(외래수납)' },
    '10.10.210.63-3': { kioskIp: '10.10.210.63', menu: 3, floor: '2F', locationName: '2층 입퇴원' },
    '10.10.210.65-4': { kioskIp: '10.10.210.65', menu: 4, floor: '2F', name: '2층 제증명' },
    '10.10.210.65-5': { kioskIp: '10.10.210.65', menu: 5, floor: '2F', name: '2층 의무기록사본' },
  },
};

const FLOOR_ORDER = ['B2', 'B1', '1F', '2F', '3F', '4F'];

const ANDROID_LOCATION_PERMISSION_TEXT = {
  title: '위치 권한이 필요합니다.',
  message: '이 앱은 근처 와이파이를 탐색하기 위해 위치 권한이 필요합니다.',
  buttonNegative: '거부',
  buttonPositive: '허용',
};

export {
  selectMenus,
  unselectMenus,
  SCREEN_NAMES,
  ALLOWED_SCREENS,
  MAIN_PHONE,
  ALLOWED_SSID,
  APP_INQURY_PHONE,
  DEPT_NAME,
  FLOOR_ORDER,
  ANDROID_LOCATION_PERMISSION_TEXT,
  KCP_INFO
};
