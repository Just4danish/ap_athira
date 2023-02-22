import { View, Text, BackHandler, Pressable, PermissionsAndroid, GetCurrentLocation } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { Svg, Defs, Rect, Mask } from 'react-native-svg'
import QRCodeLottie from './QRCodeLottie'
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import NavigationContext from '../../context/NavigationContext';
import { AxiosContext } from '../../context/AxiosContext'
import { ToastContext } from '../../context/ToastContext'
import AbaciLoader from '../AbaciLoader'
import Geolocation from 'react-native-geolocation-service';
import { useContext } from 'react'
import LocationPermissionCheckWrapper from '../LocationPermissionCheckWrapper'
import CameraPermissionCheckWrapper from '../CameraPermissionCheckWrapper'
import { DriverJobContext } from '../../context/DriverJobContext'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, SlideInRight, BounceInRight, BounceInLeft, FadeOutRight } from 'react-native-reanimated';
import JobCard from '../Jobs/JobCard'
import { globalStyles } from '../styles'
import { OperatorJobContext } from '../../context/OperatorJobContext'


export default function QRCodeCamTruckLinkingDriver({
    setScannedCode, setScanningInProcess
}) {
    const [frameProcessor, barcodes] = useScanBarcodes([
        BarcodeFormat.QR_CODE
    ])
    const devices = useCameraDevices()
    const device = devices?.back
    useEffect(() => {
        if (barcodes !== null) {
            if (barcodes.length > 0) {
                if (typeof (barcodes[0]?.content?.data) !== "undefined") {
                    const barcode = barcodes[0]?.content?.data
                    if (barcode !== '') {
                        setScannedCode(barcode)
                        setScanningInProcess(false)
                    }
                }
            }
        }
    }, [barcodes])

    return (
        <CameraPermissionCheckWrapper>
            <View style={{ flex: 1 }}>
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }}>
                    {device == null ? null :
                        <Camera
                            style={{ flex: 1 }}
                            device={device}
                            isActive={true}
                            frameProcessor={frameProcessor}
                            frameProcessorFps={5}
                        />}
                </View>
                <View style={{
                    position: "absolute",
                    // backgroundColor: "green",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }} >
                    <Svg
                        height="100%"
                        width="100%"
                    >
                        <Defs>
                            <Mask
                                id="mask"
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                            >
                                <Rect
                                    width="100%"
                                    height="100%"
                                    fill="#fff"
                                />

                                <Rect
                                    x="18%"
                                    y="30%"
                                    width="250"
                                    height="250"
                                    fill="black"
                                />
                            </Mask>
                        </Defs>
                        <Rect
                            width="100%"
                            height="100%"
                            fill="rgba(0,0,0,0.5)"
                            mask="url(#mask)" />

                        <Rect
                            x="18%"
                            y="30%"
                            width="250"
                            height="250"
                            strokeWidth="5"
                            stroke="#59D1DC"
                        />
                    </Svg>

                </View>
                <View style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                }} >
                    <QRCodeLottie />
                </View>

            </View>
        </CameraPermissionCheckWrapper>
    )
}