import React, {useState,useEffect} from "react"
import Svg, { Path } from "react-native-svg"
import { View, Text, StyleSheet } from 'react-native'
import { couponColors } from "../styles"

/* SVGR has dropped some elements not supported by react-native-svg: style */

const SvgComponent = ({ label, status, width }) => {
  const [color, setColor] = useState(couponColors['new'])
  useEffect(() => {
    if (typeof(status) !== 'undefined'){
      setColor(couponColors[status])
    }
  }, [status])
  
  return (
    <View style={{
      marginTop: 0,
    }}>
      <Svg
        width={typeof (width) === 'undefined' ? 140 : width}
        height={42}
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x={0}
        y={0}
        viewBox="0 0 165.5 25.7"
        style={{
          enableBackground: "new 0 0 165.5 25.7",
        }}
        xmlSpace="preserve"
      >
        <Path
          d="M119.7 25.8h10c.2 0 .4-.2.4-.4V25c0-.9.7-1.6 1.5-1.6.9 0 1.7.7 1.7 1.6v.4c0 .2.2.4.4.4h30.9c.4 0 .8-.4.8-.8V.9c0-.4-.4-.8-.8-.8h-30.9c-.2 0-.4.2-.4.4v.4c0 .9-.7 1.6-1.5 1.6-.9 0-1.7-.7-1.7-1.6V.5c0-.2-.2-.4-.4-.4h-10c-.4 0-.8.4-.8.8V25c0 .4.4.8.8.8zM131 4.9c0-.4.4-.8.8-.8s.8.4.8.8v1.6c0 .4-.4.8-.8.8s-.8-.4-.8-.8V4.9zm0 4.8c0-.4.4-.8.8-.8s.8.4.8.8v1.6c0 .4-.4.8-.8.8s-.8-.4-.8-.8V9.7zm0 4.8c0-.4.4-.8.8-.8s.8.4.8.8v1.6c0 .4-.4.8-.8.8s-.8-.4-.8-.8v-1.6zm0 4.9c0-.4.4-.8.8-.8s.8.4.8.8V21c0 .4-.4.8-.8.8s-.8-.4-.8-.8v-1.6z"
          style={{
            fill: "#ffdc64",
          }}
        />
        <Path
          className="st1"
          d="M156.7 4.7c.3 0 .5.1.7.3.4.4.4 1 0 1.4l-14.5 14.5c-.4.4-1 .4-1.4 0-.4-.4-.4-1 0-1.4L156 5c.2-.2.4-.3.7-.3zM154.3 13.5c2.3 0 4.2 1.9 4.2 4.2s-1.9 4.2-4.2 4.2-4.2-1.9-4.2-4.2 1.9-4.2 4.2-4.2zm0 6.5c1.2 0 2.2-1 2.2-2.2 0-1.2-1-2.2-2.2-2.2s-2.2 1-2.2 2.2c0 1.2 1 2.2 2.2 2.2zM144.6 3.9c2.3 0 4.2 1.9 4.2 4.2s-1.9 4.2-4.2 4.2c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2zm0 6.4c1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2c-1.2 0-2.2 1-2.2 2.2s1 2.2 2.2 2.2z"
        />
        <Path
          d="m0 25.5 128.5.3c.4 0 .7-.2.7-.4V25c0-.9 1.2-1.6 2.6-1.6v-1.6c-.7 0-1.3-.4-1.3-.8v-1.6c0-.4.6-.8 1.3-.8V17c-.7 0-1.3-.4-1.3-.8v-1.6c0-.4.6-.8 1.3-.8v-1.6c-.7 0-1.3-.4-1.3-.8V9.7c0-.4.6-.8 1.3-.8V7.3c-.7 0-1.3-.4-1.3-.8V4.9c0-.4.6-.8 1.3-.8V2.5c-1.4 0-2.6-.7-2.6-1.6V.5c0-.2-.3-.4-.7-.4L0 0"
          style={{
            fill: color,
          }}
        />
      </Svg>
      <Text style={{
        position: "absolute",
        color: "white",
        left: 10,
        top: 10,
        fontFamily: "Montserrat-Bold"
      }}>{label}</Text>
    </View>
  )
}

export default SvgComponent
