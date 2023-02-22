import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {_storeData} from '../helpers/asyncStorageHelper';

const AuthContext = createContext(null);
const {Provider} = AuthContext;

const AuthProvider = ({children}) => {
  const [authState, setAuthState] = useState({
    userDetails: null,
    accessToken: null,
    authenticated: false,
  });
  const [vehicleState, setVehicleState] = useState(null);
  const [authToggle, setAuthToggle] = useState(false);

  const logout = async key => {
    try {
      await AsyncStorage.removeItem('data');
      setTimeout(() => {
        setAuthState({
          userDetails: null,
          accessToken: null,
          authenticated: false,
        });
        setVehicleState('vehicle_inactive');
      }, 500);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const removeVehicle = async () => {
    // let data = {
    //   userDetails: {...authState.userDetails, assigned_vehicle:null, vehicle_details: "vehicle_inactive"},
    //   accessToken: {...authState.accessToken},
    // }
    // _storeData('data', JSON.stringify(data))
    // // setAuthState(...state=> ({
    // //   ...data,
    // //   ...state,
    // // }))
    setVehicleState('vehicle_inactive');
  };

  const getAccessToken = () => {
    return authState.accessToken;
  };

  return (
    <Provider
      value={{
        authState,
        getAccessToken,
        setAuthState,
        logout,
        vehicleState,
        setVehicleState,
        removeVehicle,
        authToggle,
        setAuthToggle,
      }}>
      {children}
    </Provider>
  );
};

export {AuthContext, AuthProvider};
