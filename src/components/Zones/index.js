import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import ZoneCard from './ZoneCard';
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
import EmptyZones from './EmptyZones';
import {useEffect, useContext} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
// import {setJob} from '../../../store/jobSlice'
import {InspectorJobContext} from '../../context/InspectorJobContext';
import {AxiosContext} from '../../context/AxiosContext';
import {globalStyles} from '../styles';

export default function Index() {
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  // const [list, setList] = useState(tempJobs)
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inspectorJobContext = useContext(InspectorJobContext);
  const {authAxios} = useContext(AxiosContext);

  const isFocused = useIsFocused();

  const fetchZoneList = () => {
    setBackendLoadingStatus('loading');
    const url = `/inspector_api/zone`;
    authAxios
      .get(url)
      .then(response => {
        inspectorJobContext.setAllZones(response.data);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
  };
  const pressHandler = item => {
    navigation.navigate('Area', {
      areaId: item.id,
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchZoneList();
    }
  }, [isFocused]);

  return (
    <View style={{flex: 1}}>
      <Text
        style={[
          globalStyles.h1_bold,
          {color: 'white', margin: 10, marginTop: 50},
        ]}>
        Zones
      </Text>
      <FlatList
        onRefresh={fetchZoneList}
        data={inspectorJobContext.filteredZones}
        refreshing={backendLoadingStatus === 'loading'}
        renderItem={({item, index}) => (
          <Animated.View
            entering={BounceInLeft.delay(index * 50)}
            exiting={FadeOutRight.delay(index * 50)}
            key={index}>
            <Pressable onPress={() => pressHandler(item)}>
              <ZoneCard item={item} />
            </Pressable>
          </Animated.View>
        )}
        keyExtractor={(item, index) => index}
        ListEmptyComponent={<EmptyZones />}
        ListFooterComponent={<View style={{height: 100}}></View>}
        ListHeaderComponent={<View style={{height: 20}}></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    // backgroundColor:"red"
  },
});
