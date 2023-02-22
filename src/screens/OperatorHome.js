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
import Vehicles from "../components/Vehicles"
import { OperatorJobContext } from '../context/OperatorJobContext';
import { AxiosContext } from '../context/AxiosContext';
import { ToastContext } from '../context/ToastContext';
import AbaciLoader from '../components/AbaciLoader';

export default function OperatorHome() {
  const navigationContext = useContext(NavigationContext)
  const authContext = useContext(AuthContext);
  const operatorJobContext = useContext(OperatorJobContext)
  const [backendLoadingStatus,setBackendLoadingStatus] = useState('success')
  const {authAxios} = useContext(AxiosContext)
  const toastContext = useContext(ToastContext)
  const fetchVehcileList = () => {
    setBackendLoadingStatus("loading")
    const url = `/gtcc_api/vehiclelist_operator`
    authAxios.get(url).then(response => {
      operatorJobContext.setAllVehicles(response.data)
      setBackendLoadingStatus("success")
    })
      .catch(error => {
        toastContext.showToast("Error in fetching data, please check your connection!", 'short', 'error')
        setBackendLoadingStatus("error")
      })
  }

  useEffect(() => {
    fetchVehcileList()
    navigationContext.showSideBarSwitch()
    navigationContext.showTabBar()
  }, [])

    return (
      <ScreenWrapper>
        <AbaciLoader visible = {backendLoadingStatus==='loading'}/>
        {
          navigationContext.tabPosition === "camera" ? <QRCodeCamTruck /> :
            navigationContext.tabPosition === "home" ?
              // Dashboard View Here
              <Dashboard />
              :
              navigationContext.tabPosition === "filter" || navigationContext.tabPosition === "search" ?
                <Vehicles
                // searchText={searchText}
                />
                : navigationContext.tabPosition === "new" ?
                  <SettingsPage />
                  : null
        }
      </ScreenWrapper>
    )
  }
