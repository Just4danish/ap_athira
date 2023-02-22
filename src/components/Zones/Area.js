import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import AreaCard from './AreaCard';
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
import ScreenWrapper from '../ScreenWrapper';
import {globalStyles} from '../styles';
import EmptyAreas from './EmptyAreas';

export default function Area({navigation, route}) {
  const [backendLoadingStatus, setBackendLoadingStatus] = useState('success');
  // const [list, setList] = useState(tempJobs)
  const dispatch = useDispatch();
  const inspectorJobContext = useContext(InspectorJobContext);
  const {authAxios} = useContext(AxiosContext);

  const isFocused = useIsFocused();

  const fetchAreaList = id => {
    setBackendLoadingStatus('loading');
    const url = `/inspector_api/area/${id}`;
    authAxios
      .get(url)
      .then(response => {
        inspectorJobContext.setAllAreaForSelectedZone(response.data);
        setBackendLoadingStatus('success');
      })
      .catch(error => {
        setBackendLoadingStatus('error');
      });
  };
  const pressHandler = item => {
    navigation.navigate('SubArea', {
      subAreaId: item.id,
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchAreaList(route.params?.areaId);
    }
  }, [isFocused]);

  return (
    <ScreenWrapper navigationShow={false} sideBarShow={false}>
      <View style={{flex: 1}}>
        <Text
          style={[
            globalStyles.h1_bold,
            {color: 'white', margin: 10, marginTop: 50},
          ]}>
          Areas
        </Text>
        <FlatList
          onRefresh={fetchAreaList}
          data={inspectorJobContext.allAreaForSelectedZone}
          refreshing={backendLoadingStatus === 'loading'}
          renderItem={({item, index}) => (
            <Animated.View
              entering={BounceInLeft.delay(index * 50)}
              exiting={FadeOutRight.delay(index * 50)}
              key={index}>
              <Pressable onPress={() => pressHandler(item)}>
                <AreaCard item={item} />
              </Pressable>
            </Animated.View>
          )}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={<EmptyAreas />}
          ListFooterComponent={<View style={{height: 150}}></View>}
          ListHeaderComponent={<View style={{height: 20}}></View>}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    // backgroundColor:"red"
  },
});
