import { StyleSheet, View } from 'react-native';
import { EumcText } from './components';
import { medium, mediumBold } from './styles/typography';
import { Color } from './styles';

const styles = StyleSheet.create({
  modalContentText: {
    color: Color.myPageColor.darkGray,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 25,
    ...medium,
  },
  modalContentText2: {
    color: Color.homeColor.primaryDarkPurple,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 11,
    lineHeight: 26,
    ...medium,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: -0.45,
    lineHeight: 40,
  },
  modalText2: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    letterSpacing: -0.45,
    color: '#333',
  },
});

export const ERROR_SERVER_REFRESH = {
  type: 'error',
  text1: '서버 에러',
  text2: '당겨서 새로고침, 또는 잠시 후 이용해 주십시오.',
};
export const ERROR_PATIENT_NUMBER_ALREADY_EXIST = {
  type: 'ok',
  title: '모바일 진료카드 발급 오류',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      이미 등록된 환자번호 입니다.
    </EumcText>
  ),
};
export const ERROR_BIRTHDATE_LENGTH = {
  type: 'ok',
  title: '모바일 진료카드 발급 오류',
  children: <EumcText style={styles.modalContentText}>생년월일은 8자리로 입력해주세요</EumcText>,
};
export const ERROR_PHONENUMBER_LENGTH = {
  type: 'ok',
  title: '모바일 진료카드 발급 오류',
  children: <EumcText style={styles.modalContentText}>전화번호는 11자리로 입력해주세요</EumcText>,
};
export const ERROR_TERMS_AGREEMENT = {
  type: 'ok',
  title: '모바일 진료카드 발급',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      이용 약관에 동의해주세요
    </EumcText>
  ),
};
export const CONFIRM_ADD_MEDICAL_CARD = {
  type: 'ok',
  title: '모바일 진료카드 발급',
  children: (
    <EumcText style={[styles.modalContentText, { lineHeight: 30 }]}>모바일진료카드가{'\n'}추가되었습니다</EumcText>
  ),
};
export const ERROR_GENERIC_ADD_MEDICAL_CARD = {
  type: 'ok',
  title: '모바일 진료카드 발급 오류',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      정보를 다시 확인해주세요.
    </EumcText>
  ),
};
export const ERROR_MAX_MEDICAL_CARDS_REACHED = {
  type: 'ok',
  title: '진료카드 추가가 불가',
  children: <EumcText style={styles.modalContentText}>진료카드는 최대 5개까지만{'\n'}추가 가능합니다.</EumcText>,
};
export const ERROR_SELECT_MEDICAL_CARD = {
  type: 'ok',
  title: '진료카드 삭제 불가',
  children: <EumcText style={styles.modalContentText}>진료카드를{'\n'}선택해주세요.</EumcText>,
};
export const ERROR_MEDICAL_CARD_WITH_EXISTING_CHILD = {
  type: 'ok',
  title: '모바일 진료카드',
  children: (
    <EumcText style={styles.modalContentText}>자녀카드가 남아있는 경우{'\n'}본인카드를 삭제할 수 없습니다.</EumcText>
  ),
};
export const ERROR_MISSING_REQUIRED = {
  type: 'ok',
  title: '모바일 진료카드 발급 오류',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      필수 정보를 입력해주세요.
    </EumcText>
  ),
};
export const ERROR_PASSWORD_MISMATCH = {
  type: 'ok',
  title: '비밀번호 확인',
  children: (
    <>
      <EumcText style={styles.modalContentText} fontWeight="regular">
        비밀번호를 잘못 입력했습니다.{'\n'}
        입력하신 내용을 다시 확인해주세요.
      </EumcText>
      <EumcText style={styles.modalContentText2}>
        3회 이상 실패할 경우 로그인이{'\n'}차단되오니 비밀번호를{'\n'}
        재설정해주세요.
      </EumcText>
    </>
  ),
};
export const ERROR_PIN_VALIDATION = {
  type: 'ok',
  children: <EumcText style={styles.modalContentText}>같은 숫자 또는 연속된 숫자로{'\n'}등록할 수 없습니다.</EumcText>,
};
export const ERROR_GENERIC_MISSING_VALUE = errorName => ({
  type: 'ok',
  title: errorName,
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      {errorName}이(가) 입력되지 않았습니다.
    </EumcText>
  ),
});
export const ERROR_GENERIC_NOT_EQUAL_VALUE = (errorName, text) => ({
  type: 'ok',
  title: errorName,
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      {text} 일치하지 않습니다.
    </EumcText>
  ),
});

