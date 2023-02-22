import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { Colors } from "../../../components/styles"

function SvgComponent({height = 24, width=24}) {
  return (
    <Svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      height={`${height}px`}
      width={`${width}px`}
    >
      <Path
        id="Close"
        d="M21.2 22.2c-.3 0-.5-.1-.7-.3l-9.4-9.4L1.7 22c-.4.4-1 .4-1.4 0s-.4-1 0-1.4l9.4-9.4L.3 1.7C-.1 1.3-.1.7.3.3s1-.4 1.4 0l9.4 9.4L20.5.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-9.4 9.4 9.4 9.4c.4.4.4 1 0 1.4-.1.2-.4.3-.7.3z"
        fill={Colors.dark_gray}
      />
    </Svg>
  )
}

export default SvgComponent
