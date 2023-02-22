import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { _storeData } from '../helpers/asyncStorageHelper'
import ScreenWrapper from '../components/ScreenWrapper';
import QRCodeRestaurentScan from '../components/QRCodeScanner/QRCodeRestaurentScan';
import QRCodeScanner from '../components/QRCodeScanner';
import Dashboard from "../components/Dashboard"
import Jobs from "../components/Jobs"
import NavigationContext from '../context/NavigationContext';
import SettingsPage from './SettingsPage';
import AbaciLoader from '../components/AbaciLoader';
import { AxiosContext } from '../context/AxiosContext';
import { DriverJobContext } from '../context/DriverJobContext';

export default function DriverHome() {
  const navigationContext = useContext(NavigationContext)
  const authContext = useContext(AuthContext);
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success')
  const { authAxios } = useContext(AxiosContext)
  const driverJobContext = useContext(DriverJobContext)
  useEffect(() => {
    navigationContext.showSideBarSwitch()
    navigationContext.showTabBar()
  }, [])
  const fetchDriverJobList = () => {
    setBackendLoadingStatus("loading")
    const url = '/gtcc_api/driver_service_request_details'
    authAxios.get(url).then(response => {
      driverJobContext.setAllJobs(response.data)
      setBackendLoadingStatus("success")
    })
      .catch(error => {
        setBackendLoadingStatus("error")
      })
  }
  useEffect(() => {
    fetchDriverJobList()
  }, [authContext.vehicleState])

  if (authContext.vehicleState === null) {
    return (<AbaciLoader />)
  }
  else if (authContext.vehicleState === 'vehicle_inactive') {
    return (
      <ScreenWrapper navigationShow={false}>
        <QRCodeScanner />
      </ScreenWrapper>
    )
  }
  else {
    return (
      <ScreenWrapper>
        <AbaciLoader visible={backendLoadingStatus === 'loading'} />
        {
          navigationContext.tabPosition === "camera" ? <QRCodeRestaurentScan /> :
            navigationContext.tabPosition === "home" ?
              <Dashboard />
              :
              navigationContext.tabPosition === "filter" || navigationContext.tabPosition === "search" ?
                <Jobs fetchDriverJobList = {fetchDriverJobList}/>
                : navigationContext.tabPosition === "new" ?
                  <SettingsPage />
                  : null
        }
      </ScreenWrapper>
    )
  }

}


