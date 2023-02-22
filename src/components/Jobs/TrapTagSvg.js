import React, { useState, useEffect } from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"
import { View, Text, StyleSheet, Touchable, Modal, Dimensions } from 'react-native'
import SaveSvg from './SaveSvg'
import SkipSvg from './SkipSvg'
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler"
import Pressable from "react-native/Libraries/Components/Pressable/Pressable"
import { globalStyles, Colors, trapStatusColors } from '../styles'
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated"

/* SVGR has dropped some elements not supported by react-native-svg: filter */

function TrapTagSvg({ item, needToSave, saveHandler, toBeSkipped,savePossible }) {
  const [actionType, setActionType] = useState('save')
  const [modalShow, setModalShow] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [skipButtonVisibility, setSkipButtonVisibility] = useState(false)
  const [label, setLabel] = useState('')

  const [locationForAdditionalActions, setLocationForAdditionalActions] = useState({
    x: 0,
    y: 0
  })

  const longPressHandler = (e) => {
    setModalShow(true)
    setLocationForAdditionalActions({
      x: e.nativeEvent.pageX - e.nativeEvent.locationX,
      y: e.nativeEvent.pageY - e.nativeEvent.locationY
    })

  }

  const pressHandler = (type, item) => {
    saveHandler(type, item)
    modalCloseHandler()
  }
  const modalCloseHandler = () => {
    setModalShow(false)
    setActionType('save')
  }

  return (
    <View style={{
      marginTop: 10,
      width: "100%",
      height: 40,
      backgroundColor: trapStatusColors[item?.status]
    }}>

      <Svg
        width={70}
        height={40}
        viewBox="0 0 135 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <G clipPath="url(#clip0_400_1124)">
          <Path
            d="M65.77 48.88V30.03H29.22c.09 1.46.18 3.03.3 4.99h-5.94c-.83-3.84-.39-9.31-7.3-6.56-.93-4.45-.93-7.16 4.39-7.63 2.16-.19 4.53-2.67 6.06-4.67 5.42-7.12 12.22-9.4 21.2-8.99 16.11.74 32.29.28 48.44.15 3.77-.03 6.51 1.25 9.28 3.82 4.34 4.03 7.27 10 14.33 10.73.93.1 1.54 3.42 2.52 5.79-2.88.3-4.81.5-7.27.75-.38 2.05-.79 4.26-1.2 6.48-2.17.03-4.34.06-6.52.08l.45-4.13c-.32-.34-.64-.68-.96-1.03H73.01c-.36.35-.73.7-1.09 1.04 0 5.66.01 11.31.01 16.97-.08 4.46-.26 8.91-.21 13.37.05 4.49-1.81 5.64-5.77 3.67l-.18-15.98z"
            fill="#F8FBFB"
          />
          <Path
            d="M49 48.56l14.94.33c.03 1.82-.01 3.64.11 5.46.28 4.12.65 8.24.98 12.36h8V48.94c2.33-.03 4.66-.06 6.99-.08v17.89h14.1V49.01h8.59c-1.55 8.74-3.05 17.18-4.53 25.49H39.09c-1.48-8.54-2.93-16.85-4.5-25.92 5.16-.02 9.79-.02 14.41-.02z"
            fill={trapStatusColors[item?.status]}
          />
          <Path
            d="M111.02 48.82c-1.72 10.62-3.15 21.31-5.41 31.82-.45 2.09-4.04 4.95-6.23 4.99-20.44.38-40.89.23-61.34.23-4.05 0-6.07-2.43-6.72-6.04-1.84-10.28-3.53-20.58-5.28-30.87h6.1c1.73 9.46 3.42 18.67 5.09 27.8h62.85c1.7-9.3 3.39-18.55 5.11-27.92 2.21-.01 4.02-.01 5.83-.01z"
            fill="#FAFCFC"
          />
          <Path
            d="M127.01 46.4H91.78v18.17h-8.94V48.48c.07-1.47.15-2.94.22-4.41.21-.38.43-.76.64-1.14 2.39-3.91 5.87-5.4 10.44-5.17 4.27.22 8.57-.06 12.86-.12h21.16c-.43 3.26-.79 6.01-1.15 8.76z"
            fill="#FAFCFC"
          />
          <Path
            d="M49 45.87c-12.19.13-24.39.27-36.58.41-2.14.03-4.29.08-6.43.11-.39-2.66-.77-5.31-1.21-8.31H49v7.79z"
            fill="#FDFDFD"
          />
          <Path
            d="M65.03 66.72c-.33-4.12-.7-8.24-.98-12.36-.12-1.81-.08-3.64-.11-5.46.61 0 1.21-.01 1.82-.01l.18 16c-.3.61-.6 1.22-.91 1.83z"
            fill={trapStatusColors[item?.status]}
          />
          <Path
            d="M114 37.62h-7c.17-.88.33-1.76.5-2.63 2.17-.03 4.34-.06 6.52-.08-.01.9-.01 1.81-.02 2.71z"
            fill={trapStatusColors[item?.status]}
          />
          <Path
            d="M135 95.13H0v-95s134.83-.29 135 0m-21 37.49c0-.91.01-1.81.01-2.72.41-2.22.82-4.44 1.2-6.48 2.46-.25 4.38-.45 7.27-.75-.98-2.37-1.58-5.7-2.52-5.79-7.06-.73-9.99-6.7-14.33-10.73-2.77-2.57-5.51-3.85-9.28-3.82-16.14.13-32.32.58-48.43-.15-8.98-.41-15.77 1.87-21.2 8.99-1.53 2-3.89 4.48-6.06 4.67-5.33.47-5.33 3.17-4.39 7.63 6.91-2.74 6.47 2.73 7.3 6.56h5.94c-.12-1.97-.21-3.53-.3-4.99h36.55v18.85c-.61 0-1.21.01-1.82.01L49 48.57v-2.7-7.78H4.78c.44 3 .82 5.66 1.21 8.31 4.97.16 9.96.15 14.91.55 1.76.14 3.43 1.3 5.14 1.99 1.75 10.29 3.44 20.59 5.28 30.87.65 3.62 2.67 6.04 6.72 6.04 20.45 0 40.9.16 61.34-.23 2.19-.04 5.78-2.9 6.23-4.99 2.26-10.51 3.69-21.2 5.41-31.82 1.55-.65 3.06-1.7 4.67-1.87 3.75-.41 7.54-.39 11.32-.55.36-2.75.72-5.5 1.15-8.77H114z"
            fill={trapStatusColors[item?.status]}
          />
          <Path
            d="M111.02 48.82h-5.84c-1.72 9.38-3.41 18.62-5.11 27.92H37.22c-1.67-9.13-3.36-18.34-5.09-27.8h-6.1c-1.71-.69-3.38-1.85-5.14-1.99-4.95-.41-9.94-.4-14.91-.55 2.14-.04 4.29-.09 6.43-.11 12.2-.15 24.4-.29 36.59-.42v2.7H34.58c1.58 9.08 3.02 17.38 4.5 25.92h59.09c1.48-8.31 2.98-16.75 4.53-25.49h-8.59v17.74h-14.1V48.85l2.82-.39v16.09h8.94V46.38H127c-3.78.16-7.57.14-11.32.55-1.59.19-3.11 1.24-4.66 1.89z"
            fill={trapStatusColors[item?.status]}
          />
          <Path
            d="M107.5 34.99c-.17.88-.33 1.76-.5 2.63-4.29.06-8.59.34-12.86.12-4.57-.22-8.04 1.26-10.44 5.18-.21.38-.43.76-.64 1.14-.07 1.47-.15 2.94-.22 4.41l-2.82.39c-2.33.03-4.66.06-6.99.08-.37-.36-.74-.73-1.11-1.09 0-5.66-.01-11.31-.01-16.97.36-.35.73-.7 1.09-1.04h33.99c.32.34.64.68.96 1.03l-.45 4.12z"
            fill={trapStatusColors[item?.status]}
          />
          <Path
            d="M71.93 47.85c.37.36.74.73 1.11 1.09v17.77h-8c.31-.61.61-1.22.92-1.83 3.95 1.97 5.82.82 5.77-3.67-.06-4.45.12-8.9.2-13.36zM73.01 29.84c-.36.35-.73.7-1.09 1.04.36-.34.72-.69 1.09-1.04zM107.95 30.86zM83.06 44.06c.21-.38.43-.76.64-1.14-.21.38-.43.76-.64 1.14z"
            fill={trapStatusColors[item?.status]}
          />
        </G>
        <Defs>
          <ClipPath id="clip0_400_1124">
            <Path fill="#fff" d="M0 0H135V95.13H0z" />
          </ClipPath>
        </Defs>
      </Svg>
      <Text style={{
        position: "absolute",
        color: "white",
        left: 70,
        top: 10,
        fontFamily: "Montserrat-Bold"
      }}>#{item?.id}</Text>


         {
         savePossible? <Pressable

            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={() => pressHandler('save', item)}
            onLongPress={longPressHandler} style={{
              position: "absolute", width: 40, height: 40, top: 0, right: 10, opacity: pressed ? 0.5 : 1
            }}>

            <SaveSvg />
          </Pressable>
          :null
}


      <Modal
        visible={modalShow}
        transparent={true}
      >
        <Pressable onPress={modalCloseHandler} style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          // backgroundColor: 'rgba(0,0,0,1)'
        }}>
          <Animated.View
            entering={ZoomIn}
            exiting={ZoomOut}

            style={{
              width: 150,
              height: 100,
              backgroundColor: trapStatusColors[item?.status],
              position: 'absolute',
              top: locationForAdditionalActions.y + 45,
              left: locationForAdditionalActions.x - 110,
              borderRadius: 5,
              opacity: 0.85,
              alignItems: 'center',
              justifyContent: 'space-around'
            }}>
            <View style={{ width: 140, height: 40, borderWidth: 0.5, borderColor: 'white', borderRadius: 5, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
              <Pressable
                android_ripple={{ color: "red", borderless: true }}
                onPress={() => pressHandler('partial', item)}
                style={{ width: 140, height: 40, borderWidth: 0.5, borderColor: 'white', borderRadius: 5, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[globalStyles.h2_bold, { color: 'white' }]}>
                  Partially Save
                </Text>
              </Pressable>
            </View>
            <View style={{ width: 140, height: 40, borderWidth: 0.5, borderColor: 'white', borderRadius: 5, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}>
              <Pressable
                android_ripple={{ color: "red", borderless: true }}
                onPress={() => pressHandler('skip', item)}
                style={{ width: 140, height: 40, borderWidth: 0.5, borderColor: 'white', borderRadius: 5, alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={[globalStyles.h2_bold, { color: 'white' }]}>
                  Skip the trap
                </Text>
              </Pressable>
            </View>

          </Animated.View>
        </Pressable>
        {/* <View style={{
          width:200,
          height:200,
          backgroundColor:trapStatusColors[item?.status],
          position:'absolute',
          top:0,
          right: 20,
          zIndex:100
        }}>

        </View> */}
      </Modal>


    </View >
  )
}

export default TrapTagSvg
