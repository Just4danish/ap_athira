import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import JobCard from './JobCard';
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
import EmptyJobs from './EmptyJobs';
import {useEffect, useContext} from 'react';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import {DriverJobContext} from '../../context/DriverJobContext';
import {OperatorJobContext} from '../../context/OperatorJobContext';
import {AxiosContext} from '../../context/AxiosContext';
import {AuthContext} from '../../context/AuthContext';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import NavigationContext from '../../context/NavigationContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Colors, globalStyles} from '../styles';
import AbaciModal from '../AbaciModal';

export default function Index() {
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  const [filterModalVisibility, setFilterModalVisibility] = useState(false);
  const {authAxios} = useContext(AxiosContext);
  const authContext = useContext(AuthContext);
  const driverJobContext = useContext(DriverJobContext);
  const operatorJobContext = useContext(OperatorJobContext);
  const isFocused = useIsFocused();
  const navigationContext = useContext(NavigationContext);

  const fetchDriverJobList = () => {
    setBackendLoadingStatus('loading');
    let url = '';
    if (authContext.authState?.userDetails?.user_type === 'Driver') {
      url = '/gtcc_api/driver_service_request_details';
    } else if (authContext.authState?.userDetails?.user_type === 'Operator') {
      url = `/gtcc_api/operator_service_request_details/${operatorJobContext.selectedVehicle.id}`;
    }
    authAxios
      .get(url)
      .then(response => {
        let data = [];
        if (authContext.authState?.userDetails?.user_type === 'Driver') {
          data = response.data;
        } else if (
          authContext.authState?.userDetails?.user_type === 'Operator'
        ) {
          data = response.data.srs;
        }
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
  };
  const navigation = useNavigation();
  const pressHandler = item => {
    navigation.navigate('JobDetailsScreen', {
      jobDetails: item,
    });
    driverJobContext.setSelectedJob(item);
  };
  useEffect(() => {
    if (isFocused) {
      fetchDriverJobList();
      navigationContext.showSideBarSwitch();
      navigationContext.showTabBar();
    }
  }, [isFocused]);
  const filterModalCloser = () => {
    setFilterModalVisibility(false);
  };
  return (
    <>
      <View
        style={{
          height: 80,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}>
        <AbaciModal
          visible={filterModalVisibility}
          onRequestClose={filterModalCloser}
          blurView={false}
          modalCloseButton={false}
          customStyle={{
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 0,
            height: 300,
            width: '100%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 10,
          }}>
          <View
            style={{
              width: '90%',
              height: 25,
              alignItems: 'flex-start',
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text style={globalStyles.h2_bold}>Filter by job type</Text>
          </View>
          {driverJobContext.catagories?.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: '90%',
                height: 45,
                alignItems: 'flex-end',
                alignSelf: 'center',
                padding: 5,
                borderBottomColor: Colors.light_gray,
                borderBottomWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => driverJobContext.setFilteredCategory(item)}>
              <Text
                style={[
                  globalStyles.h2_regular,
                  {textTransform: 'capitalize'},
                ]}>
                {item}{' '}
                {item === 'All'
                  ? `(${driverJobContext.allJobs?.length})`
                  : `(${driverJobContext.categorizedJobs[item]?.length})`}
              </Text>
              {item === driverJobContext.filteredCategory ? (
                <Icon name="filter-check" size={20} color={Colors.gray} />
              ) : null}
            </TouchableOpacity>
          ))}
        </AbaciModal>
        <TouchableOpacity
          style={{
            width: 100,
            height: 40,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 20,
          }}
          onPress={() => setFilterModalVisibility(true)}>
          {driverJobContext.filteredCategory === 'All' ? (
            <Icon name="filter" size={30} color={Colors.white} />
          ) : (
            <>
              <Text style={[globalStyles.h3_bold, {color: Colors.white}]}>
                {driverJobContext.filteredCategory}
              </Text>
              <Icon name="filter-check" size={30} color={Colors.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        onRefresh={fetchDriverJobList}
        refreshing={backendLoadingStatus === 'loading'}
        data={driverJobContext.filteredJobs}
        renderItem={({item, index}) => (
          <Animated.View
            entering={BounceInLeft.delay(index * 50)}
            exiting={FadeOutRight.delay(index * 50)}
            key={index}>
            <Pressable onPress={() => pressHandler(item)}>
              <JobCard item={item} navigation={navigation} />
            </Pressable>
          </Animated.View>
        )}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={<EmptyJobs />}
        ListFooterComponent={<View style={{height: 150}}></View>}
        ListHeaderComponent={<View style={{height: 20}}></View>}
      />
    </>
  );
}
