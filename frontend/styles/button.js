import { homeColor } from './colors';
import { buttonTypo } from './typography';

export const RoundBtnStyle = {
  paddingVertical: 12,
  borderRadius: 24,
  ...buttonTypo.regularBold,
};

export const RoundLabelBtnStyle = {
  height: 20,
  borderRadius: 10,
  paddingHorizontal: 6,
  shadowColor: homeColor.primaryGray,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.4,
  shadowRadius: 7,
  elevation: 10,
  justifyContent: 'center',
};

export const SquareRoundLabelBtnStyle = {
  height: 20,
  borderRadius: 3,
  paddingHorizontal: 6,
  justifyContent: 'center',
};

export const RoundBorderBtnStyle = {
  borderRadius: 24,
  paddingVertical: 11,
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: '#939598', //기본 컬러
  ...buttonTypo.regularBold,
};
