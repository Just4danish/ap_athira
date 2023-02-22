import { View, Text } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import Timeline from 'react-native-timeline-flatlist'
import { DriverJobContext } from '../context/DriverJobContext'
import { useIsFocused } from '@react-navigation/native';
import { tempJobs } from '../components/Jobs/tempJobLists';

export default function TimeLine() {
    const isFocused = useIsFocused()
    const [timeLineData, setTimeLineData] = useState([])
    const driverJobContext = useContext(DriverJobContext)

    useEffect(() => {
        let tempTimeLine = []
        if (isFocused) {
            if (typeof(driverJobContext.selectedJob?.logs) !== 'undefined'){
                const logs = driverJobContext.selectedJob?.logs
                setTimeLineData(logs)
            }
        }
        else {
        }
        return (() => {
        })
    }, [isFocused,driverJobContext])





    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "white", justifyContent: 'center', padding: 20, paddingTop: 40, }}>
            <Timeline
                data={timeLineData}
                circleSize={20}
                circleColor='rgb(45,156,219)'
                lineColor='rgb(45,156,219)'
                // timeContainerStyle={{minWidth:52, marginTop: -5}}
                // timeStyle={{ textAlign: 'center', backgroundColor: '#4e7e69', color: 'white', padding: 5, borderRadius: 5 }}
                descriptionStyle={{ color: 'gray' }}
                titleStyle={{ color: 'gray' }}
                isUsingFlatlist={true}
                innerCircle={'dot'}
            />
        </View>
    )
}