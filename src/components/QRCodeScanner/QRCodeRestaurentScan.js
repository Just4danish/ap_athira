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
import AbaciLoader from '../../components/AbaciLoader'
import Geolocation from 'react-native-geolocation-service';
import { useContext } from 'react'
import LocationPermissionCheckWrapper from '../LocationPermissionCheckWrapper'
import CameraPermissionCheckWrapper from '../CameraPermissionCheckWrapper'
import { DriverJobContext } from '../../context/DriverJobContext'
import { FlatList } from 'react-native-gesture-handler'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, SlideInRight, BounceInRight, BounceInLeft, FadeOutRight } from 'react-native-reanimated';
import JobCard from '../../components/Jobs/JobCard'
import { globalStyles } from '../styles'


export default function QRCodeRestaurentScan() {
    const driverJobContext = useContext(DriverJobContext)
    const toastContext = useContext(ToastContext)
    const { authAxios } = useContext(AxiosContext)
    const [barcode, setBarcode] = useState("")
    const [scanned, setScanned] = useState(false)
    const [location, setLocation] = useState('')
    const [backendLoading, setBackendLoading] = useState('')
    const navigationContext = useContext(NavigationContext)
    const [qrScannedMultipleUnAssignedJobs, setQRScannedMultipleUnAssignedJobs] = useState(null);
    const navigation = useNavigation()
    const [frameProcessor, barcodes] = useScanBarcodes([
        BarcodeFormat.QR_CODE
    ])
    const devices = useCameraDevices()
    const device = devices?.back
    const backHandler = () => {
        navigationContext.setTabPosition('home')
        navigationContext.showSideBarSwitch()
        navigationContext.showTabBar()
        setBarcode('')
        return true
    }
    const isFocused = useIsFocused()
    useEffect(() => {
        if (isFocused) {
            Geolocation.getCurrentPosition(
                (position) => {
                    setLocation(JSON.stringify(position.coords));
                },
                (error) => {
                },
                { enableHighAccuracy: true, timeout: 1500, maximumAge: 1000 }
            );
        }
        else {
            setBarcode('')
        }
        return (() => {
            setBarcode('')
        })
    }, [isFocused])

    useEffect(() => {
        if(isFocused){
            BackHandler.addEventListener('hardwareBackPress', backHandler)
        }
        else{
            BackHandler.removeEventListener('hardwareBackPress', backHandler)
        }
        return (() => {
            BackHandler.removeEventListener('hardwareBackPress', backHandler)
        })
    }, [isFocused])

    useEffect(() => {
        if (barcodes !== null) {
            if (barcodes.length > 0) {
                if (typeof (barcodes[0]?.content?.data) !== "undefined") {
                    const barcode = barcodes[0]?.content?.data
                    if (barcode !== '') {
                        setBarcode(barcode)
                    }
                }
            }
        }
    }, [barcodes])


    const fetchData = (data) => {
        setBackendLoading('loading')
        const url = '/entity_api/entity_qrcode_scan'
        authAxios.post(url, data).then(response => {
            if (response.data.length === 1) {
                const tempSelectedJob = response.data[0]
                // driverJobContext.setSelectedJob(tempSelectedJob)
                navigation.navigate("JobDetailsScreen", {
                    jobDetails: tempSelectedJob.selected_job
                })
                navigationContext.setTabPosition('filter')
                driverJobContext.setAllJobs(tempSelectedJob.all_jobs)
                setBackendLoading('')
                setQRScannedMultipleUnAssignedJobs(null)
                setBarcode('')
            }
            else if (response.data.length > 1) {
                setQRScannedMultipleUnAssignedJobs(response.data)
                setBackendLoading('')
            }
            else {
                toastContext.showToast("No assigned Jobs found !", 'short', 'warning')
                setBackendLoading('')
                setBarcode('')
            }
        })
            .catch(error => {
                let message = "Invalid QR Code !"
                try {
                    message = error?.response?.data?.error
                }
                catch { }
                toastContext.showToast(message, 'short', 'warning')
                setBackendLoading('')
                setBarcode('')
            })

    }

    useEffect(() => {
        if (barcode !== '') {
            const data = {
                random_key: barcode,
                qr_scan_location: location
            }
            fetchData(data)
        }
    }, [barcode])

    const pressHandler = (item) => {
        const data = {
            qr_scan_location: location,
            random_key: barcode,
            service_request_id: item.id
        }
        fetchData(data)
    }




    if (barcode === '') {
        return (
            <LocationPermissionCheckWrapper>
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
            </LocationPermissionCheckWrapper>
        )
    }
    else {
        if (backendLoading === 'loading') {
            return <AbaciLoader />
        }
        else {
            return (
                <FlatList
                    data={qrScannedMultipleUnAssignedJobs}
                    renderItem={({ item, index }) => (
                        <Animated.View
                            entering={BounceInLeft.delay(index * 50)}
                            exiting={FadeOutRight.delay(index * 50)}
                            key={index}
                        >
                            <Pressable
                                onPress={() => pressHandler(item)}
                            >
                                <JobCard item={item} />
                            </Pressable>
                        </Animated.View>)}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={<View style={{ height: 150 }}></View>}
                    ListHeaderComponent={<View style={{ height: 150, paddingTop: 10 }}>
                        <Text style={[globalStyles.h2_bold, { color: 'white', margin: 30 }]}>
                            Found multiple unassigned jobs. {'\n'}
                            Please select the required job from the below list !
                        </Text>
                    </View>}
                />
            )
        }

    }

}