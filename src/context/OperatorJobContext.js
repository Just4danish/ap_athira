import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tempVehicles } from '../components/Vehicles/tempVehicleList';
import { useEffect } from 'react';

const OperatorJobContext = createContext(null);
const { Provider } = OperatorJobContext;

const OperatorJobProvider = ({ children }) => {
  // TODO, need to change the below later stage and pull the jobs from backend
  const [allVehicles, setAllVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleEntryTime, setSelectedVehicleEntryTime] = useState(null)
  const [vehicleSearchText, setVehicleSearchText] = useState('');
  const [couponsState, setCouponsState] = useState([]);
  const [creditForSelectedGTCC, setCreditForSelectedGTCC] = useState(0);
  const [totalGreaseCollectedOnCoupon, setTotalGreaseCollectedOnCoupon] = useState(0)
  const [operatorDashboardDetails, setOperatorDashboardDetails] = useState({
    totalVehiclesEnteredToday:0,
    totalVehicleDumped:0,
    pendingVehiclesForDumping:0,
    totalWasteEnteredToday:0,
    totalForecastedWasteToBeDumped:0,
    totalDumpedWaste:0
  })

  useEffect(() => {
    let quickResult = []
    allVehicles.filter(obj => {
      let valuesOfObj = Object.values(obj)
      for (let i = 0; i < valuesOfObj.length; i++) {
        const item = valuesOfObj[i]
        if (typeof (item) === 'object') {
          let valuesOfInnerObj = Object.values(item)
          for (let i = 0; i < valuesOfInnerObj.length; i++) {
            const item = valuesOfInnerObj[i]
            if (item?.toString().toLowerCase().includes(vehicleSearchText.toLowerCase())) {
              quickResult.push(obj)
              break
            }
          }
        }
        else {
          if (item?.toString().toLowerCase().includes(vehicleSearchText.toLowerCase())) {
            quickResult.push(obj)
            break
          }
        }
      }
    })
    setFilteredVehicles(quickResult)
  }, [vehicleSearchText,allVehicles])

  useEffect(() => {
    let tempTotal = 0
    couponsState?.map(item => {
      tempTotal += Number(item.total_gallons)
    })
    setTotalGreaseCollectedOnCoupon(tempTotal)
  }, [couponsState])
  
  useEffect(()=>{
    let tempTotalVehiclesEnteredToday = allVehicles.length
    let tempTotalVehicleDumped = 0
    let tempPendingVehiclesForDumping = 0
    let tempTotalWasteEnteredToday = 0
    let tempTotalForecastedWasteToBeDumped = 0
    let tempTotalDumpedWaste = 0
    allVehicles.map(item=>{
      if(item.current_status === 'Exited'){
        tempTotalVehicleDumped += 1
        tempTotalDumpedWaste += Number(item.total_gallon_dumped)
        tempTotalWasteEnteredToday += tempTotalDumpedWaste
      }
      else if (item.current_status === 'Entered'){
        tempPendingVehiclesForDumping += 1
        tempTotalForecastedWasteToBeDumped += Number(item.total_gallon_collected)
        tempTotalWasteEnteredToday += tempTotalForecastedWasteToBeDumped
      }
    })
    setOperatorDashboardDetails({
      totalVehiclesEnteredToday:tempTotalVehiclesEnteredToday,
      totalVehicleDumped:tempTotalVehicleDumped,
      pendingVehiclesForDumping:tempPendingVehiclesForDumping,
      totalWasteEnteredToday:tempTotalWasteEnteredToday,
      totalForecastedWasteToBeDumped:tempTotalForecastedWasteToBeDumped,
      totalDumpedWaste:tempTotalDumpedWaste
    })

  },[allVehicles])
  return (
    <Provider
      value={{
        allVehicles,
        setAllVehicles,
        selectedVehicle,
        setSelectedVehicle,
        vehicleSearchText,
        setVehicleSearchText,
        filteredVehicles,
        setFilteredVehicles,
        couponsState,
        setCouponsState,
        totalGreaseCollectedOnCoupon, 
        setTotalGreaseCollectedOnCoupon,
        operatorDashboardDetails,
        creditForSelectedGTCC, 
        setCreditForSelectedGTCC,
        selectedVehicleEntryTime, 
        setSelectedVehicleEntryTime
      }}>
      {children}
    </Provider>
  );
};

export { OperatorJobContext, OperatorJobProvider };


// {
//   created_by: authContext.authState.userDetails,
//   scannedTime: moment().format('DD-MM-YYYY HH:mm:ss'),
//   wasteCollected: 1000,
//   name: imageName,
//   url: uri
// }