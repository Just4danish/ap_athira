import {
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
  Dimensions,
  Keyboard,
  Touchable,
} from 'react-native';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import {StyledContainer, Colors, globalStyles} from '../components/styles';
//   import Icon from 'react-native-vector-icons/MaterialIcons';
//   import Logout from '../components/Logout';
import {AuthContext} from '../context/AuthContext';
import {AxiosContext} from '../context/AxiosContext';
import {_storeData} from '../helpers/asyncStorageHelper';
// import TruckLottie from "../components/TruckLottie"
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Svg, Path, LinearGradient, Stop, Defs} from 'react-native-svg';
import LOGOSVG from '../assets/images/background.svg';
import ScreenWrapper from '../components/ScreenWrapper';
import QRCodeScanner from '../components/QRCodeScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConnectionErrorLottie from '../components/ConnectionErrorLottie';
import baseURL from '../helpers/baserURL';
import TabBar from '../components/TabBar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
  Easing,
  withTiming,
  ZoomInLeft,
  ZoomOutLeft,
} from 'react-native-reanimated';
import {parseSync} from '@babel/core';
import Dashboard from '../components/Dashboard';
import Jobs from '../components/Jobs';
import SideNavigationButton from '../components/SideNavigationButton';
import NavigationContext from '../context/NavigationContext';
import SettingsPage from './SettingsPage';
import SearchBox from '../components/TabBar/SearchBoxForOperatorJob';
import {tabBarIcons} from '../components/TabBar/icons';

export default function OperatorJobs({navigation}) {
  // const navigationContext = useContext(NavigationContext);

  // const [toggle, setToggle] = useState(false);
  // const [tabPosition, setTabPosition] = useState(false);

  // const [pressed, setPressed] = useState(false);
  // const [scanningInProcess, setScanningInProcess] = useState(false);
  // const [scannedCode, setScannedCode] = useState('');
  // const [waitForAxios, setWaitForAxios] = useState(false);
  // const {authAxios} = useContext(AxiosContext);
  // const [goForSelection, setGoForSelection] = useState(null);
  // const [status, setStatus] = useState('loading');
  // // const [searchText, setSearchText] = useState("");

  // const isFocused = useIsFocused();
  // const authContext = useContext(AuthContext);
  // const offsetBlueBGYtranslation = useSharedValue(-200);
  // const offsetTabBarYtranslation = useSharedValue(200);

  // const [isKeyboardVisible, setKeyboardVisible] = useState({
  //   status: false,
  //   height: 0,
  // });
  // useEffect(() => {
  //   navigationContext.showSideBarSwitch();
  // }, []);

  // const animatedStylesTranslateBlueBGY = useAnimatedStyle(() => {
  //   return {
  //     transform: [{translateY: offsetBlueBGYtranslation.value}],
  //   };
  // });
  // const animatedStylesTranslateTabBar = useAnimatedStyle(() => {
  //   return {
  //     transform: [{translateY: offsetTabBarYtranslation.value}],
  //   };
  // });
  // const animationHandlerBlueBGY = () => {
  //   offsetBlueBGYtranslation.value = withTiming(0, {
  //     duration: 500,
  //     easing: Easing.out(Easing.exp),
  //   });
  // };
  // const animationHandlerTabBar = () => {
  //   offsetBlueBGYtranslation.value = withTiming(0, {
  //     duration: 500,
  //     easing: Easing.out(Easing.exp),
  //   });
  //   offsetTabBarYtranslation.value = withTiming(0, {
  //     duration: 1000,
  //     easing: Easing.out(Easing.exp),
  //   });
  // };

  // useEffect(() => {
  //   setStatus('loading');
  //   animationHandlerBlueBGY();
  //   // This effect is to check whether the the driver is already logged in to a truck or not.
  //   // If not logged in, the driver will be directeed to QR code scanning
  //   AsyncStorage.getItem('vehicle')
  //     .then(response => {
  //       const data = JSON.parse(response);
  //       const token = data?.vehicleDetails?.random_key;
  //       if (token !== '' && typeof token !== 'undefined') {
  //         const url = '/gtcc_api/vehicle_qrcode_scan';
  //         const data = {
  //           random_key: token,
  //         };
  //         authAxios
  //           .post(url, data)
  //           .then(response => {
  //             if (response.data.status === 'Active') {
  //               authContext.setVehicleState(response.data);
  //               setStatus('vehicle_active');
  //             } else {
  //               authContext.removeVehicle();
  //               setStatus('vehicle_inactive');
  //             }
  //           })
  //           .catch(error => {
  //             setStatus('connection_error');
  //           });
  //       } else {
  //         authContext.removeVehicle();
  //         setStatus('vehicle_inactive');
  //       }
  //     })
  //     .catch(error => {
  //       // This means the storage doesnot have active vehicle details
  //       authContext.removeVehicle();
  //       setStatus('vehicle_inactive');
  //     });
  // }, [toggle]);

  // useEffect(() => {
  //   if (status === 'vehicle_active') {
  //     animationHandlerTabBar();
  //   }
  // }, [status]);
  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     'keyboardDidShow',
  //     e => {
  //       setKeyboardVisible({
  //         status: true,
  //         height: e.endCoordinates.height,
  //       }); // or some other action
  //     },
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     'keyboardDidHide',
  //     () => {
  //       setKeyboardVisible(false); // or some other action
  //     },
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  return (
    <ScreenWrapper navigationShow={false} style={{flex: 1}} sideBarShow={false}>
      <Jobs />
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  main_wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  qrcodescaningLabel: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    alignItems: 'center',
  },
  selectGarbageRoom: {
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 275,
    height: 65,
    marginTop: 100,
    borderRadius: 5,
    fontSize: 20,
  },
  noProperty: {
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 100,
    width: 275,
    height: 65,
    borderRadius: 5,
    fontSize: 20,
  },
  barcodeButtonContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 50,
    height: 300,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    // borderColor: Colors.green,
    // borderWidth: 5,
    elevation: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    margin: 15,
  },
  connectionErrorLottieContainer: {
    position: 'absolute',
    top: '45%',
    height: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  confirmButton: {
    width: 200,
    height: 50,
    backgroundColor: '#F8A836',
    borderRadius: 50,
    elevation: 5,
    justifyContent: 'center',
    marginTop: 50,
  },
  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.white,
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
