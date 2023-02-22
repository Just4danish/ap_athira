import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, Modal, Linking, TurboModuleRegistry, Image } from 'react-native'
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react'
// import ScreenWrapper from "../ScreenWrapper"
import { useSelector } from 'react-redux'
import { globalStyles, jobStatusColors } from '../styles'
import { Colors } from '../styles'
import CardTagSvg from "../Jobs/CardTagSvg"
import TrapTagSvg from "../Jobs/TrapTagSvg"
import Line from "../Jobs/Line"
import Animated, { useSharedValue, useAnimatedStyle, withSpring, color, Easing, withTiming, BounceInLeft, FlipInYRight, ZoomInEasyDown, ZoomOutEasyDown, FadeIn, BounceOutRight } from 'react-native-reanimated';
import { useIsFocused, useNavigation } from '@react-navigation/native'
import PopUpConditionSelector from '../PopUpConditionSelector'
import { conditions } from '../PopUpConditionSelector/conditions'
import { DriverJobContext } from '../../context/DriverJobContext'
import { AxiosContext } from '../../context/AxiosContext'
import { ToastContext } from '../../context/ToastContext'
import NavigationContext from '../../context/NavigationContext'
import EmptyTraps from '../Jobs/EmptyTraps'
import BeforeAndAfterImages from '../Jobs/BeforeAndAfterImages'
import _ from 'lodash'
import { BlurView } from "@react-native-community/blur";
import { AuthContext } from '../../context/AuthContext'
import JobSavingLottie from "../Jobs/JobSavingLottie"
import moment from 'moment/moment'
import baseURL from '../../helpers/baserURL'
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const tempEntityImage = require('../../assets/images/no_restaurent_image.png')
const tempAvatar = require('../../assets/images/avtar.png')


