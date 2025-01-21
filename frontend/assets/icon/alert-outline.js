import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";

const SvgComponent = () => <Svg xmlns="http://www.w3.org/2000/svg" width={120} height={120}><Defs><ClipPath id="a"><Path data-name="r 1819" transform="translate(216 709)" style={{
        fill: "#fff",
        stroke: "#707070"
      }} d="M0 0h120v120H0z" /></ClipPath></Defs><G transform="translate(-216 -709)" style={{
    clipPath: "url(#a)"
  }}><Path data-name="l 127" transform="translate(276 742)" style={{
      stroke: "#ccc",
      strokeLinecap: "round",
      strokeWidth: 8,
      fill: "none"
    }} d="M0 0v40" /><Path data-name="l 128" transform="translate(276 796)" style={{
      stroke: "#ccc",
      strokeLinecap: "round",
      strokeWidth: 8,
      fill: "none"
    }} d="M0 0h0" /><G data-name="o 46" transform="translate(226 719)" style={{
      stroke: "#dcdcdc",
      fill: "none"
    }}><Circle cx={50} cy={50} r={50} style={{
        stroke: "none"
      }} stroke="none" /><Circle cx={50} cy={50} r={49.5} style={{
        fill: "none"
      }} /></G></G></Svg>;

export default SvgComponent;