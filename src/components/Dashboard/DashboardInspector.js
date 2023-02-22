import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  BackHandler,
  TouchableWithoutFeedback,
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
import PieChart from './PieChart';
import LinearGradient from 'react-native-linear-gradient';
import {globalStyles, gradientSets} from '../styles';
import {dashboardData} from './tempDashboardData';
import NavigationContext from '../../context/NavigationContext';

export default function Index() {
  const [dataForDashboard, setDataForDashboard] = useState();
  const [graphData, setGraphData] = useState({
    processing_count: 0,
    completed_count: 0,
    partially_completed_count: 0,
  });
  useEffect(() => {
    setDataForDashboard(dashboardData);
  }, [dashboardData]);

  useEffect(() => {
    let tempAssignedCount = dataForDashboard?.assigned_count;
    if (typeof tempAssignedCount !== 'undefined') {
      setGraphData({
        processing_count:
          (dataForDashboard.processing_count / tempAssignedCount) * 100,
        completed_count:
          (dataForDashboard.completed_count / tempAssignedCount) * 100,
        partially_completed_count:
          (dataForDashboard.partially_completed_count / tempAssignedCount) *
          100,
      });
    }
  }, [dataForDashboard]);
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigationContext = useContext(NavigationContext);

  const pressHandler = () => {
    navigationContext.setTabPosition('filter');
    navigationContext.setToggleToMoveTabBarIcon(state => !state);
  };

  const backHandler = () => {
    // setScanningInProcess(false);
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
      <ScrollView style={{flex: 1}}>
        <Animated.View
          entering={BounceInLeft}
          exiting={FadeOutRight.delay(100)}
          style={{
            height: windowHeight * 0.6,
            width: windowWidth * 0.8,
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#d4d4d4',
          }}>
          <View
            style={{
              height: windowHeight * 0.6 * 0.1,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={globalStyles.h2_bold}>
              Total Assigned Jobs are {dataForDashboard?.assigned_count}
            </Text>
          </View>
          {/* <View style={{ flex: 4 }}> */}
          <View
            style={{
              height: windowHeight * 0.6 * 0.5,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <PieChart graphData={graphData} />
          </View>
          {/* </View> */}
          <View
            style={{
              height: windowHeight * 0.6 * 0.4,
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
                  height: windowHeight * 0.6 * 0.4 * 0.25,
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
                  Total Jobs Under Process :{' '}
                  {dataForDashboard?.processing_count}
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pressHandler}>
              <LinearGradient
                colors={[gradientSets.set2.start, gradientSets.set2.end]}
                style={{
                  height: windowHeight * 0.6 * 0.4 * 0.25,
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
                  Total Jobs Completed : {dataForDashboard?.completed_count}
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={pressHandler}>
              <LinearGradient
                colors={[gradientSets.set3.start, gradientSets.set3.end]}
                style={{
                  height: windowHeight * 0.6 * 0.4 * 0.25,
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
                  Total Jobs Completed Partially :{' '}
                  {dataForDashboard?.partially_completed_count}
                </Text>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>

        {/* <Animated.View
                    entering={BounceInLeft}
                    exiting={FadeOutRight.delay(100)}
                    style={{
                        height: windowHeight * .4, width: windowWidth * .8, backgroundColor: "white", alignSelf: 'center', marginTop: 50, borderRadius: 5,
                        borderWidth: 1,
                        borderColor: "#d4d4d4"
                    }}
                >


                </Animated.View> */}
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