export default function RestaurentDetailsCard({
    setContactModalVisibility,
    navigation,
    avatar,
    setAvatar,
    entityImage,
    setEntityImage,
}) {
    const driverJobContext = useContext(DriverJobContext)
    const toastContext = useContext(ToastContext)
    const onPressContactNumberClick = (number) => {
        setContactModalVisibility(false)
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${number}`;
        } else {
            phoneNumber = `telprompt:${number}`;
        }
        try {
            Linking.openURL(phoneNumber);
        }
        catch {
            let message = 'Error occured'
            toastContext.showToast(message, 'short', 'error')
        }
    }
    const onLocationClick = (gps_coordinates, label) => {
        const tempRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/
        if (tempRegex.test(gps_coordinates)) {
            try {
                const [lat, lng] = gps_coordinates.split(', ')
                const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                // const latLng = `${'24.934737668227264'},${'55.47716251374936'}`;
                const latLng = `${lat},${lng}`;
                const url = Platform.select({
                    ios: `${scheme}${label}@${latLng}`,
                    android: `${scheme}${latLng}(${label})`
                });
                Linking.openURL(url);
            }
            catch
            {
                let message = 'Invalid Coordinates'
                toastContext.showToast(message, 'short', 'error')
            }
        }
        else {
            let message = 'Invalid Coordinates'
            toastContext.showToast(message, 'short', 'error')
        }

    }
    return (
        <View
            style={styles.cardWrapper}
        >
            <View
                style={{
                    width: '100%',
                    height: 200,
                }}>
                <Image
                    style={{
                        width: '100%',
                        height: 200,
                        resizeMode: 'cover'
                    }}
                    source={entityImage}
                    onError={(e) => setEntityImage(tempEntityImage)
                    }

                />
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: 50,
                    backgroundColor: jobStatusColors[`${driverJobContext.selectedJob?.status}_transparent`],
                    borderColor: jobStatusColors[driverJobContext.selectedJob?.status],
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: 20,
                }}>
                    <Text style={styles.restaurentName} numberOfLines={2}>{driverJobContext.selectedJob?.restaurant?.establishment_name}</Text>
                    <TouchableOpacity
                        onPress={() => setContactModalVisibility(true)}
                    >
                        <Image
                            style={{
                                margin: 10,
                                width: 75,
                                height: 75,
                                resizeMode: "cover",
                                borderRadius: 40,
                            }}
                            source={avatar}
                            onError={(e) => setAvatar(tempAvatar)}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={
                {
                    width: '100%',
                    height: 75,
                    // borderBottomColor: 'orange',
                    // borderBottomWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around'
                }
            }>
                <View
                    style={{
                        width: '50%'
                    }}>
                    <CardTagSvg label={driverJobContext.selectedJob?.id} color={jobStatusColors[driverJobContext.selectedJob?.status]} />
                </View>
                <View
                    style={{
                        width: '50%',
                        alignItems: 'flex-end',
                        paddingRight: 20
                    }}>
                    <Text style={{
                        fontFamily: 'Montserrat-Bold',
                        color: '#2a2323',

                    }}>{driverJobContext.selectedJob?.status}</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('TimeLine')}>
                        <Icon name="chart-timeline-variant-shimmer" size={30} color={jobStatusColors[driverJobContext.selectedJob?.status]} />
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 120,
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        width: '80%',
                        paddingLeft: 20,
                        paddingTop: 0
                    }}>
                    {driverJobContext.selectedJob?.restaurant?.address && <Text numberOfLines={2} style={styles.restaurenAddress}>{driverJobContext.selectedJob?.restaurant?.address}</Text>}
                    {driverJobContext.selectedJob?.grease_trap_count && <Text style={styles.restaurenAddress}>No of Traps: {driverJobContext.selectedJob?.grease_trap_count}</Text>}
                    {driverJobContext.selectedJob?.total_gallon_collected && <Text style={styles.restaurenAddress}>{driverJobContext.selectedJob?.total_gallon_collected} Gallons(Total)</Text>}
                </View>
                <View
                    style={{
                        width: '20%',
                        height: 120,
                        justifyContent: 'space-between'
                    }}>
                    <TouchableOpacity
                        onPress={() => onPressContactNumberClick(driverJobContext.selectedJob?.restaurant?.phone_no)}
                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 50,
                                backgroundColor: '#ea4873',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <Icon name="phone" size={30} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onLocationClick(driverJobContext.selectedJob?.restaurant?.gps_coordinates)}
                    // onPress={() => onLocationClick("24.934737668227264, 55.47716251374936", inspectorContext.selectedEntity?.establishment_name)}

                    >
                        <View
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 50,
                                backgroundColor: '#38a344',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Icon name="map-marker" size={30} color="white" />

                        </View>
                    </TouchableOpacity>

                </View>
            </View>
            {/* <View style={{
                width:'100%',
                flexDirection:'row',
                justifyContent:'space-around'
            }}> */}

            {/* </View> */}
            {/* {children} */}
        </View >
    )
}

const styles = StyleSheet.create({
    main_wrapper: {
        flex: 1,
    },
    cardWrapper: {
        backgroundColor: "white",
        height: 420,
        width: "100%",
        alignSelf: "center",
        // margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#d4d4d4"
    },
    dateTime: {
        color: Colors.dark_gray,
        fontFamily: "Montserrat-Italic",
        top: 15,
    },
    restaurentName: {
        color: Colors.white,
        fontFamily: "Montserrat-ExtraBold",
        width: '75%'
    },
    restaurenAddress: {
        color: Colors.dark_gray,
        fontFamily: "Montserrat-Medium",
        fontSize: 14,
    },
    greaseTrapCard: {
        backgroundColor: "white",
        height: windowHeight * .57,
        width: windowWidth * .9,
        marginLeft: windowWidth * .05,
        alignSelf: "center",
        marginTop: 40,
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#d4d4d4"
    },
    trapDetails: {
        fontFamily: "Montserrat-Bold",
        color: Colors.dark_gray,
        margin: 10,
        marginLeft: 20,
    },
    conditionsLabel: {
        fontFamily: "Montserrat-Medium",
        color: Colors.dark_gray,
        margin: 8,
        marginLeft: 40,
    }
})