import { ToastAndroid, View, Text } from 'react-native';
import React, { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import Animated, { BounceInUp, BounceOutUp } from 'react-native-reanimated';
import { globalStyles } from './styles';

export default function AbaciToast() {
  const toastContext = useContext(ToastContext)
  if (toastContext.toastVisibility) {
    return (
      <Animated.View
        entering={BounceInUp}
        exiting={BounceOutUp}
        style={{
          position: 'absolute',
          top: 50,
          width: '80%',
          minHeight: 50,
          backgroundColor: toastContext.toastType,
          alignSelf: 'center',
          borderRadius: 5,
          justifyContent: 'center',
          padding:10,
        }}>
        <Text style={[globalStyles.h2_bold, { color: 'white' }]}>{toastContext.toastMessage}</Text>
      </Animated.View>
      )
  }
  else {
    return null;
  }
}