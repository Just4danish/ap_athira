import {
  StyleSheet,
  Text,
  Pressable,
  View,
  Image,
  BackHandler,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import {StyledContainer, Colors, globalStyles} from '../../components/styles';
import {AuthContext} from '../../context/AuthContext';
import {AxiosContext} from '../../context/AxiosContext';
import {_storeData} from '../../helpers/asyncStorageHelper';
import TruckLottie from './TruckLottie';
import {useIsFocused} from '@react-navigation/native';
import {Svg, Path, LinearGradient, Stop, Defs} from 'react-native-svg';
import LOGOSVG from '../../assets/images/background.svg';
import ScreenWrapper from '../ScreenWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeCamTruck from './QRCodeCamTruck';
import QRCodeLottiePhone from './QRCodeLottiePhone';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
} from 'react-native-reanimated';
import SideNavigationButton from '../SideNavigationButton';
import {ToastContext} from '../../context/ToastContext';
import QRCodeCamTruckLinkingDriver from './QRCodeCamTruckLinkingDriver';
import AbaciModal from '../../components/AbaciModal';
import ModalButton from '../Buttons/ModalButton';

export default function Index(props) {
  const toastContext = useContext(ToastContext);
  const [pressed, setPressed] = useState(false);
  const [foundTruck, setFoundTruck] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanningInProcess, setScanningInProcess] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [waitForAxios, setWaitForAxios] = useState(false);
  const {authAxios} = useContext(AxiosContext);
  const [goForSelection, setGoForSelection] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const isFocused = useIsFocused();
  const authContext = useContext(AuthContext);
  const offsetCardHeight = useSharedValue(300);
  const offsetVehicleDetailsScale = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: offsetCardHeight.value,
    };
  });
  const animatedStylesScale = useAnimatedStyle(() => {
    return {
      transform: [{scale: offsetVehicleDetailsScale.value}],
    };
  });
  const backHandler = () => {
    setScanningInProcess(false);
    Alert.alert('Hold on!', 'Do you want to exit the app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, []);

  const postData = data => {
    setWaitForAxios(true);
    const url = '/gtcc_api/vehicle_qrcode_scan';
    authAxios
      .post(url, data)
      .then(response => {
        if (response.data.status === 'Active') {
          if (data.request_type === 'qr_checking') {
            setVehicleDetails(response.data);
            setModalVisible(true);
          } else {
            toastContext.showToast(
              'Vehicle Successfuly linked !',
              'short',
              'success',
            );
            authContext.setVehicleState(response.data);
            cancelHandler();
          }
        } else {
          toastContext.showToast('Invalid vehicle !', 'short', 'warning');
        }
        setWaitForAxios(false);
      })
      .catch(error => {
        let message = 'Network Error, Please check your connection !';
        if (error.message.includes('404')) {
          message = 'Invalid QR Code !';
        } else if (error.message.includes('403')) {
          message = 'You are not authorized to add this vehicle !';
        }
        toastContext.showToast(message, 'short', 'warning');
        setScannedCode('');
        setWaitForAxios(false);
      });
  };
  const cancelHandler = () => {
    setVehicleDetails(null);
    setModalVisible(false);
    setScannedCode('');
  };
  useEffect(() => {
    if (scannedCode !== '') {
      const data = {
        random_key: scannedCode,
        request_type: 'qr_checking',
      };
      postData(data);
    }
  }, [scannedCode]);

  const confirmHandler = () => {
    const data = {
      random_key: scannedCode,
      request_type: 'qr_confirming',
    };
    postData(data);
  };
  return (
    <ScreenWrapper navigationShow={false}>
      <AbaciModal
        visible={modalVisible}
        onRequestClose={cancelHandler}
        ModalHeight="60%"
        padding={0}>
        <View
          style={{
            width: '80%',
          }}>
          <Image
            style={styles.vehicleImage}
            source={require('../../assets/images/defaultTruck.png')}
          />
          <View style={styles.vehicleDetailsWrapper}>
            <Text style={[globalStyles.h2_bold, {textAlign: 'left'}]}>
              Vehicle Number
            </Text>
            <Text style={[globalStyles.h2_regular, {textAlign: 'left'}]}>
              {vehicleDetails?.vehicle_no}
            </Text>
          </View>
          <View style={styles.vehicleDetailsWrapper}>
            <Text style={[globalStyles.h2_bold, {textAlign: 'left'}]}>
              Chassis Number
            </Text>
            <Text style={[globalStyles.h2_regular, {textAlign: 'left'}]}>
              {vehicleDetails?.chassis_no}
            </Text>
          </View>
          <View style={styles.vehicleDetailsWrapper}>
            <Text style={[globalStyles.h2_bold, {textAlign: 'left'}]}>
              Vehicle Type
            </Text>
            <Text style={[globalStyles.h2_regular, {textAlign: 'left'}]}>
              {vehicleDetails?.vehicle_type}
            </Text>
          </View>
          <View style={styles.vehicleDetailsWrapper}>
            <Text style={[globalStyles.h2_bold, {textAlign: 'left'}]}>
              Vehicle Tank Capacity
            </Text>
            <Text style={[globalStyles.h2_regular, {textAlign: 'left'}]}>
              {vehicleDetails?.vehicle_tank_capacity} gallon
            </Text>
          </View>
          <View style={styles.vehicleDetailsWrapper}>
            <Text style={[globalStyles.h2_bold, {textAlign: 'left'}]}>
              Collected Waste Pending for Discharge
            </Text>
            <Text style={[globalStyles.h2_regular, {textAlign: 'left'}]}>
              {vehicleDetails?.collected_waste} gallon
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 30,
            }}>
            <ModalButton
              color="red"
              onPress={cancelHandler}
              label="Cancel"
              disabled={waitForAxios}
            />
            <ModalButton
              color="green"
              onPress={confirmHandler}
              label={waitForAxios ? <ActivityIndicator /> : 'Confirm'}
              disabled={waitForAxios}
            />
          </View>
        </View>
      </AbaciModal>
      {scanningInProcess ? (
        <QRCodeCamTruckLinkingDriver
          setScannedCode={setScannedCode}
          setScanningInProcess={setScanningInProcess}
        />
      ) : (
        <>
          <Animated.View
            style={[
              styles.barcodeButtonContainer,
              {elevation: pressed ? 5 : 25},
              animatedStyles,
            ]}>
            <Pressable
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              style={({pressed}) => [styles.barcodeButtonContainer]}
              onPress={() => setScanningInProcess(true)}
              android_ripple={{color: '#D3EE2F'}}
              disabled={waitForAxios}>
              {waitForAxios ? (
                <TruckLottie waitForAxios={waitForAxios} />
              ) : (
                <QRCodeLottiePhone />
              )}
            </Pressable>
          </Animated.View>
          <View style={styles.qrcodescaningLabel}>
            {waitForAxios ? (
              <Text style={{...globalStyles.h2_bold, textAlign: 'center'}}>
                Hi {authContext?.authState?.userDetails?.full_name}
                {'\n'} We are looking for your truck.
                {'\n'}
                {'\n'}
                Please be patient !
              </Text>
            ) : (
              <Text style={{...globalStyles.h2_bold, textAlign: 'center'}}>
                Hi {authContext?.authState?.userDetails?.full_name}
                {'\n'} You need to scan the QR code on the Truck inorder to link
                the vehicle with your profile.
                {'\n'}
                {'\n'}
                Click above to link the Truck !
              </Text>
            )}
          </View>
        </>
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  qrcodescaningLabel: {
    position: 'absolute',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 18,
    color: 'black',
    alignItems: 'center',
    bottom: 150,
  },

  barcodeButtonContainer: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 50,
    height: 300,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  vehicleDetailsWrapper: {
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
    borderBottomColor: Colors.gray,
    borderBottomWidth: 0.5,
    marginTop: 10,
    minHeight: 50,
    padding: 5,
  },
  vehicleImage: {
    position: 'absolute',
    top: -150,
    width: 150,
    height: 150,
    borderRadius: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.light_gray,
  },
});