export const ERROR_ENTER_ALL_INFORMATION = {
  type: 'ok',
  title: '모바일 진료카드 발급 오류',
  children: <EumcText style={styles.modalContentText}>모든 정보를 기입해 주세요.</EumcText>,
};
export const ERROR_OUTSIDE_SERVICE_AREA = {
  type: 'ok',
  title: '서비스 이용 지역 이탈',
  children: (
    <>
      <EumcText style={[styles.modalContentText, { lineHeight: 30 }]}>
        현재 Wi-Fi가 비활성화 상태이오니 모바일기기의 Wi-Fi를 활성화하시고 아래 Wi-Fi 정보를 참고하시어 해당하는 병원의
        Wi-Fi를 접속 후 사용하시기 바랍니다.{'\n'}
      </EumcText>
      <EumcText style={[styles.modalContentText, { lineHeight: 30, textAlign: 'center' }]}>
        .이화서울병원 :{'\n'}
        EUMC***{'\n'}
        .이화목동병원 :{'\n'}
        ewha***{'\n'}- 원내 Wi-Fi 접속 및 장애 문의 :{'\n'}각 병원 간호접수{'\n'}
      </EumcText>
    </>
  ),
};
export const CONFIRM_ADD_PAYMENT_CARD = {
  type: 'ok',
  title: '카드 정보 등록 완료',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      카드 정보 등록이 완료 되었습니다.
    </EumcText>
  ),
};
export const ERROR_PAYMENT_CARD_ALREADY_EXIST = {
  type: 'ok',
  title: '카드 등록 오류',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      이미 등록된 카드입니다.
    </EumcText>
  ),
};
export const CONFIRM_VALIDATION_NUMBER_SENT = {
  type: 'ok',
  title: '인증번호',
  children: (
    <EumcText style={styles.modalContentText} fontWeight="regular">
      인증번호가 발송되었습니다.
    </EumcText>
  ),
};
export const ERROR_MISSING_PAYMENT_CARD = {
  type: 'ok',
  children: <EumcText style={styles.modalContentText}>사용 가능한 결제카드가 없습니다.</EumcText>,
};
export const CONFIRM_CARD_REGISTRATION = msg => ({
  type: 'ok',
  title: '카드 등록 알림',
  children: <EumcText style={styles.modalContentText}>{msg}</EumcText>,
});

export const ERROR_KAKAO_CANCEL = msg => ({
  type: 'ok',
  title: '카카오 결제 취소 알림',
  children: <EumcText style={styles.modalContentText}>{msg}</EumcText>,
});
export const ERROR_KAKAO_FAIL = msg => ({
  type: 'ok',
  title: '카카오 결제 실패 알림',
  children: <EumcText style={styles.modalContentText}>{msg}</EumcText>,
});
export const CONFIRM_NORMAL_ORDER = msg => ({
  type: 'ok',
  title: '일반결제 알림',
  children: <EumcText style={styles.modalContentText}>{msg}</EumcText>,
});
export const ERROR_RESERVATION_DATE = {
  type: 'ok',
  title: '예약 날짜 확인',
  children: (
    <EumcText style={[styles.modalContentText, { lineHeight: 40 }]}>
      해당 날짜에는{'\n'}예약이 불가능합니다.{'\n'}다른 날짜를 선택해주세요.
    </EumcText>
  ),
};
export const ERROR_RESERVATION_NOTIFICATION = msg => ({
  type: 'ok',
  children: <EumcText style={styles.modalText2}>{msg}</EumcText>,
});

