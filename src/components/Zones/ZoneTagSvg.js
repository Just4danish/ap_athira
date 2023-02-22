import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import { View, Text } from 'react-native'
import { useEffect } from "react"
import { useState } from "react"
import { vehicleStatusColors } from "../styles"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent({ label, status, width }) {
  const [color, setColor] = useState(vehicleStatusColors['Exited'])
  useEffect(() => {
    setColor(vehicleStatusColors[status])
  }, [status])
  return (
    <View style={{
      marginTop: 0,
      left:5
    }}>
      <Svg
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width={typeof(width) === 'undefined' ? 120 : width}
        height={42}
        viewBox="0 0 130.5 29.6"
        xmlSpace="preserve"
        enableBackground="new 0 0 130.5 29.6"
      >
        <Path
          d="M118 3.1H9.9l7.9 11-7.9 14.5h108l12.6-14.5-12.5-11z"
          fill="#f5b919"
        />
        <Path
          d="M19.3 9.7c0 5.3-4 16-9.7 19.9C4.3 25.7 0 15 0 9.7S4.3 0 9.7 0s9.6 4.3 9.6 9.7z"
          fill="#00aeef"
        />
        <Circle cx={9.7} cy={9} r={4.2} fill="#fff" />
      </Svg>
      <Text style={{
        position: "absolute",
        color: "white",
        left: 25,
        top: 13,
        fontFamily: "Montserrat-Bold",
        fontSize: 12,
      }}>{label}</Text>
    </View>
  )
}

export default SvgComponent
