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
      <Path d="M3 3v2h18V3H3zm2 4l5 6v8h4v-8l5-6H5z" />
    </Svg>
  )
}

export default SvgComponent