export const SHOW_GRANT_PERMISSION = {
  type: 'okCancel',
  title: '권한 설정 안내',
  children: (
    <>
      <EumcText style={[styles.modalText2, { paddingTop: 16 }]}>
        위치 권한 요청을 거부하시면 {'\n'}번호표 발급, 진료과 도착 확인{'\n'}서비스를 사용하실 수 없습니다.
      </EumcText>
      <EumcText style={[styles.modalText2, { color: Color.homeColor.primaryDarkPurple }]}>
        허용하시려면 어플리케이션{'\n'}설정메뉴에서 위치 권한을 허용해주세요.
      </EumcText>
    </>
  ),
};
export const ERROR_NO_PATIENT = {
  type: 'okCancel',
  title: '모바일 진료카드',
  cancelText: '아니오',
  confirmText: '예',
  children: (
    <>
      <EumcText style={styles.modalContentText} fontWeight="regular">
        등록된 환자카드가 없습니다.
      </EumcText>
      <EumcText style={styles.modalContentText} fontWeight="regular">
        모바일 진료카드(환자번호)를 등록해주세요.
      </EumcText>
    </>
  ),
};
export const RESET_SMART_PAYMENT = {
  type: 'okCancel',
  title: '스마트 결제 초기화',
  cancelText: '취소',
  confirmText: '초기화',
  children: (
    <EumcText style={styles.modalContentText}>
      스마트 결제는 강화된 보안기능으로 비밀번호를 분실하신 경우에도 '비밀번로 찾기'를 제공하지 않습니다.모든 정보(카드,
      결제정보)가 삭제되는 '초기화'를 통해 카드 정보를 재등록 후 이용해 주시기 바랍니다.
    </EumcText>
  ),
};
export const ARRIVAL_CONFIRMATION = title => ({
  type: 'okCancel',
  title,
  children: <EumcText style={{ lineHeight: 29 }}>도착 확인을{'\n'}진행하시겠습니까?</EumcText>,
});
export const CANCEL_RESERVATION = title => ({
  type: 'okCancel',
  title,
  children: (
    <EumcText style={styles.modalText2} fontWeight="">
      예약 취소를{'\n'}진행하시겠습니까?
    </EumcText>
  ),
});
export const LOGOUT = {
  type: 'okCancel',
  title: '로그아웃',
  cancelText: '아니오',
  confirmText: '예',
  children: (
    <EumcText style={styles.modalText2}>
      로그아웃하시겠습니까?{'\n'}도착확인, 번호표발급, 예약 등의{'\n'}기능을 사용하시려면 모바일{'\n'}
      진료카드를 발급받으셔야 합니다.
    </EumcText>
  ),
};
export const PROMPT_ADD_MEDICAL_CARD = {
  type: 'okCancel',
  title: '모바일 진료카드 발급',
  confirmText: '발급',
  children: (
    <>
      <EumcText style={styles.modalContentText}>입력하신 정보로</EumcText>
      <View style={{ flexDirection: 'row' }}>
        <EumcText fontWeight="black" style={[styles.modalContentText, mediumBold]}>
          모바일 진료카드 발급
        </EumcText>
        <EumcText style={styles.modalContentText}>을</EumcText>
      </View>
      <EumcText style={styles.modalContentText}>진행하시겠습니까?</EumcText>
    </>
  ),
};
export const PROMPT_CHANGE_MEDICAL_CARD = (rsvInfo, selectCard) => ({
  type: 'okCancel',
  title: '모바일 진료카드 변경',
  cancelText: '아니오',
  confirmText: '예',
  children: (
    <>
      <EumcText style={styles.modalContentText} fontWeight="regular">
        {rsvInfo && (
          <>
            <EumcText style={mediumBold}>
              {rsvInfo.name}({rsvInfo.relationship})
            </EumcText>
            에서&nbsp;
          </>
        )}
        <EumcText style={mediumBold} fontWeight="regular">
          {selectCard?.name}({selectCard?.relationship})
        </EumcText>
        로{'\n'} 변경하시겠습니까?
      </EumcText>
    </>
  ),
});
export const PROMPT_DELETE_MEDICAL_CARD = {
  type: 'okCancel',
  title: '모바일 진료카드 삭제',
  cancelText: '아니오',
  confirmText: '예',
  children: (
    <EumcText style={styles.modalContentText}>
      <EumcText style={[mediumBold, { lineHeight: 35 }]}>모바일 진료카드</EumcText>를{'\n'} 삭제하시겠습니까?
    </EumcText>
  ),
};
export const PROMPT_DELETE_PAYMENT_CARD = {
  type: 'okCancel',
  title: '주의',
  children: <EumcText style={styles.modalText}>모든 내용이 삭제됩니다.</EumcText>,
};
