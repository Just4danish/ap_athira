import { View, Text, StyleSheet, Pressable, TouchableOpacity, Touchable } from 'react-native'

import React, { useState, useEffect, useRef } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, BounceInLeft, FlipInYRight, ZoomInEasyDown, ZoomOutEasyDown } from 'react-native-reanimated';

export default function PopUpConditionSelector({
    yLocationForPopUp,
    setPopupShow
}) {

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

    return (
        <Pressable style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        }}
            onPressIn={() => setPopupShow(false)}
        >
            <AnimatedTouchable
                entering={ZoomInEasyDown}
                exiting={ZoomOutEasyDown}
                style={[{
                    position: "absolute",
                    width: 300,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "rgba(27, 28, 29, 0.5)",
                    top: yLocationForPopUp,
                    alignSelf: "center"
                    // left:0
                }]}

            >
                <Text style = {{
                    fontSize:20
                }}>👌</Text>

            </AnimatedTouchable>
        </Pressable>
    )
}