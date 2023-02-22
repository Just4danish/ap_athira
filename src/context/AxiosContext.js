import React, { createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import baseURL from '../helpers/baserURL';
import { _storeData } from '../helpers/asyncStorageHelper';

const AxiosContext = createContext();
const { Provider } = AxiosContext;

const AxiosProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const authAxios = axios.create({
    baseURL: baseURL + '/',
    timeout: 5000,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  });

  const publicAxios = axios.create({
    baseURL: baseURL + '/',
    timeout: 5000,
  });

  authAxios.interceptors.request.use(
    config => {
      if (authContext.authState.authenticated){
        const url = baseURL + "/users_api/profile"
        axios.get(url, {
          headers: {
            Authorization: `Bearer ${authContext.getAccessToken()}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }).then(response => {
          let new_token = response?.headers['set-cookie']
          new_token = new_token[0]
          new_token = new_token.split(";")[0].split("token=")[1]
          const data = {...authContext.authState, accessToken:new_token}
          authContext.setAuthState(data);
          _storeData('data', JSON.stringify(data))
          if (JSON.stringify(response.data.entity) !== JSON.stringify(authContext.authState.property)){
            authContext.setProperty(response.data.entity)
            _storeData('data', JSON.stringify(authContext.authState))
          }
        })
          .catch(error => {
            if(error.message.includes("403")){
              authContext.logout()
            }
          })
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${authContext.getAccessToken()}`;
        }
      }
      return config;
    },
    error => {
      // if(error.message.includes("403")){
      //   authContext.logout()
      // }
      return Promise.reject(error);
    },
  );

  return (
    <Provider
      value={{
        authAxios,
        publicAxios,
      }}>
      {children}
    </Provider>
  );
};

export { AxiosContext, AxiosProvider };
