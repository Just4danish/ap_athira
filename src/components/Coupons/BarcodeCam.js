import { View, Text, BackHandler, Linking } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { Svg, Defs, Rect, Mask } from 'react-native-svg'
import ScanBarcodeLottie from './ScanBarcodeLottie'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'
import { useIsFocused } from '@react-navigation/native'
import CameraPermissionCheckWrapper from '../CameraPermissionCheckWrapper'

export default function QRCodeCamTruck(props) {
  const [barcode, setBarcode] = useState("")
  const [scanned, setScanned] = useState(false)
  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.CODE_128
  ])
  const devices = useCameraDevices()
  const device = devices?.back
  const backHandler = () => {
    props.setScanningInProcess(false)
    props.setCouponAddModalVisibility(true)
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler)
    return (() => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler)
    })
  }, [])
  useEffect(() => {
    if (barcodes !== null) {
      if (barcodes.length > 0) {
        if (typeof (barcodes[0]?.content?.data) !== "undefined") {
          props.setScannedCode(barcodes[0]?.content?.data)
          props.setScanningInProcess(false)
          props.setCouponAddModalVisibility(true)
        }
      }
    }
  }, [barcodes])

  return (
    <View style={{ flex: 1 }}>
      {device == null ? null :
        <CameraPermissionCheckWrapper>
          <Camera
            style={{ flex: 1 }}
            device={device}
            isActive={true}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        </CameraPermissionCheckWrapper>
      }
      <ScanBarcodeLottie />
    </View>

  )
}