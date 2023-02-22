import React, { useEffect } from "react"
import Svg, { LinearGradient, Stop, Path } from "react-native-svg"
import Animated, { useSharedValue, useAnimatedStyle, Easing, withTiming, FadeInUp, FadeOutUp, FadeOutDown } from 'react-native-reanimated';
import TabBar from './TabBar';
import {
  View,
  Keyboard,
} from 'react-native';
import { useContext } from "react";
import NavigationContext from '../context/NavigationContext'
import SideNavigationButton from "../components/SideNavigationButton"
import { Colors } from "./styles";


export default function ScreenWrapper({ navigationShow = true, sideBarShow = true, searchBox = true, changeWithKeyboard = true, children }) {
  const navigationContext = useContext(NavigationContext)
  const offsetTabBarYtranslationForKeyboard = useSharedValue(0);
  const animateViewWhileKeyboard = (val) => {
    offsetTabBarYtranslationForKeyboard.value = withTiming(val, {
      duration: 500,
      easing: Easing.out(Easing.exp),
    });
  }
  const animatedStylesForKeyboardShow = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetTabBarYtranslationForKeyboard.value }],
    };
  });
  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={[{ flex: 1 }, 
          changeWithKeyboard ? animatedStylesForKeyboardShow : null
        ]}
      >
        <SvgComponent
          width="100%" height="110%" />
        <View
          style={{
            flex: 1
          }}
        >
        </View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            height: '100%'
          }}
        >
          {children}
        </View>
      </Animated.View>
      {
        navigationContext.tabBarVisibility && navigationShow ?
          <Animated.View
            entering={FadeInUp}
            exiting={FadeOutDown}
          >
            <TabBar searchBox={searchBox}/>
          </Animated.View>
          : null
      }
      {
        navigationContext.sidebarSwitch && sideBarShow ? <SideNavigationButton /> : null
      }

    </View>
  )
}






























const SvgComponent = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1125 2436"
    style={{
      enableBackground: "new 0 0 1125 2436",
    }}
    xmlSpace="preserve"
    preserveAspectRatio="xMin slice"

    {...props}
  >
    <LinearGradient
      id="a"
      gradientUnits="userSpaceOnUse"
      x1={562.4}
      y1={916.954}
      x2={563.5}
      y2={11.489}
    >
      <Stop
        offset={0.088}
        style={{
          stopColor: "#59d1dc",
        }}
      />
      <Stop
        offset={0.174}
        style={{
          stopColor: "#64c7e2",
        }}
      />
      <Stop
        offset={0.324}
        style={{
          stopColor: "#71bbe8",
        }}
      />
      <Stop
        offset={0.525}
        style={{
          stopColor: "#78b5ec",
        }}
      />
      <Stop
        offset={0.993}
        style={{
          stopColor: Colors.light_blue,
        }}
      />
    </LinearGradient>
    <Path
      d="M1041.58 930H84.42C38.07 930 .5 892.43.5 846.08V.5h1125v845.58c0 46.35-37.57 83.92-83.92 83.92z"
      style={{
        fill: "url(#a)",
      }}
    />
  </Svg>
)

