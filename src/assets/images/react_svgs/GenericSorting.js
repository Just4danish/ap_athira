
import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent() {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18px"
      height="18px"
      fill="#FFFFFF"
    >
      <Path d="M3 3v2h11V3H3zm14 0v14h-3l4 4 4-4h-3V3h-2zM3 7v2h9V7H3zm0 4v2h7v-2H3zm0 4v2h5v-2H3zm0 4v2h3v-2H3z" />
    </Svg>
  )
}

export default SvgComponent
