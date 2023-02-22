import 'react-native-reanimated';
import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import AbaciLoader from './src/components/AbaciLoader';
import { AuthContext } from './src/context/AuthContext';
import MainRouter from './route/MainRouter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from './src/helpers/baserURL';
import BootError from './src/components/BootError';
import { _storeData } from './src/helpers/asyncStorageHelper';
import AbaciToast from './src/components/AbaciToast';
import { AxiosContext } from './src/context/AxiosContext';
import { Colors } from './src/components/styles';
import axios from 'axios';

const App = () => {
  const authContext = useContext(AuthContext);
  const { publicAxios } = useContext(AxiosContext);
  const [status, setStatus] = useState('loading');
  const [waitForAxios, setWaitForAxios] = useState(false);
  useEffect(() => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor(Colors.transparent_dark);
    AsyncStorage.getItem('data')
      .then(response => {
        const data = JSON.parse(response);
        if (data !== null) {
          const token = data?.accessToken;
          if (token !== '' || typeof (token) !== 'string') {
            const url = baseURL + '/users_api/profile';
            setWaitForAxios(true);
            axios
              .get(url, {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              })
              .then(response => {
                if (response.data.user_status === 'Activated') {
                  let userData = { ...response.data };
                  if (userData?.user_type === 'Driver') {
                    authContext.setVehicleState(response.data.vehicle_details);
                  }
                  const data = {
                    userDetails: userData,
                    accessToken: token,
                  };
                  authContext.setAuthState({
                    ...data,
                    authenticated: true,
                  });
                  _storeData('data', JSON.stringify(data));
                } else {
                  authContext.logout();
                }
                setStatus('success');
                setWaitForAxios(false);
              })
              .catch(error => {
                if (error.message.includes('401')) {
                  authContext.logout();
                  setWaitForAxios(false);
                  setStatus('success');
                } else {
                  authContext.logout();
                  setStatus('error');
                  setWaitForAxios(false);
                }
              });
          }
          else {
            authContext.logout();
            setStatus('success');
          }
        }
        else {
          authContext.logout();
          setStatus('success');
        }
      })
      .catch(error => {
        // This error means, the login data is not available in storage, thus we should head to login page
        authContext.logout();
        setStatus('success');
      });
  }, [authContext.authToggle]);

  return (
    <View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'white' }}>
      {status === 'success' ? (
        <MainRouter />
      ) : status === 'loading' ? (
        <AbaciLoader visible={status === 'loading'} />
      ) : (
        <BootError
          setToggle={authContext.setAuthToggle}
          waitForAxios={waitForAxios}
        />
      )}
      <AbaciToast />
    </View>
  );
};

export default App;
