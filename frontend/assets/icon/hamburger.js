import Svg, { Defs, ClipPath, Path, G, Rect } from "react-native-svg";

const SvgComponent = () => <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24}><Defs><ClipPath id="a"><Path data-name="r 2785" transform="translate(904 374)" style={{
        fill: "#fff",
        stroke: "#707070"
      }} d="M0 0h24v24H0z" /></ClipPath></Defs><G data-name="ic_basic_hamburger" transform="translate(-904 -374)" style={{
    clipPath: "url(#a)"
  }}><Rect data-name="r 2782" width={16} height={1.5} rx={0.75} transform="translate(908 380)" style={{
      fill: "#231f20"
    }} /><Rect data-name="r 2783" width={16} height={1.5} rx={0.75} transform="translate(908 385)" style={{
      fill: "#231f20"
    }} /><Rect data-name="r 2784" width={12} height={1.5} rx={0.75} transform="translate(908 390)" style={{
      fill: "#231f20"
    }} /></G></Svg>;

export default SvgComponent;