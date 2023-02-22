import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Modal,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
  Easing,
  withTiming,
  SlideInRight,
  BounceInRight,
  BounceInLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import {globalStyles, gradientSets, Colors} from '../components/styles';
import {AuthContext} from '../context/AuthContext';
import {BlurView} from '@react-native-community/blur';
import {TextInput} from 'react-native-gesture-handler';
import LargeButton from '../components/Buttons/LargeButton';
import {AxiosContext} from '../context/AxiosContext';
import {ToastContext} from '../context/ToastContext';

export default function SettingsPage() {
  const authContext = useContext(AuthContext);
  const windowWidth = Dimensions.get('window').width;
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  const windowHeight = Dimensions.get('window').height;
  const [truckRemovalModalVisibility, setTruckRemovalModalVisibility] =
    useState(false);
  const [changePasswordModalVisibility, setChangePasswordModalVisibility] =
    useState(false);
  const [disablePasswordConfirm, setDisablePasswordConfirm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const {authAxios} = useContext(AxiosContext);
  const toastContext = useContext(ToastContext);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {}, []);
  const truckRemoveHandler = () => {
    const url = '/gtcc_api/unlink_vehicle_from_driver';
    authAxios
      .post(url)
      .then(response => {
        authContext.removeVehicle();
        truckModalCloseHandler();
      })
      .catch(error => {
        truckModalCloseHandler();
        let message = 'Error in unlinking the truck !';
        toastContext.showToast(message, 'short', 'error');
      });
  };

  const truckModalCloseHandler = () => {
    setTruckRemovalModalVisibility(false);
  };
  const changePasswordModalCloseHandler = () => {
    setErrorMessage('');
    setChangePasswordModalVisibility(false);
    setDisablePasswordConfirm(true);
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const passwordChangeHandler = () => {
    setErrorMessage('');
    setBackendLoadingStatus('loading');
    setDisablePasswordConfirm(true);

    const url = '/users_api/change_password';
    const data = {
      old_password: passwords.currentPassword,
      new_password: passwords.newPassword,
    };
    authAxios
      .put(url, data)
      .then(response => {
        setDisablePasswordConfirm(false);
        setBackendLoadingStatus('success');
        changePasswordModalCloseHandler();
        const message = 'Password has been updated successfully !';
        toastContext.showToast(message, 'short', 'success');
      })
      .catch(error => {
        let message = 'Error occured, please retry !';
        try {
          message = error.response.data.error;
        } catch {
          // pass
        }
        setErrorMessage(message);
        setDisablePasswordConfirm(false);
        setBackendLoadingStatus('error');
      });
  };
  useEffect(() => {
    setDisablePasswordConfirm(true);
    if (
      passwords.currentPassword.length > 7 &&
      passwords.newPassword.length > 7
    ) {
      setDisablePasswordConfirm(
        passwords.newPassword !== passwords.confirmNewPassword,
      );
    }
  }, [passwords]);

  return (
    <View style={styles.mainWrapper}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={truckRemovalModalVisibility}
        onRequestClose={truckModalCloseHandler}>
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
            backgroundColor: 'white',
            height: '30%',
            width: '90%',
            alignSelf: 'center',
            marginTop: '40%',
            borderRadius: 5,
            elevation: 25,
            borderWidth: 0.5,
            borderColor: Colors.light_gray,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={truckModalCloseHandler}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              borderWidth: 1,
              width: 20,
              height: 20,
              borderRadius: 10,
              borderColor: Colors.light_gray,
              margin: 10,
              justifyContent: 'center',
            }}>
            <Text style={globalStyles.h2_bold}>X</Text>
          </TouchableOpacity>
          <Text style={[globalStyles.h2_bold, {margin: 50}]}>
            Are you sure to unlink the truck?
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 100,
                height: 30,
                backgroundColor: '#9bc5a0',
                borderRadius: 5,
                elevation: 5,
                margin: 10,
                justifyContent: 'center',
              }}
              onPress={truckModalCloseHandler}>
              <Text style={[globalStyles.h2_bold, {color: 'white'}]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 100,
                height: 30,
                backgroundColor: '#d67171',
                borderRadius: 5,
                elevation: 5,
                margin: 10,
                justifyContent: 'center',
              }}
              onPress={truckRemoveHandler}>
              <Text style={[globalStyles.h2_bold, {color: 'white'}]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisibility}
        onRequestClose={changePasswordModalCloseHandler}>
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
            backgroundColor: 'white',
            height: 310,
            width: '90%',
            alignSelf: 'center',
            marginTop: '40%',
            borderRadius: 5,
            elevation: 25,
            borderWidth: 0.5,
            borderColor: Colors.light_gray,
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={changePasswordModalCloseHandler}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              borderWidth: 1,
              width: 20,
              height: 20,
              borderRadius: 10,
              borderColor: Colors.light_gray,
              margin: 10,
              justifyContent: 'center',
            }}>
            <Text style={globalStyles.h2_bold}>X</Text>
          </TouchableOpacity>
          {/* <Text style={[globalStyles.h2_bold, { margin: 50 }]}>
                        Please provide your current password and new password here !
                    </Text> */}

          <TextInput
            placeholder="Current Password"
            value={passwords.currentPassword}
            secureTextEntry={true}
            style={{
              height: 40,
              borderWidth: 1,
              width: '80%',
              alignSelf: 'center',
              borderRadius: 5,
              borderColor: Colors.light_gray,
              color: Colors.gray,
              margin: 10,
            }}
            placeholderTextColor={Colors.gray}
            onChangeText={value =>
              setPasswords(state => ({...state, currentPassword: value}))
            }
          />
          <TextInput
            placeholder="New Password - Minimum 8 characters"
            value={passwords.newPassword}
            secureTextEntry={true}
            style={{
              height: 40,
              borderWidth: 1,
              width: '80%',
              alignSelf: 'center',
              borderRadius: 5,
              borderColor: Colors.light_gray,
              color: Colors.gray,
              margin: 10,
            }}
            placeholderTextColor={Colors.gray}
            onChangeText={value =>
              setPasswords(state => ({...state, newPassword: value}))
            }
          />
          <TextInput
            placeholder="Confirm New Password"
            value={passwords.confirmNewPassword}
            secureTextEntry={true}
            style={{
              height: 40,
              borderWidth: 1,
              width: '80%',
              alignSelf: 'center',
              borderRadius: 5,
              borderColor: Colors.light_gray,
              color: Colors.gray,
              margin: 10,
            }}
            placeholderTextColor={Colors.gray}
            onChangeText={value =>
              setPasswords(state => ({...state, confirmNewPassword: value}))
            }
          />
          <Text style={{...globalStyles.h2_bold, color: 'red', fontSize: 14}}>
            {errorMessage}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              style={{
                width: 100,
                height: 30,
                backgroundColor: '#9bc5a0',
                borderRadius: 5,
                elevation: 5,
                margin: 10,
                justifyContent: 'center',
              }}
              onPress={changePasswordModalCloseHandler}>
              <Text style={[globalStyles.h2_bold, {color: 'white'}]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 100,
                height: 30,
                backgroundColor: disablePasswordConfirm
                  ? Colors.gray
                  : '#d67171',
                borderRadius: 5,
                elevation: 5,
                margin: 10,
                justifyContent: 'center',
              }}
              disabled={disablePasswordConfirm}
              onPress={passwordChangeHandler}>
              <Text style={[globalStyles.h2_bold, {color: 'white'}]}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView style={{flex: 1}}>
        <Animated.View
          entering={BounceInLeft}
          exiting={FadeOutRight}
          style={{
            height: 300,
            width: windowWidth * 0.8,
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#d4d4d4',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Animated.Image
            style={{
              width: 75,
              height: 75,
              resizeMode: 'cover',
              borderRadius: 50,
              marginBottom: 20,
            }}
            source={
              typeof authContext?.userDetails?.avatar === 'undefined'
                ? require('../assets/images/avtar.png')
                : {
                    uri: authContext?.authState?.userDetails?.avatar,
                  }
            }
          />
          <View
            style={{
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={globalStyles.h2_bold}>
              User ID: {authContext?.authState?.userDetails?.username}
            </Text>
            <Text style={globalStyles.h2_bold}>
              Name: {authContext?.authState?.userDetails?.full_name}
            </Text>
            {authContext?.authState?.userDetails?.contact_number && (
              <Text style={globalStyles.h2_bold}>
                Mob: {authContext?.authState?.userDetails?.contact_number}
              </Text>
            )}
            {/* {authContext?.authState?.userDetails?.email && <Text style={globalStyles.h2_bold}>
                            Email: {authContext?.authState?.userDetails?.email} */}

            <View style={styles.button}>
              <Pressable
                onPress={() => setChangePasswordModalVisibility(true)}
                android_ripple={{color: 'yellow', borderless: true}}>
                <Text style={styles.buttonLabel}>Change Password</Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
        {authContext?.authState?.userDetails?.user_type === 'Driver' ? (
          <Animated.View
            entering={BounceInLeft.delay(100)}
            exiting={FadeOutRight}
            style={{
              height: windowHeight * 0.6,
              width: windowWidth * 0.8,
              backgroundColor: 'white',
              alignSelf: 'center',
              marginTop: 50,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#d4d4d4',
              marginBottom: 200,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Animated.View style={[styles.vehicleDetails]}>
              <Animated.Image
                style={styles.vehicleImage}
                source={require('../assets/images/defaultTruck.png')}
              />
              <Text style={styles.vehicleDetailsLabel}>Vehicle Number</Text>
              <Text style={styles.vehicleDetailsValue}>
                {authContext?.vehicleState?.vehicle_no}
              </Text>
              <View style={styles.lineStyle} />
              <Text style={styles.vehicleDetailsLabel}>Chassis Number</Text>
              <Text style={styles.vehicleDetailsValue}>
                {authContext?.vehicleState?.chassis_no}
              </Text>
              <View style={styles.lineStyle} />
              <Text style={styles.vehicleDetailsLabel}>Vehicle Type</Text>
              <Text style={styles.vehicleDetailsValue}>
                {authContext?.vehicleState?.vehicle_type}
              </Text>
              <View style={styles.lineStyle} />
              <Text style={styles.vehicleDetailsLabel}>
                Vehicle Tank Capacity
              </Text>
              <Text style={styles.vehicleDetailsValue}>
                {authContext?.vehicleState?.vehicle_tank_capacity}
              </Text>
              <View style={styles.lineStyle} />
              <LargeButton
                label="Unlink the Truck"
                onPress={() => setTruckRemovalModalVisibility(true)}
              />
            </Animated.View>
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    height: '100%',
    paddingTop: 40,
  },
  graphInfoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    height: '80%',
  },
  JobInfoWrapper: {
    flex: 2,
    backgroundColor: 'white',
    padding: 20,
    elevation: 5,
    borderRadius: 5,
    margin: 20,
    // height:"50%"
  },
  button: {
    width: 200,
    height: 50,
    backgroundColor: '#F8A836',
    borderRadius: 50,
    elevation: 5,
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonLabel: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.white,
    fontSize: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  vehicleImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'contain',
  },
  vehicleDetailsLabel: {
    fontFamily: 'Montserrat-Bold',
    color: Colors.dark_gray,
    fontSize: 16,
    alignSelf: 'flex-start',
    alignSelf: 'center',
  },
  vehicleDetailsValue: {
    fontFamily: 'Montserrat-Light',
    color: Colors.dark_gray,
    fontSize: 16,
    alignSelf: 'flex-start',
    alignSelf: 'center',
  },
  vehicleDetails: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    testID: 'center',
  },
});
