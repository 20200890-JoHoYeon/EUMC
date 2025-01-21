import Svg, { Defs, ClipPath, Path, G, Rect } from "react-native-svg";
const SvgComponent = () => <Svg xmlns="http://www.w3.org/2000/svg" width={36} height={36}><Defs><ClipPath id="a"><Path d="M0 0h36v36H0z" data-name="r 2129" style={{
        stroke: "#707070",
        fill: "#fff"
      }} /></ClipPath></Defs><G style={{
    clipPath: "url(#a)"
  }}><G data-name="r 2333" style={{
      strokeLinejoin: "round",
      stroke: "#231f20",
      strokeLinecap: "round",
      fill: "#e3e4e5"
    }} transform="translate(11 4)"><Rect width={19} height={27} stroke="none" rx={2} style={{
        stroke: "none"
      }} /><Rect width={18} height={26} x={0.5} y={0.5} rx={1.5} style={{
        fill: "none"
      }} /></G><G data-name="r 1868" style={{
      strokeLinejoin: "round",
      stroke: "#231f20",
      strokeLinecap: "round",
      fill: "#fff"
    }} transform="translate(7 7)"><Rect width={19} height={21} stroke="none" rx={2} style={{
        stroke: "none"
      }} /><Rect width={18} height={20} x={0.5} y={0.5} rx={1.5} style={{
        fill: "none"
      }} /></G><Path d="M658-592a2 2 0 0 1-2-2v-13h10.778l1.933 3H680a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2z" data-name="s 19" style={{
      fill: "#f7941e",
      strokeLinejoin: "round",
      stroke: "#231f20",
      strokeLinecap: "round"
    }} transform="translate(-651 626)" /><Path d="M0 0h10" data-name="l 161" style={{
      fill: "none",
      stroke: "#231f20",
      strokeLinecap: "round"
    }} transform="translate(11 12.5)" /><Path d="M0 0h6" data-name="l 162" style={{
      fill: "none",
      stroke: "#231f20",
      strokeLinecap: "round"
    }} transform="translate(11 15.5)" /></G></Svg>;
export default SvgComponent;