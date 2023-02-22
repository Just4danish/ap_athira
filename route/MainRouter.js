import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from '../store';
import { publicRoutes, authProtectedRoutesForDriver, authProtectedRoutesForOperator, authProtectedRoutesForInspector } from '.';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from './CustomDrawerContent';
import { AuthContext } from '../src/context/AuthContext';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function MainRouter() {
  const authContext = useContext(AuthContext);
  const publicComponents = publicRoutes.map((route, idx) => {
    return (
      <Drawer.Screen
        key={idx}
        name={route.name}
        component={route.component}
        options={{ headerShown: false }}
      />
    );
  })
  const driverComponents = authProtectedRoutesForDriver.map((route, idx) => {
    return (
      <Tab.Screen
        key={idx}
        name={route.name}
        component={route.component}
        options={{ headerShown: false }}
      />
    );
  })
  const operatorComponents = authProtectedRoutesForOperator.map((route, idx) => {
    return (
      <Tab.Screen
        key={idx}
        name={route.name}
        component={route.component}
        options={{ headerShown: false }}
        backBehavior="history"

      />
    );
  })
  const inspectorComponents = authProtectedRoutesForInspector.map((route, idx) => {
    return (
      <Tab.Screen
        key={idx}
        name={route.name}
        component={route.component}
        options={{ headerShown: false }}
        backBehavior="history"

      />
    );
  })
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props}
          />
          }
          backBehavior="history"
        >
          {
            authContext.authState.authenticated ? (
              authContext?.authState?.userDetails?.user_type === "Driver" ?
                driverComponents
                :
                authContext?.authState?.userDetails?.user_type === "Operator" ?
                  operatorComponents
                  :
                  authContext?.authState?.userDetails?.user_type === "Inspector" ?
                    inspectorComponents
                    : publicComponents
            ) : publicComponents
          }
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
};
