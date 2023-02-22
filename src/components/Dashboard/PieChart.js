import { View, Text } from 'react-native'
import React, {useState, useEffect} from 'react'
import CircularProgress, { CircularProgressBase } from 'react-native-circular-progress-indicator';
import { gradientSets } from '../styles';

export default function PieChart({graphData}) {
  const [colors, setColors] = useState(gradientSets)
  const props = {
    activeStrokeWidth: 25,
    inActiveStrokeWidth: 25,
    inActiveStrokeOpacity: 0.2
  };
  useEffect(() => {
    setColors(gradientSets)
  }, [gradientSets])
  

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <CircularProgressBase
        {...props}
        value={graphData.processing_percent}
        radius={100}
        activeStrokeColor={gradientSets.set1.start}
        activeStrokeSecondaryColor={gradientSets.set1.end}
        inActiveStrokeColor={'#e84118'}
        duration={1000}
        activeStrokeWidth={20}
        inActiveStrokeWidth={15}
      >
        <CircularProgressBase
          {...props}
          value={graphData.completed_percent}
          radius={75}
          activeStrokeColor={gradientSets.set2.start}
          activeStrokeSecondaryColor={gradientSets.set2.end}
          inActiveStrokeColor={'#badc58'}
          duration={1000}
          activeStrokeWidth={20}
          inActiveStrokeWidth={15}
        >
          <CircularProgressBase
            {...props}
            value={graphData.completed_percent}
            radius={50}
            activeStrokeColor={gradientSets.set3.start}
            activeStrokeSecondaryColor={gradientSets.set3.end}
            inActiveStrokeColor={'#18dcff'}
            duration={1000}
            activeStrokeWidth={20}
            inActiveStrokeWidth={15}
          />
        </CircularProgressBase>
      </CircularProgressBase>
    </View>
  )
}