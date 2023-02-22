import { View, Text, Dimensions, Keyboard } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming } from 'react-native-reanimated';
import React, { useState, useEffect, useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from '../styles';
import { AuthContext } from '../../context/AuthContext';
import { DriverJobContext } from '../../context/DriverJobContext';
import { OperatorJobContext } from '../../context/OperatorJobContext';
import { useIsFocused } from '@react-navigation/native';

export default function SearchBox(props) {
    const { width, height } = Dimensions.get('window');
    const offsetWidth = useSharedValue(0);
    const offsetBottom = useSharedValue(0);
    const offsetOpacity = useSharedValue(1);
    const offsetTabBarXtranslation = useSharedValue(-300);
    const authContext = useContext(AuthContext)
    const driverJobContext = useContext(DriverJobContext)
    const operatorJobContext = useContext(OperatorJobContext)
    const [searchValue, setSeachValue] = useState('')
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          (e) => {
            setIsKeyboardVisible(true)
          },
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          () => {
            setIsKeyboardVisible(false)
          },
        );
    
        return () => {
          keyboardDidHideListener.remove();
          keyboardDidShowListener.remove();
        };
      }, []);

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

    const animationOnKeyBoard = (value) => {
        offsetBottom.value = withTiming(value,{
            duration: 1000,
            easing: Easing.out(Easing.exp),
        })
    }

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
            operatorJobContext.setVehicleSearchText('')
        }
    }, [props.activeIndex])
    const isFocused = useIsFocused()
    useEffect(() => {
        driverJobContext.setJobSearchText('')
        operatorJobContext.setVehicleSearchText('')
        setSeachValue('')

        return (() => {
            driverJobContext.setJobSearchText('')
            operatorJobContext.setVehicleSearchText('')
            setSeachValue('')

        })
    }, [isFocused])
    const searchHandler = (value) => {
        setSeachValue(value)
        if (authContext?.authState?.userDetails?.user_type === 'Driver') {
            driverJobContext.setJobSearchText(value)

        }
        else if (authContext?.authState?.userDetails?.user_type === 'Operator') {
            operatorJobContext.setVehicleSearchText(value)

        }
    }

    // useEffect(()=>{
    //     if (isKeyboardVisible){
    //         animationOnKeyBoard(100)
    //     }
    //     else{
    //         animationOnKeyBoard(75)
    //     }

    // },[isKeyboardVisible])



    return (
        <Animated.View style={[{
            position: 'absolute',
            width: 300,
            height: 50,
            backgroundColor: "#FFF7EB",
            borderRadius: 25,
            bottom: 0,
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
                value={searchValue}
                onChangeText={(value) => searchHandler(value)}
                placeholder='Search here...  '
                placeholderTextColor={Colors.dark_gray}
                style={{ color: Colors.dark_gray, paddingLeft: 20, fontFamily: "Montserrat-Medium", fontSize: 16, width: width * .6 }}
            />

        </Animated.View>
    )
}