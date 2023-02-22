import {
    Animated,
    Text,
    View,
    StyleSheet,
    Dimensions,
    TextInput,
    Pressable,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { Svg, Path } from 'react-native-svg';
import Lottie from 'lottie-react-native';
import { Colors, globalStyles } from '../components/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';
import { AxiosContext } from '../context/AxiosContext';
import { _storeData } from '../helpers/asyncStorageHelper';
import ConnectionErrorLottie from '../components/ConnectionErrorLottie'
const backgroundImage = require('../assets/images/bg_images_login.jpg');
const logo = require('../assets/images/logo.png');

export default function Login() {
    const windowWidth = Dimensions.get('window').width;
    const windowWidth2 = Dimensions.get('window').width * 3;
    const windowHeight = Dimensions.get('window').height;
    const windowHeight2 = Dimensions.get('window').height * 3;
    const [xpos, setXpos] = useState(new Animated.Value(0));
    const [xposSvg, setXposSvg] = useState(new Animated.Value(0));
    const [scale, setScale] = useState(new Animated.Value(0));
    const [translateYLogo, setTranslateYLogo] = useState(new Animated.Value(0));
    const [translateYForm, setTranslateYForm] = useState(new Animated.Value(0));
    const [waitForAxios, setWaitForAxios] = useState(false);

    const loginAnimation = () => {
        Animated.decay(xpos, {
            velocity: -0.8,
            deceleration: 0.997,
            useNativeDriver: false,
        }).start();
        Animated.decay(xposSvg, {
            velocity: -1.1,
            deceleration: 0.996,
            useNativeDriver: false,
        }).start();
        setTimeout(() => {
            Animated.timing(scale, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: false,
            }).start();
            Animated.timing(translateYLogo, {
                toValue: windowHeight / 2 + 25,
                duration: 500,
                useNativeDriver: false,
            }).start();
            Animated.timing(translateYForm, {
                toValue: windowHeight / 2 + 225,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        }, 300);
    };
    useEffect(() => {
        xpos.setValue(0);
        xposSvg.setValue(25);
        scale.setValue(0);
        translateYLogo.setValue(windowHeight * 2);
        translateYForm.setValue(windowHeight * 2);
        loginAnimation();
    }, []);

    const handleSubmit = () => {
    };
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
            }}>
            <Animated.Image
                source={backgroundImage}
                resizeMode="cover"
                style={{
                    width: windowWidth,
                    height: windowHeight,
                    position: 'absolute',
                    top: xpos,
                    left: 0,
                }}
            />
            <Animated.View
                style={{
                    top: xposSvg,
                    left: -20,
                }}>
                <Svg width={windowWidth2} height={windowHeight2}>
                    <Path
                        d={`M0,665.88c0,0,1.14-93.88,74.61-89.8c73.47,4.08,145.92,84.69,200-24.49s113.94-140.85,132.31-140.85
      s20.75,5.14,20.75,5.14L428,926H0V665.88z`}
                        fill="rgba(130, 197, 91, 0.38)"
                    />
                    <Path
                        d={`M0,683.75c0,0,1.14-93.88,74.61-89.8c73.47,4.08,145.92,84.69,200-24.49s113.94-140.85,132.31-140.85
      s20.75,5.14,20.75,5.14L428,943.87H0V683.75z`}
                        fill="white"
                    />
                </Svg>
            </Animated.View>
            <Animated.View
                style={{
                    position: 'absolute',
                    // backgroundColor: "red",
                    width: 120,
                    height: 120,
                    top: windowWidth / 2 + 20,
                    right: 5,
                    transform: [
                        {
                            scale: scale,
                        },
                    ],
                }}>
                <Lottie
                    source={require('../assets/lottie/recycle.json')}
                    autoPlay
                    loop
                />
            </Animated.View>



            <Animated.Image
                source={logo}
                resizeMode="contain"
                style={{
                    position: 'absolute',
                    width: '60%',
                    margin: '20%',
                    height: 120,
                    top: -150,
                    justifyContent: 'center',
                    // right: 10,
                    transform: [
                        {
                            translateY: translateYLogo,
                        },
                    ],
                }}></Animated.Image>


            <Animated.View
                style={{
                    position: 'absolute',
                    width: '80%',
                    margin: '10%',
                    height: 120,
                    top: -90,
                    justifyContent: 'center',
                    transform: [
                        {
                            translateY: translateYForm,
                        },
                    ],
                }}>
                <Text style={globalStyles.h4_bold}>
                    Smart Grease Trap Server Not reachable ! {'\n'}
                    Please check your connection and retry !
                </Text>
                <ConnectionErrorLottie />
                <Pressable
                    style={styles.login_button}
                    android_ripple={{ color: 'green' }}
                    onPress={handleSubmit}
                    disabled={false}>
                    {waitForAxios ? (
                        <ActivityIndicator size="large" color={Colors.primary} />
                    ) : (
                        <Text style={{ ...globalStyles.h2_bold, color: Colors.dark_green }}>
                            Retry
                        </Text>
                    )}
                </Pressable>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    text_input_section: {
        backgroundColor: Colors.dark_green,
        flexDirection: 'row',
        borderRadius: 5,
        marginTop: 10,
    },
    text_input_button_wrapper: {
        backgroundColor: Colors.white,
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 30,
        borderWidth: 1,
        borderColor: Colors.dark_green,
    },
    text_form_message: {
        color: Colors.blue,
        fontSize: 20,
        textAlign: 'center',
    },
    text_input_label: {
        color: Colors.tertiary,
        fontSize: 13,
        textAlign: 'left',
        // marginTop: 15,
    },
    text_input: {
        // backgroundColor: Colors.secondary,
        fontFamily: 'Montserrat-Medium',
        fontSize: 15,
        color: '#fffff',
    },
    input_icon: {
        margin: 10,
    },
    button_wrapper: {
        flex: 3,
        alignItems: 'center',
    },
    login_button: {
        height: 50,
        width: '100%',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "green",
        borderWidth: 1,
        marginTop: 25
    },
    login_button_text: {
        color: Colors.green,
        fontFamily: 'Montserrat-Black',
        fontSize: 18,
        fontWeight: 'bold',
    },
    title_wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
