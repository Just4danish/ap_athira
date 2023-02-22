import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming } from 'react-native-reanimated';
import { useEffect, useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '../styles';
import { DriverJobContext } from '../../context/DriverJobContext';
import { useIsFocused } from '@react-navigation/native';

export default function SearchBox(props) {
    const { width, height } = Dimensions.get('window');
    const offsetWidth = useSharedValue(0);
    const offsetBottom = useSharedValue(0);
    const offsetOpacity = useSharedValue(1);
    const offsetTabBarXtranslation = useSharedValue(-300);
    const driverJobContext = useContext(DriverJobContext)

    const animatedWidth = useAnimatedStyle(() => {
        return {
            width: offsetWidth.value
        };
    });
    const animatedBottom = useAnimatedStyle(() => {
        return {
            bottom: offsetBottom.value
        };
    });
    const animatedOpacity = useAnimatedStyle(() => {
        return {
            opacity: offsetOpacity.value
        };
    });
    const animatedStylesXTranslate = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offsetTabBarXtranslation.value }],
        };
    });

    const animationHandler = () => {
        offsetWidth.value = withSpring(width * .85)
        offsetBottom.value = withSpring(75)
        animatedOpacity.value = withTiming(0.5, {
            duration: 10000,
            // easing: Easing.out(),
        });
        offsetTabBarXtranslation.value = withTiming(0, {
            duration: 1000,
            easing: Easing.out(Easing.exp),
        });
    }
    useEffect(() => {
        if (props.activeIndex === 0) {
            animationHandler()
        }
        else {
            driverJobContext.setJobSearchText('')
        }
    }, [props.activeIndex])
    const isFocused = useIsFocused()
    useEffect(() => {
        driverJobContext.setJobSearchText('')
        return (() => {
            driverJobContext.setJobSearchText('')
        })
    }, [isFocused])

    return (
        <Animated.View style={[{
            position: 'absolute',
            width: 300,
            height: 50,
            backgroundColor: "#FFF7EB",
            borderRadius: 25,
            top: 0,
            elevation: 5,
            justifyContent: "flex-start",
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: "center",
            
        }
            , animatedWidth
            , animatedBottom
            , animatedOpacity
            , animatedStylesXTranslate
        ]}>
            <Svg width={props.icon.width} height={props.icon.height} style={{ marginLeft: 15 }}>
                <Path d={props.icon.d} fill={props.icon.fill} />
            </Svg>
            <TextInput
                value={driverJobContext.jobSearchText}
                onChangeText={(value) => driverJobContext.setJobSearchText(value)}
                placeholder='Search here...  '
                placeholderTextColor={Colors.dark_gray}
                style={{ color: Colors.dark_gray, paddingLeft: 20, fontFamily: "Montserrat-Medium", fontSize: 16, width: width * .6 }}
            />

        </Animated.View>
    )
}