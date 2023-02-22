import * as React from "react"
import { View } from "react-native"
import Svg, { Path } from "react-native-svg"
import { Colors } from "../styles"

function SvgComponent(props) {
  return (
    <View style={{
        marginLeft:15,
        marginTop:5,
        marginBottom:15,
    }}>
    <Svg
      width={297}
      height={2}
      viewBox="0 0 297 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        stroke="#DFDFDF"
        strokeWidth={2}
        strokeLinecap="round"
        d="M1 1L296 1"
      />
    </Svg>
    </View>
  )
}

export default SvgComponent