import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { Colors } from "../../../components/styles"

function SvgComponent(props) {
  return (
    <Svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      height='24px'
      width='24px'
    >
      <Path
        id="forward_4_"
        d="M1.4 25L0 23.6 11 12.5 0 1.4 1.4 0 13.7 12.5z"
        fill={Colors.dark_gray}

      />
    </Svg>
  )
}

export default SvgComponent


