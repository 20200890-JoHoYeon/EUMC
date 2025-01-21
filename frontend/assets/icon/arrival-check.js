import * as React from "react";
import Svg, { Defs, ClipPath, Path, G, Rect, Circle } from "react-native-svg";

const SvgComponent = () => <Svg xmlns="http://www.w3.org/2000/svg"><Defs><ClipPath id="a"><Path data-name="r 2131" transform="translate(-350 2490)" style={{
        stroke: "#707070",
        fill: "#fff"
      }} d="M0 0h36v36H0z" /></ClipPath></Defs><G transform="translate(-4 -3)" style={{
    clipPath: "url(#a)"
  }}><G data-name="r 1863" transform="translate(13 6)" style={{
      stroke: "#231f20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "#ecf7ff"
    }}><Rect width={18} height={30} rx={2} style={{
        stroke: "none"
      }} stroke="none" /><Rect x={0.5} y={0.5} width={17} height={29} rx={1.5} style={{
        fill: "none"
      }} /></G><Rect data-name="r 1680" width={10} height={2} rx={1} transform="translate(17 26.25)" style={{
      fill: "#3cb4e7"
    }} /><Path data-name="p 2225" d="M5 12a1.2 1.2 0 0 1-.928-.451l-.01-.012L.983 7.479l-.01-.013A4.715 4.715 0 0 1 0 4.606 4.821 4.821 0 0 1 5 0a4.821 4.821 0 0 1 5 4.606 4.714 4.714 0 0 1-.972 2.858l-.011.015-3.08 4.058-.01.012A1.2 1.2 0 0 1 5 12" transform="translate(17 14.25)" style={{
      stroke: "#231f20",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "#fff"
    }} /><Circle data-name="o 64" cx={3} cy={3} r={3} transform="translate(19 16.25)" style={{
      fill: "#3cb4e7"
    }} /><Path data-name="r 2322" d="M0 0h10v1a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V0z" transform="translate(17 6.5)" style={{
      fill: "#231f20"
    }} /><Rect data-name="r 2329" width={6} height={1} rx={0.5} transform="translate(19.188 33.5)" style={{
      fill: "#231f20"
    }} /></G></Svg>;

export default SvgComponent;