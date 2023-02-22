import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { _storeData } from '../helpers/asyncStorageHelper'
import ScreenWrapper from '../components/ScreenWrapper';
import QRCodeScanner from '../components/QRCodeScanner';
import Dashboard from "../components/Dashboard"
import Jobs from "../components/Jobs"
import NavigationContext from '../context/NavigationContext';
import SettingsPage from './SettingsPage';
import QRCodeRestaurentScan from '../components/QRCodeScanner/QRCodeRestaurentScan';
import { PermissionsAndroid } from 'react-native';
import QRCodeCamTruck from '../components/QRCodeScanner/QRCodeCamTruck';
import Zones from "../components/Zones"
import InspectorSearch from "../components/InspectorSearch"

export default function InspectorHome() {
  const navigationContext = useContext(NavigationContext)
  const authContext = useContext(AuthContext);
  useEffect(() => {
    navigationContext.showSideBarSwitch()
    navigationContext.showTabBar()
  }, [])

    return (
      <ScreenWrapper searchBox={false} changeWithKeyboard={false}>
        {
          navigationContext.tabPosition === "camera" ? <QRCodeCamTruck /> :
            navigationContext.tabPosition === "home" ?
              // Dashboard View Here
              <Dashboard />
              :
              navigationContext.tabPosition === "filter"?
                <Zones
                // searchText={searchText}
                />
                :navigationContext.tabPosition === "search"  ?
                <InspectorSearch/>
                : navigationContext.tabPosition === "new" ?
                  <SettingsPage />
                  : null
        }
      </ScreenWrapper>
    )
  }
