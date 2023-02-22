/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { AuthProvider } from './src/context/AuthContext';
import { AxiosProvider } from './src/context/AxiosContext';
import React from 'react';
import { NavigationProvider } from './src/context/NavigationContext';
import 'react-native-gesture-handler';
import { DriverJobProvider } from './src/context/DriverJobContext';
import { OperatorJobProvider } from './src/context/OperatorJobContext';
import { InspectorJobProvider } from './src/context/InspectorJobContext';
import { ToastProvider } from './src/context/ToastContext';


const Root = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AxiosProvider>
          <NavigationProvider>
            <DriverJobProvider>
              <OperatorJobProvider>
                <InspectorJobProvider>
                  <App />
                </InspectorJobProvider>
              </OperatorJobProvider>
            </DriverJobProvider>
          </NavigationProvider>
        </AxiosProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
