import * as React from "react"
import Animated, { ZoomInLeft, ZoomOutLeft } from 'react-native-reanimated';
import {
  View,
  TouchableOpacity
} from 'react-native';
import { useNavigation, DrawerActions } from "@react-navigation/native";


function SideNavigationButton(props) {
  const navigation = useNavigation()
  return (
    <View style={{
      position: 'absolute',
      top: 50,
      left: 5,
      width: 50,
      height: 50,
      elevation: 50,
    }}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{
          width: 50,
          height: 50,
        }}
        >
        <Animated.View
          entering={ZoomInLeft}
          exiting={ZoomOutLeft}
          style={{
            marginTop: 1,
            marginLeft: 10,
            marginBottom: 3,
            // elevation: 15,
            backgroundColor: 'white',
            height: 2,
            width: 25,
            borderRadius: 3,

          }}>
        </Animated.View>
        <Animated.View
          entering={ZoomInLeft.delay(100)}
          exiting={ZoomOutLeft.delay(100)}
          style={{
            marginTop: 1,
            marginLeft: 15,
            marginBottom: 3,
            // elevation: 15,
            backgroundColor: 'white',
            height: 2,
            width: 25,
            borderRadius: 3,

          }}>
        </Animated.View>
        <Animated.View
          entering={ZoomInLeft.delay(200)}
          exiting={ZoomOutLeft.delay(200)}
          style={{
            marginTop: 1,
            marginLeft: 10,
            marginBottom: 3,
            // elevation: 15,
            backgroundColor: 'white',
            height: 2,
            width: 25,
            borderRadius: 3,

          }}>
        </Animated.View>
      </TouchableOpacity>


    </View>
  )
}

export default SideNavigationButton
