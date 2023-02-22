import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Touchable, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import Animated, { BounceInLeft, FadeOutRight } from 'react-native-reanimated';
import PieChart from './PieChart';
import LinearGradient from 'react-native-linear-gradient';
import { globalStyles, gradientSets } from '../styles';
import { DriverJobContext } from '../../context/DriverJobContext';
import NavigationContext from '../../context/NavigationContext';

export default function Index() {
    const driverJobContext = useContext(DriverJobContext)
    const [pressedButton,setPressedButton] = useState(null)
    const navigationContext = useContext(NavigationContext)
    // const navigation = useNavigation()
    const [dataForDashboard, setDataForDashboard] = useState({
        assigned_count: 0,
        processing_count: 0,
        completed_count: 0,
        total_count: 0,
    })
    const [graphData, setGraphData] = useState({
        assigned_percent: 0,
        processing_percent: 0,
        completed_percent: 0,
    })
    useEffect(() => {
        const assigned_count = driverJobContext.categorizedJobs?.Assigned.length
        const processing_count = driverJobContext.categorizedJobs?.Processing.length
        const completed_count = driverJobContext.categorizedJobs?.Completed.length
        const total_count = assigned_count + processing_count + completed_count
        setDataForDashboard({
            assigned_count,
            processing_count,
            completed_count,
            total_count,
        })
        setGraphData({
            assigned_percent: assigned_count / total_count * 100,
            processing_percent: processing_count / total_count * 100,
            completed_percent: completed_count / total_count * 100,
        })

    }, [driverJobContext.categorizedJobs])
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const pressHandler = (category) => {
        driverJobContext.setFilteredCategory(category)
        navigationContext.setTabPosition('filter')
        navigationContext.setToggleToMoveTabBarIcon(state => !state)
    }
    return (
        <View style={styles.mainWrapper}>
            <ScrollView style={{ flex: 1 }}>
                <Animated.View
                    entering={BounceInLeft}
                    exiting={FadeOutRight.delay(100)}
                    style={{
                        height: 500, width: 320, backgroundColor: "white", alignSelf: 'center', marginTop: 50, borderRadius: 5,
                        borderWidth: 1,
                        borderColor: "#d4d4d4"
                    }}
                >
                    <View style={{ height: 60, alignContent: 'center', alignItems: 'center', justifyContent: "center" }}>
                        <Text style={globalStyles.h2_bold}>Total Assigned Jobs are {dataForDashboard?.total_count}</Text>
                    </View>
                    <View style={{ height: 235, alignContent: 'center', alignItems: 'center', justifyContent: "center" }}>
                        <PieChart graphData={graphData} />
                    </View>
                    {/* </View> */}
                    <View style={{ height: 180, alignContent: 'center', alignItems: 'center', justifyContent: "center" }}>
                        <TouchableWithoutFeedback style={{ height: 50, width: '100%', margin: 10 }} onPress={()=>pressHandler('Assigned')} onPressIn={()=>setPressedButton('Assigned')} onPressOut={()=>setPressedButton(null)}>
                            <LinearGradient colors={[gradientSets.set3.start, gradientSets.set3.end]}
                                style={{ height: 50, alignContent: 'center', alignItems: 'center', justifyContent: "center", width: '90%', borderRadius: 10, elevation: pressedButton === 'Assigned' ? 2 : 12, marginBottom: 20 }}>
                                <Text style={[globalStyles.h2_dark, { color: "white" }]}>Total Pending Jobs : {dataForDashboard?.assigned_count}</Text>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={{ height: 50, width: '100%', margin: 10 }} onPress={()=>pressHandler('Processing')} onPressIn={()=>setPressedButton('Processing')} onPressOut={()=>setPressedButton(null)}>
                            <LinearGradient colors={[gradientSets.set1.start, gradientSets.set1.end]}
                                style={{ height: 50, alignContent: 'center', alignItems: 'center', justifyContent: "center", width: '90%', borderRadius: 10, elevation: pressedButton === 'Processing' ? 2 : 12, marginBottom: 20 }}>
                                <Text style={[globalStyles.h2_dark, { color: "white" }]}>Total Jobs Under Process : {dataForDashboard?.processing_count}</Text>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback style={{ height: 50, width: '100%', margin: 10 }} onPress={()=>pressHandler('Completed')} onPressIn={()=>setPressedButton('Completed')} onPressOut={()=>setPressedButton(null)}>
                            <LinearGradient colors={[gradientSets.set2.start, gradientSets.set2.end]}
                                style={{ height: 50, alignContent: 'center', alignItems: 'center', justifyContent: "center", width: '90%', borderRadius: 10, elevation: pressedButton === 'Completed' ? 2 : 12, marginBottom: 20 }}>
                                <Text style={[globalStyles.h2_dark, { color: "white" }]}>Total Jobs Completed : {dataForDashboard?.completed_count}</Text>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                    </View>
                </Animated.View>
            </ScrollView>
        </View >
    )
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
        backgroundColor: "white",
        height: '80%',

    },
    JobInfoWrapper: {
        flex: 2,
        backgroundColor: "white",
        padding: 20,
        elevation: 5,
        borderRadius: 5,
        margin: 20,
        // height:"50%"

    }
})

{/* <ScrollView
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




                </Animated.View> */}

          //  </ScrollView> */}