import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableWithoutFeedback,
  Touchable,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
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
import PieChartVehicles from './PieChartVehicles';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyles, gradientSets} from '../styles';
import {dashboardData} from './tempDashboardData';
import {OperatorJobContext} from '../../context/OperatorJobContext';
import moment from 'moment/moment';
import NavigationContext from '../../context/NavigationContext';
import {useNavigation} from '@react-navigation/native';

export default function Index() {
  const operatorJobContext = useContext(OperatorJobContext);
  const navigationContext = useContext(NavigationContext);
  const [dataForDashboard, setDataForDashboard] = useState();
  const [vehicleGraphData, setVehicleGraphData] = useState({
    dumped: 0,
    pending: 0,
  });
  const [greaseGraphData, setGreaseGraphData] = useState({
    dumped: 0,
    pending: 0,
  });

  useEffect(() => {
    setDataForDashboard(dashboardData);
  }, [dashboardData]);

  useEffect(() => {
    let tempAssignedCount = dataForDashboard?.assigned_count;
    if (typeof tempAssignedCount !== 'undefined') {
      setVehicleGraphData({
        dumped:
          (operatorJobContext.operatorDashboardDetails?.totalVehicleDumped /
            operatorJobContext.operatorDashboardDetails
              ?.totalVehiclesEnteredToday) *
          100,
        pending:
          (operatorJobContext.operatorDashboardDetails
            ?.pendingVehiclesForDumping /
            operatorJobContext.operatorDashboardDetails
              ?.totalVehiclesEnteredToday) *
          100,
      });
      setGreaseGraphData({
        dumped:
          (operatorJobContext.operatorDashboardDetails?.totalDumpedWaste /
            operatorJobContext.operatorDashboardDetails
              ?.totalWasteEnteredToday) *
          100,
        pending:
          (operatorJobContext.operatorDashboardDetails
            ?.totalForecastedWasteToBeDumped /
            operatorJobContext.operatorDashboardDetails
              ?.totalWasteEnteredToday) *
          100,
      });
    }
  }, [dataForDashboard]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const pressHandler = () => {
    navigationContext.setTabPosition('filter');
    navigationContext.setToggleToMoveTabBarIcon(state => !state);
  };

  const backHandler = () => {
    Alert.alert('Hold on!', 'Do you want to exit the app?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          BackHandler.exitApp();
        },
      },
    ]);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backHandler);
    };
  }, []);

  return (
    <View style={styles.mainWrapper}>
      <ScrollView>
        <Animated.View
          entering={BounceInLeft}
          exiting={FadeOutRight.delay(100)}
          style={{
            height: 450,
            width: '80%',
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#d4d4d4',
          }}>
          <View
            style={{
              height: 80,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={globalStyles.h2_bold}>
              Date: {moment().format('D MMM, YYYY')}
            </Text>
            <Text style={globalStyles.h3_bold}>
              Total Vehicles entered:{' '}
              {
                operatorJobContext.operatorDashboardDetails
                  ?.totalVehiclesEnteredToday
              }
            </Text>
          </View>
          <View
            style={{
              height: 200,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <PieChartVehicles graphData={vehicleGraphData} />
          </View>
          {/* </View> */}
          <View
            style={{
              height: 200,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -10,
            }}>
            <TouchableWithoutFeedback onPress={pressHandler}>
              <LinearGradient
                colors={[gradientSets.set1.start, gradientSets.set1.end]}
                style={{
                  opacity: 50,
                  height: 50,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '90%',
                  borderRadius: 10,
                  elevation: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    globalStyles.h2_bold,
                    {color: 'white', fontSize: 12},
                  ]}>
                  Total Vehicles Dumped :{' '}
                  {
                    operatorJobContext.operatorDashboardDetails
                      ?.totalVehicleDumped
                  }
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pressHandler}>
              <LinearGradient
                colors={[gradientSets.set2.start, gradientSets.set2.end]}
                style={{
                  height: 50,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '90%',
                  borderRadius: 10,
                  elevation: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    globalStyles.h2_bold,
                    {color: 'white', fontSize: 12},
                  ]}>
                  Pending Vehicles for Dumping :{' '}
                  {
                    operatorJobContext.operatorDashboardDetails
                      ?.pendingVehiclesForDumping
                  }
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>

        <Animated.View
          entering={BounceInLeft}
          exiting={FadeOutRight.delay(100)}
          style={{
            height: 460,
            width: '80%',
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#d4d4d4',
          }}>
          <View
            style={{
              height: 60,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={globalStyles.h3_bold}>
              Total Grease Quantity{' '}
              {operatorJobContext.operatorDashboardDetails?.totalDumpedWaste +
                operatorJobContext.operatorDashboardDetails
                  ?.totalForecastedWasteToBeDumped}{' '}
              gal
            </Text>
          </View>
          {/* <View style={{ flex: 4 }}> */}
          <View
            style={{
              height: 200,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <PieChartVehicles graphData={greaseGraphData} />
          </View>
          {/* </View> */}
          <View
            style={{
              height: 200,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -10,
            }}>
            <TouchableWithoutFeedback onPress={pressHandler}>
              <LinearGradient
                colors={[gradientSets.set1.start, gradientSets.set1.end]}
                style={{
                  opacity: 50,
                  height: 50,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '90%',
                  borderRadius: 10,
                  elevation: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    globalStyles.h2_bold,
                    {color: 'white', fontSize: 12},
                  ]}>
                  Total Grease Dumped :{' '}
                  {
                    operatorJobContext.operatorDashboardDetails
                      ?.totalDumpedWaste
                  }
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pressHandler}>
              <LinearGradient
                colors={[gradientSets.set2.start, gradientSets.set2.end]}
                style={{
                  height: 50,
                  alignContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '90%',
                  borderRadius: 10,
                  elevation: 10,
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    globalStyles.h2_bold,
                    {color: 'white', fontSize: 12},
                  ]}>
                  Forecasted Grease to be Dumped :{' '}
                  {
                    operatorJobContext.operatorDashboardDetails
                      ?.totalForecastedWasteToBeDumped
                  }
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
        <View style={{height: 200}}></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    height: '100%',
    paddingTop: 30,
  },
  graphInfoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
    height: '80%',
  },
  JobInfoWrapper: {
    flex: 2,
    backgroundColor: 'white',
    padding: 20,
    elevation: 5,
    borderRadius: 5,
    margin: 20,
    // height:"50%"
  },
});

{
  /* <ScrollView
            // alwaysBounceHorizontal = {true}
            // alwaysBounceVertical  = {true}
            >
                <Animated.View
                    entering={BounceInLeft}
                    exiting={FadeOutRight.delay(100)}
                    style={[styles.graphInfoWrapper]}
                >
                    <View style={{ flex: 2 }}>
                        <Text style={globalStyles.h2_bold}>Total Assigned Jobs are {dataForDashboard?.assigned_count}</Text>
                    </View>
                    <View style={{ flex: 4 }}>
                        <PieChart graphData={graphData} />
                    </View>
                    <View
                        style={{
                            flex: 4
                        }}>

                        <LinearGradient colors={[gradientSets.set1.start, gradientSets.set1.end]}
                            style={{ width: '90%', height: '10%', borderRadius: 5, elevation: 10, alignSelf: 'center' }}>
                            <Text>Total Jobs Under Process : {dataForDashboard?.processing_count}</Text>
                        </LinearGradient>
                        <LinearGradient colors={[gradientSets.set2.start, gradientSets.set2.end]}
                            style={{ width: '90%', height: '10%', borderRadius: 5, elevation: 10, alignSelf: 'center' }}>
                            <Text>Total Jobs Completed : {dataForDashboard?.completed_count}</Text>
                        </LinearGradient>
                        <LinearGradient colors={[gradientSets.set3.start, gradientSets.set3.end]}
                            style={{ width: '90%', height: '10%', borderRadius: 5, elevation: 10, alignSelf: 'center' }}>
                            <Text>Total Jobs Complteted Partially : {dataForDashboard?.partially_completed_count}</Text>
                        </LinearGradient>
                    </View>

                </Animated.View>
                {/* <Animated.View
                    entering={BounceInLeft}
                    exiting={FadeOutRight.delay(100)} style={[styles.JobInfoWrapper]}>




                </Animated.View> */
}

//  </ScrollView> */}
