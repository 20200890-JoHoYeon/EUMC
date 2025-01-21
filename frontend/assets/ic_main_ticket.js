import Svg, { Defs, ClipPath, Path, G, Rect, Text, TSpan } from "react-native-svg";
const SvgComponent = () => <Svg xmlns="http://www.w3.org/2000/svg" width={36} height={36}><Defs><ClipPath id="a"><Path d="M0 0h36v36H0z" data-name="r 2131" style={{
        stroke: "#707070",
        fill: "#fff"
      }} transform="translate(-302 2489)" /></ClipPath></Defs><G style={{
    clipPath: "url(#a)"
  }} transform="translate(-4 -3)"><G data-name="r 1863" style={{
      stroke: "#231f20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "#fff"
    }} transform="translate(11 5)"><Rect width={22} height={32} stroke="none" rx={2} style={{
        stroke: "none"
      }} /><Rect width={21} height={31} x={0.5} y={0.5} rx={1.5} style={{
        fill: "none"
      }} /></G><Rect width={7.5} height={1} data-name="r 1864" rx={0.5} style={{
      fill: "#231f20"
    }} transform="translate(20.732 11)" /><Path d="M2 5.5V4H.5a.5.5 0 1 1 0-1H2V1.5a.5.5 0 1 1 1 0V3h1.5a.5.5 0 1 1 0 1H3v1.5a.5.5 0 1 1-1 0z" data-name="s 13" style={{
      fill: "#f1668d"
    }} transform="translate(14 8)" /><Text data-name={4} style={{
      fontSize: 10,
      fontFamily: "NotoSansCJKkr-Bold,Noto Sans CJK KR",
      fontWeight: 700,
      letterSpacing: "-.06em",
      fill: "#f1668d"
    }} transform="translate(19 25)"><TSpan x={-5.59} y={0}>{"04"}</TSpan></Text><Path d="M0 0h1.268v5.07H0z" data-name="r 2648" style={{
      fill: "#231f20"
    }} transform="translate(15.662 28.913)" /><Path d="M0 0h1.268v5.07H0z" data-name="r 2649" style={{
      fill: "#231f20"
    }} transform="translate(18.197 28.913)" /><Path d="M0 0h2.535v5.07H0z" data-name="r 2650" style={{
      fill: "#231f20"
    }} transform="translate(20.732 28.913)" /><Path d="M0 0h1.268v5.07H0z" data-name="r 2651" style={{
      fill: "#231f20"
    }} transform="translate(24.535 28.913)" /><Path d="M0 0h1.268v5.07H0z" data-name="r 2652" style={{
      fill: "#231f20"
    }} transform="translate(27.07 28.913)" /></G></Svg>;
export default SvgComponent;