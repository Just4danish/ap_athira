import { View, Text, Linking,PermissionsAndroid } from 'react-native'
import { Camera } from 'react-native-vision-camera'
import React, { useState, useEffect, useCallback } from 'react'
import { globalStyles } from './styles'
import LargeButton from './Buttons/LargeButton'
import LocationPermissionLottie from './LocationPermissionLottie'

export default function LocationPermissionCheckWrapper({ children }) {
  const [granted, setGranted] = useState('loading')
  useEffect(() => {
    requestPermission()
  }, []);

  const requestPermission = useCallback(
    async () => {
      const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      setGranted(permission)
    }, []
  )

  const pressHandler = async () => {
    await Linking.openSettings()
  }
  if (granted === 'granted') {
    return (
      <>
        {children}
      </>
    )
  }
  else if(granted === 'never_ask_again') {
    return (<View style={{ flex: 1 }}>
      <LocationPermissionLottie />
      <View style={{
        position: 'absolute',
        bottom: 200,
        alignSelf: 'center'
      }}>
        <Text style={globalStyles.h2_bold}>
          Enable Location Access
        </Text>
        <Text style={globalStyles.h2_bold}>
          Please provide us access to your location, which is required to locate the restaurent.
        </Text>
        <LargeButton label='Go to settings' onPress={pressHandler} />
      </View>
    </View>)
  }
}






// export default function LocationPermissionCheckWrapper({children}) {
//     const [granted, setGranted] = useState(false)
//     useEffect(() => {
//         PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//         )
//           .then(granted => {

//             setGranted(granted);
//           })
//           .catch(err => {
//           });
//       }, []);
//       if (granted){
//         return (
//             <>
//               {children}
//             </>
//         )
//       }
// else{
//     return null
// }
// }