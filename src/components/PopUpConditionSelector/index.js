import { View, Text, StyleSheet, Pressable, TouchableOpacity, Touchable } from 'react-native'

import React, { useState, useEffect, useRef } from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, BounceInUp, BounceInLeft, FlipInYRight, ZoomInEasyDown, ZoomOutEasyDown } from 'react-native-reanimated';

export default function PopUpConditionSelector({
    yLocationForPopUp,
    setPopupShow,
    selectedCondition,
    setGreaseTraps,
    greaseTraps,
    setNeedToSave,
    selectedTrap
}) {

    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
    const pressHandler = (item) => {
        const tempSeletedGrade = item.label === 'Not set' ? null : item.label
        const tempSelectedCondition = selectedCondition?.key
        let tempSelectedTrap = {...selectedTrap.item}
        tempSelectedTrap = {...tempSelectedTrap,[tempSelectedCondition]: tempSeletedGrade}
        let tempgreaseTraps = [...greaseTraps]
        tempgreaseTraps.splice(selectedTrap.index, 1, tempSelectedTrap)
        setGreaseTraps(tempgreaseTraps)
        setPopupShow(false)
    }

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
                    backgroundColor: "rgba(27, 28, 29, 0.8)",
                    top: yLocationForPopUp,
                    alignSelf: "center"
                    // left:0
                }]}

            >
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                }}>
                    {
                        selectedCondition?.grades.map((item, index) =>
                        (
                            <AnimatedTouchable
                            onPress={()=>pressHandler(item)}
                            entering={BounceInUp}
                            key={index}>
                            <Text style={{
                                fontSize: 20,
                                color: "red",
                                alignSelf: "center",
                                marginTop: 10,
                                marginRight: 15,
                                marginLeft: 15,
                            }}>{item.icon}</Text>
                            </AnimatedTouchable>
                        )
                        )
                    }
                </View>


            </AnimatedTouchable>
        </Pressable>
    )
}