import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

const SvgComponent = () => <Svg width={24} height={24}><Defs><ClipPath id="a"><Path data-name="r 2117" transform="translate(-462 131)" style={{
        fill: "#fff"
      }} d="M0 0h24v24H0z" /></ClipPath></Defs><G data-name="ic_basic_back" transform="translate(462 -131)" style={{
    clipPath: "url(#a)"
  }}><Path data-name="Icon ionic-ios-arrow-round-back" d="M14.4 11.481a.816.816 0 0 1 .006 1.15l-3.8 3.806h14.47a.812.812 0 0 1 0 1.625H10.614l3.8 3.806a.822.822 0 0 1-.006 1.15.81.81 0 0 1-1.144-.006l-5.151-5.187a.912.912 0 0 1-.169-.256.775.775 0 0 1-.063-.312.814.814 0 0 1 .231-.569l5.153-5.188a.8.8 0 0 1 1.135-.019z" transform="translate(-466.882 125.748)" style={{
      fill: "#231f20"
    }} /></G></Svg>;

export default SvgComponent;