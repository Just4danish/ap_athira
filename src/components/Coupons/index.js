import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable, TouchableOpacity, Modal, TextInput } from 'react-native'

import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, SlideInRight, FadeIn, FadeOut, BounceInLeft, FadeOutRight, ColorSpace } from 'react-native-reanimated';

import React, { useState, useEffect, useContext } from 'react'
import { OperatorJobContext } from '../../context/OperatorJobContext';
import CouponCard from './CouponCard'
import { Colors } from '../styles';
import { BlurView } from "@react-native-community/blur";
import { globalStyles } from '../styles';
import ScanBarcodeLottie from './ScanBarcodeLottie';
import BarcodeCam from './BarcodeCam'
import { useIsFocused } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AuthContext } from '../../context/AuthContext';
import moment from 'moment/moment';
import EmptyCoupon from './EmptyCoupon';
import ModalButton from '../Buttons/ModalButton';
import LargeButton from '../Buttons/LargeButton';
import baseURL from '../../helpers/baserURL';
import { ToastContext } from '../../context/ToastContext';
import AbaciLoader from '../AbaciLoader';



export default function Index() {
    const operatorJobContext = useContext(OperatorJobContext)
    const authContext = useContext(AuthContext)
    const [couponAddPressed, setCouponAddPressed] = useState(false)
    const [couponAddModalVisibility, setCouponAddModalVisibility] = useState(false)
    const [scanningInProcess, setScanningInProcess] = useState(false);
    const [scannedCode, setScannedCode] = useState('');
    const [weightOfWasteCollected, setWeightOfWasteollected] = useState('')
    const [backendLoadingStatus, setBackendLoadingStatus] = useState('success')
    const isFocused = useIsFocused()
    const toastContext = useContext(ToastContext)
    const couponAddPressHandler = () => {
        setCouponAddModalVisibility(true)
    }
    const pressHandler = () => { }
    const couponModalCloseHandler = () => {
        setCouponAddModalVisibility(false)
        setScannedCode('')
        setWeightOfWasteollected('')
    }
    const coupenPhotoHandler = (image) => {
        try{
            var formdata = new FormData();
            formdata.append('coupon_no', Number(scannedCode));
            formdata.append('total_gallons', weightOfWasteCollected);
            formdata.append('driver_id', operatorJobContext.selectedVehicle.driver.id);
            formdata.append('vehicle_id', operatorJobContext.selectedVehicle.id);
            const couponImage = image.assets[0]
            const file = {
                    uri: couponImage.uri,
                    name: couponImage.fileName,
                    type: couponImage.type,
                }
            formdata.append('coupon_image', file);
            couponPosthandler(formdata)
        }
        catch {
            let message = "Error in capturing image !"
            toastContext.showToast(message, 'short', 'error')
            couponModalCloseHandler()
        }
    }

    const couponPosthandler = (formdata) => {
        setBackendLoadingStatus('loading')
        const requestOptions = {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${authContext.getAccessToken()}`
            },
            body: formdata,
            redirect: 'follow'
        };
        const url = baseURL + "/gtcc_api/adddeletecoupon/1"
        fetch(url, requestOptions)
        .then((response) => {
            return(response.json())
        }
        )
        .then((data) => {
            let message = "Error occured. Please try again !"
            let status = 'error'
            try{
                message = data.response
                status = data.status
            }
            catch{}
            if (status === 'success'){
                operatorJobContext.setCouponsState(data.data)
            }
            toastContext.showToast(message, 'short', status)
            couponModalCloseHandler()
            setBackendLoadingStatus('success')
            setScannedCode('')
        })
        .catch(error => {
            let message = "Error occured. Please try again !"
            toastContext.showToast(message, 'short', 'error')
            setBackendLoadingStatus('error')
            setScannedCode('')
        });
    }
    const imagePickerHandler = async (type) => {
        launchCamera({
            mediaType: 'photo',
            maxWidth: 1280,
            maxHeight: 720,
            cameraType: 'back',
        },
            coupenPhotoHandler
        )
    }
    const couponAddHandler = () => {
        setCouponAddModalVisibility(false)
        setTimeout(() => {
            if (scannedCode === '') {
                setScanningInProcess(true)
            }
            else {
                imagePickerHandler()
            }
        }, 500)
    }
    useEffect(() => {
        if (!isFocused) {
            setScannedCode('')
            setWeightOfWasteollected('')
        }

    }, [isFocused])

    const saveHandler = () => {


    }
    return (
        <View style={{ flex: 1 }}>
            <AbaciLoader visible={backendLoadingStatus==='loading'}/>
            {
                scanningInProcess ?
                    <BarcodeCam setScannedCode={setScannedCode} setScanningInProcess={setScanningInProcess} setCouponAddModalVisibility={setCouponAddModalVisibility} />
                    :
                    <View style={styles.mainWrapper}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={couponAddModalVisibility}
                            onRequestClose={couponModalCloseHandler}

                        >
                            <BlurView
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                }}
                                blurType="dark"
                                blurAmount={10}
                                reducedTransparencyFallbackColor="white"
                            />


                            <View
                                style={{
                                    backgroundColor: "white",
                                    height: 500,
                                    width: '90%',
                                    alignSelf: 'center',
                                    marginTop: "20%",
                                    borderRadius: 5,
                                    elevation: 25,
                                    borderWidth: 0.5,
                                    borderColor: Colors.light_gray,
                                    justifyContent: 'center',
                                    padding: 20
                                }}>
                                <View style={{ height: '50%' }}>
                                    {
                                        scannedCode === "" ?
                                            <Animated.View entering={FadeIn} exiting={FadeOut} style={{ width: 200, height: 200, alignSelf: 'center' }}>
                                                <Text style={globalStyles.h2_bold}>Please scan the Barcode on The Coupon!</Text>
                                                <ScanBarcodeLottie />
                                            </Animated.View>
                                            :
                                            <View>
                                                <Animated.Text
                                                    entering={FadeIn}
                                                    exiting={FadeOut}
                                                    style={[globalStyles.h1, { fontSize: 16, color: 'black' }]}>{'\n\n'}The scanned coupon id is
                                                    <Text style={globalStyles.h2_bold}> {scannedCode}</Text>
                                                    {'\n'} If correct, please provide the Weight of the waste collected !</Animated.Text>
                                                <Animated.View
                                                    entering={FadeIn}
                                                    exiting={FadeOut}
                                                    style={{
                                                        margin: 20
                                                    }}
                                                >
                                                    <TextInput
                                                        placeholder='Weight in Gallon'
                                                        value={weightOfWasteCollected}
                                                        style={{
                                                            height: 40,
                                                            borderWidth: 1,
                                                            width: '50%',
                                                            alignSelf: 'center',
                                                            borderRadius: 5,
                                                            borderColor: Colors.light_gray,
                                                            color: Colors.gray
                                                        }}
                                                        placeholderTextColor={Colors.gray}
                                                        onChangeText={value => setWeightOfWasteollected(value)}
                                                        keyboardType='numeric'

                                                    />
                                                </Animated.View>
                                                {
                                                    weightOfWasteCollected === '' ? null :
                                                        <Animated.Text
                                                            entering={FadeIn}
                                                            exiting={FadeOut}
                                                            style={[globalStyles.h1, { fontSize: 16 }]}>Please continue to take the Photo of the voucher and save it!
                                                        </Animated.Text>

                                                }


                                            </View>
                                    }
                                </View>

                                <View style={{
                                    flexDirection: "row",
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <ModalButton
                                        color='red'
                                        onPress={couponModalCloseHandler}
                                        label='Cancel'
                                    />
                                    <ModalButton
                                        color='green'
                                        onPress={couponAddHandler}
                                        label={
                                            scannedCode === '' ?
                                                <Text style={[globalStyles.h2_bold, { color: "white" }]}>
                                                    Scan
                                                </Text>
                                                :
                                                <Text style={[globalStyles.h2_bold, { color: "white" }]}>
                                                    Continue
                                                </Text>
                                        }
                                        disabled={weightOfWasteCollected === '' && scannedCode !== ''}
                                    />
                                </View>
                            </View>
                        </Modal>
                        <FlatList
                            data={operatorJobContext.couponsState}
                            renderItem={({ item, index }) => (
                                <Animated.View
                                    entering={BounceInLeft.delay(index * 50)}
                                    exiting={FadeOutRight.delay(index * 50)}
                                    key={index}
                                >
                                    <Pressable onPress={() => pressHandler(item)}>
                                        <CouponCard item={item} />
                                    </Pressable>
                                </Animated.View>)}
                            keyExtractor={(item, index) => index}
                            ListEmptyComponent={<EmptyCoupon />}
                            ListHeaderComponent={<View style={{ height: 50 }}></View>}
                            ListFooterComponent={<View style={{ height: 300, padding: 50 }}/>}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 23,
                            right: 23,
                            width: 70,
                            height: 70,
                            borderRadius: 50,
                            backgroundColor: 'white',
                            elevation: couponAddPressed ? 3 : 10,
                            borderWidth: 0.5,
                            borderColor: Colors.light_gray,
                            justifyContent: 'center'

                        }}>
                            <TouchableOpacity style={{ width: '100%', height: '100%', }}
                                onPress={couponAddPressHandler}
                                onPressIn={() => setCouponAddPressed(true)}
                                onPressOut={() => setCouponAddPressed(false)}
                            >

                                <Text style={{
                                    color: Colors.gray,
                                    fontSize: 50,
                                    fontWeight: 'light',
                                    alignSelf: 'center'
                                }}>
                                    +
                                </Text>

                            </TouchableOpacity>


                        </View>
                    </View >
            }
        </View>
    )
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        // backgroundColor:"red"
    }
})
