import Svg, { Defs, ClipPath, Path, G, Circle } from "react-native-svg";

const SvgComponent = () => <Svg xmlns="http://www.w3.org/2000/svg" width={120} height={120}><Defs><ClipPath id="a"><Path data-name="r 1818" transform="translate(-2101 14630)" style={{
        fill: "#fff"
      }} d="M0 0h120v120H0z" /></ClipPath></Defs><G transform="translate(2101 -14630)" style={{
    clipPath: "url(#a)"
  }}><G data-name="o 45" transform="translate(-2091 14640)" style={{
      stroke: "#dcdcdc",
      fill: "none"
    }}><Circle cx={50} cy={50} r={50} style={{
        stroke: "none"
      }} stroke="none" /><Circle cx={50} cy={50} r={49.5} style={{
        fill: "none"
      }} /></G><Path data-name="p 2477" d="m77.5 16.667-30.769 30-9.231-8.991" transform="translate(-2098 14658.833)" style={{
      stroke: "#ccc",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeWidth: 8,
      fill: "none"
    }} /></G></Svg>;

export default SvgComponent;