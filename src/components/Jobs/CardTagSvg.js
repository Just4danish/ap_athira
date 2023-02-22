import * as React from "react"
import Svg, { G, Path, Defs } from "react-native-svg"
import { View, Text,StyleSheet } from 'react-native'

/* SVGR has dropped some elements not supported by react-native-svg: filter */

function SvgComponent({label, color}) {
  return (
    <View style={{
        marginTop:10,
    }}>
    <Svg
      width={130}
      height={46}
      viewBox="0 0 130 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G filter="url(#filter0_d_149_978)">
        <Path d="M108 6.5H5l7.5 11L5 32h103l12-14.5-12-11z" fill={color} />
      </G>
      <Defs></Defs>
    </Svg>
    <Text style={{
        position: "absolute",
        color:"white",
        left:30,
        top:10,
        fontFamily:"Montserrat-Bold"
    }}>#{label}</Text>
    </View>
  )
}

export default SvgComponent
