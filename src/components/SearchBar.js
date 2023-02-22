import { View, Text, Dimensions, Keyboard } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, BounceInLeft, BounceOutLeft } from 'react-native-reanimated';
import React, { useState, useEffect, useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import { TextInput } from 'react-native-gesture-handler';
import { Colors } from './styles';
import { useIsFocused } from '@react-navigation/native';

export default function SearchBar({searchValue, setSeachValue}) {
    const { width, height } = Dimensions.get('window');
    return (
        <Animated.View style={{
            position: 'absolute',
            top:50,
            width: '90%',
            height: 50,
            backgroundColor: "#FFF7EB",
            borderRadius: 25,
            bottom: 0,
            elevation: 5,
            justifyContent: "flex-start",
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: "center",
            alignSelf:'center'
        }}
        entering={BounceInLeft}
        exiting={BounceOutLeft}
        >
            <Svg width={24} height={24} style={{ marginLeft: 15 }}>
                <Path d="M19.4697 20.5303C19.7626 20.8232 20.2375 20.8232 20.5304 20.5303C20.8233 20.2374 20.8233 19.7626 20.5304 19.4697L19.4697 20.5303ZM15.8033 15.8033L16.3337 15.273C16.184 15.1233 15.978 15.0438 15.7666 15.0542C15.5552 15.0646 15.358 15.1638 15.2237 15.3274L15.8033 15.8033ZM17.115 11.8508C17.0326 12.2567 17.2948 12.6526 17.7008 12.735C18.1067 12.8174 18.5026 12.5551 18.585 12.1492L17.115 11.8508ZM20.5304 19.4697L16.3337 15.273L15.273 16.3336L19.4697 20.5303L20.5304 19.4697ZM10.5 17.25C6.77208 17.25 3.75 14.2279 3.75 10.5H2.25C2.25 15.0563 5.94365 18.75 10.5 18.75V17.25ZM3.75 10.5C3.75 6.77208 6.77208 3.75 10.5 3.75V2.25C5.94365 2.25 2.25 5.94365 2.25 10.5H3.75ZM10.5 3.75C14.2279 3.75 17.25 6.77208 17.25 10.5H18.75C18.75 5.94365 15.0563 2.25 10.5 2.25V3.75ZM17.25 10.5C17.25 10.9633 17.2034 11.415 17.115 11.8508L18.585 12.1492C18.6933 11.6157 18.75 11.0641 18.75 10.5H17.25ZM10.5 18.75C12.4142 18.75 13.8749 18.1477 14.8586 17.5396C15.3492 17.2363 15.7216 16.9314 15.9748 16.6984C16.1016 16.5817 16.199 16.4825 16.2669 16.4098C16.3009 16.3735 16.3276 16.3437 16.3469 16.3215C16.3566 16.3105 16.3645 16.3013 16.3705 16.2942C16.3735 16.2907 16.376 16.2876 16.3781 16.2851C16.3792 16.2839 16.3801 16.2827 16.3809 16.2817C16.3813 16.2812 16.3817 16.2808 16.3821 16.2804C16.3822 16.2801 16.3825 16.2799 16.3826 16.2797C16.3828 16.2795 16.383 16.2792 15.8033 15.8033C15.2237 15.3274 15.2239 15.3272 15.2241 15.3269C15.2241 15.3268 15.2243 15.3266 15.2245 15.3264C15.2247 15.3261 15.2249 15.3259 15.2251 15.3257C15.2255 15.3252 15.2258 15.3249 15.2259 15.3247C15.2263 15.3243 15.2262 15.3244 15.2257 15.325C15.2246 15.3262 15.2219 15.3294 15.2175 15.3344C15.2088 15.3444 15.1933 15.3618 15.1711 15.3855C15.1268 15.433 15.056 15.5054 14.959 15.5947C14.7647 15.7735 14.4675 16.0178 14.0698 16.2637C13.2768 16.7539 12.0858 17.25 10.5 17.25V18.75Z"
                fill="#BD7912" />
            </Svg>
            <TextInput
                value={searchValue}
                onChangeText={(value) => setSeachValue(value)}
                placeholder='What are you looking for?'
                placeholderTextColor={Colors.dark_gray}
                style={{ color: Colors.dark_gray, paddingLeft: 20, fontFamily: "Montserrat-Medium", fontSize: 15, width: width * .6 }}
            />

        </Animated.View>
    )
}