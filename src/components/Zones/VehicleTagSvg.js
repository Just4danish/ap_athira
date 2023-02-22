import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg"
import { View, Text } from 'react-native'
import { useEffect } from "react"
import { useState } from "react"
import { vehicleStatusColors } from "../styles"
/* SVGR has dropped some elements not supported by react-native-svg: style */

function SvgComponent({label,status, width}) {
  const [color, setColor] = useState(vehicleStatusColors['Exited'])
  useEffect(()=>{
    setColor(vehicleStatusColors[status])
  },[status])
  return (
    <View style={{
      marginTop:0,
  }}>
    <Svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      width={typeof(width) === 'undefined' ? 110 : width}
      height={42}
      viewBox="0 0 369.2 111.4"
      xmlSpace="preserve"
      enableBackground="new 0 0 369.2 111.4"
    >
      <Path
        d="M369.2 67.28v8.24c0 1.44-1.06 2.62-2.35 2.62h-2.36V64.66h2.36c1.29 0 2.35 1.18 2.35 2.62z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#f78f1e"
      />
      <Path
        d="M288.53 91.88h-3.69v-81.8c0-2.04 1.65-3.69 3.69-3.69h51.71c7.64 0 25.57 40.97 25.57 53.62v28.18c0 2.04-1.65 3.69-3.69 3.69h-66.61-6.98z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#0a6499"
      />
      <Path
        className="st2"
        d="M341.76 15.59c4.28 6.98 8.83 16.86 12.09 25.86h-35.77V15.59h23.68z"
        fill="#5998BA"
      />
      <Path
        d="M351.99 91.88h-53.32c-.17-1.22-.25-2.45-.25-3.69 0-7.16 2.82-13.97 7.88-19.03s11.87-7.88 19.03-7.88 13.97 2.82 19.03 7.88 7.88 11.87 7.88 19.03c0 1.24-.08 2.47-.25 3.69z"
        fillRule="evenodd"
        clipRule="evenodd"

        fill="#5998BA"
      />
      <Path
        d="M6.6 0h280.5c3.65 0 6.6 1.17 6.6 2.62v76.13H6.6c-3.65 0-6.6-1.17-6.6-2.62V2.62C0 1.17 2.96 0 6.6 0z"
        // Need to change as per card
        fill={color}
      />
      <Path className="st2" d="M300.14 15.59H314.38V41.45H300.14z" fill="#5998BA"/>
      <Path
        d="M312.54 52.54h7.39c1.02 0 1.85.83 1.85 1.85s-.83 1.85-1.85 1.85h-7.39c-1.02 0-1.85-.83-1.85-1.85s.83-1.85 1.85-1.85z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#5998BA"
        
      />
      <Path
        d="M0 78.75H293.71V91.88H0z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#5d616c"
      />
      <Path
        d="M71.58 91.88H18.25c-.17-1.22-.25-2.45-.25-3.69 0-7.16 2.82-13.97 7.88-19.03s11.87-7.88 19.03-7.88 13.97 2.82 19.03 7.88 7.88 11.87 7.88 19.03c.01 1.24-.08 2.47-.24 3.69z"
        fill="#5998BA"
      />
      <Path
        d="M70.29 78.75H19.86c-1.12 2.98-1.7 6.17-1.7 9.43 0 1.24.09 2.48.25 3.69h53.32c.17-1.22.25-2.45.25-3.69.01-3.26-.58-6.45-1.69-9.43z"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#5998BA"
      />
      <Circle className="st9" cx={44.91} cy={87.86} r={23.35} fill="#000" />
      <Path className="st9" d="M52.98 101.9h1.6-1.6z" />
      <Circle className="st10" cx={44.91} cy={87.86} r={8.54} fill='#fff'/>
      <Circle className="st9" cx={325.33} cy={87.86} r={23.35} fill="#000" />
      <Path className="st9" d="M333.39 101.9h1.6-1.6z" />
      <Circle className="st10" cx={325.33} cy={87.86} r={8.54} fill='#fff'/>
    </Svg>
    <Text style={{
        position: "absolute",
        color:"white",
        left:20,
        top:10,
        fontFamily:"Montserrat-Bold",
        fontSize:12,
    }}>{label}</Text>
    </View>
  )
}

export default SvgComponent
