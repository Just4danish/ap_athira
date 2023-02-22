import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import VehicleCard from './VehicleCard';
import {tempJobs} from './tempJobLists';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  color,
  Easing,
  withTiming,
  SlideInRight,
  BounceInRight,
  BounceInLeft,
  FadeOutRight,
} from 'react-native-reanimated';
import EmptyVehicles from './EmptyVehicles';
import {useEffect, useContext} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
// import {setJob} from '../../../store/jobSlice'
import {OperatorJobContext} from '../../context/OperatorJobContext';
import {AxiosContext} from '../../context/AxiosContext';
import {ToastContext} from '../../context/ToastContext';

export default function Index() {
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  // const [list, setList] = useState(tempJobs)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const operatorJobContext = useContext(OperatorJobContext);
  const {authAxios} = useContext(AxiosContext);
  const toastContext = useContext(ToastContext);

  const isFocused = useIsFocused();

  const fetchVehcileList = () => {
    setBackendLoadingStatus('loading');
    const url = `/gtcc_api/vehiclelist_operator`;
    authAxios
      .get(url)
      .then(response => {
        operatorJobContext.setAllVehicles(response.data);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        toastContext.showToast(
          'Error in fetching data, please check your connection!',
          'short',
          'error',
        );
        setBackendLoadingStatus('error');
      });
  };
  const pressHandler = item => {
    navigation.navigate('VehicleDetailsScreen', {
      vehicleDetails: item,
    });
    operatorJobContext.setSelectedVehicle(item);
    // dispatch(setJob(item))
  };

  useEffect(() => {
    if (isFocused) {
      fetchVehcileList();
    }
  }, [isFocused]);

  return (
    // <View style={styles.mainWrapper}>
    <FlatList
      onRefresh={fetchVehcileList}
      data={operatorJobContext.filteredVehicles}
      refreshing={backendLoadingStatus === 'loading'}
      renderItem={({item, index}) => (
        <Animated.View
          entering={BounceInLeft.delay(index * 50)}
          exiting={FadeOutRight.delay(index * 50)}
          key={index}>
          <Pressable onPress={() => pressHandler(item)}>
            <VehicleCard item={item} />
          </Pressable>
        </Animated.View>
      )}
      keyExtractor={(item, index) => index}
      ListEmptyComponent={<EmptyVehicles />}
      ListFooterComponent={<View style={{height: 150}}></View>}
      ListHeaderComponent={<View style={{height: 100}}></View>}
    />
    // </View >
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    // backgroundColor:"red"
  },
});
