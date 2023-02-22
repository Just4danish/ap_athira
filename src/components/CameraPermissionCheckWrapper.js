import { View, Text, Linking } from 'react-native'
import { Camera } from 'react-native-vision-camera'
import React, { useState, useEffect, useCallback } from 'react'
import CameraPermissionLottie from './CameraPermissionLottie'
import { globalStyles } from './styles'
import LargeButton from './Buttons/LargeButton'

export default function CameraPermissionCheckWrapper({ children }) {
  const [granted, setGranted] = useState('loading')
  useEffect(() => {
    requestPermission()
  }, []);

  const requestPermission = useCallback(
    async () => {
      const permission = await Camera.requestCameraPermission()
      setGranted(permission)
    }, []
  )

  const pressHandler = async () => {
    await Linking.openSettings()
  }
  if (granted === 'authorized') {
    return (
      <View style={{
        position: 'absolute',
        top:0,
        bottom:0,
        left:0,
        right: 0,
        }}>
        {children}
      </View>
    )
  }
  else if(granted === 'denied') {
    return (<View style={{ flex: 1 }}>
      <CameraPermissionLottie />
      <View style={{
        position: 'absolute',
        bottom: 200,
        alignSelf: 'center'
      }}>
        <Text style={globalStyles.h2_bold}>
          Enable Camera
        </Text>
        <Text style={globalStyles.h2_bold}>
          Please provide us access to your camera, which is required to scan the QR code.
        </Text>
        <LargeButton label='Go to settings' onPress={pressHandler} />
      </View>
    </View>)
  }
}