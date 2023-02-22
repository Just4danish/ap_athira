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
import { ToastContext } from '../context/ToastContext';
import { _storeData } from '../helpers/asyncStorageHelper';
const backgroundImage = require('../assets/images/bg_images_login.jpg');
const logo = require('../assets/images/logo.png');

export default function Login() {
  const windowWidth = Dimensions.get('window').width;
  const windowWidth2 = Dimensions.get('window').width * 3;
  const windowHeight = Dimensions.get('window').height;
  const windowHeight2 = Dimensions.get('window').height * 3;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [xpos, setXpos] = useState(new Animated.Value(0));
  const [xposSvg, setXposSvg] = useState(new Animated.Value(0));
  const [scale, setScale] = useState(new Animated.Value(0));
  const [translateYLogo, setTranslateYLogo] = useState(new Animated.Value(0));
  const [translateYForm, setTranslateYForm] = useState(new Animated.Value(0));
  const [hidePassword, setHidePassword] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waitForAxios, setWaitForAxios] = useState(false);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);
  const { publicAxios } = useContext(AxiosContext);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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

  const passwordHandler = value => {
    if (value.length < 21) {
      setPassword(value);
    }
  };
  const usernameHandler = value => {
    // Check whether the username is only alphanumeric and max letters 10
    if (/^[a-z0-9]+$/i.test(value.toString())) {
      if (value.length < 11) {
        setUsername(value);
      }
    }
    if (value.length === 0) {
      setUsername('');
    }
  };
  const handleSubmit = () => {
    setWaitForAxios(true);
    const url = 'users_api/login';
    // TODO - need to change the username and password here which is hardcoded
    // ***********************************************************************
    // Development
    // Driver Credentials
    // const tempCredentials = { username: 'd1001', password: '1111' };
    // Operator Credentials
    const tempCredentials = { username: 'f001', password: 'Abcd@123' };
    // Inspector Credentials
    // const tempCredentials = { username: 'ins001', password: 'Abcd@123' };
    // ***********************************************************************
    // Production
    // Driver Credentials

    // Operator Credentials
    // const tempCredentials = { username: 'op001', password: 'Abcd@123' };
    // Inspector Credentials

    // Operator Credentials Production
    const credentials = __DEV__ ? tempCredentials : { username: username, password: password };

    publicAxios
      .post(url, credentials)
      .then(response => {
        if (response.data.user.user_status === "Activated") {
          if (response?.data?.user?.user_type === 'Driver') {
            authContext.setVehicleState(response.data.user.vehicle_details)
          }
          const data = {
            userDetails: response.data.user,
            accessToken: response.data.token,
            authenticated: true,
          };
          authContext.setAuthState({
            ...data,
            authenticated: true,
          })
          _storeData('data', JSON.stringify(data));
          setWaitForAxios(false);
          setPassword('');
        }
        else {
          toastContext.showToast(
            message = "The user is not Active !",
            duration = 'short',
            type = 'warning')

          setPassword('');
          setWaitForAxios(false);
        }
      })
      .catch(error => {
        let toastMessage = 'Error occured. Please try again'
        let toastType = 'error'
        if (error?.response?.status === 403) {
          toastMessage = 'Invalid credetials';
          toastType = 'warning'
        } else {
          toastMessage = 'Network error, please check your connection';
        }
        toastContext.showToast(toastMessage, 'short', toastType)
        setWaitForAxios(false);
        setPassword('');
      });
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        transform: [{ translateY: isKeyboardVisible ? -200 : 0 }],
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
          top: -100,
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
          top: -100,
          justifyContent: 'center',
          transform: [
            {
              translateY: translateYForm,
            },
          ],
        }}>
        <Text style={globalStyles.h4_bold}>
          Fogwatch !
        </Text>
        <View style={styles.text_input_section}>
          <Icon
            name="person"
            size={30}
            color={Colors.white}
            style={styles.input_icon}
          />
          <TextInput
            style={{ ...globalStyles.h2, color: Colors.white, textAlign: 'left' }}
            label="Username"
            placeholder="Username   "
            placeholderTextColor={Colors.white}
            onChangeText={usernameHandler}
            value={username}
          // keyboardType="numeric"
          />
        </View>
        <View style={styles.text_input_section}>
          <Pressable onPress={() => setHidePassword(state => !state)}>
            <Icon
              name={hidePassword ? 'visibility-off' : 'remove-red-eye'}
              size={30}
              color={Colors.white}
              style={styles.input_icon}
            />
          </Pressable>
          <TextInput
            style={{ ...globalStyles.h2, color: Colors.white, textAlign: 'left' }}
            label="Password"
            placeholder="* * * * * * * * "
            placeholderTextColor={Colors.white}
            onChangeText={passwordHandler}
            secureTextEntry={hidePassword}
            value={password}
            isPassword={true}
          // keyboardType="numeric"
          />
        </View>
        <View style={styles.text_input_button_wrapper}>
          <Pressable
            style={styles.login_button}
            android_ripple={{ color: 'green' }}
            onPress={handleSubmit}
            disabled={false}>
            {waitForAxios ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text style={{ ...globalStyles.h2_bold, color: Colors.dark_green }}>
                Login
              </Text>
            )}
          </Pressable>
        </View>
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
