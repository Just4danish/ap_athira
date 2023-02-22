import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useState, useContext} from 'react';
import {Colors, globalStyles} from '../components/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../context/AuthContext';
import {AxiosContext} from '../context/AxiosContext';
import {ToastContext} from '../context/ToastContext';
import {_storeData} from '../helpers/asyncStorageHelper';
const backgroundImage = require('../assets/images/bg_images_login.jpg');
const logo = require('../assets/images/logo.png');
const dm_logo = require('../assets/images/dm_logo.png');

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [waitForAxios, setWaitForAxios] = useState(false);
  const authContext = useContext(AuthContext);
  const toastContext = useContext(ToastContext);
  const {publicAxios} = useContext(AxiosContext);
  const passwordHandler = value => {
    if (value.length < 21) {
      setPassword(value);
    }
  };
  const usernameHandler = value => {
    if (value.length < 28) {
      setUsername(value.replace(/\s/g, ''));
    }
  };
  const handleSubmit = () => {
    setWaitForAxios(true);
    const url = 'users_api/login';
    // TODO - need to change the username and password here which is hardcoded
    // ***********************************************************************
    // Development
    // Driver Credentials
    const tempCredentials = {username: 'D1013', password: 'Abcd@123'};
    // Operator Credentials
    // const tempCredentials = {username: 'OP1001', password: 'Abcd@123'};
    // Inspector Credentials
    // const tempCredentials = {username: 'IP1001', password: 'Abcd@123'};
    // ***********************************************************************
    // Production
    // Driver Credentials
    // const tempCredentials = { username: 'd1016', password: 'Abcd@123' };
    // Operator Credentials
    // const tempCredentials = { username: 'op001', password: 'Abcd@123' };
    // Inspector Credentials
    // Operator Credentials Production
    const credentials = __DEV__
      ? tempCredentials
      : {username: username, password: password};
    // const credentials = { username: username, password: password };

    publicAxios
      .post(url, credentials)
      .then(response => {
        if (response.data.user.user_status === 'Activated') {
          if (response?.data?.user?.user_type === 'Driver') {
            authContext.setVehicleState(response.data.user.vehicle_details);
          }
          const data = {
            userDetails: response.data.user,
            accessToken: response.data.token,
            authenticated: true,
          };
          authContext.setAuthState({
            ...data,
            authenticated: true,
          });
          _storeData('data', JSON.stringify(data));
          setWaitForAxios(false);
          setPassword('');
        } else {
          toastContext.showToast(
            (message = 'The user is not Active !'),
            (duration = 'short'),
            (type = 'warning'),
          );
          setPassword('');
          setWaitForAxios(false);
        }
      })
      .catch(error => {
        let toastMessage = 'Error occured. Please try again';
        let toastType = 'error';
        if (error?.response?.status === 403) {
          toastMessage = 'Invalid credetials';
          toastType = 'warning';
        } else {
          toastMessage = 'Network error, please check your connection';
        }
        toastContext.showToast(toastMessage, 'short', toastType);
        setWaitForAxios(false);
        setPassword('');
      });
  };

  return (
    <ScrollView style={{backgroundColor: 'white'}}>
      <View
        style={{
          height: windowHeight / 2,
          width: windowWidth,
        }}>
        <Image
          style={{
            width: '100%',
            height: '100%',
          }}
          source={backgroundImage}
        />
      </View>
      <View
        style={{
          height: windowHeight / 2,
          width: windowWidth,
          padding: 20,
          // flex: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <Image
            source={logo}
            resizeMode="contain"
            style={{
              width: '50%',
              height: 60,
              justifyContent: 'center',
            }}></Image>
          <Image
            source={dm_logo}
            resizeMode="contain"
            style={{
              width: '50%',
              height: 60,
              justifyContent: 'center',
            }}></Image>
        </View>
        {/* <Text style={globalStyles.h2_bold}>Fogwatch</Text> */}
        <View style={styles.text_input_section}>
          <Icon
            name="person"
            size={30}
            color={Colors.white}
            style={styles.input_icon}
          />
          <TextInput
            style={{
              ...globalStyles.h2,
              color: Colors.white,
              textAlign: 'left',
              width: '100%',
            }}
            label="Username"
            placeholder="Username   "
            placeholderTextColor={Colors.white}
            onChangeText={usernameHandler}
            value={username}
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
            style={{
              ...globalStyles.h2,
              color: Colors.white,
              textAlign: 'left',
              width: '100%',
            }}
            label="Password"
            placeholder="* * * * * * * * "
            placeholderTextColor={Colors.white}
            onChangeText={passwordHandler}
            secureTextEntry={hidePassword}
            value={password}
            isPassword={true}
          />
        </View>
        <View style={styles.text_input_button_wrapper}>
          <Pressable
            style={styles.login_button}
            android_ripple={{color: 'green'}}
            onPress={handleSubmit}
            disabled={false}>
            {waitForAxios ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text style={{...globalStyles.h2_bold, color: Colors.dark_green}}>
                Login
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

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
  input_icon: {
    margin: 10,
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
});

export default Login;
